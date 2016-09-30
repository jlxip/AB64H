// ==UserScript==
// @name AB64H
// @description Auto BASE64 Hangouts
// @namespace AB64H
// @version 0.1
// @include https://mail.google.com

// @require http://code.jquery.com/jquery-git.min.js
// @require https://greasyfork.org/scripts/23618-jsaes/code/JSAES.js?version=150018
// @require https://greasyfork.org/scripts/23619-jsaes-wrapper/code/JSAES%20Wrapper.js?version=150019
// @require https://greasyfork.org/scripts/130-portable-md5-function/code/Portable%20MD5%20Function.js?version=10066

// @license APACHE LICENSE 2.0
// @supportURL https://gitlab.com/jlxip/AB64H
// ==/UserScript==

var globalkey=prompt("PASSWORD OF COMMUNICATION");	// Pedimos la clave de cifrado para la comunicación
var md5key=hex_md5(globalkey);	// Hasheamos la clave en md5 para obtener siempre una clave de 256 bits
var key=init(md5key);	// Variable con la llave
var msginput = $('div[role="textbox"]');	// Entrada de mensaje

// LIMPIEZA DE VARIABLES QUE PUEDEN SER EXPUESTAS (seguridad)
globalkey=null;
md5key=null;

msginput.keypress(function(evt) {	// Función para captar las pulsaciones de teclas en dicho campo
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    if(charCode==170) {	// Si la tecla pulsada es ª...
    	var oneChanged = false;	// Variable booleana para saber si se ha descifrado al menos un mensaje
    	$('span[dir="ltr"]').each(function() {	// Por cada etiqueta "span" con el campo dir="ltr"...
    		if($(this).html().substr(0, 5)=="AES: ") {	// Si los primeros 4 bytes son "AES: "...
    			var bencoded=$(this).html().substr(5, $(this).html().length);	// Obtenemos lo que queda después de "AES: "
    			var encoded=atob(bencoded);	// Lo decodificamos de BASE64 para obtener los bytes limpios
    			var decoded=decryptLongString(encoded, key);	// Decodificamos el mensaje
    			$(this).html(decoded);	// Y lo cambiamos en el documento HTML
    			oneChanged = true;	// Cambiamos el valor de la variable booleana para saber que al menos se ha descifrado un mensaje
    		}
    	});

    	if(oneChanged == false) {	// Si no se ha cambiado ningún mensaje (porque se quiera cifrar texto)...
    		var decoded=msginput.text();	// Variable con el mensaje en texto plano
	    	var encrypted=encryptLongString(decoded, key);	// Ciframos el mensaje
	    	var bencrypted=btoa(encrypted);	// Convertimos el mensaje cifrado en imprimible cifrándolo en BASE64
	    	msginput.text("AES: "+bencrypted);	// Cambiamos el mensaje a enviar por el mensaje cifrado con el prefijo "AES: "
    	}

    	return false;	// Devolvemos "false" para que no se escriba el carácter ª
    }
});