class BarTuner {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.x = this.canvas.width / 2;
		this.y = 30;
		this.height = this.canvas.height - 140;
		this.tunerX = 0;
		this.tunerColor = CYAN;
	}
	drawTuner() {
		this.ctx.translate(this.x, this.y);
		//draw line
		this.ctx.beginPath();
		this.ctx.moveTo(this.tunerX, 0);
		this.ctx.lineWidth = 3;
		this.ctx.lineTo(this.tunerX + this.ctx.lineWidth / 2, this.height);
		this.ctx.shadowBlur = 20;
		this.ctx.shadowColor = this.tunerColor;
		this.ctx.strokeStyle = this.tunerColor;
		this.ctx.stroke();

		//draw arc()
		this.ctx.beginPath();
		this.ctx.fillStyle = this.tunerColor;
		this.ctx.arc(
			this.tunerX + this.ctx.lineWidth / 2,
			this.height,
			5,
			0,
			Math.PI * 2
		);
		this.ctx.fill();
		//remove shadows for other elements
		this.ctx.shadowBlur = 0;
		this.ctx.shadowColor = 0;
		this.ctx.translate(-this.x, -this.y);
	}
	drawSkeleton(color) {
		this.ctx.translate(this.x, this.y); // translate context to center

		//draw line
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0);
		this.ctx.lineWidth = 3;
		this.ctx.lineTo(this.ctx.lineWidth / 2, this.height);
		this.ctx.strokeStyle = color;
		this.ctx.stroke();

		//draw dot
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(this.ctx.lineWidth / 2, this.height, 5, 0, Math.PI * 2);
		this.ctx.fill();

		//draw text
		this.ctx.font = "bold 24px Roboto";
		this.ctx.fillStyle = color;

		this.ctx.textAlign = "center";
		this.ctx.fillText("\u266d", -250, 20);
		this.ctx.fillText("\u266f", 250, 20);
		this.ctx.font = `bold 64px Roboto`;
		this.ctx.fillText(
			notes[currentNoteIndex].note,
			0,
			this.canvas.height - 60
		);

		this.ctx.translate(-this.x, -this.y); //t
	}
	update(diff) {
		this.clear();
		// this.ctx.fillText(diff.toFixed(2), 20, 120);

		if (diff > -1.5 && diff < 1.5) {
			//in tune
			this.tunerColor = CYAN;
		} else if (diff > 0) {
			//tune down
			this.tunerX += 5;
			this.tunerColor = RED;
		} else {
			//tune up
			this.tunerX -= 5;
			this.tunerColor = RED;
		}
		//map to fit canvas
		let mappedFreq = mapToRange(
			diff,
			-100,
			100,
			-this.canvas.width / 2,
			this.canvas.width / 2
		);
		if (Math.abs(this.tunerX) > Math.abs(mappedFreq)) {
			this.tunerX = mappedFreq;
		}
		this.drawSkeleton(WHITE);
		this.drawTuner();
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
