import './style.scss';
import {Scrapper} from './scrapper';

const text = new Scrapper().getPageText();
if (text) {
	console.log('SCRAPPED TEXT', text);
}

window.addEventListener('load', function () {
	const video = document.getElementsByTagName('video')[0];
	console.log(video);

	const videoStream = video.captureStream();
	console.log('video stream', videoStream);

	const sourceNode = new AudioContext().createMediaStreamSource(videoStream);
	console.log(sourceNode);
	console.log(sourceNode.mediaStream);
	console.log(sourceNode.mediaStream.getAudioTracks()[0]);

	sourceNode.mediaStream.getVideoTracks().forEach(videoTrack =>
		sourceNode.mediaStream.removeTrack(videoTrack)
	);

	const mediaRecorder = new MediaRecorder(sourceNode.mediaStream);
	console.log(mediaRecorder);

	mediaRecorder.start();

	let chunks = [];

	mediaRecorder.ondataavailable = function (e) {
		console.log('media data', e);
		chunks.push(e.data);
	};
	mediaRecorder.onerror = function (e) {
		console.log('Error: ', e);
	};
	mediaRecorder.onstart = function () {
		console.log('Started, state = ' + mediaRecorder.state);
	};
	mediaRecorder.onstop = function () {
		console.log('Stopped, state = ' + mediaRecorder.state);
		const blob = new Blob(chunks, {
			type: 'audio/webm',
		});
		chunks = [];

		console.log(blob);

		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'audio';
		a.click();
		window.URL.revokeObjectURL(url);
	};
	mediaRecorder.onwarning = function (e) {
		console.log('Warning: ' + e);
	};

	setTimeout(function () {
		mediaRecorder.stop();
	}, 4000);
});
