import './style.scss';
import {Scrapper} from './scrapper';

window.onload = function (): void {
	setTimeout(() => {
		const text = new Scrapper().getPageText();
		if (text) {
			chrome.runtime.sendMessage({message: text});
		}
	}, 5000);
};
