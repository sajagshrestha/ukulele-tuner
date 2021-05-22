const tunings = [
	//array of diffrent tunings, first one being standard tuning
	{
		name: "GCEA",
		notes: [
			{
				note: "G",
				freq: 392,
			},
			{
				note: "C",
				freq: 261.63,
			},
			{
				note: "E",
				freq: 329.63,
			},
			{
				note: "A",
				freq: 440,
			},
		],
	},
];

let currentTuning = 0;
let currentNoteIndex = 0;

//default current note to first note
let notes = tunings[currentTuning].notes;
