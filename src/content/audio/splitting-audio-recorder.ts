import {AudioRecorder} from './audio-recorder';
import {SimpleAudioRecorder} from './simple-audio-recorder';

export class SplittingAudioRecorder implements AudioRecorder {

	private proxiedRecorder: AudioRecorder;
	private timeoutHandler: number;
	private blobListener: (b: Blob) => void;

	constructor(
		private element: HTMLVideoElement,
		private maxLengthSeconds = 20,
	) {
	}

	start() {
		this.startProxiedRecorder();
	}

	private startProxiedRecorder() {
		this.proxiedRecorder = new SimpleAudioRecorder(this.element);
		this.proxiedRecorder.setBlobListener(blob => {
			if (this.blobListener) {
				this.blobListener(blob);
			}
		});

		this.proxiedRecorder.start();

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
		this.proxiedRecorder.stop();
	}

	setBlobListener(fn: (b: Blob) => void) {
		this.blobListener = fn;
	}
}
