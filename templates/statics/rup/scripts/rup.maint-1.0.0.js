//NO EDITAR
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
						var ids = this.prop.jQueryGrid.rup_grid("getDataIDs"), numTotal = Number(ids[ids.length - 1]) + 1;
						this.prop.jQueryGrid.rup_grid("addRowData", numTotal, {}, "first");
						this.prop.jQueryGrid.rup_grid("setSelection", numTotal, false);
								
						$(this).rup_maint("editElement", numTotal, true);//True para que no cambie el modo nochangemode
				} else {//resto de mantenimientos
					this.prop.MODO = "new";
					this.prop.detailForm.resetForm();
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
			//TODO habra que poner el disable del toolbar
			this[0].prop.btnCancel.button("option", "disabled", true);
			this[0].prop.feedback.rup_feedback("close");
		},
		updateDetailPagination : function (rowPos, totalElements) {
			return this.each(function () {
				$("#rup_maint_selectedElements").html("" + 
						rowPos + " " +
						$.rup.i18n.rup_maint.de + " " + 
						totalElements + " " + 
						$.rup.i18n.rup_maint.elements);						
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
				
				$.ajax({
					url: detailURL,
					dataType: 'json',
					type: "GET",
					contentType: 'application/json',		    
					success: function (xhr, ajaxOptions) {
						var rowPos, page = mnt.prop.jQueryGrid.rup_grid("getGridParam", "page"), totalRows, rowsXpage, totalElements;
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
							rowPos = ((parseInt(page) * parseInt(rowsXpage)) - parseInt(rowsXpage)) + parseInt(id);
						}
						$(mnt).rup_maint("updateDetailPagination", rowPos, totalElements);
						if ($.isFunction(mnt.prop.onbeforeDetailShow)) {
							mnt.prop.onbeforeDetailShow.call(mnt, mnt.prop.detailDiv);
						}
						if (xhr.id && xhr.id instanceof Object){//estamos en JPA
							if (xhr.id instanceof Object) {//es que estamos en jpa y traemos una clave compuesta
								xhr["JPA_ID"] = xhr.id;
								delete xhr.id;
							}
						}
						$.rup_utils.populateForm($.rup_utils.jsontoarray(xhr), mnt.prop.detailForm);
						//Gestor de cambios
						mnt.prop.detailForm.data('initialData', mnt.prop.detailForm.serialize());
						if (mnt.prop.detailDiv.rup_dialog("isOpen")) {
							if ($.isFunction(mnt.prop.onafterDetailShow)) {
								mnt.prop.onafterDetailShow.call(mnt, mnt.prop.detailDiv);
							}
						} else {
							mnt.prop.detailDiv.rup_dialog("open");
							//establecemos el foco al primer elemento
							$("input:first",mnt.prop.detailForm).focus();
						}
						
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
					if (rowColModel[i].rupType === "datepicker") {
						$("#" + rowN + "_" + rowColModel[i].name).rup_date(/*{
						    dateFormat : rowColModel[i].editoptions.dateFormat						   
						}*/);
					}
				}
			}//for 
			//$('input.editable').unbind("keydown");
			var lastColName = rowColModel[rowColModel.length-1].name;
			//validaciones individuales
			$(".validableElem").live('change', function () {
				var data = [], elem = this;
				data.push({name: "property", value: this.name});
				data.push({name: "bean", value: $("#" + mntName)[0].prop.modelObject});
				data.push({name: "value", value: $(this).val()});
				$.ajax({
					url: '../validate',
					dataType: 'json',
					type: "POST",
					data: data,
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
					success: function (xhr, ajaxOptions) {
						$("#" + mntName)[0].prop.feedback.rup_feedback("close");
					},
					error: function (xhr, ajaxOptions, thrownError) {
						var errorTXT = $.rup.i18n.rup_maint.validateError, errors = null, errorKey = null, causedErrors = null, errMsg = "", errorMesg = "";
						if (xhr.responseText !== null && xhr.responseText !== "") {	
							if (xhr.status === 406) {//si ha habido algun error en las validaciones...
								errors = eval("(" + xhr.responseText + ")");
								if (errors.length === 2) {//comprobamos que tenemos 2 elementos el primero es el modelObject que a causado el error y el segundo es el objecto con los errores que ha causado
									causedErrors = eval("(" + errors[1] + ")");
									errorTXT = errorTXT + "<ul class='rup-maint_feedbackUL'>";
									$.each(causedErrors, function (key, value) {
										if ($("#" + key).parent().find("label").length === 1) { //intenetamos acceder al label asociado al campo a ha fallado a la hora de la validación para obtener su texto
											errorKey = $("#" + key).parent().find("label").text();
										} else {
											if (settings.rupCheckStyle) {
												$.rup.msgAlert({message: $.rup.i18n.rup_global.rupCheckStyleError});
											}
											errorKey = key;
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
											$("#" + key).parent().append("<img class='rup-maint_validateIcon' title='" + errMsg + "' src='" + $("#" + mntName)[0].prop.imgPath + "/exclamation.png'>");
										
										}											
										errorTXT = errorTXT + "</ul>";
									});
									errorTXT = errorTXT + "</ul>";
									$("#" + mntName)[0].prop.feedback.rup_feedback("option", "delay", null);
									$("#" + mntName)[0].prop.feedback.rup_feedback("set", errorTXT, "error");
									$("#" + mntName)[0].prop.feedback.rup_feedback("option", "delay", 1000);
									//le establecemos el foco al que ha causado el error.
									$(elem).focus();
									return false;
								}
							} else {
								$("#" + mntName)[0].prop.feedback.rup_feedback("option", "delay", null);
								$("#" + mntName)[0].prop.feedback.rup_feedback("set", errorTXT, "error");								
								$("#" + mntName)[0].prop.feedback.rup_feedback("option", "delay", 1000);
							}
						}
					}
				});
			});
			$("input[name='" + lastColName + "']", relatedGrid).bind("keydown", function(event) {	
				var numPag = 0, page = relatedGrid.rup_grid("getGridParam", "page");
				if (event.keyCode == 9) { // TAB
					if (!event.shiftKey) {
						//debugger;
						if ($(this).hasClass("hasDatepicker")) {
							$(this).datepicker("hide");
						}
						relatedGrid.rup_grid('saveRow', rowN, rup_maint.saveEditableSucces, "clientArray", null, rup_maint.aftersavefunc, rup_maint.saveEditableError, null);
						//$("#" + mntName).rup_maint("saveMaint");
						//relatedGrid.rup_grid("saveRow", rowId);
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
						return false;
					}
				}
			});
			$("#" + rowN + " .editable:first", relatedGrid).focus();
		},
		saveEditableError : function () {
		},
		saveEditableSucces : function () {
		},
		saveEditable : function () {//evento que se lanza cuando se deja de editar la fila en edición
			$(this).rup_maint("saveMaint");
		},
		restore: function () {//evento que se lanza al restaurar la fila.
			//TODO deshabilitar el conto cancelar
			var maint = $("#" + $.data(this, "maintName"));
			maint[0].prop.btnCancel.button("option", "disabled", true);
			maint.data('initialData', null);
			maint[0].prop.feedback.rup_feedback("close");
			if (maint[0].prop.MODO === "new") {//si estsmos dando de alta un registro e intentamos volver a pulsar el boton de nuevo
				maint[0].prop.jQueryGrid.rup_grid("delRowData",maint[0].prop.jQueryGrid.rup_grid("getGridParam",'selrow'));
			}
		},	
		aftersavefunc : function (rowid, res) {//Evento que se lanza cuandos e termina de editar
			if (res) {
				$("#" + $.data(this, "maintName")).rup_maint("saveMaint", null);
			}
		},
		checkOutOfGrid : function (evt, obj) {
			if (evt.target.id === "") {
				if($("#gbox_GRID_persona").find("." + evt.target.className).length > 0) {
					return false;
				} else {//Que no sea el boton de cancelar el que coja el foco
					if (this[0].prop.toolbar !== null && $(evt.target).find(".rup-maint_cancel").length > 0) {// Si tengo toolbar
						return false;
					}
				}
			} else {
				if ($("#gbox_GRID_persona").find("#" + evt.target.id).length > 0 ) {
					return false;
				}
			}
			if (this[0].prop.jQueryGrid.rup_grid("isEditable")) {
				if (this[0].prop.jQueryGrid.rup_grid("isEditing")) {
					//alert("checkOut");
					//debugger;
					//Si estoy editando alguna fila tengo que guardar
					if (this[0].prop.MODO === "new") {//si estamos dando de alta un registro e intentamos volver a pulsar el boton de nuevo
						$("#" + this[0].prop.lastsel + " .editable:first", this[0].prop.jQueryGrid).focus();
						return false;
					}
					this[0].prop.jQueryGrid.rup_grid('saveRow', this[0].prop.lastsel, rup_maint.saveEditableSucces, "clientArray", null, rup_maint.aftersavefunc, rup_maint.saveEditableError, null);
					return false;
				}
			}
		},
		editElement: function (id, noChangeMode) {//Edita la fila que recibe como parametro
			return this.each(function () {
				if (id !== null) {
					var rowPos, page, totalRows, rowsXpage, totalElements, mnt = $(this);
					if (!noChangeMode) {
						this.prop.MODO = "edit";
					}
					//Si el mantenimiento es editable
					if (this.prop.jQueryGrid.rup_grid("isEditable")) {
						//$(document).bind("mousedown", function (event){mnt.rup_maint("checkOutOfGrid", event, this);});
						//this.prop.toolbar.unbind("mousedown");
						//adjuntamos los mouseDown para que cuando se realice alguna acción fuera del grid se guarde
						$("#gbox_" + this.prop.jQueryGrid[0].id).parent().bind("mousedown", function (event){mnt.rup_maint("checkOutOfGrid", event, this);});
						this.prop.searchForm.parent().bind("mousedown", function (event){mnt.rup_maint("checkOutOfGrid", event, this);});
						
						//this.prop.jQueryGrid.parent().parent().parent().parent().parent().bind("mousedown", function (event){mnt.rup_maint("checkOutOfGrid", event, this);});
						this.prop.btnCancel.button("option", "disabled", false);
						if (id == this.prop.lastsel) {//si vuelvo a pintxar dos veces sobre la misma fila
							this.prop.jQueryGrid.rup_grid("editRow", id, true, rup_maint.onBeforeEdit, 
									rup_maint.saveEditable, "clientArray", null, rup_maint.aftersavefunc, null, rup_maint.restore);
							mnt.data('initialData', $.toJSON(this.prop.jQueryGrid.rup_grid("getEditingRowData", id)));
							this.prop.lastsel = id; 
							//lanzar el after edit
							if ($.isFunction(this.prop.onafterDetailShow)) {
								this.prop.onafterDetailShow.call(this, id);
							}
							//return false;
						} else if (id && id !== this.prop.lastsel) { 		
							if (this.prop.lastsel !== null) {
								if (mnt.data('initialData') === null) {//si he guardado y ha ido bien se pone el initialdata a null con lo que hay que editar y listo 
									this.prop.jQueryGrid.rup_grid("editRow", id, true, rup_maint.onBeforeEdit, 
											rup_maint.saveEditable, /*editUrl*/ "clientArray", null, rup_maint.aftersavefunc, 
											null, rup_maint.restore);
									mnt.data('initialData', $.toJSON(this.prop.jQueryGrid.rup_grid("getEditingRowData", id)));
									this.prop.lastsel = id;
									//lanzar el after edit
									if ($.isFunction(this.prop.onafterDetailShow)) {
										this.prop.onafterDetailShow.call(this, id);
									}
									return false;
								} else {							
									//Gestion del cambio
									if ($.toJSON(this.prop.jQueryGrid.rup_grid("getEditingRowData", this.prop.lastsel)) === mnt.data('initialData')) {//si no ha habido cambios entre lo almacenado en initialData con los datos del grid
										this.prop.jQueryGrid.rup_grid("restoreRow", this.prop.lastsel);
									} else {//si ha habido cambiso mostrar el mensaje de confirmacion
										//this.prop.jQueryGrid.rup_grid("setSelection", this.prop.lastsel);
										//guardamos la fila anterior
										this.prop.jQueryGrid.rup_grid('saveRow', this.prop.lastsel, rup_maint.saveEditableSucces, "clientArray", null, rup_maint.aftersavefunc, rup_maint.saveEditableError, null);
										//return false;
									}
								}
							}
							this.prop.jQueryGrid.rup_grid("editRow", id, true, rup_maint.onBeforeEdit, 
									rup_maint.saveEditable, "clientArray", null, rup_maint.aftersavefunc, null, 
									rup_maint.restore);
							mnt.data('initialData', $.toJSON(this.prop.jQueryGrid.rup_grid("getEditingRowData", id)));
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
						if (this.prop.detailServer || this.prop.jQueryGrid.rup_grid("isMultiselect")) {
							$(this).rup_maint("loadDetailFromServer", id, this.prop.detailForm);
							return false;
						} else {
							page = this.prop.jQueryGrid.rup_grid("getGridParam", "page");
							totalElements = this.prop.jQueryGrid.rup_grid("getGridParam", "records");
							rowsXpage = this.prop.jQueryGrid.rup_grid("getGridParam", "rowNum");
							/*total de paginas*/
							rowPos = ((parseInt(page) * parseInt(rowsXpage)) - parseInt(rowsXpage)) + parseInt(id);
							$(this).rup_maint("updateDetailPagination", rowPos, totalElements);
							if ($.isFunction(this.prop.onbeforeDetailShow)) {
								this.prop.onbeforeDetailShow.call(this, this.prop.detailDiv);
							}
							this.prop.jQueryGrid.rup_grid("GridToForm", id, this.prop.detailForm);						
							this.prop.detailDiv.rup_dialog("open");
							//establecemos el foco al primer elemento
							$("input:first",this.prop.detailForm).focus();
						}
					}
				} else { 
					alert($.rup.i18n.rup_grid.nav.alerttext); 
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
							message: $.rup.i18n.rup_maint.noReg,
							title: $.rup.i18n.rup_maint.titleDelAll
						});
					} else {
						$.rup_messages("msgConfirm", {
							message: $.rup.i18n.rup_maint.deleteAll,
							title: $.rup.i18n.rup_maint.titleDelAll,
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
								$.ajax({
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
										//var delOK = mnt.prop.jQueryGrid.rup_grid("delRowData", id);
										if (mnt.prop.showMessages) {
											mnt.prop.feedback.rup_feedback("set", $.rup.i18n.rup_maint.deletedOK, "ok");
										}
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
					if (this.prop.jQueryGrid.rup_grid("isEditable")) {//si estamos en grid editable
						if (this.prop.jQueryGrid.rup_grid("isEditing")) {//si estamos editando
							//Si estoy editando alguna fila tengo que guardar
							if (this.prop.MODO === "new") {//si estsmos dando de alta un registro e intentamos volver a pulsar el boton de nuevo
								//$("#" + this.prop.lastsel + " .editable:first", this.prop.jQueryGrid).focus();
								$(this).cancelEditing();
								return false;
							}
							this.prop.jQueryGrid.rup_grid('restoreRow', id);
						}	
					}
					rowData = this.prop.jQueryGrid.getRowData(id);
					if (rowData !== null) {//si tenemnos datos
						if (this.prop.primaryKey.indexOf(";") > 0) {//si tenemos clave compuesta
							arrayPK = this.prop.primaryKey.split(";"); 
							lng = arrayPK.length;
							for (i = 0; i < lng; i++) {
								maintID = maintID + "/" +  rowData[arrayPK[i]];
							}
						} else {
							maintID = "/" + rowData[this.prop.primaryKey];//obtenemos el valor de la celda de la clave primaria, 
						}
						url = this.prop.jQueryGrid[0].rup_gridProps.url + maintID;
					} else {
						return false;
					}
					$.ajax({
							url: url,
							dataType: 'json',
							data: jsonData,
							async: false,
							type: "DELETE",
							contentType: 'application/json',
							success: function (xhr, ajaxOptions) {
								var delOK = mnt.prop.jQueryGrid.rup_grid("delRowData", id);
								if (mnt.prop.showMessages) {
									mnt.prop.feedback.rup_feedback("set", $.rup.i18n.rup_maint.deletedOK, "ok");
								}
								if (mnt.prop.jQueryGrid.rup_grid("getDataIDs").length > 0) {//seleccionamos la primera fila
									mnt.prop.jQueryGrid.rup_grid("setSelection", mnt.prop.jQueryGrid.rup_grid("getDataIDs")[0], false);
								}
							},
							error: function (xhr, ajaxOptions, thrownError) {
								mnt.prop.feedback.rup_feedback("option", "delay", null);
								mnt.prop.feedback.rup_feedback("set", xhr.responseText, "error");
								mnt.prop.feedback.rup_feedback("option", "delay", 1000);
							}
						});
				}
			});
		},
		saveMaint : function (saveAndRepeat) {
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
				dt, parent, parentColPks, parentSelectedRow, parentPKObject = {}, aux;
				if (mant.prop.jQueryGrid.rup_grid("isEditable")) {
					dt = mant.prop.jQueryGrid.rup_grid("getRowData", mant.prop.jQueryGrid.rup_grid("getSelectedRows")[0]);//$.toJSON(data);
					for (i in dt) {//solo se envian los datos con valor como cuando es edicion en fomrulario
						if (dt[i] == ""){
							delete dt[i];
						}
						aux = i.split(".");
						
						if (aux.length > 1){
							if (dt[i.split(".")[0]]==null || dt[i.split(".")[0]]==undefined) {
								dt[i.split(".")[0]]={};
							}
							dt[i.split(".")[0]][i.split(".")[1]] = dt[i];
							delete dt[i];
						}
					}
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
						//var pkLabel = parentColPks[0].substring(0,1).toUpperCase() + parentColPks[0].substring(1); 
						parentPKObject[parent[0].prop.modelObject.toLowerCase()] = {};
						parentPKObject[parent[0].prop.modelObject.toLowerCase()][parentColPks[0]] = parent[0].prop.jQueryGrid.rup_grid("getCol", parentSelectedRow, parentColPks[0]);
					}
					$.extend(true, dt, parentPKObject);//mergeamos los dos objectos, solo se sobreesciben las propiedades que tenga el primero y el segundo iguales con el valor del segundo
				}
				var init = eval("("+$(mant).data('initialData')+")");
				//if ($.toJSON(this.prop.jQueryGrid.rup_grid("getEditingRowData", this.prop.lastsel)) === mnt.data('initialData')) {//si no ha habido cambios entre lo almacenado en initialData con los datos del grid
				//dt !== $(mant).data('initialData')
				if ((mant.prop.jQueryGrid.rup_grid("isEditable") && !$.rup_utils.compareObjects(dt,init)) 
						|| ( mant.prop.detailForm && mant.prop.detailForm.serialize() !== mant.prop.detailForm.data('initialData'))) {
					dt = $.toJSON(dt);
					$.ajax({					
						url: mant.prop.jQueryGrid[0].rup_gridProps.url,
						dataType: 'json',
						type: (mant.prop.MODO === 'new' ? "POST" : "PUT"),
						async: false,
						data: dt,	
						contentType: 'application/json',		    
						success: function (xhr, ajaxOptions) {
							mant.prop.feedback.rup_feedback("close");
							if (mant.prop.jQueryGrid.rup_grid("isEditable")) {//Si es un maint editable
								if (mant.prop.showMessages) {
									if (mant.prop.MODO === 'new') { //Mostrar los mensajes dependiendo el modo
										mant.prop.feedback.rup_feedback("set", $.rup.i18n.rup_maint.insertOK, "ok");
									} else {
										mant.prop.feedback.rup_feedback("set", $.rup.i18n.rup_maint.modifyOK, "ok");
									}
								}
								$(mant).data('initialData',null);	
								mant.prop.jQueryGrid.rup_grid("restoreRow", mant.prop.lastsel);
								//TODO deshabilitar el boton de cancelar
								mant.prop.btnCancel.button("option", "disabled", true);
							} else {//si no es editable
								if (saveAndRepeat) { //si es guardar y repetir
									if (mant.prop.showMessages) {
										if (mant.prop.MODO === 'new') { //Mostrar los mensajes dependiendo el modo
											mant.prop.detailForm.resetForm();
											mant.prop.detailFeedback.rup_feedback("set", $.rup.i18n.rup_maint.insertOK, "ok");
										} else {
											mant.prop.detailFeedback.rup_feedback("set", $.rup.i18n.rup_maint.modifyOK, "ok");
										}
									}
									//reiniciamos el gestor de cambios
									mant.prop.detailForm.data('initialData', mant.prop.detailForm.serialize());
								} else {
									mant.prop.detailForm.resetForm();
									if (mant.prop.showMessages) {
										if (mant.prop.MODO === 'new') { //Mostrar los mensajes dependiendo el modo
											mant.prop.feedback.rup_feedback("set", $.rup.i18n.rup_maint.insertOK, "ok");
										} else {
											mant.prop.feedback.rup_feedback("set", $.rup.i18n.rup_maint.modifyOK, "ok");
										}
									}
									mant.prop.detailDiv.rup_dialog("close");
								}
								//Dependiendo del modo en el que este el mantenimiento hay que añadir una nueva fila o actualizar la seleccionada
								if (mant.prop.MODO === "new") {
									var ids = mant.prop.jQueryGrid.rup_grid("getDataIDs"), rowN = Number(ids[ids.length - 1]) + 1;
									mant.prop.jQueryGrid.rup_grid("addRowData", rowN, xhr, "first");
									mant.prop.MODO = null;
									mant.prop.jQueryGrid.rup_grid("setSelection", rowN, false);
								} else if (mant.prop.MODO === "edit"){
									if (mant.prop.jQueryGrid.rup_grid("isMultiselect")) {
										var aCurrentRow = mant.prop.currentSelectedRow.split(";");//su forma es "p_1;id_2"
										mant.prop.jQueryGrid.rup_grid("setRowData", $.inArray(aCurrentRow[1],mant.prop.selectedRows[aCurrentRow[0]]) + 1/*getRowidFromPk(p, id)*/, xhr);
									} else {
									mant.prop.jQueryGrid.rup_grid("setRowData", mant.prop.jQueryGrid.rup_grid("getSelectedRows")[0], xhr);
								}
							}
							}
							return false;
						},
						error: function (xhr, ajaxOptions, thrownError) {
							var errorTXT = $.rup.i18n.rup_maint.validateError, errors = null, errorKey = null, 
							causedErrors = null, errMsg = "", errorMesg = "", preMode;
							if (xhr.responseText !== null && xhr.responseText !== "") {	
								if (xhr.status === 406) {//si ha habido algun error en las validaciones...
									errors = eval("(" + xhr.responseText + ")");
									if (errors.length === 2) {//comprobamos que tenemos 2 elementos el primero es el modelObject que a causado el error y el segundo es el objecto con los errores que ha causado
										causedErrors = eval("(" + errors[1] + ")");
										errorTXT = errorTXT + "<ul class='rup-maint_feedbackUL'>";
										$.each(causedErrors, function (key, value) {
											if ($("#" + key).parent().find("label").length === 1) { //intenetamos acceder al label asociado al campo a ha fallado a la hora de la validación para obtener su texto
												errorKey = $("#" + key).parent().find("label").text();
											} else {
												if (mant.prop.rupCheckStyle) {
													$.rup.msgAlert({message: $.rup.i18n.rup_global.rupCheckStyleError});
												}
												errorKey = key;
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
											mant.prop.jQueryGrid.rup_grid("editRow", mant.prop.lastsel, true, rup_maint.onBeforeEdit, 
													rup_maint.saveEditable, "clientArray", null, rup_maint.aftersavefunc, null, rup_maint.restore);
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
								} else {//error datos incorrectos
									if (mant.prop.jQueryGrid.rup_grid("isEditable")) {
										mant.prop.feedback.rup_feedback("option", "delay", null);
										mant.prop.jQueryGrid.rup_grid("editRow", mant.prop.lastsel, true, rup_maint.onBeforeEdit, 
												rup_maint.saveEditable, "clientArray", null, rup_maint.aftersavefunc, null, rup_maint.restore);
										mant.prop.feedback.rup_feedback("set", xhr.responseText, "error");
										mant.prop.feedback.rup_feedback("option", "delay", 1000);
									} else {
										mant.prop.detailFeedback.rup_feedback("option", "delay", null);
										mant.prop.detailFeedback.rup_feedback("set", xhr.responseText, "error");								
										mant.prop.detailFeedback.rup_feedback("option", "delay", 1000);
									}
								}
							} else {//ha ocurrido un erro no contralado
								if (mant.prop.jQueryGrid.rup_grid("isEditable")) {
									mant.prop.feedback.rup_feedback("option", "delay", null);
									mant.prop.feedback.rup_feedback("set", "Error " + xhr.status + " : " + xhr.statusText + ". Consulte con el administrador", "error");
									mant.prop.feedback.rup_feedback("option", "delay", 1000);
								} else { 
									mant.prop.detailFeedback.rup_feedback("option", "delay", null);
									mant.prop.detailFeedback.rup_feedback("set", "Error " + xhr.status + " : " + xhr.statusText + ". Consulte con el administrador", "error");
									mant.prop.detailFeedback.rup_feedback("option", "delay", 1000);
								}
								
							}
							if (!mant.prop.jQueryGrid.rup_grid("isEditable")) {
							//establecemos el valor del gestor de cambios por si le dan a cancelar despues de dar un error
							mant.prop.detailForm.data('initialData', mant.prop.detailForm.serialize());
							}
							return false;
						},
						beforeSend: function (xhr) {
							xhr.setRequestHeader("validation", "true");
							xhr.setRequestHeader("bean", mant.prop.modelObject);
						}
					});
				} else {//si no se lanza la peticion es porque no ha habido cambios con lo que hay que reiniciar el initialData a null
					if (mant.prop.jQueryGrid.rup_grid("isEditable") && dt === $(mant).data('initialData')){
						$(mant).data('initialData', null);
					}
					if (!mant.prop.jQueryGrid.rup_grid("isEditable")) {//Si el mantenimiento no es editable cerramos la ventana modal y reinicimos el valor initialData
						if (!saveAndRepeat) {//si es guardar solo se cierra la ventana modal
							if (!mant.prop.detailFeedback.is(':visible')) {//si hay algun error no hago nada
								mant.prop.detailDiv.rup_dialog("close");
								mant.prop.detailForm.data('initialData', null);
							}
						} else {//si se le da a guardar y repetir
							if (!mant.prop.detailFeedback.is(':visible')) {//si hay algun error no hago nada
								mant.prop.detailFeedback.rup_feedback("option", "delay", null);
								mant.prop.detailFeedback.rup_feedback("set", $.rup.i18n.rup_maint.emptyChanges, "alert");
								mant.prop.detailFeedback.rup_feedback("option", "delay", 1000);
							}
						}
						
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
						$("#" + capa).show("slow");
						$('#titleSearch_' + this.prop.name).text($.rup.i18n.rup_maint.searchOptions);
					} else {
						$("#" + capa).slideUp("slow");				
						aux = this.prop.searchForm.serializeArray();
						for (i = 0; i < aux.length; i++) {
							if (aux[i].value !== "") {
								searchString = searchString + $("#" + this.prop.searchForm[0].id + " [name=" + aux[i].name + "]").parent().find('div').html() + " = " + aux[i].value + " ";
							}
						}
						//searchString = " " + $("#" + this.prop.searchForm[0].id + " :input[value]").serialize().replace(/&/g, " "); 
						if (searchString.length > 1024) {
							temp = searchString.substring(0, 1024);
							temp += "...";
						}
						$('#titleSearch_' + this.prop.name).append("<i>" + searchString + "</i>");
					}
				}
			});
		},
		search : function (page) {//Lanza la busqueda del mantenimiento obteniendo los datos del formulario de busqueda
			return this.each(function () {
				//cerrar el feedback del los mensajes
				this.prop.feedback.rup_feedback("close");
				//IMPORTANTE:::para que no haya probelams con los mant mestro detalle ya que sino no se lanzaban el gridcomplete del primero y no se quitaban lo de no regitros y no aparecia lo de la paginacion
				this.prop.jQueryGrid[0].p.ajaxGridOptions = {async: false};
				this.prop.jQueryGrid.rup_grid("setGridParam", {url: this.prop.jQueryGrid[0].rup_gridProps.url, datatype: 'json', mtype: "GET", page: (page ? page : 1)});
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
				this.prop.searchForm.resetForm();
				if (this.prop.jQueryGrid[0].rup_gridProps.loadOnStartUp) {//si el grid se carga al arrancar la ventana cuando se limpia el formulario se debe vovler a lanzar la carga del grid sino se borran los datos y listo
					//Hay que vovler a establecer la URL incial para que no relance la busqueda con el querystring incorrecto
					this.prop.jQueryGrid.rup_grid("setGridParam", {url: this.prop.jQueryGrid[0].rup_gridProps.url, page: 1});
					this.prop.jQueryGrid.rup_grid("reloadGrid");
				} else {
					if (this.prop.jQueryGrid.rup_grid("getDataIDs").length > 0) {				
						this.prop.jQueryGrid.rup_grid("clearGridData");
					}
				}
			});
		}
	});
	//Métodos privados 
	$.fn.rup_maint("extend",{
		_addChild : function (maintName) {//Se añaden los hijos al padre
				var aChildren = [];
				if (this.data("_children") !== null && this.data("_children") !== undefined) {
					aChildren = this.data("_children");
				}
				aChildren.push(maintName);
				this.data("_children", aChildren);
		}
	});

	$.fn.rup_maint("extend", {
		_init : function(properties) {
			//return this.each(function () {
			var t = this, btSearch, lnkClean, btDiv, self, settings = {};
			self = this;
			function addValidation() {//añade las validaciones a todos los elementos con class validableElem 
				$(".validableElem").live('change', function () {
					var data = [], elem = this;
					data.push({name: "property", value: this.name});
					data.push({name: "bean", value: settings.modelObject});
					data.push({name: "value", value: $(this).val()});
					$.ajax({
						url: '../validate',
						dataType: 'json',
						type: "POST",
						data: data,
						contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
						success: function (xhr, ajaxOptions) {
							elem = null;
							settings.detailFeedback.rup_feedback("close");
						},
						error: function (xhr, ajaxOptions, thrownError) {
							var errorTXT = $.rup.i18n.rup_maint.validateError, errors = null, errorKey = null, causedErrors = null, errMsg = "", errorMesg = "";
							if (xhr.responseText !== null && xhr.responseText !== "") {	
								if (xhr.status === 406) {//si ha habido algun error en las validaciones...
									errors = eval("(" + xhr.responseText + ")");
									if (errors.length === 2) {//comprobamos que tenemos 2 elementos el primero es el modelObject que a causado el error y el segundo es el objecto con los errores que ha causado
										causedErrors = eval("(" + errors[1] + ")");
										errorTXT = errorTXT + "<ul class='rup-maint_feedbackUL'>";
										$.each(causedErrors, function (key, value) {
											if ($("#" + key).parent().find("label").length === 1) { //intenetamos acceder al label asociado al campo a ha fallado a la hora de la validación para obtener su texto
												errorKey = $("#" + key).parent().find("label").text();
											} else {
												if (settings.rupCheckStyle) {
													$.rup.msgAlert({message: $.rup.i18n.rup_global.rupCheckStyleError});
												}
												errorKey = key;
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
												$("#" + key).parent().append("<img class='rup-maint_validateIcon' title='" + errMsg + "' src='" + settings.imgPath + "/exclamation.png'>");
											
											}											
											errorTXT = errorTXT + "</ul>";
										});
										errorTXT = errorTXT + "</ul>";
										settings.detailFeedback.rup_feedback("option", "delay", null);
										settings.detailFeedback.rup_feedback("set", errorTXT, "error");
										settings.detailFeedback.rup_feedback("option", "delay", 1000);
									}
								} else {
									settings.detailFeedback.rup_feedback("option", "delay", null);
									settings.detailFeedback.rup_feedback("set", errorTXT, "error");								
									settings.detailFeedback.rup_feedback("option", "delay", 1000);
								}
							}
						}
					});
				});
			}
			function createData() {//Se crea el formulario de detalle haciendo uso del colModel del grid
				var dtForm = $("<form>").attr('id', 'detailForm_' + settings.name),
				obj = settings.jQueryGrid[0], 
				nm, hc, trdata, cnt = 0, tmp, dc, elc, retpos = [], ind = false;
				$(obj.p.colModel).each(function (i) {
						nm = this.name;
						if (this.editrules && this.editrules.edithidden === true) {
							hc = false;
						} else {
							hc = this.hidden === true ? true : false;
						}
						dc = hc ? "style='display:none'" : "";
						if (nm !== 'cb' && nm !== 'subgrid' && this.editable === true && nm !== 'rn') {
							if (ind === false) {
								tmp = "";
							} else {
								if (nm === obj.p.ExpandColumn && obj.p.treeGrid === true) {
									tmp = $("td:eq(" + i + ")", obj.rows[ind]).text();
								} else {
									try {
										tmp =  $.unformat($("td:eq(" + i + ")", obj.rows[ind]), {rowId: rowid, colModel: this}, i);
									} catch (_) {
										tmp = $("td:eq(" + i + ")", obj.rows[ind]).html();
									}
								}
							}
							var opt = $.extend({}, this.editoptions || {}, {id: nm, name: nm}),
							frmopt = $.extend({}, {elmprefix: '', elmsuffix: '', rowabove: false, rowcontent: ''}, this.formoptions || {}),
							rp = parseInt(frmopt.rowpos, 10) || cnt + 1,
							cp = parseInt((parseInt(frmopt.colpos, 10) || 1) * 2, 10),
							elcClass = "";
							if (!this.edittype) { 
								this.edittype = "text"; 
							}
							if (obj.p.autoencode) { 
								tmp = $.jgrid.htmlDecode(tmp);
							}
							elc = createEl(this.edittype, opt, tmp, false, $.extend({}, $.jgrid.ajaxOptions, obj.p.ajaxSelectOptions || {}));
							
							elcClass = 'formulario_linea_input';
							$(elc).attr('class', elcClass);
							
							if (this.rupType === "datepicker") {
								$(elc).datepicker({dateFormat: 'dd/mm/yy'});
								$(elc).addClass("datepicker");							
							} else if (this.rupType === "numeric") {
								$(elc).addClass("numeric");
							}
							
							if (settings.validationMode === "individual" && this.editRules && this.editRules.validate) {//si el modo de validación es individual y el campo es validable
								$(elc).addClass("validableElem");
							}
							
							dc = $("<div>").attr("id", "rup-maint_detailInput_" + elc.id).addClass("floating_left_pad_right").append("<p>").html("<label for='" + elc.id + "' >" + (typeof frmopt.label === 'undefined' ? obj.p.colNames[i]: frmopt.label) + "</label>").append("<br>").append(elc).appendTo(dtForm);
						}					
					});
				return dtForm;
			}
			//Paginar al ultimo elemento del grid o de los seleccionados y es multiselección
			function plast(e) {
				var numPag = 0, page = null, gsr = 0;
				t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
				t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					page = t[0].prop.selectedRows[t[0].prop.selectedRows.length - 1];
					numPag = page.substring(2, page.length);
					gsr = t[0].prop.selectedRows[page][t[0].prop.selectedRows[page].length - 1];
					t[0].prop.currentSelectedRow = page + ";" + gsr;
				} else {					
					numPag = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'lastpage');  
				}
				t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: numPag});
				t[0].prop.jQueryGrid.rup_grid("reloadGrid");	
			}
			//Paginar al primer registro del grid o al primer registro seleccionado
			function pfirst(e) {
				var numPag = 0, page = null, gsr = 0;
				t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
				t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					page = t[0].prop.selectedRows[numPag];
					numPag = page.substring(2, page.length);
					gsr = t[0].prop.selectedRows[page][numPag];
					t[0].prop.currentSelectedRow = page + ";" + gsr;
				} else {					
					numPag = 1;  
				}
				t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: numPag});
				t[0].prop.jQueryGrid.rup_grid("reloadGrid");
				
			}
			//Paginar hacia adelante en el grid ya sea por los seleccionados o por todos
			function pforward(e) {
				var reg = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'selrow'), 
					gsr = -1, last = false, numPag, page = t[0].prop.jQueryGrid.getGridParam('page'),
					p = null, id = null;
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					p = t[0].prop.currentSelectedRow.split(";")[0];
					id = t[0].prop.currentSelectedRow.split(";")[1];
					for (var i = 0; i< t[0].prop.selectedRows[p].length; i++) {
						if (t[0].prop.selectedRows[p][i] === id) {//cuando encuentro el id en el que estoy busco si existe el siguiente
							if (t[0].prop.selectedRows[p][i + 1]) { //si tengo siguiente elemento
								//page = t[0].prop.selectedRows[p].substring(2, t[0].prop.selectedRows[p].length);
								gsr = t[0].prop.selectedRows[p][i + 1].substring(3, t[0].prop.selectedRows[p][i + 1].length);//obtneo el id a seleccionar
								t[0].prop.currentSelectedRow = "p_" + page + ";" + "id_" + gsr;
								break;
							}							 
						}
					}
					if (gsr === -1) {//si no he encontrado hijos siguientes al actual tengo que mirar si tengo mas paginas con hijos
						for (var i = 0; i< t[0].prop.selectedRows.length; i++) {
							if (t[0].prop.selectedRows[i] === p) {
								if (i === t[0].prop.selectedRows.length) {//si es el ultimo elemento y la ultima pagina no puedo seguir paginando
									return;
								} else 
								if (t[0].prop.selectedRows[i + 1]) {//si tengo siguiente página
									gsr = t[0].prop.selectedRows[t[0].prop.selectedRows[i + 1]][0].substring(3, t[0].prop.selectedRows[t[0].prop.selectedRows[i + 1]][0].length);
									//se coge la pagina del array de selectedRows porque puede que no sea la pagina actual que es a lo que se incializa el page
									page = parseInt(t[0].prop.selectedRows[i + 1].substring(2, t[0].prop.selectedRows[i + 1].length)) - 1;
									t[0].prop.currentSelectedRow = "p_" + (parseInt(page) + 1) + ";" + "id_" + gsr;
									break;
								} else {//aunque no tengo pagina siguiente en el selectedRows si tengo  pks en el array de oldselecteds
									if (t[0].prop.jQueryGrid.data("old_selectRows").length) {
										//comprobar si se ha ordenado el grid para obtener los siguientes hijos que esten en ese array que estaran en otra pagina, sin saber cual puede ser
										t[0].prop.currentSelectedRow = "p_" + (parseInt(page) + 1) + ";" + "id_FFF";
										//lanza la busqueda actualizando el t[0].prop.currentSelectedRow actualizado
										t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
										t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
										t[0].prop.jQueryGrid[0].p.ajaxGridOptions = {async:false};
										t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: parseFloat(page) + 1});
										t[0].prop.jQueryGrid.rup_grid("reloadGrid");
										//una vez lanzado el reload sino hay nonguna seleccionada y tengo todavia en old vuelvo a paginar
										if (t[0].prop.jQueryGrid.rup_grid("getSelectedRows").length === 0 && t[0].prop.jQueryGrid.data("old_selectRows") && t[0].prop.jQueryGrid.data("old_selectRows").length > 0){
											t[0].prop.jQueryGrid.rup_grid("reloadGrid");
											t[0].prop.jQueryGrid[0].p.ajaxGridOptions = {};
											t[0].prop.currentSelectedRow = "p_" + t[0].prop.jQueryGrid.getGridParam('page') + ";" + "id_" + t[0].prop.jQueryGrid.rup_grid("getSelectedRows")[0];
											return false;
										}
									}									
								}
							}
						}
						//lanza la busqueda actualizando el t[0].prop.currentSelectedRow actualizado
						t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
						t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
						t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: parseFloat(page) + 1});
						t[0].prop.jQueryGrid.rup_grid("reloadGrid");
						return false;
					}
					t[0].prop.detailForm.resetForm();
					if (gsr) {						
						t.rup_maint("editElement", gsr);
					}
					return false;
				}				
				
				for (var i = 0;i < t[0].prop.jQueryGrid.rup_grid("getDataIDs").length; i++) {
					if (t[0].prop.jQueryGrid.rup_grid("getDataIDs")[i] === reg) {
						if ((i + 1) !== t[0].prop.jQueryGrid.rup_grid("getDataIDs").length) {
							gsr = t[0].prop.jQueryGrid.rup_grid("getDataIDs")[i + 1];
							break;
						} else {
							last = true;
						}
					}
				}
				if (last) {
					numPag = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'lastpage');//Math.ceil(settings.jQueryGrid.rup_grid("getGridParam", 'records') / settings.jQueryGrid.rup_grid("getGridParam", 'rowNum'));
					if (parseFloat(page) + 1 <= numPag) {
						t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
						t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
						t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: parseFloat(page) + 1});
						t[0].prop.jQueryGrid.rup_grid("reloadGrid");
					}
					return;
				}
				t[0].prop.jQueryGrid.rup_grid("setSelection", gsr);
				t[0].prop.detailForm.resetForm();
				if (gsr) {
					t.rup_maint("editElement", gsr);
				}
			}
			//paginación hacia atras en el detalle ya sea por los seleccionados o por todos los registros
			function pback(e) { 
				var reg = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'selrow'), 
					encontrado = false, gsr = 0, first = false, mant = null, page = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'page'),
					p = null, id = null, lastElement = null, previousPage = t[0].prop.jQueryGrid.rup_grid("getGridParam", 'page'); //se inicializa el gsr a 0 pq en este caso se pagina hacia atras y el primer elemento es el 0
				//Tratamiento de la multiselección
				if (t[0].prop.jQueryGrid.rup_grid("isMultiselect")) {
					p = t[0].prop.currentSelectedRow.split(";")[0];
					id = t[0].prop.currentSelectedRow.split(";")[1];
					for (var i = 0; i< t[0].prop.selectedRows[p].length; i++) {
						if (t[0].prop.selectedRows[p][i] === id) {//cuando encuentro el id en el que estoy busco si existe el siguiente
							if (i === 0) {//si es el primer elemento hay que intentar paginar a la pagina anterior
								break;
							} else if (t[0].prop.selectedRows[p][i - 1]) { //si tengo elemento anterior								
								gsr = t[0].prop.selectedRows[p][i - 1].substring(3, t[0].prop.selectedRows[p][i - 1].length);//obtengo el id a seleccionar
								t[0].prop.currentSelectedRow = "p_" + page + ";" + "id_" + gsr;
								break;
							}							 
						}
					}
					if (gsr === 0) {//si es el primer elemento de la página tengo que mirar si tengo paginas anteriores con hijos
						for (var i = 0; i < t[0].prop.selectedRows.length; i++) {
							if (t[0].prop.selectedRows[i] === p) {
								if (i === 0) {//si es el primer elemento y es la primera página no puedo seguir paginando haci atras.
									return;
								} else if (t[0].prop.selectedRows[i - 1]) {//si tengo siguiente página
									lastElement = t[0].prop.selectedRows[t[0].prop.selectedRows[i - 1]].length - 1;
									gsr = t[0].prop.selectedRows[t[0].prop.selectedRows[i - 1]][lastElement].substring(3, t[0].prop.selectedRows[t[0].prop.selectedRows[i - 1]][lastElement].length);
									page = parseInt(t[0].prop.selectedRows[i - 1].substring(2, t[0].prop.selectedRows[i - 1].length)) + 1;
									t[0].prop.currentSelectedRow = "p_" + (parseInt(page) - 1) + ";" + "id_" + gsr;
									break;
								} /*else {//si no hay siuiente pagina hay que comprobar que tno tenemos tampoco en las oldselected
									//aunque no tengo pagina siguiente en el selectedRows si tengo  pks en el array de oldselecteds
									if (t[0].prop.jQueryGrid.data("old_selectRows").length) {
										//comprobar si se ha ordenado el grid para obtener los siguientes hijos que esten en ese array que estaran en otra pagina, sin saber cual puede ser
										t[0].prop.currentSelectedRow = "p_" + (parseInt(page) + 1) + ";" + "id_RRR";
										//lanza la busqueda actualizando el t[0].prop.currentSelectedRow actualizado
										settings.jQueryGrid[0].rup_gridProps.sourceEvent = e;
										settings.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
										settings.jQueryGrid[0].p.ajaxGridOptions = {async:false};
										settings.jQueryGrid.rup_grid("setGridParam", {page: parseFloat(page) - 1});
										settings.jQueryGrid.rup_grid("reloadGrid");
										debugger;
										//una vez lanzado el reload sino hay nonguna seleccionada y tengo todavia en old vuelvo a paginar
										if (settings.jQueryGrid.rup_grid("getSelectedRows").length === 0 && settings.jQueryGrid.data("old_selectRows") && settings.jQueryGrid.data("old_selectRows").length > 0){
											debugger;
											settings.jQueryGrid.rup_grid("reloadGrid");
											settings.jQueryGrid[0].p.ajaxGridOptions = {};
											return false;
										}
									}
								}*/
							}
						}
						//lanza la busqueda actualizando el t[0].prop.currentSelectedRow actualizado
						t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
						t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
						t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: parseFloat(page) - 1});
						t[0].prop.jQueryGrid.rup_grid("reloadGrid");
						return false;
					}
					t[0].prop.detailForm.resetForm();
					if (gsr) {						
						t.rup_maint("editElement", gsr);
					}
					return false;
				} else { //Si no es multiselección
					for (var i = 0; i < t[0].prop.jQueryGrid.rup_grid("getDataIDs").length; i++) {
						if (t[0].prop.jQueryGrid.rup_grid("getDataIDs")[i] === reg) {
							if ((i - 1) !== -1) {
								gsr = t[0].prop.jQueryGrid.rup_grid("getDataIDs")[i - 1];
								break;
							} else {
								first = true;
							}
						}
					}
					if (first) {
						if (parseFloat(page) !== 1) {
							t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent = e;
							t[0].prop.jQueryGrid[0].rup_gridProps.sourceEvent.parentMaintName = t[0].id;
							t[0].prop.jQueryGrid.rup_grid("setGridParam", {page: parseFloat(page) - 1});
							t[0].prop.jQueryGrid.rup_grid("reloadGrid");						
						}
						return;
					}
					t[0].prop.jQueryGrid.rup_grid("setSelection", gsr);
					t[0].prop.detailForm.resetForm();
					if (gsr) {
						t.rup_maint("editElement", gsr);
					}
				}
			}
			/**
			 * Funcion que crea los botones de navegación del detalle, es decir, la paginación
			 */
			function createNavigationButtons() {
				$("#back_" + settings.name).click(function (e) {
					if (!$(this).hasClass("ui-state-disabled")) { 	
						if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
							$.rup_messages("msgConfirm", {
								message: $.rup.i18n.rup_maint.saveAndContinue,
								title: $.rup.i18n.rup_maint.changes,
								OKFunction : function () {
									pback(e);
								}
							});								
						} else {
							pback(e);
						}
					}
				});	
				$("#forward_" + settings.name).click(function (e) {
					if (!$(this).hasClass("ui-state-disabled")) {
						if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
							$.rup_messages("msgConfirm", {
									message: $.rup.i18n.rup_maint.saveAndContinue,
									title: $.rup.i18n.rup_maint.changes,
									OKFunction : function () {
										pforward(e);
									}
								});								
						} else {
							pforward(e);
						}
					}
				});	
				$("#first_" + settings.name).click(function (e) { 
					if (!$(this).hasClass("ui-state-disabled")) {
						if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
							$.rup_messages("msgConfirm", {
								message: $.rup.i18n.rup_maint.saveAndContinue,
								title: $.rup.i18n.rup_maint.changes,
								OKFunction : function () {
									pfirst(e);
								}
							});								
						} else {
							pfirst(e);
						}
					}
				});	
				$("#last_" + settings.name).click(function (e) { 
					if (!$(this).hasClass("ui-state-disabled")) {
						if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
							$.rup_messages("msgConfirm", {
								message: $.rup.i18n.rup_maint.saveAndContinue,
								title: $.rup.i18n.rup_maint.changes,
								OKFunction : function () {
									plast(e);
								}
							});								
						} else {
							plast(e);
						}
					}
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
						text: $.rup.i18n.rup_global.save,
						click: function () {
								t.rup_maint("saveMaint");
							}
						},
						{
							text: $.rup.i18n.rup_global.save_repeat,
							click: function () {
								t.rup_maint("saveMaint", true);//Invocamos al guardar del mantenimiento indicando que es guardaryrepetir
							}
						},
						{
							text: $.rup.i18n.rup_global.cancel,
							click: function () { 
								if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
									$.rup_messages("msgConfirm", {
										message: $.rup.i18n.rup_maint.saveAndContinue,
										title: $.rup.i18n.rup_maint.changes,
										OKFunction : function () {
											t[0].prop.detailDiv.rup_dialog("close");
											return false;
										}
									});
								} else {
									t[0].prop.detailDiv.rup_dialog("close");
								}
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
						text: $.rup.i18n.rup_global.save,
						click: function () {
								t.rup_maint("saveMaint");
							}
						},
						{
							text: $.rup.i18n.rup_global.cancel,
							click: function () { 
								if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
									$.rup_messages("msgConfirm", {
										message: $.rup.i18n.rup_maint.saveAndContinue,
										title: $.rup.i18n.rup_maint.changes,
										OKFunction : function () {
										t[0].prop.detailDiv.rup_dialog("close");
											return false;
										}
									});
								} else {
									t[0].prop.detailDiv.rup_dialog("close");
								}								
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
						settings.name + "' alt='" + $.rup.i18n.rup_maint.last +
						"' class='rup-maint_linkPaginacionDetalle'>" + $.rup.i18n.rup_maint.last + 
						"</span><span id='forward_" + settings.name + "' alt='" + $.rup.i18n.rup_maint.next + 
						"' class='rup-maint_linkPaginacionDetalle'>" + $.rup.i18n.rup_maint.next +
						"</span><span id='back_" + settings.name + "' alt='" + $.rup.i18n.rup_maint.previous + 
						"' class='rup-maint_linkPaginacionDetalle'>" + $.rup.i18n.rup_maint.previous +
						"</span><span id='first_" + settings.name + "' alt='" + $.rup.i18n.rup_maint.first + 
						"' class='rup-maint_linkPaginacionDetalle'>" + $.rup.i18n.rup_maint.first + "</span></div>";
			}
			function createDetailForm(withUserForm) {//				
				var detailDiv = null, detaiBody = "", buttons = "", detailFeedBack = "", formu = null, 
				capa = createDetailNavigation();
				capa = "<div id='pagination_" + settings.name + 
					"' style='float:left;font-size:11px'><img alt='" + $.rup.i18n.rup_maint.numResult + "' src='" + settings.imgPath + "/numero_elementos.png'/> " +
					"<div id='rup_maint_selectedElements' style='float: right; margin-left: 3px; margin-top: 2px; position: relative;'> </div></div>" + capa + "<div style='clear:both'/> </div>";
				if (withUserForm) {//si no han indicado formulario de detalle
					detailDiv = settings.detailForm.parent();
					//creación de los controles del formualrio haciendo uso de los class
					$("#" + settings.detailForm[0].id + " .datepicker").each(function () {
						$(this).datepicker({dateFormat: 'dd/mm/yy'});
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
					detailDiv = $("<div/>").attr('id', 'detailDiv').attr('title', $.rup.i18n.rup_maint.detailTitle).attr('style', 'display:none');
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
					formu = createData();
					detaiBody.append(formu);
					detailDiv.append(detaiBody);
					$("#contenido").append(detailDiv);
					settings.detailForm = $("#detailForm_" + settings.name).ajaxForm();
				}
				createNavigationButtons();
				settings.detailDiv = detailDiv;
				//se añade la validación
				addValidation();			
			}
			// Carga de los valores por defecto para los atributos que no ha introducido el usuario
			if (properties[0].jQueryGrid === null) {//no se puede crear el mantenimiento sin grid
				$.rup_messages("msgError", {message: $.rup.i18n.rup_maint.noGrid});
				return false;			
			}
			properties[0].jQueryGrid = $("#" + properties[0].jQueryGrid);

			settings = $.extend({}, $.fn.rup_maint.defaults, properties[0]);
			settings.name = self[0].id.substring("EJIE_MAINT_".length, self[0].id.length);
						
			$.data(properties[0].jQueryGrid[0] , "maintName",  self[0].id);//guardamos en el grid el nombre del maint
			if (settings.searchForm !== null) {//si tenemos formulario de busqueda creamos el ajax form y añadimos la url generica.
				settings.searchForm = $("#" + settings.searchForm);
				settings.searchForm.ajaxForm();
				settings.searchURL = settings.jQueryGrid.rup_grid("getGridParam", "url");
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
				settings.detailDiv.rup_dialog({type: jQuery.rup.dialog.DIV, autoOpen: false, modal: true, width: 569, 
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
							message: $.rup.i18n.rup_maint.saveAndContinue,
							title: $.rup.i18n.rup_maint.changes,
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
					if (t[0].prop.detailForm.serialize() !== t[0].prop.detailForm.data('initialData')) {
						$.rup_messages("msgConfirm", {
							message: $.rup.i18n.rup_maint.saveAndContinue,
							title: $.rup.i18n.rup_maint.changes,
							OKFunction : function () {
							t[0].prop.detailDiv.rup_dialog("close");
								return false;
							}
						});
					} else {
						t[0].prop.detailDiv.rup_dialog("close");
					}				
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
				settings.toolbar.addButton({
					i18nCaption: "new",
					css: "rup-maint_new",
					index: 1
				}, $.rup.i18n.rup_maint).bind("click", function () {
					t.rup_maint("newElement");
				});
				if (settings.jQueryGrid.rup_grid("isEditable")) {
					self[0].prop.btnCancel = settings.toolbar.addButton({
						i18nCaption: "cancel",
						css: "rup-maint_cancel",
						index: 2
					}, $.rup.i18n.rup_maint).bind("click", function () {
						t.rup_maint("cancelEditing", this);
					}).button("option", "disabled", true );
				}
				settings.toolbar.addButton({
					i18nCaption: "edit",
					css: "rup-maint_edit",
					index: 2
				}, $.rup.i18n.rup_maint).bind("click", function () {
					var rowid = t[0].prop.jQueryGrid.rup_grid('getGridParam', 'selrow'), page = t[0].prop.jQueryGrid.rup_grid('getGridParam', 'page');
					if (t[0].prop.jQueryGrid.rup_grid('isMultiselect')) {
						if (t[0].prop.selectedRows["p_" + page]) {
							rowid = t[0].prop.selectedRows["p_" + page][0].substring(3, t[0].prop.selectedRows["p_" + page][0].length);
						}
					}
					t[0].prop.currentSelectedRow = "p_" + page + ";" + "id_" + rowid;
					t.rup_maint("editElement", rowid);
				});
				settings.toolbar.addButton({
					i18nCaption: "delete",
					css: "rup-maint_delete",
					index: 3
				}, $.rup.i18n.rup_maint).bind("click", function () {
					t.rup_maint("deleteElement", t[0].prop.jQueryGrid.rup_grid('getGridParam', 'selrow'));
				});
				settings.toolbar.addButton({
					i18nCaption: "filter", 
					css: "rup-maint_filter", 
					index: 4
				}, $.rup.i18n.rup_maint).bind("click", function () {
					if ($(this).hasClass("filtrar_pulsado")) {
						$(this).removeClass("filtrar_pulsado");
					} else {
						$(this).addClass("filtrar_pulsado");
					}
					t.rup_maint("toggleSearchForm", "FIELDSET_SEARCH_" + t[0].prop.name);
				});
			}
			if (settings.parent) {
				if ($("#" + settings.parent).length > 0) {
					$("#" + settings.parent).rup_maint("_addChild", self[0].id);//"EJIE_MAINT_" + settings.name);
				}
			}
			settings.jQueryGrid[0].p.ondblClickRow = function (rowid, iRow, iCol, e) {
				$("body").data("e_click_mnt",false);
				window.clearTimeout($("body").data("clicktimer_mnt"));
				//eliminamos la edicion en linea en el doble click y lo dejamos en linea
				if (!t[0].prop.jQueryGrid.rup_grid("isMultiselect") && !t[0].prop.jQueryGrid.rup_grid("isEditable")) {
					t.rup_maint("editElement", rowid);
				}
			};
					
			if (settings.searchForm !== null) { //Si tenemos formulario de busqueda actualizamos los datos a enviar al servidor para añadir los campos de busqueda.
				settings.jQueryGrid[0].p.serializeGridData = function (postData) {
					var searchFormArray = t[0].prop.searchForm.serializeArray();
					for (var i = 0; i < searchFormArray.length; i++) { //eleminamos todos los posibles valores que en na busqueda anterior se hayan podido añadir a postData 
						delete postData[searchFormArray[i].name];
					}
					if (postData.page!== undefined && postData.page !== null && Number(postData.page) > $(this).rup_grid("getGridParam","lastpage") && $(this).rup_grid("getGridParam","lastpage") > 0){//pq si laspage es 0 es la primera vez
						postData.page = $(this).rup_grid("getGridParam","lastpage");
					}
					//SUF : modificado para unifcar en un unico metodo $.extend(postData, settings.searchForm.serializeToObject()); //Solo se envian los campos que tienen valor y sean diferentes a ""
					$.extend(postData, form2object(t[0].prop.searchForm[0])); //Solo se envian los campos que tienen valor y sean diferentes a ""
					return postData;
				};
			} else {
				if (settings.parent) {
					settings.jQueryGrid[0].p.serializeGridData = function (postData) {
						//var mnt = $("#" + $(this).data("asociatedMaint"));
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
						return postData;
					};
				}
			}
			if (settings.jQueryGrid.rup_grid("isMultiselect")) {
				//sobreescritura de la combo de cambio d epaginacion
				var pgcnt = "pg_"+t[0].prop.jQueryGrid[0].rup_gridProps.pagerName;
				$('.ui-pg-selbox',"#"+pgcnt).unbind("change");
				$('.ui-pg-selbox',"#"+pgcnt).bind("change",function() {
					var rowDif = this.value - t[0].prop.jQueryGrid[0].p.rowNum, rows;
					if ($.data(t[0].prop.jQueryGrid[0] , "allSelected")) {//Si tengos todos seleccionados hay que borrar todo
						t[0].prop.selectedRows = [];
					}
					if (rowDif > 0 ) {//si estamos aumentando el numero de filas por pagina
						for (var i = 1 ; i < t[0].prop.selectedRows.length; i++) {//me recorro las paginas
							rows = t[0].prop.selectedRows[t[0].prop.selectedRows[i]].length;
							for (var j = rows - 1; j >= 0; j--) {//me recorro los ids que hay en la pagina
								var rowid = t[0].prop.selectedRows[t[0].prop.selectedRows[i]][j].split("_")[1]; //me cojo el numeor del id
								var newRowId = Number(rowid) + t[0].prop.jQueryGrid[0].p.reccount;
								if (newRowId <= this.value) {//si la suma del id anterior + reccount es menor o igual que el numeor de filas a mostrar lo meto en la pagian anterior 
									t[0].prop.selectedRows[t[0].prop.selectedRows[i-1]].push("id_" + newRowId);
									t[0].prop.selectedRows[t[0].prop.selectedRows[i-1]]["id_" + newRowId] = t[0].prop.selectedRows[t[0].prop.selectedRows[i]]["id_" + rowid];
									//borramos los anteriores
									t[0].prop.selectedRows[t[0].prop.selectedRows[i]].splice(j, 1);
									delete t[0].prop.selectedRows[t[0].prop.selectedRows[i]]["id_" + rowid];
									if (t[0].prop.selectedRows[t[0].prop.selectedRows[i]].length === 0) {//si ya no me quedan filas en esa pagina borramos la pagina tambien
										delete t[0].prop.selectedRows[t[0].prop.selectedRows[i]];//borrar pagina
										t[0].prop.selectedRows.splice(i, 1);
										break;
									}
								}
							}
						}
					} else {
						//estamos disminuyendo el numero de filas por pagina
						
						for (var i = 0 ; i < t[0].prop.selectedRows.length; i++) {//me recorro las paginas
							rows = t[0].prop.selectedRows[t[0].prop.selectedRows[i]].length;
							for (var j = rows - 1; j >= 0; j--) {//me recorro los ids que hay en la pagina
								var rowid = t[0].prop.selectedRows[t[0].prop.selectedRows[i]][j].split("_")[1]; //me cojo el numeor del id
								var newRowId = Number(rowid) - this.value;
								if (Number(rowid) > Number(this.value)) {//si la suma del id anterior + reccount es menor o igual que el numeor de filas a mostrar lo meto en la pagian anterior
									var page = Math.ceil(rowid/this.value);
									if (t[0].prop.selectedRows["p_" + page]){
										t[0].prop.selectedRows["p_" + page].push("id_" + newRowId);
										t[0].prop.selectedRows["p_" + page]["id_" + newRowId] = t[0].prop.selectedRows[t[0].prop.selectedRows[i]]["id_" + rowid];
									} else {//si no existe esa pagina la creamos
										t[0].prop.selectedRows.push("p_" + page);
										t[0].prop.selectedRows["p_" + page] = [];
										t[0].prop.selectedRows["p_" + page].push("id_" + newRowId);							
										t[0].prop.selectedRows["p_" + page]["id_" + newRowId] = t[0].prop.selectedRows[t[0].prop.selectedRows[i]]["id_" + rowid];;
									}
									t[0].prop.selectedRows[t[0].prop.selectedRows[i]].splice(j, 1);
									delete t[0].prop.selectedRows[t[0].prop.selectedRows[i]]["id_" + rowid];
									if (t[0].prop.selectedRows[t[0].prop.selectedRows[i]].length === 0) {//si ya no me quedan filas en esa pagina borramos la pagina tambien
										delete t[0].prop.selectedRows[t[0].prop.selectedRows[i]];//borrar pagina
										t[0].prop.selectedRows.splice(i, 1);
										break;
									}
								}
							}
						}
					}
					t[0].prop.jQueryGrid.rup_grid("resetSelection");
					t[0].prop.jQueryGrid[0].p.page = Math.round(t[0].prop.jQueryGrid[0].p.rowNum*(t[0].prop.jQueryGrid[0].p.page-1)/this.value-0.5)+1;
					t[0].prop.jQueryGrid[0].p.rowNum = this.value;
					t[0].prop.jQueryGrid[0].grid.populate();
					return false;
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
					//debugger;
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
						
						//comprobamos si esta dentro de las paginas de deseleccionadas la pagina actual
						ind = $.inArray(page, $.data(t[0].prop.jQueryGrid[0], "deSelectedPages"));
						if (ind > -1) {//es que esta dentro de las paginas deseleccionadas y hay que volver a meterlo
							var deSelectedPages = $.data(t[0].prop.jQueryGrid[0] , "deSelectedPages");
							deSelectedPages.splice(ind, 1);
							$.data(t[0].prop.jQueryGrid[0] , "deSelectedPages", deSelectedPages);
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
					$('#' + t[0].prop.jQueryGrid[0].rup_gridProps.pagerName + '_left').html(selectedTotalRows + " " + $.rup.i18n.rup_grid.pager.selected);
				};
				//Evento onDeSelectAllRows lanzado por el boton de deseleccionar todos
				settings.jQueryGrid[0].rup_gridProps.onDeSelectAllRows = function (select) {
					t[0].prop.selectedRows = [];
					t[0].prop.selectedRowsCont = 0;
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
					var page = t[0].prop.jQueryGrid.rup_grid("getGridParam", "page"), ind, selectedTotalRows, pksForRow;
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
								t[0].prop.selectedRowsCont += 1;
								if (fromGridComplete && t[0].prop.MODO != "new") {//solo tengo que volver a seleccionar si vengo del gridcomplete
									
									t[0].prop.jQueryGrid.rup_grid("setSelection", aRowids[j], false);
								}
							}
							//comprobamos si esta dentro de las paginas de deseleccionadas
							ind = $.inArray(page, $.data(t[0].prop.jQueryGrid[0], "deSelectedPages"));
							if (ind > -1) {//es que esta dentro de las paginas deseleccionadas y hay que volver a meterlo
								var deSelectedPages = $.data(t[0].prop.jQueryGrid[0] , "deSelectedPages");
								deSelectedPages.splice(ind, 1);
								$.data(t[0].prop.jQueryGrid[0] , "deSelectedPages", deSelectedPages);
							}
						}
					} else { //si hay que deseleccionar
						ind = $.inArray("p_" + page, t[0].prop.selectedRows);
						delete t[0].prop.selectedRows["p_" + page];
						t[0].prop.selectedRows.splice(ind, 1);
						t[0].prop.selectedRowsCont = t[0].prop.selectedRowsCont - aRowids.length;
						
						//tambien hay que quitarlo de los que estan en el array del grid
						for (var j = 0; j < aRowids.length; j++) {
							/*t[0].prop.selectedRows["p_" + page].push("id_" + aRowids[j]);
							t[0].prop.selectedRows["p_" + page]["id_" + aRowids[j]] = getPrimaryKeysForRow(aRowids[j]);
							t[0].prop.selectedRowsCont += 1;*/
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
					$('#' + t[0].prop.jQueryGrid[0].rup_gridProps.pagerName + '_left').html(selectedTotalRows + " " + $.rup.i18n.rup_grid.pager.selected);
				};
				//Sobreescritura de la función para obtener las primary de toda la entidad
				settings.jQueryGrid[0].rup_gridProps.selectAllGetPrimaryKeys = function () {
					var relatedGrd = this;
					$.ajax({                           
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
								$('#' + relatedGrd[0].rup_gridProps.pagerName + '_left').html(pksArray.length + " " + $.rup.i18n.rup_grid.pager.selected);
								pksArray = null;
								//quitamos todas las posibles selecciones que se hayan podido realizar
								t[0].prop.selectedRows = [];
								t[0].prop.selectedRowsCont = 0;
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
			if (settings.searchForm !== null) {//si tenemos formulario de busqueda añadimos la capa con los botones de busqueda y el enlace de limpiar.
				btSearch = $("<input type='button' />").attr('id', 'bt_search_' + settings.name).bind("click", 
				function () { 
					t.rup_maint("search");
				});
				btSearch.button({label: $.rup.i18n.rup_global.search});
				lnkClean = $("<a>").attr("id", "clean_search_" + settings.name).attr("class", "rup-enlaceCancelar").text($.rup.i18n.rup_global.clean).bind("click", 
				function () {
					t.rup_maint("cleanSearchForm");
				});
				btDiv = $("<div>").attr("id", "SEARCH_FORM_BUTTONS_" + settings.name).addClass("right_buttons").append(btSearch).append("&nbsp;").append(lnkClean).append("&nbsp;");
				$("#FIELDSET_SEARCH_" + settings.name).append(btDiv);
			}
			//Evento creado para seleccionar las filas y editar si estamos editando
			settings.jQueryGrid[0].rup_gridProps.onAfterGridComplete = function (rowid, launchSelectEvent) {
				//debugger;
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
								t[0].prop.selectedRowsCont += 1;
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
				t[0].prop.jQueryGrid.data("sorting", true);
				if (t[0].prop.jQueryGrid.data("old_selectRows") && t[0].prop.jQueryGrid.data("old_selectRows").length > 0) {
					$.merge(t[0].prop.jQueryGrid.data("old_selectRows"), $.maint.getPrimaryKeys(t[0].prop.selectedRows));
				} else {
					t[0].prop.jQueryGrid.data("old_selectRows", $.maint.getPrimaryKeys(t[0].prop.selectedRows));
				}
				delete t[0].prop.selectedRows;
				t[0].prop.selectedRows = [];
				t[0].prop.selectedRowsCont = 0;
			};
			//si es editable hay que poner que se edite por click en la fila no por dblclick
			if (settings.jQueryGrid.rup_grid("isEditable")) {
				settings.jQueryGrid[0].rup_gridProps.onAfterSelectRow = function (rowid, select) {
					t[0].prop.feedback.rup_feedback("close");
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
								//debugger;
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
								return false;
							}
						}
					});				
					/*$("input[name='" + lastColName + "']", this).bind("keydown", function(event) {	
						if (event.keyCode == 9) { // TAB
							if (!event.shiftKey) {
								debugger;
								if ($(this).hasClass("hasDatepicker")) {
									$(this).datepicker("hide");
								}
								relatedGrid.rup_grid('saveRow', rowId, rup_maint.saveEditableSucces, "clientArray", null, rup_maint.aftersavefunc, rup_maint.saveEditableError, null);
								t.rup_maint("editElement", Number(rowId)+1);
							}
						}
					});*/
					
					
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
												$("#" + t.data("_children"))[i].prop.jQueryGrid.rup_grid("reloadGrid");
											}
										}				                
						                //return true;
						            }
						    }, 300));
						};
					}
			}
		//}
		//);
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
		onafterDetailShow: null
	};		
})(jQuery);