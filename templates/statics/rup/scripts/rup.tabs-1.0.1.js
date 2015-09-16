// NO EDITAR

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
		//Funcion encargada de deshabilitar una o un conjunto de pestañas
		disableTabs : function(args){
			if (typeof args.position === "number") {
				$('#' + args.idTab).tabs('disable', args.position);
			} else if(typeof args.position === "object"){
				for (var i in args.position){
					$('#' + args.idTab).tabs('disable',args.position[i]);
				};
			} else if(typeof args.position === "undefined"){
				//deshabilitacion de toda la pestaña del nivel (de momento no se aplica por errores en el plug-in subyacente).
				$('#' + args.idTab).tabs('disable');
			}
		},
		//Funcion encargada de habilitar una o un conjunto de pestañas
		enableTabs : function(args){
			if (typeof args.position === "number") {
				$('#' + args.idTab).tabs('enable', args.position);
			} else if(typeof args.position === "object"){
				for (var i in args.position){
					$('#' + args.idTab).tabs('enable',args.position[i]);
				};
			} else if(typeof args.position === "undefined"){
				//deshabilitacion de toda la pestaña del nivel (de momento no se aplica por errores en el plug-in subyacente).
				$('#' + args.idTab).tabs('enable');
			}
		},
		//Funcion que fuerza la recarga de una pestaña
		//Si se le especifica una nueva url, ademas de recargar la pagina con la nueva url, se inserta esta como nueva url de la pestaña  
		loadTab : function(args){
			$("#"+args.idTab).tabs("load",args.position);	
		},
		//Funcion encargada de actualizar la url de invocacion de una pestaña determinada
		changeUrlTab : function(args){
			$("#"+args.idTab).tabs("url",args.position,args.url);
		},
		//Funcion encargada de seleccionar una pestaña determinada. El comportamiento es identico al click con el raton del mismo
		selectTab : function(args){
			$("#"+args.idTab).tabs("select",args.position);
		},
		//Funcion encargada de añadir una nueva pestaña cuando el componnete ya esta creado 
		addTab : function(args){
			var nameLiteral= "rup-tabs-";
			var insertIndex = 0;
			
			//Se añade la nieva pestaña
			$("#"+args.idTab).tabs("add",args.url,args.label,args.position);
			
			$.each($("#"+args.idTab+" div[id*='"+nameLiteral+"']"), function(index, object) {
				if(insertIndex < parseFloat(object.id.split(nameLiteral)[1])){
					insertIndex = object.id.split(nameLiteral)[1];
				}
			});
			
			$("#"+args.idTab+" div[id='rup-tabs-"+insertIndex+"']").addClass("ui-tabs-hide");
		},
		//Funcion encargada de añadir una nueva pestaña cuando el componnete ya esta creado 
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
					$.rup.errorGestor($.rup.i18n.base.rup_global.initError + $(this).attr("id"));
				}
				else {
					//Se recogen y cruzan las paremetrizaciones del objeto
					var settings = $.extend({}, $.fn.rup_tabs.defaults, args[0]), json_i18n;
					
					settings.id = $(this).attr("id");
					settings.iniLoad = false;
					
					var structure = settings.tabs, profun = 0;
					
					while (structure !== undefined) {
						profun = profun + 1;
						structure = structure[0].tabs;
					}
					
					settings.profun = profun;
					
					//Generar estructura
					this._parseJSON(settings.tabs, $.rup.i18n.app[settings.id], $('#' + settings.id), "", 1, settings);
					
					//Una vez creadas todas las pestañas, se permite la carga normal de las mismas
					settings.iniLoad = true;
					
					//Convertir en pestañas
					this._tabify($('#' + settings.id), settings);
					
					//Añadir evento de conversión a pestañas en los enlaces
					//$('#'+settings.id).find("a[rupLevel]").click ({disabled: settings.disabled}, tabClick);
					
					//Deshabilitar las pestañas indicadas
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
				//Se cargan los Setting de cada objeto en su campo "data" correspondiente
					div.data("settings",settings);

				//Se especifica el control del evento "select" por parte del patron 					
				var select = function(event, ui){
					
					//Se gestiona la primera carga de la primera pestaña de cada tab
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
					div.find("ul li span img").remove();			
					
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
						title: $.rup.i18n.base.rup_global.developerError,
						message: "<p>"+"Se ha producido un error en la llamada de la pestaña.<br>El error devuelto por el servidor es:<b> "+s+":  "+xhr.status+" - "+xhr.statusText+".</b>"+"</p>",
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
					fx: settings.fx, //son los efectos que se aplican al presentar u ocultar una pestaña
					idPrefix: 'rup-tabs-',
					panelTemplate: settings.panelTemplate,
					selected : 0, //se presenta, simepre, la primera pestaña
					spinner : "<img class='rup-tabs_loading_img'><img>",
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
			},
			
			//Funcion encargada de gestionar el objeto definido por el usuario (se parsea el JSon y se actua en consecuencia)
			_parseJSON : function (json, json_i18n, tabs, pos, profundidad, settings) { 
				var element, rupLevel;
			
				tabs.append($('<ul>'));  //Añadir contenedor de pestañas
				tabs = $(tabs).children('ul'); //Seleccionar pestaña
				
				//Pestañas
				for (var i = json.length; i--; ) {
					rupLevel = pos+i; //Indicador de nivel de la pestaña
					element = json[i];
					if (i === 0 && profundidad === settings.profun){
						settings.iniLoad = true;
					} else {
						settings.iniLoad = false;
					}
					
					if (element.url !== undefined){
						//URL => Cargar contenido al pulsar
						tabs.prepend($('<li>').append(
							$('<a>').attr('href',element.url)
								.attr('rupLevel',rupLevel)
								.css('padding-left', '1.4em')
								.css('padding-right', '0.3em')
								.append ($('<div>').addClass('rup-tabs_title').text($.rup.i18nParse(json_i18n,element.i18nCaption)))
								.append ($('<span>').addClass('rup-tabs_loading'))
						));
					} else if (element.tabs !== undefined){
						//TABS => Subpestañas
						tabs.prepend($('<li>').append(
							$('<a>').attr('id','#'+element.i18nCaption)
								.attr('href','#'+element.i18nCaption)
								.attr('rupLevel',rupLevel)
								.css('padding-left', '1.4em')
								.css('padding-right', '0.3em')
								.append ($('<div>').addClass('rup-tabs_title').text($.rup.i18nParse(json_i18n,element.i18nCaption)))
								.append ($('<span>').addClass('rup-tabs_loading'))
						));
						
						//Gestionar capa contenedora subpestañas
						tabs = $(tabs).parent();
						if ($(tabs).children('div').length===0){
							tabs.append($('<div>')); //Añadir contenedor de capa asociada a pestaña
						}
						tabs = $(tabs).children('div'); //Seleccionar capa contenedora
					
					
						//Gestionar capa de la subpestaña
						tabs.prepend($('<div>').attr('id', element.i18nCaption)); //Añadir capa asociada a la pestaña
						tabs = $(tabs).children('div:first-child'); //Seleccionar capa
	
						//Subpestañas
						tabs.append(this._parseJSON(element.tabs, json_i18n, tabs, rupLevel, profundidad+1, settings));
						this._tabify(tabs,settings); //Si no tiene 1 es que es el primer elemento y lo convertimos a pestañas
					
						//Reposicionar 'puntero' para siguiente pasada del bucle
						tabs = $(tabs).parent().prev('ul');
					}
				}
				
				delete tabs;
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
		disable : null
	};
	

})(jQuery);