import './style.scss';
import {Scrapper} from './scrapper';

const text = new Scrapper().getPageText();
if (text) {
	console.log('SCRAPPED TEXT', text);
}
