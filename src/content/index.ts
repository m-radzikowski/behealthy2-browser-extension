import './style.scss';
import {Scrapper} from './scrapper';
import {AudioRecorder} from './audio/audio-recorder';
import {SplittingAudioRecorder} from './audio/splitting-audio-recorder';

const text = new Scrapper().getPageText();
if (text) {
	console.log('SCRAPPED TEXT', text);
}

let audioRecorder: AudioRecorder = null;

chrome.runtime.onMessage.addListener(message => {
	switch (message.action) {
		case 'start-recording':
			const video = document.getElementsByTagName('video')[0];
			audioRecorder = new SplittingAudioRecorder(video);
			audioRecorder.start();
			break;
		case 'stop-recording':
			if (audioRecorder) {
				audioRecorder.stop();
			}
			break;
	}
});
