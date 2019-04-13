import './style.scss';
import {Scrapper} from './scrapper';
import {AudioRecorder} from './audio/audio-recorder';
import {SplittingAudioRecorder} from './audio/splitting-audio-recorder';

const text = new Scrapper().getPageText();
if (text) {
	chrome.runtime.sendMessage({message: text});
}

let audioRecorder: AudioRecorder = null;

chrome.runtime.onMessage.addListener(message => {
	switch (message.action) {
		case 'start-recording':
			const video = document.getElementsByTagName('video')[0];
			audioRecorder = new SplittingAudioRecorder(video);
			audioRecorder.setBlobListener(blob => {
				const fileReader = new FileReader();
				fileReader.readAsDataURL(blob);
				fileReader.onloadend = () => {
					const base64data = fileReader.result;
					chrome.runtime.sendMessage({'audio': base64data});
				};
			});
			audioRecorder.start();
			break;
		case 'stop-recording':
			if (audioRecorder) {
				audioRecorder.stop();
			}
			break;
	}
});
