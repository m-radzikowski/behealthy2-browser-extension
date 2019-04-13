// Hot reload for chrome extension development without refreshing extension after every change
// From: https://github.com/xpl/crx-hotreload

const filesInDirectory = dir => new Promise<any[]>(resolve =>
	dir.createReader().readEntries(entries =>
		Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>
			e.isDirectory ? filesInDirectory(e) : new Promise(res => e.file(res))))
			.then(files => [].concat(...files))
			.then(resolve)
	)
);

const timestampForFilesInDirectory = dir =>
	filesInDirectory(dir).then((files: any[]) =>
		files.map(f => f.name + f.lastModifiedDate).join());

const reload = () => {
	chrome.tabs.query({active: true, currentWindow: true}, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5
		if (tabs[0]) {
			chrome.tabs.reload(tabs[0].id);
		}

		chrome.runtime.reload();
	});
};

const watchChanges = (dir, lastTimestamp?) => {
	timestampForFilesInDirectory(dir).then(timestamp => {
		if (!lastTimestamp || (lastTimestamp === timestamp)) {
			setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
		} else {
			reload();
		}
	});
};

chrome.management.getSelf(self => {
	if (self.installType === 'development') {
		chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
	}
});
