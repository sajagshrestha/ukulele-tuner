const detectPitch = (buffer) => {
	// refrenced from https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
	const sampleRate = 44100;
	let SIZE = buffer.length;
	let rms = 0;

	for (let i = 0; i < SIZE; i++) {
		let val = buffer[i];
		rms += val * val;
	}
	rms = Math.sqrt(rms / SIZE);
	if (rms < 0.01)
		// not enough signal
		return -1;

	let r1 = 0,
		r2 = SIZE - 1,
		thres = 0.2;
	for (let i = 0; i < SIZE / 2; i++)
		if (Math.abs(buffer[i]) < thres) {
			r1 = i;
			break;
		}
	for (let i = 1; i < SIZE / 2; i++)
		if (Math.abs(buffer[SIZE - i]) < thres) {
			r2 = SIZE - i;
			break;
		}

	buffer = buffer.slice(r1, r2);
	SIZE = buffer.length;

	let c = new Array(SIZE).fill(0);
	for (let i = 0; i < SIZE; i++)
		for (let j = 0; j < SIZE - i; j++)
			c[i] = c[i] + buffer[j] * buffer[j + i];

	let d = 0;
	while (c[d] > c[d + 1]) d++;
	let maxval = -1,
		maxpos = -1;
	for (let i = d; i < SIZE; i++) {
		if (c[i] > maxval) {
			maxval = c[i];
			maxpos = i;
		}
	}
	let T0 = maxpos;

	let x1 = c[T0 - 1],
		x2 = c[T0],
		x3 = c[T0 + 1];
	a = (x1 + x3 - 2 * x2) / 2;
	b = (x3 - x1) / 2;
	if (a) T0 = T0 - b / (2 * a);

	return sampleRate / T0;
};
