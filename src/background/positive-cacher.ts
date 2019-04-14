import $ from 'jquery';
import {env} from './env';

export class PositiveCacher {

	private readonly fetchFrequencySeconds = 10;

	start() {
		this.fetch();
		setInterval(() => {
			this.fetch();
		}, this.fetchFrequencySeconds * 1000);
	}

	private fetch() {
		$.get(env.server_url + 'fun', data => {
			chrome.storage.sync.set({fun: data});
		});
	}
}
