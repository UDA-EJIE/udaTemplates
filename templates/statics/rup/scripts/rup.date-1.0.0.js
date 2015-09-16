//NO EDITAR

(function ($) {
	
	//****************************************************************************************************************
	//DEFINICIÓN BASE DEL PATRÓN (definición de la variable privada que contendrá los métodos y la función de jQuery)
	//****************************************************************************************************************
	
	var rup_date = {};
	var rup_interval = {};
	
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupSelectorObjectConstructor("rup_date", rup_date));
	$.extend($.rup.iniRup, $.rup.rupObjectConstructor("rup_date", rup_interval));
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//*******************************
	
	$.fn.rup_date("extend",{
		destroy : function(){
			//Eliminar máscara
			var labelMaskId = $(this).data("datepicker").settings.labelMaskId;
			if (labelMaskId){
				$("#"+labelMaskId).text("");
			}
			delete labelMaskId;
			$(this).datepicker("destroy");
		},
		disable : function(){
		  $(this).datepicker("disable");
		},
		enable : function(){
		  $(this).datepicker("enable");
		},
		isDisabled : function(){
		  return $(this).datepicker("isDisabled");
		},
		hide : function(){
		  $(this).datepicker("hide");
		},
		show : function(){
		  $(this).datepicker("show");
		},
		getDate : function(){
			return $(this).val();
		},
		setDate : function(date){
		  $(this).datepicker("setDate" , date);
		},
		refresh : function(){
	  		$(this).datepicker("refresh");
		},
		option : function(optionName, value){
	  		$(this).datepicker("option", optionName, value);
		}
		//No soportadas: widget, dialog
	});
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PRIVADOS
	//*******************************
	$.fn.rup_date("extend", {
			_init : function(args){
				if (args.length > 1) {
					$.rup.errorGestor($.rup.i18n.base.rup_global.initError + $(this).attr("id"));
				} else {
					//Se recogen y cruzan las paremetrizaciones del objeto
					var settings = $.extend({}, $.fn.rup_date.defaults, args[0]);

					//Se carga el identificador del padre del patron
					settings.id = $(this).attr("id");

					//Carga de propiedades/literales
					var literales = $.rup.i18n.base["rup_date"];
					for (var key in literales){
						settings[key] = literales[key];
					}
					
					//Mostrar máscara
					if (settings.labelMaskId){
						$("#"+settings.labelMaskId).text(settings.mask+" ");
					}
					
 					//Fix: Arregla problema tamaño capa cuando selector es DIV y meses es array [X,1]
					if ($("#"+settings.id).is("div") && settings.numberOfMonths[1]===1){
						if  (!settings.showWeek){
							$("#"+settings.id).css("width", "15.4em");
						} else {
							$("#"+settings.id).css("width", "17.1em");
						}
					}
					
					//Imagen del calendario
					settings.buttonImage = $.rup.STATICS + (settings.buttonImage?settings.buttonImage:"/rup/basic-theme/images/calendario.png");
					
					//Sab-Dom deshabilitados
					if (settings.noWeekend){
						settings.beforeShowDay =  $.datepicker.noWeekends;
					}
					
					//Atributos NO MODIFICABLES
						//La imagen no debe ser un botón
						settings.buttonImageOnly = true;
						//Solo permitir caracteres permitidos en la máscara
						settings.constrainInput = true;
						//Mostrar patrón con foco en input y pinchando imagen
						settings.showOn = "both";

					//Datepicker
					if (!settings.multiSelect){
						$("#"+settings.id).datepicker(settings);
					} else {
						if (typeof settings.multiSelect === 'number'){
							settings.mode = {
								modeName: 'normal',
								options : {maxPicks : settings.multiSelect}
							};
						} else if (typeof settings.multiSelect === 'object'){
							settings.mode = {
								modeName: 'daysRange',
								options : {autoselectRange : settings.multiSelect}
							};
						}							
						
						//Sobreescribir valores por defecto para multiselección
						$.datepicker._defaults.dateFormat = settings.dateFormat;
						$("#"+settings.id).multiDatesPicker(settings);
					}
					
					//Deshabilitar
					if (settings.disabled){
						$("#"+settings.id).rup_date("disable");
					}
				}
			}
		});
		$.rup_date("extend", {
			_init : function(args){
				if (args.length > 1) {
					$.rup.errorGestor($.rup.i18n.base.rup_global.initError + $(this).attr("id"));
				} else {
					//Se recogen y cruzan las paremetrizaciones del objeto (duplicado de objetos)
					var settings = $.extend({}, $.fn.rup_date.defaults, args[0]),
					from_settings = $.extend(true, {}, settings),
					to_settings =  $.extend(true, {}, settings);

					//Gestionar intervalo					
					from_settings.onSelect = function (selectedDate) {
						$("#"+settings.to).rup_date("option", "minDate", selectedDate);
						if (settings.onSelect!==undefined){ settings.onSelect(selectedDate); }
					};
					to_settings.onSelect = function (selectedDate) {
						$("#"+settings.from).rup_date("option", "maxDate", selectedDate);
						if (settings.onSelect!==undefined){ settings.onSelect(selectedDate); }
					};
					
					//Lanzar componente
					$("#"+settings.from).rup_date(from_settings);
					$("#"+settings.to).rup_date(to_settings);
				}
			}
		});
		
	//******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//******************************************************
	$.fn.rup_date.defaults = {
		multiSelect: false,
		changeMonth: true,
		changeYear: true,
		noWeekend: false
	};	
	
})(jQuery);