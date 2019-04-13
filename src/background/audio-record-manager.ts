import Tab = chrome.tabs.Tab;

export class AudioRecordManager {

	private static instance: AudioRecordManager;
	private initialized = false;

	private constructor() {
	}

	static getInstance() {
		if (!AudioRecordManager.instance) {
			AudioRecordManager.instance = new AudioRecordManager();
		}
		return AudioRecordManager.instance;
	}

	init() {
		if (this.initialized) {
			return;
		}

		this.listenTabUpdates();
		this.initialized = true;
	}

	private listenTabUpdates() {
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			const audible = changeInfo.audible;
			if (audible === undefined) {
				return;
			}

			if (audible) {
				this.startRecording(tab);
			} else {
				this.stopRecording(tab);
			}
		});
	}

	private startRecording(tab: Tab) {
		console.log('Starting audio recording', tab);
		console.log('tab active', tab.active);

		chrome.tabCapture.capture({audio: true}, stream => {
			// let startTabId;
			// chrome.tabs.query({active: true, currentWindow: true}, (tabs) => startTabId = tabs[0].id);
			const audioCtx = new AudioContext();
			console.log(stream);
			const source = audioCtx.createMediaStreamSource(stream);
			const mediaRecorder = new MediaRecorder(source);
			console.log(mediaRecorder);
			// const mediaRecorder = new Recorder(source);
		});
	}

	private stopRecording(tab: Tab) {
		console.log('Stopping audio recording', tab);
	}
}
