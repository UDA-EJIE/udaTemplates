/*!
 * Copyright 2013 E.J.I.E., S.A.
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
		getRupValue : function(){
			return $(this).val();
		},
		setRupValue : function(param){
			$(this).val(param);
		},
		destroy:function(){
			var self;
			
			if ($(this).attr("id").indexOf("_label") >= 0){
				self = $(this);
			} else {
				self = $("#"+$(this).attr("id")+"_label");
			}
			
			self.autocomplete("destroy");
		},
		off:function(){
			var self;
			
			if ($(this).attr("id").indexOf("_label") >= 0){
				self = $(this);
			} else {
				self = $("#"+$(this).attr("id")+"_label");
			}
			
			self.storeEvents();
		},
		on:function(){
			var self;
			
			if ($(this).attr("id").indexOf("_label") >= 0){
				self = $(this);
			} else {
				self = $("#"+$(this).attr("id")+"_label");
			}
			
			self.restoreEvents();
		},
		disable:function(){
			var self;
			
			if ($(this).attr("id").indexOf("_label") >= 0){
				self = $(this);
			} else {
				self = $("#"+$(this).attr("id")+"_label");
			}
			
			self.attr("disabled","disabled");
		},
		enable:function(){
			var self;
			
			if ($(this).attr("id").indexOf("_label") >= 0){
				self = $(this);
			} else {
				self = $("#"+$(this).attr("id")+"_label");
			}
			
			self.removeAttr("disabled");
		},
		option: function (optionName, value, aux){
			var self;
			
			if ($(this).attr("id").indexOf("_label") >= 0){
				self = $(this);
			} else {
				self = $("#"+$(this).attr("id")+"_label");
			}
			
			var settings = self.data("settings");
			if (optionName === "source"){
				if (typeof value === "object"){
					//LOCAL
					if (aux !== undefined){
						settings.i18nId = aux;
					} else {
						settings.i18nId = settings.id ;
					}
					self.autocomplete("option" , optionName , this._sourceLOCAL);
					self.autocomplete("option" , "minLength" , settings.minLength !== undefined?settings.minLength:0);
				} else {
					if (aux !== undefined){
						//REMOTO
						settings.sourceParam = aux;
						//Nos aseguramos que el número mínimo de teclas para búsquedas sea 3
						self.autocomplete("option" , optionName , this._sourceREMOTE);
						self.autocomplete("option" , "minLength" , settings.minLength>3?settings.minLength:3);
					} else {
						return undefined;
					}
				}
				settings.data = value;
				self.data("settings",settings);
			} else {
				settings[optionName] = value;
				self.data("settings",settings);
				self.autocomplete("option" , optionName , value);
			}
		},
		search: function(term){
			//Si tiene eventos (no está deshabilitado) se hace búsqueda
			if ($._data($(this)[0], "events") !== undefined){
				$(this).focus();
				$(this).val(term);
				$(this).autocomplete("search",term);
			}
		},
		close:function(){
			$(this).autocomplete("close");
		},
		val:function(){
			return $("#"+$(this).attr("id")).val();
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
				var settings, loadObjects = {}, returnValue, stock;
				
				if (this.element.data("settings") !== undefined){
					settings = this.element.data("settings");
				}else{
					settings = this.options;
				}
				
				if (settings.loadObjects !== undefined){
					stock = settings.loadObjects;
				} else {
					stock = settings.id;
				}
				
				
				var matcher = settings.contains?$.ui.autocomplete.escapeRegex(request.term):"^" +$.ui.autocomplete.escapeRegex(request.term),
					json_i18n = $.rup.i18n.app[settings.i18nId];
				matcher = new RegExp(matcher, "i");
				data = $.map(settings.data,function(item) {
					var label=item, value=item;
					if (typeof item === "object"){ //multi-idioma
						if(item["i18nCaption"] !== undefined){
							label = $.rup.i18nParse(json_i18n,item["i18nCaption"]);
						} else if (item["label"] !== undefined){
							label = item["label"];
						} else {
							label = item["value"];
						}
						value = item["value"];
					} 
					if (!request.term || matcher.test(label)) {
						returnValue = settings._parseResponse(request.term, label, value);
						loadObjects[returnValue.label.replace(/<strong>/g,"").replace(/<\/strong>/g,"")] = returnValue.value ;
						return returnValue;
					};
				});
				
				//Se almacenan los datos cargados
				$("#"+stock).data("loadObjects",loadObjects);
				
				//Eliminar elementos vacíos
				data = $.grep(data, function(value) { return value != undefined; });
				response(data);
			},
			_sourceREMOTE : function (request, response){
				//Se escapan los comodines/wildcards de BD
				var settings, loadObjects = {}, returnValue, stock;
								
				if (this.element.data("settings") !== undefined){
					settings = this.element.data("settings");
				}else{
					settings = this.options;
				}
				
				if (settings.loadObjects !== undefined){
					stock = settings.loadObjects;
				} else {
					stock = settings.id;
				}
				
				var term = request.term.replace(/%/g,"\\%").replace(/_/g,"\\_"),
					data = $.extend({q:term,c:this.options.contains},this.options.extraParams);
				
				$.rup_ajax({
					url: settings.data,
					data : data,
					dataType: 'json',
					contentType: 'application/json',
					//Cabecera RUP
					beforeSend: function (xhr){
						//LOADING...
						$("#"+settings.id+"_label").addClass("rup-autocomplete_loading");
						
						xhr.setRequestHeader("RUP", $.toJSON(settings.sourceParam));
					},
					success: function(data) {
						response($.map(data, function(item) {
							returnValue =  settings._parseResponse(request.term, item["label"], item["value"]);
							loadObjects[returnValue.label.replace(/<strong>/g,"").replace(/<\/strong>/g,"")] = returnValue.value ;
							return returnValue;
						}));
						
						//se almacenan los datos cargados
						$("#"+stock).data("loadObjects",loadObjects);
					},
					error: function (xhr, textStatus, errorThrown){
						if (settings.onLoadError!==null && typeof settings.onLoadError === "function"){
							jQuery(settings.onLoadError(xhr, textStatus, errorThrown));
						}else{
							$.rup.showErrorToUser($.rup.i18n.base.rup_autocomplete.ajaxError);
						}
					},
					complete: function(xhr, textStatus) {
						//UNLOADING...
						$("#"+settings.id+"_label").removeClass("rup-autocomplete_loading");
					}
				});
			},
			_init : function(args){
				if (args.length > 1) {
					$.rup.errorGestor($.rup.i18nParse($.rup.i18n.base,"rup_global.initError") + $(this).attr("id"));
				} else {
					//Se recogen y cruzan las paremetrizaciones del objeto
					var settings = $.extend({}, $.fn.rup_autocomplete.defaults, args[0]),
						name = $(this).attr("name"),
						selected_value;
					
					$(this).attr("ruptype","autocomplete");
					
					//Recopilar datos necesarios
					settings.id = $(this).attr("id");
					settings.loadObjects = settings.id;
					settings.data = settings.source; //Guardar los datos en "data" ya que source la emplea autocomplete internamente
					settings._parseResponse = this._parseResponse; //Guardar referencia a rup.autocomplete para invocar las funciones privadas
					
					//Guardar valor del INPUT
					settings.loadValue = $("#"+settings.id).attr('value');

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
							if(selected_value != null){//Puede que se ejecute este evento sin ejecutarse el select. Con esta condición nos aseguramos
								$("#"+event.target.id).val(selected_value);
								$("#"+event.target.id).focus();
							}
							selected_value = null;
							if (settings._change!==undefined){settings._change(event,ui);}
						};
						settings.select = function(event, ui) {
						 	selected_value = ui.item["label"].replace(/<strong>/g,"").replace(/<\/strong>/g,"");
							if (settings._select!==undefined){settings._select(event, ui);}
							$("#"+settings.id).attr("rup_autocomplete_label",selected_value);
							$("#"+settings.id).data("selected",true);
						}; 
						settings.focus = function(event, ui) {
							$("#"+event.target.id).val(ui.item["label"].replace(/<strong>/g,"").replace(/<\/strong>/g,""));
							if (settings._focus!==undefined){settings._focus(event, ui);}
							return false; //Evitar acciones jquery.autocomplete.js
						};


					//Generación de campo oculto para almacenar 'value' (en el input definido se guarda el 'label')
					$("#"+settings.id).after($("<input>").attr({
						type:"hidden",
						id: settings.id+"_value",
						name: (settings.valueName===null?name:settings.valueName),
						ruptype:"autocomplete"
										}))
									  .attr("name", (settings.labelName===null?name+"_label":settings.labelName))
									  .addClass("rup-autocomplete_label");
					
					if (typeof settings.source === "object"){
						//LOCAL						
						settings.source = this._sourceLOCAL;
					} else {
						//REMOTO
						//Nos aseguramos que el número mínimo de teclas para búsquedas sea 3
						settings.minLength = settings.minLength>3?settings.minLength:3;
						settings.source = this._sourceREMOTE;
					}
					
					//Se prepara el almacenaje de datos 
					$("#"+settings.id).data("loadObjects",{});
					
					//Invocación al componente subyacente
					$("#"+settings.id).autocomplete(settings);
					
					//Buscar el UL del autocomplete y colocarlo tras el elemento sobre el que debe ir
					//$("#"+settings.id).after($("body > .ui-autocomplete"));
					
					//Buscar el UL del autocomplete y colocarlo tras el elemento sobre el que debe ir
					if($.rup_utils.aplicatioInPortal()){
						$("div.r01gContainer").append($("body > .ui-autocomplete"));
					}
					
					//Deshabilitar
					if (settings.disabled) { $("#"+settings.id).rup_autocomplete("disable"); }
					
					//Valor por defecto
					if (settings.defaultValue) { $("#"+settings.id).rup_autocomplete("search", settings.defaultValue); }
					
					//Valor pre-cargado
					if(settings.loadValue) {
						$("#"+settings.id).val(settings.loadValue);
						$("#"+settings.id+"_value").val(settings.loadValue);
					}
					
					// Modificar identificadores
					settings.loadObjects = settings.id+"_label";
					$("#"+settings.id).attr("id", settings.id+"_label");
					$("#"+settings.id+"_value").attr("id", settings.id);
					
					
					//eventos internos de borrado y perdida de foco
					$("#"+settings.id+"_label").bind("blur keydown", function(event){
						//Obtener datos de si viene de seleccionar elemento o si el menú de selección está desplegado
						var selected = $("#"+settings.id).data("selected"),
							isShowingMenu = $(".ui-autocomplete:visible").length>0?true:false;
						//Borrar índicador de que viene de seleccionar elemento		
						$("#"+settings.id).data("selected",false);
						//Si es un evento de teclado pero no es ENTER, omitir esta función
						if (event.type==="keydown" && event.keyCode!==13){return true;}
						
						var autoCompObject = $(event.currentTarget), 
							loadObjects = $("#"+settings.loadObjects).data("loadObjects");

						if (settings.getText==true){
							if(loadObjects[autoCompObject.val()] !== undefined){
								$("#"+settings.id).val(autoCompObject.val());
								$("#"+settings.id).attr("rup_autocomplete_label",autoCompObject.val());
							} else {
								$("#"+settings.id).val(autoCompObject.val());
								$("#"+settings.id).attr("rup_autocomplete_label",autoCompObject.val());
							}
						}else{
							if(loadObjects[autoCompObject.val()] !== undefined){
								$("#"+settings.id).val(loadObjects[autoCompObject.val()]);
								$("#"+settings.id).attr("rup_autocomplete_label",loadObjects[autoCompObject.val()]);
							} else {
								$("#"+settings.id).val("");
								$("#"+settings.id).attr("rup_autocomplete_label","");
								autoCompObject.val("");
								autoCompObject.autocomplete("close");
							}
						}
						//Si el evento es ENTER y viene de seleccionar un elemento o el menú se estaba mostrando, omitir resto de funciones (ej. buscar)	
						if (event.type==="keydown" && event.keyCode===13 && (selected || isShowingMenu)){return false;}
					});
				}
				//se guarda la configuracion general (settings) del componente
				$("#"+settings.id+"_label").data("settings",settings);
			}
		});
		
	//******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//******************************************************
	$.fn.rup_autocomplete.defaults = {
		onLoadError : null,
		contains : true,
		valueName: null,
		labelName: null,
		getText: false
	};	
	
	
})(jQuery);