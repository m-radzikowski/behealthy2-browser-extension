/**
 * Repeats function up to given number of times,
 * returning {@link Promise} with result or rejection,
 * if function has thrown {@link Error} every time.
 * This is useful for repeating failed HTTP requests
 * or checking if dynamically loaded content is available.
 * Based on https://stackoverflow.com/a/38225011/2512304
 * <p></p>
 * Example usage:
 * <pre>
 *     const loremPromise = tryNTimes(() => {
 *         const element = document.getElementById('lorem');
 *         if (!element) {
 *             throw new Error('Element #lorem not found');
 *         }
 *         return element;
 *     });
 * </pre>
 */
export async function tryNTimes<T>(f: () => T, retries: number = 50, timeoutMs: number = 200): Promise<T> {
	let p = Promise.reject<T>();

	for (let i = 0; i < retries - 1; i++) {
		p = p.catch(f).catch(reason => this.rejectDelay(reason, timeoutMs));
	}
	p = p.catch(f);

	return p;
}

function rejectDelay<T>(reason: any, timeoutMs: number): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		setTimeout(reject.bind(null, reason), timeoutMs);
	});
}
