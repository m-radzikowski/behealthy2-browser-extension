import './hot-reload.ts';

console.log('Log from background page');

// To have browser action click working, remove browser action popup from the manifest.
chrome.browserAction.onClicked.addListener(function (tab) {
	console.log('Browser action clicked');
});
