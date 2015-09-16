//TODO Probar con una jsp embebida en el div html
(function ($) {
	$.extend($.rup, {
		dialog : {
			DIV : "dialogDIV", 
			TEXT : "dialogTEXT", 
			AJAX : "dialogAJAX", 
			LINK : "linkButton"
		}
	});
	
	$.fn.rup_dialog = function (pin) {
		if (typeof pin === 'string') {
			var fn = $.fn.rup_dialog[pin], args;
			if (!fn) {
				throw ("RUPDialog - No such method: " + pin);
			}
			args = $.makeArray(arguments).slice(1);
			return fn.apply(this, args);
		}
		return this.each(function () {
			var settings = {}, self = null, id = null, autopen = false, linkButtons = [], msgDiv, btnsLength, aux, aClose, 
			linkButtonsLength = 0, closeSpan, i, j, created = false;
			$.extend(settings, $.fn.rup_dialog.defaults, pin);
			
			switch (settings.type) {
			case $.rup.dialog.DIV://si el dialog es de tipo DIV se utilizara el div creado por el desarrollador para crear el ui dialog
				id = this.id;
				if ($('div[aria-labelledby=ui-dialog-title-' + id + ']').length > 0) {//comprobamos que no se haya ya creado el dialog sobre ese div para evitar problemas de sobreescritura de propiedades, como el tiulo...
					created = true;
				}
				break;
			case $.rup.dialog.TEXT:
				id = "rup_textDialogDIV";
				if ($("#rup_textDialogDIV").length === 0) { //si ha sido creado con anterioridad lo usuamos eliminando su contenido
					self = $("<div/>").attr("id", "rup_textDialogDIV");
					self.appendTo('body');
					self.html(settings.message);
				} else {
					$("#rup_textDialogDIV").html(settings.message);
					created = true;
				}
				break;
			case $.rup.dialog.AJAX:
				id = "rup_ajaxDialogDIV";
				if ($("#rup_ajaxDialogDIV").length === 0) { //si ha sido creado con anterioridad lo usuamos eliminando su contenido
					msgDiv = $("<div/>").attr("id", "rup_ajaxDialogDIV");
					msgDiv.appendTo('body');
				} else {
					msgDiv = $("#rup_ajaxDialogDIV");
					msgDiv.html("");
					created = true;
				}
				if (settings.showLoading) { //si hay que mostrar la capa de cargando por defecto a false
					$.blockUI({
						message: '<img src="' + $.rup.RUP + '/basic-theme/images/rup.ajaxLoader.gif" style="position:absolute;top:12px;left:15px;" alt="' + $.rup.i18n.base.rup_blockUI.cargando + '" ><h1 class="loading">' + $.rup.i18n.base.rup_blockUI.cargando + '...' + '</h1>'
					});
				}
				//Si el tipo de dialogo es AJAX y no se establece url se muestra un error y se devuelve el control
				if (!settings.url || settings.url === null || settings.url === '') {
					$.rup.msgAlert({title: $.rup.i18n.base.rup_global.error, message: $.rup.i18n.base.rup_dialog.noURL});
					return false;
				}
				var ajaxOptions =  $.extend({},settings.ajaxOptions);
				ajaxOptions.success = function (data, textStatus, XMLHttpRequest){
						if (data !== '' || data !== null) {//si nos devuelve datos los mostramos como HTML y desbloqueamos el ui
							msgDiv.html(data);
							$.unblockUI();
							msgDiv.dialog("open");
							//le establecemos el foco
							$('div[aria-labelledby=ui-dialog-title-' + msgDiv[0].id + '] .ui-dialog-buttonpane button:first').focus();
						}
					if(settings.ajaxOptions && settings.ajaxOptions.success !== undefined && settings.ajaxOptions.success !== null && typeof settings.ajaxOptions.success === "function"){
						settings.ajaxOptions.success(data, textStatus, XMLHttpRequest);
					}
				};
				ajaxOptions.error = function (XMLHttpRequest, textStatus, errorThrown) { //en caso de error mostramos un mensaje de alerta
						$.unblockUI();
						$(document).rup().msgAlert({message: $.rup.i18n.base.rup_dialog.errorLoadingData});
					
					if(settings.ajaxOptions.error !== undefined && settings.ajaxOptions.error !== null && typeof settings.ajaxOptions.error === "function"){
						settings.ajaxOptions.error(XMLHttpRequest, textStatus, errorThrown);
					}
				};
				ajaxOptions.url = settings.url;
				ajaxOptions.type= 'GET';
				ajaxOptions.cache= false;
				ajaxOptions.dataType= 'text'; 
				//Peticion ajax para obtener los datos a mostrar
				$.rup_ajax(ajaxOptions);
				break;
			}
			if (settings.autoOpen === true) {//para que no se habra hasta que terminemos con todas nuestra acciones
				autopen = true;
				settings.autoOpen = false;
			}
			if (settings.buttons && settings.buttons !== null) { //controlar que existan los botones
				btnsLength = settings.buttons.length;//tamaño incial de los botones se o no enlaces
				if (btnsLength > 1) {//si tenemos mas de un boton buscamos cual es el link
					aux = settings.buttons;
					for (i = 0; i < settings.buttons.length;i++) {//se usa el length y no una variable porque se eliminan botones y el tamaño varia
						if (settings.buttons[i].btnType === $.rup.dialog.LINK) {
							linkButtons.push(settings.buttons.splice(i, 1));
							i--;
						}					
					}
					i = null;
				}
				linkButtonsLength = linkButtons.length;
				//Si tiene mas de dos botones y ninguno de ellos es de tipo link, entonces le mostrar una alerta diciendo que no cumple arista.
				if (btnsLength > 1 && linkButtonsLength === 0 && settings.rupCheckStyle) {
					$(document).rup().msgAlert({message: $.rup.i18n.base.rup_global.rupCheckStyleError});
					settings.stack = false;
					settings.modal = false;
					settings.zIndex = 9999;
				}
			}

			if (!created) { //si ha sido creado no hace falta volver a añadir el elnace de cierre
				$("#" + id).dialog(settings);
				closeSpan = "<span id='closeText_" + id + "' style='float:right;font-size:0.85em'>" + $.rup.i18n.base.rup_global.cerrar + "</span>";
				aClose = $("<a href='#'></a>")
				.attr("role", "button")
				.css("margin-right", "0.9em")
				.css("float", "right")
				.css("width", "50px")
				.addClass("ui-dialog-title")
				.html(closeSpan)
				.click(function (event) {
					$("#" + id).dialog("close");
					return false;
				})
				.hover(function (eventObject) { //Evento lanzado para que se cambie el icono de la X a hover, marcado por ARISTA
					$('div[aria-labelledby=ui-dialog-title-' + id + '] .ui-dialog-titlebar-close').addClass("ui-state-hover");
					$('div[aria-labelledby=ui-dialog-title-' + id + '] .ui-dialog-titlebar-close').css("padding", "0px");
				},
				function (eventObject) {
					$('div[aria-labelledby=ui-dialog-title-' + id + '] .ui-dialog-titlebar-close').removeClass("ui-state-hover");
					$('div[aria-labelledby=ui-dialog-title-' + id + '] .ui-dialog-titlebar-close').attr("style", "");					
				})
				.insertAfter("#ui-dialog-title-" + id);
				$('div[aria-labelledby=ui-dialog-title-' + id + '] .ui-dialog-titlebar-close').hover(
					function () { 
						aClose.css("text-decoration", "none");
					},
					function () {
						aClose.css("text-decoration", "");
					});
			} else { //borramos todos los posibles enlances que se hayan creado para esa capa
				$('div[aria-labelledby=ui-dialog-title-' + id + '] .ui-dialog-buttonset a').remove();
			}
			if (linkButtonsLength > 0) { //si tenemos enlaces loa añadimos
				for (j = 0; j < linkButtonsLength; j++) {
					$.fn.rup_dialog.createBtnLinks(linkButtons[j][0], id);
				}
				j = null;
			}			
			if (autopen && settings.type !== $.rup.dialog.AJAX) { //si se auto abría lo mostramos
				$("#" + id).dialog("open");
				//le establecemos el foco
				$('div[aria-labelledby=ui-dialog-title-' + id + '] .ui-dialog-buttonpane button:first').focus();
			}
		});
	};
	$.extend($.fn.rup_dialog, { 
		open : function () {//abre el dialogo y estable el foco en el primer botón.
			$(this).dialog("open");
			$('div[aria-labelledby=ui-dialog-title-' + this[0].id + '] .ui-dialog-buttonpane button:first').focus();
		},
		close : function () {//Cierra el dialogo.
			$(this).dialog("close");
		},
		isOpen : function () {//Función que devuelve si el dialogo esta abierto.
			return $(this).dialog("isOpen");
		},
		getOption : function (opt) {//Obtiene la propiedad que recibe como parametro.
			return $(this).dialog("option", opt);
		},
		setOption : function (opt, value) {//Establece la propiedad que recibe como parametro.
			if (opt === "buttons") {//si establecemos los botones tenemos que tener encuenta lo de los links
				var btnsLength = value.length, aux, i, j, linkButtons = [], linkButtonsLength;//tamaño incial de los botones se o no enlaces
				if (btnsLength > 1) {//si tenemos mas de un boton buscamos cual es el link
					aux = value;
					for (i = 0; i < value.length;i++) {//se usa el length y no una variable porque se eliminan botones y el tamaño varia
						if (value[i].btnType === $.rup.dialog.LINK) {
							linkButtons.push(value.splice(i, 1));
							i--;
						}					
					}
					i = null;
				}
				linkButtonsLength = linkButtons.length;
				//Si tiene mas de dos botones y ninguno de ellos es de tipo link, entonces le mostrar una alerta diciendo que no cumple arista.
				if (btnsLength > 1 && linkButtonsLength === 0 /*&& settings.rupCheckStyle*/) {
					$.rup.msgAlert({message: $.rup.i18n.base.rup_global.rupCheckStyleError});
					return false;
				}
				$(this).dialog("option", opt, value);
				if (linkButtonsLength > 0) { //si tenemos enlaces loa añadimos
					for (j = 0; j < linkButtonsLength; j++) {
						$.fn.rup_dialog.createBtnLinks(linkButtons[j][0], this[0].id);
					}
					j = null;
				}
				return;
			}
			$(this).dialog("option", opt, value);			
		},	
		createBtnLinks : function (btn, id) {
			/**
			 * Función que crea los botones como enlaces y se los añade al panel de botones al final de los botones
			 */
			var buttonHREF = $("<a href='#'></a>")
			.attr("role", "button")
			.attr("id", "rup_dialog" + btn.text)
			.addClass("rup-enlaceCancelar")
			.html(btn.text)
			.click(btn.click);
			$('div[aria-labelledby=ui-dialog-title-' + id + '] .ui-dialog-buttonset ').append(buttonHREF); 
		}
	});
	//Valores por defecto de modal dialog
	$.fn.rup_dialog.defaults = {
			rupCheckStyle: true,
			type: $.rup.dialog.DIV,
			url: null,
			showLoading: false
		};		
})(jQuery);