import './style.scss';
import {Scrapper} from './scrapper';

const text = new Scrapper().getPageText();
if (text) {
	chrome.runtime.sendMessage({message: text});
}
