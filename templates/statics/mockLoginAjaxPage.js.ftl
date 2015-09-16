<#-- 
 -- Copyright 2013 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, 
 -- el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
/*!
 * Copyright 2012 E.J.I.E., S.A.
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
	
	//Se Crea el combo de seleccion
	$('#userCombo').rup_combo({
		source : USERNAMES,
		width: 250,
		selected: "udaAnonymousUser",
		select: function(event, object){
			$('#selectedUserName').html(object.value);	
		}
	});
	
	$('#userCombo').rup_combo("setRupValue","udaAnonymousUser");
	
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
	
	//Se especifica el usuario pre-seleccionado
	var udaMockUserName = $.rup_utils.readCookie("udaMockUserName");
	if(udaMockUserName === null){
		$('#selectedUser').append($("<span/>").addClass("selectedUserName").attr("id","selectedUserName").html($('#userCombo').rup_combo("getRupValue")));
	} else {
		$('#selectedUser').append($("<span/>").addClass("selectedUserName").attr("id","selectedUserName").html(udaMockUserName));
		$('#userCombo').rup_combo("setRupValue",udaMockUserName);
	}

	debugger;
	//Se especifica el funcionamiento del botón para que se envíen los datos y para que se almacene la cookie de usuario 
	$('#loginButtonObject').bind("click",function(){
		
		var MOCKAJAXURL = $("#mockajaxurl").val();
		
		if(MOCKAJAXURL !== undefined && MOCKAJAXURL !== null && MOCKAJAXURL !== ""){
			$.rup_utils.setCookie("udaMockUserName",$('#userCombo').rup_combo("getRupValue"),{duration : 0, path : "/"});
			
			var ajaxOptions =  {};
			ajaxOptions.success = function (data, textStatus, XMLHttpRequest){
				$("#mockPageContent").parent().html(data);
			};
			ajaxOptions.url = MOCKAJAXURL;
			ajaxOptions.type = 'GET';
			ajaxOptions.dataType= 'text'; 
			$.rup_ajax(ajaxOptions);			
			
		} else {
			$(".rup-feedback").rup_feedback("set",$.rup.i18nParse($.rup.i18n.app,"loginUserMock.logginOk1")+$('#userCombo').rup_combo("getRupValue")+$.rup.i18nParse($.rup.i18n.app,"loginUserMock.logginOk2")).feedback_principal.rup_feedback("show");			
		}
		
		
	});
});