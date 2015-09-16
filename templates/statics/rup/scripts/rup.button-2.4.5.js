/*!
 * Copyright 2014 E.J.I.E., S.A.
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
	
	var rup_button = {};
	
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupSelectorObjectConstructor("rup_button", rup_button));
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//*******************************
	$.fn.rup_button("extend",{
		foo: function() {
			return this;
		}
	});
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PRIVADOS
	//*******************************
	
	$.fn.rup_button("extend",{
		_bar: function() {
			return this;
		}
	});
	
	//*******************************
	// MÉTODO DE INICIALIZACION
	//*******************************
	$.fn.rup_button("extend", {
		_init : function(args){
			var settings = $.extend(true, {}, $.fn.rup_button.defaults, args[0]),
			$self = this, $dropdownList, $container, dropdownSettings;
			
			
			
			// Comprobamos si se hace uso del dropdown
			if (settings.dropdown === false){
				// Botón normal
				$self.button(settings);
				$self.addClass("rup-button");
				
			}else{
				// Inicialización del dropdown
				$.extend(true, settings.dropdown, $.fn.rup_button.dropdown_defaults, args[0].dropdown);
				
				dropdownSettings = settings.dropdown;
				
				$self.addClass("rup-button rup-dropdown");
				
				// Wrap into div
				$container = jQuery("<div>").attr("class","rup-dropdown-btn-group");
				
				$container = $self.wrap($container).parent();
				
				dropdownSettings.$container = $container;
				
				$self.button({});
				
				
				$self.addClass("rup-dropdown");
				
				
				var $dropdownButton = jQuery("<button>").attr({
					type: "button",
					id: $self.prop("id")+"_dropdown"
					
				}).text("Administración de filtros").button({
					icons:{
						primary: dropdownSettings.dropdownIcon
					},
					text: false
				}).addClass("rup-dropdown-button");
				
				$self.after($dropdownButton);
				
				if (dropdownSettings.dropdownListId){
					$dropdownList = jQuery("#"+dropdownSettings.dropdownListId);
					dropdownSettings.$dropdownList = $dropdownList;
					
					$container.append($dropdownList);
					$dropdownButton.on("click.rup_dopdown", function(event){
						$dropdownList.toggleClass("open");
						event.stopPropagation();
						
					});
					
					$dropdownList.on("click.rup_dopdown", function(event){
						event.stopPropagation();
					});
					
					jQuery(document).on("click.rup_dopdown.close", function(){
						$dropdownList.removeClass("open");
					});
					
					
				}else if (dropdownSettings.dropdownDialog){ // Configuracion del dropdown con un RUP dialog
					
					jQuery.extend(dropdownSettings.dropdownDialogConfig,{
						autoOpen:false,
						position:{my: "right top", at: "right bottom", of: $container}
					});
					var $dropdownDialog = jQuery("#"+dropdownSettings.dropdownDialog).rup_dialog(dropdownSettings.dropdownDialogConfig);
					
					// Estilos
					$dropdownDialog.parent().addClass("rup-dropdown-dialog");
					
					$dropdownButton.on("click", function(){
						$dropdownDialog.rup_dialog("open");
					});
				}
			}
			
			// TODO : Invocación al plugin 
			
		}
	});
		
	//******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//******************************************************
	$.fn.rup_button.defaults = {
		dropdown:false
	};
	
	$.fn.rup_button.dropdown_defaults ={
		dropdownIcon: "ui-icon-triangle-1-s",
		dropdownListId: undefined,
		dropdownDialog: undefined,
		dropdownDialogConfig:{
			type: $.rup.dialog.DIV
		}
	};
	
})(jQuery);