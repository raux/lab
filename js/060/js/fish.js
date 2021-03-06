var CloudFish = function(scene) {
	const space = {x: [-200, 200], y: [5, 120], z: [-30, 30]};
	const fishNum = 60;

	this.scene = scene
	this.fishes = [];

	for (var i = 0; i < fishNum; i++) {
		var f = new Fish3d();
		var x = (Math.random()*(space.x[1] - space.x[0]) + space.x[0]);
		var y = (Math.random()*(space.y[1] - space.y[0]) + space.y[0]);
		var z = (Math.random()*(space.z[1] - space.z[0]) + space.z[0]);
		f.setPosition(x, y, z);
		this.fishes.push(f);
		this.scene.add(f.get3DObject());
	}

	this.speed = new THREE.Vector3(0, 0, 0);
};

CloudFish.prototype.move = function(x, y, z) {
	this.fishes.forEach(function(f) {
		f.move(x, y, z);
	});
};

CloudFish.prototype.animate = function() {
	const speed = 3;
	const r = .8;
	this.speed.x += (Math.random() - 0.5)*r;
	this.speed.y += (Math.random() - 0.5)*r;
	this.speed.z += (Math.random() - 0.5)*r;

	this.speed.normalize();
	this.speed.multiplyScalar(speed);

	this.fishes.forEach(function(f) {
		f.animate();
		f.setSpeed(this.speed.x, this.speed.y, this.speed.z);
	}.bind(this));
};
