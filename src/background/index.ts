import './hot-reload.ts';

console.log('Log from background page');

// To have browser action click working, remove browser action popup from the manifest.
chrome.browserAction.onClicked.addListener(function (tab) {
	console.log('Browser action clicked');
});

// chrome.browserAction.setIcon({path:'icon.svg'});

class DashboardIcon {
	private value = 0;
	private context: CanvasRenderingContext2D;
	private intervalHandle: number;
	constructor(private size: number) {
		this.context = document.createElement('canvas').getContext('2d');
	}

	start() {
		this.intervalHandle = setInterval(() => this.render(), 1000);
	}

	private render(): void {
		this.value = (Math.random() * 200) - 100; // to be taken from api
		const color: string = this.getColor();
		this.context.save();
		this.context.clearRect(0, 0, this.size, this.size);
		this.context.fillStyle = color;
		this.context.arc(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
		this.context.stroke();
		this.context.fill();
		const imageData = this.context.getImageData(0, 0, this.size, this.size);
		chrome.browserAction.setIcon({
			imageData: imageData
		});
		this.context.restore();
	}

	private getColor(): string {
		switch (true) {
			case (this.value < -77):
				return '#FD200D';
			case (this.value < -55):
				return '#FF7300';
			case (this.value < -25):
				return '#FEB101';
			case (this.value < 0):
				return '#F3EE01';
			case (this.value < 60):
				return '#ABD900';
			default:
				return '#01A800';
		}
	}
}

const dashboardIcon = new DashboardIcon(16);
dashboardIcon.start();
