class Visualizer {
	constructor(canvas, bufferLength, color) {
		this.canvas = canvas;
		this.bufferLength = bufferLength;
		this.color = color;
		this.ctx = this.canvas.getContext("2d");
		this.barWidth = this.canvas.width / this.bufferLength;
		this.barHeight = 0;
		this.barX = 0;
	}
	drawVisualizer(dataArray) {
		this.clear();
		for (let i = 0; i < this.bufferLength; i++) {
			this.barHeight = dataArray[i] / 2; //scale down to fit canvas
			this.ctx.fillStyle = this.color;
			this.ctx.shadowBlur = 10;
			this.ctx.shadowColor = this.color;
			this.ctx.fillRect(
				this.barX,
				this.canvas.height - this.barHeight,
				this.barWidth,
				this.barHeight
			);
			this.barX += this.barWidth;
		}
		this.barX = 0;
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
