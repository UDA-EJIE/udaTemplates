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
	 * postConfiguration: Método que se ejecuta después de la invocación del componente jqGrid.
	 * 
	 */
	jQuery.rup_table.registerPlugin("contextMenu",{
		loadOrder:4,
		preConfiguration: function(settings){
			var $self = this;
			return $self.rup_table("preConfigureContextMenu", settings);
		},
		postConfiguration: function(settings){
			var $self = this;
			return $self.rup_table("postConfigureContextMenu", settings);
		}
	});
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//********************************
	
	/**
	 * Extensión del componente rup_table para permitir la gestión del diseño líquido del componente. 
	 * 
	 * Los métodos implementados son:
	 * 
	 * postConfigureFilter(settings): Método que define la preconfiguración necesaria para el correcto funcionamiento del componente.
	 * 
	 * Se almacena la referencia de los diferentes componentes:
	 * 
	 * settings.$fluidBaseLayer : Referencia a la capa que se tomará como base para aplicar el diseño líquido.
	 *  
	 */
	jQuery.fn.rup_table("extend",{
		preConfigureContextMenu: function(settings){
			var $self = this;
			
		},
		postConfigureContextMenu: function(settings){
			var $self = this;
				
			
			$self.on({
				"jqGridLoadComplete.rupTable.contextMenu": function(data){
					var $tbodyTr = jQuery("tbody:first tr", $self), contextRowItems={};
					
					
					jQuery.each(settings.contextMenu.defaultRowOperations, function(buttonId, value){
						var operationCfg;
						if (value===true){
							operationCfg = settings.core.operations[buttonId];
							if (operationCfg!==undefined){
								
								contextRowItems[buttonId]={
									name: operationCfg.name,
//									icon: " rup-icon-contextmenu rup-sprite-"+buttonId,
//									icon: buttonId,
									cssSprite:operationCfg.icon,
									disabled: function(){
										return !jQuery.proxy(operationCfg.enabled,$self)();
									},
									callback: function(key, options){
										jQuery.proxy(operationCfg.callback,$self)(key, options);
									}
								};
							}
						}
					});
//					
//					$tbodyTr.rup_contextMenu({
//						callback: function(key, options) {
//							
//							switch(key){
//							
//							case "add": 
//									$self.rup_table("newElement");
//									break;
//							case "clone":
//									$self.rup_table("cloneElement", $(this).attr("id"));
//									break;
//							case "edit":
//									$self.rup_table("editElement");
//									break;
//							case "delete":
//									$self.rup_table("deleteElement");
//									break;
//							}
//							
//					    },
//						items: {
//					        "add": {name: "Añadir", icon: "add", disabled: false},
//					        "clone": {name: "Clonar", icon: "clone", disabled: false},
//					        "edit": {name: "Editar", icon: "edit", disabled: false},
//					        "delete": {name: "Borrar", icon: "delete", disabled: false}
//						}
//					});
					
					$tbodyTr.rup_contextMenu({
						items: contextRowItems
					});
					
				}
			});
		}
	});
	
		
	//*******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//*******************************************************
	
		
	/**
	 * Parámetros de configuración por defecto para el plugin fluid.
	 * 
	 */
	jQuery.fn.rup_table.plugins.contextMenu = {};
	jQuery.fn.rup_table.plugins.contextMenu.defaults = {
			contextMenu:{
				defaultRowOperations:{
				},
				rowOperations:{
				}
			}
	};
	
	
})(jQuery);