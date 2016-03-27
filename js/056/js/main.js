/*
 * WebGL Water
 * http://madebyevan.com/webgl-water/
 *
 * Copyright 2011 Evan Wallace
 * Released under the MIT license
 */

function text2html(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

function handleError(text) {
	var html = text2html(text);
	if (html == 'WebGL not supported') {
		html = 'Your browser does not support WebGL.<br>Please see\
<a href="http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">\
Getting a WebGL Implementation</a>.';
	}
	var loading = document.getElementById('loading');
	loading.innerHTML = html;
	loading.style.zIndex = 1;
}

window.onerror = handleError;

var gl = GL.create();
var water;
var cubemap;
var renderer;
var angleX = -25;
var angleY = -200.5;

var paused = false;

window.onload = function() {
	var ratio = window.devicePixelRatio || 1;

	function onresize() {
		var width = innerWidth - 20;
		var height = innerHeight;
		gl.canvas.width = width * ratio;
		gl.canvas.height = height * ratio;
		gl.canvas.style.width = width + 'px';
		gl.canvas.style.height = height + 'px';
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.matrixMode(gl.PROJECTION);
		gl.loadIdentity();
		gl.perspective(45, gl.canvas.width / gl.canvas.height, 0.01, 100);
		gl.matrixMode(gl.MODELVIEW);
		draw();
	}

	document.body.appendChild(gl.canvas);
	gl.clearColor(0, 0, 0, 1);

	water = new Water();
	renderer = new Renderer();
	cubemap = new Cubemap({
		xneg: document.getElementById('xneg'),
		xpos: document.getElementById('xpos'),
		yneg: document.getElementById('ypos'),
		ypos: document.getElementById('ypos'),
		zneg: document.getElementById('zneg'),
		zpos: document.getElementById('zpos')
	});

	if (!water.textureA.canDrawTo() || !water.textureB.canDrawTo()) {
		throw new Error('Rendering to floating-point textures is required but not supported');
	}

	for (var i = 0; i < 20; i++) {
		water.addDrop(Math.random() * 2 - 1, Math.random() * 2 - 1, 0.03, (i & 1) ? 0.01 : -0.01);
	}

	document.getElementById('loading').innerHTML = '';
	onresize();

	var requestAnimationFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		function(callback) { setTimeout(callback, 0); };

	var prevTime = new Date().getTime();
	function animate() {
		var nextTime = new Date().getTime();
		if (!paused) {
			update((nextTime - prevTime) / 1000);
			draw();
		}
		prevTime = nextTime;
		requestAnimationFrame(animate);
	}
	requestAnimationFrame(animate);

	window.onresize = onresize;

	var planeNormal;
	var mode = -1;
	var MODE_ADD_DROPS = 0;
	var MODE_ORBIT_CAMERA = 2;

	var oldX, oldY;

	function startDrag(x, y) {
		oldX = x;
		oldY = y;
		var tracer = new GL.Raytracer();
		var ray = tracer.getRayForPixel(x * ratio, y * ratio);
		var pointOnPlane = tracer.eye.add(ray.multiply(-tracer.eye.y / ray.y));
		if (Math.abs(pointOnPlane.x) < 1 && Math.abs(pointOnPlane.z) < 1) {
			mode = MODE_ADD_DROPS;
			duringDrag(x, y);
		} else {
			mode = MODE_ORBIT_CAMERA;
		}
	}

	function duringDrag(x, y) {
		switch (mode) {
		case MODE_ADD_DROPS: {
			var tracer = new GL.Raytracer();
			var ray = tracer.getRayForPixel(x * ratio, y * ratio);
			var pointOnPlane = tracer.eye.add(ray.multiply(-tracer.eye.y / ray.y));
			water.addDrop(pointOnPlane.x, pointOnPlane.z, 0.03, 0.01);
			if (paused) {
				water.updateNormals();
				renderer.updateCaustics(water);
			}
			break;
		}
		case MODE_ORBIT_CAMERA: {
			angleY -= x - oldX;
			angleX -= y - oldY;
			angleX = Math.max(-89.999, Math.min(89.999, angleX));
			break;
		}
		}
		oldX = x;
		oldY = y;
		if (paused) draw();
	}

	function stopDrag() {
		mode = -1;
	}

	document.onmousedown = function(e) {
		e.preventDefault();
		startDrag(e.pageX, e.pageY);
	};

	document.onmousemove = function(e) {
		duringDrag(e.pageX, e.pageY);
	};

	document.onmouseup = function() {
		stopDrag();
	};

	document.ontouchstart = function(e) {
		if (e.touches.length === 1) {
			e.preventDefault();
			startDrag(e.touches[0].pageX, e.touches[0].pageY);
		}
	};

	document.ontouchmove = function(e) {
		if (e.touches.length === 1) {
			duringDrag(e.touches[0].pageX, e.touches[0].pageY);
		}
	};

	document.ontouchend = function(e) {
		if (e.touches.length == 0) {
			stopDrag();
		}
	};

	document.onkeydown = function(e) {
		if (e.which == ' '.charCodeAt(0)) paused = !paused;
		else if (e.which == 'L'.charCodeAt(0) && paused) draw();
	};

	var frame = 0;

	function update(seconds) {
		if (seconds > 1) return;
		frame += seconds * 2;

		// Update the water simulation and graphics
		water.stepSimulation();
		water.stepSimulation();
		water.updateNormals();
		renderer.updateCaustics(water);
	}

	function draw() {
		// Change the light direction to the camera look vector when the L key is pressed
		if (GL.keys.L) {
			renderer.lightDir = GL.Vector.fromAngles((90 - angleY) * Math.PI / 180, -angleX * Math.PI / 180);
			if (paused) renderer.updateCaustics(water);
		}

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.loadIdentity();
		gl.translate(0, 0, -4);
		gl.rotate(-angleX, 1, 0, 0);
		gl.rotate(-angleY, 0, 1, 0);
		gl.translate(0, 0.5, 0);

//		gl.enable(gl.DEPTH_TEST);
		renderer.renderCube();
//		renderer.renderWater(water, cubemap);
//		gl.disable(gl.DEPTH_TEST);
	}
};
