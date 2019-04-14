import './style.scss';

export class GaugeIndicator {
	private readonly gaugeContext: CanvasRenderingContext2D;
	private readonly width: number;
	private readonly height: number;
	private gaugeStroke = 20;
	private colorsSet: string[] = [
		'#FD200D',
		'#FF7300',
		'#FEB101',
		'#E8E300',
		'#ABD900',
		'#ABD900',
		'#01A800'
	];

	constructor(gaugeCanvas: HTMLCanvasElement) {
		this.width = gaugeCanvas.width;
		this.height = gaugeCanvas.height - 20;
		this.gaugeContext = gaugeCanvas.getContext('2d');
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
		this.gaugeContext.lineCap = 'square';
		this.gaugeContext.font = '24px verdana';
		this.gaugeContext.textAlign = 'center';
		this.gaugeContext.textBaseline = 'middle';
		this.gaugeContext.fillStyle = 'black';
		this.gaugeContext.restore();

		chrome.storage.sync.get(['value'], data => {
			this.drawGuage(+data.value);
		});
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
}
