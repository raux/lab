/* HTML5 Canvas drag&drop */
var canvasManager = {}; // namespace

(function($) {

    /* item class
     * {int} x: center x-pos
     * {int} y: center y-pos
     * {string} type: type of figure
     */
    canvasManager.item = function(x, y, type) {
	this.x = x; 
	this.y = y;
	this.type = type;
    };

    /* canvas class
     * {canvas context} ctx: the context
     * {int} w: width
     * {int} h: height
     * {objext} names: caller namespace
     */
    canvasManager.canv = function(ctx, w, h, names) {
	this.ctx = ctx; // the context
	this.area = {w:w, h:h};  // the area
	this.cvpos = {x:0, y:0};  // position of the canvas on the browser
	this.grSep = 30;  // grid interval(px)
	this.grSephf = this.grSep / 2;  // grid half interval(px)
	this.grWidth = 1; // grid line width
	this.grXAr = []; // x-positions of grids
	this.grRcv = false; // true if a grid is on the right edge of the canvas
	this.grYAr = []; // y-positions of grids
	this.grBcv = false; // true if a grid is on the botton edge of the canvas
	this.itemAr = []; // items

	// set the position of the canvas on the browser
	var $cvdiv = $('#' + names.con.id.cvdiv);
	this.cvpos.x = $cvdiv.offset().left;
	this.cvpos.y = $cvdiv.offset().top;

	// set the coordinates of grids
	var gcntx = 0;  // the number of vertical grids
	if (this.area.w % this.grSep) {
	    gcntx = Math.floor(this.area.w / this.grSep);
	} else {
	    // the case of a grid is on the right edge of the canvas
	    gcntx = this.area.w / this.grSep - 1;
	    this.grRcv = true;
	}
	for (var i = 0; i < gcntx; i++) {
	    this.grXAr[i] = this.grSep * (i + 1);
	}
	
	var gcnty = 0;  // the number of horisontal grids
	if (this.area.h % this.grSep) {
	    gcnty = Math.floor(this.area.h / this.grSep);
	} else {
	    // the case of a grid is on the botton edge of the canvas
	    gcnty = this.area.h / this.grSep - 1;
	    this.grBcv = true;
	}
	for (var i = 0; i < gcnty; i++) {
	    this.grYAr[i] = this.grSep * (i + 1);
	}

	/* init process
	 * return: none
	 */
	this.init = function() {
	    // initial position of items
	    this.itemAr = [];
	    this.itemAr[0] = new canvasManager.item(this.grSephf, this.grSephf,
					    names.con.dtype.cir);
	    this.itemAr[1] = new canvasManager.item(this.grSephf, this.grSep + this.grSephf,
					    names.con.dtype.tri);
	    this.itemAr[2] = new canvasManager.item(this.grSephf,
					    this.grSep * 2 + this.grSephf, names.con.dtype.squ);
	}

	/* init canvas
	 * return: none
	 */
	this.blank = function() {
	    // clear
	    this.ctx.clearRect(0, 0, this.area.w, this.area.h);
	    // show grids
	    this.ctx.save();
	    this.ctx.globalAlpha = 0.5;
	    this.ctx.strokeStyle = "#000033";
	    this.ctx.lineWidth = this.grWidth;
	    for (var i = 0; i < this.grXAr.length; i++) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.grXAr[i], 0);
		this.ctx.lineTo(this.grXAr[i], this.area.h);
		this.ctx.stroke();
	    }
	    for (var i = 0; i < this.grYAr.length; i++) {
		this.ctx.beginPath();
		this.ctx.moveTo(0,this.grYAr[i]);
		this.ctx.lineTo(this.area.w, this.grYAr[i]);
		this.ctx.stroke();
	    }
	    this.ctx.restore();
	};

	/* draw canvas
	 * return: none
	 */
	this.draw = function() {
	    // init canvas
	    this.blank();
	    // draw items
	    for (var i = 0; i < this.itemAr.length; i++) {
		switch (this.itemAr[i].type) {
		case names.con.dtype.cir: {
		    this.drawCir(this.itemAr[i].x, this.itemAr[i].y);
		    break;
		}
		case names.con.dtype.tri: {
		    this.drawTri(this.itemAr[i].x, this.itemAr[i].y);
		    break;
		}
		case names.con.dtype.squ: {
		    this.drawSqu(this.itemAr[i].x, this.itemAr[i].y);
		    break;
		}
		default: {
		    this.drawCir(this.itemAr[i].x, this.itemAr[i].y);
		    break;
		}
                }
	    }
	};

	// pre-calculate often used value
	this.linelng = this.grSep / 2 - 1;
	this.PI2 = Math.PI * 2; // 2*pi
	// height of regular triangle / 2
	this.trhghthf = this.linelng * Math.tan(Math.PI / 3) / 2;
	
	/* draw circle with this.grSep - 2px diameter
	 * {int} x: center x-pos
	 * {int} y: center y-pos
	 * return: none
	 */
	this.drawCir = function(x,y) {
	    this.ctx.save();
	    this.ctx.fillStyle = 'green';
	    this.ctx.beginPath();
	    this.ctx.arc(x, y, this.linelng, 0, this.PI2, false);
	    this.ctx.fill();
            this.ctx.fillText("circle", x + this.grSephf, y);
	    this.ctx.restore();
	};

	/* draw trianle with this.grSep - 2px on a side
	 * {int} x: center x-pos
	 * {int} y: center y-pos
	 * return: none
	 */
	this.drawTri = function(x,y) {
	    this.ctx.save();
	    this.ctx.fillStyle = 'blue';
	    this.ctx.beginPath();
	    this.ctx.moveTo(x, y - this.trhghthf);
	    this.ctx.lineTo(x - this.linelng, y + this.trhghthf);
	    this.ctx.lineTo(x + this.linelng, y + this.trhghthf);
	    this.ctx.closePath();
	    this.ctx.fill();
            this.ctx.fillText("triangle", x + this.grSephf, y);
	    this.ctx.restore();
	};
	
	/* draw regular square with this.grSep - 2px on a side
	 * {int} x: center x-pos
	 * {int} y: center y-pos
	 * return: none
	 */
	this.drawSqu = function(x,y) {
	    this.ctx.save();
	    this.ctx.fillStyle = 'purple';
	    this.ctx.beginPath();
	    this.ctx.moveTo(x - this.linelng, y - this.linelng);
	    this.ctx.lineTo(x - this.linelng, y + this.linelng);
	    this.ctx.lineTo(x + this.linelng, y + this.linelng);
	    this.ctx.lineTo(x + this.linelng, y - this.linelng);
	    this.ctx.closePath();
	    this.ctx.fill();
            this.ctx.fillText("square", x + this.grSephf, y);
	    this.ctx.restore();
	};

	/* check if an item is on the specified position
	 * {int} x: x-pos
	 * {int} y: y-pos
	 * return: index of this.itemAr or null
	 */
	this.checkItem = function(x, y) {
	    var rtn = null;
	    for (var i = 0; i < this.itemAr.length; i++) {
		if (x >= this.itemAr[i].x - this.grSephf &&
		    x <= this.itemAr[i].x + this.grSephf) {
		    if (y >= this.itemAr[i].y - this.grSephf &&
			y <= this.itemAr[i].y + this.grSephf) {
			rtn = i;
			break;
		    }
		}
	    }
	    return rtn;
	};

	/* set the position if an item to the center of the nearest grid
	 * {int} index: index of this.itemAr
	 * {int} x: x-pos before corrected
	 * {int} y: y-pos before corrected
	 * return: none
	 */
	this.setCenter = function(index, x, y) {
	    // set to edge grid if the specified position is out of the canvas
	    var gidx = Math.floor(x / this.grSep);  // index of grid array
	    if (gidx < 0 ) {
		gidx = 0;
	    } else if (gidx >= this.grXAr.length && !this.grRcv) {
		gidx = this.grXAr.length - 1;
	    }
	    if (gidx < this.grXAr.length) {
		this.itemAr[index].x = this.grXAr[gidx] - this.grSephf;
	    } else {
		// if a grid is on the right edge of the canvas
		this.itemAr[index].x = this.grXAr[this.grXAr.length - 1] + this.grSephf;
	    }
	    
	    gidx = Math.floor(y / this.grSep);
	    if (gidx < 0 ) {
		gidx = 0;
	    } else if (gidx >= this.grYAr.length && !this.grBcv) {
		gidx = this.grYAr.length - 1;
	    }
	    if (gidx < this.grYAr.length) {
		this.itemAr[index].y = this.grYAr[gidx] - this.grSephf;
	    } else {
		// if a grid is on the bottom edge of the canvas
		this.itemAr[index].y = this.grYAr[this.grYAr.length - 1] + this.grSephf;
	    }
	};
    }

})(jQuery);
