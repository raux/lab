/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {

	/* global var */
	// drag state
	panelApl.drag = {
		now: false, // true if dragging
	};
	panelApl.gamestart = false;  // true if playing

	// timer
	panelApl.timer = $.timer();

	/* button process
	 * return: none
	 */
	panelApl.start = function() {
		var $canvas = $('#canvas'); // main Canvas��div

		// add mouse events to the canvas
		$canvas.mousedown(panelApl.cvmsDown);
		$canvas.mouseup(panelApl.cvmsUp);
		$canvas.mouseleave(panelApl.cvmsUp);
		$canvas.mousemove(panelApl.cvmsMove);
		// add touch events to the canvas
		$canvas.bind("touchstart", panelApl.cvmsDown);
		$canvas.bind("touchend", panelApl.cvmsUp);
		$canvas.bind("touchend", panelApl.cvmsUp);
		$canvas.bind("touchmove", panelApl.cvmsMove);

		// init canvas
		panelApl.canv.init();

		panelApl.gamestart = true;
		panelApl.timer.play();
	};

	/* mousedown process
	 * {event} evt: event obj
	 * return: none
	 */
	panelApl.cvmsDown = function(evt) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - panelApl.canv.cvpos.x;
		var cy = evt.pageY - panelApl.canv.cvpos.y;
		panelApl.drag.now = true;
		return false;
	};
	/* mouseup/mouseleave process
	 * {event} evt: event obj
	 * return: none
	 */
	panelApl.cvmsUp = function(evt) {
		if (panelApl.drag.now) {
			// convert coordinate from point to canvas
			var cx = evt.pageX - panelApl.canv.cvpos.x;
			var cy = evt.pageY - panelApl.canv.cvpos.y;
			if (cx < 0) cx = 0;
			if (cx > panelApl.canv.area.w) cx = panelApl.canv.area.w;
			if (cy < 0) cy = 0;
			if (cy > panelApl.canv.area.h) cy = panelApl.canv.area.h;

			panelApl.drag.now = false;
		}
	};
	/* mousemove process
	 * {event} evt: evnet obj
	 * return: none
	 */
	panelApl.cvmsMove = function(evt) {
		if (panelApl.drag.now) {
			// convert coordinate from point to canvas
			var cx = evt.pageX - panelApl.canv.cvpos.x;
			var cy = evt.pageY - panelApl.canv.cvpos.y;
			// check if the canvas should be updated
			var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
			// update the canvas
			//	    panelApl.canv.draw({x:cx, y:cy});
		}
		return false;
	};

	/* body onload process */
	$(window).load(function() {
		// get canvas's DOM element and context
		var canvas = document.getElementById('canvas');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext("2d");
		ctx.lineWidth = 1;
		ctx.globalCompositeOperation = "source-over";

		// display
		panelApl.canv = new canvasManager.canv(ctx, canvas.width, canvas.height, panelApl);
		//	panelApl.canv.init();
		panelApl.canv.draw();

		panelApl.timer.set({
			action: function() {
				panelApl.count ++;
				//                if (panelApl.count  > 500) {
				//                    panelApl.timer.pause();
				//                }
				panelApl.canv.moveObj();
				panelApl.canv.draw();
			},
			time: 40
		});
		//        panelApl.timer.play();

		panelApl.start();
	});


})(jQuery);
