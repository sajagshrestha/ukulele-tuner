//canvas
const visualizerCanvas = document.getElementById("visualizer-canvas");
// const vContext = visualizerCanvas.getContext("2d");

//audio context
const audioContext = new AudioContext();
const tunerNode = new AnalyserNode(audioContext, { fftSize: 2048 }); //web audio api's anaylzer node that connects to mic input
const visualizerNode = new AnalyserNode(audioContext, { fftSize: 64 }); //analyzer node for visualizer

//to store discrete frequency values for pitch detection
const tunerBufferLength = tunerNode.frequencyBinCount;
const tunerDataArray = new Float32Array(tunerBufferLength);

//to store frequency values for visualizer
const visualizerBufferLength = visualizerNode.frequencyBinCount;
const visualizerDataArray = new Uint8Array(visualizerBufferLength);

//elements from DOM
const micButton = document.querySelector(".mic-button");

//mic state
let isUsingMic = false;

//colors
const CYAN = "#5CC1A9";

const visualizer = new Visualizer(
	visualizerCanvas,
	visualizerBufferLength,
	CYAN
);

//main loop

const start = () => {
	if (isUsingMic) {
		//get frequency data
		visualizerNode.getByteFrequencyData(visualizerDataArray);

		//draw visualizer

		visualizer.drawVisualizer(visualizerDataArray);
		requestAnimationFrame(start);
	}
};

//add eventListeners
micButton.addEventListener("click", toggleMic);
