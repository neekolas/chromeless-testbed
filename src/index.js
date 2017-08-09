const launchChrome = require('@serverless-chrome/lambda');
const Chromeless = require('chromeless').Chromeless;
const fs = require('fs');

let chromeInstance = null;

function reloadChrome() {
	if (chromeInstance) {
		const logs = fs.readFileSync(chromeInstance.log).toString();
		const errorLogs = fs.readFileSync(chromeInstance.errorLog).toString();

		console.log(`Killing chrome: ${JSON.stringify(chromeInstance)}\nLogs: ${logs}\nError Logs: ${errorLogs}`);
		chromeInstance.kill();
	}
	return Promise.resolve(chromeInstance);
}

function getUrlFn(url) {
	return function getChrome(chrome) {
		chromeInstance = chrome;

		const chromeless = new Chromeless({
			launchChrome: false,
		});
		return chromeless.goto(url).evaluate(() => document.title).end();
	};
}

module.exports.handler = (ev, ctx, cb) => {
	const url = ev.url;
	ctx.callbackWaitsForEmptyEventLoop = false;
	console.log('Getting url', url);
	return launchChrome({
		flags: [
			'--window-size=1200,800',
			'--disable-gpu',
			'--headless',
			'--no-zygote',
			'--single-process',
			'--no-sandbox',
		],
	})
		.then(getUrlFn(url))
		.then(result => {
			console.log(result);
			cb(null, { url, result });
		})
		.catch(e => {
			console.log(e);
			return reloadChrome().then(() => module.exports.handler(ev, ctx, cb)).catch(ctx.fail);
		});
};
