const express = require('express');
const app = express();
const ejs = require('ejs');

const repl = require('replapi-it');

const _debug = false;
const _port = 3000;

let user = new repl.User('RayhanADev');

let data;

setInterval(async function() {
  try {
    let profile = await user.profileData();
    console.log('[DEBUG] ~ Got Profile Data');
    
    let posts = await user.postData('', 10000);
    posts = posts.length;
    console.log('[DEBUG] ~ Got Post Data');
    
    let comments = await user.commentData('', 10000);
    comments = comments.length;
    console.log('[DEBUG] ~ Got Comment Data');
    
    data = { profile: profile, posts: posts, comments: comments };
  } catch(err) {
    console.log('[ERROR] ~ Fetching Profile Data')
  }
}, 1000 * 10);

app.use(express.static('views'));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	if (data == undefined) res.redirect('/error/dataless');
	if (data.profile == undefined) res.redirect('/error/dataless');
	if (data.posts == undefined) res.redirect('/error/dataless');
	if (data.comments == undefined) res.redirect('/error/dataless');

	if (_debug) console.log('[DEBUG] ~ Viewed Page (Main)');
	res.render('index', { data: data });
});

app.get('/error/:error', (req, res) => {
	let error;
	if (req.params.error == 'dataless') {
		error = {
			title: 'No Data',
			msg: "We haven't gotten my data queried. Oops! Check back in a couple of minutes"
		};
	} else {
		res.redirect('/404');
	}

	res.render('error', { error: error });
});

app.use((req, res) => {
	res.status('404');
	res.render('404');
});

app.listen(_port, () => {
	console.log(`[SERVER] ~ Server listening on Port: ${_port}`);
});
