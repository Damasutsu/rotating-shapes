const rotateVec = (vec, angle) => {
	vec.x = Math.cos(angle) * (player.w * Math.SQRT2 / 2) + player.x;
	vec.y = Math.sin(angle) * (player.h * Math.SQRT2 / 2) + player.y;
	return vec;
};

const radians = (deg) => {
	return deg * Math.PI / 180;
};

let canvas, ctx;
let jsonFile = document.createElement('input'),
	reader = new FileReader();

jsonFile.setAttribute('type', 'file');
jsonFile.setAttribute('accept', 'application/json');

customElements.define('true-polygon', class extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({
			mode: 'closed'
		});
		canvas = document.createElement('canvas');
		ctx = canvas.getContext('2d');
		shadow.appendChild(canvas);
	}
});

customElements.define('text-spoiler', class extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({
			mode: 'closed'
		});
		this._text = document.createElement('div');
		shadow.appendChild(this._text);
		this._internals = this.attachInternals();
		this.addEventListener('contextmenu', this._oncontextmenu.bind(this));
		this._text.style.userSelect = 'none';
		this._text.style.msUserSelect = 'none';
		//this._isMobile = this._internals.states === undefined;
		this._text.style.WebkitUserSelect = 'none';
		this.addEventListener('touchstart', this._oncontextmenu.bind(this));
	}

	static get observedAttributes() {
		return ['text'];
	}

	get visible() {

		//if (this._isMobile) {
		return this.hasAttribute('visible');
		//} else {
		//	return this._internals.states.has('--visible');
		//}
	}

	attributeChangedCallback(name, _, newV) {
		//console.log(name, _, newV);
		this[name] = newV;
	}

	get text() {
		return this.getAttribute('text');
	}

	set text(content) {
		this._text.textContent = content;
	}

	set visible(flag) {
		if (flag) {
			//if (this._isMobile) {
			this.setAttribute('visible', '');
			//} else {
			//	this._internals.states.add('--visible');
			//}
		} else {

			//if (this._isMobile) {
			return this.removeAttribute('visible');
			//} else {
			//	this._internals.states.delete('--visible');
			//}
		}
	}

	_oncontextmenu(e) {
		e.preventDefault();
		this.visible = !this.visible;
	}
});

var favCan = document.createElement("canvas");
var favCtx = favCan.getContext("2d");
favCan.width = favCan.height = 96;
let player,
	points,
	favicon = document.head.querySelector('.favicon'),
	isRotating,
	size,
	timerOnFullscreen;

