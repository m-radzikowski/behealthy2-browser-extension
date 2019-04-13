import $ from 'jquery';
import {env} from './env';
import Tab = chrome.tabs.Tab;

export class ScoringManager {

	private value = 0;
	private history: HistoryItem[] = [];

	private valueListeners: ((value: number) => any)[] = [];

	constructor() {
		chrome.storage.sync.get(['value', 'history'], (data) => {
			if (data.value) {
				this.value = data.value;
				console.log('Initial scoring value read from storage', this.value);
			}
			if (data.history) {
				this.history = data.history;
				console.log('Initial history read from storage', this.history);
			}

			this.notifyValueListeners();
		});
	}

	start() {
		chrome.runtime.onMessage.addListener((request, sender): void => {
			console.log('Received message', request, sender);

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
						this.addScore(sender.tab, value);
					},
				});
			}
		});
	}

	private addScore(tab: Tab, change: number) {
		console.log('addScore', tab, change);

		if (change === 0) {
			return;
		}

		let newValue = this.value + change;
		newValue = Math.min(100, Math.max(-100, newValue));
		console.log('Value change: ' + change + ', new value: ' + newValue);

		this.value = newValue;

		const historyItem: HistoryItem = {
			url: tab.url,
			title: tab.title,
			change: change,
			resultValue: this.value,
		};
		this.history.push(historyItem);

		chrome.storage.sync.set({
			value: this.value,
			history: this.history,
		});

		this.notifyValueListeners();
	}

	private notifyValueListeners() {
		this.valueListeners.forEach(listener => listener(this.value));
	}

	addValueListener(fn: (value: number) => any) {
		this.valueListeners.push(fn);
	}
}

interface HistoryItem {
	url: string;
	title: string;
	change: number;
	resultValue: number;
}
