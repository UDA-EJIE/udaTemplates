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
	
	
	//*****************************************************************************************************************
	// DEFINICIÓN BASE DEL PATRÓN (definición de la variable privada que contendrá los métodos y la función de jQuery)
	//*****************************************************************************************************************
	
	var rup_tabs = {};
	
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupSelectorObjectConstructor("rup_tabs", rup_tabs));
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//********************************
	
	$.fn.rup_tabs("extend",{
		//Funcion encargada de deshabilitar una o un conjunto de pestanyas
		disableTabs : function(args){
			if (typeof args.position === "number") {
				$('#' + args.idTab).tabs('disable', args.position);
			} else if(typeof args.position === "object"){
				for (var i in args.position){
					$('#' + args.idTab).tabs('disable',args.position[i]);
				};
			} else if(typeof args.position === "undefined"){
				//deshabilitacion de toda la pestanya del nivel (de momento no se aplica por errores en el plug-in subyacente).
				$('#' + args.idTab).tabs('disable');
			}
		},
		//Funcion encargada de habilitar una o un conjunto de pestanyas
		enableTabs : function(args){
			if (typeof args.position === "number") {
				$('#' + args.idTab).tabs('enable', args.position);
			} else if(typeof args.position === "object"){
				for (var i in args.position){
					$('#' + args.idTab).tabs('enable',args.position[i]);
				};
			} else if(typeof args.position === "undefined"){
				//deshabilitacion de toda la pestanya del nivel (de momento no se aplica por errores en el plug-in subyacente).
				$('#' + args.idTab).tabs('enable');
			}
		},
		//Funcion que fuerza la recarga de una pestanya
		//Si se le especifica una nueva url, ademas de recargar la pagina con la nueva url, se inserta esta como nueva url de la pestanya  
		loadTab : function(args){
			$("#"+args.idTab).tabs("load",args.position);	
		},
		//Funcion encargada de actualizar la url de invocacion de una pestanya determinada
		changeUrlTab : function(args){
			$("#"+args.idTab).tabs("url",args.position,$.rup_utils.setNoPortalParam(args.url));
		},
		//Funcion encargada de actualizar el layer de una pestanya determinada
		changeLayerTab : function(args){
			this._includeLayer($("#"+args.idTab+" ul:first-child"), args.layer, $($("#"+args.idTab+" ul li a").get(args.position)));
		},
		//Funcion encargada de seleccionar una pestanya determinada. El comportamiento es identico al click con el raton del mismo
		selectTab : function(args){
			$("#"+args.idTab).tabs("select",args.position);
		},
		//Funcion encargada de añadir una nueva pestanya cuando el componente ya esta creado 
		addTab : function(args){
			var newTab, auxTabName, nameLiteral= "rup-tabs-", insertIndex = 0;
			if (args.tabs !== undefined){
				if ((args.idNewTab !== undefined) && ($("#"+args.idNewTab).length === 0)){
					newTab = $('<div>').attr('id', args.idNewTab);
					newTab.appendTo('body');
					auxTabName = this._includeLayer($("#"+args.idTab+" > ul:first-child"), "#"+args.idNewTab, null);
					newTab.rup_tabs(args);			
					$("#"+args.idTab).tabs("add","#"+args.idNewTab,args.label,args.position);
					$(auxTabName).remove();
				} else {
					$.rup.errorGestor($.rup.i18nParse($.rup.i18n.base,"rup_global.parameterError"));
					return false;
				}
				
			} else {
				$("#"+args.idTab).tabs("add",$.rup_utils.setNoPortalParam(args.url),args.label,args.position);
				
				$.each($("#"+args.idTab+" div[id*='"+nameLiteral+"']"), function(index, object) {
					if(insertIndex < parseFloat(object.id.split(nameLiteral)[1])){
						insertIndex = object.id.split(nameLiteral)[1];
					}
				});
				
				$("#"+args.idTab+" div[id='rup-tabs-"+insertIndex+"']").addClass("ui-tabs-hide");
			}
			
			loadSpan = $("#"+args.idTab+" ul li a span").not(".rup-tabs_loading");
			loadSpan.parent().append ($('<div>').addClass('rup-tabs_title').text($.rup.i18nParse($.rup.i18n.app[$(this).attr("id")],args.label)))
					.append ($('<span>').addClass('rup-tabs_loading'));
			loadSpan.remove();
		},
		//Funcion encargada de añadir una nueva pestanya cuando el componnete ya esta creado 
		removeTab : function(args){
			$("#"+args.idTab).tabs("remove",args.position);
		}
	});
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PRIVADOS
	//********************************
	
	$.fn.rup_tabs("extend",{
			_init : function(args){
				
				if (args.length > 1) {
					$.rup.errorGestor($.rup.i18nParse($.rup.i18n.base,"rup_global.initError") + $(this).attr("id"));
				}
				else {
					//Se recogen y cruzan las paremetrizaciones del objeto
					var settings = $.extend({}, $.fn.rup_tabs.defaults, args[0]), json_i18n;
					
					settings.id = $(this).attr("id");
					settings.iniLoad = false;
					
					//Establecemos el ancho general de las pestañas en caso de venir informado
					if(undefined !== settings.width){
						$('#' + settings.id).css("width", settings.width).addClass("rup-tabs_overflow");	
					}
					//Establecemos la altura general de las pestañas en caso de venir informada
					if(undefined !== settings.height){
						$('#' + settings.id).css("height", settings.height).addClass("rup-tabs_overflow");	
					}
					
					var structure = settings.tabs, profun = 0;
					
					while (structure !== undefined) {
						profun = profun + 1;
						structure = structure[0].tabs;
					}
					
					settings.profun = profun;
					//Generar estructura
					this._parseJSON(settings.tabs, $.rup.i18n.app[settings.id], $('#' + settings.id), "", 1, settings);
					
					//Una vez creadas todas las pestanyas, se permite la carga normal de las mismas
					settings.iniLoad = true;
					
					//Convertir en pestanyas
					this._tabify($('#' + settings.id), settings);
					
					//Añadir evento de conversión a pestanyas en los enlaces
					//$('#'+settings.id).find("a[rupLevel]").click ({disabled: settings.disabled}, tabClick);
					
					//Deshabilitar las pestanyas indicadas
					if (settings.disabled !== undefined) {
						for (var i in settings.disabled) {
							$("#" + settings.id).rup_tabs("disableTabs", {
								idTab: i,
								position: settings.disabled[i]
							});
						};
					}
				}
			},
			//Funcion encargada de crear los distintos tab's
			_tabify : function (div, settings) {

				//Se especifica el estilo asociado a la pestanya contenedora de pestanyas
				div.addClass("rup-tabs_container");
				
				//Se cargan los Setting de cada objeto en su campo "data" correspondiente
				div.data("settings",settings);

				//Se especifica el control del evento "select" por parte del patron 					
				var select = function(event, ui){
					
					//Se gestiona la primera carga de la primera pestanya de cada tab
					if ($(ui.panel).data("cargado") !== undefined && $(ui.panel).data("cargado") === false && $(ui.panel).length > 0){
							$(ui.panel).tabs("load", 0);
							$(ui.panel).data("cargado", true);
					}
					if(settings.select !== undefined && settings.select !== null && typeof settings.select === "function"){
						settings.select(event, ui);
					}
				};
				
				//se cargan las extensiones de los usuarios en los eventos de las peticiones Ajax
				var ajaxOptions =  $.extend({},settings.ajaxOptions);
				
				ajaxOptions.beforeSend = function(XMLHttpRequest, sets){
					if(settings.ajaxOptions.beforeSend !== undefined && settings.ajaxOptions.beforeSend !== null && typeof settings.ajaxOptions.beforeSend === "function"){
						settings.ajaxOptions.beforeSend.call();
					}
					
					if (!settings.iniLoad) {
						div.data("cargado",false);
						return (false);
					}
				};
				ajaxOptions.complete = function(XMLHttpRequest, textStatus){
					//se elimina el objeto de visualizacion de carga
					div.find("span.rup-tabs_loading_img").remove();			
					
					if(settings.ajaxOptions.complete !== undefined && settings.ajaxOptions.complete !== null && typeof settings.ajaxOptions.complete === "function"){
						settings.ajaxOptions.complete(XMLHttpRequest, textStatus);
					}
				};
				ajaxOptions.success = function (data, textStatus, XMLHttpRequest){
					if(settings.ajaxOptions.success !== undefined && settings.ajaxOptions.success !== null && typeof settings.ajaxOptions.success === "function"){
						settings.ajaxOptions.success(data, textStatus, XMLHttpRequest);
					}
				};
				ajaxOptions.error = function (xhr, s, t){
					var userFunction;
					
					if(settings.ajaxOptions.error !== undefined && settings.ajaxOptions.error !== null && typeof settings.ajaxOptions.error === "function"){
						userFunction = function(){
							settings.ajaxOptions.error(xhr, s, t);
						};
					}
					$.rup_messages("msgError", {
						title: $.rup.i18nParse($.rup.i18n.base,"rup_global.developerError"),
						message: "<p>"+$.rup.i18nParse($.rup.i18n.base,"rup_tabs.serverError")+"<b> "+s+":  "+xhr.status+" - "+xhr.statusText+".</b>"+"</p>",
						width: "40%",
						beforeClose: userFunction
					});
				};
				
				$(div).tabs({
					ajaxOptions: ajaxOptions,
					cache: settings.cache,
					cookie: null,
					//cookie: settings.cookie, //Se deja para una mejora
					//disabled: true, //Bajo funcionalidades
					fx: settings.fx, //son los efectos que se aplican al presentar u ocultar una pestanya
					idPrefix: 'rup-tabs-',
					panelTemplate: settings.panelTemplate,
					selected : 0, //se presenta, siempre, la primera pestanya
					spinner : "<span class='rup-tabs_loading_img' />",
					//eventos
					create : settings.create,
					select : select,
					load : settings.load,
					show : settings.show,
					add : settings.add,
					remove : settings.remove,
					enable : settings.enable,
					disable : settings.disable						      
				}); 
				
				// Tabs at bottoms
				if (settings.tabsAtBottom===true){
					$(div).addClass("tabs-bottom");
					$(div).find(".tabs-spacer").css("float", "left").css("height", "200px");
					$(".ui-tabs-nav, .ui-tabs-nav > *",$(div))
					.removeClass( "ui-corner-all ui-corner-top" )
					.addClass( "ui-corner-bottom" );
					
					$(".ui-tabs-panel.ui-widget-content.ui-corner-bottom",$(div)).removeClass("ui-corner-bottom").addClass("ui-corner-top");
					
					// move the nav to the bottom
					$(".ui-tabs-nav",$(div)).appendTo( ".tabs-bottom" );
					
				}
			},
			
			//Funcion encargada de gestionar el objeto definido por el usuario (se parsea el JSon y se actua en consecuencia)
			_parseJSON : function (json, json_i18n, tabs, pos, profundidad, settings) { 
				var element, rupLevel;
			
				tabs.append($('<ul>'));  //Añadir contenedor de pestanyas
				tabs = $(tabs).children('ul'); //Seleccionar pestanya
				
				//pestanyas
				for (var i = json.length; i--; ) {
					rupLevel = pos+i; //Indicador de nivel de la pestanya
					element = json[i];
					if (i === 0 && profundidad === settings.profun){
						settings.iniLoad = true;
					} else {
						settings.iniLoad = false;
					}
					
					if (element.layer !== undefined){
						//LAYER => Recoge una capa ya cargada de la Jsp
						element.layer = this._includeLayer(tabs, element.layer, null);
						
						tabs.prepend($('<li>').append(
								$('<a>').attr('href',element.layer)
								.attr('rupLevel',rupLevel)
								.css('padding-left', '1.4em')
								.css('padding-right', '0.3em')
								.append ($('<div>').addClass('rup-tabs_title').text($.rup.i18nParse(json_i18n,element.i18nCaption)))
								.append ($('<span>').addClass('rup-tabs_loading'))
						));
						
					} else if (element.url !== undefined){
						//URL => Cargar contenido al pulsar
						tabs.prepend($('<li>').append(
							$('<a>').attr('href',$.rup_utils.setNoPortalParam(element.url))
								.attr('rupLevel',rupLevel)
								.css('padding-left', '1.4em')
								.css('padding-right', '0.3em')
								.append ($('<div>').addClass('rup-tabs_title').text($.rup.i18nParse(json_i18n,element.i18nCaption)))
								.append ($('<span>').addClass('rup-tabs_loading'))
						));
					} else if (element.tabs !== undefined){
						//TABS => Subpestanyas
						tabs.prepend($('<li>').append(
							$('<a>').attr('id','#'+element.i18nCaption)
								.attr('href','#'+element.i18nCaption)
								.attr('rupLevel',rupLevel)
								.css('padding-left', '1.4em')
								.css('padding-right', '0.3em')
								.append ($('<div>').addClass('rup-tabs_title').text($.rup.i18nParse(json_i18n,element.i18nCaption)))
								.append ($('<span>').addClass('rup-tabs_loading'))
						));
						
						//Gestionar capa contenedora subpestanyas
						tabs = $(tabs).parent();

						var capa = $('<div>'),
							capaId = $.rup_utils.randomIdGenerator(capa);
						tabs.append(capa); 						//Añadir contenedor de capa asociada a pestanya
						tabs = $(tabs).children("#"+capaId); 	//Seleccionar capa contenedora
					
						//Gestionar capa de la subpestanya
						tabs.prepend($('<div>').attr('id', element.i18nCaption).attr('actualTab',true)); //Añadir capa asociada a la pestanya
						tabs = $(tabs).children('div:first-child'); //Seleccionar capa
	
						//Subpestanyas
						tabs.append(this._parseJSON(element.tabs, json_i18n, tabs, rupLevel, profundidad+1, settings));
						this._tabify(tabs,settings); //Si no tiene 1 es que es el primer elemento y lo convertimos a pestanyas
					
						//Reposicionar 'puntero' para siguiente pasada del bucle
						tabs = $(tabs).parents("div[actualTab=true]").find("ul").first();
						if (tabs.length===0){
							tabs = $("#"+settings.id).find("ul").first();
						}
						
					}
				}
				$(tabs).parents("div[actualTab=true]").first().removeAttr("actualTab");
				delete tabs;
			},
			
			//Función encargada de validar e incluir la capa que contendrá la pestanya. De no tener identificador se le asocia uno.
			_includeLayer : function(tabs, layerSelector, pestanya){
				var content, selectObject;
				if($(layerSelector).length > 0){
					if ($(layerSelector).length === 1){
						selectObject = $(layerSelector).css("display","");
					} else {
						selectObject = $('<div>').append($(layerSelector).css("display",""));
					}
					
					if(pestanya === null){
						content = $('<div>').append(selectObject);
						tabs.parent().append(content);
						layerSelector = "#"+$.rup_utils.randomIdGenerator(content);
					} else {
						layerSelector = pestanya.attr("href");
						content = $(pestanya.attr("href"));
						content.children().remove();
						content.append(selectObject);
					}
				} else {
					
					layerSelector = "#load-tab-error";
					
					if(pestanya === null){
						tabs.parent().append($('<div>').attr('id',"load-tab-error")
							.append($('<div>').addClass("rup-loading_tab_error")
							.append($.rup.i18nParse($.rup.i18n.base,"rup_global.selectorError"))
						));
					} else {
						layerSelector = pestanya.attr("href");
						content = $(pestanya.attr("href"));
						content.children().remove();
						content.append($('<div>').attr('id',"load-tab-error")
							.append($('<div>').addClass("rup-loading_tab_error")
							.append($.rup.i18nParse($.rup.i18n.base,"rup_global.selectorError"))
						));
					}
				}
				return layerSelector;
			}
		});
		
	//*******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//*******************************************************
	
	$.fn.rup_tabs.defaults = {
		ajaxOptions: {},
		cache: true,
		cookie: null,
		fx: null,
		panelTemplate: '<div></div>',
		profun: 0,
		//eventos
		create : null,
		select : null,
		load : null,
		show : null,
		add : null,
		remove : null,
		enable : null,
		disable : null,
		tabsAtBottom:false
	};
	

})(jQuery);