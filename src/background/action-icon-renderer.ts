export class ActionIconRenderer {

	private value = 0;
	private context: CanvasRenderingContext2D;

	constructor(private size: number) {
		this.context = document.createElement('canvas').getContext('2d');
		this.render();
	}

	updateValue(newValue: number) {
		this.value = newValue;
		this.render();
	}

	private render(): void {
		const color: string = this.getColor();
		this.context.save();
		this.context.clearRect(0, 0, this.size, this.size);
		this.context.fillStyle = color;
		this.context.arc(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
		this.context.fill();
		const imageData = this.context.getImageData(0, 0, this.size, this.size);
		chrome.browserAction.setIcon({
			imageData: imageData
		});
		this.context.restore();
	}

	private getColor(): string {
		switch (true) {
			case (this.value < -76):
				return '#FD200D';
			case (this.value < -54):
				return '#FF7300';
			case (this.value < -24):
				return '#FEB101';
			case (this.value < 1):
				return '#F3EE01';
			case (this.value < 59):
				return '#ABD900';
			default:
				return '#01A800';
		}
	}
}
