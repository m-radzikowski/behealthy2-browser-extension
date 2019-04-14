import $ from 'jquery';

export class PositivePages {

	constructor(private element: HTMLElement) {
	}

	render() {
		chrome.storage.sync.get('fun', data => {
			if (data.fun) {
				const fun = data.fun as FunItem[];
				fun.forEach(item => {
					$(this.element).append(`
						<li>
							<a href="${item.url}" target="_blank">${item.name}</a>
						</li>
					`);
				});
			}
		});
	}
}

interface FunItem {
	url: string;
	name: string;
}
