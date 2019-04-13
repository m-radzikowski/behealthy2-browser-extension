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
			let audible = changeInfo.audible;

			// set audible status when page loading is completed, as previous message were sent to soon to be read
			if (changeInfo.status === 'complete') {
				audible = tab.audible;
			}

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
		chrome.tabs.sendMessage(tab.id, {action: 'start-recording'});
	}

	private stopRecording(tab: Tab) {
		console.log('Stopping audio recording', tab);
		chrome.tabs.sendMessage(tab.id, {action: 'stop-recording'});
	}
}
