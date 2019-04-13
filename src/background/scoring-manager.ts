import $ from 'jquery';
import {env} from './env';

export class ScoringManager {

	private value = 0;
	private valueListeners: ((value: number) => any)[] = [];

	constructor() {
		chrome.storage.sync.get(['value'], (data) => {
			if (data.value) {
				this.value = +data.value;
				console.log('Initial scoring value read from storage', this.value);
				this.notifyValueListeners();
			}
		});
	}

	start() {
		chrome.runtime.onMessage.addListener((request): void => {
			console.log('Received message', request);

			let urlPath = null;
			let data = null;
			switch (request.action) {
				case 'text':
					urlPath = 'witai/sentiment';
					data = {message: request.message};
					break;
				case 'audio':
					urlPath = 'audio/mood';
					data = {audio: request.audio};
					break;
			}

			if (urlPath && data) {
				$.ajax({
					url: env.server_url + urlPath,
					type: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: (value: number): void => {
						this.addPoints(value);
					},
				});
			}
		});
	}

	private addPoints(change: number) {
		console.log('addPoints', this.value, change);
		let newValue = this.value + change;
		newValue = Math.min(100, Math.max(-100, newValue));

		if (this.value !== newValue) {
			console.log('Value change: ' + change + ', new value: ' + newValue);

			this.value = newValue;
			chrome.storage.sync.set({value: newValue});
			this.notifyValueListeners();
		}
	}

	private notifyValueListeners() {
		this.valueListeners.forEach(listener => listener(this.value));
	}

	addValueListener(fn: (value: number) => any) {
		this.valueListeners.push(fn);
	}
}
