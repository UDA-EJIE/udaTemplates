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
	
	$.maint = $.maint || {};
	$.extend($.maint, {
		extend : function (methods) {
			$.fn.extend(methods);
		},
		getPrimaryKeys : function (oldRows) {
			var aPKS = [], i = 0, j = 0;
			for (i = 0 ; i < oldRows.length; i++) {//me recorro las paginas
				for (j = 0; j < oldRows[oldRows[i]].length; j++) {//me recorro las paginas que hay en la pagina
					aPKS.push(oldRows[oldRows[i]][oldRows[oldRows[i]][j]]);
				}
			}
			return aPKS;
		}
	});
	$.extend($.rup, {
		maint : {
			detailButtons : {
				ALL : "all", 
				SAVE : "onlySave", 
				SAVE_REPEAT : "save_repeat"
			}
		}
	});
	//*****************************************************************************************************************
	// DEFINICIÓN BASE DEL PATRÓN (definición de la variable privada que contendrá los métodos y la función de jQuery)
	//*****************************************************************************************************************
	var rup_maint = {};
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupSelectorObjectConstructor("rup_maint", rup_maint));
	//Métodos públicos a invocar por los desarrolladores
	$.fn.rup_maint("extend", {
		newElement : function () {//Muestra el formulario de adición y pone el mantenimiento en modo alta.
			return this.each(function () {
				//tratamiento de mantenimientos editables.
				if (this.prop.jQueryGrid.rup_grid("isEditable")) {
					if (this.prop.jQueryGrid.rup_grid("isEditing")) {
						//Si estoy editando alguna fila tengo que guardar
						if (this.prop.MODO === "new") {//si estsmos dando de alta un registro e intentamos volver a pulsar el boton de nuevo
							$("#" + this.prop.lastsel + " .editable:first", this.prop.jQueryGrid).focus();
							return false;
						}
						this.prop.jQueryGrid.rup_grid('saveRow', this.prop.lastsel, rup_maint.saveEditableSucces, "clientArray", null, rup_maint.aftersavefunc, rup_maint.saveEditableError, null);
					}	
					this.prop.MODO = "new";
					var ids = this.prop.jQueryGrid.rup_grid("getDataIDs"), numTotal = ids.length;
					this.prop.jQueryGrid.rup_grid("addRowData", numTotal, {}, "first");
					this.prop.jQueryGrid.rup_grid("setSelection", numTotal, false);
					this.prop.selectedCell = 0;
							
					obj = this.prop.jQueryGrid;
					
					$(this).rup_maint("editElement", numTotal, true);//True para que no cambie el modo nochangemode
					
				} else {//resto de mantenimientos
					this.prop.MODO = "new";
					$(this).rup_maint("resetForm", this.prop.detailForm);
					//quitamos todos los iconos de las validaciones
					$("#" + this.prop.detailDiv[0].id + " .rup-maint_validateIcon").remove();
					this.prop.detailFeedback.rup_feedback("close");
					if ($.isFunction(this.prop.onbeforeDetailShow)) {
						this.prop.onbeforeDetailShow.call(this, this.prop.detailDiv);
					}
					$(this).rup_maint("updateDetailPagination" ,1, 1);
					this.prop.detailDiv.rup_dialog("open");
					//establecemos el foco al primer elemento
					$("input:first",this.prop.detailForm).focus();
				}
			});
		},
		cancelEditing : function () {//cancela la edición de una linea
			if (this[0].prop.MODO === "new") {//Si hemos pulsado nuevo y cancleamos hayq ue borrar la fila
				this[0].prop.jQueryGrid.rup_grid("delRowData",this[0].prop.jQueryGrid.rup_grid("getGridParam",'selrow'));
			} else {
				this[0].prop.jQueryGrid.rup_grid("restoreRow", this[0].prop.lastsel);
			}
			
			this[0].prop.lastsel=null;
			
			this[0].prop.toolbar.disableButton("cancel");
			this[0].prop.toolbar.enableButton("new");
			
			this[0].prop.feedback.rup_feedback("close");
		},
		updateDetailPagination : function (rowPos, totalElements) {
			return this.each(function () {
				$("#rup_maint_selectedElements").html("" + 
						rowPos + " " +
						$.rup.i18n.base.rup_maint.de + " " + 
						totalElements + " " + 
						$.rup.i18n.base.rup_maint.elements);						
				if (rowPos === totalElements) {//si es 3 de 3 deshabilitar el forward y el last
					$("#last_" + this.prop.name + ", #forward_" + this.prop.name, this.prop.detailDiv).addClass('ui-state-disabled');
					if (rowPos === 1) { //si es el primer registro deshabilito el poder ir al primero y atras
						$("#first_" + this.prop.name + ", #back_" + this.prop.name, this.prop.detailDiv).addClass('ui-state-disabled');
					} else {//sino es el ultimo con lo que habilito el ir atras y al primero
						$("#first_" + this.prop.name + ", #back_" + this.prop.name, this.prop.detailDiv).removeClass('ui-state-disabled');
					}
				} else if (rowPos === 1 && totalElements > 1) { //si el registro es diferente al total y es el primero se habilitan siguiente y ultimo y se deshabilitan primero y anterior
					$("#first_" + this.prop.name + ", #back_" + this.prop.name, this.prop.detailDiv).addClass('ui-state-disabled');
					$("#last_" + this.prop.name + ", #forward_" + this.prop.name, this.prop.detailDiv).removeClass('ui-state-disabled');
				} else {
					$("#last_" + this.prop.name + ", #forward_" + this.prop.name, this.prop.detailDiv).removeClass('ui-state-disabled');
					$("#first_" + this.prop.name + ", #back_" + this.prop.name, this.prop.detailDiv).removeClass('ui-state-disabled');
				}
			});
		},
		resetForm: function(form){
			// Se realiza el reset de los campos ordinarios
			form.resetForm();
			// Se realiza el reset de los rup_combo
			$("select.rup_combo",form).rup_combo("select");
		},
		loadDetailFromServer : function (id, detailForm) {
			return this.each(function () {
				var mnt = this, t = this.prop.jQueryGrid.rup_grid("getDataIDs"),
					selectedRows = this.prop.jQueryGrid.rup_grid("getSelectedRows"), detailURL = this.prop.jQueryGrid[0].rup_gridProps.url,
					colPks = this.prop.primaryKey.split(";"), parentColPks, parent, parentSelectedRow, page = this.prop.jQueryGrid.rup_grid("getGridParam", "page");
				if (!this.prop.jQueryGrid.rup_grid("isMultiselect")) {
					if (colPks.length > 1) {
						for (var i = 0; i < colPks.length; i++) {
							detailURL = detailURL + "/" + this.prop.jQueryGrid.rup_grid("getCol", selectedRows[0], colPks[i]); 
						}
					} else {
						detailURL = detailURL + "/" + this.prop.jQueryGrid.rup_grid("getCol", selectedRows[0], colPks[0]);
					}
				} else {
					detailURL = detailURL + this.prop.selectedRows["p_" + page]["id_" + id];//selectedRows[0]];
				}
				function getRowidFromPk(p, id) {
					// Recorremos las paginas desde la primera hasta la actual
					var cont = 0;
					for (var i=1;i<=Number(p);i=i+1){
						// comprobamos si es la pagina actual
						if (i===Number(p)){
							cont+=$.inArray("id_"+id,mnt.prop.selectedRows["p_"+p])+1;
						}else if ($.inArray(i.toString(),$.data(mnt.prop.jQueryGrid[0], "deSelectedPages"))===-1){
							if ($.isArray(mnt.prop.selectedRows["p_"+i])){
								// Si la pagina existe en el array de seleccionados
								cont+=mnt.prop.selectedRows["p_"+i].length;
							}else{
								// Si se han seleccionado todos los elementos de la tabla
								if ($.data(mnt.prop.jQueryGrid[0] , "allSelected")===true){
									// Comprobamos si la pagina existe en el array de deseleccionados
//									if ($.inArray(i.toString(),$.data(mnt.prop.jQueryGrid[0], "deSelectedPages"))===-1){
										cont+=Number(mnt.prop.jQueryGrid[0].p.rowNum);
//									}
	
								}
							}
						}
					}
					return cont;
					
//					for (var i = 0 ; i < mnt.prop.selectedRows.length; i++) {//me recorro las paginas
//						if (mnt.prop.selectedRows[i] === "p_" + p) {//si es la pagina
//							for (var j = 0; j < mnt.prop.selectedRows[mnt.prop.selectedRows[i]].length; j++) {//me recorro las filas que hay en la pagina
//								if (mnt.prop.selectedRows[mnt.prop.selectedRows[i]][j] === "id_" + id) {
//									return cont;
//								} else {// si no es el que buscamos sumamos el contador
//									cont += 1;
//								}
//							}
//						} else { //si no es la pagina sumamos todas sus filas
//							cont +=  mnt.prop.selectedRows[mnt.prop.selectedRows[i]].length;
//						}
//					}
//					var cont = 1, rowIndex;
//					rowsXpage = mnt.prop.jQueryGrid.rup_grid("getGridParam", "rowNum");
//					rowIndex=$.inArray(id,mnt.prop.jQueryGrid.rup_grid("getDataIDs"))+1;
//					
//					return (Number(p)-1)*rowsXpage+rowIndex;
				}
				$.rup_ajax({
					url: detailURL,
					dataType: 'json',
					type: "GET",
					async: false,
					contentType: 'application/json',		    
					success: function (xhr, ajaxOptions) {
						var rowPos, page = mnt.prop.jQueryGrid.rup_grid("getGridParam", "page"), totalRows, rowsXpage, totalElements;
						// TODO:ver si cuando se mire lo de la multiseleccion se pueden aunar las partes del if
						if (mnt.prop.jQueryGrid.rup_grid("isMultiselect")) {
							rowPos = getRowidFromPk(page, id);
							if (mnt.prop.jQueryGrid.data("old_selectRows") && mnt.prop.jQueryGrid.data("old_selectRows").length > 0) {
								totalElements = parseInt(mnt.prop.selectedRowsCont) + parseInt(mnt.prop.jQueryGrid.data("old_selectRows").length);
							} else {
								totalElements = mnt.prop.selectedRowsCont;
							}							
						} else { //si no es multi seleccion
							totalElements = mnt.prop.jQueryGrid.rup_grid("getGridParam", "records");
							rowsXpage = mnt.prop.jQueryGrid.rup_grid("getGridParam", "rowNum");
							/*total de paginas*/
							var rowNumber=Number(mnt.prop.jQueryGrid.rup_grid("getInd",id,false));
							rowPos = ((parseInt(page) * parseInt(rowsXpage)) - parseInt(rowsXpage)) + rowNumber;
						}
						$(mnt).rup_maint("updateDetailPagination", rowPos, totalElements);
						
						if (xhr.id && xhr.id instanceof Object){//estamos en JPA
							if (xhr.id instanceof Object) {//es que estamos en jpa y traemos una clave compuesta
								xhr["JPA_ID"] = xhr.id;
								delete xhr.id;
							}
						}

						$.rup_utils.populateForm($.rup_utils.jsontoarray(xhr), mnt.prop.detailForm);
						
						if ($.isFunction(mnt.prop.onbeforeDetailShow)) {
							mnt.prop.onbeforeDetailShow.call(mnt, mnt.prop.detailDiv);
						}
						
						$("select[rupType='combo']", mnt.prop.detailForm).bind("change",function(){
							mnt.prop.detailForm.data('initialData', mnt.prop.detailForm.serialize());
							$(this).unbind("change");
						});
						
						//Gestor de cambios
						mnt.prop.detailForm.data('initialData', mnt.prop.detailForm.serialize());
						if (!mnt.prop.detailDiv.rup_dialog("isOpen")) {
							mnt.prop.detailDiv.rup_dialog("open");
						}
						
						if ($.isFunction(mnt.prop.onafterDetailShow)) {
							mnt.prop.onafterDetailShow.call(mnt, mnt.prop.detailDiv);
						}

						//establecemos el foco al primer elemento
						$("input:not(readonly):first", mnt.prop.detailForm).focus();
						
						return false;
					},
					error: function (xhr, ajaxOptions, thrownError) {
						mnt.prop.feedback.rup_feedback("option", "delay", null);
						mnt.prop.feedback.rup_feedback("set", xhr.responseText, "error");
						mnt.prop.feedback.rup_feedback("option", "delay", 1000);
					}
				});
			});
		},
		onBeforeEdit : function (rowN) {//evento donde crear los objetos de RUP
			var ret, rowColModel, mntName = $.data(this, "maintName"), relatedGrid = $(this), firstInput;
			
			$("#" + mntName)[0].prop.toolbar.enableButton("cancel");
			$("#" + mntName)[0].prop.toolbar.disableButton("new");
			
			if ($.isFunction($("#" + mntName)[0].prop.onbeforeDetailShow)) {
				ret = $("#" + mntName)[0].prop.onbeforeDetailShow.call(this, rowN);
			}
			if (ret) {	
				return false;
			}
			firstInput = $("#" + rowN, relatedGrid);//aqui tengo el tr
			rowColModel = relatedGrid.rup_grid("getColModel");
			for (var i = 0;i < rowColModel.length; i++) {
				if (rowColModel[i].editable) {
					
					var rupType = rowColModel[i].rupType;
					var elc = $("#" + rowN + "_" + rowColModel[i].name);
					if (rupType === "datepicker") {
						elc.rup_date(rowColModel[i].editoptions);
						// En caso de tratarse de un mantenimiento de edición en línea se elimina el icono asociado para mostrar el calendario.
						if(relatedGrid.rup_grid("isEditable")){
							elc.parent().find("img.ui-datepicker-trigger").remove();
						}
					}else if (rupType === "numeric"){
						elc.numeric(",");
					}else if (rupType=== "integer"){
						elc.numeric(false);
					}else if (rupType=== "combo"){
						if (rowColModel[i].edittype==="select"){
							elc=$("#" + rowN+' td[aria-describedby="'+relatedGrid.attr("id")+'_'+rowColModel[i].name+'"]').find("select");
							elc.attr("id",rowN+"_"+rowColModel[i].name);
							
						}
						
						if (!rowColModel[i].editoptions.width){
							rowColModel[i].editoptions.width=rowColModel[i].width;
						}
						elc.rup_combo(rowColModel[i].editoptions);
						elc.rup_combo("select",elc.val());
						$("#" + rowN + "_" + rowColModel[i].name).addClass("customelement");
					}
				}
			}//for 

			var lastColName = rowColModel[rowColModel.length-1].name;
			var firstColName = rowColModel[0].name;
			//validaciones individuales
			$(".validableElem").live('change', function () {
				var data = [], elem = this;
				data.push({name: "property", value: this.name});
				data.push({name: "bean", value: $("#" + mntName)[0].prop.modelObject});
				data.push({name: "value", value: $(this).val()});
				$.rup_ajax({
					url: '../validate',
					dataType: 'json',
					type: "POST",
					data: data,
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
					success: function (xhr, ajaxOptions) {
						$("#" + mntName)[0].prop.feedback.rup_feedback("close");
					},
					error: function (xhr, ajaxOptions, thrownError) {
						var errorTXT = $.rup.i18n.base.rup_maint.validateError, errors = null, errorKey = null, causedErrors = null, errMsg = "", errorMesg = "";
						if (xhr.responseText !== null && xhr.responseText !== "") {	
							if (xhr.status === 406) {//si ha habido algun error en las validaciones...
								$(mant).rup_maint("showFieldValidationErrors",xhr);
							} else {
								$("#" + mntName)[0].prop.feedback.rup_feedback("option", "delay", null);
								$("#" + mntName)[0].prop.feedback.rup_feedback("set", errorTXT, "error");								
								$("#" + mntName)[0].prop.feedback.rup_feedback("option", "delay", 1000);
							}
						}
					}
				});
			});
			
			/*
			 * Funcion encargada de gestionar el cambio de pagina al realizar la navegacion con el tabulador
			 */
			function manageTabKeyPageChange(relatedGrid, newPage){
				var dataIds = relatedGrid.rup_grid("getDataIDs");
				relatedGrid[0].p.ajaxGridOptions = {async: false};
				relatedGrid.rup_grid("setGridParam", {page: parseFloat(newPage)});
				relatedGrid.rup_grid("reloadGrid");
				relatedGrid[0].p.ajaxGridOptions = {async: true};
			}
			
			/*
			 * Funcion encargada de gestionar la navegacion con el tabulador
			 */
			function manageTabKey (relatedGrid, event){
				
				var rowNumber, dataIds, rowID, lastPage,  numPag;

				if (event.keyCode == 9) { // TAB
					if ($(this).hasClass("hasDatepicker")) {
						$(this).datepicker("hide");
					}
					// Guardamos la fila actual
					$("#" + mntName).rup_maint("saveMaint", null, rowN, function(){
						rowNumber = Number(relatedGrid.rup_grid("getInd",rowN,false))-1;
						dataIds = relatedGrid.rup_grid("getDataIDs");
						page = Number(relatedGrid.rup_grid("getGridParam", 'page'));

						// El guardado se ha realizado correctamente
						if (!event.shiftKey) {
							rowId=dataIds[rowNumber+1];
							
							if (rowNumber == dataIds.length-1) {//si es la ultima fila hay que paginar y poner la primera en edicion
								lastPage = Number(relatedGrid.rup_grid("getGridParam", 'lastpage'));
								if (parseFloat(page) + 1 <= lastPage) {
									manageTabKeyPageChange(relatedGrid, page+1);
									dataIds = relatedGrid.rup_grid("getDataIDs");
									rowId=dataIds[0];
								} else {
									return false;
								}
							}
						}else{
							rowId=dataIds[rowNumber-1];
							
							if (rowNumber == 0) {//si es la ultima fila hay que paginar y poner la primera en edicion
								page = Number(relatedGrid.rup_grid("getGridParam", 'page'));
								if (parseFloat(page)> 1) {
									manageTabKeyPageChange(relatedGrid, page-1);
									dataIds = relatedGrid.rup_grid("getDataIDs");
									rowId=dataIds[dataIds.length-1];
								} else {
									return false;
								}
							}
						}
						
						if ($("#" + mntName)[0].prop.MODO==="new"){
							if (!event.shiftKey){
								// En el caso de estar en modo edicion se muestra una nueva linea para continuar insertando registros
								$("#" + mntName).rup_maint("newElement");
								
								// Situamos el focus en el primer campo editable de la nueva linea
								$("tr.addElement:first .editable:first",relatedGrid).focus();
							}
						}else{
							// En caso de estar en modo modificacion se marca editable la siguiente línea
							$("#" + mntName).rup_maint("editElement", rowId);
							if (!event.shiftKey){
								$("tr#"+rowID+" td .editable:first",relatedGrid).focus();
							}else{
								$("tr#"+rowID+" td .editable:last",relatedGrid).focus();
							}
						}
					});
					return false;
				}
				return true;
			}
			
			// Gestion de la navegacion mediante el tabulador al estar posicionado el foco en el ultimo campo editable de la linea
			$("input[name='" + lastColName + "']", relatedGrid).bind("keydown", function(event) {
				
				if (event.keyCode == 9) { // TAB
					if (!event.shiftKey) {
						return manageTabKey(relatedGrid, event);
					}
				}
			});
			
			// Gestion de la navegacion mediante el shift+tabulador al estar posicionado el foco en el primer campo editable de la linea
			$("input[name='" + firstColName + "']", relatedGrid).bind("keydown", function(event) {	
				
				if (event.keyCode == 9) { // TAB
					if (event.shiftKey) {
						return manageTabKey(relatedGrid, event);
					}
				}
			});
			
			$("#" + rowN +"_"+rowColModel[$("#" + mntName)[0].prop.selectedCell].name , relatedGrid).focus();
		},
		saveEditableError : function () {
		},
		saveEditableSucces : function () {
		},
		saveEditable : function () {//evento que se lanza cuando se deja de editar la fila en edición
			$(this).rup_maint("saveMaint");
		},
		restore: function () {//evento que se lanza al restaurar la fila.
			var maint = $("#" + $.data(this, "maintName"));
			
			maint[0].prop.toolbar.disableButton("cancel");
			maint[0].prop.toolbar.enableButton("new");

			maint.data('initialData', null);
			maint[0].prop.feedback.rup_feedback("close");
			if (maint[0].prop.MODO === "new") {//si estsmos dando de alta un registro e intentamos volver a pulsar el boton de nuevo
				maint[0].prop.jQueryGrid.rup_grid("delRowData",maint[0].prop.jQueryGrid.rup_grid("getGridParam",'selrow'));
			}
		},	
		aftersavefunc : function (rowid, res) {//Evento que se lanza cuandos e termina de editar
			if (res) {
				var maint = $("#" + $.data(this, "maintName"));
				maint.rup_maint("saveMaint", null, rowid);
			}
		},
		checkOutOfGrid : function (evt, obj) {
			var maint=this;
			if (evt.target.id === "") {
				if(evt.target.className!=='' && $("#gbox_"+maint[0].prop.jQueryGrid[0].id).find("." + evt.target.className).length > 0) {
					return false;
				} else {//Que no sea el boton de cancelar el que coja el foco
					if (this[0].prop.toolbar !== null && $(evt.target).find(".rup-maint_cancel").length > 0) {// Si tengo toolbar
						return false;
					}
				}
			} else {
				if ($("#gbox_"+maint[0].prop.jQueryGrid[0].id).find("#" + evt.target.id).length > 0 ) {
					return false;
				}
			}
			
			if (maint[0].prop.jQueryGrid.rup_grid("isEditable")) {
				if (maint[0].prop.jQueryGrid.rup_grid("isEditing")) {
					maint[0].prop.toolbar.disableButton("cancel");
					maint[0].prop.toolbar.enableButton("new");
					//Si estoy editando alguna fila tengo que guardar
//					if (this[0].prop.MODO === "new") {//si estamos dando de alta un registro e intentamos volver a pulsar el boton de nuevo
//						$("#" + this[0].prop.lastsel + " .editable:first", this[0].prop.jQueryGrid).focus();
//						return false;
//					}
					this.rup_maint("saveMaint", null, maint[0].prop.lastsel, function(){
						maint[0].prop.lastsel=null;
					});
					return false;
				}
			}
			
			
		},
		editElement: function (id, noChangeMode) {//Edita la fila que recibe como parametro
			
			// Funcion utilizada para asociar los eventos de teclado a los campos del registro en el modo de edicion en linea
			function inlineEditKeyEvents(rowId, elem, relatedGrid, mant){
				$(elem).unbind("keydown").bind("keydown",function(e) {
					if (e.keyCode === 27) {relatedGrid.rup_grid("restoreRow",id, afterrestorefunc);}
					if (e.keyCode === 13) {
						var ta = e.target;
						if(ta.tagName == 'TEXTAREA') { return true; }
						$(mant).rup_maint("saveMaint", null, id, function(){
							mant.prop.lastsel=null;
						});
						return false;
					}
					e.stopPropagation();
				});
			}
			
			return this.each(function () {
				if (id !== null) {
					var rowPos, page, totalRows, rowsXpage, totalElements, mant=this, mnt = $(this), relatedGrid = this.prop.jQueryGrid, lastsel=this.prop.lastsel;
//					if (!noChangeMode) {
//						this.prop.MODO = "edit";
//					}
					//Si el mantenimiento es editable
					if (relatedGrid.rup_grid("isEditable")) {
						
						//adjuntamos los mouseDown para que cuando se realice alguna acción fuera del grid se guarde
						$("#gbox_" + relatedGrid[0].id).parent().bind("mousedown", function (event){mnt.rup_maint("checkOutOfGrid", event, this);});
						this.prop.searchForm.parent().bind("mousedown", function (event){mnt.rup_maint("checkOutOfGrid", event, this);});
						
						if (id == this.prop.lastsel) {//si vuelvo a pintxar dos veces sobre la misma fila
							// TODO: Comprobar si es necesaria esta casuistica
							
						} else if (id && id !== this.prop.lastsel) { 	
							if (this.prop.lastsel !== null) {	
								if (mnt.data('initialData') === null) {//si he guardado y ha ido bien se pone el initialdata a null con lo que hay que editar y listo
									if (!noChangeMode) {
										this.prop.MODO = "edit";
									}
									relatedGrid.rup_grid("editRow", id, true, rup_maint.onBeforeEdit, 
											rup_maint.saveEditable, /*editUrl*/ "clientArray", null, rup_maint.aftersavefunc, 
											null, rup_maint.restore);
									
									var ind = relatedGrid.rup_grid("getInd",id,true);
									inlineEditKeyEvents(id, ind, relatedGrid, mant);
									
									mnt.data('initialData', $.toJSON(relatedGrid.rup_grid("getEditingRowData", id)));
									if (this.prop.MODO === "edit"){
										relatedGrid.rup_grid("setSelection", id, null);
									}
									this.prop.lastsel = id;
									//lanzar el after edit
									if ($.isFunction(this.prop.onafterDetailShow)) {
										this.prop.onafterDetailShow.call(this, id);
									}
									return false;
								} else {							
									$(this).rup_maint('saveMaint', null, this.prop.lastsel, function(){
										
										if (!noChangeMode) {
											mant.prop.MODO = "edit";
										} 
										
										relatedGrid.rup_grid("editRow", id, true, rup_maint.onBeforeEdit, 
												rup_maint.saveEditable, "clientArray", null, rup_maint.aftersavefunc, null, 
												rup_maint.restore);
										
										var ind = relatedGrid.rup_grid("getInd",id,true);
										inlineEditKeyEvents(id, ind, relatedGrid, mant);
										
										relatedGrid.rup_grid("setSelection", id, null);
										mnt.data('initialData', $.toJSON(relatedGrid.rup_grid("getEditingRowData", id)));
										mant.prop.lastsel=id;
										return false;
									}, function(){
										relatedGrid.rup_grid("setSelection", lastsel, null);
										return false;
									});
									return false;
								}
							}
							
							if (!noChangeMode) {
								this.prop.MODO = "edit";
							}
							
							relatedGrid.rup_grid("editRow", id, true, rup_maint.onBeforeEdit, 
									rup_maint.saveEditable, "clientArray", null, rup_maint.aftersavefunc, null, 
									rup_maint.restore);
							//relatedGrid.rup_grid("setSelection", id, null);
							var ind = relatedGrid.rup_grid("getInd",id,true);
							inlineEditKeyEvents(id, ind, relatedGrid, mant);
							
							mnt.data('initialData', $.toJSON(relatedGrid.rup_grid("getEditingRowData", id)));
							this.prop.lastsel = id; 
						}
						
						//lanzar el after edit
						if ($.isFunction(this.prop.onafterDetailShow)) {
							this.prop.onafterDetailShow.call(this, id);
						}
					} else {
						//quitamos todos los iconos de las validaciones
						$("#" + this.prop.detailDiv[0].id + " .rup-maint_validateIcon").remove();
						this.prop.detailFeedback.rup_feedback("close");
						//Se cargan los datos en el formulario
						if (this.prop.detailServer || relatedGrid.rup_grid("isMultiselect")) {
							$(this).rup_maint("loadDetailFromServer", id, this.prop.detailForm);
							return false;
						} else {
							page = relatedGrid.rup_grid("getGridParam", "page");
							totalElements = relatedGrid.rup_grid("getGridParam", "records");
							rowsXpage = relatedGrid.rup_grid("getGridParam", "rowNum");
							/*total de paginas*/
							var rowNumber=Number(relatedGrid.rup_grid("getInd",rowN,false))-1;
							rowPos = ((parseInt(page) * parseInt(rowsXpage)) - parseInt(rowsXpage)) + rowNumber;
							$(this).rup_maint("updateDetailPagination", rowPos, totalElements);
							if ($.isFunction(this.prop.onbeforeDetailShow)) {
								this.prop.onbeforeDetailShow.call(this, this.prop.detailDiv);
							}
							relatedGrid.rup_grid("GridToForm", id, this.prop.detailForm);						
							this.prop.detailDiv.rup_dialog("open");
							//establecemos el foco al primer elemento
							$("input:not(readonly):first", this.prop.detailForm).focus();
						}
					}
				} else { 
					alert($.rup.i18n.base.rup_grid.nav.alerttext); 
				}
			});
		},	
		deleteElement : function (id) {//elimina la fila del id que recibe como parametro
			return this.each(function () {
				var maintID = "", rowData = null, mnt = null,
				lng = "", i = 0, arrayPK, url = null, pks = [], jsonData = null, detailPks = [];
				mnt = this;
				if (this.prop.jQueryGrid.rup_grid("isMultiselect")) { //si es multiseleccion hay que enviar todos los id que estan seleccionados
					if (this.prop.selectedRows.length <= 0 && this.prop.jQueryGrid[0].rup_gridProps.allPksArray.length <= 0) {//es que no tengo filas para borrar
						$.rup_messages("msgAlert", {
							message: $.rup.i18n.base.rup_maint.noReg,
							title: $.rup.i18n.base.rup_maint.titleDelAll
						});
					} else {
						$.rup_messages("msgConfirm", {
							message: $.rup.i18n.base.rup_maint.deleteAll,
							title: $.rup.i18n.base.rup_maint.titleDelAll,
							OKFunction : function () {
								if ($.data(mnt.prop.jQueryGrid[0] , "allSelected") !== null && 
										$.data(mnt.prop.jQueryGrid[0] , "allSelected") !== undefined) {
									for (var i = 0; i< mnt.prop.jQueryGrid[0].rup_gridProps.allPksArray.length; i++) {
										if (mnt.prop.primaryKey.indexOf(";") > 0) {//si tenemos clave compuesta
											arrayPK = mnt.prop.jQueryGrid[0].rup_gridProps.allPksArray[i].substring(1).split("/"); 
											lng = arrayPK.length;
											for (var k = 0; k < lng; k++) {
												detailPks.push(arrayPK[k]);
											}
										} else {
											detailPks.push(mnt.prop.jQueryGrid[0].rup_gridProps.allPksArray[i].substring(1));
										}
										pks.push(detailPks);
										detailPks = [];
									}
								} else {
									for (i = 0 ; i < mnt.prop.selectedRows.length; i++) {//me recorro las paginas
										for (var j = 0; j < mnt.prop.selectedRows[mnt.prop.selectedRows[i]].length; j++) {//me recorro las filas que hay en la pagina
											if (mnt.prop.primaryKey.indexOf(";") > 0) {//si tenemos clave compuesta
												arrayPK = mnt.prop.selectedRows[mnt.prop.selectedRows[i]][mnt.prop.selectedRows[mnt.prop.selectedRows[i]][j]].substring(1).split("/"); 
												lng = arrayPK.length;
												for (var k = 0; k < lng; k++) {
													detailPks.push(arrayPK[k]);
												}
											} else {
												detailPks.push(mnt.prop.selectedRows[mnt.prop.selectedRows[i]][mnt.prop.selectedRows[mnt.prop.selectedRows[i]][j]].substring(1));
											}
											pks.push(detailPks);
											detailPks = [];
										}
									}
								}
								url = mnt.prop.jQueryGrid[0].rup_gridProps.url + "/deleteAll";
								jsonData = $.toJSON(pks);
								$.rup_ajax({
									url: url,
									dataType: 'json',
									data: jsonData,
									async: false,
									type: "POST",
									contentType: 'application/json',
									success: function (xhr, ajaxOptions) {
										mnt.prop.selectedRows = [];
										mnt.prop.selectedRowsCont = 0;
										mnt.prop.jQueryGrid[0].rup_gridProps.allPksArray = [];
										mnt.prop.jQueryGrid.rup_grid("reloadGrid");
										mnt.prop.jQueryGrid.rup_grid("resetSelection");
										$.data(mnt.prop.jQueryGrid[0] , "allSelected", null);
										$.data(mnt.prop.jQueryGrid[0], "deSelectedPages",[]);
										if (mnt.prop.showMessages) {
											mnt.prop.feedback.rup_feedback("set", $.rup.i18n.base.rup_maint.deletedOK, "ok");
										}
										mnt.prop.jQueryGrid.rup_grid("reloadGrid");
									},
									error: function (xhr, ajaxOptions, thrownError) {
										mnt.prop.feedback.rup_feedback("option", "delay", null);
										mnt.prop.feedback.rup_feedback("set", xhr.responseText, "error");
										mnt.prop.feedback.rup_feedback("option", "delay", 1000);
									}
								});
							}
						});
					}
					return false;
				} else {
					
					$.rup_messages("msgConfirm", {
						message: $.rup.i18n.base.rup_maint.deleteAll,
						title: $.rup.i18n.base.rup_maint.titleDelAll,
						OKFunction : function () {
							if (mnt.prop.jQueryGrid.rup_grid("isEditable")) {//si estamos en grid editable
								if (mnt.prop.jQueryGrid.rup_grid("isEditing")) {//si estamos editando
									//Si estoy editando alguna fila tengo que guardar
									if (mnt.prop.MODO === "new") {//si estsmos dando de alta un registro e intentamos volver a pulsar el boton de nuevo
										$(mnt).rup_maint("cancelEditing", mnt);
										return false;
									}
									mnt.prop.jQueryGrid.rup_grid('restoreRow', id);
								}	
							}
							rowData = mnt.prop.jQueryGrid.getRowData(id);
							if (rowData !== null) {//si tenemnos datos
								if (mnt.prop.primaryKey.indexOf(";") > 0) {//si tenemos clave compuesta
									arrayPK = mnt.prop.primaryKey.split(";"); 
									lng = arrayPK.length;
									for (i = 0; i < lng; i++) {
										maintID = maintID + "/" +  rowData[arrayPK[i]];
									}
								} else {
									maintID = "/" + rowData[mnt.prop.primaryKey];//obtenemos el valor de la celda de la clave primaria, 
								}
								url = mnt.prop.jQueryGrid[0].rup_gridProps.url + maintID;
							} else {
								return false;
							}
							$.rup_ajax({
									url: url,
									dataType: 'json',
									data: jsonData,
									async: false,
									type: "DELETE",
									contentType: 'application/json',
									success: function (xhr, ajaxOptions) {
										var delOK = mnt.prop.jQueryGrid.rup_grid("delRowData", id);
										if (mnt.prop.showMessages) {
											mnt.prop.feedback.rup_feedback("set", $.rup.i18n.base.rup_maint.deletedOK, "ok");
										}
										if (mnt.prop.jQueryGrid.rup_grid("getDataIDs").length > 0) {//seleccionamos la primera fila
											mnt.prop.jQueryGrid.rup_grid("setSelection", mnt.prop.jQueryGrid.rup_grid("getDataIDs")[0], false);
										}
										mnt.prop.jQueryGrid.rup_grid("resetSelection");
										$.data(mnt.prop.jQueryGrid[0] , "allSelected", null);
										$.data(mnt.prop.jQueryGrid[0], "deSelectedPages",[]);
										if (mnt.prop.jQueryGrid.rup_grid("isEditable")) {
											mnt.prop.toolbar.disableButton("cancel");
											mnt.prop.toolbar.enableButton("new");
										}
										mnt.prop.jQueryGrid.rup_grid("reloadGrid");
										mnt.prop.lastsel=null;
									},
									error: function (xhr, ajaxOptions, thrownError) {
										mnt.prop.feedback.rup_feedback("option", "delay", null);
										mnt.prop.feedback.rup_feedback("set", xhr.responseText, "error");
										mnt.prop.feedback.rup_feedback("option", "delay", 1000);
									}
							});
						}
					});
				}
			});
		},
		saveMaint: function (saveAndRepeat, rowId, aftersavefunc, aftererrorfunc) {
			function getRowidFromPk(p, id) {
				var cont = 1;
				for (var i = 0 ; i < mnt.prop.selectedRows.length; i++) {//me recorro las paginas
					if (mnt.prop.selectedRows[i] === "p_" + p) {//si es la pagina
						for (var j = 0; j < mnt.prop.selectedRows[mnt.prop.selectedRows[i]].length; j++) {//me recorro las filas que hay en la pagina
							if (mnt.prop.selectedRows[mnt.prop.selectedRows[i]][j] === "id_" + id) {
								return cont;
							} else {// si no es el que buscamos sumamos el contador
								cont += 1;
							}
						}
					} else { //si no es la pagina sumamos todas sus filas
						cont +=  mnt.prop.selectedRows[mnt.prop.selectedRows[i]].length;
					}
				}
			}
			return this.each(function () {	
				//$(document).unbind("mousedown");
				var mant = this, id = null,/*, dataRow = mant.prop.detailForm.serializeObject()*/
				dt, parent, parentColPks, parentSelectedRow, parentPKObject = {}, aux, rowValues;
				if (mant.prop.jQueryGrid.rup_grid("isEditable")) {
					
					if (rowId==null){
						rowId=mant.prop.jQueryGrid.rup_grid("getSelectedRows")[0];
					}
					
					dt = form2object(mant.prop.jQueryGrid.rup_grid("getInd",rowId,true),null,false);
				} else {
					dt = form2object(mant.prop.detailForm[0]);
				}
				if (dt.JPA_ID instanceof Object) {//si estamos en modo jpa le añadimos el id para poder enviar
					dt["id"] = dt.JPA_ID;
					delete dt.JPA_ID;
				}
				if (mant.prop.parent !== null) {//si tengo padre hay que añadir el valor de la pk del padre
					parent = $("#" + mant.prop.parent);
					parentColPks = parent.rup_maint("getPrimaryKey").split(";");
					parentSelectedRow = parent[0].prop.jQueryGrid.rup_grid("getSelectedRows")[0];
					if (parentColPks.length > 1) {//clave compuesta
						for (var i = 0; i < parentColPks.length; i++) {
							parentPKObject[parent[0].prop.modelObject.toLowerCase()][parentColPks[i]]  = parent[0].prop.jQueryGrid.rup_grid("getCol", parentSelectedRow, parentColPks[i]);
						}
					} else {//clave simple
						parentPKObject[parent[0].prop.modelObject.toLowerCase()] = {};
						parentPKObject[parent[0].prop.modelObject.toLowerCase()][parentColPks[0]] = parent[0].prop.jQueryGrid.rup_grid("getCol", parentSelectedRow, parentColPks[0]);
					}
					$.extend(true, dt, parentPKObject);//mergeamos los dos objectos, solo se sobreesciben las propiedades que tenga el primero y el segundo iguales con el valor del segundo
				}
				var init = eval("("+$(mant).data('initialData')+")");
				//if ($.toJSON(this.prop.jQueryGrid.rup_grid("getEditingRowData", this.prop.lastsel)) === mnt.data('initialData')) {//si no ha habido cambios entre lo almacenado en initialData con los datos del grid
				//dt !== $(mant).data('initialData')
				if ((mant.prop.jQueryGrid.rup_grid("isEditable") && !$.rup_utils.compareObjects(init,dt)) 
						|| ( mant.prop.detailForm && mant.prop.detailForm.serialize() !== mant.prop.detailForm.data('initialData'))) {
					dt = $.toJSON(dt);
					var errores = false;
					var res = $.rup_ajax({					
						url: mant.prop.jQueryGrid[0].rup_gridProps.url,
						dataType: 'json',
						type: (mant.prop.MODO === 'new' ? "POST" : "PUT"),
						async: false,
						data: dt,	
						contentType: 'application/json',		    
						success: function (xhr, ajaxOptions) {
							// Obtenemos un json desanidado para evitar los problemas al utilizar la notacion dot
							var jsonxhr = $.rup_utils.unnestjson(xhr);
							// Cerramos los feedbacks
							mant.prop.feedback.rup_feedback("close");
							// Comienza la gestion especifica dependiendo del tipo de mantenimiento
							if (mant.prop.jQueryGrid.rup_grid("isEditable")) {
								// Gestion de controles de la botonera
								mant.prop.toolbar.disableButton("cancel");
								mant.prop.toolbar.enableButton("new");
								// Se realiza el guardado de los datos en el grid.
								mant.prop.jQueryGrid.rup_grid("saveRow", mant.prop.lastsel, rup_maint.saveEditableSucces, "clientArray", null, null, rup_maint.saveEditableError, null);
								if (mant.prop.showMessages) {
									if (mant.prop.MODO === 'new') { //Mostrar los mensajes dependiendo el modo
										mant.prop.feedback.rup_feedback("set", $.rup.i18n.base.rup_maint.insertOK, "ok");
									} else {
										mant.prop.feedback.rup_feedback("set", $.rup.i18n.base.rup_maint.modifyOK, "ok");
									}
								}
								// Se elimina el contenido de initialDatad debido a que el guardado ha sido corecto
								$(mant).data('initialData',null);	
								
							} else {//si no es editable
								
								// En el caso de que el formulario tenga campos rup, se anadiran al json valores necesarios para actualizar los mostrados en las columnas del grid.
								$(mant).rup_maint("appendRupFieldsData", jsonxhr);
								
								if (saveAndRepeat) { //si es guardar y repetir
									if (mant.prop.showMessages) {
										if (mant.prop.MODO === 'new') { //Mostrar los mensajes dependiendo el modo
											$(mant).rup_maint("resetForm", mant.prop.detailForm);
											mant.prop.detailFeedback.rup_feedback("set", $.rup.i18n.base.rup_maint.insertOK, "ok");
										} else {
											mant.prop.detailFeedback.rup_feedback("set", $.rup.i18n.base.rup_maint.modifyOK, "ok");
										}
									}
									//reiniciamos el gestor de cambios
									mant.prop.detailForm.data('initialData', mant.prop.detailForm.serialize());
								} else {
									$(mant).rup_maint("resetForm", mant.prop.detailForm);
									if (mant.prop.showMessages) {
										if (mant.prop.MODO === 'new') { //Mostrar los mensajes dependiendo el modo
											mant.prop.feedback.rup_feedback("set", $.rup.i18n.base.rup_maint.insertOK, "ok");
										} else {
											mant.prop.feedback.rup_feedback("set", $.rup.i18n.base.rup_maint.modifyOK, "ok");
										}
									}
									mant.prop.detailDiv.rup_dialog("close");
								}
								//Dependiendo del modo en el que este el mantenimiento hay que añadir una nueva fila o actualizar la seleccionada
								if (mant.prop.MODO === "new") {
									var ids = mant.prop.jQueryGrid.rup_grid("getDataIDs"),
									rowN = Math.max.apply(Math,ids) + 1;
									mant.prop.jQueryGrid.rup_grid("addRowData", rowN, jsonxhr, "first");
									if (!mant.prop.jQueryGrid.rup_grid("isMultiselect")) {
										mant.prop.jQueryGrid.rup_grid("setSelection", rowN, true);
										mant.prop.toolbar.enableButton("edit");
										mant.prop.toolbar.enableButton("delete");
									}
									
								}else{
									if (mant.prop.jQueryGrid.rup_grid("isMultiselect")) {
										var aCurrentRow = mant.prop.currentSelectedRow.split(";");//su forma es "p_1;id_2"
										// mant.prop.jQueryGrid.rup_grid("setRowData", $.inArray(aCurrentRow[1],mant.prop.selectedRows[aCurrentRow[0]])/*getRowidFromPk(p, id)*/, xhr);
										mant.prop.jQueryGrid.rup_grid("setRowData", aCurrentRow[1].split("id_")[1], jsonxhr);
									} else {
										mant.prop.jQueryGrid.rup_grid("setRowData", mant.prop.jQueryGrid.rup_grid("getSelectedRows")[0], jsonxhr);
									}
								}
							}
							
							
							// Se ejecuta el callback aftersavefunc
							if (aftersavefunc){
								aftersavefunc.call();
							}
							return false;
						},
						error: function (xhr, ajaxOptions, thrownError) {
							
							var errorTXT = $.rup.i18n.base.rup_maint.validateError, errors = null, errorKey = null, 
							causedErrors = null, errMsg = "", errorMesg = "", preMode, feedback;
							
							if (!mant.prop.jQueryGrid.rup_grid("isEditable")) {
								$("#" + mant.prop.detailDiv[0].id + " img.rup-maint_validateIcon").remove();
							}else{
								//establecemos el valor del gestor de cambios por si le dan a cancelar despues de dar un error
								$(mant).data('initialData',null);
							}
							
							if (xhr.responseText !== null && xhr.responseText !== "") {	
								if (xhr.status === 406) {//si ha habido algun error en las validaciones...
									// Se muestran los errores en los campos, de acuerdo al resultado de la validacion de los campos
									$(mant).rup_maint("showFieldValidationErrors",xhr);
								} 
							}
							
							// Se ejecuta el callback aftererrorfunc
							if(aftererrorfunc){
								aftererrorfunc.call();
							}
							
							return false;
						},
						beforeSend: function (xhr) {
							xhr.setRequestHeader("validation", "true");
							xhr.setRequestHeader("bean", mant.prop.modelObject);
						}
					});
					return errores;
				} else {//si no se lanza la peticion es porque no ha habido cambios con lo que hay que reiniciar el initialData a null
					if (mant.prop.jQueryGrid.rup_grid("isEditable") && dt === $(mant).data('initialData')){
						$(mant).data('initialData', null);
					}
					
					if (!mant.prop.jQueryGrid.rup_grid("isEditable")) {//Si el mantenimiento no es editable cerramos la ventana modal y reinicimos el valor initialData
						if (!saveAndRepeat) {//si es guardar solo se cierra la ventana modal
							if (!mant.prop.detailFeedback.is(':visible')) {//si hay algun error no hago nada
								mant.prop.detailDiv.rup_dialog("close");
//								mant.prop.detailForm.data('initialData', null);
							}
						} else {//si se le da a guardar y repetir
							if (!mant.prop.detailFeedback.is(':visible')) {//si hay algun error no hago nada
								mant.prop.detailFeedback.rup_feedback("option", "delay", null);
								mant.prop.detailFeedback.rup_feedback("set", $.rup.i18n.base.rup_maint.emptyChanges, "alert");
								mant.prop.detailFeedback.rup_feedback("option", "delay", 1000);
							}
						}
						
					}else if (mant.prop.MODO === "new"){ // Si el mantenimiento es editable y estamos en modo de inserción
						mant.prop.jQueryGrid.rup_grid("delRowData",mant.prop.lastsel);
//						mant.prop.jQueryGrid.rup_grid("delRowData",mant.prop.jQueryGrid.rup_grid("getGridParam",'selrow'));
					}else{
						mant.prop.jQueryGrid.rup_grid("restoreRow", mant.prop.lastsel);
					}
					$(mant).data('initialData', null);

					// Se ejecuta el callback aftersavefunc
					if (aftersavefunc){
						aftersavefunc.call();
					}
				}
			});
		},
		getPrimaryKey : function () {//obtiene la clave primaria del mantenimiento
			return this[0].prop.primaryKey;
		},
		toggleSearchForm : function (capa) {//Apertura/Cierre del formulario de busqueda
			return this.each(function () {
				if (this.prop.searchForm === null) {//si no hay formulario de busqueda no hacemos nada
					return false;
				} else {
					
					var searchString = "", temp = "", aux, i;
					if ($("#" + capa).is(":hidden")) {
						$("#" + capa+" div").slideDown("slow");
						$("#" + capa).show("slow");
						$('#titleSearch_' + this.prop.name).text($.rup.i18n.base.rup_maint.searchOptions);
						
						// Anadido el foco al primer campo del formulario
						$("input:first",this.prop.searchForm).focus();
					} else {
						$("#" + capa+" div").slideUp("slow");
						$("#" + capa).hide("slow");
						aux = this.prop.searchForm.serializeArray();
						for (i = 0; i < aux.length; i++) {
							if (aux[i].value !== "") {
								searchString = searchString + $("#" + this.prop.searchForm.attr("id") + " [name=" + aux[i].name + "]").parent().find('div').html() + " = " + aux[i].value + " ";
							}
						}
						//searchString = " " + $("#" + this.prop.searchForm[0].id + " :input[value]").serialize().replace(/&/g, " "); 
						if (searchString.length > 1024) {
							temp = searchString.substring(0, 1024);
							temp += "...";
						}
						$('#titleSearch_' + this.prop.name).append("<i>" + searchString + "</i>");
					}
					this.prop.toolbar.tooglePressButton("filter","rup-maint_filter_pressed");
				}
			});
		},
		search : function (page) {//Lanza la busqueda del mantenimiento obteniendo los datos del formulario de busqueda
			return this.each(function () {
				//cerrar el feedback del los mensajes
				this.prop.feedback.rup_feedback("close");
				//IMPORTANTE:::para que no haya probelams con los mant mestro detalle ya que sino no se lanzaban el gridcomplete del primero y no se quitaban lo de no regitros y no aparecia lo de la paginacion

				// Se elimina la seleccion de elementos en el caso de un mantenimiento de multiseleccion
				if (this.prop.jQueryGrid.rup_grid("isMultiselect")) {
					this.prop.jQueryGrid.rup_grid("resetSelection");
					$.data(this.prop.jQueryGrid[0] , "allSelected", null);
					$.data(this.prop.jQueryGrid[0], "deSelectedPages",[]);
				}
				
				this.prop.jQueryGrid[0].p.ajaxGridOptions = {async: false};
				this.prop.jQueryGrid.rup_grid("setGridParam", {url: this.prop.jQueryGrid[0].rup_gridProps.url, datatype: 'json', mtype: "GET", page: (page ? page : "rup")});
				this.prop.jQueryGrid.rup_grid("reloadGrid");
			});
		},
		toggleGrid : function () {//oculta o muestra el grid de resultados junto con la paginación 
			return this.each(function () {
				if ($('#gbox_' + this.prop.jQueryGrid[0].id).is(":hidden")) {
					$('#gbox_' + this.prop.jQueryGrid[0].id).slideDown("fast");
				} else {
					$('#gbox_' + this.prop.jQueryGrid[0].id).slideUp("fast");
				}
			});
		},
		cleanSearchForm : function () {//Limpia el formulario de búsqueda y dependiendo la propiedad del mantenimiento loadOnStartUp relanzará la carga del grid o la limpieza del mismo.
			return this.each(function () {
				$(this).rup_maint("resetForm", this.prop.searchForm);
				if (this.prop.jQueryGrid[0].rup_gridProps.loadOnStartUp) {//si el grid se carga al arrancar la ventana cuando se limpia el formulario se debe vovler a lanzar la carga del grid sino se borran los datos y listo
					//Hay que vovler a establecer la URL incial para que no relance la busqueda con el querystring incorrecto
					this.prop.jQueryGrid.rup_grid("setGridParam", {url: this.prop.jQueryGrid[0].rup_gridProps.url, page: "rup"});
					// Se elimina la seleccion de elementos en el caso de un mantenimiento de multiseleccion
					if (this.prop.jQueryGrid.rup_grid("isMultiselect")) {
						this.prop.jQueryGrid.rup_grid("resetSelection");
						$.data(this.prop.jQueryGrid[0] , "allSelected", null);
						$.data(this.prop.jQueryGrid[0], "deSelectedPages",[]);
					}
					
					this.prop.jQueryGrid.rup_grid("reloadGrid");
				} else {
					if (this.prop.jQueryGrid.rup_grid("getDataIDs").length > 0) {				
						this.prop.jQueryGrid.rup_grid("clearGridData");
					}
				}
			});
		},
		getMode : function () {// Devuelve el modo (edit o new) en el que se encuentra el formulario
			return this[0].prop.MODO;
		},
		isEditing : function () {// Devuelve true o false dependiendo si estamos en modo edición o no
			return (this[0].prop.MODO==='edit' ? true : false);
		},
		isAdding : function () {// Devuelve true o false dependiendo si estamos en modo insercion o no
			return (this[0].prop.MODO==='new' ? true : false);
		}
	});
	//Métodos privados 
	$.fn.rup_maint("extend",{
		addChild : function (maintName) {//Se añaden los hijos al padre
				var aChildren = [];
				if (this.data("_children") !== null && this.data("_children") !== undefined) {
					aChildren = this.data("_children");
				}
				aChildren.push(maintName);
				this.data("_children", aChildren);
		},
		showFieldValidationErrors: function(xhr){
			return this.each(function () {	
				var mant=this, errorTXT = $.rup.i18n.base.rup_maint.validateError, errors = null, errorKey = null, detailFormName,
				errors = eval("(" + xhr.responseText + ")");
				if (errors.length === 2) {//comprobamos que tenemos 2 elementos el primero es el modelObject que a causado el error y el segundo es el objecto con los errores que ha causado
					causedErrors = eval("(" + errors[1] + ")");
					errorTXT = errorTXT + "<ul class='rup-maint_feedbackUL'>";
					
					$.each(causedErrors, function (key, value) {
	
						// TODO: Solucion general al problema de notacion dot y los id de los campos del formulario
						if (!mant.prop.jQueryGrid.rup_grid("isEditable")) {
							detailFormName = mant.prop.detailForm.attr("id");
							// Si el mantenimiento no es editable obtenemos el literal del campo a partir del label asociado
							if ($("[name='" + key+"']",mant.prop.detailForm).parent().find("label").length === 1) { //intenetamos acceder al label asociado al campo a ha fallado a la hora de la validación para obtener su texto
								errorKey = $("[name='" + key+"']",mant.prop.detailForm).parent().find("label").text();
							} else {
								if (mant.prop.rupCheckStyle) {
									$.rup.msgAlert({message: $.rup.i18n.base.rup_global.rupCheckStyleError});
								}
								errorKey = key;
							}
						}else{
							// Si el mantenimiento es editable obtenemos el nombre del campo a partir del literal de la columna
							var colModel = mant.prop.jQueryGrid.rup_grid("getColModel");
							var colNames = mant.prop.jQueryGrid.rup_grid("getGridParam","colNames");
							var encontrado = false;
							for (var i=0;i<colModel.length && !encontrado;i=i+1){
								if (colModel[i].name==key){
									errorKey = colNames[i];
									encontrado=true;
								}
							}
							if (!encontrado){
								errorKey = key;
							}
						}
						errorTXT = errorTXT + "<li><b>" + errorKey + ":</b><ul>";
						errMsg = "";
						for (var i = 0; i < value.length ; i++) {
							$.each(value[i], function (annotation, errorMesg) {
									errorTXT = errorTXT  + "<li>" + errorMesg + "</li>";
									errMsg = errMsg + errorMesg + ", ";
								});
						}
						//si existe el icono no se lo añadimos otra vez
						if ($("#" + key).parent().find(".rup-maint_validateIcon").length === 0) {
							$("#" + key).parent().append("<img class='rup-maint_validateIcon' title='" + errMsg + "' src='" + mant.prop.imgPath + "/exclamation.png'>");
						}
						errorTXT = errorTXT + "</ul>";
					});
					errorTXT = errorTXT + "</ul>";
					
					if (mant.prop.jQueryGrid.rup_grid("isEditable")) {
						mant.prop.feedback.rup_feedback("option", "delay", null);
						mant.prop.feedback.rup_feedback("set", errorTXT, "error");
						if (mant.prop.MODO === "new") {
							preMode = "new";
						}

						mant.prop.feedback.rup_feedback("option", "delay", 1000);
						
						if (preMode === "new") {
							mant.prop.MODO = "new";
						}
					} else {
						mant.prop.detailFeedback.rup_feedback("option", "delay", null);
						mant.prop.detailFeedback.rup_feedback("set", errorTXT, "error");
						mant.prop.detailFeedback.rup_feedback("option", "delay", 1000);
					}
				}
			});
		},
		appendRupFieldsData: function(jsonObj){
			return this.each(function () {
				
				var mant=this, colModel, id, label;
				
				colModel = mant.prop.jQueryGrid.rup_grid("getColModel");
				for (var i=0;i<colModel.length ;i=i+1){
					if (colModel[i].rupType==='combo'){
						if (typeof colModel[i].editoptions.source === 'string' && colModel[i].editoptions.sourceParam.label){
							id = colModel[i].name;
							label;
							if(id.indexOf('.')!==-1){
								label=id.substring(0,id.lastIndexOf('.'));
							}
							label+="."+colModel[i].editoptions.sourceParam.label;
							id='detailForm_' + mant.prop.name + '_'+id.replace(/[.]/g,'_');
							jsonObj[label]=$('#'+id,mant.prop.detailForm[0]).rup_combo("label");		
						}
					}
				}
				return this;
				
			});
		}
	
	});

	$.fn.rup_maint("extend", {
		_init : function(properties) {
			
			//RUP custom formatter for jqGrid
			$.fn.fmatter.rup_combo = function (cellval, opts, rwd, act) {
				
				var source = opts.colModel.editoptions.source,
					i18n = "", entidad;
				if (typeof source === "string"){
					
					if (opts.colModel.jsonmap){
						entidad = opts.colModel.jsonmap;
					}else{
						entidad = opts.colModel.name;
					}
					
					if(entidad.indexOf('.')!==-1){
						entidad=entidad.substring(0,entidad.lastIndexOf('.'));
					}
					
					// Se trata de obtener el valor accediendo por notacion array rwd['entidad.propiedad']
					var valRwd=rwd[entidad + '.' + opts.colModel.editoptions.sourceParam.label];
					if (valRwd!==undefined){
						return valRwd;
					}
					
					// Se trata de obtener el valor accediendo por notacion json rwd.entidad.propiedad
					return eval('rwd.'+entidad+'.'+opts.colModel.editoptions.sourceParam.label);
				}else{
					$.each(source, function (index, element){
						if (element.value === cellval){
							if(opts.colModel.editoptions.i18nId === undefined){
								i18n = $.rup.i18nParse($.rup.i18n.app[opts.gid+"##"+opts.colModel.name],element.i18nCaption);
							} else {
								i18n = $.rup.i18nParse($.rup.i18n.app[opts.colModel.editoptions.i18nId],element.i18nCaption);
							}
							return false;
						}
					});
					return i18n;
				}
			};
			
			$.fn.fmatter.rup_time = function (cellval, opts, rwd, act) {
				if (!cellval){
					return "";
				}
				var op = opts.colModel.formatoptions, dateFormatterOps = $.rup.i18n.base.rup_grid.formatter.date;
				return $.fmatter.util.DateFormat(op.newformat,cellval,op.newformat,dateFormatterOps);
				
			};
			
			
//			$.fn.fmatter.rup_combo.unformat= function (cellvalue, opts, rwd, act){
//				var valor;
//				$.each($.rup.i18n.app[opts.colModel.editoptions.i18nId], function(i,elem){
//					if (elem===cellvalue){
//						valor =i;
//					}
//				});
//				return valor;
//			};
			
			//return this.each(function () {
			var t = this, btSearch, lnkClean, btDiv, self, settings = {};
			self = this;
			function addValidation(detailForm) {//añade las validaciones a todos los elementos con class validableElem 
				$(".validableElem" , detailForm).die("change");
				$(".validableElem", detailForm).live("change", function () {
					var data = [], elem = this;
					data.push({name: "property", value: this.name});
					data.push({name: "bean", value: t[0].prop.modelObject});
					data.push({name: "value", value: $(this).val()});
					$.rup_ajax({
						url: '../validate',
						dataType: 'json',
						type: "POST",
						data: data,
						contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
						success: function (xhr, ajaxOptions) {
							
							var campos = $("#" + t[0].prop.detailDiv[0].id + " .rup-maint_validateIcon").parent().find("#shipmentinfo");
								
							if (campos.length!=0){
								campos.parent().find("img.rup-maint_validateIcon").remove();
							}
							
							elem = null;
							t[0].prop.detailFeedback.rup_feedback("close");
						},
						error: function (xhr, ajaxOptions, thrownError) {
							var errorTXT = $.rup.i18n.base.rup_maint.validateError, errors = null, errorKey = null, causedErrors = null, errMsg = "", errorMesg = "";
							if (xhr.responseText !== null && xhr.responseText !== "") {	
								if (xhr.status === 406) {//si ha habido algun error en las validaciones...
									// TODO: comprobar que funciona
									$(t[0]).rup_maint("showFieldValidationErrors",xhr);
								} else {
									t[0].prop.detailFeedback.rup_feedback("option", "delay", null);
									t[0].prop.detailFeedback.rup_feedback("set", errorTXT, "error");								
									t[0].prop.detailFeedback.rup_feedback("option", "delay", 1000);
								}
							}
						}
					});
				});
			}
			function createData(detailDiv,detaiBody) {//Se crea el formulario de detalle haciendo uso del colModel del grid
				var dtForm = $("<form>").attr('id', 'detailForm_' + settings.name),
				obj = settings.jQueryGrid[0], nm, trdata, dc, elc, frmopt;
				detaiBody.append(dtForm);
				detailDiv.append(detaiBody);
				$("#"+settings.name).append(detailDiv);
				$(obj.p.colModel).each(function (i) {
						dc='';
						nm = this.name;
						if (nm !== 'cb' && this.editable === true) {
							var opt = $.extend({}, this.editoptions || {}, {id: nm, name: nm});
							if (!this.edittype) { 
								this.edittype = "text"; 
							} else if (this.edittype === "hidden"){
								this.edittype = "text";
								dc = "display:none";								
							}
							
							// Se anyade el sufijo al identificador del control para evitar problemas de referenciar a varios controles con el mismo identificador en la misma pagina
							opt.id='detailForm_' + settings.name + '_'+opt.id.replace(/[.]/g,'_');
							elc = $.jgrid.createEl(this.edittype, opt, "", false, $.extend({}, $.jgrid.ajaxOptions, obj.p.ajaxSelectOptions || {}));

							$(elc).attr('class', 'formulario_linea_input');
							
							if (settings.validationMode === "individual" && this.editRules && this.editRules.validate) {//si el modo de validación es individual y el campo es validable
								$(elc).addClass("validableElem");
							}
							trdata = $("<div>").attr("id", "rup-maint_detailInput_" + elc.id).addClass("floating_left_pad_right").append("<p>").html("<label for='" + elc.id + "' >" + (typeof this.label === 'undefined' ? obj.p.colNames[i]: this.label) + "</label>").append("<br>").append(elc).appendTo(dtForm);
							if (dc !== "") {
								trdata.attr("style", dc);
							}
							//creación del tipo de control en  el formulario de detalle
//							switch (this.rupType) {
//							case "datepicker":
//								$(elc).rup_date(this.editoptions);
//								$(elc).addClass("datepicker");
//								break;
//							case "numeric":
//								$(elc).numeric(",");
//								$(elc).addClass("numeric");
//								break;
//							case "integer":
//								$(elc).numeric(false);
//								$(elc).addClass("integer");
//								break;
//							case "combo":
//								if(this.editoptions.i18nId === undefined){
//									this.editoptions.i18nId = settings.jQueryGrid.selector.substring(1) + "##" + this.name;
//								}
//								$(elc).rup_combo(this.editoptions);
//								break;
//							}
							if (this.rupType){
								if (this.rupType==="numeric"){
									$(elc).numeric(",");
									$(elc).addClass("numeric");
								}else if (this.rupType==="integer"){
									$(elc).numeric(false);
									$(elc).addClass("integer");
								}else if (this.rupType==="datepicker"){
									$(elc).rup_date(this.editoptions);
									$(elc).addClass("datepicker");
								}else{
									if(this.editoptions.i18nId === undefined){
										this.editoptions.i18nId = settings.jQueryGrid.selector.substring(1) + "##" + this.name;
									}
									$(elc)["rup_"+this.rupType](this.editoptions);
								}
							}
							
						}					
					});
				return dtForm;
			}
			//Paginar al ultimo elemento del grid o de los seleccionados y es multiselección
			function plast(e) {
				var numPag = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'lastpage'), page = null, gsr = 0, deSelectedPages;
				t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
				t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
				
				//En el caso de que sea multiseleccion
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					
					// Si se han seleccionado todos los elementos
					if ($.data(t[0].prop.jQueryGrid[0] , "allSelected")){
						// Comprobamos a partir de la ultima pagina si existen dentro del array de paginas deseleccionadas
						deSelectedPages=$.data(t[0].prop.jQueryGrid[0], "deSelectedPages");
						for (var i=Number(numPag);i>0;i=i-1){
							if($.inArray(i.toString(),$.data(t[0].prop.jQueryGrid[0], "deSelectedPages"))===-1){
								// En el caso de que la pagina no se haya deseleccionado
								if ($.isArray(t[0].prop.selectedRows["p_"+i])){
									// En este caso se debera de paginar a la pagina siguiente almacenada en el array de seleccionados
									numPag=i;
									newPage="p_"+numPag;
									gsr = t[0].prop.selectedRows[newPage][t[0].prop.selectedRows[newPage].length-1].substring(3, t[0].prop.selectedRows[newPage][t[0].prop.selectedRows[newPage].length-1].length);
									t[0].prop.currentSelectedRow = "p_" + numPag + ";" + "id_" + gsr;
									break;
								}else{
									numPag=i;
									t[0].prop.currentSelectedRow=null;
									$.data(t[0].prop.jQueryGrid[0], "detailPagAction",'last');
									break;
								}
							}
						}
					}else{
						page = t[0].prop.selectedRows[t[0].prop.selectedRows.length - 1];
						numPag = page.substring(2, page.length);
						gsr = t[0].prop.selectedRows[page][t[0].prop.selectedRows[page].length - 1];
						t[0].prop.currentSelectedRow = page + ";" + gsr;
						gsr = gsr.substring(3, gsr.length);
					}
				} 
				
				t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: numPag});
				t[0].prop.jQueryGrid.rup_grid("reloadGrid");	
				$.data(t[0].prop.jQueryGrid[0], "detailPagAction",'');
				
				//En el caso de no existir un valor conocido para gsr se le asigna el identificador del elemento seleccionado actual
				if ((!gsr || gsr===-1) && typeof t[0].prop.currentSelectedRow ==='string') {
					gsr = t[0].prop.currentSelectedRow.split(";")[1].substring(3);
				}
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					// Se realiza la edicion del elemento
					t.rup_maint("editElement", gsr);
				}
				
			}
			//Paginar al primer registro del grid o al primer registro seleccionado
			function pfirst(e) {
				var numPag = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'lastpage'), page = null, gsr = 0;
				t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
				t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					
					// Si se han seleccionado todos los elementos
					if ($.data(t[0].prop.jQueryGrid[0] , "allSelected")){
						// Comprobamos a partir de la primera pagina si existen dentro del array de paginas deseleccionadas
						deSelectedPages=$.data(t[0].prop.jQueryGrid[0], "deSelectedPages");
						for (var i=1;i<numPag;i=i+1){
							if($.inArray(i.toString(),$.data(t[0].prop.jQueryGrid[0], "deSelectedPages"))===-1){
								// En el caso de que la pagina no se haya deseleccionado
								if ($.isArray(t[0].prop.selectedRows["p_"+i])){
									// En este caso se debera de paginar a la pagina siguiente almacenada en el array de seleccionados
									numPag=i;
									newPage="p_"+numPag;
									gsr = t[0].prop.selectedRows[newPage][0].substring(3, t[0].prop.selectedRows[newPage][0].length);
									t[0].prop.currentSelectedRow = "p_" + numPag + ";" + "id_" + gsr;
									break;
								}else{
									numPag=i;
									t[0].prop.currentSelectedRow=null;
									break;
								}
							}
						}
					}else{
						page = t[0].prop.selectedRows[0];
						numPag = page.substring(2, page.length);
						gsr = t[0].prop.selectedRows[page][0];
						t[0].prop.currentSelectedRow = page + ";" + gsr;
						gsr = gsr.substring(3, gsr.length);
					}
				} else {					
					numPag = 1;  
				}
				t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: numPag});
				t[0].prop.jQueryGrid.rup_grid("reloadGrid");
				
				//En el caso de no existir un valor conocido para gsr se le asigna el identificador del elemento seleccionado actual
				if ((!gsr || gsr===-1) && typeof t[0].prop.currentSelectedRow ==='string') {
					gsr = t[0].prop.currentSelectedRow.split(";")[1].substring(3);
				}
				
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					// Se realiza la edicion del elemento
					t.rup_maint("editElement", gsr);
				}
				
			}
			//Paginar hacia adelante en el grid ya sea por los seleccionados o por todos
			function pforward(e) {
				var reg = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'selrow'), 
					gsr = -1, last = false, numPag, page = t[0].prop.jQueryGrid.getGridParam('page'), lastpage=Number(t[0].prop.jQueryGrid.getGridParam('lastpage')),
					p = null, id = null, pos, newPage, intNewPage, reloadNewPage=false;
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					p = t[0].prop.currentSelectedRow.split(";")[0];
					id = t[0].prop.currentSelectedRow.split(";")[1];
					// Obtenemos el indice en el que se encuentra el registro dentro del array de paginas
					pos=$.inArray(id,t[0].prop.selectedRows[p]);
					// Comprobamos si en la pagina actual existe un registro posterior
					if (t[0].prop.selectedRows[p][pos + 1]){
						// En caso de existir recuperamos su identificador para mostrarlo en el formulario de edicion
						gsr = t[0].prop.selectedRows[p][pos + 1].substring(3, t[0].prop.selectedRows[p][pos + 1].length);//obtneo el id a seleccionar
						t[0].prop.currentSelectedRow = "p_" + page + ";" + "id_" + gsr;
					}else{
						// En este caso debemos de encontrar la pagina posterior valida de la que se debe de editar el registro
						var deSelectedPages=$.data(t[0].prop.jQueryGrid[0], "deSelectedPages");
						// Recorremos las paginas a partir de la actual 
						for (var i=Number(page)+1;i<lastpage;i=i+1){
							if((deSelectedPages && $.inArray(i.toString(),deSelectedPages)===-1) && !$.isArray(t[0].prop.selectedRows["p_"+i]) && $.data(t[0].prop.jQueryGrid[0] , "allSelected")){
								/* Si la pagina actual cumple lo siguiente
								 * - No ha sido deseleccionada
								 * - No existe en el array de elementos seleccionados
								 * - Se han seleccionado todos los registros de la tabla
								 * Se marca el indice actual como la pagina a la que se debe paginar 
								 */
								intNewPage=i;
								// Se inicializa a null la variable de elemento seleccionado actual ya que lo desconocemos
								t[0].prop.currentSelectedRow=null;
								break;
							}else{
								// En este caso se debera de paginar a la pagina siguiente almacenada en el array de seleccionados
								if ($.isArray(t[0].prop.selectedRows["p_"+i])){
									intNewPage=i;
									newPage="p_"+intNewPage;
									gsr = t[0].prop.selectedRows[newPage][0].substring(3, t[0].prop.selectedRows[newPage][0].length);
									t[0].prop.currentSelectedRow = "p_" + intNewPage + ";" + "id_" + gsr;
									break;
								}
							}
						}
						reloadNewPage=true;
					}
				}else{				
					// En caso de no ser multiselect
					pos=$.inArray(reg,t[0].prop.jQueryGrid.rup_grid("getDataIDs"));
					// Se comprueba que en la pagina actual existe un elemento al que podamos avanzar
					if (pos+1!==t[0].prop.jQueryGrid.rup_grid("getDataIDs").length){
						gsr = t[0].prop.jQueryGrid.rup_grid("getDataIDs")[pos + 1];
					}else{
						// En caso de no existir se paginara a la pag siguiente y se editara el primer elemento
						numPag = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'lastpage');//Math.ceil(settings.jQueryGrid.rup_grid("getGridParam", 'records') / settings.jQueryGrid.rup_grid("getGridParam", 'rowNum'));
						if (parseFloat(page) + 1 <= numPag) {
							reloadNewPage=true;
							intNewPage=parseFloat(page) + 1;
						}
					}
					t[0].prop.jQueryGrid.rup_grid("setSelection", gsr);
				}
				
				// En caso de ser necesario realizar una paginacion se realiza
				if (reloadNewPage){
					t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
					t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
					t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: intNewPage});
					t[0].prop.jQueryGrid.rup_grid("reloadGrid");
				}
				// Se resetea el formulario de edicion
				$(t[0]).rup_maint("resetForm", t[0].prop.detailForm);
				//En el caso de no existir un valor conocido para gsr se le asigna el identificador del elemento seleccionado actual
				if ((!gsr || gsr===-1) && typeof t[0].prop.currentSelectedRow ==='string') {
					gsr = t[0].prop.currentSelectedRow.split(";")[1].substring(3);
				}
				// Se realiza la edicion del elemento
				t.rup_maint("editElement", gsr);
			}
			//paginación hacia atras en el detalle ya sea por los seleccionados o por todos los registros
			function pback(e) { 
				var reg = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'selrow'), 
					encontrado = false, gsr = 0, first = false, mant = null, page = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'page'),
					p = null, id = null, lastElement = null, reloadNewPage=false,intNewPage, previousPage = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'page'); //se inicializa el gsr a 0 pq en este caso se pagina hacia atras y el primer elemento es el 0
				//Tratamiento de la multiselección
				
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					p = t[0].prop.currentSelectedRow.split(";")[0];
					id = t[0].prop.currentSelectedRow.split(";")[1];
					// Obtenemos el indice en el que se encuentra el registro dentro del array de paginas
					pos=$.inArray(id,t[0].prop.selectedRows[p]);
					// Comprobamos si en la pagina actual existe un registro anterior
					if (t[0].prop.selectedRows[p][pos-1]){
						// En caso de existir recuperamos su identificador para mostrarlo en el formulario de edicion
						gsr = t[0].prop.selectedRows[p][pos - 1].substring(3, t[0].prop.selectedRows[p][pos -1].length);//obtneo el id a seleccionar
						t[0].prop.currentSelectedRow = "p_" + page + ";" + "id_" + gsr;
					}else{
						
						// En este caso debemos de encontrar la pagina anterior valida de la que se debe de editar el registro
						var deSelectedPages=$.data(t[0].prop.jQueryGrid[0], "deSelectedPages");
						// Recorremos las paginas a partir de la actual en sentido inverso
						for (var i=Number(page)-1;i>=0;i=i-1){
							if((deSelectedPages && $.inArray(i.toString(),deSelectedPages)===-1) && !$.isArray(t[0].prop.selectedRows["p_"+i]) && $.data(t[0].prop.jQueryGrid[0] , "allSelected")){
								/* Si la pagina actual cumple lo siguiente
								 * - No ha sido deseleccionada
								 * - No existe en el array de elementos seleccionados
								 * - Se han seleccionado todos los registros de la tabla
								 * Se marca el indice actual como la pagina a la que se debe paginar 
								 */
								intNewPage=i;
								// Se inicializa a null la variable de elemento seleccionado actual ya que lo desconocemos
								t[0].prop.currentSelectedRow=null;
								$.data(t[0].prop.jQueryGrid[0], "detailPagAction",'back');
								break;
							}else{
								// En este caso se debera de paginar a la pagina siguiente almacenada en el array de seleccionados
								if ($.isArray(t[0].prop.selectedRows["p_"+i])){
									intNewPage=i;
									newPage="p_"+intNewPage;
									gsr = t[0].prop.selectedRows[newPage][t[0].prop.selectedRows[newPage].length-1].substring(3, t[0].prop.selectedRows[newPage][t[0].prop.selectedRows[newPage].length-1].length);
									t[0].prop.currentSelectedRow = "p_" + intNewPage + ";" + "id_" + gsr;
									break;
								}
							}
						}
						reloadNewPage=true;
					}
				} else { 
					// En caso de no ser multiselect
					pos=$.inArray(reg,t[0].prop.jQueryGrid.rup_grid("getDataIDs"));
					// Se comprueba que en la pagina actual existe un elemento al que podamos retroceder
					if (pos-1!==-1){
						gsr = t[0].prop.jQueryGrid.rup_grid("getDataIDs")[pos - 1];
					}else{
						// En caso de no existir se paginara a la pag anterior y se editara el primer elemento
						if (parseFloat(page) !== 1) {
							intNewPage=parseFloat(page) - 1;
							reloadNewPage=true;
						}
					}
					t[0].prop.jQueryGrid.rup_grid("setSelection", gsr);
				}
				// En caso de ser necesario realizar una paginacion se realiza
				if (reloadNewPage){
					t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
					t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
					t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: intNewPage});
					t[0].prop.jQueryGrid.rup_grid("reloadGrid");
					$.data(t[0].prop.jQueryGrid[0], "detailPagAction",'');
				}
				// Se resetea el formulario de edicion
				$(t[0]).rup_maint("resetForm", t[0].prop.detailForm);
				//En el caso de no existir un valor conocido para gsr se le asigna el identificador del elemento seleccionado actual
				if ((!gsr || gsr===-1) && typeof t[0].prop.currentSelectedRow ==='string') {
					gsr = t[0].prop.currentSelectedRow.split(";")[1].substring(3);
				}
				// Se realiza la edicion del elemento
				t.rup_maint("editElement", gsr);
			}
			
			/*
			 * Funcion que comprueba si se han producido cambios en el formulario de detalle. En caso de haberse producido muestra un mensaje de confirmacion indicando que en casod e continuar se van a perder los cambios.
			 */
			function checkDetailFormModifications(okCallback){
				if (!$(this).hasClass("ui-state-disabled")) { 	
					if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
						$.rup_messages("msgConfirm", {
							message: $.rup.i18n.base.rup_maint.saveAndContinue,
							title: $.rup.i18n.base.rup_maint.changes,
							OKFunction : function () {
								okCallback.call();
							}
						});								
					} else {
						okCallback.call();
					}
				}
			}
			
			/**
			 * Funcion que crea los botones de navegación del detalle, es decir, la paginación
			 */
			function createNavigationButtons() {
				$("#back_" + settings.name).click(function (e) {
					//Se comprueba si el enlace esta deshabilitado
					if ($(this).hasClass("ui-state-disabled")){
						return false;
					}
					
					// Se comprueba si se han realizado cambios en los datos del formulario
					checkDetailFormModifications(function(){
						// Se realiza la navegacion al elemento anterior
						pback(e);
					});
				});	
				$("#forward_" + settings.name).click(function (e) {
					//Se comprueba si el enlace esta deshabilitado
					if ($(this).hasClass("ui-state-disabled")){
						return false;
					}
					
					// Se comprueba si se han realizado cambios en los datos del formulario
					checkDetailFormModifications(function(){
						// Se realiza la navegacion al siguiente elemento
						pforward(e);
					});
				});	
				$("#first_" + settings.name).click(function (e) { 
					//Se comprueba si el enlace esta deshabilitado
					if ($(this).hasClass("ui-state-disabled")){
						return false;
					}
					
					// Se comprueba si se han realizado cambios en los datos del formulario
					checkDetailFormModifications(function(){
						// Se realiza la navegacion al primer elemento
						pfirst(e);
					});
				});	
				$("#last_" + settings.name).click(function (e) { 
					//Se comprueba si el enlace esta deshabilitado
					if ($(this).hasClass("ui-state-disabled")){
						return false;
					}
					
					// Se comprueba si se han realizado cambios en los datos del formulario
					checkDetailFormModifications(function(){
						// Se realiza la navegacion al ultimo elemento
						plast(e);
					});
				});
			}
			/**
			 * Funcion que crea los botones del detalle
			 */
			function createDetailButtons(detailDialog) {
				var aButtons = null;
				switch (settings.detailButtons) {
				case $.rup.maint.detailButtons.SAVE_REPEAT:
					aButtons = [{
						text: $.rup.i18n.base.rup_global.save,
						click: function () {
								t.rup_maint("saveMaint");
								t[0].prop.MODO=null;
							}
						},
						{
							text: $.rup.i18n.base.rup_global.save_repeat,
							click: function () {
								t.rup_maint("saveMaint", true);//Invocamos al guardar del mantenimiento indicando que es guardaryrepetir
							}
						},
						{
							text: $.rup.i18n.base.rup_global.cancel,
							click: function () { 
								
								// Se comprueba si se han realizado cambios en los datos del formulario
								checkDetailFormModifications(function(){
									// Se cierra el formulario de detalle
									t[0].prop.detailDiv.rup_dialog("close");
									t[0].prop.MODO=null;
								});
								
								//quitamos todos los iconos de las validaciones
								$("#" + t[0].prop.detailDiv[0].id + " .rup-maint_validateIcon").remove();
								t[0].prop.detailFeedback.rup_feedback("close");
								return false;
							},
							btnType: $.rup.dialog.LINK
						}];
					break;
				case $.rup.maint.detailButtons.SAVE:
				default:
					aButtons = [{
						text: $.rup.i18n.base.rup_global.save,
						click: function () {
								t.rup_maint("saveMaint");
							}
						},
						{
							text: $.rup.i18n.base.rup_global.cancel,
							click: function () { 
								
								// Se comprueba si se han realizado cambios en los datos del formulario
								checkDetailFormModifications(function(){
									// Se cierra 
									t[0].prop.detailDiv.rup_dialog("close");
								});
								
								//quitamos todos los iconos de las validaciones
								$("#" + t[0].prop.detailDiv[0].id + " .rup-maint_validateIcon").remove();
								t[0].prop.detailFeedback.rup_feedback("close");
								return false;
							},
							btnType: $.rup.dialog.LINK
						}];
				}	
				detailDialog.rup_dialog("setOption", "buttons", aButtons);
			}
			function createDetailNavigation() {
				return "<div id='rup-maint_detailPagination' style='border-bottom:1px solid #D1D1D1'><div id='pag_" +
						settings.name + "' style='float:right'><span id='last_" + 
						settings.name + "' alt='" + $.rup.i18n.base.rup_maint.last +
						"' class='rup-maint_linkPaginacionDetalle'>" + $.rup.i18n.base.rup_maint.last + 
						"</span><span id='forward_" + settings.name + "' alt='" + $.rup.i18n.base.rup_maint.next + 
						"' class='rup-maint_linkPaginacionDetalle'>" + $.rup.i18n.base.rup_maint.next +
						"</span><span id='back_" + settings.name + "' alt='" + $.rup.i18n.base.rup_maint.previous + 
						"' class='rup-maint_linkPaginacionDetalle'>" + $.rup.i18n.base.rup_maint.previous +
						"</span><span id='first_" + settings.name + "' alt='" + $.rup.i18n.base.rup_maint.first + 
						"' class='rup-maint_linkPaginacionDetalle'>" + $.rup.i18n.base.rup_maint.first + "</span></div>";
			}
			function createDetailForm(withUserForm) {//				
				var detailDiv = null, detaiBody = "", buttons = "", detailFeedBack = "", formu = null, 
				capa = createDetailNavigation();
				capa = "<div id='pagination_" + settings.name + 
					"' style='float:left;font-size:11px'><img alt='" + $.rup.i18n.base.rup_maint.numResult + "' src='" + settings.imgPath + "/numero_elementos.png'/> " +
					"<div id='rup_maint_selectedElements' style='float: right; margin-left: 3px; margin-top: 2px; position: relative;'> </div></div>" + capa + "<div style='clear:both'/> </div>";
				if (withUserForm) {//si no han indicado formulario de detalle
					detailDiv = settings.detailForm.parent();
					
					//creación de los controles del formualrio haciendo uso de los class
					$("#" + settings.detailForm[0].id + " .datepicker").each(function () {
						$(this).rup_date();
					});
					
					$("#" + settings.detailForm[0].id + " .numeric").each(function () {
						$(this).numeric(",");
					});
					
					$("#" + settings.detailForm[0].id + " .integer").each(function () {
						$(this).numeric(false);
					});
					
					detailFeedBack = $("<div/>").attr("id", "rup-feedback_detail_" + settings.name);
					detailDiv.prepend(detailFeedBack);
					detailDiv.prepend(capa);				
					
					detailFeedBack.rup_feedback({
						closeLink: true,
						gotoTop: false,
						block: false,
						delay: 1000,
						fadeSpeed: 500
					});
					//guardamos como variable el feedback del detalle
					settings.detailFeedback = detailFeedBack;					
				} else {					
					detailDiv = $("<div/>").attr('id', 'detailDiv_' + settings.name).attr('title', $.rup.i18n.base.rup_maint.detailTitle).attr('style', 'display:none');
					detaiBody = $("<div/>").attr('id', 'detailBody').attr('style', 'padding-top:0.6em;');
					detailDiv.append(capa);
					detailFeedBack = $("<div/>").attr("id", "rup-feedback_detail_" + settings.name);
					detaiBody.append(detailFeedBack);
					detailFeedBack.rup_feedback({
						closeLink: true,
						gotoTop: false,
						block: false,
						delay: 1000,
						fadeSpeed: 500
					});
					//guardamos como variable el feedback del detalle
					settings.detailFeedback = detailFeedBack;
					formu = createData(detailDiv,detaiBody);
					
					settings.detailForm = $("#detailForm_" + settings.name).ajaxForm();
				}
				createNavigationButtons();
				settings.detailDiv = detailDiv;
				//se añade la validación
				addValidation(settings.detailForm);			
			}
			// Carga de los valores por defecto para los atributos que no ha introducido el usuario
			if (properties[0].jQueryGrid === null) {//no se puede crear el mantenimiento sin grid
				$.rup_messages("msgError", {message: $.rup.i18n.base.rup_maint.noGrid});
				return false;			
			}
			properties[0].jQueryGrid = $("#" + properties[0].jQueryGrid);
			settings = $.extend({}, $.fn.rup_maint.defaults, properties[0]);
			settings.name = self[0].id;//.substring("EJIE_MAINT_".length, self[0].id.length);
			
			$.data(properties[0].jQueryGrid[0] , "maintName",  self[0].id);//guardamos en el grid el nombre del maint
			if (settings.searchForm !== null) {//si tenemos formulario de busqueda creamos el ajax form y añadimos la url generica.
				
				// Asociamos el literal del formulario de busqueda indicado en los ficheros i18n
				$('#titleSearch_' + settings.name).text($.rup.i18n.base.rup_maint.searchOptions);
				
				settings.searchForm = $("#" + settings.searchForm);
				settings.searchForm.ajaxForm();
				settings.searchForm.parent().css("width",settings.jQueryGrid.rup_grid("getGridParam", "width"));
				settings.searchURL = settings.jQueryGrid.rup_grid("getGridParam", "url");
				settings.searchForm.bind("keydown", function(evt) {
					if (evt.keyCode == 13) {
						t.rup_maint("search");
						
					}
				});
			}
			if (settings.feedback === null) { //Si no tenemos feedback lo creamos
				settings.feedback = $("<div/>").attr("id", "feedback_" + settings.name);
				self.prepend(settings.feedback);
				settings.feedback.rup_feedback({ 
					type: "ok",
					closeLink: true,
					delay: 1000,
					fadeSpeed: 500,
					block: (settings.showFeedback ? true : false)
				});
			}
			if (!settings.jQueryGrid.rup_grid("isEditable")) {
				if (settings.detailForm !== null) {//si tenemos formulario de detalle no tenemos que crear los campos solo añadir la barra de navegación, el area de feedback y los botones de acción
					settings.detailForm = $("#" + settings.detailForm).ajaxForm();
					createDetailForm(true);
				} else {
					createDetailForm();
				}
				settings.detailDiv.rup_dialog({type: jQuery.rup.dialog.DIV, autoOpen: false, modal: true, width: 569, specificLocation: settings.name, create: settings.eventCreateDetailForm, 
					open: function () {
						//Gestor de cambios
						t[0].prop.detailForm.data('initialData', t[0].prop.detailForm.serialize());
						if ($.isFunction(t[0].prop.onafterDetailShow)) {
							t[0].prop.onafterDetailShow.call(t[0], settings.detailDiv);
						}
					}
				});
				//Eliminamos los eventos del boton de cerrar para mostrar el gestor de cambios
				settings.detailDiv.parent().find("#closeText_" + settings.detailDiv.first()[0].id).parent().unbind('click');
				settings.detailDiv.parent().find(".ui-dialog-titlebar-close").unbind('click');
				
				//añadimos el gestor de cambios
				settings.detailDiv.parent().find("#closeText_" + settings.detailDiv.first()[0].id).parent().bind("click", function () {
					if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
						$.rup_messages("msgConfirm", {
							message: $.rup.i18n.base.rup_maint.saveAndContinue,
							title: $.rup.i18n.base.rup_maint.changes,
							OKFunction : function () {
							t[0].prop.detailDiv.rup_dialog("close");
								return false;
							}
						});						
					} else {
						t[0].prop.detailDiv.rup_dialog("close");
					}
				});
				settings.detailDiv.parent().find(".ui-dialog-titlebar-close").bind("click", function () {
					checkDetailFormModifications(function(){
						t[0].prop.detailDiv.rup_dialog("close");
					});
				});
				createDetailButtons(settings.detailDiv);
			}
			self[0].prop = settings;
			self[0].prop.selectedRows = [];//Array con lo abjetos seleccionados
			self[0].prop.selectedRowsCont = 0;//contador para los seleccionados
			self[0].prop.currentSelectedRow = 0;//	
			self[0].prop.lastsel = null; //Ultima fila seleccionada para los mantenimientos editables 
			
			if (settings.toolbar !== null) {//si existe toolbar
				//añadimos el button de añadir
				settings.toolbar = $("#" + settings.toolbar);				
			} else {//si no tenemos toolbar la creamos
				settings.toolbar = $("<div/>").attr("id", "rup-maint_toolbar-" + settings.name);
				settings.toolbar.insertAfter(settings.feedback);
				settings.toolbar.rup_toolbar({
					width: 796
				});
			}
			if (settings.autoAjustToolbar) {//auto ajuste o no de la toolbar al tamañoo del grid
				settings.toolbar.css("width", settings.jQueryGrid.rup_grid("getGridParam", "width") - 5);//-5 para ajustar el ancho
			}
			if (settings.createDefaultToolButtons) {//Si quieres que te cree los botones básicos
				self[0].prop.btnNew = settings.toolbar.addButton({
					i18nCaption: "new",
					css: "rup-maint_new",
					index: 1
				}, $.rup.i18n.base.rup_maint).bind("click", function () {
					checkSelectedElements(function(){
						t[0].prop.jQueryGrid.rup_grid("resetSelection");
						$.data(t[0].prop.jQueryGrid[0] , "allSelected", null);
						$.data(t[0].prop.jQueryGrid[0], "deSelectedPages",[]);
						t.rup_maint("newElement");
					});
				});
				if (settings.jQueryGrid.rup_grid("isEditable")) {
					self[0].prop.btnCancel = settings.toolbar.addButton({
						i18nCaption: "cancel",
						css: "rup-maint_cancel",
						index: 2
					}, $.rup.i18n.base.rup_maint).bind("click", function () {
						t.rup_maint("cancelEditing", this);
					}).button("option", "disabled", true );
				}
				if (!settings.jQueryGrid.rup_grid("isEditable")) {
					self[0].prop.btnEdit = settings.toolbar.addButton({
						i18nCaption: "edit",
						css: "rup-maint_edit",
						index: 2
					}, $.rup.i18n.base.rup_maint).bind("click", function () {
						var rowid = t[0].prop.jQueryGrid.rup_grid('getGridParam', 'selrow'), page = t[0].prop.jQueryGrid.rup_grid('getGridParam', 'page'),firstPage=null;
						if (t[0].prop.jQueryGrid.rup_grid('isMultiselect')) {
							
							if (t[0].prop.selectedRows["p_" + page]) {
								rowid = t[0].prop.selectedRows["p_" + page][0].substring(3, t[0].prop.selectedRows["p_" + page][0].length);
								t[0].prop.currentSelectedRow = "p_" + page + ";" + "id_" + rowid;
							}else{
								// En caso de que no exista el identificador en la pagina actual se seleccionará el de la primera
								firstPage=Number(t[0].prop.selectedRows[0].substring(2));
								rowid = t[0].prop.selectedRows["p_" + firstPage][0].substring(3, t[0].prop.selectedRows["p_" + firstPage][0].length);
								t[0].prop.currentSelectedRow = "p_" + firstPage + ";" + "id_" + rowid;
							}
							
							if (firstPage!==null){
								t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: firstPage});
								t[0].prop.jQueryGrid.rup_grid("reloadGrid");	
							}
							t[0].prop.MODO = "edit";
							t.rup_maint("editElement", rowid);
							
						}else{
							t[0].prop.MODO = "edit";
							t[0].prop.currentSelectedRow = "p_" + page + ";" + "id_" + rowid;
							t.rup_maint("editElement", rowid);
						}
					});
				}
				self[0].prop.btnDelete = settings.toolbar.addButton({
					i18nCaption: "delete",
					css: "rup-maint_delete",
					index: 3
				}, $.rup.i18n.base.rup_maint).bind("click", function () {
					t.rup_maint("deleteElement", t[0].prop.jQueryGrid.rup_grid('getGridParam', 'selrow'));
				});
				self[0].prop.btnFilter = settings.toolbar.addButton({
					i18nCaption: "filter", 
					css: "rup-maint_filter", 
					index: 4
				}, $.rup.i18n.base.rup_maint).bind("click", function () {
					t.rup_maint("toggleSearchForm", "FIELDSET_SEARCH_" + t[0].prop.name);
				});
				self[0].prop.toolbar.pressButton("filter","rup-maint_filter_pressed");
				
			}
			if (settings.parent) {
				if ($("#" + settings.parent).length > 0) {
					$("#" + settings.parent).rup_maint("addChild", self[0].id);//"EJIE_MAINT_" + settings.name);
				}
			}
			var defaultLoadComplete = settings.jQueryGrid[0].p.loadComplete;
			
			settings.jQueryGrid[0].p.loadComplete = function (data) {
				if (defaultLoadComplete!=null){
					jQuery(defaultLoadComplete(data));
				}
				t[0].prop.lastsel=null;
				if (data.records==0){
					
					t[0].prop.toolbar.disableButton("delete");
					if (!t[0].prop.jQueryGrid.rup_grid("isEditable")) {
						t[0].prop.toolbar.disableButton("edit");
					}else{
						t[0].prop.toolbar.disableButton("cancel");
					}
				}else{
					t[0].prop.toolbar.enableButton("delete");
					if (!t[0].prop.jQueryGrid.rup_grid("isEditable")) {
						t[0].prop.toolbar.enableButton("edit");
					}else{
						t[0].prop.toolbar.disableButton("cancel");
						t[0].prop.toolbar.enableButton("new");
					}
					
					if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")){
						
						if (t[0].prop.selectedRowsCont>0){
							t[0].prop.toolbar.enableButton("edit");
							t[0].prop.toolbar.enableButton("delete");
						}else{
							t[0].prop.toolbar.disableButton("edit");
							t[0].prop.toolbar.disableButton("delete");
						}
					}
				}
			};
			
			var defaultOndblClickRow = settings.jQueryGrid[0].p.ondblClickRow;
			
			settings.jQueryGrid[0].p.ondblClickRow = function (rowid, iRow, iCol, e) {
				if (defaultOndblClickRow!=null){
					jQuery(defaultOndblClickRow(rowid, iRow, iCol, e));
				}
				
				$("body").data("e_click_mnt",false);
				window.clearTimeout($("body").data("clicktimer_mnt"));
				//eliminamos la edicion en linea en el doble click y lo dejamos en linea
				if (!t[0].prop.jQueryGrid.rup_grid("isMultiselect") && !t[0].prop.jQueryGrid.rup_grid("isEditable")) {
					t[0].prop.MODO = "edit";
					t.rup_maint("editElement", rowid);
				}
			};
			
			settings.jQueryGrid[0].p.serializeGridData = function (postData) {
				//para que cuando se pulse los bontones de navegacion no use los criterios de busqueda para cargar el grid
				if(postData.page==='rup'){
					postData.page=1;
				}else{
					return postData;
				}
				
				if (t[0].prop.searchForm !== null) {
				var searchFormArray = t[0].prop.searchForm.serializeArray();
				for (var i = 0; i < searchFormArray.length; i++) { //eleminamos todos los posibles valores que en na busqueda anterior se hayan podido añadir a postData 
					delete postData[searchFormArray[i].name];
				}
				if (postData.page!== undefined && postData.page !== null && Number(postData.page) > $(this).rup_grid("getGridParam","lastpage") && $(this).rup_grid("getGridParam","lastpage") > 0){//pq si laspage es 0 es la primera vez
					postData.page = $(this).rup_grid("getGridParam","lastpage");
				}	
				
				var formFieldNames = $.map($.makeArray(t[0].prop.searchForm.find("[name]")),function(elem){
					  return $(elem).attr("name");  
				});
				
				$.each(formFieldNames, function(index){
				    delete postData[formFieldNames[index]];
				});
				
				//SUF : modificado para unifcar en un unico metodo $.extend(postData, settings.searchForm.serializeToObject()); //Solo se envian los campos que tienen valor y sean diferentes a ""
//				$.extend(postData, form2object(t[0].prop.searchForm[0])); //Solo se envian los campos que tienen valor y sean diferentes a ""
				// Se desanida el json para permitir el uso de notacion dot en los controles del formulario de busqueda
				$.extend(postData, $.rup_utils.unnestjson(form2object(t[0].prop.searchForm[0])));
				}
				if (t[0].prop.parent) {//SUF: si tenemos padre tendremos que añadir la clave primaria del padre como dato a enviar
					var parent = $("#" + t[0].prop.parent), colPks = parent.rup_maint("getPrimaryKey").split(";"), parentPKObject = {}, row = parent[0].prop.jQueryGrid.rup_grid("getSelectedRows")[0];
					if (colPks.length > 1) {//clave compuesta
						for (var i = 0; i < colPks.length; i++) {
							parentPKObject[parent[0].prop.modelObject.toLowerCase() + colPks[i]] = parent[0].prop.jQueryGrid.rup_grid("getCol", row, colPks[i]) + ";"; 
						}
					} else {//clave simple
						var pkLabel = colPks[0].substring(0,1).toUpperCase() + colPks[0].substring(1); 
						parentPKObject[parent[0].prop.modelObject.toLowerCase() + pkLabel] = parent[0].prop.jQueryGrid.rup_grid("getCol", row, colPks[0]);
					}
					$.extend(postData, parentPKObject);//Solo se envian los campos que tienen valor y sean diferentes a ""
				}
				return postData;
			};
			
			// ################### INICIO SOBREESCRITURA MULTISELECCION ##################
			
			function checkSelectedElements(okCallback){
				var selectedRows=t[0].prop.selectedRows;
				if(t[0].prop.showMultiselectAlerts && selectedRows && selectedRows.length>0){
					$.rup_messages("msgConfirm", {
						message: $.rup.i18n.base.rup_maint.checkSelectedElems,
						title: $.rup.i18n.base.rup_maint.changes,
						OKFunction : function () {
							okCallback.call();
						}
					});
				}else{
					okCallback.call();
				}
			}
			
			if (settings.jQueryGrid.rup_grid("isMultiselect")) {
				
				settings.jQueryGrid[0].rup_gridProps.resetSelection = function () {
					t[0].prop.selectedRows=[];
					t[0].prop.jQueryGrid.jqGrid("resetSelection");
					t[0].prop.selectedRowsCont=0;
					$('#' + t[0].prop.jQueryGrid[0].rup_gridProps.pagerName + '_left').html(t[0].prop.selectedRowsCont + " " + $.rup.i18n.base.rup_grid.pager.selected);
					t[0].prop.toolbar.disableButton("edit");
					t[0].prop.toolbar.disableButton("delete");
				};
				
				//sobreescritura de la combo de cambio de paginacion
				var pgcnt = "pg_"+t[0].prop.jQueryGrid[0].rup_gridProps.pagerName;
				$('.ui-pg-selbox',"#"+pgcnt).unbind("change");
				$('.ui-pg-selbox',"#"+pgcnt).bind("change",function() {
					
					var selectedRows=t[0].prop.selectedRows, newRowNum=this.value,combo=this, rowNum=t[0].prop.jQueryGrid[0].p.rowNum;
					
					$(this).val(t[0].prop.jQueryGrid[0].p.rowNum);
					
					checkSelectedElements(function(){
						$(combo).val(newRowNum);
						t[0].prop.jQueryGrid.rup_grid("resetSelection");
						$.data(t[0].prop.jQueryGrid[0] , "allSelected", null);
						$.data(t[0].prop.jQueryGrid[0], "deSelectedPages",[]);
						t[0].prop.jQueryGrid[0].p.page = Math.round(t[0].prop.jQueryGrid[0].p.rowNum*(t[0].prop.jQueryGrid[0].p.page-1)/newRowNum-0.5)+1;
						t[0].prop.jQueryGrid[0].p.rowNum = newRowNum;
						t[0].prop.jQueryGrid[0].grid.populate();
						return false;
					});
				});
				
				
				
				settings.jQueryGrid[0].rup_gridProps.onAfterSelectRow = function (rowid, select) {
					function getPrimaryKeysForRow(row) {
						var colPks = t.rup_maint("getPrimaryKey").split(";"), detailURL = "";
						if (colPks.length > 1) {
							for (var i = 0; i < colPks.length; i++) {
								detailURL = detailURL + "/" + t[0].prop.jQueryGrid.rup_grid("getCol", row, colPks[i]); 
							}
						} else {
							detailURL = detailURL + "/" + t[0].prop.jQueryGrid.rup_grid("getCol", row, colPks[0]);
						}
						return detailURL;
					}
					
					var page = t[0].prop.jQueryGrid.rup_grid("getGridParam", "page"), selected, selectesElem = [], 
					selectedRowsLength = t[0].prop.selectedRows.length, pksForRow = getPrimaryKeysForRow(rowid), ind, selectedTotalRows;
					if (select) {//seleccionamos uno nuevo
						if (t[0].prop.selectedRows["p_" + page]) {//si tengo el array con las paginas
							t[0].prop.selectedRows["p_" + page].push("id_" + rowid);
							t[0].prop.selectedRows["p_" + page]["id_" + rowid] = pksForRow;
						} else { //si no tengo esa pagina en el array con las paginas seleccionadas lo creo
							t[0].prop.selectedRows.push("p_" + page);
							t[0].prop.selectedRows["p_" + page] = [];
							t[0].prop.selectedRows["p_" + page].push("id_" + rowid);							
							t[0].prop.selectedRows["p_" + page]["id_" + rowid] = pksForRow;
						}
						t[0].prop.selectedRowsCont += 1;
						//lo añadimos al array del grid
						t[0].prop.jQueryGrid[0].rup_gridProps.allPksArray.push(pksForRow);
						$.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont", Number($.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont") + 1));
						
						var deSelectedPages = $.data(t[0].prop.jQueryGrid[0], "deSelectedPages");
						//comprobamos si esta dentro de las paginas de deseleccionadas la pagina actual
						if (deSelectedPages!=undefined){
							ind = $.inArray(page, deSelectedPages!=undefined ? deSelectedPages:[]);
							if (ind > -1) {//es que esta dentro de las paginas deseleccionadas y hay que volver a meterlo
								
								deSelectedPages.splice(ind, 1);
								$.data(t[0].prop.jQueryGrid[0] , "deSelectedPages", deSelectedPages);
							}
						}
					} else {//deseleccionamos
						for (var i = 0 ; i < selectedRowsLength; i++) {//me recorro las paginas
							if (t[0].prop.selectedRows[i] === "p_" + page) {//si encuentro la pagina
								for (var j = 0; j < t[0].prop.selectedRows[t[0].prop.selectedRows[i]].length; j++) {//me recorro las paginas que hay en la pagina
									if (t[0].prop.selectedRows[t[0].prop.selectedRows[i]][j] === "id_" + rowid) {
										t[0].prop.selectedRows[t[0].prop.selectedRows[i]].splice(j, 1);
										delete t[0].prop.selectedRows[t[0].prop.selectedRows[i]]["id_" + rowid];
										if (t[0].prop.selectedRows[t[0].prop.selectedRows[i]].length === 0) {//si ya no me quedan filas en esa pagina borramos la pagina tambien
											delete t[0].prop.selectedRows[t[0].prop.selectedRows[i]];
											t[0].prop.selectedRows.splice(i, 1);
											break;
										}
									}
								}
							}
						}
						//actualizamos el array del grid tambien 
						ind = $.inArray(pksForRow , t[0].prop.jQueryGrid[0].rup_gridProps.allPksArray);
						t[0].prop.jQueryGrid[0].rup_gridProps.allPksArray.splice(ind, 1);
						$.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont",Number($.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont") - 1));
						t[0].prop.selectedRowsCont -= 1; 
					}
					selectedTotalRows = t[0].prop.selectedRowsCont;
					//deseleccionamos el select All
					if ($('#cb_' + t[0].prop.jQueryGrid[0].id).is(":checked")) {
						selectedTotalRows = Number($.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont")) - 1;
						$('#cb_' + t[0].prop.jQueryGrid[0].id).attr('checked', false);
					}
					
					//actualizar num elementos seleccionados
					if ($.data(t[0].prop.jQueryGrid[0] , "allSelected") !== null && $.data(t[0].prop.jQueryGrid[0] , "allSelected") !== undefined) {
						selectedTotalRows = Number($.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont"));
					} else {
						selectedTotalRows = t[0].prop.selectedRowsCont;
					}
					
					// habilitar/deshabilitar los botones de editar y eliminar dependiendo de el nnumero de elementos seleccionados
					if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
						if(selectedTotalRows>0){
							t[0].prop.toolbar.enableButton("edit");
							t[0].prop.toolbar.enableButton("delete");
						}else{
							t[0].prop.toolbar.disableButton("edit");
							t[0].prop.toolbar.disableButton("delete");
						}
					}
					
					$('#' + t[0].prop.jQueryGrid[0].rup_gridProps.pagerName + '_left').html(selectedTotalRows + " " + $.rup.i18n.base.rup_grid.pager.selected);
				};
				//Evento onDeSelectAllRows lanzado por el boton de deseleccionar todos
				settings.jQueryGrid[0].rup_gridProps.onDeSelectAllRows = function (select) {
					t[0].prop.selectedRows = [];
					t[0].prop.selectedRowsCont = 0;
					t[0].prop.toolbar.disableButton("edit");
					t[0].prop.toolbar.disableButton("delete");
					$.data(t[0].prop.jQueryGrid[0] , "allSelected", null);
				};
				//evento onSelectAll
				settings.jQueryGrid[0].rup_gridProps.onAfterSelectAll = function (aRowids, select, fromGridComplete) {
					function getPrimaryKeysForRow(row) {
						var colPks = t.rup_maint("getPrimaryKey").split(";"), detailURL = "";
						if (colPks.length > 1) {
							for (var i = 0; i < colPks.length; i++) {
								detailURL = detailURL + "/" + t[0].prop.jQueryGrid.rup_grid("getCol", row, colPks[i]); 
							}
						} else {
							detailURL = detailURL + "/" + t[0].prop.jQueryGrid.rup_grid("getCol", row, colPks[0]);
						}
						return detailURL;
					}
					function deSelectRows(rowsToDes) {
						$.each(rowsToDes, function (index, value) {
							t[0].prop.jQueryGrid.rup_grid("setSelection", value);
						});
					}
					var page = t[0].prop.jQueryGrid.rup_grid("getGridParam", "page"), ind, selectedTotalRows, pksForRow, deSelectedPages;
					//Si estamos añadiendo y tenemos todos seleccionados
					//if (t[0].prop.MODO === "new") return false;
					if (select) {
						if (t[0].prop.selectedRows["p_" + page]) {//si tengo la pagina en el array de los seleccionados
							var rowsLeng = aRowids.length, index = 0;
							//t[0].prop.jQueryGrid.rup_grid("resetSelection");
							if (fromGridComplete) {//si vengo de gridcomplete
								for (var i = 0; i < t[0].prop.selectedRows["p_" + page].length;i++) {
									t[0].prop.jQueryGrid.rup_grid("setSelection", t[0].prop.selectedRows["p_" + page][i].substring(3), false);
								}
								if (t[0].prop.selectedRows["p_" + page].length < rowsLeng) {//si tenemos menos seleccionados que filas hay que quitar el check de selectall
									$('#cb_' + t[0].prop.jQueryGrid[0].id).attr('checked', false);
								}
							} else {//si vengo de pinchar el check del selectAll 
								//meter las nuevas filas sino existen
								//tambien hay que quitarlo de los que estan en el array del grid
								for (var j = 0; j < aRowids.length; j++) {
									if (t[0].prop.selectedRows["p_" + page] !== undefined && 
											t[0].prop.selectedRows["p_" + page] !== null && 
											$.inArray("id_" + aRowids[j], t[0].prop.selectedRows["p_" + page]) < 0) { //si no tengo ese id en el array de seleccionados lo meto
										pksForRow = getPrimaryKeysForRow(aRowids[j]);
										t[0].prop.selectedRows["p_" + page].push("id_" + aRowids[j]);
										t[0].prop.selectedRows["p_" + page]["id_" + aRowids[j]] = pksForRow;
										t[0].prop.selectedRowsCont += 1;
										//lo añadimos al array del grid
										t[0].prop.jQueryGrid[0].rup_gridProps.allPksArray.push(pksForRow);
										//$.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont",Number($.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont") + 1));
									}
								}
								$.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont", t[0].prop.jQueryGrid[0].rup_gridProps.allPksArray.length);
								//actualizar las lista del grid con lo nuevos datos
							}
						} else { //si no tengo esa pagina en el array con las paginas seleccionadas lo creo
							t[0].prop.selectedRows.push("p_" + page);
							t[0].prop.selectedRows["p_" + page] = [];
							for (var j = 0; j < aRowids.length; j++) {
								t[0].prop.selectedRows["p_" + page].push("id_" + aRowids[j]);
								t[0].prop.selectedRows["p_" + page]["id_" + aRowids[j]] = getPrimaryKeysForRow(aRowids[j]);
								if($.data(t[0].prop.jQueryGrid[0] , "allSelected")!==true){
									t[0].prop.selectedRowsCont += 1;
								}
								if (fromGridComplete && t[0].prop.MODO != "new") {//solo tengo que volver a seleccionar si vengo del gridcomplete
									
									t[0].prop.jQueryGrid.rup_grid("setSelection", aRowids[j], false);
								}
							}
							//comprobamos si esta dentro de las paginas de deseleccionadas
							deSelectedPages=$.data(t[0].prop.jQueryGrid[0], "deSelectedPages");
							if (deSelectedPages){
								ind = $.inArray(page, $.data(t[0].prop.jQueryGrid[0], "deSelectedPages"));
								if (ind > -1) {//es que esta dentro de las paginas deseleccionadas y hay que volver a meterlo
									var deSelectedPages = $.data(t[0].prop.jQueryGrid[0] , "deSelectedPages");
									deSelectedPages.splice(ind, 1);
									$.data(t[0].prop.jQueryGrid[0] , "deSelectedPages", deSelectedPages);
								}
							}
						}
					} else { //si hay que deseleccionar
						ind = $.inArray("p_" + page, t[0].prop.selectedRows);
						delete t[0].prop.selectedRows["p_" + page];
						t[0].prop.selectedRows.splice(ind, 1);
						t[0].prop.selectedRowsCont = t[0].prop.selectedRowsCont - aRowids.length;
						
						//tambien hay que quitarlo de los que estan en el array del grid
						for (var j = 0; j < aRowids.length; j++) {
							ind = $.inArray(getPrimaryKeysForRow(aRowids[j]) , t[0].prop.jQueryGrid[0].rup_gridProps.allPksArray);
							t[0].prop.jQueryGrid[0].rup_gridProps.allPksArray.splice(ind, 1);
						}
						$.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont", t[0].prop.jQueryGrid[0].rup_gridProps.allPksArray.length);
					}
					//actualizar num elementos seleccionados
					if ($.data(t[0].prop.jQueryGrid[0] , "allSelected") !== null && $.data(t[0].prop.jQueryGrid[0] , "allSelected") !== undefined) {
						selectedTotalRows = Number($.data(t[0].prop.jQueryGrid[0] , "selectedRowsCont"));
					} else {
						selectedTotalRows = t[0].prop.selectedRowsCont;
					}
					
					// se habilitan/desahabilitan los botones editar y eliminar dependiendo del nunmero de elementos seleccionados.
					if (selectedTotalRows>0){
						t[0].prop.toolbar.enableButton("edit");
						t[0].prop.toolbar.enableButton("delete");
					}else{
						t[0].prop.toolbar.disableButton("edit");
						t[0].prop.toolbar.disableButton("delete");
					}
					
					$('#' + t[0].prop.jQueryGrid[0].rup_gridProps.pagerName + '_left').html(selectedTotalRows + " " + $.rup.i18n.base.rup_grid.pager.selected);
				};
				
				//Sobreescritura de la función para obtener las primary de toda la entidad
				settings.jQueryGrid[0].rup_gridProps.selectAllGetPrimaryKeys = function () {
					var relatedGrd = this;
					$.rup_ajax({                           
					      url:relatedGrd.rup_grid("getGridParam", "url"),
					      dataType: 'json',
					      type: "GET",
					      data: form2object(t[0].prop.searchForm[0]),
					      contentType: 'application/json',             
					      success: function (pks, ajaxOptions) {
								var colPks = t.rup_maint("getPrimaryKey").split(";"), pksArray = [], aux = "";
								for (var j = 0; j < pks.length; j++) {
									if (colPks.length > 1) {
										for (var i = 0; i < colPks.length; i++) {
											aux =  aux + "/" + pks[j][colPks[i]];
										}
									} else {
										aux = "/" + pks[j][colPks[0]];
									}
									pksArray.push(aux);
									aux = "";
								}
								relatedGrd[0].rup_gridProps.allPksArray = pksArray;
								//actualizar num elementos seleccionados
								$('#' + relatedGrd[0].rup_gridProps.pagerName + '_left').html(pksArray.length + " " + $.rup.i18n.base.rup_grid.pager.selected);
								
								//quitamos todas las posibles selecciones que se hayan podido realizar
								var page = relatedGrd.rup_grid("getGridParam", "page");
								for (var i=0;i<t[0].prop.selectedRows.length;i=i+1){
									if (!t[0].prop.selectedRows[i]==="p_"+page){
										delete t[0].prop.selectedRows[i];
									}
								}
//								t[0].prop.selectedRows = [];
								t[0].prop.selectedRowsCont = pksArray.length;
								pksArray = null;
							},
					      error: function (xhr, ajaxOptions, thrownError) {
					      },
					      beforeSend: function (xhr) {
					    	  var colPks = t.rup_maint("getPrimaryKey").split(";"), objJson = {};
								if (colPks.length > 1) {
									for (var i = 0; i < colPks.length; i++) {
										objJson[colPks[i]] = colPks[i];
									}
								} else {
									objJson[colPks[0]] = colPks[0];
								}
					    	  xhr.setRequestHeader("RUP", $.toJSON(objJson));
					    	  colPks = null;
					      }
					});
				};
			}
			
			// ################### FIN SOBREESCRITURA MULTISELECCION ##################
			if (settings.searchForm !== null) {//si tenemos formulario de busqueda añadimos la capa con los botones de busqueda y el enlace de limpiar.
				btSearch = $("<input type='button' />").attr('id', 'bt_search_' + settings.name).bind("click", 
				function () { 
					t.rup_maint("search");
				});
				btSearch.button({label: $.rup.i18n.base.rup_global.search});
				lnkClean = $("<a>").attr("id", "clean_search_" + settings.name).attr("class", "rup-enlaceCancelar").text($.rup.i18n.base.rup_global.clean).bind("click", 
				function () {
					t.rup_maint("cleanSearchForm");
				});
				btDiv = $("<div>").attr("id", "SEARCH_FORM_BUTTONS_" + settings.name).addClass("right_buttons").append(btSearch).append("&nbsp;").append(lnkClean).append("&nbsp;");
				$("#FIELDSET_SEARCH_" + settings.name).append(btDiv);
			}
			//Evento creado para seleccionar las filas y editar si estamos editando
			settings.jQueryGrid[0].rup_gridProps.onAfterGridComplete = function (rowid, launchSelectEvent) {
				function getPrimaryKeysForRow(row) {
					var colPks = t.rup_maint("getPrimaryKey").split(";"), detailURL = "";
					if (colPks.length > 1) {
						for (var i = 0; i < colPks.length; i++) {
							detailURL = detailURL + "/" + t[0].prop.jQueryGrid.rup_grid("getCol", row, colPks[i]); 
						}
					} else {
						detailURL = detailURL + "/" + t[0].prop.jQueryGrid.rup_grid("getCol", row, colPks[0]);
					}
					return detailURL;
				}
				var p, page = this.rup_grid("getGridParam", "page"), id = 0, rowData, selectedPKs, 
				pk, pkIndex, idPK, notFound = true;
				if (this.rup_grid("isMultiselect")) {
					//Si estamos añadiendo un nuevo elemento el addRowdata invoca al updatepager que invoca al gridcomplete con lo que no deberiamos de tocar nada de las seleccionadas
					if (t[0].prop.MODO === "new") {
						return false;
					}
					if (t[0].prop.jQueryGrid.data("old_selectRows") && t[0].prop.jQueryGrid.data("old_selectRows").length > 0) {//si estamos ordenando por las columnas hay que volver a seleccionar lo que estaban
						selectedPKs = t[0].prop.jQueryGrid.data("old_selectRows");
						for (var i = 0; i < t[0].prop.jQueryGrid.rup_grid("getDataIDs").length; i++) {
							idPK = t[0].prop.jQueryGrid.rup_grid("getDataIDs")[i];
							pk = getPrimaryKeysForRow(idPK);
							pkIndex = $.inArray(pk, selectedPKs);
							if (pkIndex > -1) {//si esta dentro del array
								if (t[0].prop.selectedRows["p_" + page]) {//si tengo el array con las paginas
									t[0].prop.selectedRows["p_" + page].push("id_" + idPK);
									t[0].prop.selectedRows["p_" + page]["id_" + idPK] = pk;
								} else { //si no tengo esa pagina en el array con las paginas seleccionadas lo creo
									t[0].prop.selectedRows.push("p_" + page);
									t[0].prop.selectedRows["p_" + page] = [];
									t[0].prop.selectedRows["p_" + page].push("id_" + idPK);							
									t[0].prop.selectedRows["p_" + page]["id_" + idPK] = pk;
								}
								if ($.data(t[0].prop.jQueryGrid[0] , "allSelected") !== true){
									t[0].prop.selectedRowsCont += 1;
								}
								selectedPKs.splice(pkIndex, 1);
								notFound = false;
							}							
						}
						t[0].prop.jQueryGrid.data("old_selectRows", selectedPKs);
						if (rowid === "FFF") {//paginacion forward con elementos desaparecidos por la ordenacion
							if (!t[0].prop.selectedRows["p_" + page]) {
								//lanza la busqueda actualizando el t[0].prop.currentSelectedRow actualizado
								t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent;
								t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
								t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: parseFloat(page) + 1});
								return false;
							}
							rowid = t[0].prop.selectedRows["p_" + page][0].substring(3, t[0].prop.selectedRows["p_" + page][0].length);
						}
					}
					if (t[0].prop.selectedRows["p_" + page] && $.data(t[0].prop.jQueryGrid[0] , "allSelected") !== true) {//si tengo paginas a seleccionar a la pagina a la que voy sino tengo todos selecciondos
						for (var i = 0 ; i < t[0].prop.selectedRows["p_" + page].length; i++) {//me recorro los hijos de la pagina a la que voy a ir
							id = t[0].prop.selectedRows["p_" + page][i].substring(3, t[0].prop.selectedRows["p_" + page][i].length);//nota el 3 es por el literal "id_"
							t[0].prop.jQueryGrid.rup_grid("setSelection", id, false);
						}
					} else {
						if ($.data(t[0].prop.jQueryGrid[0] , "allSelected") === true){//si tengo que seleccionar todos
							//si tengo la pagina y no son todos los registros a seleccionar
							if (t[0].prop.selectedRows["p_" + page] && t[0].prop.selectedRows["p_" + page].length < t[0].prop.jQueryGrid.rup_grid("getDataIDs").length) {//si tenemos menos filas en la pagina que el número de filas hay que quitar el check de selectAll
								$('#cb_' + t[0].prop.jQueryGrid[0].id).attr('checked', false);
								//deseleccionamos el check de todos
							}
						}
						return false;
					}				
				} else {
					if (rowid === null) {//si no me vienen el row id es pq vengo de la primera carga es decir que no estoy paginando con los botoens de ultimo y primero o que no he saltado de pagina 
						if (this.rup_grid("getDataIDs").length > 0) {
							if (this.rup_grid("isEditable")) {//si el grid es editable no hay lanzar el setselection para que lance el select de la fila porque sino la editaria
								this.rup_grid("setSelection",  t[0].prop.jQueryGrid.rup_grid("getDataIDs")[0], false);
							} else {
								this.rup_grid("setSelection",  t[0].prop.jQueryGrid.rup_grid("getDataIDs")[0], true);
							}
						}
					} else {//si me viene una fila es que vengo de pulsar el firsto last
						if (this.rup_grid("getDataIDs").length > 0) {
							if (this.rup_grid("isEditable")) {
								this.rup_grid("setSelection", rowid, false);
							} else {
								this.rup_grid("setSelection", rowid, true);
							}
						}
					}				
				}
				if (rowid) {
					t.rup_maint("editElement", rowid);
				}
			};			
			
			settings.jQueryGrid[0].p.onSortCol = function (index, iCol,	sortorder) {
				// TODO: PROBAR BIEN LA ORDENACION
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					var sorting=t[0].prop.jQueryGrid.data("sorting");
					if (!sorting){
						checkSelectedElements(function(){
							t[0].prop.jQueryGrid.rup_grid("resetSelection");
							$.data(t[0].prop.jQueryGrid[0] , "allSelected", null);
							$.data(t[0].prop.jQueryGrid[0], "deSelectedPages",[]);
							t[0].prop.jQueryGrid.data("sorting", true);
							t[0].prop.jQueryGrid.jqGrid("sortGrid",index, iCol,	sortorder);
						});
					
						t[0].prop.jQueryGrid.data("sorting",false);
						return 'stop';
					}else{
						t[0].prop.jQueryGrid.data("sorting",false);
					}
				};
			};
			
			function deselectAddedElements(){
				t[0].prop.MODO=null;
				$(t[0]).find(" tr.addElement td input[type='checkbox'].cbox:checked").click();
				t[0].prop.jQueryGrid.rup_grid("reloadGrid");
			}
			
			settings.jQueryGrid[0].p.onPaging = function (pgButton) {
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					
					// Se comprueba si al paginar existen registros seleccionados que habian sido insertados en esa pagina
					var addedElements = $(this).find(" tr.addElement td input[type='checkbox'].cbox:checked");
					
					if (addedElements.length>0){
						//Existen elementos seleccionados que han sido insertados en la misma pagina.
						if(t[0].prop.showMultiselectAlerts){
							$.rup_messages("msgConfirm", {
								message: $.rup.i18n.base.rup_maint.checkAddedSelectedElems,
								title: $.rup.i18n.base.rup_maint.changes,
								OKFunction : function (pgButton) {
									deselectAddedElements();
								}
							});
						}else{
							deselectAddedElements();
						}
						return 'stop'; 
					}
				}
			};
			
			//si es editable hay que poner que se edite por click en la fila no por dblclick
			if (settings.jQueryGrid.rup_grid("isEditable")) {
				
				settings.jQueryGrid[0].p.onCellSelect = function (rowid, iCol, cellcontent,	e) {
					t[0].prop.selectedCell = iCol;
					return true;
				};
				settings.jQueryGrid[0].rup_gridProps.onAfterSelectRow = function (rowid, select) {
//					t[0].prop.feedback.rup_feedback("close");
					t.rup_maint("editElement", rowid);
				};
				settings.jQueryGrid[0].rup_gridProps.onAfterDragAndDrop = function (permutations) {
					if (!this.rup_grid("isEditing")) {
						return false;
					} 
					var ret, rowColModel, firstInput, relatedGrid = this, rowN = this.rup_grid("getSelectedRows")[0],
						mntName = $.data(this, "maintName"), lastColName;
					rowColModel = this.rup_grid("getColModel");
					lastColName = rowColModel[rowColModel.length - 1].name;
					$(".editable").unbind("keydown");
					$("input[name='" + lastColName + "']", relatedGrid).bind("keydown", function(event) {	
						var numPag = 0, page = relatedGrid.rup_grid("getGridParam", "page");
						if (event.keyCode == 9) { // TAB
							if (!event.shiftKey) {
								if ($(this).hasClass("hasDatepicker")) {
									$(this).datepicker("hide");
								}
								relatedGrid.rup_grid('saveRow', rowN, rup_maint.saveEditableSucces, "clientArray", null, rup_maint.aftersavefunc, rup_maint.saveEditableError, null);
								if (rowN == relatedGrid.rup_grid("getDataIDs").length) {//si es la ultima fila hay que paginar y poner la primera en edicion
									numPag = relatedGrid.rup_grid("getGridParam", 'lastpage');//Math.ceil(settings.jQueryGrid.rup_grid("getGridParam", 'records') / settings.jQueryGrid.rup_grid("getGridParam", 'rowNum'));
									if (parseFloat(page) + 1 <= numPag) {
										relatedGrid[0].p.ajaxGridOptions = {async: false};
										relatedGrid.rup_grid("setGridParam", {page: parseFloat(page) + 1});
										relatedGrid.rup_grid("reloadGrid");
										relatedGrid[0].p.ajaxGridOptions = {async: true};
										//seleccionamos la primera fila
										rowN = 0;
									} else {
										return false;
									}
								}
								relatedGrid.rup_grid("setSelection", Number(rowN) + 1, false);
								$("#" + mntName).rup_maint("editElement", Number(rowN) + 1);
								$("body").data("clicktimer" , window.setTimeout(function () {
									$("#" + Number(rowN+1) + " .editable:first", relatedGrid).focus();
								}, 0));
								return false;
							}
						}
					});		
					
					firstColName = rowColModel[0].name;
					$("input[name='" + firstColName + "']", relatedGrid).bind("keydown", function(event) {	
						var numPag = 0, page = relatedGrid.rup_grid("getGridParam", "page");
						if (event.keyCode == 9) { // TAB
							if (event.shiftKey) {
								if ($(this).hasClass("hasDatepicker")) {
									$(this).datepicker("hide");
								}
								relatedGrid.rup_grid('saveRow', rowN, rup_maint.saveEditableSucces, "clientArray", null, rup_maint.aftersavefunc, rup_maint.saveEditableError, null);
								//$("#" + mntName).rup_maint("saveMaint");
								//relatedGrid.rup_grid("saveRow", rowId);
								if (rowN == 1) {//si es la ultima fila hay que paginar y poner la primera en edicion
									if (parseFloat(page)> 1) {
										relatedGrid[0].p.ajaxGridOptions = {async: false};
										relatedGrid.rup_grid("setGridParam", {page: parseFloat(page) -1});
										relatedGrid.rup_grid("reloadGrid");
										relatedGrid[0].p.ajaxGridOptions = {async: true};
										//seleccionamos la primera fila
										rowN = relatedGrid.rup_grid("getDataIDs").length+1;
									} else {
										return false;
									}
								}
								relatedGrid.rup_grid("setSelection", Number(rowN-1), false);
								$("#" + mntName).rup_maint("editElement", Number(rowN-1) );
								$("body").data("clicktimer" , window.setTimeout(function () {
									$("#" + Number(rowN-1) + " .editable:last", relatedGrid).focus();
								}, 0));
								return false;
							}
						}
					});
				};
			}
			if (settings.jQueryGrid[0].rup_gridProps.loadOnStartUp) {
				//Lanzamos la busqueda una vez cargado todo
					t.rup_maint("search");
					if (!settings.jQueryGrid.rup_grid("isMultiselect") && !settings.jQueryGrid.rup_grid("isEditable")) {//si es multiseleccion o es editable no hay que mira los hijos 
						settings.jQueryGrid[0].p.onSelectRow = function (rowid, select) {//hay que lanzar la carga del segunso si hay padre
							$("body").data("e_click_mnt", true);
							$("body").data("clicktimer_mnt" , window.setTimeout(function () {
						            if($("body").data("e_click_mnt")) {
										$("body").data("e_click_mnt", false);
										window.clearTimeout($("body").data("clicktimer_mnt"));
						            	clearTimeout($("body").data("clicktimer_mnt"));
						                $("body").data("clicktimer_mnt", null);
						            	if (t.data("_children")) {
											var ln = t.data("_children").length;
											for (var i = 0; i < ln; i++) {
												$("#" + t.data("_children"))[i].prop.jQueryGrid[0].p.ajaxGridOptions = {async: true};
												$("#" + t.data("_children"))[i].prop.jQueryGrid.rup_grid("setGridParam", { page: "rup" } );
												$("#" + t.data("_children"))[i].prop.jQueryGrid.rup_grid("reloadGrid");
											}
										}				                
						                //return true;
						            }
						    }, 300));
						};
					}
			}
	}
	});

	/* VALORES POR DEFECTO */
	$.fn.rup_maint.defaults = {
		name: null,
		jQueryGrid: null,
		MODO: null,//"new",
		imgPath: $.rup.RUP + "/basic-theme/images",
		detailDiv: null,
		searchForm: null,
		detailForm: null,
		eventCreateDetailForm: undefined,
		toolbar: null,	
		showFeedback: true,//para que se mantenga el area de feedback siempre
		feedback: null,
		autoAjustToolbar: true,
		createDefaultToolButtons: true,
		primaryKey: null,//clave primaria del mantenimiento
		showMessages: false,
		validationMode: "individual",//validación de los campos del formulario de forma individual a la hora de perder el foco. Tambien puede ser por formulario, form.
		modelObject: null, //referencia con el objecto de la Entidad,
		detailButtons: $.rup.maint.detailButtons.SAVE_REPEAT,
		rupCheckStyle: true, //propiedad que indica si se muestran los mensajes causados por no ajustarse a ARISTA,
		detailServer: true,
		parent: null,
		//EVENTOS
		onbeforeDetailShow: null,
		onafterDetailShow: null,
		showMultiselectAlerts: true
	};		
})(jQuery);