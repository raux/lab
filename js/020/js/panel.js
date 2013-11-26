/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
(function($) {
    /* body onload process */
    $(window).load(function() {
        window.addEventListener('devicemotion', function(evt) {
            //��®��
            var ac = evt.acceleration;
            var temp = "ac_x:" + ac.x +"<br>"; //x�����β�®��
            temp += "ac_y:" + ac.y +"<br>";    //y�����β�®��
            temp += "ac_z:" + ac.z +"<br>";    //z�����β�®��
            temp += "<br>";
            
            //����
            var acg = evt.accelerationIncludingGravity;
            temp += "acg_x:" + acg.x +"<br>"; //x�����η���
            temp += "acg_y:" + acg.y +"<br>"; //y�����η���
            temp += "acg_z:" + acg.z +"<br>"; //z�����η���
            temp += "<br>";
            
            //��ž��®��
            var rr = evt.rotationRate;
            temp += "rr_a:" + rr.alpha +"<br>"; //z���β�ž��®��
            temp += "rr_b:" + rr.beta +"<br>";  //x���β�ž��®��
            temp += "rr_g:" + rr.gamma +"<br>"; //y���β�ž��®��
            
            document.getElementById("msg").innerHTML = temp;
        });
        
	// show message
	//panelApl.showmsg('press start button');
    });
})(jQuery);