function draw() {
	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = lineWidth;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(player.x, player.y, player.w * Math.SQRT2 / 1.5, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();
	for (point of points) {
		rotateVec(point, point.angle + player.angle);
	}
	ctx.beginPath();
	for (let i = 0; i < points.length; i++) {
		if (i === 0) {
			ctx.moveTo(points[i].x, points[i].y);
		}
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.closePath();
	ctx.stroke();
	ctx.beginPath();
	if (points.length > 2) {
		//ctx.arc(player.x, player.y, Vector.dist(new Vector((points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2), player), 0, 2 * Math.PI);
	}
	ctx.closePath();
	ctx.stroke();
	if (isRotating) {
		if (isChangingDir) {
			player.angle -= radians(inc);
		} else {
			player.angle += radians(inc);
		}
	}
	if (document.fullscreenElement && timerOnFullscreen) {
		ctx.fillStyle = strokeStyle;
		ctx.font = "36px sans-serif";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		let now = new Date();
		time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
		date = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear().toString().padStart(2, '0')}`
		ctx.fillText(time, canvas.width / 2, 58);
		ctx.fillText(date, canvas.width / 2, canvas.height - 42);
		ctx.fillStyle = fillStyle;
	}
	favCtx.drawImage(canvas, 0, 0, favCan.width, favCan.height);
	favicon.href = favCan.toDataURL('image/png');
};

document.querySelector('#angles').addEventListener('input', (e) => {
	angles = parseFloat(e.target.value);
	stepAngle = 360 / angles;
	resIn.setAttribute('text', `180°(${angles} - 2) / ${angles} = 180° - (360° / ${angles}) = ${180 - stepAngle}°`);
	resOut.setAttribute('text', `360° - ${180 - stepAngle}° = ${180 + stepAngle}°`);
	points = [];
	for (var i = 0; i <= angles; i++) {
		points.push({
			x: 0,
			y: 0,
			angle: radians(stepAngle / 2 + stepAngle * i)
		});
	}
});

document.addEventListener('keydown', (e) => {
	if (e.code == 'F2') {
		e.preventDefault();
		var dataURL = canvas.toDataURL("image/png");
		var downloadLink = document.createElement('a');
		downloadLink.setAttribute('href', dataURL);
		downloadLink.setAttribute('download', 'image_' + Date.now() + '.png');
		downloadLink.setAttribute('target', '_blank');
		downloadLink.click();
		delete downloadLink;
	} else if (e.code == 'KeyS' && e.ctrlKey) {
		e.preventDefault();
	}
});

document.querySelector('#angle').addEventListener('input', (e) => {
	player.angle = radians(e.target.value);
});

document.querySelector('#lineWidth').addEventListener('input', (e) => {
	lineWidth = e.target.value;
});

document.querySelector('#inc').addEventListener('input', (e) => {
	inc = e.target.value;
});

document.querySelector('#stopRotating').addEventListener('input', (e) => {
	isRotating = !e.target.checked;
});

document.querySelector('#shapeColor').addEventListener('input', (e) => {
	strokeStyle = e.target.value;
});

document.querySelector('#changeDir').addEventListener('input', (e) => {
	isChangingDir = e.target.checked;
});

document.querySelector('#backColor').addEventListener('input', (e) => {
	fillStyle = e.target.value;
});

document.querySelector('#timer').addEventListener('input', (e) => {
	timerOnFullscreen = e.target.checked;
});

document.addEventListener('DOMContentLoaded', () => {
	size = document.querySelector('#size').value;
	canvas.width = canvas.height = size;
	player = {};
	player.x = canvas.width / 2;
	player.y = canvas.height / 2;
	player.w = canvas.width / 3;
	player.h = canvas.height / 3;
	player.angle = radians(document.querySelector('#angle').value);
	resIn = document.querySelector('.resIn');
	resOut = document.querySelector('.resOut');
	angles = parseFloat(document.querySelector('#angles').value);
	stepAngle = 360 / angles;
	resIn.setAttribute('text', `180°(${angles} - 2) / ${angles} = 180° - (360° / ${angles}) = ${180 - stepAngle}°`);
	resOut.setAttribute('text', `180° + (360° / ${angles}) = ${180 + stepAngle}°`);
	points = [];
	for (var i = 0; i <= angles; i++) {
		points.push({
			x: 0,
			y: 0,
			angle: radians(stepAngle / 2 + stepAngle * i)
		});
	}
	isRotating = !document.querySelector('#stopRotating').checked;
	timerOnFullscreen = document.querySelector('#timer').checked;
	isChangingDir = document.querySelector('#changeDir').checked;
	fillStyle = document.querySelector('#backColor').value;
	strokeStyle = document.querySelector('#shapeColor').value;
	inc = document.querySelector('#inc').value;
	lineWidth = document.querySelector('#lineWidth').value;
	Element.prototype.requestFullscreen = Element.prototype.requestFullScreen || Element.prototype.webkitRequestFullScreen || Element.prototype.mozRequestFullScreen || Element.prototype.msRequestFullScreen;
	setInterval(draw, 1000 / 60);
});

document.querySelector('#size').addEventListener('input', (e) => {
	size = e.target.value;
	canvas.width = canvas.height = size;
	player.x = canvas.width / 2;
	player.y = canvas.height / 2;
	player.w = canvas.width / 3;
	player.h = canvas.height / 3;
});

document.querySelector('#saveAsImage').addEventListener('click', (e) => {
	var dataURL = canvas.toDataURL("image/png");
	var downloadLink = document.createElement('a');
	downloadLink.setAttribute('href', dataURL);
	downloadLink.setAttribute('download', 'image_' + Date.now() + '.png');
	downloadLink.setAttribute('target', '_blank');
	downloadLink.click();
	delete downloadLink;
});

document.querySelector('#saveAsJSON').addEventListener('click', (e) => {
	dataURL = {};
	dataURL.points = points.map((point) => {
		return {
			angle: point.angle,
			distance: player.w * Math.SQRT2 / 2
		};
	});
	var downloadLink = document.createElement('a');
	downloadLink.setAttribute('href', 'data:application/json;base64,' + btoa(JSON.stringify(dataURL)));
	downloadLink.setAttribute('download', 'json_' + Date.now() + '.json');
	downloadLink.setAttribute('target', '_blank');
	downloadLink.click();
	delete downloadLink;
});

document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});

document.querySelector('#full').addEventListener('click', (e) => {
	canvas.requestFullscreen();
});

document.addEventListener('fullscreenchange', (e) => {
	if (document.fullscreenElement) {
		document.body.style.cursor = 'none';
	} else {
		document.body.style.cursor = 'default';
	}
});
