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
	jQuery.rup_table.registerPlugin("inlineEdit",{
		loadOrder:7,
		preConfiguration: function(settings){
			var $self = this;
			
			$self.rup_table("preConfigureInlineEdit",settings);
		},
		postConfiguration: function(settings){
			var $self = this;
			
			$self.rup_table("postConfigureInlineEdit",settings);
		}
	});
	
	/**
	 * Extensión del componente rup_table para permitir la edición en línea de los registros visualizados.
	 * 
	 * Los métodos implementados son:
	 * 
	 * configureInlineEdit(settings): Realiza la configuración interna necesaria para la gestión correcta de la edición en línea.
	 * editRow(rowId, options): Activa el modo edicón en línea para un registro determinado.
	 * saveRow(rowId, options): Realiza el guardado de un registo modificado mediante la edición en línea.
	 * 
	 * Las propiedades de esta extensión almacenadas en el settings son las siguientes:
	 * 
	 * settings.$inlineForm : Referencia al formulario utilizado para enviar los datos del registro que está siendo editado.
	 *  
	 */
	jQuery.fn.rup_table("extend",{
		preConfigureInlineEdit: function(settings){
			var $self = $(this),
//				formId = "inlineForm_" + settings.id,
				userBeforeSend;
//				$inlineForm =$("<form>").attr({"id":"inlineForm_" + settings.id});
			
			settings.editable = true;
//			// Arropamos la estructura de la tabla en un formulario para poder realizar el envío de los campos
//			$self.wrap($inlineForm);
//			// Almacenamos la referencia al formulario.
//			settings.inlineEdit.$inlineForm = $("#"+formId);
			
			if (settings.inlineEdit.addEditOptions.url===undefined){
				settings.inlineEdit.addEditOptions.url=settings.baseUrl;
			}
			
			settings.inlineEdit.deleteOptions.ajaxDelOptions = $.extend(true, settings.inlineEdit.deleteOptions.ajaxDelOptions, {
				success: function(data,st, xhr){
					$self.triggerHandler("rupTableAfterDelete", [data,st, xhr]);
					$self.rup_table("showFeedback", settings.$feedback, $.rup.i18nParse($.rup.i18n.base,"rup_table.deletedOK"), "ok");
				}
			});
			
			/*
			 * Configuración del evetno beforeSend. Se sustituye el existente (en caso de haber)
			 * por el implementado a continuación. El objetivo es realizar la operación AJAX medainte
			 * el componente rup_formulario en vez del sistema por defecto del jqGrid.
			 * 
			 * El método beforeSend indicado por el usuario se seguirá ejecutanto de manera normal.
			 */
			// Se almancena en una variable temporal el método beforeSend especificado por el usuario
			userBeforeSend = settings.inlineEdit.beforeSend;
			settings.inlineEdit.addEditOptions.restoreAfterError = false;
			settings.inlineEdit.addEditOptions.errorfunc = function(rowid, data, stat, err, o){
				 var responseJSON;
				 if (data.status === 406 && data.responseText!== ""){
					 try{
						 responseJSON = jQuery.parseJSON(data.responseText);
						 if (responseJSON.rupErrorFields){
							 $self.rup_table("showServerValidationFieldErrors",settings.inlineEdit.$inlineForm, responseJSON);
						 }
					 }catch(e){
						 // El mensaje JSON 
						 $self.rup_table("showFeedback", settings.$feedback, data.responseText, "error");
					 }
				 }
			};
			
			settings.inlineEdit.addEditOptions.ajaxRowOptions.beforeSend = function(jqXHR, ajaxOptions){
				// Se añade la configuración de validaciones, la función userBeforeSend indicada por el usuario y el feedback utilzado por el compoennte.
				jQuery.extend(true, ajaxOptions, {
					validate: settings.validate,
					beforeSend:(jQuery.isFunction(userBeforeSend)?userBeforeSend:null),
					feedback: settings.$feedback
					
				});

				// Handler del evento rupValidate_formValidationError. Se lanza cuando se produce un error de validación en el formulario.
				settings.inlineEdit.$inlineForm.on("rupValidate_formValidationError.inlineEditing", function(event, obj){
					$self.off("rupValidate_formValidationError.inlineEditing");
					// Se elimina la capa de bloqueo de la tabla.
					$("#lui_"+$.jgrid.jqID(settings.id)).hide();
				});
				
				// Se realiza el envío del fomulario
				settings.inlineEdit.$inlineForm.rup_form("ajaxSubmit", ajaxOptions);
				
				// Se retorna false para evitar que se realice la petición AJAX del plugin subyacente.
				return false;
			};
			
			// Configuración de edit/add
			// Se procede a añadir sobre los settings de configuración los correspondientes a la edición en línea.
			settings.inlineEdit.addOptions = $.extend(true,{}, settings.inlineEdit.addEditOptions, settings.inlineEdit.addOptions);
			settings.inlineEdit.editOptions = $.extend(true,{}, settings.inlineEdit.addEditOptions, settings.inlineEdit.editOptions);
			
			
			// Fuerza la configuración para que solo se pueda seleccionar mediante el checkbox
			settings.multiboxonly = true;
			
			settings.getRowForEditing = function(){
				var $self = this,
				selrow=$self.jqGrid('getGridParam','selrow');
				
				return (selrow===null?false:selrow);
			};
			
			/* DEFINICION DE OPERACIONES BASICAS CON LOS REGISTROS */

			settings.core.operations = {
				"add": {
					name: $.rup.i18nParse($.rup.i18n.base,"rup_table.new"),
					icon: "rup-icon rup-icon-new", 
					enabled: function(){
						var $self = this;
						return jQuery("tr[editable='1']", $self).length===0;
					},
					callback: function(key, options){
						var $self = this;
						$self.rup_table("addRow");
					}
				},
				"edit": {
					name: $.rup.i18nParse($.rup.i18n.base,"rup_table.modify"),
					icon: "rup-icon rup-icon-edit", 
					enabled: function(){
						var $self = this,
						selrow=$self.jqGrid('getGridParam','selrow'),
						newRow;
						
						// Existe una fila seleccionada?
						selrow = (selrow===null?false:selrow);
						selrow = selrow && (selrow.indexOf("jqg")===-1);
						
						// Existe una fila en modo nuevo?
						newRow = jQuery("tr[editable='1'].jqgrid-new-row", $self).length===0;
						
						return selrow && newRow;
					},
					callback: function(key, options){
						$self.rup_table("editRow", jQuery.proxy(settings.getRowForEditing,$self)());	
					}
				},
				"save": {
					name: $.rup.i18nParse($.rup.i18n.base,"rup_table.save"),
					icon: "rup-icon rup-icon-save", 
					enabled: function(){
						var $self = this;
						return jQuery("tr[editable='1']", $self).length>0;
					},
					callback: function(key, options){
						$self.rup_table("saveRow");		
					}
				},
				"clone": {
					name: $.rup.i18nParse($.rup.i18n.base,"rup_table.clone"), 
					icon: "rup-icon rup-icon-clone", 
					enabled: function(){
						var $self = this,
						selrow=$self.jqGrid('getGridParam','selrow'),
						newRow;
						
						// Existe una fila seleccionada?
						selrow = (selrow===null?false:selrow);
						selrow = selrow && (selrow.indexOf("jqg")===-1);
						
						// Existe una fila en modo nuevo?
						newRow = jQuery("tr[editable='1'].jqgrid-new-row", $self).length===0;
						
						return selrow && newRow;
						
//						if (settings.inlineEdit.autoEditRow===true){
//							return $self.rup_table("getSelectedRows").length === 1;
//						}else{
//							return $self.rup_table("getSelectedRows").length === 1 && jQuery("tr[editable='1']", $self).length===0;
//						}
						
					},
					callback: function(key, options){
						if (jQuery("tr[editable='1']", $self).length>0){
							$self.rup_table("restoreRow");
						}
						$self.rup_table("cloneRow");			
					}
				},
				"cancel": {
					name: $.rup.i18nParse($.rup.i18n.base,"rup_table.cancel"), 
					icon: "rup-icon rup-icon-cancel", 
					enabled: function(){
						var $self = this;
						return jQuery("tr[editable='1']", $self).length>0;
					},
					callback: function(key, options){
						$self.rup_table("restoreRow");			
					}
				},
				"delete": {
					name: $.rup.i18nParse($.rup.i18n.base,"rup_table.delete"),
					icon: "rup-icon rup-icon-delete", 
					enabled: function(){
						var $self = this,
						selrow=$self.jqGrid('getGridParam','selrow');
						
						selrow = (selrow===null?false:selrow);

						return jQuery("tr[editable='1']", $self).length>0 || selrow;
					},
					callback: function(key, options){
						$self.rup_table("deleteRow");			
					}
				}
			};
			
			
			/* =======
			 * EVENTOS
			 * =======
			 */
			// Campturador del evento jqGridInlineAfterSaveRow.
			$self.on({
//				"jqGridAfterInsertRow.rupTable.inlineEditing": function(event, rowid, data, data){
//					jQuery($self.getInd(rowid, true)).attr("editmode","add");
//					
//				},
				"jqGridInlineErrorSaveRow.rupTable.inlineEditing": function(event, rowid, data){
					jQuery($self.getInd(rowid,true)).attr("id",settings.inlineEditingRow);
					$self.rup_table("setSelection",settings.inlineEditingRow);
				},
				"jqGridInlineAfterSaveRow.rupTable.inlineEditing": function(event, rowid, res, tmp, options){
					
					// Una vez introducida la fila se elimina el estilo jqgrid-new-row para evitar que se elimine al utilizar el cancelar sobre esa fila.
					jQuery("#"+jQuery.jgrid.jqID(rowid)+".jqgrid-new-row", $self).removeClass("jqgrid-new-row");
					
					// Una vez se haya realizado el guardado del registro se muestra el mensaje correspondiente en el feedback dependiendo del modo en el que se encuentra.
					if (options.oper === 'edit') {
						$self.rup_table("showFeedback", settings.$feedback, $.rup.i18nParse($.rup.i18n.base,"rup_table.modifyOK"), "ok");
					} else {
						$self.rup_table("showFeedback", settings.$feedback, $.rup.i18nParse($.rup.i18n.base,"rup_table.insertOK"), "ok");
					}
				},
				"jqGridInlineEditRow.rupTable.inlineEditing": function oneditfunc_default(event, rowId){
					var self = this, $self = $(self),
					settings = $self.data("settings"),
					colModel = self.p.colModel,
					ind = $self.jqGrid('getInd', rowId, true),
					cellColModel, colModelName, editOptions, $elem;
				
					// Se procesan las celdas editables
					$("td[role='gridcell']",ind).each( function(i) {
						cellColModel = colModel[i];
						
						if(cellColModel.editable===true){
							colModelName = cellColModel.name;
							$elem = $("[name='"+colModelName+"']",ind);
							
							
							
							// Se añade el title de los elementos de acuerdo al colname
							$elem.attr({
								"title": self.p.colNames[i],
								"class": "editable customelement"
							});
						
							// En caso de tratarse de un componente rup, se inicializa de acuerdo a la configuracón especificada en el colModel
							if(cellColModel.rupType!==undefined) {
								editOptions = cellColModel.editoptions;
								
								/*
								 * PRE Configuración de los componentes RUP
								 */ 
								switch(cellColModel.rupType){
								case "combo":
									editOptions = $.extend({menuWidth:$elem.width()}, editOptions, {width:"100%"});
									break;
								}
								
								// Invocación al componente RUP
								$elem["rup_"+cellColModel.rupType](editOptions);
								
								/*
								 * POST Configuración de los componentes RUP
								 */
								switch(cellColModel.rupType){
								case "date":
									// TODO: Aplicarlo con estilos
									$elem.css("width","88%");
									break;
								}
							}
						}
					});
					
					settings.inlineEditingRow = rowId;
					
					function addNextRow (rowId, iCol){
						$self.on("jqGridInlineAfterSaveRow.inlineEditing.addNextRow", function(event){
							$self.rup_table("addRow");
							jQuery($self.getInd($self[0].p.selrow, true)).find(":not([readonly]):focusable:first").focus();
							$self.off("jqGridInlineAfterSaveRow.inlineEditing.addNextRow");
						});
						
						$self.rup_table("saveRow", rowId);
						return true;
					};
					
					function editNextRow (rowId, iCol){
						var idsArray, rowIndex, rowsPerPage, page, lastPage, $focusableElem;
						idsArray = $self.getDataIDs();
						rowIndex = $self.getInd(rowId)-1;
						rowsPerPage = parseInt($self.rup_table("getGridParam", "rowNum"),10);
						
						
						if (rowIndex===rowsPerPage-1){
							// Cambio de página
							page = parseInt($self.rup_table("getGridParam", "page"),10);
							lastPage = parseInt(Math.ceil($self.rup_table("getGridParam", "records")/$self.rup_table("getGridParam", "rowNum")),10);
							if (page<lastPage){
								$self.trigger("reloadGrid",[{page: page+1}]);
								$self.on("jqGridAfterLoadComplete.rupTable.inlineEdit",function(event,data){
									idsArray = $self.getDataIDs();
									$self.on("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected", function (event, rId){
										if (iCol === undefined || iCol === -1){
											$focusableElem = jQuery($self.jqGrid("getInd",rId, true)).find("td :not([readonly]):focusable:first");
										}else{
											$focusableElem = jQuery($self.jqGrid("getInd",rId, true)).find("td:eq("+iCol+") :not([readonly]):focusable:first");
										}
										$focusableElem.trigger("focus");
										$self.off("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected");
									});
									jQuery($self.getInd(idsArray[0],true)).trigger("click");
									$self.off("jqGridAfterLoadComplete.rupTable.inlineEdit");
								});
								return false;
							}
							
						}else{
							$self.on("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected", function (event, rId){
								if (iCol === undefined || iCol === -1){
									$focusableElem = jQuery($self.jqGrid("getInd",rId, true)).find("td :not([readonly]):focusable:first");
								}else{
									$focusableElem = jQuery($self.jqGrid("getInd",rId, true)).find("td:eq("+iCol+") :not([readonly]):focusable:first");
								}
								$focusableElem.trigger("focus");
								$self.off("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected");
							});
							jQuery($self.getInd(idsArray[rowIndex+1],true)).trigger("click");
							return false;
						}
						return true;
					};
					
					function editPreviousRow (rowId, iCol){
						var idsArray, rowIndex, page, $focusableElem;
						idsArray = $self.getDataIDs();
						rowIndex = $self.getInd(rowId)-1;
						
						if (rowIndex===0){
							// Cambio de página
							page = parseInt($self.rup_table("getGridParam", "page"),10);
							
							if (page>1){
								$self.trigger("reloadGrid",[{page: page-1}]);
								$self.on("jqGridAfterLoadComplete.rupTable.inlineEdit",function(event,data){
									idsArray = $self.getDataIDs();
									$self.on("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected", function (event, rId){
										if (iCol === undefined || iCol === -1){
											$focusableElem = jQuery($self.jqGrid("getInd",rId, true)).find("td :not([readonly]):focusable:last");
										}else{
											$focusableElem = jQuery($self.jqGrid("getInd",rId, true)).find("td:eq("+iCol+") :not([readonly]):focusable:last");
										}
										$focusableElem.trigger("focus");
										$self.off("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected");
									});
									jQuery($self.getInd(idsArray[idsArray.length-1],true)).trigger("click");
									
									$self.off("jqGridAfterLoadComplete.rupTable.inlineEdit");
								});
								return false;
							}
							
						}else{
							$self.on("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected", function (event, rId){
								if (iCol === undefined || iCol === -1){
									$focusableElem = jQuery($self.jqGrid("getInd",rId, true)).find("td :not([readonly]):focusable:last");
								}else{
									$focusableElem = jQuery($self.jqGrid("getInd",rId, true)).find("td:eq("+iCol+") :not([readonly]):focusable:last");
								}
								$focusableElem.trigger("focus");
								$self.off("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected");
							});
							jQuery($self.getInd(idsArray[rowIndex-1],true)).trigger("click");
							
							return false;
						} 
					}
					
					
					// Se almacena el contenido del los campos de la línea editable
					// TODO: Externalizar la obtención de los datos para comprobar los cambios 
					$self.data("initialFormData",settings.inlineEdit.$inlineForm.rup_form("formSerialize"));
					// Se añaden los eventos de teclado
					jQuery(ind).on({
						"keydown": function(event) {
							if (event.keyCode === 27) {
								$self.jqGrid("restoreRow",$(this).attr("id"), settings.afterrestorefunc);
								return false;
							}
							if (event.keyCode === 13) {
								var ta = event.target;
								if(ta.tagName == 'TEXTAREA') { 
									return true; 
								}
								$self.rup_table("saveRow");
								return false;
							}
						}
					});
					
					jQuery("td", jQuery(ind)).on({
						"keydown": function(event) {
							var iCol, nameArray;

							if (event.keyCode === 38) {
								nameArray = $.map($self.rup_table("getColModel"),function(elem, index){
									   return elem.name; 
								});
								iCol = jQuery.inArray($(this).attr("aria-describedby").split(settings.id+"_")[1], nameArray);
								editPreviousRow($(ind).attr("id"), iCol);
								return false;
							}
							if (event.keyCode === 40) {
								nameArray = $.map($self.rup_table("getColModel"),function(elem, index){
								   return elem.name; 
								});
								iCol = jQuery.inArray($(this).attr("aria-describedby").split(settings.id+"_")[1], nameArray);
								editNextRow($(ind).attr("id"), iCol);
								return false;
							}
						}
					});
					
					jQuery("input,select", jQuery(ind)).on({
						"focus": function(event){
//							var $row = $(this).parent().parent();
//							
//							settings.inlineEditingRow  = $row.attr("id");
//							$self.rup_table("setSelection",$row.attr("id"));
						}
					});
					
					jQuery("input, textarea, select,a.rup_combo", jQuery(ind)).filter(".editable:visible:last").on({
						"keydown": function(event){
							if (event.keyCode == 9 && !event.shiftKey) { 
								if (jQuery(ind).attr("id").indexOf("jqg")!==-1){
									if(addNextRow(jQuery(ind).attr("id"))===false){
										return false;
									}
								}else{
									if(editNextRow(jQuery(ind).attr("id"))===false){
										return false;
									}
								}
							}
						}
					});
					
					jQuery("input, textarea, select,a.rup_combo", jQuery(ind)).filter(".editable:visible:first").on({
						"keydown": function(event){
							var idsArray, rowIndex, page;
							if (event.keyCode == 9) { 
								if (event.shiftKey) {
									
									idsArray = $self.getDataIDs();
									rowIndex = $self.getInd(rowId)-1;
									
									if (rowIndex===0){
										// Cambio de página
										page = parseInt($self.rup_table("getGridParam", "page"),10);
										
										if (page>1){
											$self.trigger("reloadGrid",[{page: page-1}]);
											$self.on("jqGridAfterLoadComplete.rupTable.inlineEdit",function(event,data){
												idsArray = $self.getDataIDs();
												$self.on("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected", function (event, rowId){
													jQuery($self.jqGrid("getInd",rowId, true)).find("td :focusable:last").trigger("focus");
													$self.off("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected");
												});
												jQuery($self.getInd(idsArray[idsArray.length-1],true)).trigger("click");
												
												$self.off("jqGridAfterLoadComplete.rupTable.inlineEdit");
											});
											return false;
										}
										
									}else{
										$self.on("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected", function (event, rowId){
											jQuery($self.jqGrid("getInd",rowId, true)).find("td :focusable:last").trigger("focus");
											$self.off("jqGridInlineEditRow.rupTable.inlineEditing.tabKeyNav.cellSelected");
										});
										jQuery($self.getInd(idsArray[rowIndex-1],true)).trigger("click");
										
										return false;
									} 
									
								}
							}
						}
					});
					
				},
				"jqGridDblClickRow.rupTable.inlineEdit": function (rowid, iRow, iCol, e){
					if (!settings.inlineEdit.autoEditRow){
						$self.rup_table('editRow', iRow);
					}else{
						return false;
					}
				},
				"jqGridBeforeSelectRow.rupTable.inlineEditing": function(event, rowid, obj){
					var $self = $(this),
					settings = $self.data("settings"),
					editableRows = $("tr[editable=1]", $self);
					/*
					 * Se comprueba si existen registros que estén siendo editados en línea.
					 * Del mismo modo se comprueba si el registro seleccionado es diferente del que se está editando en ese momento.
					 */ 
					if (editableRows.length > 0 && (settings.inlineEditingRow!== undefined && settings.inlineEditingRow !== rowid)){
						// Se comprueba si se han realizado cambios en el registro en edición
						// TODO: Utilizar un método para comprobar los cambios en el formulario
						if ($self.data("initialFormData") !== settings.inlineEdit.$inlineForm.rup_form("formSerialize")){
							// En caso de que se hayan realizado cambios se debera de realizar el guardado de los mismos.
							
							// Se confiura un handler para el evento jqGridInlineSuccessSaveRow que indica que se ha completado con exito el guardado del registro modificado.
							$self.on("jqGridInlineSuccessSaveRow.inlineEditing_beforeSelectRow", function(event){
								// Una vez se haya realizado correctamente el guardado del registo se procede a seleccionar el registro solicitado por el usuario.
								$self.rup_table("setSelection",rowid);
								// Se elimina el handler del evento para evitar duplicidades
								$self.off("jqGridInlineSuccessSaveRow.inlineEditing_beforeSelectRow");
							});
							
							// Se procede a realizar el guardado de los registros editados
							for (var i=0; i<editableRows.length;i++){
								$self.rup_table("saveRow", editableRows[0].id);
							}
							
							// Se retorna un false para deterner la selección del registro y permitir que se realice antes la gestión del guardado. 
							return false;
						}
					}
					
					// En caso de no necesitarse guardar el registro en edición se continúa con la gestión de la selección de manera normal.
					return true;
				},
				"jqGridSelectRow.rupTable.inlineEditing": function (event, rowid, status, obj){
					var $self = $(this), editableRows;
					editableRows = $("tr[editable=1]", $self);
					
					// En caso de que existan registros en modo edición se restauran
					if (editableRows.length > 0){
						jQuery.each($("tr[editable=1]", $self), function(index, elem){
							if ($(elem).attr("id")!==rowid){
								$self.jqGrid("restoreRow", $(elem).attr("id"));
							}
						});
					}
					
					if (settings.inlineEdit.autoEditRow){
						// Se procede a entrar en modo edición en la línea seleccionada.
						$self.rup_table("editRow", rowid);
					}
				},
				"rupTable_checkOutOfGrid.rupTable.inlineEditing": function(event, $target){
					var $self = $(this), settings = $self.data("settings"),
					operationCfg = settings.core.operations["save"];
					if (jQuery.proxy(operationCfg.enabled, $self)()){
						jQuery.proxy(operationCfg.callback,$self)($self, event);
					}
				}
			});
			if (settings.inlineEdit.autoEditRow){
				$self.on({
					"jqGridCellSelect.rupTable.inlineEditing": function (event, rowid, iCol, cellcontent, obj){
						var $self = $(this);
						if (iCol!==-1){
							$self.on(
								"jqGridInlineEditRow.rupTable.inlineEditing.cellSelected", function (event, rowId){
									jQuery($self.jqGrid("getInd",rowid, true)).find("td:eq("+iCol+") :focusable:first").trigger("focus");
									$self.off("jqGridInlineEditRow.rupTable.inlineEditing.cellSelected");
								}
							);
						}
					}
				});
			}
			
		},
		postConfigureInlineEdit:function(settings){
			var $self = this,
			formId = "inlineForm_" + settings.id,
			$inlineForm =$("<form>").attr({"id":"inlineForm_" + settings.id});
		
			// Arropamos la estructura de la tabla en un formulario para poder realizar el envío de los campos
			$self.wrap($inlineForm);
			// Almacenamos la referencia al formulario.
			settings.inlineEdit.$inlineForm = $("#"+formId);
			
			settings.inlineEdit.$inlineForm.on("rupValidate_formValidationError.inlineEditing", function(event, obj){
				var rowid = $self.jqGrid('getGridParam','selrow');
				
				jQuery($self.getInd(rowid,true)).attr("id",settings.inlineEditingRow);
				$self.rup_table("setSelection",settings.inlineEditingRow);
			});
			
			$self.on({
				"jqGridLoadComplete.rupTable.formEditing": function(data){
					var $self = $(this), settings = $self.data("settings"), nPos;
					
					if (settings.inlineEdit.autoselectFirstRecord){
						nPos = jQuery.proxy(jQuery.jgrid.getCurrPos, $self[0])();
						$self.rup_table("highlightRowAsSelected", jQuery($self.jqGrid("getInd", nPos[1][0],true)));
					}
				}
			});
		}
	});
	
	
	/**
	 * Métodos públicos del plugin inlineEdit. 
	 * 
	 * Los métodos implementados son:
	 * 
	 * addRow(options): Muestra una nueva línea para inserción.
	 * editRow(rowId, options): Activa el modo edicón en línea para un registro determinado.
	 * deleteRow(rowId, options): Realiza el borrado de un registro. 
	 * saveRow(rowId, options): Realiza el guardado de un registo modificado mediante la edición en línea.
	 * restoreRow(rowId): Restaura la línea indicada
	 * 
	 * Las propiedades de esta extensión almacenadas en el settings son las siguientes:
	 * 
	 * settings.$inlineForm : Referencia al formulario utilizado para enviar los datos del registro que está siendo editado.
	 *  
	 */
	jQuery.fn.rup_table("extend",{
		addRow: function(options){
			var $self = this, 
			settings = $self.data("settings"),
			colModel = $self[0].p.colModel;
			
			/*
			 * TODO: Ajustar el paso de parámetros
			 */
			var auxOptions = {addRowParams:$.extend({},settings.inlineEdit.addOptions,options)};
			
			// Controlar los campos editables en modo nuevo
			for (var i=0;i<colModel.length;i++){
				if (colModel[i].editable === true && colModel[i].editableOnAdd!==false){
					if (colModel[i].editable === true && colModel[i].editableOnAdd===false){
						if (colModel[i].editoptions=== undefined){
							colModel[i].editoptions={};
						}
						colModel[i].editoptions.readonly="readonly";
					}else {
						if (colModel[i].editoptions !== undefined && colModel[i].editoptions.readonly !== undefined){
							delete colModel[i].editoptions.readonly;
						}
					}
				}
			}
			
			if ($self.triggerHandler("rupTable_beforeAddRow", [auxOptions])!==false){
				$self.jqGrid('addRow', $.extend({},auxOptions));
			}
			
			return $self;
		},
		cloneRow: function(rowId, options){
			var $self = this, 
			settings = $self.data("settings"),
			selectedRow = (rowId===undefined?$self.jqGrid('getGridParam','selrow'):rowId),
			colModel = $self[0].p.colModel,
			rowdata, clonedRowId;
			
			if ($self.triggerHandler("rupTable_beforeCloneRow",[settings, rowId])!==false){
				rowdata = $self.jqGrid("getRowData",selectedRow);
				$self.rup_table("addRow");
				clonedRowId = jQuery("tbody:first tr[id*='jqg']",$self).attr("id");
				$self.jqGrid("setRowData",clonedRowId, rowdata);
				jQuery($self.jqGrid("getInd",clonedRowId,true)).attr("editable","0");
				
				// Controlar los campos editables en modo nuevo
				for (var i=0;i<colModel.length;i++){
					if (colModel[i].editable === true && colModel[i].editableOnAdd!==false){
						if (colModel[i].editable === true && colModel[i].editableOnAdd===false){
							if (colModel[i].editoptions=== undefined){
								colModel[i].editoptions={};
							}
							colModel[i].editoptions.readonly="readonly";
						}else {
							if (colModel[i].editoptions !== undefined && colModel[i].editoptions.readonly !== undefined){
								delete colModel[i].editoptions.readonly;
							}
						}
					}
				}
				
				$self.rup_table("editRow", clonedRowId, {}, true);
			}
			
			
		},
		editRow: function (rowId, options, skipFieldCheck){
			var $self = this, 
			settings = $self.data("settings"),
			selectedRow = (rowId===undefined?$self.jqGrid('getGridParam','selrow'):rowId),
			colModel = $self[0].p.colModel;
			
			if (skipFieldCheck!==true){
				// Controlar los campos editables en modo edición
				for (var i=0;i<colModel.length;i++){
					if (colModel[i].editable === true && colModel[i].editableOnEdit===false){
						if (colModel[i].editoptions=== undefined){
							colModel[i].editoptions={};
						}
						colModel[i].editoptions.readonly="readonly";
					}else {
						if (colModel[i].editoptions !== undefined && colModel[i].editoptions.readonly !== undefined){
							delete colModel[i].editoptions.readonly;
						}
					}
				}
			}
			
			if ($self.triggerHandler("rupTable_beforeEditRow",[settings.inlineEdit.editOptions, selectedRow])!==false){
				$self.jqGrid('editRow', selectedRow, $.extend({},settings.inlineEdit.editOptions,options));
			}
			
			return $self;
		},
		deleteRow: function (rowId, options){
			
			
			var $self = this, 
			settings = $self.data("settings"),
//			deleteOptions = jQuery.extend(true, {}, jQuery.fn.rup_table.defaults.deleteOptions, options),
			deleteOptions = jQuery.extend(true, {}, settings.inlineEdit.deleteOptions, options),
			selectedRow = (rowId===undefined?$self.rup_table('getSelectedRows'):rowId);

			// En caso de especificarse el uso del método HTTP DELETE, se anyade el identificador como PathParameter
			if (selectedRow.length===1){
				if (deleteOptions.mtype==="DELETE"){
					deleteOptions.url = settings.baseUrl+"/"+$self.rup_table("getPkUrl",selectedRow);
				}
			}else{
				deleteOptions.mtype = "POST";
				deleteOptions.ajaxDelOptions.contentType = 'application/json';
				deleteOptions.ajaxDelOptions.type = "POST";
				deleteOptions.ajaxDelOptions.dataType = 'json';
				deleteOptions.url = settings.baseUrl+"/deleteAll";
				deleteOptions.serializeDelData = function(ts,postData){
//					$self.rup_table("getFilterParams")
					return jQuery.toJSON({
						"core":{
							"pkToken":settings.multiplePkToken,
							"pkNames":settings.primaryKey
						},
						"multiselection":$self.rup_table('getSelectedIds')
					});
				};
			}
			
			deleteOptions.afterSubmit = function(){
				$self.triggerHandler("rupTable_deleteAfterSubmit");
				return true;
			};
			
			if ($self.triggerHandler("rupTable_beforeDeleteRow",[deleteOptions, selectedRow])!==false){
				$self.jqGrid('delGridRow',selectedRow, deleteOptions);
			}
			
			return $self;
			
//			var $self = this, 
//				settings = $self.data("settings"),
////				deleteOptions = jQuery.extend(true, {}, jQuery.fn.rup_table.defaults.deleteOptions, options),
//				deleteOptions = jQuery.extend(true, {}, settings.inlineEdit.deleteOptions, options),
//				selectedRow = (rowId===undefined?$self.jqGrid('getGridParam','selrow'):rowId);
//
//			// En caso de especificarse el uso del método HTTP DELETE, se anyade el identificador como PathParameter
//			if (deleteOptions.mtype==="DELETE"){
//				deleteOptions.url = settings.baseUrl+"/"+selectedRow;
//			}
//			
//			
//			
//			$self.jqGrid('delGridRow',selectedRow, deleteOptions);
//			
//			return $self;
		},
		saveRow : function(rowId, options){
			var $self = this, settings = $self.data("settings"),
			selectedRow = (rowId===undefined?$self.jqGrid('getGridParam','selrow'):rowId);
			
//			var userBeforeSend = settings.ajaxRowOptions.beforeSend;
//			self.p.ajaxRowOptions.beforeSend = function(jqXHR, ajaxOptions){
//				var rupFormSettings = {};
//				jQuery.extend(true, rupFormSettings, ajaxOptions, {validate: settings.validation});
//				if (jQuery.isFunction(userBeforeSend)){
//					rupFormSettings.beforeSend = userBeforeSend;
//				}else{
//					rupFormSettings.beforeSend = null;
//				}
//				settings.$inlineForm.rup_form("ajaxSubmit", rupFormSettings);
//				return false;
//			};
			
			if(selectedRow.indexOf("jqg")!==-1){
				$self[0].p.ajaxRowOptions = settings.inlineEdit.addOptions.ajaxRowOptions;
				$self.jqGrid('saveRow', selectedRow, settings.inlineEdit.addOptions);
			}else{
				$self[0].p.ajaxRowOptions = settings.inlineEdit.editOptions.ajaxRowOptions;
				$self.jqGrid('saveRow', selectedRow, settings.inlineEdit.editOptions);
			}
			
			return $self;
		},
		restoreRow: function(rowId){
			var $self = this,
			rowToRestore = (rowId===undefined?$self.jqGrid('getGridParam','selrow'):rowId);
				
				
			$self.jqGrid("restoreRow",rowToRestore);
		}
	});
	
	
	
	
	
	//*******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//*******************************************************

	/**
	 * Parametros de configuración de los settings para el caso particular de configuración del componente en el caso de funcionar en modo edición en linea.
	 * 	
	 * Los métodos para los que se proporciona una implementación son los siguientes.
	 * 
	 * beforeSelectRow: 
	 * onCellSelect:
	 * onSelectRow:
	 */
	jQuery.fn.rup_table.plugins.inlineEdit = {};
	jQuery.fn.rup_table.plugins.inlineEdit.defaults = {
			toolbar:{
				defaultButtons:{
					add : true,
					edit : true,
					cancel : true,
					save : true,
					clone : true,
					"delete" : true,
					filter : false
				}
			},
			contextMenu:{
				defaultRowOperations:{
					add : true,
					edit : true,
					cancel : true,
					save : true,
					clone : true,
					"delete" : true,
					filter : false
				}
			},
			inlineEdit:{
				autoselectFirstRecord: true,
				autoEditRow:false
			},
			formEdit:{
			}
	};	
	
	// Parámetros de configruación comunes para las acciónes de añadir y editar un registro
	jQuery.fn.rup_table.plugins.inlineEdit.defaults.inlineEdit.addEditOptions = {
		contentType: 'application/json',
		type:"PUT",
		dataType: 'json',
		ajaxRowOptions:{
			contentType: 'application/json',
			dataType: 'json',
			processData:false
		}
	};
	
	// Parámetros de configruación específicos para la acción de añadir un registro
	jQuery.fn.rup_table.plugins.inlineEdit.defaults.inlineEdit.addOptions = {
			mtype: "POST",
			ajaxRowOptions:{
				type:"POST"
			}
	};
	
	// Parámetros de configruación específicos para la acción de editar un registro
	jQuery.fn.rup_table.plugins.inlineEdit.defaults.inlineEdit.editOptions = {
			mtype: "PUT",
			ajaxRowOptions:{
				type:"PUT"
			}
	};
	
	// Parámetros de configruación específicos para la acción de eliminar un registro
	jQuery.fn.rup_table.plugins.inlineEdit.defaults.inlineEdit.deleteOptions = {
		bSubmit: jQuery.rup.i18nParse(jQuery.rup.i18n.base,"rup_message.aceptar"),
		cancelicon:[true, "left", "icono_cancelar"],
		delicon:[false],
		linkStyleButtons: ["#eData"],
		msg: '<div id="rup_msgDIV_msg_icon" class="rup-message_icon-confirm"></div><div id="rup_msgDIV_msg" class="rup-message_msg-confirm white-space-normal">'+jQuery.rup.i18nParse(jQuery.rup.i18n.base,"rup_table.deleteAll")+'</div>',
		mtype:"DELETE",
		width: 320,
		reloadAfterSubmit:false, 
		resize:false
	};
	
	/**
	 * Extensión de las propiedades por defecto del jqGrid para el modo de edición en línea
	 */
	jQuery.jgrid.inlineEdit = {
		keys:false
	};
	
})(jQuery);