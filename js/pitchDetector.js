const detectPitch = (buffer) => {
	const SAMPLE_RATE = 44100;
	let size = buffer.length;
	let rms = 0; //root mean square

	for (let i = 0; i < size; i++) {
		let val = buffer[i];
		rms += val * val;
	}
	rms = Math.sqrt(rms / size);

	//rms less that 0.01 means signal is not enough
	if (rms < 0.01) return -1;

	//auto correlation
	let correlatedValues = new Array(size).fill(0); // fill array with 0 to store sum

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size - i; j++) {
			correlatedValues[i] += buffer[j] * buffer[j + i];
		}
	}
	//max value is only calulated after the first dip because the first max maybe false maximum
	let firstDipPos = 0;
	while (correlatedValues[firstDipPos] > correlatedValues[firstDipPos + 1]) {
		firstDipPos++;
	}

	let maxValue = -1,
		maxPosition = -1;
	for (let i = firstDipPos; i < size; i++) {
		if (correlatedValues[i] > maxValue) {
			maxValue = correlatedValues[i];
			maxPosition = i;
		}
	}

	let T0 = maxPosition;

	//parabolic interpolation is used for precision
	const x1 = correlatedValues[T0 - 1];
	const x2 = correlatedValues[T0];
	const x3 = correlatedValues[T0 + 1];
	const a = (x1 + x3 - 2 * x2) / 2;
	const b = (x3 - x1) / 2;

	//find error
	const error = b / (2 * a);

	T0 = T0 - error;

	return SAMPLE_RATE / T0;
};
