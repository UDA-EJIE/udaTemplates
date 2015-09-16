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
	
	String.prototype.capitalize = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	};
	
	$.extend({
		set_uda_ajax_mode_on: function(){
			
			// En caso de que la función $.ajax no haya sido sustituida aún.
			if ($.ajax!==$.rup_ajax){
				// Almacenamos la función original $.ajax en $.ajaxUDA para poder restablecerla posteriormente.
				$.ajaxUDA=$.ajax;
				// Sustituimos la función $.ajax por la función $.rup_ajax.
				$.ajax=$.rup_ajax;
			}
		},
		// Llamada ajax utilizada por los componentes RUP
		rup_ajax: function(options){

			// Configuracion por defecto
			var defaults = {
					cache:false,	
					error:null
				},
				rup_ajax_settings = $.extend({}, defaults, options), error_default, error_user, complete_user, complete_default;
			
			// Callback de error especificado en la llamada a rup_ajax
			error_user=rup_ajax_settings.error;

			// Funcion error generica
			error_default = function(xhr, textStatus, errorThrown){
				
				var errorText = $.rup.rupAjaxDefaultError(xhr, textStatus, errorThrown);

				// Si se ha producido un error de los tratados lo mostramos 
				if (error_user!=null){
					$(error_user(xhr, textStatus, errorThrown));
				}else{
					if(errorText){
						$.rup.showErrorToUser(errorText);
					}
				}
			};
			
			// Callback de error especificado en la llamada a rup_ajax
			complete_user=rup_ajax_settings.complete;
			
			// Function complete generica
			complete_default = function(xhr, textStatus){
				
				// Restablecemos la función $.ajax original.
				if ($.ajax===$.rup_ajax && $.ajaxUDA!==$.rup_ajax){
					$.ajax=$.ajaxUDA;
				}
				// Se ejecuta el callback complete especificado por el usuario.
				if (complete_user!=null){
					complete_user(xhr, textStatus);
				}
			};
			
			// Asociamos las funciones a las propiedades que van a utilizarse en la peticion AJAX
			rup_ajax_settings.complete=complete_default;
			rup_ajax_settings.error=error_default;
			
			//Se valida la presencia de portal y, llegados al caso, se adecuan las llamadas ajax para trabajar con portales
			rup_ajax_settings.url=$.rup_utils.setNoPortalParam(rup_ajax_settings.url);
			
			// Se realiza la llamada ajax
			if (typeof $.ajaxUDA==="function"){
				$.ajaxUDA(rup_ajax_settings);
			}else{
				$.ajax(rup_ajax_settings);
			}
		}
	});
	
 	//Se crea el objeto base, que alberga toda la metódica y gestión de los componentes RUP, dentro de la jerarquía de JQuery
	$.rup = $.rup || {};
	$.extend($.rup, {
		i18n : {},
		appResources : {}, //fichero de recursos de la aplicacion
		lang : null,
		//Funcion que rupera el idioma del navegador por defecto
		getBrowserLenguage : function () {
			return ((navigator.language || navigator.userLanguage).split("-")[0].toLowerCase()); 
		},
		browser : {
			version :  $.browser.version,
			versionNumber : $.isNumeric($.browser.version)?parseInt($.browser.version):undefined,
			isIE : $.browser.msie ? true:false,
			isSafari : $.browser.safari && $.browser.webkit ? true:false,
			isChrome : $.browser.safari && $.browser.webkit ? true:false,
			isFF : $.browser.mozilla ? true:false,
			isOpera : $.browser.opera ? true:false,
			xhrFileUploadSupport : new XMLHttpRequest().upload!==undefined?true:false
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
		i18nParse : function (properties, i18nCaption, defaultValue){
			if (i18nCaption !== undefined && i18nCaption !== null && i18nCaption !== ""){
				var i18nCaptionArr = i18nCaption.split("."),
					i18nValue = properties;
				for (var i = 0; i < i18nCaptionArr.length; i++) { //Navegar por las ramas JSON
					if (!$.isEmptyObject(i18nValue)){
						i18nValue = i18nValue[i18nCaptionArr[i]]; //Existe objeto -> navegar
					} else {
						if (defaultValue === undefined || defaultValue === null || defaultValue === ""){
							i18nValue = i18nCaption; //No existe objeto -> devolver clave
						} else {
							i18nValue = defaultValue; //No existe objeto -> devolver valor recibido por parametro
						}
						break;
					}
				}
				return (i18nValue==undefined)?i18nCaption:i18nValue;
			} else{
				return "null_i18nCaption"; //retorno si no se recibe clave a buscar
			}
		},
		//Funcion encargada de devolver el literal obtenido de estructura JSON (en caso de error devuelve el literal con formato especial)
		i18nTemplate : function (properties, i18nCaption){
			var template  = jQuery.rup.i18nParse(properties,i18nCaption), 
				args = $.makeArray(arguments).slice(2);
			
			if(template===undefined) { template = ""; }
			return template.replace(/\{(\d+)\}/g, function(m, i){
				return args[i];
			});
		},
/**********/
		
		//Funcion encargada de presentar los errores
		errorGestor : function (message) {			
			$.rup_messages("msgError", {
				title: $.rup.i18nParse($.rup.i18n.base,"rup_global.developerError"),
				message: "<p>"+message+"</p>"
			});

			throw (message);
			
		},
		//Funcion encargada de hacer las inicializaciones basicas de RUP
		iniRup : function () {
			//Inicializar variables de ficheros de recuros (rup y app)
			$.rup.i18n.app = {};
			$.rup.i18n.base = {};
			
			//retrocompatibilidad
			if (!window.LOCALE_COOKIE_NAME){
				LOCALE_COOKIE_NAME = "language";
			} 
			if (!window.LOCALE_PARAM_NAME){
				LOCALE_PARAM_NAME = "locale";
			}
			
			//Se cargan las variables generales del servidor (convertir variables js a variables internas de rup)
			$.rup.APP_RESOURCES = APP_RESOURCES;
			$.rup.APP_STATICS = STATICS + "/" + APP_RESOURCES;
			$.rup.CTX_PATH = CTX_PATH;
			$.rup.RUP = RUP;
			$.rup.STATICS = STATICS;
			$.rup.WAR_NAME = WAR_NAME;
			//model
			$.rup.AVAILABLE_LANGS = AVAILABLE_LANGS;
				$.rup.AVAILABLE_LANGS_ARRAY = $.map($.rup.AVAILABLE_LANGS.split(","),function(elem){
					return elem.replace(/^\s*|\s*$/g,"");
				});
			$.rup.LAYOUT = LAYOUT;
			//mvc-config.xml
			$.rup.LOCALE_COOKIE_NAME = LOCALE_COOKIE_NAME;
			$.rup.LOCALE_PARAM_NAME = LOCALE_PARAM_NAME;
			//metodos http permitidos en la emulacion xhr para el uso con iframes 
			$.rup.IFRAME_ONLY_SUPPORTED_METHODS = ["GET","POST"];
			
			//Borrar las variables javascript externas
			delete APP_RESOURCES;
			delete CTX_PATH;
			delete RUP;
			delete STATICS;
			delete WAR_NAME;
			//model
			delete AVAILABLE_LANGS;
			delete LAYOUT;
			//mvc-config.xml
			delete LOCALE_COOKIE_NAME;
			delete LOCALE_PARAM_NAME;
			
			var cookie = $.rup_utils.get($.rup.LOCALE_COOKIE_NAME);
			if (cookie !== null && cookie !== "") {//si tenemos cookie con el lenguaje
				if ($.inArray(cookie,$.rup.AVAILABLE_LANGS_ARRAY)!==-1){
					this.lang = cookie;
				} else {
					//retrocompatibilidad (MvcInterceptor genera correctamente la cookie, pero en versiones anteriores no)
					alert("La 'cookie' de idioma ("+$.rup.LOCALE_COOKIE_NAME+") no se corresponde con los idiomas soportados.\n\nLa página no se mostrará correctamente.");
					$.rup._avoidRUPFails();
					return false;
				}
			} else {
				alert("No se ha encontrado la 'cookie' de idioma ("+$.rup.LOCALE_COOKIE_NAME+") requerida por UDA.\nRevise la configuración del navegador.\n\nLa página no se mostrará correctamente.");
				$.rup._avoidRUPFails();
				return false;
			}
			
			//Se cargan los literales por defecto
			$.rup.setLiterals();			
			//Carga de ficheros de literales de la apliaccion
			$.rup.getFile_i18n();
		},
		//Función encargada de cargar variables por defecto si no se han cargado los literales (ej. cookies deshabilitadas)
		//NOTA: El que se entre en la función indica mala configuración/error en la aplicación
		_avoidRUPFails : function () {
			//Forzar carga formato fecha si no se ha cargado (evitar fallos)
			var dateFormat = $.rup.i18nParse($.rup.i18n.base,"rup_date.dateFormat");
			if (dateFormat==="rup_date.dateFormat"){
				$.rup.i18n.base["rup_date"] = { dateFormat: "dd/mm/yy" };
			}
			$.jgrid = { formatter : { integer : {} } };
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
		rupAjaxDefaultError: function(xhr, textStatus, errorThrown){
			
			// Evaluamos el error que se ha producido
			var errorText=null;

			if(xhr.status==0){
				errorText=$.rup.i18nParse($.rup.i18n.base,"rup_ajax.httpStatus0");
			}else if(xhr.status==401){
				errorText=$.rup.i18nParse($.rup.i18n.base,"rup_ajax.httpStatus401");
			}else if(xhr.status==404){
				errorText=$.rup.i18nParse($.rup.i18n.base,"rup_ajax.httpStatus404");
			}else if(xhr.status==500){
				errorText=$.rup.i18nParse($.rup.i18n.base,"rup_ajax.httpStatus500");
			}else if(xhr.status==503){
				errorText=$.rup.i18nParse($.rup.i18n.base,"rup_ajax.httpStatus503");
			}
			//Excepción
			else if (xhr.status==406){ //Código de error de UDA
				var obj="";
				try{
					obj = JSON.parse(xhr.responseText);
				} catch (error){
					errorText=xhr.responseText;
				}
			}
			else if (xhr.status==413){ // Error de Too Large Entity
				var obj="";
				try{
					obj = JSON.parse(xhr.responseText);
					errorText = obj.rupFeedback.message.label;
				} catch (error){
					errorText=xhr.responseText;
				}
			}
			
			return errorText;
			
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
							var instance = ($.isEmptyObject($.data(object))?$.data(object, object):$.data(object)), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : "no-function";
					 		
							if ( methodValue === "no-function" ) {
					 			return false;
							} else {
								returnValue = methodValue;
							}
						} else {
							object = $.extend.apply( null, [ true, object].concat(args[0]));
						}
						
					} else {
						var instance = ($.isEmptyObject($.data(object))?$.data(object, object):$.data(object));
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
		},
		//Funcion encargada de mostrar mediante el correspondiente canal el mensaje de error. 
		//La estructura creada, proporciona proteccion a los metodos publicos y privados
		showErrorToUser : function(errorText) {
			
			if (errorText != null && errorText !== ""){
			
				// Se comprueba si existe un dialog visible con una region de rup_feedbak
				var dialog_feedbacks = $(".ui-dialog:visible .rup-feedback"),
					feedbacks = dialog_feedbacks.length!==0 ? dialog_feedbacks :$(".rup-feedback");
				
				// Se comprueba si existe un rup_feedback en la pagina
				if (feedbacks.length!=0){
					
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
						title: $.rup.i18nParse($.rup.i18n.base,"rup_ajax.errorTitle"),
						message: errorText
					});
				}
			}
		}
	});
	
	//Almacenar y restaurar eventos
	$.fn.extend({
		storeEvents:function(){
			this.each(function(){
				$(this).data('storedEvents', $.extend(true, {}, $._data($(this)[0], "events")));
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
	
	
	/*
	 * EVENTOS PROPIOS
	 * mousestop: Detecta cuando el ratón para su desplazamiento
	 */
	$.fn.mousestop={};
	$.fn.mousestop.defaults = {
			delay:300
	};
	
	$.event.special.mousestop = {
		setup : function(data) {
			var self = this, $self = $(this);
			
			$self.data("mousestop",$.extend(true, {}, $.fn.mousestop.defaults, data));
			
			$self.on({
				"mouseenter.rup_mousestop": mouseenterHandler,
				"mouseleave.rup_mousestop": mouseleaveHandler,
				"mousemove.rup_mousestop": mousemoveHandler
			});
		},
		teardown : function() {
			$(this).removeData('mousestop').off('.rup_mousestop');
		}
	};
	
	
	function mouseenterHandler(event){
		var self = this, $self = $(this);
		clearTimeout(self.timeout);
	}
	
	function mouseleaveHandler(event){
		var self = this, $self = $(this);
		clearTimeout(self.timeout);
	}
	
	function mousemoveHandler(event){
		var self = this, $self = $(this);
		
		clearTimeout(self.timeout);
		self.timeout = setTimeout(function(){
			$self.trigger("mousestop", event);
		}, $self.data("mousestop").delay);
	}
	
	// Control de teclas especiales Ctrl y Shift
	
	jQuery("body").on({
		"keydown.rup": function(event){
			var $body = jQuery("body"), ret;
			
			
			switch (event.which){
			case 16:
				if ($body.data("tmp.multiselect.shiftPressed")!==true){
					$body.data("tmp.multiselect.shiftPressed", true);
					ret = $body.triggerHandler("rup_shiftKeyDown");
					if (ret===false){
						event.preventDefault();
						return false;
					}
				}
				break;
			case 17:
				if ($body.data("tmp.multiselect.ctrlPressed")!==true){
					$body.data("tmp.multiselect.ctrlPressed",true);
					ret = $body.triggerHandler("rup_ctrlKeyDown");
					if (ret===false){
						event.preventDefault();
						return false;
					}
				}
				break;
			}
		},
		"keyup.rup": function(event){
			var $body = jQuery("body"), ret;
			
			switch (event.which){
			case 16:
				if ($body.data("tmp.multiselect.shiftPressed")!==false){
					$body.data("tmp.multiselect.shiftPressed",false);
					ret = $body.triggerHandler("rup_shiftKeyUp");
					if (ret===false){
						return false;
					}
				}
				break;
			case 17:
				if ($body.data("tmp.multiselect.ctrlPressed")!==false){
					$body.data("tmp.multiselect.ctrlPressed",false);
					ret = $body.triggerHandler("rup_ctrlKeyUp");
					if (ret===false){
						return false;
					}
				}
				break;
			}
		}
	});
	
	jQuery.extend($.rup, {
		isCtrlPressed : function(){
			return jQuery("body").data("tmp.multiselect.ctrlPressed") === true;
		},
		isShiftPressed : function(){
			return jQuery("body").data("tmp.multiselect.shiftPressed") === true;
		}
	});
	
	
	//Ejemplo de extension de la funcion de inicio 
	//$.extend($.rup.iniRup, console.log("mundo")) ;
	
	//Inicializacion de las funciones de gestion de RUP en general 
	$.rup.iniRup();
})(jQuery);