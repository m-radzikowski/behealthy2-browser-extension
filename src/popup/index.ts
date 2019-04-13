import './style.scss';

export class LoadingIndicator {

	private readonly context: CanvasRenderingContext2D;
	private startTime: number;
	private intervalHandle: number;
	private width: number;
	private height: number;
	private gaugeStroke: number;

	constructor() {
		const canvasElem = <HTMLCanvasElement>document.getElementById('mood-gauge');
		this.width = canvasElem.width;
		this.height = canvasElem.height;
		this.context = canvasElem.getContext('2d');
		this.gaugeStroke = 30;
	}

	start() {
		this.startTime = new Date().getTime();
		this.intervalHandle = setInterval(() => this.render(), 1000 / 30);
	}

	stop() {
		clearInterval(this.intervalHandle);
	}

	private render() {
		this.context.lineCap = 'round';
		this.context.font = '24px verdana';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillStyle = 'gray';

		this.context.restore();
		this.drawGuage(10);
	}

	drawGuage(percent) {
		const PI = Math.PI;
		const PI2 = PI * 2;
		const cx = this.width / 2;
		const cy = this.height / 2;
		const r = this.width / 3;
		const min = PI * .90;
		const max = PI2 + PI * .10;

		// draw full guage outline
		this.context.beginPath();
		this.context.arc(cx,cy,r,min,max);
		this.context.strokeStyle='lightgray';
		this.context.lineWidth=this.gaugeStroke;
		this.context.stroke();
		// draw percent indicator
		this.context.beginPath();
		this.context.arc(cx,cy,r,min,min+(max-min)*percent/100);
		this.context.strokeStyle='red';
		this.context.lineWidth=this.gaugeStroke - this.gaugeStroke / 8;
		this.context.stroke();
	}
}

const loadingIndicator = new LoadingIndicator();
loadingIndicator.start();
setTimeout(() => loadingIndicator.stop(), 5000);
