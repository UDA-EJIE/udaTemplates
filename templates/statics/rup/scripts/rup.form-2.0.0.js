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
(function ($) {
	
	

	//*********************************************
	// ESPECIFICACÍON DE LOS TIPOS BASE DEL PATRÓN 
	//*********************************************
	
	//*****************************************************************************************************************
	// DEFINICIÓN BASE DEL PATRÓN (definición de la variable privada que contendrá los métodos y la función de jQuery)
	//*****************************************************************************************************************
	
	var rup_form = {};
	
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupSelectorObjectConstructor("rup_form", rup_form));
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//********************************
	
	$.fn.rup_form("extend",{
		ajaxFormSubmit:function(options){
			var self = this;
			// Actiavamos la gestión de las peticiones AJAX mediante la función $.rup_ajax.
			$.set_uda_ajax_mode_on();
			self.ajaxSubmit(options);
		},
		destroy:function(){
			var self = this;
			$.removeData(self[0]);
			self.ajaxFormUnbind();
			self.unbind();
		},
		formSerialize:function(){
			var self = this, fieldArray, element, ruptype, fieldArray = [];
			
			$.each(self.formToArray(), function(key, obj){
				element = $("[name='"+obj.name+"']",self);
				
				ruptype = element.attr("ruptype");
				if (ruptype!==undefined){
					obj.value=element["rup_"+ruptype]("getRupValue");
					fieldArray.push(obj);
				}else{
					fieldArray.push(obj);
				}
				
			});
			
			return $.param(fieldArray);
		},
		fieldSerialize:function(){
			var a = [];
			this.each(function() {
				var n = $(this).attr("name");
				if (!n) {
					return;
				}
				var v = $(this).rup_form("fieldValue");
				if (v && v.constructor == Array) {
					for (var i=0,max=v.length; i < max; i++) {
						a.push({name: n, value: v[i]});
					}
				}
				else if (v !== null && typeof v != 'undefined') {
					a.push({name: $(this).attr("name"), value: v});
				}
			});
			return $.param(a);
		},
		fieldValue:function(){
			var valuesArray=[], value;
			this.each(function() {
				var ruptype = $(this).attr("ruptype");
				
				if (ruptype!==undefined){
					value = $(this)["rup_"+ruptype]("getRupValue");
					valuesArray.push(value);
				}else{
					$.merge(valuesArray,$(this).fieldValue());
				}
			});
			
			return valuesArray;
		},
		resetForm:function(){
			return this.each(function() {
				$(this).resetForm();
			});
		},
		clearForm:function(includeHidden){
			return this.each(function() {
				$('input,select,textarea', this).rup_form("clearFields",includeHidden);
			});
		},
		clearFields:function(includeHidden){
			return this.each(function() {
				var ruptype = $(this).attr("ruptype");
				
				if (ruptype === undefined || ruptype!=="combo"){
					$(this).clearFields(includeHidden);
				}else{
					$(this).rup_combo("clear");
				}
			});
		}
	});
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PRIVADOS
	//********************************
	$.fn.rup_form("extend",{
	});
	
	$.fn.rup_form("extend",{
			_init : function(args){
				var self=this, realizarValidacion, settings, ajaxFormSettings={}, userSettings={};
				
				// Determinamos si se ha introducido configuracion para el componente validacion. 
				realizarValidacion = (args[0].validate!==undefined);
				// Settings de configuracion
				settings = $.extend(true, {}, $.fn.rup_form.defaults, args[0]);
				
				
				// Anadimos al formulario el class rup_form para identificarlo como componente formulario.
				self.addClass("rup_form");
				self.attr("ruptype","form");
				
				
				var beforeSendUserEvent = settings.beforeSend;
				settings.beforeSend = function (xhr, args) {
					var ejecutar = true;
					if(beforeSendUserEvent !== undefined && beforeSendUserEvent !== null){
						if (beforeSendUserEvent(xhr, args)===false){
							ejecutar = false;
						}
					}
					if (ejecutar){
						if (settings.multimodel!==null){
							xhr.setRequestHeader("RUP_MULTI_ENTITY", "true");
							args.rupFormData["rupEntityMapping"]=settings.multimodel;
						}
						if(args.contentType.indexOf("application/json")!==-1){
							args.data=$.toJSON(args.rupFormData);
							delete args.rupFormData;
						}
					}
				};
				
				var beforeSubmitUserEvent = settings.beforeSubmit;
				settings.beforeSubmit = function (arr, $form, options) {
					var ejecutar = true;
					// Actiavamos la gestión de las peticiones AJAX mediante la función $.rup_ajax.
					$.set_uda_ajax_mode_on();
					if(beforeSubmitUserEvent !== undefined && beforeSubmitUserEvent !== null){
						if (beforeSubmitUserEvent(arr, $form, options)!==false){
							ejecutar = false;
						}
					}
					
					if (ejecutar){
						var data ={}, fileInputs = $('input:file', $form), hasFileInputs = fileInputs.length > 0;
						// Se comprueba si el formulario contiene campos tipo file
						if (!hasFileInputs){
							options.contentType='application/json';
							options.rupFormData=form2object($form[0],null,false);
							arr=form2object($form[0],null,false);
						}else{
							options.type="POST";
							
							$.each(arr, function(i,elem){
								var field = $("[name='"+elem.name+"'][ruptype]",$form);
//								var inputField = $("[name='"+elem.name+"'][type='file']",$form);
								
								// Se obtienen los valores a partir de los componentes RUP
								if (field.length===1){
									elem.value= field["rup_"+field.attr("ruptype")]("getRupValue");
								}
								data[elem.name]=elem.value;
								
								// Se eliminan los parametros en la request asociados a campos file vacios
//								if(inputField.length===1){
//									if(inputField.val()===''){
//										delete arr[i];
//										delete data[elem.name];
//									}
//								}
								
							});
							
							arr=data;
						}
					}
				};
				
				ajaxFormSettings = settings;
				
				if (!realizarValidacion){
					// En caso de que no sehaya configurado el componente validacion se realiza la llamada al plugin jquery.form.
					self.ajaxForm(settings);
				}else{
					// En caso de que se haya configurado el componente validacion, no se invoca directamente al componente jquery.form.
					settings = $.extend(true,settings,{validate:{submitHandler: function(form) {
						ajaxFormSettings = $.extend(true,ajaxFormSettings, {
							success: settings.success,
							error:(settings.error!==undefined?settings.error:function(a,b,c,d){
								var json = jQuery.parseJSON(a.responseText);
								$(form).validate().invalid=json.rupErrorFields;
								$(form).validate().submited=json.rupErrorFields;
								$(form).validate().showErrors(json.rupErrorFields);
								
								if (json.rupFeedback!==undefined && $(form).validate().settings.feedback!==undefined){
									
									$(form).validate().settings.feedback.rup_feedback("set", $.rup_utils.printMsg(json.rupFeedback.message), (json.rupFeedback.imgClass!==undefined?json.rupFeedback.imgClass:null));
								}
								
								
							})
						});
						jQuery(form).ajaxSubmit(ajaxFormSettings);
					}}});
					settings.validate.feedback=settings.feedback;
					self.rup_validate(settings.validate);
				}
				
				
				$.data(self[0], "settings", settings);
			}
		});
		
	//*******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//*******************************************************
	
	$.fn.rup_form.defaults = {
			ajaxForm:null,
			feedback:null,
			multimodel:null
	};		
	

})(jQuery);