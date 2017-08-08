const launchChrome = require('@serverless-chrome/lambda');
const Chromeless = require('chromeless').Chromeless;
const fs = require('fs');
var chromeInstance = null;

function reloadChrome() {
	if (chromeInstance) {
		var logs = fs.readFileSync(chromeInstance.log).toString();
		var errorLogs = fs.readFileSync(chromeInstance.errorLog).toString();

		console.log(`Killing chrome: ${JSON.stringify(chromeInstance)}\nLogs: ${logs}\nError Logs: ${errorLogs}`);
		chromeInstance.kill();
	}
	return Promise.resolve().then(() => {
		return launchChrome({
			flags: ['--window-size=1200,800', '--disable-gpu', '--headless']
		}).then(function(chrome) {
			chromeInstance = chrome;
			return chrome;
		});
	});
}
console.log('Starting up function');
reloadChrome();

function waitForChrome() {
	return new Promise((resolve, reject) => {
		if (chromeInstance) {
			console.log('Found chrome');
			return resolve(chromeInstance);
		}
		console.log('Waiting');
		setTimeout(() => {
			resolve(Promise.resolve().then(waitForChrome));
		}, 100);
	});
}

function getUrlFn(url) {
	return function(chrome) {
		const chromeless = new Chromeless({
			launchChrome: false
		});
		return chromeless
			.goto(url)
			.evaluate(function() {
				return document.title;
			})
			.end();
	};
}

module.exports.handler = (ev, ctx, cb) => {
	const url = ev.url;
	console.log('Getting url', url);
	return waitForChrome()
		.then(getUrlFn(url))
		.then(result => {
			console.log(result);
			ctx.succeed({ url: url, result: result });
		})
		.catch(e => {
			console.log(e);
			return reloadChrome().then(() => module.exports.handler(ev, ctx, cb));
		});
};
