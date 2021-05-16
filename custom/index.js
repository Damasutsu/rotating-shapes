const rotateVec = (vec, angle) => {
	vec.x = Math.cos(angle) * vec.distance + player.x;
	vec.y = Math.sin(angle) * vec.distance + player.y;
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

customElements.define('custom-shape', class extends HTMLElement {
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
var favCan = document.createElement("canvas");
var favCtx = favCan.getContext("2d");
favCan.width = favCan.height = 128;

let player,
	points = [],
	size,
	lastSize,
	isRotating = true;
favicon = document.head.querySelector('.favicon');

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
			if (points.length < 2) {
				ctx.rect(points[i].x, points[i].y, 1, 1);
			}
			ctx.moveTo(points[i].x, points[i].y);
		}
		ctx.lineTo(points[i].x, points[i].y);
	}
	if (close) {
		ctx.closePath();
	}
	ctx.stroke();
	if (isRotating) {
		player.angle += radians(inc);
	}
	if (document.fullscreenElement && timerOnFullscreen) {
		ctx.fillStyle = strokeStyle;
		ctx.textBaseline = "middle";
		ctx.font = `${canvas.width * (36 / 800)}px sans-serif`;
		ctx.textAlign = "center";
		let now = new Date();
		time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
		date = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear().toString().padStart(2, '0')}`
		ctx.fillText(time, canvas.width / 2, canvas.width * (58 / 800));
		ctx.fillText(date, canvas.width / 2, canvas.height - (canvas.width * (42 / 800)));
		ctx.fillStyle = fillStyle;
	}
	favCtx.drawImage(canvas, 0, 0, favCan.width, favCan.height);
	favicon.href = favCan.toDataURL('image/png');
};

document.querySelector('#angle').addEventListener('input', (e) => {
	player.angle = radians(e.target.value);
});

canvas.addEventListener('click', (e) => {
	if (!document.fullscreenElement) {
		length = points.length;
		points.push({
			x: e.layerX / canvas.clientWidth * size,
			y: e.layerY / canvas.clientHeight * size
		});
		points[length].angle = Vector.sub(new Vector(points[length].x, points[length].y), player).angle - player.angle;
		points[length].distance = Vector.dist(points[length], player);
	}
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

document.querySelector('#timer').addEventListener('input', (e) => {
	timerOnFullscreen = e.target.checked;
});

document.querySelector('#shapeColor').addEventListener('input', (e) => {
	strokeStyle = e.target.value;
});

document.querySelector('#reset').addEventListener('click', (e) => {
	points = [];
});

document.querySelector('#close').addEventListener('input', (e) => {
	if (points.length > 0) {
		points.push(points[0]);
	}
});

document.querySelector('#undo').addEventListener('click', (e) => {
	points.splice(points.length - 1, 1);
});

document.addEventListener('keydown', (e) => {
	if (e.code == 'KeyZ' && e.ctrlKey) {
		e.preventDefault();
		points.splice(points.length - 1, 1);
	} else if (e.code == 'F2') {
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

document.querySelector('#backColor').addEventListener('input', (e) => {
	fillStyle = e.target.value;
});

document.addEventListener('DOMContentLoaded', () => {
	size = document.querySelector('#size').value;
	lastSize = size;
	canvas.width = canvas.height = size;
	player = {};
	player.x = canvas.width / 2;
	player.y = canvas.height / 2;
	player.w = canvas.width / 3;
	player.h = canvas.height / 3;
	player.angle = radians(document.querySelector('#angle').value);
	isRotating = !document.querySelector('#stopRotating').checked;
	timerOnFullscreen = document.querySelector('#timer').checked;
	fillStyle = document.querySelector('#backColor').value;
	strokeStyle = document.querySelector('#shapeColor').value;
	inc = document.querySelector('#inc').value;
	close = document.querySelector('#close').checked;
	lineWidth = document.querySelector('#lineWidth').value;
	Element.prototype.requestFullscreen = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.mozRequestFullscreen || Element.prototype.msRequestFullscreen;
	setInterval(draw, 1000 / 60);
});

Element.prototype.addEventsListener = function(events, callback) {
	events.forEach((event) => {
		this.addEventListener(event, callback);
	});
};

document.querySelector('#size').addEventListener('input', (e) => {
	size = e.target.value;
	canvas.width = canvas.height = size;
	player.x = canvas.width / 2;
	player.y = canvas.height / 2;
	player.w = canvas.width / 3;
	player.h = canvas.height / 3;
	points.forEach((point) => {
		point.distance = (point.distance / lastSize) * size;
	});
	lastSize = size;
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

document.querySelector('#upload').addEventListener('click', (e) => {
	jsonFile.click();
});

canvas.addEventsListener(['dragover', 'drop'], (e) => {
	e.preventDefault()
	e.stopPropagation();
	if (e.type === 'drop') {
		jsonFile.files = e.dataTransfer.files;
		jsonFile.dispatchEvent(new Event('change'));
	}
});

jsonFile.addEventListener('change', (e) => {
	if (jsonFile.files[0].type === 'application/json') {
		reader.readAsText(jsonFile.files[0]);
	}
});

reader.addEventListener('load', (e) => {
	result = JSON.parse(reader.result);
	if (!result.points) {
		let e = new Error('Невозможно разобрать входные данные');
		throw e;
	} else {
		points = result.points;
		jsonFile.value = '';
	}
});

document.querySelector('#full').addEventListener('click', (e) => {
	canvas.requestFullscreen();
});

canvas.addEventListener('fullscreenchange', (e) => {
	if (document.fullscreenElement) {
		document.body.style.cursor = 'none';
	} else {
		document.body.style.cursor = 'default';
	}
});

document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});
