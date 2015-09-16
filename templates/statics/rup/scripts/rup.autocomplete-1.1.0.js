/*!
 * Copyright 2011 E.J.I.E., S.A.
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
(function ($) {
	
	//****************************************************************************************************************
	// DEFINICIÓN BASE DEL PATRÓN (definición de la variable privada que contendrá los métodos y la función de jQuery)
	//****************************************************************************************************************
	
	var rup_autocomplete = {};
	
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupSelectorObjectConstructor("rup_autocomplete", rup_autocomplete));
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//*******************************
	$.fn.rup_autocomplete("extend",{
		destroy:function(){
			$(this).autocomplete("destroy");
		},
		off:function(){
			$(this).storeEvents();
		},
		on:function(){
			$(this).restoreEvents();
		},
		disable:function(){
			$(this).attr("disabled","disabled");
			$(this).rup_autocomplete("off");
		},
		enable:function(){
			$(this).removeAttr("disabled");
			$(this).rup_autocomplete("on");
		},
		option: function (optionName, value){
			$(this).autocomplete("option" , optionName , value);
		},
		search: function(term){
			//Si tiene eventos (no está deshabilitado) se hace búsqueda
			if ($(this).data('events') !== undefined){
				$(this).autocomplete("search",term);
				$(this).val(term);
				$(this).focus();
			}
		},
		close:function(){
			$(this).autocomplete("close");
		},
		val:function(){
			return $("#"+$(this).attr("id")+"_value").val();
		}
	});
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PRIVADOS
	//*******************************
	$.fn.rup_autocomplete("extend", {
			_parseResponse : function(term, label, value) {
				return {
					label: label.replace(
								new RegExp("(?![^&;]+;)(?!<[^<>]*)(" +$.ui.autocomplete.escapeRegex(term) +	")(?![^<>]*>)(?![^&;]+;)", "gi"),
								"<strong>$1</strong>" 
						),
					value: value
				};
			},
			_sourceLOCAL : function (request, response) {
				var settings = this.options,
				 	matcher = settings.contains?$.ui.autocomplete.escapeRegex(request.term):"^" +$.ui.autocomplete.escapeRegex(request.term),
					json_i18n = $.rup.i18n.app[settings.i18nId];
				matcher = new RegExp(matcher, "i");
					
				data = $.map(settings.data,function(item) {
					var label=item, value=item;
					if (typeof item === "object"){ //multi-idioma
						label = $.rup.i18nParse(json_i18n,item["i18nCaption"]);
						value = item["value"];
					} 
					
					if (!request.term || matcher.test(label)) {
						return settings._parseResponse(request.term, label, value);
					};
				});
				
				//Eliminar elementos vacíos
				data = $.grep(data, function(value) { return value != undefined; });
				response(data);
			},
			_sourceREMOTE : function (request, response){
				//Se escapan los comodines/wildcards de BD
				var term = request.term.replace(/%/g,"\\%").replace(/_/g,"\\_");
					settings = this.options,
					data = {q:term,c:this.options.contains};
					
				$.rup_ajax({
					url: settings.data,
					data : data,
					//Cabecera RUP
					beforeSend: function (xhr){
						xhr.setRequestHeader("RUP", $.toJSON(settings.sourceParam));
					},
					success: function(data) {
						response($.map(data, function(item) { 
							return settings._parseResponse(request.term, item["label"], item["value"]);
						}));
					},
					error: function (XMLHttpRequest, textStatus, errorThrown){
						alert("Se ha producido un error al recuperar los datos del servidor");
					}
				});
			},
			_init : function(args){
				if (args.length > 1) {
					$.rup.errorGestor($.rup.i18n.base.rup_global.initError + $(this).attr("id"));
				} else {
					//Se recogen y cruzan las paremetrizaciones del objeto
					var settings = $.extend({}, $.fn.rup_autocomplete.defaults, args[0]),
						name = $("#"+this.id).attr("name"),
						selected_value;
					
					//Recopilar datos necesarios
					settings.id = $(this).attr("id");
					settings.data = settings.source; //Guardar los datos en "data" ya que source la emplea autocomplete internamente
					settings._parseResponse = this._parseResponse; //Guardar referencia a rup.autocomplete para invocar las funciones privadas

					//Si no se recibe identificador para el acceso a literales se usa el ID del objeto
					if (!settings.i18nId){ settings.i18nId = settings.id; }
					
					//Eventos
					//*******
						//Guardar referencia
						settings._change = settings.change;
						settings._select = settings.select;
						settings._focus = settings.focus;
	
						//Sobrecargar tratamiento
						settings.change = function(event, ui) {
							$("#"+event.target.id+"_value").val($("#"+event.target.id).val());
							if(selected_value != null){//Puede que se ejecute este evento sin ejecutarse el select. Con esta condición nos aseguramos
								$("#"+event.target.id).val(selected_value);
							}
							selected_value = null;
							if (settings._change!==undefined){settings._change(event,ui);}
						};
						settings.select = function(event, ui) { 
						 	selected_value = ui.item["label"].replace(/<strong>/g,"").replace(/<\/strong>/g,"");
							if (settings._select!==undefined){settings._select(event, ui);}
						}; 
						settings.focus = function(event, ui) {
							$("#"+event.target.id).val(ui.item["label"].replace(/<strong>/g,"").replace(/<\/strong>/g,""));
							$("#"+event.target.id+"_value").val(ui.item["value"]);
							if (settings._focus!==undefined){settings._focus(event, ui);}
							return false; //Evitar acciones jquery.autocomplete.js
						};


					//Generación de campo oculto para almacenar 'value' (en el input definido se guarda el 'label')
					$("#"+settings.id).after($("<hidden>").attr({
						id: settings.id+"_value",	
						name: name
					})).attr("name", name+"_label");


					if (typeof settings.source === "object"){
						//LOCAL						
						settings.source = this._sourceLOCAL;
					} else {
						//REMOTO
						//Nos aseguramos que el número mínimo de teclas para búsquedas sea 3
						settings.minLength = settings.minLength>3?settings.minLength:3;
						settings.source = this._sourceREMOTE;
					}
					
					
					//Invocación al componente subyacente
					$("#"+settings.id).autocomplete(settings);
					
					//Buscar el UL del autocomplete y colocarlo tras el elemento sobre el que debe ir
					$("#"+settings.id).after($("body > .ui-autocomplete"));
					
					//Deshabilitar
					if (settings.disabled) { $("#"+settings.id).rup_autocomplete("disable"); }
					
					//Valor por defecto
					if (settings.defaultValue) { $("#"+settings.id).rup_autocomplete("search", settings.defaultValue); }
				}
			}
		});
		
	//******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//******************************************************
	$.fn.rup_autocomplete.defaults = {
		contains : true
	};	
	
	
})(jQuery);