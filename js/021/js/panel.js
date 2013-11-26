/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {
    panelApl.gamestart = false;  // true if playing
    panelApl.timer = $.timer();
    panelApl.fps = 30;
    
    /* button process
     * return: none
     */
    panelApl.start = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas��div
	var $btn = $('#stbtn1'); // start button
        
	if (!panelApl.gamestart) { // if not playing
            //// set parameters from web form
            var cristals = document.form1.input_cristals.value;
            var cor = document.form1.input_cor.value;
            // check if inputs are number
            if (isNaN(cristals) || isNaN(cor)) {
                panelApl.showmsg("ERROR: incorrect input");
                return;
            }
            cristals = Number(cristals);
            cor = Number(cor);
            if (cristals < 0 || cor < 0) {
                panelApl.showmsg("ERROR: values must be positive number or zoro");
                return;
            }
            panelApl.canv.setCor(cor);

	    // init canvas
	    panelApl.canv.init(cristals);
	    
	    panelApl.gamestart = true;
            panelApl.canv.setFps(panelApl.fps);
	    panelApl.showmsg('moving');
	    $btn.text('stop');
            
            // start simulation
            panelApl.timer.play();
	} else { // if playing
	    panelApl.gamestart = false;
            panelApl.timer.pause();
	    panelApl.showmsg('paused');
	    $btn.text('start');
	}
    };

    panelApl.readGravity = function(evt) {
        var g = evt.accelerationIncludingGravity;
        panelApl.canv.set3dGravity({x:g.x, y:-g.y, z:g.z});
    };

    panelApl.showmsg = function(msg) {
	$('#msg1').html(msg);
    };

    /* body onload process */
    $(window).load(function() {
	// get canvas's DOM element and context
	var canvas = document.getElementById('cv1');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";

	// display
	panelApl.canv = new canvasManager.canv(ctx, canvas.width,
                                               canvas.height, panelApl);
	panelApl.canv.init();
	panelApl.canv.draw();
        
	// set events
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(panelApl.start);
	$btn.text('start');
	
	// show message
	panelApl.showmsg('press start button');
        window.addEventListener('devicemotion', panelApl.readGravity);
        
        panelApl.timer.set({
            action: function() {
                panelApl.canv.moveObj();
                panelApl.canv.draw();
            },
            time: 1000/panelApl.fps
        });
        
    });
})(jQuery);
