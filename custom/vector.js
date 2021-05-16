class Vector {
	#x
	#y
	#z
	constructor(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	get x() {
		return this.#x;
	}

	set x(val) {
		this.#x = Number(val.toFixed(15));
	}

	get y() {
		return this.#y;
	}

	set y(val) {
		this.#y = Number(val.toFixed(15));
	}


	get z() {
		return this.#z;
	}

	set z(val) {
		this.#z = Number(val.toFixed(15));
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}

	static dot(vec, vec2) {
		return vec.x * vec2.x + vec.y * vec2.y + vec.z * vec2.z;
	}

	static cross(vec, vec2) {
		return vec.x * vec2.x - vec.y * vec2.y - vec.z * vec2.z;
	}

	get angle() {
		return Math.atan2(this.y, this.x);
	}

	static fromAngle(angle) {
		let x, y;
		x = Math.cos(angle);
		y = Math.sin(angle);
		return new Vector(x, y);
	}

	setAngle(angle) {
		this.x = Math.cos(angle);
		this.y = Math.sin(angle);
	}

	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	get lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
	}

	static add(vec, vec2) {
		let x, y, z;
		x = vec.x + vec2.x;
		y = vec.y + vec2.y;
		z = vec.z + vec2.z;
		return new Vector(x, y, z);
	}

	sub(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;
	}

	static sub(vec, vec2) {
		let x = vec.x - vec2.x,
			y = vec.y - vec2.y,
			z = vec.z - vec2.z;
		return new Vector(x, y, z);
	}

	mult(vec) {
		this.x *= vec.x;
		this.y *= vec.y;
		this.z *= vec.z;
	}

	static mult(vec, vec2) {
		let x = vec.x * vec2.x,
			y = vec.y * vec2.y,
			z = vec.z * vec2.z;
		return new Vector(x, y, z);
	}

	div(vec) {
		if (this.x !== 0 && vec.x !== 0) {
			this.x = this.x / vec.x;
		} else {
			this.x = 0;
		}

		if (this.y !== 0 && vec.y !== 0) {
			this.y = this.y / vec.y;
		} else {
			this.y = 0;
		}

		if (this.z !== 0 && vec.z !== 0) {
			this.z = this.z / vec.z;
		} else {
			this.z = 0;
		}
	}

	static div(vec, vec2) {
		let x, y, z;
		if (vec.x !== 0 && vec2.x !== 0) {
			x = vec.x / vec2.x;
		} else {
			x = 0;
		}

		if (vec.y !== 0 && vec2.y !== 0) {
			y = vec.y / vec2.y;
		} else {
			y = 0;
		}

		if (vec.z !== 0 && vec2.z !== 0) {
			z = vec.z / vec2.z;
		} else {
			z = 0;
		}
		return new Vector(x, y, z);
	}

	norm() {
		let len = new Vector(this.length, this.length);
		this.div(len);
	}

	static norm(vec) {
		let len = new Vector(vec.length, vec.length);
		return Vector.div(vec, len);
	}


	dist(vec) {
		let a = this.x - vec.x,
			b = this.y - vec.y;
		return Math.sqrt(a * a + b * b);
	}

	static dist(vec, vec2) {
		let a = vec.x - vec2.x,
			b = vec.y - vec2.y;
		return Math.sqrt(a * a + b * b);
	}

	copy() {
		return new Vector(this.x, this.y, this.z);
	}
}