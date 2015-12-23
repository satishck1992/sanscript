$('.selectpicker').selectpicker();
$("#sPratyaharas").click(showPratyahara);
$("#sCharacters").click(showCharacters);
$("#sSutras").click(showSutras);
$(".bs-example").hide();

function showPratyahara(){

	var str = document.getElementById("txtInput").value;
	if(str.length === 0){
		document.getElementById("response").innerHTML = "";
		return;
	}
	else if(str.length > 1){	

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
			var response = JSON.parse(xmlHttp.responseText);
			if(response != null){
			var charset = '';
			for(var i=0;i<response.length;i++){
                if (i % 9 === 0) {
                    charset += '<br/>';
                }
                charset += parseInt(i) + ') ' + response[i]['pratyaharas'].split(' ')[0] + response[i]['pratyaharas'].split(' ')[1] + ' ';

				}
			}
			document.getElementById("response").innerHTML = charset;
		}
	}

	var transliterate = document.getElementById("transliterate").value;
	var output = Sanscript.t(str,transliterate,"devanagari");
	
	if(output.length >= 2){	
		xmlHttp.open('GET','service.php?pratyahara='+output+"&type=pratyaharas",true);
		xmlHttp.send();
	 }
	}	

}

function showCharacters(){

	$(".bs-example").hide();
	$("#response").show();
	var str = document.getElementById("txtInput").value;
	if(str.length === 0){
		document.getElementById("response").innerHTML = "";
		return;
	}
	else if(str.length > 1){	

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
			var response = JSON.parse(xmlHttp.responseText);
			if(response != null){
			var charset = '';var iast = '';
			for(var i=0;i<response.length;i++){
				//charset += response[i]['characters']+ ' ';
                charset += response[i]['data'].character+' ';
                iast += response[i]['data'].iast+' ';
				}
			}
			document.getElementById("response").innerHTML = charset;
            //document.getElementById("iast").innerHTML = iast;
			$(".characters").find("label").text("Characters");
		}
	}

	var transliterate = document.getElementById("transliterate").value;
	var output = Sanscript.t(str,transliterate,"devanagari");
	
	if(output.length >= 2){	
		//xmlHttp.open('GET','service.php?pratyahara='+output+"&type=characters",true);
		//xmlHttp.send();
        //document.getElementById("response").innerHTML = "";
        //document.getElementById("iast").innerHTML = ""
        xmlHttp.open('GET','pratyahara?characters='+str,true);
		xmlHttp.send();
	 }
	}	

}

function showSutras(){
	$(".bs-example").show();
	$("#response").hide();
	var str = document.getElementById("txtInput2").value;
	if(str.length === 0){
		document.getElementById("response").innerHTML = "";
		return;
	}
	else if(str.length > 1){

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
				document.getElementById("responseTable").innerHTML = '';
				var response = JSON.parse(xmlHttp.responseText);
				if(response != null){
					var table = document.getElementById("responseTable");
					var header = table.createTHead();
					var row1 = header.insertRow(0);
					var cell = row1.insertCell(0);
					cell.innerHTML = "Id";
					var row2 = header.insertRow(1);
					var cell2 = row1.insertCell(1);
					cell2.innerHTML = "Sutra";
					var body = table.createTBody();

					for(var i=0;i<response.length;i++){
						if(response[i]['sutra_id'] !== undefined) {
							var row = body.insertRow();
							var cell1 = row.insertCell(0);
							cell1.innerHTML = Sanscript.t(response[i]['sutra_id'],'hk','devanagari');
							var cell2 = row.insertCell(1);
							cell2.innerHTML = response[i]['sutra_text'];
						}
					}

					$(".bs-example").show();
				}
			}
		}

		var transliterate = document.getElementById("transliterate").value;
		var output = Sanscript.t(str,transliterate,"devanagari");

		if(output.length >= 2){
			//xmlHttp.open('GET','service.php?pratyahara='+output+"&type=characters",true);
			//xmlHttp.send();
			//document.getElementById("response").innerHTML = "";
			//document.getElementById("iast").innerHTML = ""
			xmlHttp.open('GET','sutras?characters='+str,true);
			xmlHttp.send();
		}
	}

}