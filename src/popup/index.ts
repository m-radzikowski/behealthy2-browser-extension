import './style.scss';
import Chart from 'chart.js';

export class GaugeIndicator {
	private readonly gaugeContext: CanvasRenderingContext2D;
	private readonly chartContext: CanvasRenderingContext2D;
	private readonly canvasChartElem: HTMLCanvasElement;
	private readonly width: number;
	private readonly height: number;
	private historyChart: Chart;
	private intervalGaugeHandle: number;
	private intervalChartHandle: number;
	private gaugeStroke = 20;
	private colorsSet: string[] = [
		'#FD200D',
		'#FF7300',
		'#FEB101',
		'#F3EE01',
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

	constructor() {
		const canvasGaugeElem = <HTMLCanvasElement>document.getElementById('mood-gauge');
		this.width = canvasGaugeElem.width;
		this.height = canvasGaugeElem.height;
		this.gaugeContext = canvasGaugeElem.getContext('2d');
		this.canvasChartElem = <HTMLCanvasElement>document.getElementById('history-chart');
		this.chartContext = canvasGaugeElem.getContext('2d');
	}

	start() {
		this.renderGauge();
		this.renderHistoryChart();
		this.intervalGaugeHandle = setInterval((): void => {
			this.renderGauge();
		}, 1000);
		this.intervalChartHandle = setInterval((): void => {
			this.renderHistoryChart();
		}, 20000);
	}

	private renderGauge(): void {
		this.gaugeContext.lineCap = 'square';
		this.gaugeContext.font = '24px verdana';
		this.gaugeContext.textAlign = 'center';
		this.gaugeContext.textBaseline = 'middle';
		this.gaugeContext.fillStyle = 'black';
		this.gaugeContext.restore();
		let value = parseInt(window.localStorage.getItem('mood'), 10);
		value = !value || value > 100 || value < -100 ? 0 : value;
		this.drawGuage(value);
	}

	private drawGuage(value: number): void {
		this.gaugeContext.clearRect(0, 0, this.width, this.height);
		const PI = Math.PI;
		const PI2 = PI * 2;
		const cx = this.width / 2;
		const cy = this.height - 10;
		const r = this.width / 3;
		const min = PI;
		const max = PI2;
		const valueRadinas = min + (value + 100) / 200 * PI;
		const xPointer = cx + r * Math.cos(valueRadinas);
		const yPointer = cy + r * Math.sin(valueRadinas);
		this.gaugeContext.beginPath();
		this.gaugeContext.arc(cx, cy, r, min, max);
		this.gaugeContext.strokeStyle = 'black';
		this.gaugeContext.lineWidth = this.gaugeStroke;
		this.gaugeContext.stroke();
		for (let i = 0; i <= this.colorsSet.length; i++) {
			const moveAngel = i > 0 ? min * i * PI / 23 : 0;
			this.gaugeContext.beginPath();
			this.gaugeContext.arc(cx, cy, r, min + moveAngel, max);
			this.gaugeContext.strokeStyle = this.colorsSet[i];
			this.gaugeContext.lineWidth = this.gaugeStroke - this.gaugeStroke / 20;
			this.gaugeContext.stroke();
		}
		this.gaugeContext.beginPath();
		this.gaugeContext.strokeStyle = 'black';
		this.gaugeContext.moveTo(cx, cy);
		this.gaugeContext.lineTo(xPointer, yPointer);
		this.gaugeContext.lineWidth = 5;
		this.gaugeContext.stroke();
	}

	private renderHistoryChart(): void {
		const newData: number[] = [-70, -3, 40, 99, -50, 100, 0, -100];
		const newLabels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
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
		this.historyChart = new Chart(this.canvasChartElem, {
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

const gaugeIndicator = new GaugeIndicator();
gaugeIndicator.start();
