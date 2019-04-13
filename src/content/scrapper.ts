import $ from 'jquery';
import flatten from 'lodash/flatten';

export class Scrapper {

	/**
	 * Page content jQuery selectors, in priority order.
	 */
	private readonly contentSelectors = [
		'article',
		'#article',
		'#article_wrapper', // wiadomosci.gazeta.pl
		'.article', // sport.pl
	];

	/**
	 * jQuery selectors for elements to be filtered out from page content processing.
	 */
	private readonly forbiddenContentSelectors = [
		'.mod_comments', // wiadomosci.gazeta.pl
		'.index_simple', // wiadomosci.gazeta.pl
	];

	/**
	 * jQuery selectors for text in page content.
	 */
	private readonly textSelectors = [
		'p',
		'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
		'blockquote',
	];

	private readonly minTextLength = 1000;

	getPageText() {
		console.log('Scrapping for page content');

		const textSelector = this.textSelectors.join(', ');

		let text;

		const pageContentElements = this.getPageContentElements();
		for (const pageContentElement of pageContentElements) {
			console.log('ELEMENT', pageContentElement);

			const textElements = $(pageContentElement).find(textSelector);
			text = textElements.text();
			text = this.cleanText(text);

			console.log(`Text from "${pageContentElement}" selector`, $(pageContentElement), text);

			if (this.verifyText(text)) {
				break;
			} else {
				text = '';
			}
		}

		console.log('Final text', text);
	}

	/**
	 * Finds candidates for main page content elements.
	 */
	private getPageContentElements(): HTMLElement[] {
		const forbiddenContentSelector = this.forbiddenContentSelectors.join(', ');

		const elements = this.contentSelectors.map(contentSelector =>
			$(contentSelector + ':not(' + forbiddenContentSelector + ')').filter(function () {
				return !$(this).parents().is(forbiddenContentSelector);
			}).toArray()
		);

		return flatten(elements);

		// return flatten(elements);
	}

	private cleanText(text: string) {
		return text.replace(/\s\s+/g, ' ');
	}

	/**
	 * Verifies if text is a possible actual article content.
	 */
	private verifyText(text: string) {
		return text.length > this.minTextLength;
	}
}
