/*!
 * Copyright 2024 E.J.I.E., S.A.
 *
 * Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 * Solo podrá usarse esta obra si se respeta la Licencia.
 * Puede obtenerse una copia de la Licencia en
 *
 *      http://ec.europa.eu/idabc/eupl.html
 *
 * Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, 
 * el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 * SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 * Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 * que establece la Licencia.
 */

jQuery(document).ready(function () {
	window.initRupI18nPromise.then(function() {	
	//Se Crea el combo de seleccion
	$('#userCombo').rup_select({
		data : USERNAMES,
		width: 250,
		selected: "udaAnonymousUser",
		select: function(event, object){
			$('#selectedUserName').html($('#userCombo').rup_select("getRupValue"));	
		}
	});
	
	//Se comprueba que hay feedback y si no se crea
	if ($(".rup-feedback").size() === 0){
		$("#content").prepend($("<div id='logFeedback'/>").addClass("logFeedback").rup_feedback({ 
			type: "ok",
			closeLink: true,
			delay: 2500,
			fadeSpeed: 500,
			block: true
		})).width($("#content").width());
	} else {
		$("#content").css("margin-top", "10em");
	}
	
	$('#userCombo').on('selectFinish', function() {
		//Se especifica el usuario pre-seleccionado
		var udaMockUserName = $.rup_utils.readCookie("udaMockUserName");
		if(udaMockUserName === null){
			$('#selectedUser').append($("<span/>").addClass("selectedUserName").attr("id","selectedUserName").html($('#userCombo').rup_select("getRupValue")));
		} else {
			$('#selectedUser').append($("<span/>").addClass("selectedUserName").attr("id","selectedUserName").html(udaMockUserName));
			$('#userCombo').rup_select("setRupValue",udaMockUserName);
		}
	});
	
	//Se especifica el funcionamiento del botón para que se envíen los datos y para que se almacene la cookie de usuario 
	$('#loginButtonObject').bind("click",function(){
		$.rup_utils.setCookie("udaMockUserName",$('#userCombo').rup_select("getRupValue"),{duration : 0, path : "/"});
		
		if(MOCKURL !== undefined && MOCKURL !== null && MOCKURL !== ""){
			$(location).attr('href',MOCKURL);
		} else {
			$(".rup-feedback").rup_feedback("set",$.rup.i18nParse($.rup.i18n.app,"loginUserMock.logginOk1")+$('#userCombo').rup_select("getRupValue")+$.rup.i18nParse($.rup.i18n.app,"loginUserMock.logginOk2"));
		}

		// Especifica el funcionamiento del botón para que se envíen los datos y para que se almacene la cookie de usuario.
		$('#loginButtonObject').bind('click', function() {
			$.rup_utils.setCookie('udaMockUserName', $('#userCombo').rup_select('getRupValue'), { duration: 0, path: '/' });

			if (MOCKURL !== undefined && MOCKURL !== null && MOCKURL !== '') {
				$(location).attr('href', MOCKURL);
			} else {
				$('.rup-feedback').rup_feedback('set', $.rup.i18nParse($.rup.i18n.app, 'loginUserMock.logginOk1') + $('#userCombo').rup_select('getRupValue') + $.rup.i18nParse($.rup.i18n.app, 'loginUserMock.logginOk2')).feedback_principal.rup_feedback('show');
			}
		});
	});
	});	
});