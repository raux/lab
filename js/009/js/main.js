//var client = {}; // namespace

var Client = function() {
	// drag state
	this.dragging = false;

	// socket
	this.socket = new io.connect("http://183.181.8.119:8081");
	//this.socket = new io.connect("http://localhost:8081");

	// my session id
	this.sessionId = null;

	// client database, [0] is mine
	this.client_db = [];

	var $canvas = $('#canvas');
	this.cvpos = {x:0, y:0};
	this.cvpos.x = $canvas.offset().left;
	this.cvpos.y = $canvas.offset().top;

	// get canvas's DOM element and context
	if ( ! $canvas[0] || !$canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();

	// create canvas manager
	//	this.canvMng = new canvasManager.canv(ctx, $canvas.width(),
	//										  $canvas.height(), this);
	//
	//this.canvMng.draw({x:0, y:0});

	// bind mouse/touch events
	$canvas.mousedown(this.hDown.bind(this));
	$canvas.mouseup(this.hUp.bind(this));
	$canvas.mouseleave(this.hUp.bind(this));
	$canvas.mousemove(this.hMove.bind(this));
	$canvas.bind("touchstart", this.hDown.bind(this));
	$canvas.bind("touchend", this.hUp.bind(this));
	$canvas.bind("touchmove", this.hMove.bind(this));
	// bind button event
	$('#savebtn').mousedown(this.saveImage.bind(this));
	$('#restorebtn').mousedown(this.restoreImage.bind(this));
	$('#clearbtn').mousedown(this.clearImage.bind(this));
	$('#dispimgbtn').mousedown(this.displayImage.bind(this));
	$('#dlimgbtn').mousedown(this.downloadImage.bind(this));
	$('#color-black').bind('touchstart', this.setColorBlack.bind(this));
	$('#color-black').bind('mousedown', this.setColorBlack.bind(this));
	$('#color-red').bind('touchstart', this.setColorRed.bind(this));
	$('#color-red').bind('mousedown', this.setColorRed.bind(this));
	$('#color-blue').bind('touchstart', this.setColorBlue.bind(this));
	$('#color-blue').bind('mousedown', this.setColorBlue.bind(this));
	$('#color-yellow').bind('touchstart', this.setColorYellow.bind(this));
	$('#color-yellow').bind('mousedown', this.setColorYellow.bind(this));
	$('#line-1px').bind('touchstart', this.setLineWidth1px.bind(this));
	$('#line-1px').bind('mousedown', this.setLineWidth1px.bind(this));
	$('#line-3px').bind('touchstart', this.setLineWidth3px.bind(this));
	$('#line-3px').bind('mousedown', this.setLineWidth3px.bind(this));
	$('#line-5px').bind('touchstart', this.setLineWidth5px.bind(this));
	$('#line-5px').bind('mousedown', this.setLineWidth5px.bind(this));

	// bind socket.io event
	this.socket.on("connect", function(){
		console.log('connected');
	}.bind(this));
	this.socket.on('setPos', function (data) {
		// draw line by another client
		this.client_db[data.sid].prevPos = data.to;
	}.bind(this));
	this.socket.on('setColor', function (data) {
		// draw line by another client
		this.client_db[data.sid].color = data.color;
	}.bind(this));
	this.socket.on('setLineWidth', function (data) {
		// draw line by another client
		this.client_db[data.sid].lineWidth = data.lineWidth;
	}.bind(this));
	this.socket.on('drawLine', function (data) {
		var conf = this.client_db[data.sid];
		this.ctx.strokeStyle = conf.color;
		this.ctx.lineWidth = conf.lineWidth;
		this.ctx.beginPath();
		this.ctx.moveTo(conf.prevPos.x, conf.prevPos.y);
		this.ctx.lineTo(data.to.x, data.to.y);
		this.ctx.stroke();
		conf.prevPos.x = data.to.x;
		conf.prevPos.y = data.to.y;
	}.bind(this));
	this.socket.on('your sid', function (sid) {
		// get my session id from server
		console.log("session id: %d", sid);
		this.sessionId = sid;
		this.client_db[0] = {color:'black', lineWidth:1, prevPos:{x:0, y:0}};
	}.bind(this));
	this.socket.on('client connected', function (sid) {
		// new client connected
		this.client_db[sid] = {color:'black', lineWidth:1, prevPos:{x:0, y:0}};
	}.bind(this));
	this.socket.on('client disconnected', function (sid) {
		this.client_db[sid] = undefined;
	}.bind(this));
	this.socket.on('restore image', function(data) {
		var img = new Image();
		var alpha = this.ctx.globalAlpha;
		img.src = imgData;
		this.ctx.globalAlpha = 1.0;
		this.ctx.drawImage(img, 0, 0);
		this.ctx.globalAlpha = alpha;
	}.bind(this));
	this.socket.on('clear image', function(data) {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}.bind(this));
};

// button function: save image
Client.prototype.saveImage = function() {
	var $canvas = $('#canvas');

	var imgData = $canvas[0].toDataURL();
	this.socket.emit('saveImage', {imgData:imgData});
};

// button function: restore image
Client.prototype.restoreImage = function() {
	this.socket.emit('restoreImage');
};

// button function: clear image
Client.prototype.clearImage = function() {
	this.socket.emit('clearImage');
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};

// button function: display image
Client.prototype.displayImage = function() {
	var $canvas = $('#canvas');
	var imgData = $canvas[0].toDataURL();

	window.open(imgData);
};

// button function: download image
Client.prototype.downloadImage = function() {
	var $canvas = $('#canvas');
	var data = canvas[0].toDataURL().
		replace('image/png', 'application/octet-stream');;
	location.href = data;
};

// mousedown event
Client.prototype.hDown = function(evt) {
	var cx = evt.pageX - this.cvpos.x;
	var cy = evt.pageY - this.cvpos.y;

	this.dragging = true;
	this.client_db[0].prevPos = {x:cx, y:cy};
	this.socket.emit('setPos', {sid:this.sessionId,
								to:{x:cx, y:cy}});
	return false;
};

// mouseup/mouseleave event
Client.prototype.hUp = function(evt) {
	this.dragging = false;
};

// mousemove event
Client.prototype.hMove = function(evt) {
	if (!this.dragging) {
		return false;
	}
	var cx = evt.pageX - this.cvpos.x;
	var cy = evt.pageY - this.cvpos.y;
	var conf = this.client_db[0];
	this.ctx.strokeStyle = conf.color;
	this.ctx.lineWidth = conf.lineWidth;
	this.ctx.beginPath();
	this.ctx.moveTo(conf.prevPos.x, conf.prevPos.y);
	this.ctx.lineTo(cx, cy);
	this.ctx.stroke();
	conf.prevPos.x = cx;
	conf.prevPos.y = cy;
	this.socket.emit('drawLine', {sid:this.sessionId,
									to:{x:cx, y:cy}});

	return false;
};

// color setting
Client.prototype.setColor = function(_color) {
	this.client_db[0].color = _color;
	this.socket.emit("setColor", {sid:this.sessionId, color:_color});
};
Client.prototype.setColorBlack = function() {
	this.setColor('black');
};
Client.prototype.setColorRed = function() {
	this.setColor('red');
};
Client.prototype.setColorBlue = function() {
	this.setColor('blue');
};
Client.prototype.setColorYellow = function() {
	this.setColor('yellow');
};

// line width setting
Client.prototype.setLineWidth = function(_lineWidth) {
	this.client_db[0].lineWidth = _lineWidth;
	this.socket.emit("setLineWidth", {sid:this.sessionId, lineWidth:_lineWidth});
};
Client.prototype.setLineWidth1px = function() {
	this.setLineWidth(1);
};
Client.prototype.setLineWidth3px = function() {
	this.setLineWidth(3);
};
Client.prototype.setLineWidth5px = function() {
	this.setLineWidth(5);
};

$(function() {
//window.onload = function() {
	client = new Client();
});
//};
