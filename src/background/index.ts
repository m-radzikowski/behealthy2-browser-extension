import './hot-reload.ts';
import $ from 'jquery';
import {env} from './env';

// To have browser action click working, remove browser action popup from the manifest.
// chrome.browserAction.onClicked.addListener(function (tab) {
// 	console.log('Browser action clicked');
// });

// chrome.browserAction.setIcon({path:'icon.svg'});

class Dashboard {
	private value = 0;
	private context: CanvasRenderingContext2D;
	private intervalHandle: number;

	constructor(private size: number) {
		this.context = document.createElement('canvas').getContext('2d');
	}

	start() {
		this.render();
		this.startRuntimeListener();
		this.intervalHandle = setInterval(() => this.render(), 10000);
	}

	private startRuntimeListener(): void {
		chrome.runtime.onMessage.addListener((request): void => {
			$.ajax({
				url: env.server_url,
				type: 'POST',
				data: JSON.stringify({message: request.message}),
				contentType: 'application/json',
				success: (value: number): void => {
					this.validateSetAndRender(value);
				},
				timeout: 60000
			});
		});
	}

	private validateSetAndRender(value: number): void {
		this.value += value;
		this.value = this.value > 100 ? 100 : this.value;
		this.value = this.value < -100 ? -100 : this.value;
		this.render();
	}

	private render(): void {
		window.localStorage.setItem('mood', this.value.toString());
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

const dashboard = new Dashboard(16);
dashboard.start();
