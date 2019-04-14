import $ from 'jquery';
import {HistoryItem} from './history-item';

export class WorstPages {

	constructor(private element: HTMLElement) {
	}

	render() {
		chrome.storage.sync.get('history', data => {
			if (data.history) {
				let history = data.history as HistoryItem[];
				history = history.sort((a, b) => a.change - b.change);
				for (let i = 0; i < 3; i++) {
					const item = history[i];
					const title = item.title.substr(0, 35) + '...';
					const score = Math.round(item.change);
					const scoreClass = score > 0 ? 'score-positive' : 'score-negative';
					$(this.element).append(`
						<li>
							<a href="${item.url}" target="_blank">${title}</a>
							&nbsp;
							[<span class="${scoreClass}">${score} pkt</span>]
						</li>
					`);
				}
			}
		});
	}
}
