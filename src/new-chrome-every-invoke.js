const launchChrome = require('@serverless-chrome/lambda');
const Chromeless = require('chromeless').Chromeless;
var chromeInstance = null;

launchChrome({
	flags: ['--window-size=1200,800', '--disable-gpu', '--headless']
}).then(function(chrome) {
	chromeInstance = chrome;
});

function waitForChrome() {
	return new Promise((resolve, reject) => {
		if (chromeInstance) {
			return resolve(chromeInstance);
		}
		console.log('Waiting');
		setTimeout(() => {
			resolve(Promise.resolve().then(waitForChrome));
		}, 100);
	});
}

module.exports.handler = (ev, ctx, cb) => {
	const url = ev.url;
	console.log('Getting url', url);
	waitForChrome()
		.then(chrome => {
			console.log('Chrome debuggable on port: ' + chrome.port);
			const chromeless = new Chromeless({
				launchChrome: false
			});

			return chromeless
				.goto(url)
				.evaluate(function() {
					return document.title;
				})
				.end()
				.then(result => {
					console.log(result);
					cb(null, { url: url, result: result });
				});
		})
		.catch(cb);
};
