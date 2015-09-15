//NO EDITAR

(function ($) {
	
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
		//Funcion encargada de recargar, segun idioma definido en rup.lang, los literales a presentar en la pagina
		setLiterals : function (lang) {
			if (lang !== undefined && lang !== null && lang !== "") {
				$.rup.lang = lang;
			}
			//Peticion ajax destinada a cargar el fichero  JSon de literales
			$.ajax({
				url: $.rup.RUP + "/resources/rup.i18n_" + $.rup.lang + ".json", 
				dataType:'json', 
				type:'GET',
				async: false, 
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				success: function(data){
			  			//Se cargan los literales de la tabla por separado (consecuencia de la naturalza de JqGrid)
						$.extend({},$.jgrid, data.rup_jgrid);
						//Se cargan los literales generales de la aplicacion en RUP
						$.rup.i18n = data;
						$.rup.i18n.base = data;
			  		},
			  		error: function(XMLHttpRequest, textStatus, errorThrown){
			  			//tratamiento de error
						alert("Se ha producido un error en el parseo del fichero JSON de literales => "+textStatus+".\n\n"+"Error devuelto:\n"+textStatus+": "+XMLHttpRequest.status+" - "+XMLHttpRequest.statusText);
			  		} 
			});
		},
		//Funcion encargada de cargar las variables generales de los servidores en la estructura de RUP(recoge los datos introducidos en la Jsp y elimina los predecesores).
		serverVarLoad : function () {
			//Convertir variables javascript a variables internas de rup
			$.rup.APP_RESOURCES = APP_RESOURCES;
			$.rup.APP_STATICS = STATICS + "/" + APP_RESOURCES;
			$.rup.CTX_PATH = CTX_PATH;
			$.rup.RUP = RUP;
			$.rup.STATICS = STATICS;
			$.rup.DEFAULTLANGUAGE = DEFAULT_LANGUAGE;
			$.rup.WAR_NAME = WAR_NAME;
			$.rup.AVAILABLE_LANGS = AVAILABLE_LANGS;
			$.rup.LAYOUT = LAYOUT;
			
			//Borrar las variables javascript externas
			delete APP_RESOURCES;
			delete CTX_PATH;
			delete RUP;
			delete STATICS;
			delete DEFAULT_LANGUAGE;
			delete LAYOUT;
			delete WAR_NAME;
			delete AVAILABLE_LANGS;
		},
		//Funcion encargada de presentar los errores
		errorGestor : function (message) {			
			$.rup_messages("msgError", {
				title: $.rup.i18n.rup_base.developerError,
				message: "<p>"+message+"</p>"
			});

			throw (message);
			
		},
		//Funcion encargada de cargar el fichero de la aplicación especificado (síncrono)
		getFile : function (file) {
			if (file === undefined && file === null && file === "") {
				$.rup.errorGestor("No se ha definido el fichero a cargar");
			} else {
				if (!$.rup.i18n[file]){
					
					//Peticion ajax destinada a devolver el fichero JSON indicado
					$.ajax({
						url: $.rup.APP_STATICS + "/resources/" + file + ".json", 
						dataType:'json', 
						type:'GET', 
						async: false, 
						contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
							success: function(data, textStatus, XMLHttpRequest){
								//se carga la respuesta del servidor en la estructura I18n de RUP
								$.rup.i18n.file = data;
								$.rup.i18n[file] = data;
					  		},
					  		error: function(XMLHttpRequest, textStatus, errorThrown){
								$.rup.errorGestor("Se ha producido un error en el parseo del fichero JSON de la aplicación => "+textStatus+".<br>"+"Error devuelto:<br>"+errorThrown);
					  		} 
					});
				}
			}
		},
		//Funcion encargada de cargar el fichero i18n de la aplicación (síncrono)
		getFile_i18n : function () {
			//Peticion ajax destinada a devolver el fichero JSON indicado
			$.ajax({
				url: $.rup.APP_STATICS + "/resources/" + $.rup.WAR_NAME  + ".i18n_" + $.rup.lang + ".json", 
				dataType:'json', 
				type:'GET', 
				async: false,
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				success: function(data){
						//se carga la respuesta del servidor en la estructura I18n de RUP
						$.rup.i18n.file_i18n = data;
						$.rup.i18n.app = data;
			  		},
			  		error: function(XMLHttpRequest, textStatus, errorThrown){
			  			alert("Se ha producido un error en el parseo del fichero JSON de literales de la aplicación => "+textStatus+".\n\n"+"Error devuelto:\n"+textStatus+": "+XMLHttpRequest.status+" - "+XMLHttpRequest.statusText);
			  		} 
			});
		},
		//Funcion encargada de hacer las inicializaciones basicas de RUP
		iniRup : function () {
			//Se cargan las variables generales del servidor
			$.rup.serverVarLoad();
			if ($.rup_utils.get("language") !== null && $.rup_utils.get("language") !== "") {//si tenemos cookie con el lenguaje es el es lang que hay que tener no es del navegador
				this.lang = $.rup_utils.get("language");
			} else {
				if (this.DEFAULTLANGUAGE != null && this.DEFAULTLANGUAGE != "") {//si tengo idioma por defecto
					this.lang = this.DEFAULTLANGUAGE;
				}
				$.rup_utils.set("language", this.lang, {path:'/'});
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
			if (window.jquitr) {
				
				jquitr.addThemeRoller();
			} else {
				jquitr = {};
				jquitr.s = document.createElement('script');
				jquitr.s.src = 'http://jqueryui.com/themeroller/developertool/developertool.js.php';
				document.getElementsByTagName('head')[0].appendChild(jquitr.s);
			}
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
				 	var options=options;
						var isMethodCall = typeof options === "string", args = Array.prototype.slice.call(arguments, 1), returnValue = this;
				
				 	// prevent calls to internal methods
					if ( isMethodCall && options.charAt( 0 ) === "_" ) {
						return returnValue;
					}
				
					 if ( isMethodCall ) {
						if (options !== "extend") {
										
									var instance = $.data(object, object), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : "no-function";
									
					 		if ( methodValue === "no-function" ) {
					 			return false;
									}
									else {
								returnValue = methodValue;
							}
						
								}
								else {
							object = $.extend.apply( null, [ true, object].concat(args[0]));
						}
						
							}
							else {
						
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
			
			//Se crea el nuevo gestor del Pátron
			if ($.fn[name] === undefined) {
			$.fn[name] = function( options ) {
				var selectObject = $(this);
			 	var options=options;
					var isMethodCall = typeof options === "string", args = Array.prototype.slice.call(arguments, 1), returnValue = this;
			
			 	// prevent calls to internal methods
				if ( isMethodCall && options.charAt( 0 ) === "_" ) {
					return returnValue;
				}
			
			 if ( isMethodCall ) {
				if (options !== "extend") {
							var instance = $.data(selectObject, object, options), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : "no-function";
							
			 		if ( methodValue === "no-function" ) {
			 			return false;
							}
							else {
						returnValue = methodValue;
					}
				
						}
						else {
					object = $.fn.extend.apply( null, [ true, object].concat(args[0]));
				}
				
					}
					else {
				
				var instance =  $.data(selectObject, object);
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
	
})(jQuery);