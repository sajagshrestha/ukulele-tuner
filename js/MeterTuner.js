class MeterTuner {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.x = this.canvas.width / 2;
		this.y = this.canvas.width / 2 + 20;
		this.radius = 250;
		this.tunerColor = CYAN;
		this.shadowBlur = 0;
		this.tunerAngle = 0;
	}
	drawTuner(color) {
		this.ctx.translate(this.x, this.y);

		this.ctx.shadowBlur = this.shadowBlur;
		this.ctx.shadowColor = color;
		this.ctx.strokeStyle = color;
		//draw arc
		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.radius, -Math.PI, 0);
		this.ctx.lineWidth = 3;
		this.ctx.strokeStyle = color;
		this.ctx.stroke();
		//draw line
		this.ctx.rotate(this.tunerAngle);
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0);
		this.ctx.strokeStyle = color;

		this.ctx.lineTo(0, -this.radius + 5);
		this.ctx.stroke();
		this.ctx.rotate(-this.tunerAngle);
		//draw dot
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
		this.ctx.fill();

		this.ctx.shadowBlur = 0;
		this.ctx.shadowColor = 0;
		this.ctx.translate(-this.x, -this.y);
	}
	drawNotes(color) {
		this.ctx.translate(this.x, this.y);
		this.ctx.font = "bold 24px Roboto";
		this.ctx.fillStyle = color;
		this.ctx.fillText("\u266d", -250, -220);
		this.ctx.fillText("\u266f", 220, -220);
		this.ctx.font = `bold 64px Roboto`;
		this.ctx.fillText(notes[currentNoteIndex].note, -20, 80);
		this.ctx.translate(-this.x, -this.y);
	}
	drawFreqDiff() {}
	update(diff) {
		this.clear();
		if (diff > -2 && diff < 2) {
			//in tune
			this.tunerColor = CYAN;
		} else if (diff > 0) {
			//tune down
			this.tunerAngle += 0.08;
			this.tunerColor = RED;
		} else {
			//tune up
			this.tunerAngle -= 0.03;
			this.tunerColor = RED;
		}
		let newAngle = mapToRange(diff, -60, 60, -Math.PI / 2, Math.PI / 2);
		if (Math.abs(this.tunerAngle) >= Math.abs(newAngle)) {
			this.tunerAngle = newAngle;
		}
		this.shadowBlur = 20;
		this.drawTuner(this.tunerColor);
		this.shadowBlur = 0;
		this.drawNotes(WHITE);
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
