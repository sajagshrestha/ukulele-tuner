const mapToRange = (value, inMin, inMAx, outMin, outMax) => {
	const newValue =
		((value - inMin) * (outMax - outMin)) / (inMAx - inMin) + outMin;
	if (newValue < outMin) return outMin;
	else if (newValue > outMax) return outMax;
	else return newValue;
};

const getHSL = (h, s, l) => {
	return `hsl(${h},${s}%,${l}%)`;
};
