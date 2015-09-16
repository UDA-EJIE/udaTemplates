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
			var $self = this,  contextMenuSettings = settings.contextMenu;
			
			// Se unifican los parámetros de configuración de mostrar/ocultar los botones de la toolbar
			if (contextMenuSettings.createDefaultRowOperations===true) {
				contextMenuSettings.showOperations = jQuery.extend(true, {}, contextMenuSettings.defaultRowOperations, settings.core.showOperations, contextMenuSettings.showOperations);
			}
			
		},
		postConfigureContextMenu: function(settings){
			var $self = this, contextMenuSettings = settings.contextMenu;
				
			function getTdIndex(thArray, name){
				
				for(var i=0;i<thArray.length;i++){
				    if (jQuery(thArray[i]).attr("id")===settings.id+"_"+name){
				        return i+1;
				    }
				}
				
				return -1;
			}
			
			
			$self.on({
				"jqGridLoadComplete.rupTable.contextMenu": function(data){
					var $tbodyTr = jQuery(settings.contextMenu.tbodySelector, $self), contextRowItems={},
						cellLevelContextMenu=false, globalCellLevelContextMenu = jQuery.isArray(settings.contextMenu.colNames), itemsPerColumn={}, colItem,
						thArray;
					
//					jQuery.each(settings.contextMenu.defaultRowOperations, function(buttonId, value){
					jQuery.each(settings.contextMenu.showOperations, function(buttonId, value){
						var operationCfg;
						if (value!==false){
							operationCfg = settings.core.operations[buttonId];
							if (operationCfg!==undefined){
								contextRowItems[buttonId]={
									name: operationCfg.name,
									id:settings.id+"_contextMenu_"+buttonId,
									cssSprite:operationCfg.icon,
									disabled: function(){
										return !jQuery.proxy(operationCfg.enabled,$self)();
									},
									callback: function(key, options){
										jQuery.proxy(operationCfg.callback,$self)(key, options);
									},
									className:operationCfg.className
								};
								if (jQuery.isArray(value)===true){
									cellLevelContextMenu=true;
									contextRowItems[buttonId].colNames=value;
								}
							}
						}
					});
					
					jQuery.each(settings.contextMenu.items,function(index, oper){
						if (jQuery.isArray(oper.colNames)){
							cellLevelContextMenu=true;
						}
					});
					jQuery.extend(true, contextRowItems, settings.contextMenu.items);

					// En caso de especificar solo para unas columnas
					thArray = jQuery(settings.contextMenu.theadThSelector, "#gview_"+settings.id);
					
					if (globalCellLevelContextMenu && !cellLevelContextMenu){
						for (var i=0;i< contextMenuSettings.colNames.length;i++){
							jQuery(contextMenuSettings.tbodyTdSelector+":nth-child("+getTdIndex(thArray, contextMenuSettings.colNames[i])+")", $self).rup_contextMenu({
								items: contextRowItems
							});
						}
					}else if (cellLevelContextMenu){
					
//						// En caso de no especificarse un valor de colnames para indicar sobre cuales se debe de mostrar el menú contextual, se toman todas las visibles.
						if (!jQuery.isArray(contextMenuSettings.colNames)){
							contextMenuSettings.colNames = jQuery.map(settings.colModel, function(elem, index){
							    if (elem.hidden!==true){
							        return elem.name;
							    }
							});
						}
						
							
						jQuery.each(contextRowItems, function(index, item){
							var colNamesAux;
							if (jQuery.isArray(item.colNames)){
								colNamesAux = item.colNames;
							}else{
								colNamesAux = contextMenuSettings.colNames;
							}
							
							for (var i=0;i<colNamesAux.length;i++){
								colItem={};
								colItem[colNamesAux[i]]={};
								jQuery.extend(true, itemsPerColumn, colItem);
								var itemAux = {};
								itemAux[index] = item;
								jQuery.extend(true, itemsPerColumn[colNamesAux[i]], itemAux);
							}
						});
						
						jQuery.each(itemsPerColumn, function(index, item){
						jQuery(contextMenuSettings.tbodyTdSelector+":nth-child("+getTdIndex(thArray, index)+")", $self).rup_contextMenu({
								items: item
							});
						});
						
					}else{
						$tbodyTr.rup_contextMenu({
							items: contextRowItems
						});
					}
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
				colNames: null,
				createDefaultRowOperations:true,
				defaultRowOperations:{},
				rowOperations:{},
				tbodySelector:"tbody:first tr[role='row'].jqgrow",
				tbodyTdSelector:"tbody:first tr.jqgrow td",
				theadThSelector:"thead:first th",
				items:{}
			}
	};
	
	
})(jQuery);