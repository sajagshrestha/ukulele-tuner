//canvas
const tunerCanvas = document.getElementById("tuner-canvas");
const visualizerCanvas = document.getElementById("visualizer-canvas");
// const vContext = visualizerCanvas.getContext("2d");
tunerCanvas.width = 570;
tunerCanvas.height = 480;

visualizerCanvas.width = 500;
visualizerCanvas.height = 250;

//font to use in canvas
const fontRoboto = new FontFace(
	"Roboto",
	"url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Me5Q.ttf)"
);

//audio context
const audioContext = new AudioContext();
const tunerNode = new AnalyserNode(audioContext, { fftSize: 2048 }); //web audio api's anaylzer node that connects to mic input
const visualizerNode = new AnalyserNode(audioContext, { fftSize: 64 }); //analyzer node for visualizer

//to store discrete frequency values for pitch detection
const tunerBufferLength = tunerNode.frequencyBinCount; //may not need this REFACTOR NEEDED
const tunerDataArray = new Float32Array(tunerBufferLength);

//to store frequency values for visualizer
const visualizerBufferLength = visualizerNode.frequencyBinCount;
const visualizerDataArray = new Uint8Array(visualizerBufferLength);

//elements from DOM
const micButton = document.querySelector(".mic-button");
const noteButtons = document.querySelectorAll(".note-button");

//mic state
let isUsingMic = false;

//colors
const CYAN = "#5CC1A9";
const GREY = "#868686";
const WHITE = "#fff";
const RED = "#C15C5C";

//constants
const LOW_FREQ_THRES = 200;
const HIGH_FREQ_THRES = 500;

//current tuner mode
let currentTunerMode = "manual";

//tuner type
let currentTunerType = "meter";

const barTuner = new BarTuner(tunerCanvas);
const meterTuner = new MeterTuner(tunerCanvas);
const visualizer = new Visualizer(visualizerCanvas, visualizerBufferLength);

const start = () => {
	if (isUsingMic) {
		//get frequnecy data for tuner;
		tunerNode.getFloatTimeDomainData(tunerDataArray);
		let freq = detectPitch(tunerDataArray);
		//filter low and high freq
		if (freq > HIGH_FREQ_THRES || freq < LOW_FREQ_THRES) {
			freq = notes[currentNoteIndex].freq;
		}
		let diff;
		//manual tuner
		if (currentTunerMode === "manual") {
			diff = freq - notes[currentNoteIndex].freq;
		} else {
			//auto tuner
			//calculate closest note
			let tempDiff = HIGH_FREQ_THRES;
			notes.forEach((note, index) => {
				diff = freq - note.freq;
				if (Math.abs(diff) < Math.abs(tempDiff)) {
					tempDiff = diff;
					currentNoteIndex = index;
				}
			});

			diff = tempDiff;
		}

		//draw tuner
		if (currentTunerType === "bar") {
			barTuner.update(diff);
		} else {
			meterTuner.update();
		}

		//get frequency data for visualizer
		visualizerNode.getByteFrequencyData(visualizerDataArray);
		//draw visualizer
		visualizer.drawVisualizer(visualizerDataArray);
		requestAnimationFrame(start);
	}
};

const initializeTuner = () => {
	if (currentTunerType === "bar") {
		barTuner.clear();
		barTuner.drawSkeleton(GREY);
	} else {
		meterTuner.clear();
		meterTuner.drawTuner(GREY);
		meterTuner.drawNotes(GREY);
	}
};

//add eventListeners to radio buttons

//mode
micButton.addEventListener("click", toggleMic);
const modes = document.querySelectorAll(".tuner-mode");
for (let i = 0; i < modes.length; i++) {
	modes[i].addEventListener("click", () => {
		if (modes[i].htmlFor === "manual") {
			currentTunerMode = "manual";
			//when switching back to manual mode set current note to first note
			currentNoteIndex = 0;
			noteButtons[currentNoteIndex].classList.add("active");
		} else {
			currentTunerMode = "auto";
			//remove active styles from notebutton with auto mode
			for (let i = 0; i < noteButtons.length; i++) {
				noteButtons[i].classList.remove("active");
			}
		}
		initializeTuner();
	});
}

//add eventListeners for note buttons
if ((currentTunerMode = "manual")) {
	for (let i = 0; i < noteButtons.length; i++) {
		noteButtons[i].addEventListener("click", () => {
			currentNoteIndex = i;
			for (let j = 0; j < noteButtons.length; j++) {
				if (j === currentNoteIndex) {
					noteButtons[j].classList.add("active");
				} else {
					noteButtons[j].classList.remove("active");
				}
			}
			//clicking note buttons will chnage mode to manual
			currentTunerMode = "manual";
			document.getElementById("manual").checked = true;
		});
	}
}

//draw on canvas only after font is loaded
fontRoboto
	.load()
	.then(() => initializeTuner())
	.catch((err) => console.log(err));
