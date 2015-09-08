var panelApl = function() {
	// timer
	panelApl.timer = $.timer();

	// get canvas's DOM element and context
	var canvas = document.getElementById('canvas');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";

	// display
	panelApl.canv = new canvasManager.canv(ctx, canvas.width,
										   canvas.height, panelApl);
	panelApl.canv.init();
	panelApl.canv.draw();

	panelApl.timer.set({
		action: function() {
			panelApl.canv.moveObj();
			panelApl.canv.draw();
		},
		time: 40
	});

	panelApl.canv.init();
	panelApl.timer.play();
};

$(function() {
	var apl = new Apl();
});
