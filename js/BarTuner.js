class BarTuner {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.x = this.canvas.width / 2;
		this.y = 30;
		this.height = this.canvas.height - 140;
	}
	draw() {
		this.ctx.translate(this.x, this.y); // transalte context to center

		this.ctx.translate(-this.x, -this.y); //translate context back
	}
	drawSkeleton(color) {
		this.clear();
		this.ctx.translate(this.x, this.y); // transalte context to center
		//draw line
		this.ctx.font = " 50px Poppins";
		this.ctx.fillStyle = color;
		this.ctx.fillText("b", -250, 35);
		this.ctx.fillText("#", 210, 35);
		this.ctx.font = " 64px Poppins";
		this.ctx.fillText(
			notes[currentNoteIndex].note,
			-25,
			this.canvas.height - 60
		);
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0);
		this.ctx.lineWidth = 3;
		this.ctx.lineTo(0, this.height);
		this.ctx.strokeStyle = color;
		this.ctx.stroke();
		this.ctx.closePath();
		console.log(color);
		//draw dot
		this.ctx.arc(0, this.height, 5, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.translate(-this.x, -this.y); //t
	}
	update() {}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
