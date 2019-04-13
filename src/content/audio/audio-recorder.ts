export interface AudioRecorder {

	start();

	stop();

	setBlobListener(fn: (b: Blob) => void);
}
