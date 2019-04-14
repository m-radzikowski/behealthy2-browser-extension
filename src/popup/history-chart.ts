import './style.scss';
import Chart from 'chart.js';
import {HistoryItem} from './history-item';

export class HistoryChart {
	private readonly chartContext: CanvasRenderingContext2D;
	private historyChart: Chart;
	private colorsSet: string[] = [
		'#FD200D',
		'#FF7300',
		'#FEB101',
		'#E8E300',
		'#ABD900',
		'#ABD900',
		'#01A800'
	];
	private data: any = {
		labels: [],
		datasets: [{
			data: [],
			backgroundColor: [],
			borderColor: [],
			borderWidth: 1
		}]
	};

	constructor(private chartCanvas: HTMLCanvasElement) {
		this.chartContext = chartCanvas.getContext('2d');
	}

	start() {
		this.render();
		chrome.runtime.onMessage.addListener(message => {
			if (message.action === 'new-value') {
				this.render();
			}
		});
	}

	private render(): void {
		chrome.storage.sync.get('history', historyData => {
			if (historyData.history) {
				let history = historyData.history as HistoryItem[];
				const newData: number[] = [];
				const newLabels: string[] = [];
				if (history.length > 20) {
					history = history.slice(history.length - 20, history.length - 1);
				}
				history.forEach((historyItem: HistoryItem): void => {
					newData.push(Math.round(historyItem.resultValue));
					newLabels.push(historyItem.title);
				});
				const gradientStroke = this.chartContext.createLinearGradient(0, 0, 280, 0);
				const increment = 1 / newData.length;
				let position = 0;
				gradientStroke.addColorStop(0, this.getColor(0));
				position += increment;
				newData.forEach((value: number): void => {
					gradientStroke.addColorStop(position, this.getColor(value));
					position += increment;
				});
				const data = {
					labels: newLabels,
					datasets: [{
						data: newData,
						borderColor: gradientStroke,
						backgroundColor: gradientStroke, borderWidth: 3
					}]
				};
				this.data = Object.assign([], data);
				this.historyChart = new Chart(this.chartCanvas, {
					type: 'line',
					data: this.data,
					options: {
						legend: false,
						scales: {
							yAxes: [{
								ticks: {
									display: false
								}
							}],
							xAxes: [{
								ticks: {
									display: false
								}
							}]
						}
					}
				});
			}
		});
	}

	private getColor(value): string {
		switch (true) {
			case (value < -76):
				return this.colorsSet[0];
			case (value < -54):
				return this.colorsSet[1];
			case (value < -24):
				return this.colorsSet[2];
			case (value < 1):
				return this.colorsSet[3];
			case (value < 59):
				return this.colorsSet[4];
			default:
				return this.colorsSet[6];
		}
	}

}
