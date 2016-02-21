/*
var Apl = function() {
};	

$(function() {
	var apl = new Apl();
});
*/

const apikey = 'AIzaSyA_83j8DMAW9rJ38uczalFkfpL5lV6ito4';

function ImageToBase64(img) {
	var canvas = document.getElementById('canvas-temp');
    // New Canvas
    canvas.width  = img.width;
    canvas.height = img.height;

	console.log(img.width);
	console.log(img.height);

    // Draw Image
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    // To Base64
    return canvas.toDataURL('image/jpeg').substr(23);
}

function post(data) {
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = function() {
		var READYSTATE_COMPLETED = 4;
		var HTTP_STATUS_OK = 200;
		
		if( this.readyState == READYSTATE_COMPLETED
			&& this.status == HTTP_STATUS_OK ) {
			// �쥹�ݥ󥹤�ɽ��
			alert( this.responseText );
		} else {
			alert( this.responseText );
		}
	}
	xmlHttpRequest.open('POST',
						'https://vision.googleapis.com/v1/images:annotate?key=' + apikey);
	// �����Ф��Ф��Ʋ�����ˡ����ꤹ��
	xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
	// �ǡ�����ꥯ������ �ܥǥ��˴ޤ����������
	xmlHttpRequest.send(JSON.stringify(data));
}

function loadFile(files) {
	var canvas = document.getElementById('canvas-temp');
	var ctx = canvas.getContext('2d');
	var file = files.files[0];
	var reader = new FileReader();

	reader.onload = function() {
		var image = document.getElementById('img');
		image.src = reader.result;
	}.bind(this);
	reader.readAsDataURL(file);
}

function analyse() {
	var img = document.getElementById('img');
	var base64 = ImageToBase64(img);
	var data = {
		"requests":[
			{
				"image":{
					"content":base64
				},
				"features":[
					{
						"type":"LABEL_DETECTION",
						"maxResults":1
					}
				]
			}
		]
	};
	
	post(data);
}

