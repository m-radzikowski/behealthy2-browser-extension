import $ from 'jquery';
import flatten from 'lodash/flatten';
import {env} from './env';

export class Scrapper {

	/**
	 * Page content jQuery selectors, in priority order.
	 */
	private readonly contentSelectors = [
		'article',
		'#article',
		'#article_wrapper', // wiadomosci.gazeta.pl
		'.article', // sport.pl
		'.content', // tvnmeteo.tvn24.pl
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
		'ul',
		'#gazeta_article_lead', // wiadomosci.gazeta.pl
		'.article--lead', // wiadomosci.wp.pl
		'#lead', // wiadomosci.onet.pl
	];

	private readonly minTextLength = 1000;

	getPageText(): string | null {
		console.log('Scrapping for page content');

		const textSelector = this.textSelectors.join(', ');

		const pageContentElements = this.getPageContentElements();
		for (const pageContentElement of pageContentElements) {
			console.log('Parsing element', pageContentElement);

			const textElements = $(pageContentElement).find(textSelector);
			let text = textElements
				.each(function () {
					// add space to every element (paragraph etc.) to have a separator between joined text from two adjacent elements
					$(this).append(' ');
				})
				.text();
			text = this.cleanText(text);

			console.log(`Text from "${pageContentElement}" selector`, $(pageContentElement), text);

			if (this.verifyText(text)) {
				this.highlightScrappedText(textElements);
				return text;
			}
		}

		return null;
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

	private highlightScrappedText(elements: JQuery<HTMLElement>) {
		if (env.debug) {
			elements.addClass('behealthy-highlight');
		}
	}
}
