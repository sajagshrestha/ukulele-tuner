const audioContext = new AudioContext();
const analyserNode = new AnalyserNode(audioContext, { fftSize: 2048 }); //web audio api's anaylzer node that connects to mic input

let micStream = null; // used to stop getting microhpone input
let isUsingMic = false; //microphone state

//get mic from user using navigator api
const getMic = () => {
	navigator.mediaDevices
		.getUserMedia({
			audio: {
				echoCancellation: false,
				autoGainControl: false,
				noiseSuppression: false, //noise suppression may reduce the accuracy of tuner
				latency: 0,
			},
		})
		.then((stream) => {
			if (audioContext.state === "suspended") {
				audioContext.resume();
			}
			micStream = stream;
			source = audioContext.createMediaStreamSource(stream);
			//connect analyzer node to input node
			source.connect(analyserNode);
			isUsingMic = true;
			//start tuner only after getting user's microphone
		})
		.catch((error) => {
			//handle error here
		});
};

const toggleMic = () => {
	if (isUsingMic) {
		isUsingMic = false;
		//stop getting input from mic
		micStream.getAudioTracks().forEach((track) => {
			track.stop();
		});
		//stop the tuner
	} else {
		getMic();
	}
};
