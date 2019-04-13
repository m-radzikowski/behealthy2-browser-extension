import './style.scss';
import {Scrapper} from './scrapper';

const text = new Scrapper().getPageText();
if (text) {
	console.log('SCRAPPED TEXT', text);
}

let audioRecorder: AudioRecorder = null;

chrome.runtime.onMessage.addListener(message => {
	switch (message.action) {
		case 'start-recording':
			const video = document.getElementsByTagName('video')[0];
			audioRecorder = new AudioRecorder(video);
			audioRecorder.start();
			break;
		case 'stop-recording':
			if (audioRecorder) {
				audioRecorder.stop();
			}
			break;
	}
});

declare var MediaRecorder: any;

export class AudioRecorder {

	private element: HTMLVideoElement;
	private mediaRecorder;
	private chunks = [];

	constructor(element: HTMLVideoElement) {
		this.element = element;
	}

	start() {
		// @ts-ignore
		const videoStream = this.element.captureStream();
		const sourceNode = new AudioContext().createMediaStreamSource(videoStream);

		sourceNode.mediaStream.getVideoTracks().forEach(videoTrack =>
			sourceNode.mediaStream.removeTrack(videoTrack)
		);

		this.mediaRecorder = new MediaRecorder(sourceNode.mediaStream);
		console.log(this.mediaRecorder);

		this.mediaRecorder.onstart = () => this.onStart();
		this.mediaRecorder.ondataavailable = (e) => this.onDataAvailable(e);
		this.mediaRecorder.onstop = () => this.onStop();
		this.mediaRecorder.onwarning = (e) => this.onWarning(e);
		this.mediaRecorder.onerror = (e) => this.onError(e);

		this.mediaRecorder.start();
	}

	stop() {
		this.mediaRecorder.stop();
	}

	private onStart() {
		console.log('Audio recording started');
	}

	private onDataAvailable(event) {
		this.chunks.push(event.data);
	}

	private onStop() {
		console.log('Audio recording stopped');

		const blob = new Blob(this.chunks, {
			type: 'audio/webm',
		});
		console.log(blob);

		// TODO Return blob
	}

	private onWarning(e) {
		console.log('Media Recorder warning', e);
	}

	private onError(e) {
		console.log('Media Recorder error', e);
	}
}
