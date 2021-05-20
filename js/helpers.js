const mapToRange = (result, in_min, in_max, out_min, out_max) => {
	return (
		((result - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
	);
};

const getHSL = (h, s, l) => {
	return `hsl(${h},${s}%,${l}%)`;
};

// function generateRandomIntegerBetween(minValue, maxValue) {
// 	return Math.floor(Math.random() * (maxValue - minValue) + minValue);
// }
