//canvas
const tunerCanvas = document.getElementById("tuner-canvas");
const visualizerCanvas = document.getElementById("visualizer-canvas");
// const vContext = visualizerCanvas.getContext("2d");
tunerCanvas.width = 570;
tunerCanvas.height = 480;

visualizerCanvas.width = 500;
visualizerCanvas.height = 250;

//font to use in canvas
const fontPoppins = new FontFace(
	"Poppins",
	"url(https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrFJA.ttf)"
);

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

//current tuner mode
let currentTunerMode = "manual";

//colors
const CYAN = "#5CC1A9";
const GREY = "#868686";
const RED = "red";

const barTuner = new BarTuner(tunerCanvas);
const visualizer = new Visualizer(visualizerCanvas, visualizerBufferLength);

const start = () => {
	if (isUsingMic) {
		if (currentTunerMode === "manual") {
			barTuner.drawSkeleton("white");
		}

		//get frequency data
		visualizerNode.getByteFrequencyData(visualizerDataArray);

		//draw visualizer
		visualizer.drawVisualizer(visualizerDataArray);
		requestAnimationFrame(start);
	}
};

const initializeTuner = () => {
	if (currentTunerMode === "manual") {
		barTuner.drawSkeleton(GREY);
	} else {
		barTuner.clear();
	}
};

//add eventListeners
micButton.addEventListener("click", toggleMic);

const modes = document.querySelectorAll(".tuner-mode");

for (let i = 0; i < modes.length; i++) {
	modes[i].addEventListener("click", () => {
		if (modes[i].htmlFor === "manual") {
			currentTunerMode = "manual";
		} else {
			currentTunerMode = "auto";
		}
		initializeTuner();
	});
}

//draw on canvas only after font is loaded
fontPoppins
	.load()
	.then(() => initializeTuner())
	.catch((err) => console.log(err));
