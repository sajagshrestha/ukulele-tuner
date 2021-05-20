class Visualizer {
	constructor(canvas, bufferLength, color) {
		this.canvas = canvas;
		this.bufferLength = bufferLength;
		this.ctx = this.canvas.getContext("2d");
		this.barWidth = this.canvas.width / this.bufferLength / 1.5;
		this.barHeight = 0;
		this.barX = 0;
	}
	drawVisualizer(dataArray) {
		this.clear();
		for (let i = 0; i < this.bufferLength; i++) {
			this.barHeight =
				mapToRange(dataArray[i], 0, 255, 0, this.canvas.height) / 1.5; //0-255 is the range of values from visualizerNode /1.5 to scale down height
			this.ctx.fillStyle = "white";
			this.ctx.shadowBlur = 10;
			this.ctx.shadowColor = getHSL(
				mapToRange(dataArray[i], 0, 255, 0, 360),
				45,
				56
			); //louder the sound higher the hue
			this.ctx.fillRect(
				this.barX,
				this.canvas.height - this.barHeight,
				this.barWidth,
				this.barHeight
			);
			this.barX += this.barWidth + 7; //add gap between bars
		}
		this.barX = 0;
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
