import {AudioRecorder} from './audio-recorder';

declare var MediaRecorder: any;

export class SimpleAudioRecorder implements AudioRecorder {

	private mediaRecorder;
	private chunks = [];

	constructor(
		private element: HTMLVideoElement,
	) {
	}

	start() {
		// @ts-ignore
		const videoStream = this.element.captureStream();
		const sourceNode = new AudioContext().createMediaStreamSource(videoStream);

		sourceNode.mediaStream.getVideoTracks().forEach(videoTrack =>
			sourceNode.mediaStream.removeTrack(videoTrack)
		);

		this.mediaRecorder = new MediaRecorder(sourceNode.mediaStream);

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
		console.log('data available', event);
		this.chunks.push(event.data);
	}

	private onStop() {
		console.log('Audio recording stopped');

		const blob = new Blob(this.chunks, {
			type: 'audio/webm',
		});
		console.log(blob);

		// TODO Return blob

		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'audio';
		a.click();
		window.URL.revokeObjectURL(url);
	}

	private onWarning(e) {
		console.log('Media Recorder warning', e);
	}

	private onError(e) {
		console.log('Media Recorder error', e);
	}
}
