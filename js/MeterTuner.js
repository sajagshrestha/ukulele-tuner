class MeterTuner {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.x = this.canvas.width / 2;
		this.y = this.canvas.width / 2 + 20;
		this.radius = 250;
		this.tunerColor = CYAN;
	}
	drawTuner() {}
	drawSkeleton(color) {
		this.ctx.translate(this.x, this.y);

		this.ctx.shadowBlur = 20;
		this.ctx.shadowColor = CYAN;
		this.ctx.strokeStyle = CYAN;

		//draw arc
		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.radius, -Math.PI, 0);
		this.ctx.lineWidth = 3;
		this.ctx.strokeStyle = CYAN;
		this.ctx.stroke();
		//draw line
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0);
		this.ctx.strokeStyle = CYAN;

		this.ctx.lineTo(0, -this.radius);
		this.ctx.stroke();

		//draw dot
		this.ctx.beginPath();
		this.ctx.fillStyle = CYAN;
		this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
		this.ctx.fill();

		this.ctx.shadowBlur = 0;
		this.ctx.shadowColor = 0;
		//draw note
		this.ctx.font = "bold 24px Roboto";
		this.ctx.fillStyle = color;
		this.ctx.fillText("\u266d", -250, -220);
		this.ctx.fillText("\u266f", 220, -220);
		this.ctx.font = `bold 64px Roboto`;
		this.ctx.fillText(notes[currentNoteIndex].note, -20, 80);
		this.ctx.translate(-this.x, -this.y);
	}
	update() {
		this.clear();
		this.drawSkeleton(WHITE);
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
