export class GaugeIndicator {

	private readonly context: CanvasRenderingContext2D;
	private readonly width: number;
	private readonly height: number;
	private intervalHandle: number;
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

	constructor(private canvas: HTMLCanvasElement) {
		this.width = canvas.width;
		this.height = canvas.height;
		this.context = canvas.getContext('2d');
	}

	start() {
		this.render();
		this.intervalHandle = setInterval(() => this.render(), 1000);
	}

	private render(): void {
		this.context.lineCap = 'square';
		this.context.font = '24px verdana';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillStyle = 'black';
		this.context.restore();
		chrome.storage.sync.get(['value'], data => {
			this.drawGuage(+data.value);
		});
	}

	private drawGuage(value: number): void {
		console.log('drawing gauge value', value);

		this.context.clearRect(0, 0, this.width, this.height);
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
		this.context.beginPath();
		this.context.arc(cx, cy, r, min, max);
		this.context.strokeStyle = 'black';
		this.context.lineWidth = this.gaugeStroke;
		this.context.stroke();
		for (let i = 0; i <= this.colorsSet.length; i++) {
			const moveAngel = i > 0 ? min * i * PI / 23 : 0;
			this.context.beginPath();
			this.context.arc(cx, cy, r, min + moveAngel, max);
			this.context.strokeStyle = this.colorsSet[i];
			this.context.lineWidth = this.gaugeStroke - this.gaugeStroke / 20;
			this.context.stroke();
		}
		this.context.beginPath();
		this.context.strokeStyle = 'black';
		this.context.moveTo(cx, cy);
		this.context.lineTo(xPointer, yPointer);
		this.context.lineWidth = 5;
		this.context.stroke();
	}
}
