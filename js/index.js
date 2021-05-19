let isUsingMic = false; //microphone state

//main loop
const start = () => {
	if (isUsingMic) {
		//draw visualizer

		requestAnimationFrame(start);
	}
};
