import {AudioRecorder} from './audio-recorder';
import {SimpleAudioRecorder} from './simple-audio-recorder';

export class SplittingAudioRecorder implements AudioRecorder {

	private audioRecorder: AudioRecorder;
	private timeoutHandler: number;

	constructor(
		private element: HTMLVideoElement,
		private maxLengthSeconds = 20,
	) {
	}

	start() {
		this.startProxiedRecorder();
	}

	private startProxiedRecorder() {
		this.audioRecorder = new SimpleAudioRecorder(this.element);
		this.audioRecorder.start();

		this.timeoutHandler = setTimeout(() => {
			this.stopProxiedRecorder();
			this.startProxiedRecorder();
		}, this.maxLengthSeconds * 1000);
	}

	stop() {
		clearTimeout(this.timeoutHandler);
		this.stopProxiedRecorder();
	}

	private stopProxiedRecorder() {
		this.audioRecorder.stop();
	}
}
