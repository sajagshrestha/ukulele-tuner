let micStream = null; // used to stop getting microhpone input

//get mic from user using navigator api
const getMic = () => {
	navigator.mediaDevices
		.getUserMedia({
			audio: {
				echoCancellation: false,
				autoGainControl: false,
				noiseSuppression: true, //noise suppression may reduce the accuracy of tuner
				latency: 0,
			},
		})
		.then((stream) => {
			if (audioContext.state === "suspended") {
				audioContext.resume();
			}
			micStream = stream;
			source = audioContext.createMediaStreamSource(stream);
			//connect analyzer nodes to input node
			source.connect(tunerNode);
			source.connect(visualizerNode);
			//update mic style
			micButton.classList.remove("no-permission");
			micButton.classList.add("active");
			isUsingMic = true;
			//start tuner and visualizer only after getting user's microphone
			start();
		})
		.catch(() => {
			//show permission error
			micButton.classList.add("no-permission");
		});
};

const toggleMic = () => {
	if (isUsingMic) {
		isUsingMic = false;
		//update mic style
		micButton.classList.remove("active");
		visualizer.clear();
		initializeTuner();

		//stop getting input from mic
		micStream.getAudioTracks().forEach((track) => {
			track.stop();
		});
		//stop the tuner
		cancelAnimationFrame(start);
	} else {
		getMic();
	}
};
