//canvas
const tunerCanvas = document.getElementById("tuner-canvas");
const visualizerCanvas = document.getElementById("visualizer-canvas");

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
const tunerNode = new AnalyserNode(audioContext, { fftSize: 1024 }); //web audio api's anaylzer node that connects to mic input
const visualizerNode = new AnalyserNode(audioContext, { fftSize: 64 }); //analyzer node for visualizer

//to store discrete frequency values for pitch detection
const tunerBufferLength = tunerNode.frequencyBinCount;
const tunerDataArray = new Float32Array(tunerBufferLength);

//to store frequency values for visualizer
const visualizerBufferLength = visualizerNode.frequencyBinCount;
const visualizerDataArray = new Uint8Array(visualizerBufferLength);

//DOM elements
const micButton = document.querySelector(".mic-button");
const noteButtons = document.querySelectorAll(".note-button");

//colors
const CYAN = "#5CC1A9";
const GREY = "#868686";
const WHITE = "#fff";
const RED = "#C15C5C";

//constants
const LOW_FREQ_THRES = 200;
const HIGH_FREQ_THRES = 500;

//app state
let isUsingMic = false;
let currentTunerMode = localStorage.getItem("currentTunerMode") || "manual";
let currentTunerType = localStorage.getItem("currentTunerType") || "bar";
let currentTuningIndex =
	parseInt(localStorage.getItem("currentTuningIndex")) || 0;
let currentNoteIndex = 0;
let notes = tunings[currentTuningIndex].notes; //default current note to first note in array

//tuner an visualizer init
const barTuner = new BarTuner(tunerCanvas);
const meterTuner = new MeterTuner(tunerCanvas);
const visualizer = new Visualizer(visualizerCanvas, visualizerBufferLength);

//main loop
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
			meterTuner.update(diff);
		}

		//get frequency data for visualizer
		visualizerNode.getByteFrequencyData(visualizerDataArray);
		//draw visualizer
		visualizer.drawVisualizer(visualizerDataArray);
		requestAnimationFrame(start);
	}
};

const renderTuner = () => {
	if (currentTunerType === "bar") {
		barTuner.clear();
		barTuner.drawSkeleton(GREY);
	} else {
		meterTuner.clear();
		meterTuner.resetAngle();
		meterTuner.drawTuner(GREY);
		meterTuner.drawNotes(GREY);
	}
};

const populateNoteButtons = () => {
	for (let i = 0; i < noteButtons.length; i++) {
		noteButtons[i].innerText = notes[i].note;
	}
};

//add eventListeners to radio buttons
//mode
const modeRadioBtns = document.querySelectorAll(".tuner-mode");
for (let i = 0; i < modeRadioBtns.length; i++) {
	modeRadioBtns[i].addEventListener("click", () => {
		if (modeRadioBtns[i].htmlFor === "manual") {
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
		localStorage.setItem("currentTunerMode", currentTunerMode);
		//rerender after mode change
		renderTuner();
	});
}

//tuner type
const tunerTypeRadioBtns = document.querySelectorAll(".tuner-type");
for (let i = 0; i < tunerTypeRadioBtns.length; i++) {
	tunerTypeRadioBtns[i].addEventListener("click", () => {
		if (tunerTypeRadioBtns[i].htmlFor === "bar") {
			currentTunerType = "bar";
		} else {
			currentTunerType = "meter";
		}
		localStorage.setItem("currentTunerType", currentTunerType);
		//rerender after tuner type change
		renderTuner();
	});
}

//tunings
const tuningRadioBtns = document.querySelectorAll(".tuning");
for (let i = 0; i < tuningRadioBtns.length; i++) {
	tuningRadioBtns[i].addEventListener("click", () => {
		tunings.forEach((tuning, index) => {
			if (tuningRadioBtns[i].htmlFor === tuning.name) {
				currentTuningIndex = index;
				localStorage.setItem("currentTuningIndex", currentTuningIndex);
				notes = tunings[currentTuningIndex].notes;
			}
		});
		//rerender buttons and canvas after tuning changes
		populateNoteButtons();
		renderTuner();
	});
}

//add eventListeners for note buttons
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
		//clicking note buttons will change mode to manual
		currentTunerMode = "manual";
		document.getElementById("manual").checked = true;
		renderTuner();
	});
}

//add event Listener to mic
micButton.addEventListener("click", toggleMic);

//check active radio buttons fir first render
document.getElementById(`${currentTunerMode}`).checked = true;
document.getElementById(`${currentTunerType}`).checked = true;
document.getElementById(`${tunings[currentTuningIndex].name}`).checked = true;

//set first note button to active in manual mode for first render
if (currentTunerMode === "manual") noteButtons[0].classList.add("active");

//insert default note buttons
populateNoteButtons();

//draw on canvas only after font is loaded
fontRoboto
	.load()
	.then((font) => {
		document.fonts.add(font);
		renderTuner();
	})
	.catch((err) => console.log(err));
