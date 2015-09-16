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

//Modificado "jquery.ui.selectmenu.js" línea 438-442

(function ($) {
	
	//****************************************************************************************************************
	// DEFINICIÓN BASE DEL PATRÁN (definición de la variable privada que contendrá los métodos y la función de jQuery)
	//****************************************************************************************************************
	
	var rup_combo = {};
	
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupSelectorObjectConstructor("rup_combo", rup_combo));
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//*******************************
	$.fn.rup_combo("extend",{
		getRupValue : function(param){
			return $(this).rup_combo("value");
		},
		setRupValue : function(param){
			$.data(this[0],"setRupValue",param.toString());
			$(this).rup_combo("select",param.toString());
		},
		select : function(param){
			//Cargar elemento
			var elementSet = this._setElement($(this).selector, param);
			//Si se ha cargado un elemento válido
			if (elementSet){
				//Lanzar cambio para que se recarguen hijos
				var hijos = $(this).data("childs");
				if(hijos !== undefined){
					for (var i=0;i<hijos.length;i=i+1){
						$("#"+hijos[i]).rup_combo('reload',hijos[i]);
					}
				}
			}
		},
		selectLabel : function(param){
			//Cargar elemento
			var elementSet = this._selectLabel($(this).selector, param, true);
			//Si se ha cargado un elemento válido
			if (elementSet){
				//Lanzar cambio para que se recarguen hijos
				var hijos = $(this).data("childs");
				if(hijos !== undefined){
					for (var i=0;i<hijos.length;i=i+1){
						$("#"+hijos[i]).rup_combo('reload',hijos[i]);
					}
				}
			}
		},
		value : function(){
			return ($(this).selectmenu("value"));
		},
		label : function(){
			return (this[0].options[$(this).selectmenu("index")].text);
		},
		index : function(){
			return ($(this).selectmenu("index"));
		}, 
		disable : function(){
			$(this).selectmenu("disable");
		},
		enable : function(){
			$(this).selectmenu("enable");
		},
		isDisabled : function(){
			if ($(this).attr('aria-disabled') === 'false'){
				return false;
			} else {
				return true;
			}
		},
		disableChild : function(){
			//Vaciar combo, deshabilitarlo
			$(this).empty().selectmenu("disable");
			//Eliminar texto que se muestra
			$("#"+$(this).attr("id")+"-button span:first-child").text("");
			//Propagar evento de selección a hijos (recursivo)
			var hijos = $(this).data("childs");
			for (var i in hijos){
				$("#"+hijos[i]).rup_combo("disableChild");
			}
		},
		//Funcion que refresca los valores asociados al combo
		refresh : function(){
			return $(this).selectmenu();
		},
		//Funcion encargada de recargar los combos
		reload: function (id){
			var settings = $(this).data("settings"),
				source;
				
			//Vaciar combo, quitarle valor y deshabilitar
			$("#"+settings.id).rup_combo("disableChild");
			
			if (typeof settings.source === "object" || typeof settings.sourceGroup === "object"){
				//LOCAL
				source = settings.source[this._getParentsValues(settings.parent, false, settings.multiValueToken)];
				if (source!==undefined){
					//Parsear datos
					this._parseLOCAL(source, settings, $("#"+settings.id));
					
					//Crear combo
					this._makeCombo(settings);
					
					// Evento de finalizacion de carga (necesario para trabajar con el manteniminto)
					if(settings.onLoadSuccess!==null){
						jQuery(settings.onLoadSuccess($("#"+settings.id)));
					}
					
					//Lanzar cambio para que se recarguen hijos
					$("#"+settings.id).selectmenu("change");
				}
			} else if (typeof settings.source === "string" || typeof settings.sourceGroup === "string"){
				//REMOTO
				var data = this._getParentsValues(settings.parent, true),
				rupCombo = this;
				if (data===null){ return false; } //Se para la petición porque algún padre no tiene el dato cargado
				
				$.rup_ajax({
					url: settings.source,
					data : data,
					dataType: 'json',
					contentType: 'application/json',
					beforeSend: function (xhr){
						rupCombo._ajaxBeforeSend(xhr, settings);
					},
					success: function (data, textStatus, jqXHR){
						rupCombo._ajaxSuccess(data, settings, $("#"+settings.id));
						
						// Evento de finalizacion de carga (necesario para trabajar con el manteniminto)
						if(settings.onLoadSuccess!==null){
							jQuery(settings.onLoadSuccess($("#"+settings.id)));
						}
					},
					error: rupCombo._ajaxError	
				});
				delete rupCombo;
			} else if (typeof settings.source === "function" || typeof settings.sourceGroup === "function"){
				//Se lanza la funcion que obtiene los valores a mostrar
				jQuery(settings.source);
				this._makeCombo(settings);
			}
		},
		order: function (orderedByValue, skipFirst){
			var combo = $(this),
				options = $('option', combo),
				arrVals = [],
				skippedValue = null;
			
			//Comprobar que se ha obtenido el combo deseado
			if (combo.length>0){
				
				//Guardar elemento seleccionado
				var selectedVal = combo.val();
			
				//Obtener elementos combo
				options.each(function(){
					 //Omitir posible opción vacía
					if (skipFirst){ 
						skipFirst = false;
						skippedValue = {
							val: $(this).val(),
					        text: $(this).text()
						};
						return true; 
					}
					arrVals.push({
						val: $(this).val(),
				        text: $(this).text(),
						clazz: $(this).attr('class')
					});
				});
				
				//Ordenar elementos (segun parametros, por defecto de texto)
				if (!orderedByValue){
					arrVals.sort(function(a, b){
						return a.text.localeCompare(b.text);
					});
				} else {
					arrVals.sort(function(a, b){
					    if(a.val>b.val){ return 1;
					    } else if (a.val==b.val){ return 0;
					    } else { return -1; }
					});
				}
				
				//Actualizar combo con elementos ordenados
			    for (var i = 0, l = arrVals.length; i < l; i++) {
			        $(options[i]).val(arrVals[i].val).text(arrVals[i].text);
					if (arrVals[i].clazz){
						$(options[i]).attr('class', arrVals[i].clazz);
					}
			    }
			
				//Añadir opción vacía al inicio
				if (skippedValue){
					combo.prepend($("<option>").attr("value", skippedValue.val).text(skippedValue.text));//Añadir opción vacía
					$(options[arrVals.length]).remove();//Eliminar ultimo elemento
				}
			
				//Regenerar combo
				combo.selectmenu();
				
				//Restaurar elemento seleccionado
				this._setElement($(this).selector,selectedVal);
								
				//Eliminar referencias
				delete combo;
				delete options;
				delete arrVals;
			}			
		}
	});
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PRIVADOS
	//*******************************
	$.fn.rup_combo("extend", {
			//Establece un elemento del combo por posición o valor
			_setElement : function(selector, param){
				if (typeof param === "string" ){
					if ($("option[value='"+param+"']", selector).length>0){//Controlamos que se intenten seleccionar un valor existente
						$(selector).selectmenu("value", param);
					} else {
						return false;
					}
				} else if(typeof param === "number" ){
					if ($('option', selector).length >= param){//Controlamos que se intenten seleccionar una posición existente
						$(selector).selectmenu("index", param);
					} else {
						return false;
					}
				} else {
					$(selector).selectmenu("index", 0);
				}
				return true;
			},
			_selectLabel : function(selector, param){
				for(var i = 0; i<$("option", selector).length; i=i+1){
					if($("option", selector)[i].label === param){
						$(selector).selectmenu("index", $("option", selector)[i].index);
						return true;
					}
				}
				return false;
			},
			//Obtener la opción vacía (del fichero de la app o el por defecto)
			_getBlankLabel : function (id){
				var app = $.rup.i18n.app;
				if (app[id] && app[id]["_blank"]){
					return app[id]["_blank"];
				} 
				return $.rup.i18n.base["rup_combo"]["blankNotDefined"];
			},
			//Formateo de textos
			_defaultFormatting : function(text){
				var findreps = [
						{find:/^([^\-]+) \- /g, rep: '<span class="ui-selectmenu-item-header">$1</span>'},
						{find:/([^\|><]+) \| /g, rep: '<span class="ui-selectmenu-item-content">$1</span>'},
						{find:/([^\|><\(\)]+) (\()/g, rep: '<span class="ui-selectmenu-item-content">$1</span>$2'},
						{find:/([^\|><\(\)]+)$/g, rep: '<span class="ui-selectmenu-item-content">$1</span>'},
						{find:/(\([^\|><]+\))$/g, rep: '<span class="ui-selectmenu-item-footer">$1</span>'}
					];
				for(var i in findreps){
					text = text.replace(findreps[i].find, findreps[i].rep);
				}
				return text;
			},	
			//Obtener valores padres (si no están cargados o valores 'vacíos' devuelve null)
			_getParentsValues : function(array, remote, multiValueToken){
				var retorno="", id, texto, multiValueToken=multiValueToken!=null?multiValueToken:"";
				
				for (var i=0; i<array.length;i=i+1){
					id = array[i];
					//Si tiene seleccionado la primera opción puede que está seleccionada opción vacia
					if ($("#"+id).rup_combo("index") === 0){
						texto = $("#"+id+"-button span:first-child").text();
						//Comprobar si tiene valor por defecto (bien propio o valor base por no haberlo definido)
						if ( texto === $.rup.i18n.base["rup_combo"]["blankNotDefined"] ||
							(($.rup.i18n.app[id] !== undefined) && (texto === $.rup.i18n.app[array[i]]["_blank"])) ){
							return null;	
						}
					}
					
					//Si el valor de algún padre es null (no se ha cargado aún)
					if ($("#"+id).val()===null){ return null; };
					
					if (remote){
						retorno += $("#"+id).attr("name") + "=" + $("#"+id).val() + "&"; 
					} else {
						retorno += $("#"+id).val() + multiValueToken;
					}
				}
				//Evitar & o multiValueToken finales
				if (retorno!=="") {
					if (remote){
						retorno = retorno.substring(0, retorno.length-1);
					} else {
						retorno = retorno.substring(0, retorno.length-multiValueToken.length);
					}
				}
				return retorno;
			},
			//Crear combo
			_makeCombo : function(settings) {
					//Opción vacía
					if (settings.blank!=null){
						$("#"+settings.id).prepend($("<option>").attr("value", settings.blank).text(this._getBlankLabel(settings.id)));
					}
					
					//Gestionar Imagenes
					if (settings.imgs) {
						var icons = [], values = [];
						$.map(settings.imgs,function(item) {
							for (var key in item){
								if (key.indexOf("###")==-1){
									$("#"+settings.id+" [value='"+key+"']").addClass(item[key]);
									icons[icons.length] = { find: '.'+item[key] };
								} else {
									values = key.split("###");
									$("#"+settings.id+" > [label='"+values[0]+"'] > [value='"+values[1]+"']").addClass(item[values[0]+"###"+values[1]]);
									icons[icons.length] = { find: '.'+item[values[0]+"###"+values[1]] };
								}
							}
						});
						settings.icons = icons;
					}
					
					//Formato texto
					settings.format = settings.format==="default"?this._defaultFormatting:settings.format;
					
					//Selectmenu
//					settings.id=$(this).attr("id");
					$("#"+settings.id).selectmenu(settings);
//					settings.id=$.rup_utils.escapeId($(this).attr("id"));
					//Buscar el UL del combo y colocarlo tras el elemento sobre el que debe ir
					$("#"+settings.id+"-button").after($("#"+settings.id+"-menu"));
					
					//Seleccionar elemento
					this._setElement("#"+settings.id, settings.selected);
					
					//Ordenar elementos del combo
					if (settings.ordered){
						$("#"+settings.id).rup_combo("order", settings.orderedByValue, settings.blank);
					}
					
					//Habilitar/Deshabilitar combo
					if (!settings.disabled) { 
						$("#"+settings.id).rup_combo("enable");
					} else {
						$("#"+settings.id).rup_combo("disable"); 
					}
									
					
					//Si los padres están deshabilitados, se deshabilita el combo 
					var padres = settings.parent;
					if (padres !== undefined){
						$.each(padres, function(index, object) {
							if($("#"+object).rup_combo("isDisabled")){
								$("#"+settings.id).rup_combo("disable");
								return;
							}
						});
					}
			},
			_parseLOCAL : function (array, settings, html){
				var imgs = settings.imgs?settings.imgs:[],
					label, value;
				for (var i in array){
					label = value = array[i];
					if (typeof array[i] === "object"){ //multi-idioma
						if(array[i]["i18nCaption"]){
							label = $.rup.i18nParse($.rup.i18n.app[settings.i18nId],array[i]["i18nCaption"]);
						}else{
							label = array[i]["label"];
						}
						value = array[i]["value"];
					}
					if (array[i]["style"]){
						imgs[imgs.length] = {};
						imgs[imgs.length-1][value] = array[i]["style"];
						settings.imgs = imgs;
					}
					html.append($("<option>").attr("value", value).text(settings.showValue?value+settings.token+label:label));
				}
			}, 
			_parseOptGroupLOCAL : function(arrayGroup, settings, html){
				var optGroup;
				for (var i in arrayGroup){
					optGroup = arrayGroup[i];
					for (var key in optGroup){
						if (typeof (optGroup[key][0]) !== 'string'){
							html.append($("<optgroup>").attr("label", $.rup.i18nParse($.rup.i18n.app[settings.i18nId],key)));
						} else {
							html.append($("<optgroup>").attr("label",key));
						}
						html = $(html).children("optgroup:last-child");
						this._parseLOCAL(optGroup[key], settings, html);
						html = $(html).parent();
					}
				}
			},
			_parseREMOTE : function(array, settings, html, optGroupKey){
				var remoteImgs = settings.imgs?settings.imgs:[],
					item, setRupValue;
					for ( var i = 0; i < array.length; i = i + 1) {
					item = array[i];
					if (item["style"]){
						remoteImgs[remoteImgs.length] = {};
						if (optGroupKey==null){
							remoteImgs[remoteImgs.length-1][item["value"]] = item["style"];
						} else {
							remoteImgs[remoteImgs.length-1][optGroupKey+"###"+item["value"]] = item["style"];
						}
						settings.imgs = remoteImgs;
					}
					html.append($("<option>").attr("value", item["value"]).text(settings.showValue?item["value"]+settings.token+item["label"]:item["label"]));
				}
			},
			_parseOptGroupREMOTE : function(arrayGroup, settings, html){
				var optGroup;
				for (var i in arrayGroup){
					optGroup = arrayGroup[i];
					for (var key in optGroup){
						html.append($("<optgroup>").attr("label",key));
						html = $(html).children("optgroup:last-child");
						this._parseREMOTE(optGroup[key], settings, html, key);
						html = $(html).parent();
					}
				}
			},
			_ajaxBeforeSend : function (xhr, settings, html){
				//Crear combo (vacío) y deshabilitarlo
				if (html!==undefined){ $("#"+settings.id).replaceWith(html); } //Si no es 'reload' se debe inicializar vacío
				this._makeCombo(settings);
				$("#"+settings.id).rup_combo("disable"); 
				 
				//LOADING...
				$("#"+settings.id+"-button span:first-child").addClass("rup-combo_loadingText").text($.rup.i18n.base["rup_combo"]["loadingText"]);
				var icon = $("#"+settings.id+"-button span:last-child");
				$(icon).removeClass("ui-icon-triangle-1-s");
				$(icon).addClass("rup-combo_loading");
				
				//Cabecera RUP
				xhr.setRequestHeader("RUP", $.toJSON(settings.sourceParam));
			},
			_ajaxSuccess : function (data, settings, html){
				//UNLOADING...
				$("#"+settings.id+"-button span:first-child").removeClass("rup-combo_loadingText").text("");
				var icon = $("#"+settings.id+"-button span:last-child");
				$(icon).removeClass("rup-combo_loading");
				$(icon).addClass("ui-icon-triangle-1-s");
				
				//Vaciar combo
				$("#"+settings.id).empty();
				
				//Cargar combo (si se reciben datos)
				if (data.length>0){
					if (settings.source) {
						this._parseREMOTE(data, settings, html);
					} else {
						settings.ordered = false;
						this._parseOptGroupREMOTE(data, settings, html);
					}
				
					//Crear combo
					this._makeCombo(settings);
					
					setRupValue = $.data($("#"+settings.id)[0],"setRupValue");
					if (setRupValue){
						
					//Vaciar combo, quitarle valor y deshabilitar
						$("#"+settings.id).rup_combo("select",setRupValue);
					}
					
					//Lanzar cambio para que se recarguen hijos
					$("#"+settings.id).selectmenu("change");
				}
			},
			_ajaxError : function (XMLHttpRequest, textStatus, errorThrown){
				alert("Se ha producido un error al recuperar los datos del servidor");
			},
			_init : function(args){
				if (args.length > 1) {
					$.rup.errorGestor($.rup.i18nParse($.rup.i18n.base,"rup_global.initError") + $(this).attr("id"));
				} else {
					//Se recogen y cruzan las paremetrizaciones del objeto
					var settings = $.extend({}, $.fn.rup_combo.defaults, args[0]), 
						html;
					//Se carga el identificador del padre del patron
					settings.id = $.rup_utils.escapeId($(this).attr("id"));
					settings.name = $(this).attr("name");
					
					//Si no se recibe identificador para el acceso a literales se usa el ID del objeto
					if (!settings.i18nId){ settings.i18nId = settings.id; }
					
					//Contenido combo
					html = $("<select>").attr({"id" : $(this).attr("id"), "name" : settings.name, "ruptype":"combo"}).addClass("rup_combo");
					
					if (settings.parent){
					//DEPENDIENTE
						//Guardar referencia a hijos en cada uno de los padres (propagación de carga)
						$.map(settings.parent,function(item){
							var childsArray = $('#'+item).data("childs")===undefined?[]:$('#'+item).data("childs");
							childsArray[childsArray.length] = settings.id;
							$('#'+item).data("childs", childsArray);
						});  
						
						//Crear combo y deshabilitarlo
						$("#"+settings.id).replaceWith(html);
						this._makeCombo(settings);
						$("#"+settings.id).rup_combo("disable");
						 
						//Almacenar los settings para el 'reload'
						$("#"+settings.id).data("settings", settings);
						
						//Comprobar si los padres ya tienen datos seleccionados (si son LOCALES puede suceder)
						if (this._getParentsValues(settings.parent)!==null){
							$("#"+settings.id).rup_combo("reload", settings.id); 
						}
					}else if (typeof settings.source === "object" || typeof settings.sourceGroup === "object"){
					//LOCAL
						//Parsear datos
						if (settings.source) {
							this._parseLOCAL(settings.source, settings, html);
						} else {
							settings.ordered = false;
							this._parseOptGroupLOCAL(settings.sourceGroup, settings, html);
						}
						
						//Crear combo
						$("#"+settings.id).replaceWith(html);
						this._makeCombo(settings);
						
						if(settings.onLoadSuccess!==null){
							jQuery(settings.onLoadSuccess($("#"+settings.id)));
						}
						
					} else if (typeof settings.source === "string" || typeof settings.sourceGroup === "string"){
					//REMOTO
						var url = settings.source?settings.source:settings.sourceGroup,
							rupCombo = this;
						$.rup_ajax({
							url: url,
							dataType: 'json',
							contentType: 'application/json',
							beforeSend: function (xhr){
								rupCombo._ajaxBeforeSend(xhr, settings, html);
							},
							success: function (data, textStatus, jqXHR){
								rupCombo._ajaxSuccess(data, settings, html);
								if(settings.onLoadSuccess!==null){
									jQuery(settings.onLoadSuccess($("#"+settings.id)));
								}
							},
							error: rupCombo._ajaxError
						});
						delete rupCombo;
					} else if (typeof settings.source === "function" || typeof settings.sourceGroup === "function"){
						jQuery(settings.source);
						this._makeCombo(settings);
					}
					
					//Asociar evento CHANGE para propagar cambios a los hijos
					$("#"+settings.id).bind("change", function(event, ui) {
						// En caso de modificarse el valor del select, se actualiza el valor del rup.combo (con esta accion se recargan tambien los hijos)
						$("#"+settings.id).rup_combo("select",$("#"+settings.id).val());
					});
					
					//Borrar referencia
					delete html;
				}
			}
		});
		
	//******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//******************************************************
	$.fn.rup_combo.defaults = {
		width: 200,
		blank: null,
		style: "dropdown",
		showValue: false,
		token: "|",
		multiValueToken : "##",
		ordered:true,
		orderedByValue:false,
		onLoadSuccess:null
	};	
	
	
})(jQuery);