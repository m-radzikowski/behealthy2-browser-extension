import './hot-reload.ts';
import {AudioRecordManager} from './audio-record-manager';

AudioRecordManager.getInstance().init();

chrome.runtime.onMessage.addListener(request => {
	console.log('Received message', request);
});
