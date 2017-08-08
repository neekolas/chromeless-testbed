const launchChrome = require('@serverless-chrome/lambda');
const Chromeless = require('chromeless').Chromeless;
var chromeInstance = null;

function reloadChrome() {
	var prom = Promise.resolve();
	if (chromeInstance) {
		prom = chromeInstance.kill();
	}
	return prom.then(() => {
		launchChrome({
			flags: ['--window-size=1200,800', '--disable-gpu', '--headless']
		}).then(function(chrome) {
			chromeInstance = chrome;
		});
	});
}

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
			const chromeless = new Chromeless({
				launchChrome: false
			});
			console.log('Chrome debuggable on port: ' + chrome.port);

			return chromeless
				.goto(url)
				.catch(e => {
					console.log(e);
					return reloadChrome().then(() => chromeless.goto(url));
				})
				.evaluate(function() {
					return document.title;
				})
				.end()
				.then(result => {
					console.log(result);
					ctx.succeed({ url: url, result: result });
				});
		})
		.catch(ctx.fail);
};
