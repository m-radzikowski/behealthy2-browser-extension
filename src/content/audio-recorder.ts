export class AudioRecorder {
	public startRecording() {
		console.log('Starting audio recording');
		// new AudioContext().


		// chrome.tabCapture.capture({audio: true}, stream => {
		// 	// let startTabId;
		// 	// chrome.tabs.query({active: true, currentWindow: true}, (tabs) => startTabId = tabs[0].id);
		// 	const audioCtx = new AudioContext();
		// 	console.log(stream);
		// 	const source = audioCtx.createMediaStreamSource(stream);
		// 	const mediaRecorder = new MediaRecorder(source);
		// 	console.log(mediaRecorder);
		// 	// const mediaRecorder = new Recorder(source);
		// });
	}

}
