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
	
	$.extend({
		// Llamada ajax utilizada por los componentes RUP
		rup_ajax: function(options){

			// Configuracion por defecto
			var defaults = {
					cache:false,	
					error:null
				},
				rup_ajax_settings = $.extend({}, defaults, options);
			
			// Callback de error especificado en la llamada a rup_ajax
			error_user=rup_ajax_settings.error;

			// Funcion error generica
			error_default = function(xhr, textStatus, errorThrown){
				
				// Evaluamos el error que se ha producido
				var errorText=null;

				if(xhr.status==0){
					errorText=$.rup.i18n.base.rup_ajax.httpStatus0;
				}else if(xhr.status==404){
					errorText=$.rup.i18n.base.rup_ajax.httpStatus404;
				}else if(xhr.status==500){
					errorText=$.rup.i18n.base.rup_ajax.httpStatus500;
				}else if(xhr.status==503){
					errorText=$.rup.i18n.base.rup_ajax.httpStatus503;
				}
				
				// Si se ha producido un error de los tratados lo mostramos 
				if(errorText){
					
					// Se comprueba si existe un dialog visible con una region de rup_feedbak
					var dialog_feedbacks = $(".ui-dialog:visible .rup-feedback"),
						feedbacks = dialog_feedbacks.length!==0 ? dialog_feedbacks :$(".rup-feedback");
					
					// Se comprueba si existe un rup_feedback en la pagina
					if (feedbacks.lenght!=0){
						
						var feedback_props = {
								delay:null
							},
							//Si existen rup_feedbacks cogemos el primero
							feedback_principal = $("#"+feedbacks[0].id);
						
						// Mostramos el error en el feedback
						feedback_principal.rup_feedback("option",feedback_props);
						feedback_principal.rup_feedback("set",errorText,"error");
						feedback_principal.rup_feedback("show");

					}else{
						// Si no hay feedback definido mostramos un mensaje
						$.rup_messages("msgError", {
							title: $.rup.i18n.base.rup_ajax.errorTitle,
							message: errorText
						});
					}
				}else{
					if (error_user!=null){
						$(error_user(xhr, textStatus, errorThrown));
					}
				}
			};
			
			// Asociamos las funciones a las propiedades que van a utilizarse en la peticion AJAX
			rup_ajax_settings.error=error_default;
			
			//Se valida la presencia de portal y, llegados al caso, se adecuan las llamadas ajax para trabajar con portales
			rup_ajax_settings.url=$.rup_utils.setNoPortalParam(rup_ajax_settings.url);
			
			// Se realiza la llamada ajax
			$.ajax(rup_ajax_settings);
		}
	});
	
	
 	//Se crea el objeto base, que alberga toda la metódica y gestión de los componentes RUP, dentro de la jerarquía de JQuery
	$.rup = $.rup || {};
	$.extend($.rup, {
		i18n : {},
		appResources : {}, //fichero de recursos de la aplicacion
		DEFAULTLANGUAGE : (navigator.language || navigator.userLanguage).split("-")[0].toLowerCase(),
		lang : (navigator.language || navigator.userLanguage).split("-")[0].toLowerCase(),
		//Funcion que rupera el idioma del navegador por defecto
		getBrowserLenguage : function () {
			return ((navigator.language || navigator.userLanguage).split("-")[0].toLowerCase()); 
		},
		browser : {
			version :  $.browser.version,
			isIE : $.browser.msie ? true:false,
			isSafari : $.browser.safari && $.browser.webkit ? true:false,
			isChrome : $.browser.safari && $.browser.webkit ? true:false,
			isFF : $.browser.mozilla ? true:false,
			isOpera : $.browser.opera ? true:false
		},
		
		
/**********/
/** i18n **/
/**********/
		//Funcion encargada de recargar, segun idioma definido en rup.lang, los literales a presentar en la pagina
		setLiterals : function (lang) {
			if (lang !== undefined && lang !== null && lang !== "") {
				$.rup.lang = lang;
			}
			//Peticion ajax destinada a cargar el fichero  JSon de literales
			$.rup_ajax({
				url: $.rup.RUP + "/resources/rup.i18n_" + $.rup.lang + ".json", 
				dataType:'json', 
				type:'GET',
				async: false, 
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				success: function(data){
						//Se cargan los literales generales de la aplicacion en RUP
						$.rup.i18n.base = data;
						//Se cargan los literales de la tabla por separado (consecuencia de la naturalza de JqGrid)
						$.jgrid = {};
						$.extend($.jgrid, data.rup_grid);
						$.jgrid.formatter.date.S = new Function("j",data.rup_grid.formatter.date.S);
			  		},
		  		error: function(XMLHttpRequest, textStatus, errorThrown){
		  			//tratamiento de error
					alert("Se ha producido un error en el parseo del fichero JSON de literales => "+textStatus+".\n\n"+"Error devuelto:\n"+textStatus+": "+XMLHttpRequest.status+" - "+XMLHttpRequest.statusText);
		  		} 
			});
		},
		//Funcion encargada de cargar el fichero i18n de la aplicación (síncrono)
		getFile_i18n : function () {
			//Peticion ajax destinada a devolver el fichero JSON indicado
			$.rup_ajax({
				url: $.rup.APP_STATICS + "/resources/" + $.rup.WAR_NAME  + ".i18n_" + $.rup.lang + ".json", 
				dataType:'json', 
				type:'GET', 
				async: false,
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				success: function(data){
						//se carga la respuesta del servidor en la estructura I18n de RUP
						$.rup.i18n.app = data;
			  		},
			  		error: function(XMLHttpRequest, textStatus, errorThrown){
			  			alert("Se ha producido un error en el parseo del fichero JSON de literales de la aplicación => "+textStatus+".\n\n"+"Error devuelto:\n"+textStatus+": "+XMLHttpRequest.status+" - "+XMLHttpRequest.statusText);
			  		} 
			});
		},
		//Funcion encargada de cargar el fichero de la aplicación especificado (síncrono)
		getFile : function (file) {
			if (file === undefined && file === null && file === "") {
				$.rup.errorGestor("No se ha definido el fichero a cargar");
			} else {
				if (!$.rup.i18n[file]){
					
					//Peticion ajax destinada a devolver el fichero JSON indicado
					$.rup_ajax({
						url: $.rup.APP_STATICS + "/resources/" + file + ".json", 
						dataType:'json', 
						type:'GET', 
						async: false, 
						contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
							success: function(data, textStatus, XMLHttpRequest){
								//se carga la respuesta del servidor en la estructura I18n de RUP
								$.rup.i18n[file] = data;
					  		},
					  		error: function(XMLHttpRequest, textStatus, errorThrown){
								$.rup.errorGestor("Se ha producido un error en el parseo del fichero JSON de la aplicación => "+textStatus+".<br>"+"Error devuelto:<br>"+errorThrown);
					  		} 
					});
				}
			}
		},
		
		//Funcion encargada de devolver el literal obtenido de estructura JSON (en caso de error devuelve el literal con formato especial)
		i18nParse : function (properties, i18nCaption){
			if (properties && properties[i18nCaption]){
				return properties[i18nCaption];
			} else{
				return i18nCaption+"_i18n";
			}
		},
/**********/
		
		//Funcion encargada de presentar los errores
		errorGestor : function (message) {			
			$.rup_messages("msgError", {
				title: $.rup.i18n.base.rup_global.developerError,
				message: "<p>"+message+"</p>"
			});

			throw (message);
			
		},
		//Funcion encargada de hacer las inicializaciones basicas de RUP
		iniRup : function () {
			//Se cargan las variables generales del servidor (convertir variables js a variables internas de rup)
			$.rup.APP_RESOURCES = APP_RESOURCES;
			$.rup.APP_STATICS = STATICS + "/" + APP_RESOURCES;
			$.rup.STATICS = STATICS;
			$.rup.CTX_PATH = CTX_PATH;
			$.rup.RUP = RUP;
			$.rup.DEFAULTLANGUAGE = DEFAULT_LANGUAGE;
			$.rup.WAR_NAME = WAR_NAME;
			$.rup.AVAILABLE_LANGS = AVAILABLE_LANGS;
			$.rup.LAYOUT = LAYOUT;
			
			//Borrar las variables javascript externas
			delete APP_RESOURCES;
			delete STATICS;
			delete CTX_PATH;
			delete RUP;
			delete DEFAULT_LANGUAGE;
			delete WAR_NAME;
			delete AVAILABLE_LANGS;
			delete LAYOUT;
			
			if ($.rup_utils.get("language") !== null && $.rup_utils.get("language") !== "") {//si tenemos cookie con el lenguaje es el es lang que hay que tener no es del navegador
				this.lang = $.rup_utils.get("language");
			} else {
				if (this.DEFAULTLANGUAGE != null && this.DEFAULTLANGUAGE != "") {//si tengo idioma por defecto
					this.lang = this.DEFAULTLANGUAGE;
				}
				$.rup_utils.set("language", this.lang, {path:'/'});
			}
			
			var availableLangsArray = $.map($.rup.AVAILABLE_LANGS.split(","),function(elem){
				return elem.replace(/^\s*|\s*$/g,"");
			});
			
			if ($.inArray(this.lang,availableLangsArray)===-1){
				this.lang=this.DEFAULTLANGUAGE;
			}
			
			
			//Se cargan los literales por defecto
			$.rup.setLiterals();			
			//Carga de ficheros de literales de la apliaccion
			$.rup.getFile_i18n();
		},
		//Función encargada de cargar el ThemeRoller en la página invocada
		themeRoller : function () {
			if (!/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
				alert('Sorry, due to security restrictions, this tool only works in Firefox');
				return false;
			}
			jquitr.addThemeRoller();
			/*
			if (window.jquitr) {
				jquitr.addThemeRoller();
			} else {
				jquitr = {};
				jquitr.s = document.createElement('script');
				jquitr.s.src = 'http://jqueryui.com/themeroller/developertool/developertool.js.php';
				//##jquitr.s.src='http://neonos.net/js/jqui.js';
				document.getElementsByTagName('head')[0].appendChild(jquitr.s);
			}
			*/
		},
		//Método gestor de invocación de un método expuesto por un componente o la creación del mismo (asociada a la metódica de invocación y gestión de los métodos públicos de un componente)
		getAccessor: function(obj, objName, expr){
			if (typeof expr === 'string') {
				fn = obj[expr];
				if (fn === undefined) { 
					$.rup.errorGestor(objName+" - No Existe el método \"" + expr + "\"  en el patrón.");
				}
				else {
					return fn;
				}
			}
			else {
				if (typeof expr === 'function') {
					$.rup.errorGestor(objName+" - No es posible pasar funciones al patrón.");
				}
			}
			return undefined;
		},
		//Función encargada de crear los patrones de RUP que se alberguen en el componente de JQuery directamente
		//La estructura creada, proporciona proteccion a los metodos publicos y privados
		rupObjectConstructor : function( name, object ) {
			
			//Se crea el nuevo gestor del Pótron
			if ($[name] === undefined) {
				$[name] = function( options ) {
					var options=options, isMethodCall = typeof options === "string", args = $.makeArray(arguments).slice(1), returnValue = this;
				
				 	// prevent calls to internal methods
					if ( isMethodCall && options.charAt( 0 ) === "_" ) {
						return returnValue;
					}
				
					if ( isMethodCall ) {
						if (options !== "extend") {
							var instance = $.data(object, object), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : "no-function";
					 		
							if ( methodValue === "no-function" ) {
					 			return false;
							} else {
								returnValue = methodValue;
							}
						} else {
							object = $.extend.apply( null, [ true, object].concat(args[0]));
						}
						
					} else {
						var instance = $.data(object, object);
				 		if ( instance && object["_init"] !== undefined && object["_init"] !== null) {
				 			instance._init($.makeArray(arguments));
				 		} 
					 }
					 	return returnValue;
					 };
			}
		},
		//Funcion encargada de crear los patrones de RUP que usen el selector de JQuery. 
		//La estructura creada, proporciona proteccion a los metodos publicos y privados
		rupSelectorObjectConstructor : function( name, object ) {
			
			//Se crea el nuevo gestor del Patrón
			if ($.fn[name] === undefined) {
			$.fn[name] = function( options ) {
				var options=options, isMethodCall = typeof options === "string", args = $.makeArray(arguments).slice(1), returnValue = this;
			
			 	// prevent calls to internal methods
				if ( isMethodCall && options.charAt( 0 ) === "_" ) {
					return returnValue;
				}
			
			if ( isMethodCall ) {
				if (options !== "extend") {
					var instance = $.extend(this, object), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : "no-function";
							
			 		if ( methodValue === "no-function" ) {
			 			return false;
					} else {
						returnValue = methodValue;
					}
				
				} else {
					object = $.fn.extend.apply( null, [ true, object].concat(args[0]));
				}
				
			} else {
				var instance = $.extend(this, object);
				if ( instance && object["_init"] !== undefined && object["_init"] !== null) {
		 			instance._init($.makeArray(arguments));
		 		} 
			}
			 	return returnValue;
			 };
		}
		}
	});
	
	//Almacenar y restaurar eventos
	$.fn.extend({
		storeEvents:function(){
			this.each(function(){
				$(this).data('storedEvents', $.extend(true, {}, $(this).data('events')));
			});
			$(this).unbind();
			return this;
		},
		restoreEvents:function(){
			this.each(function(){
				var events = $.data(this,'storedEvents');
				if (events){
					$(this).unbind();
					for (var type in events){
						for (var handler in events[type]){
							$.event.add(this, type, events[type][handler], events[type][handler].data);
						}
					}
				}
			});
			return this;
		}
	});

	//Ejemplo de extension de la funcion de inicio 
	//$.extend($.rup.iniRup, console.log("mundo")) ;

	//Inicializacion de las funciones de gestion de RUP en general 
	$.rup.iniRup();
	
	
	/////////////////
	// ThemeRoller //
	/////////////////
		jquitr = {};
		//add dev tool to page
		jquitr.addThemeRoller = function(){
			if($('#inline_themeroller').size() > 0){
				$('#inline_themeroller').fadeIn();
			}
			else {
				$('<div id="inline_themeroller" style="display: none; position: fixed; background: #111; top: 25px; right: 25px; padding: 22px 0 15px 4px;width: 245px;height:400px; -webkit-border-radius: 6px; -moz-border-radius: 6px; z-index: 9999999;">'+
					'<a href="#" class="closeTR" style="font-family: Verdana, sans-serif; font-size: 10px; display: block; position: absolute; right: 0; top: 2px; text-align: right; background: url(http://jqueryui.com/themeroller/developertool/icon_bookmarklet_close.gif) 0 2px no-repeat; width: 16px;height: 16px; color: #fff; text-decoration: none;" title="Close ThemeRoller"></a>'+
					'<iframe name="trApp" src="http://jqueryui.com/themeroller/developertool/appinterface.php" style="background: transparent; overflow: auto; width: 240px;height:100%;border: 0;" frameborder="0" ></iframe>'+
					'</div>')
					.appendTo('body')
					.draggable({
						start: function(){
							$('<div id="div_cover" />').appendTo('#inline_themeroller').css({width: $(this).width(), height: $(this).height(), position: 'absolute', top: 0, left:0});
						},
						stop: function(){
							$('#div_cover').remove();
						},
						opacity: 0.6,
						cursor: 'move'
					})
					.resizable({
						start: function(){
							$(this).find('iframe').hide();
						},
						stop: function(){
							$(this).find('iframe').show();
						},
						handles: 's'
					})
					.find('a.closeTR').click(function(){
						jquitr.closeThemeRoller();
					})
					.end()
					.find('.ui-resizable-s').css({
						background: 'url(http://jqueryui.com/themeroller/developertool/icon_bookmarklet_dragger.gif) 50% 50% no-repeat',
						border: 'none',
						height: '14px',
						dipslay: 'block',
						cursor: 'resize-s',
						bottom: '-3px'
					})
					.end()
					.css('cursor', 'move')
					.fadeIn();
				}
				jquitr.reloadCSS();		
		};
		//close dev tool
		jquitr.closeThemeRoller = function () {
			$('#inline_themeroller').fadeOut();
		};
		//get current url hash
		jquitr.getHash = function () {
			var currSrc = window.location.hash;
			if (currSrc.indexOf('#') > -1) {
				currSrc = currSrc.split('#')[1];
			}
			return currSrc;
		};
		//recursive reload call
		jquitr.reloadCSS = function(){
			var currSrc = jquitr.getHash(), cssLink;
			if(jquitr.trString !== currSrc && currSrc !== ''){
				jquitr.trString = currSrc;
				cssLink = '<link href="http://jqueryui.com/themeroller/css/parseTheme.css.php?'+ currSrc +'" type="text/css" rel="Stylesheet" />';
				//works for both 1.6 final and early rc's
				if( $("link[href*='parseTheme.css.php'], link[href='ui.theme.css']").size() > 0){
					$("link[href*='parseTheme.css.php']:last, link[href='ui.theme.css']:last").eq(0).after(cssLink);
				} else {
					$("head").append(cssLink);
				}
				if( $("link[href*='parseTheme.css.php']").size() > 3){
					$("link[href*='parseTheme.css.php']:first").remove();
				}
			}
			window.setTimeout(jquitr.reloadCSS, 1000);
		};
})(jQuery);