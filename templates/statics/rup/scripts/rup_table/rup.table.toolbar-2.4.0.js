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

	/**
	 * Definición de los métodos principales que configuran la inicialización del plugin.
	 * 
	 * preConfiguration: Método que se ejecuta antes de la invocación del componente jqGrid.
	 * postConfiguration: Método que se ejecuta después de la invocación del componente jqGrid.
	 * 
	 */
	jQuery.rup_table.registerPlugin("toolbar",{
		loadOrder:3,
		preConfiguration: function(settings){
			var $self = this;
			return $self.rup_table("preConfigureToolbar", settings);
			
		},
		postConfiguration: function(settings){
			var $self = this;
			return $self.rup_table("postConfigureToolbar", settings);
			
		}
	});
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//********************************
	
	/**
	 * Extensión del componente rup_table para permitir la gestión de la botonera asociada a la tabla. 
	 * 
	 * Los métodos implementados son:
	 * 
	 * preConfigureToolbar(settings): Método que define la preconfiguración necesaria para el correcto funcionamiento del componente.
	 * postConfigureToolbar(settings): Método que define la postconfiguración necesaria para el correcto funcionamiento del componente.
	 * 
	 */
	jQuery.fn.rup_table("extend",{
		/*
		 * Realiza la configuración interna necesaria para la gestión correcta de la edición mediante un formulario.
		 * 
		 * TODO: internacionalizar mensajes de error.
		 */
		preConfigureToolbar: function(settings){
			var $self = this, toolbarSettings = settings.toolbar;
			
			/*
			 * Inicialización de los identificadores por defecto de los componentes del toolbar  
			 */
			toolbarSettings.id = toolbarSettings.id!==null?toolbarSettings.id:settings.id+"_toolbar";
			
			/*
			 * Inicialización del componente rup_toolbar
			 */
			if (jQuery("#"+toolbarSettings.id).length>0){
				settings.$toolbar=(toolbarSettings.id[0]==="#"?$(toolbarSettings.id):$("#"+toolbarSettings.id));
				if (!settings.$toolbar.hasClass("rup-toolbar")){
					settings.$toolbar.rup_toolbar({
						width: 796
					});
				}
				
//				toolbarSettings.self=$(toolbarSettings);
			}else{
				// En caso de no indicarse un toolbar, se crea un toolbar por defecto.
				// FIXME: Contemplar la posibilidad de no generar una toolbar por defecto
				toolbarSettings = {};
				toolbarSettings.id = "rup-maint_toolbar-" + settings.id;
				toolbarSettings.self = $("<div/>").attr("id", toolbarSettings.id);
				$self.prepend(toolbarSettings.self);
				toolbarSettings.self.rup_toolbar({
					width: 796
				});
			}
			
			toolbarSettings.$toolbar = settings.$toolbar;
			
			// autoAjustToolbar: Realiza el autoajuste del toolbar al tamanyo del grid.
			if (toolbarSettings.autoAjustToolbar) {
				settings.$toolbar.css("width", $self.rup_table("getGridParam", "width") - 5);//-5 para ajustar el ancho
			}
			
			// createDefaultToolButtons: Determina la creacion de los botones basicos por defecto del toolbar.
			
			
			

		},
		postConfigureToolbar: function(settings){
			var $self = this, toolbarSettings = settings.toolbar, counter=1;
			
			if (toolbarSettings.createDefaultToolButtons) {
				
				// Se generan los botones de la toolbar en base a las operaciones
				jQuery.each(settings.toolbar.defaultButtons, function(buttonId, value){
					var operationCfg;
					if (value===true){
						operationCfg = settings.core.operations[buttonId];
						if (operationCfg!==undefined){
							toolbarSettings["btn"+buttonId.capitalize()] = settings.$toolbar.addButton({
								i18nCaption: operationCfg.name,
								css: operationCfg.icon,
								index: counter++
							}, jQuery.rup.i18nParse(jQuery.rup.i18n.base,"rup_table")).bind("click", function(event){
								jQuery.proxy(operationCfg.callback,$self)($self, event);
							});
						}
					}
				});
			}
			
			//Se comprueba si hay nuevos botones definidos y se ejecuta la función addButton con la parametrizacion de los nuevos botones
			if (toolbarSettings.newButtons !== undefined && toolbarSettings.newButtons !== null){
				$.each(toolbarSettings.newButtons, function (index, object){
					if (object.json_i18n === undefined){
						object.json_i18n = {};
					}
					if (object.obj !== undefined && object.click !== undefined){
						settings.$toolbar.addButton(object.obj, object.json_i18n).bind("click", object.click);
					} else if (object.buttons !== undefined){
					 	 var mButton = settings.$toolbar.addMButton(object, object.json_i18n).bind("click", settings.$toolbar.showMButton);
					 	 settings.$toolbar.addButtonsToMButton(object.buttons, mButton, object.json_i18n);
					}else{
						$.rup.errorGestor($.rup.i18nParse($.rup.i18n.base,"rup_table.toolbarNewButtonError"));
					} 
				});
			} 
			
			/*
			 * EVENTOS
			 */
			$self.on({
				"jqGridSelectRow.rupTable.toolbar jqGridLoadComplete.rupTable.toolbar jqGridInlineEditRow.rupTable.toolbar jqGridInlineAfterRestoreRow.rupTable.toolbar rupTableHighlightRowAsSelected.rupTable.toolbar rupTableSelectedRowNumberUpdated jqGridInlineAfterSaveRow": function(event, id, status, obj){
					var $self = jQuery(this), settings = $self.data("settings");
					// Existe elementos seleccionados para ser editados
							
					function processButton($button, enable){
						if ($button!==undefined){
							if (enable){
								$button.button("enable");
							}else{
								$button.button("disable");
							}
						}
					}
					
					jQuery.each(settings.toolbar.defaultButtons, function(buttonId, value){
						if (value===true){
							operationCfg = settings.core.operations[buttonId];
							if (operationCfg!==undefined){
								processButton(settings.toolbar["btn"+buttonId.capitalize()], jQuery.proxy(operationCfg.enabled, $self)());
							}
						}
					});
						
//					processButton(settings.toolbar.btnEdit, jQuery.proxy(settings.isOnEdit, $self)());
//					processButton(settings.toolbar.btnAdd, jQuery.proxy(settings.isOnAdd, $self)());
//					processButton(settings.toolbar.btnDelete, jQuery.proxy(settings.isOnDelete, $self)());
//					processButton(settings.toolbar.btnCancel, jQuery.proxy(settings.isOnCancel, $self)());
//					processButton(settings.toolbar.btnSave, jQuery.proxy(settings.isOnSave, $self)());
//					processButton(settings.toolbar.btnClone, jQuery.proxy(settings.isOnClone, $self)());
				}
			});
		}
	});
	
	
	//*******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//*******************************************************
	
		
	// Parámetros de configuración por defecto para la acción de eliminar un registro.
	jQuery.fn.rup_table.plugins.toolbar = {};
	jQuery.fn.rup_table.plugins.toolbar.defaults = {
			toolbar:{
				id: null,
				autoAjustToolbar: true,
				createDefaultToolButtons: true,
				defaultAdd : true,
				defaultEdit : true,
				defaultSave : true,
				defaultClone : true,
				defaultCancel : true,
				defaultDelete : true,
				defaultFilter : false
			}
	};
	
		
	
})(jQuery);