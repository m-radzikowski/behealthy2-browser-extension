import './style.scss';
import {Scrapper} from './scrapper';

new Scrapper().getPageText();

// // tryNTime example
// tryNTimes(() => {
// 	const name = 'article';
// 	const element = document.getElementsByTagName(name)[0];
// 	if (!element) {
// 		throw new Error(`Element <${name}> not found`);
// 	}
// 	return element;
// })
// 	.then(element => console.log('Found <article> element', element))
// 	.catch(() => console.log('Element <article> not found on page'));
//
// // external libraries use example
// const hello = padEnd('Hello', 10, '!');
// console.log(hello);
