const express = require('express');
const app = express();
const ejs = require('ejs');

const repl = require('replapi-it');

const fs = require('fs');

const fetch = require('node-fetch');

const _debug = false;
const _port = 3000;

const _fetchrate = 5;

const _server = true;

let user = new repl.User('RayhanADev');

let data = {
	profile: JSON.parse(fs.readFileSync('backups/profilebackup.txt')),
	posts: JSON.parse(fs.readFileSync('backups/postbackup.txt')),
	comments: JSON.parse(fs.readFileSync('backups/commentbackup.txt')),
	github: JSON.parse(fs.readFileSync('backups/githubbackup.txt'))
};

setInterval(async function() {
	try {
		let profile = await user.profileData();
		console.log('[DEBUG] ~ Got Profile Data');
		fs.writeFileSync('backups/profilebackup.txt', JSON.stringify(profile));

		let posts = await user.postData('', 10000);
		posts = { posts: posts.length };
		console.log('[DEBUG] ~ Got Post Data');
		fs.writeFileSync('backups/postbackup.txt', JSON.stringify(posts));

		let comments = await user.commentData('', 10000);
		comments = { comments: comments.length };
		console.log('[DEBUG] ~ Got Comment Data');
		fs.writeFileSync('backups/commentbackup.txt', JSON.stringify(comments));

		let github = await fetch('https://api.github.com/users/rayhanadev', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Connection: 'keep-alive',
				'X-Requested-With': 'https://ray.is-a.dev'
			}
		}).then(res => res.json());
		fs.writeFileSync('backups/githubbackup.txt', JSON.stringify(github));

		data = {
			profile: profile,
			posts: posts,
			comments: comments,
			github: github
		};
	} catch (err) {
		console.log('[ERROR] ~ Fetching Profile Data, using backup!');
		console.log(err.message);

		data = {
			profile: JSON.parse(fs.readFileSync('backups/profilebackup.txt')),
			posts: JSON.parse(fs.readFileSync('backups/postbackup.txt')),
			comments: JSON.parse(fs.readFileSync('backups/commentbackup.txt')),
			github: JSON.parse(fs.readFileSync('backups/githubbackup.txt'))
		};
	}
}, 60000 * _fetchrate);

if (_server) {
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
				msg:
					"We haven't gotten my data queried. Oops! Check back in a couple of minutes"
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
}
