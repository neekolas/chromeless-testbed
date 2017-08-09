const launchChrome = require('@serverless-chrome/lambda');
const Chromeless = require('chromeless').Chromeless;
const fs = require('fs');

let chromeInstance = null;

console.log('Starting lambda');
function reloadChrome() {
	if (chromeInstance) {
		const logs = fs.readFileSync(chromeInstance.log).toString();
		const errorLogs = fs.readFileSync(chromeInstance.errorLog).toString();

		console.log(`Killing chrome: ${JSON.stringify(chromeInstance)}\nLogs: ${logs}\nError Logs: ${errorLogs}`);
		chromeInstance.kill();
	}
	return Promise.resolve(chromeInstance);
}

function logChrome() {
	const logs = fs.readFileSync(chromeInstance.log).toString();
	const errorLogs = fs.readFileSync(chromeInstance.errorLog).toString();
	// fs.writeFileSync(chromeInstance.log, '');
	// fs.writeFileSync(chromeInstance.errorLog, '');
	console.log(`Chrome Logs: ${JSON.stringify(chromeInstance)}\nLogs: ${logs}\nError Logs: ${errorLogs}`);
}

function getUrl(url) {
	const chromeless = new Chromeless({
		launchChrome: false
	});
	return chromeless.goto(url).evaluate(() => document.title).end();
}

const handler = (module.exports.handler = url => {
	console.log('Getting url', url);
	return getUrl(url)
		.then(result => {
			console.log(result);
			return result;
		})
		.catch(e => {
			console.log(e);
			return reloadChrome();
		});
});

launchChrome({
	flags: ['--window-size=1200,800', '--disable-gpu', '--headless', '--no-zygote', '--single-process', '--no-sandbox']
}).then(chrome => {
	chromeInstance = chrome;

	return Promise.all([
		handler('http://www.nytimes.com'),
		handler('http://www.cnn.com'),
		handler('http://www.apple.com')
	]).then(console.log.bind(console, 'Done!'));
});
