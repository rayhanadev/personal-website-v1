let text = `
/*
 * Hello world...
 */
	  
/*
 * The name's Ray!
 * Just a Frontend Developer...
 */
 
html, body { 
  margin: 0px; 
  height: 100%; 
}

/*
 * Here's a pre element!
 */
 
pre {
  overflow: auto;
  overflow-wrap: break-word;
  word-wrap: break-word;
  width: 100%;
  top: 10px;
  bottom: 10px;
  left: 0%;
  position: fixed;
  padding: 10px;
}

/*
 * This code is injected in
 * real time in a style
 * tag and the pre
 * element you are seeing!
 *
 * Pretty kewl right?
 */
 
/*
 * Just watch my site code itself!
 */
 
/*
 * First, lets add some colors.
 * I LOVE colors!!!
 */
 
body {
  background-color: #073642;
  color: #FDF6E3;
}

/*
 * Now, lets move this code to center!
 */
 
pre {
  transition: all 500ms;
  width: 75%;
  left: 12.5%;
  box-sizing: border-box;
  font-family: consolas, monospace;
}

/*
 * More colors!!!
 */
 
pre { 
  background-color: #002B36; 
}

.comment {
  font-style: italic;
  color: #657B83;
}

.selector { 
  color: #859900; 
}

.property { 
  color: #268BD2; 
}

.value { 
  color: #B58900; 
}

/*
 * Lets add a caret!
 * (Not the veggie, the cursor -_-)
 */

.lastline::after {
  display: inline-block;
  position: relative;
  top: 5px;
  height: 20px;
  border-left: 1px solid #6C71C4;
  -webkit-animation: 1s caret linear Infinite;
          animation: 1s caret linear Infinite;
}

/*
 * Animating it...
 */
 
@-webkit-keyframes caret {
  0% { visibility: inherit; }
  50%, 100% { visibility: hidden; }
}

@keyframes caret {
  0% { visibility: inherit; }
  50%, 100% { visibility: hidden; }
}

/*
 * Finally, let's add it in!
 */
 
.lastline::after {
  content: ' ';
}

/*
 * Now, wanna see some magic?
 *
 * Lets move this to a side!
 */

pre { 
  left: 50%;
  width: 48%
}

.hidden {
  overflow: auto;
  transition: all 500ms;
  display: block;
  position: fixed;
  top: 5%;
  left: 10px;
  max-width: 48%;
  width: 150vh;
  height: 90%;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: transparent;
  border: 4px solid #C8C8C8;
  padding: 10px;
  color: #FDF6E3;
  font-family: consolas, monospace;
}

.hiddenimg {
  transition: all 500ms;
  display: block;
}

/*
 * Tada, that's it!
 * This genius idea was
 * created by Jake Albaugh
 * and adapted to Javascript
 * by yours truly!
 */
 `;

let activeChar = 0;
let lineText = '';
let comment = false;
let openStyle = false;
let lineOpenStyle = false;
let spanText = '';

document.body.innerHTML += `<pre id="target">
  <span class="lastline"></span>
</pre>
<style id="styleSheet"></style>`;

let target = document.getElementById('target');
let styleSheet = document.getElementById('styleSheet');
styleSheet.innerHTML = `.hidden {
  display: none;
}
`

setInterval(function() {
	if (text.length > activeChar) {
		styleSheet.innerHTML += text.charAt(activeChar);

		window.scrollTo(0, target.scrollHeight);
		target.scrollTo(0, target.scrollHeight);

		if (text.charAt(activeChar) == '\n') {
			target.children[target.children.length - 1].innerHTML += '<br>';
			lineText = '';
			document.querySelector('span.lastline').className = '';
			target.innerHTML += '<span class="lastline"></span>';
			lineOpenStyle = false;
		} else {
			lineText += text.charAt(activeChar);
		}

		if (comment) {
			spanText = '<span class="comment">';
		} else if (openStyle) {
			if (lineOpenStyle) {
				spanText = '<span class="selector">';
			} else {
				spanText = '<span class="property">';
			}
		} else {
			spanText = '<span class="selector">';
		}

		for (var i = 0; i < lineText.length; i++) {
			switch (lineText.charAt(i)) {
				case '/':
					if (i + 1 < lineText.length && lineText.charAt(i + 1) == '*') {
						spanText += '</span><span class="comment">/*';
						comment = true;
						i++;
					} else {
						spanText += '/';
					}
					break;
				case '*':
					if (i + 1 < lineText.length && lineText.charAt(i + 1) == '/') {
						spanText += '*/</span><span class="selector">';
						i++;
						comment = false;
					} else {
						spanText += '*';
					}
					break;
				case '{':
					if (!comment) {
						spanText += '</span>{<span class="property">';
						openStyle = true;
						lineOpenStyle = true;
					} else {
						spanText += '{';
					}
					break;
				case '}':
					if (!comment) {
						spanText += '</span>}<span class=selector>';
						openStyle = false;
					}
					break;
				case ':':
					if (!comment && openStyle) {
						spanText += '</span>:<span class="value">';
					} else {
						spanText += ':';
					}
					break;
				case ';':
					if (!comment && openStyle) {
						spanText += '</span>;<span class="property">';
					} else {
						spanText += ';';
					}
					break;
				default:
					spanText += lineText.charAt(i);
			}
		}
		spanText += '</span>';
		target.children[target.children.length - 1].innerHTML = spanText;
		activeChar++;
	}
}, 40);
