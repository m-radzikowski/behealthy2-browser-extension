import './style.scss';
import {GaugeIndicator} from './gauge-indicator';
import $ from 'jquery';

const gaugeCanvas = document.getElementById('mood-gauge') as HTMLCanvasElement;
new GaugeIndicator(gaugeCanvas).start();

const lastPagesList = document.getElementById('last-pages');
chrome.storage.sync.get('history', data => {
	if (data.history) {
		let history = data.history as HistoryItem[];
		history = history.sort((a, b) => a.change - b.change);
		for (let i = 0; i < 3; i++) {
			const item = history[i];
			const title = item.title.substr(0, 35) + '...';
			const score = Math.round(item.change);
			const scoreClass = score > 0 ? 'score-positive' : 'score-negative';
			$(lastPagesList).append(`
				<li>
					<a href="${item.url}" target="_blank">${title}</a>
					&nbsp;
					[<span class="${scoreClass}">${score} pkt</span>]
				</li>
			`);
		}
	}
});

interface HistoryItem {
	url: string;
	title: string;
	change: number;
	resultValue: number;
}
