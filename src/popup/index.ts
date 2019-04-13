import './style.scss';

export class LoadingIndicator {

	private readonly context: CanvasRenderingContext2D;
	private readonly width: number;
	private readonly height: number;
	private startTime: number;
	private intervalHandle: number;
	private gaugeStroke = 20;
	private colorsSet: string[] = ['#FD200D', '#FF7300', '#FEB101', '#F3EE01', '#ABD900', '#ABD900', '#01A800'];

	constructor() {
		const canvasElem = <HTMLCanvasElement>document.getElementById('mood-gauge');
		this.width = canvasElem.width;
		this.height = canvasElem.height;
		this.context = canvasElem.getContext('2d');
	}

	start() {
		this.startTime = new Date().getTime();
		this.intervalHandle = setInterval(() => this.render(), 1000);
	}

	stop() {
		clearInterval(this.intervalHandle);
	}

	private render() {
		this.context.lineCap = 'square';
		this.context.font = '24px verdana';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillStyle = 'black';

		this.context.restore();
		this.drawGuage(10);
	}

	drawGuage(percent) {
		console.log('reading healthy value: ', percent);
		const PI = Math.PI;
		const PI2 = PI * 2;
		const cx = this.width / 2;
		const cy = this.height / 2;
		const r = this.width / 3;
		const min = PI;
		const max = PI2;

		// draw full gauge outline
		this.context.beginPath();
		this.context.arc(cx, cy, r, min, max);
		this.context.strokeStyle = 'black';
		this.context.lineWidth = this.gaugeStroke;
		this.context.stroke();
		for (let i = 0; i <= this.colorsSet.length; i++) {
			console.log(PI);
			const moveAngel = i > 0 ? min * i * PI / 23 : 0;
			this.context.beginPath();
			this.context.arc(cx, cy, r, min + moveAngel, max);
			this.context.strokeStyle = this.colorsSet[i];
			this.context.lineWidth = this.gaugeStroke - this.gaugeStroke / 20;
			this.context.stroke();
		}
	}
}

const loadingIndicator = new LoadingIndicator();
loadingIndicator.start();
setTimeout(() => loadingIndicator.stop(), 5000);
