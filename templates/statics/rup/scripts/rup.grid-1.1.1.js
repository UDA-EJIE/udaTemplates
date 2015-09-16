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
	//*****************************************************************************************************************
	// DEFINICIÓN BASE DEL PATRÓN (definición de la variable privada que contendrá los métodos y la función de jQuery)
	//*****************************************************************************************************************
	var rup_grid = {};
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupSelectorObjectConstructor("rup_grid", rup_grid));
	
	$.fn.rup_grid("extend", {
		_init : function(pin) {
			var settings = {}, self = null, resize_cursors = [2], ondblClickRowUserEvent = null, 
				resizeStartUserEvent = null, resizeStopUserEvent = null, loadBeforeSendUserEvent = null, 
				gridCompleteUserEvent = null, serializeGridDataUserEvent =null, 
				text, child, porcentaje, sortableUserProperty,
			
			loadBeforeSend_default = function (xhr) {
				xhr.setRequestHeader("JQGridModel", "true");
				xhr.setRequestHeader("Content-Type", "application/json");
			},
			onSelectRow_default = function (id, select){
				if ($.isFunction(self[0].rup_gridProps.onAfterSelectRow)) { //realiza la acción de seleccionar la filas ya sean en multiseleccion o no
					self[0].rup_gridProps.onAfterSelectRow.call(self, id, select);
				}
				//si esta el seleccionar todos activo lo borro
				if ($("#rup_feedback_" + self[0].id)) {
					$("#rup_feedback_" + self[0].id).rup_feedback("close");
				}				
			},
			gridComplete_default = function (self) {
				var rowid = null, launchSelectEvent = true, id;
				//si esta el seleccionar todos activo lo borro
				if ($("#rup_feedback_" + self[0].id)) {
					$("#rup_feedback_" + self[0].id).rup_feedback("close");
				}
				//estilos para poder poner el pijama
				//TODO: comprobar que no vuelva a poner los estilos cuando se hace el addRowData
				$('#' + self[0].id + ' tr:nth-child(even)').addClass("rup-grid_evenRow");
				$('#' + self[0].id + ' tr:nth-child(odd)').addClass("rup-grid_oddRow");
				//estilo para hacer el cellpadding de cada celda
				$(".ui-jqgrid tr.jqgrow td").addClass("rup-grid_cellPadding");
				if (self.jqGrid("getDataIDs").length === 0) {//es que no hay registros
					$(self.jqGrid("getGridParam", "pager")).hide();
					if ($("#RUP_GRID_" + self[0].id + "_noRecords").length === 0) {
					self.before(
					'<tr class="ui-widget-content jqgrow ui-row-ltr" role="row" id="RUP_GRID_' + self[0].id + '_noRecords" aria-selected="false"><td aria-describedby="RUP_GRID_' + self[0].id + '_NO_REGISTROS" title="' + $.rup.i18n.base.rup_grid.noRecordsFound + '" style="text-align: left;width:' + self.jqGrid("getGridParam", "width") + 'px;background:white;" role="gridcell"><div id="RUP_GRID_' + self[0].id + '_noRecord_ext" class="cellLayout" style="padding-left: 0.5em ! important;">' + $.rup.i18n.base.rup_grid.noRecordsFound + '</div></td></tr>');
					}
				} else {
					if ($("#RUP_GRID_" + self[0].id + "_noRecords").length) {//si tenemos la capa de no hay registros la borramos
						$("#RUP_GRID_" + self[0].id + "_noRecords").remove();
					}
					
					if (self[0].rup_gridProps.sourceEvent) {
						var mnt = $("#" + self[0].rup_gridProps.sourceEvent.parentMaintName);
						var srcElem = $(self[0].rup_gridProps.sourceEvent.target);
						if (self[0].rup_gridProps.sourceEvent.type === "click") {
							if (self.jqGrid("getGridParam", "multiselect")) {
								if (mnt[0].prop.currentSelectedRow===null){
									if($.data(mnt[0].prop.jQueryGrid[0], "detailPagAction")==='back' || $.data(mnt[0].prop.jQueryGrid[0], "detailPagAction")==='last'){
										mnt[0].prop.currentSelectedRow="p_" + self.jqGrid("getGridParam", "page") + ";" + "id_" + self.jqGrid("getDataIDs")[self.jqGrid("getDataIDs").length-1];
									}else{
										mnt[0].prop.currentSelectedRow="p_" + self.jqGrid("getGridParam", "page") + ";" + "id_" + self.jqGrid("getDataIDs")[0];
									}
								}
								id = mnt[0].prop.currentSelectedRow.split(";")[1];
								rowid = id.substring(3, id.length);
								launchSelectEvent = false;
							} else {								
								if (srcElem[0].id.indexOf("forward_") === 0 || srcElem[0].id.indexOf("first_") === 0) {//si es la primera o el siguiente elemento tengo que coger el primero de la pagina
									//si no es multiselect hago lo de antes
									rowid = self.jqGrid("getDataIDs")[0];
								} else {
									rowid = self.jqGrid("getDataIDs")[self.jqGrid("getDataIDs").length-1];
								}
							}
						}
					}
					$(self.jqGrid("getGridParam", "pager")).show();
					//comprobar si tenemos que seleccionar todos
					if ($.data(self[0] , "allSelected") && $.inArray(self.jqGrid("getGridParam", "page"), $.data(self[0] , "deSelectedPages"))) {
						
						$('#cb_'+$.jgrid.jqID(self[0].id), "#gbox_"+self[0].id).attr("checked", true);
						//invocamos a la funcion de seleccionar todos en este caso del maint
						if ($.isFunction(self[0].rup_gridProps.onAfterSelectAll)) { //realiza la acción de seleccionar la filas ya sean en multiseleccion o no
							self[0].rup_gridProps.onAfterSelectAll.call(self, self.rup_grid("getDataIDs"), true, true);
						}
						//$('#cb_'+$.jgrid.jqID(self[0].id), "#gbox_"+self[0].id).trigger('click');
						//$('#cb_'+$.jgrid.jqID(self[0].id), "#gbox_"+self[0].id).attr("checked", true);
						
					}
					if ($.isFunction(self[0].rup_gridProps.onAfterGridComplete)) { //realiza la acción de seleccionar la filas ya sean en multiseleccion o no
						self[0].rup_gridProps.onAfterGridComplete.call(self, rowid, launchSelectEvent);
					}
				}
			},
			resizeStart_default = function () {//TODO meter el resize y el satrt stop;
				//Cursor cabecera [th]
				resize_cursors[0] = $('#gbox_' + self[0].id + ' .ui-jqgrid-htable th:eq(1)').css('cursor');
				//Si no tiene ordenación, tendrá 'auto' y se autoasigna 'col-resize' por tanto se pone 'default'.
				if (resize_cursors[0] === 'col-resize') { 
					resize_cursors[0] = 'default';
				}
				$('#gbox_' + self[0].id + ' .ui-jqgrid-htable th').css('cursor', 'col-resize');
				
				//Cursor capa global cabecera [div]
				resize_cursors[1] = $('#gbox_' + self[0].id + ' .ui-jqgrid-sortable').css('cursor');
				$('#gbox_' + self[0].id + ' .ui-jqgrid-sortable').css('cursor', 'col-resize');
				
				//Cursor capa texto cabecera [div]
				$('#gbox_' + self[0].id + ' .ui-jqgrid-sortable div').css('cursor', 'col-resize');
				
				//Cursor span ordenación
				$('#gbox_' + self[0].id + ' .ui-grid-ico-sort').css('cssText', "cursor: col-resize !important;");
			},
			resizeStop_default = function () {
				//Restablecer cursores
				$('#gbox_' + self[0].id + ' .ui-jqgrid-htable th').css('cursor', resize_cursors[0]);
				$('#gbox_' + self[0].id + ' .ui-jqgrid-sortable').css('cursor', resize_cursors[1]);
				$('#gbox_' + self[0].id + ' .ui-jqgrid-sortable div').css('cursor', 'pointer');
				$('#gbox_' + self[0].id + ' .ui-grid-ico-sort').css('cssText', "cursor: pointer !important;");
			},
			ondblClickRowUserEvent_default = function (xhr) {
				
			},
			//funcionamiento por defecto de la selección de todas las filas del grid
			onSelectAll_default = function (aRowids, select) {
				if ($.data(self[0] , "allSelected") === null || $.data(self[0] , "allSelected") === undefined) {
					
					// Se ha trasladado a la creación del grid para que el grid tenga uno siempre creado
//					$("#rup_feedback_" + self[0].id).rup_feedback({
//						closeLink: false,
//						gotoTop: false,
//						block: false
//					});
					if (select) {//si hay que seleccionar
						// TODO Mira correctamente el numero de registro a seleccionar si ya hay alguno
						$("#rup_feedback_" + self[0].id).rup_feedback("set", 
								$.rup.i18n.base.rup_grid.selectedElems + "<b>" + aRowids.length + "</b>" + $.rup.i18n.base.rup_grid.ofPage +
								' <input id="rup_grid_' + self[0].id + '_selectAll" style="margin-left: 15px;" class="botonElementosRestantes" type="button" value="' + 
								$.rup.i18n.base.rup_grid.selectAll + " " + Number(self.rup_grid("getGridParam", "records") - aRowids.length) + " "  
								+ $.rup.i18n.base.rup_grid.selectAllRest+ '" alt="' + $.rup.i18n.base.rup_grid.selectAll + '">');
						$("#rup_grid_" + self[0].id + "_selectAll").bind("click", function (ev) {
							$.data(self[0] , "selectedRowsCont", self.rup_grid("getGridParam", "records"));
							$.data(self[0] , "allSelected", true);
							$("#rup_feedback_" + self[0].id).rup_feedback("close");
							if ($.isFunction(self[0].rup_gridProps.selectAllGetPrimaryKeys)) { //realiza la acción de seleccionar la filas ya sean en multiseleccion o no
								//creamos el array para las claves primarias
								//self[0].rup_gridProps.allPksArray = [];
								self[0].rup_gridProps.selectAllGetPrimaryKeys.call(self);
							}
							//se crear el array de deseleccionados a vacio
							$.data(self[0], "deSelectedPages", []);
						});
					} else {//si deseleccionamos todos
						$("#rup_feedback_" + self[0].id).rup_feedback("close");
					}
				} else if ($.data(self[0] , "allSelected") && !select) {//si tenemos todos seleccionados y estamos deseleccionando la pagina actual
					//si hay que deseleccionar todos los registros
					$("#rup_feedback_" + self[0].id).rup_feedback("close");
					
					if ($.data(self[0] , "allSelected") === true) {//Si hemos seleccionado el resto de elementos
						//Mostramos el feedback de deseleccionar los restantes
						$("#rup_feedback_" + self[0].id).rup_feedback("set", 
								$.rup.i18n.base.rup_grid.deSelectedElems + "<b>" + aRowids.length + "</b>" + $.rup.i18n.base.rup_grid.ofPage +
								' <input id="rup_grid_' + self[0].id + '_deSelectAll" style="margin-left: 15px;" class="botonElementosRestantes" type="button" value="' + 
								$.rup.i18n.base.rup_grid.deSelectAll + " " + Number($.data(self[0] , "selectedRowsCont") - aRowids.length) + " "  
								+ $.rup.i18n.base.rup_grid.selectAllRest+ '" alt="' + $.rup.i18n.base.rup_grid.deSelectAll + '">');
						//click del deseleccionar
						$("#rup_grid_" + self[0].id + "_deSelectAll").bind("click", function (ev) {
							$("#rup_feedback_" + self[0].id).rup_feedback("close");
							//inicializamos los valores de la multiseleccion
							$.data(self[0] , "selectedRowsCont", 0);
							$.data(self[0] , "allSelected", false);		
							self[0].rup_gridProps.allPksArray = [];
							$('#' + self[0].rup_gridProps.pagerName + '_left').html("0 " + $.rup.i18n.base.rup_grid.pager.selected);
							if ($.isFunction(self[0].rup_gridProps.onAfterSelectAll)) { //realiza la acción de seleccionar la filas ya sean en multiseleccion o no
								self[0].rup_gridProps.onDeSelectAllRows.call(self, select);
							}
						});
						var deSelectedPages = $.data(self[0] , "deSelectedPages");
						deSelectedPages.push(self.rup_grid("getGridParam", "page"));
						$.data(self[0] , "deSelectedPages", deSelectedPages);
					}
				} else if($.data(self[0] , "allSelected") && select) {
					$("#rup_feedback_" + self[0].id).rup_feedback("close");//porque si seleccionas todas cuando no esta seleccionado y justo anteriormente has deseleccionado la pagina se queda la capa con los mensajitos
				}
				if ($.isFunction(self[0].rup_gridProps.onAfterSelectAll)) { //realiza la acción de seleccionar la filas ya sean en multiseleccion o no
					self[0].rup_gridProps.onAfterSelectAll.call(self, aRowids, select);
				}
			};
			loadErrorUserEvent_default = function (xhr, status, error) {//funcion que ejecuta la accion de carga erronea por defecto
				self.rup_grid("clearGridData");

				if ($.data(self[0],"maintName") && $.data(self[0],"maintName") !== null && $.data(self[0],"maintName") !== "") {//es que tengo un maint asociado
					$("#" + $.data(self[0],"maintName"))[0].prop.feedback.rup_feedback("option", "closeLink", true);
					$("#" + $.data(self[0],"maintName"))[0].prop.feedback.rup_feedback("option", "delay", null);
					$("#" + $.data(self[0],"maintName"))[0].prop.feedback.rup_feedback("set", $.rup.i18n.base.rup_grid.errors.errorOnGet, "error");
					$("#" + $.data(self[0],"maintName"))[0].prop.feedback.rup_feedback("option", "delay", 1000);
				}else{
					$("#rup_feedback_" + self[0].id).rup_feedback("option", "closeLink", true);
					$("#rup_feedback_" + self[0].id).rup_feedback("option", "delay", null);
					$("#rup_feedback_" + self[0].id).rup_feedback("set", $.rup.i18n.base.rup_grid.errors.errorOnGet, "error");
					$("#rup_feedback_" + self[0].id).rup_feedback("option", "delay", 1000);
				}
				
			};
			
			
			serializeGridDataUserEvent_default = function (postData){
				if (postData.page!== undefined && postData.page !== null && Number(postData.page) > self.rup_grid("getGridParam","lastpage") && self.rup_grid("getGridParam","lastpage") > 0){//pq si laspage es 0 es la primera vez
					postData.page = self.rup_grid("getGridParam","lastpage");
				}
				return postData;
			};
			
			
			$.extend(settings, $.fn.rup_grid.defaults, pin[0] || {});	
			self = this;	
			/*settings.onPaging = function (pgButton) {
				$("#rup_feedback_" + self[0].id).rup_feedback("close");				
			};*/
			/* Evento del evento de antes de la carga de los datos */
			loadBeforeSendUserEvent = settings.loadBeforeSend;
			settings.loadBeforeSend = function (xhr) {
				if (loadBeforeSendUserEvent !== null) {
			        if (loadBeforeSendUserEvent(xhr) === false) {
			            return false;
			        }
			    }
				//Comportamiento por defecto del evento
				loadBeforeSend_default(xhr);
			};
			
			onSelectRowUserEvent = settings.onSelectRow;
			
			settings.onSelectRow = function (id, selectR) {
				
				function executeSelectRow(){
					if($("body").data("e_click")) {
		            	
						if (onSelectRowUserEvent !== null) {
					        if (onSelectRowUserEvent(xhr) === false) {
					            return false;
					        }
					    }
						//Comportamiento por defecto del evento
						onSelectRow_default(id, selectR);
		                clearTimeout($("body").data("clicktimer"));
		                $("body").data("clicktimer", null);
		            }
				}
				
				var  isMultiselect = $(this).jqGrid("getGridParam", "multiselect");
				
				$("body").data("e_click", true);
				if(!isMultiselect){
					$("body").data("clicktimer" , window.setTimeout(executeSelectRow, 0));
				}else{
					$(executeSelectRow);
				}
			};
			
			onSelectAllUserEvent = settings.onSelectAll;
			settings.onSelectAll = function (xhr, select) {
				if (onSelectAllUserEvent !== null) {
			        if (onSelectAllUserEvent(xhr, select) === false) {
			            return false;
			        }
			    }
				//Comportamiento por defecto del evento
				onSelectAll_default(xhr, select);
			};
			
			gridCompleteUserEvent = settings.gridComplete;
			settings.gridComplete = function () {
				if (gridCompleteUserEvent !== null) {
			        if (gridCompleteUserEvent() === false) {
			            return false;
			        }
			    }
				//Comportamiento por defecto del evento
				gridComplete_default(self);
			};
			resizeStartUserEvent = settings.resizeStart;
			settings.resizeStart = function () {
				if (resizeStartUserEvent !== null) {
			        if (resizeStartUserEvent() === false) {
			            return false;
			        }
			    }
				//Comportamiento por defecto del evento
				resizeStart_default();
			};
			resizeStopUserEvent = settings.resizeStop;
			settings.resizeStop = function () {
				if (resizeStopUserEvent !== null) {
			        if (resizeStopUserEvent() === false) {
			            return false;
			        }
			    }
				//Comportamiento por defecto del evento
				resizeStop_default();
			};
			settings.loadComplete = function (data) {
				if (data.rows.length > 0 && data.rows[0].id instanceof Object){//tratamiento exclusivo para jpa
					for (var i = 0; i<data.rows.length;i++) {
						if (data.rows[i].id instanceof Object) {//es que estamos en jpa y traemos una clave compuesta
							data.rows[i]["JPA_ID"] = data.rows[i].id;
							delete data.rows[i].id;
						}
					}
					this.addJSONData(data);
				}
			};
			
			ondblClickRowUserEvent = settings.ondblClickRow;
			settings.ondblClickRow = function (xhr) {
				$("body").data("e_click",false);
				window.clearTimeout($("body").data("clicktimer"));
				if (ondblClickRowUserEvent !== null) {
			        if (ondblClickRowUserEvent(xhr) === false) {
			            return false;
			        }
			    }
				//Comportamiento por defecto del evento
				ondblClickRowUserEvent_default(xhr);
			};
			//funcion que se lanza cuando hay un error al cargar el grid
			loadErrorUserEvent = settings.loadError;
			settings.loadError = function (xhr,	status,	error) {
				if (loadErrorUserEvent !== null) {
			        if (loadErrorUserEvent(xhr) === false) {
			            return false;
			        }
			    }
				//Comportamiento por defecto del evento
				loadErrorUserEvent_default(xhr,	status,	error);
			};
			if (settings.sortable!==false) {//si no es false ponemos lo del drag and drop si es false no lo ponemos
			//Drag and Drop de las columnas
			sortableUserProperty = settings.sortable;
			settings.sortable = { 
					update: function (permutations) {
						self.reorderColumns(permutations);
					}
			};
			}
			
			serializeGridDataUserEvent = settings.serializeGridData;
			settings.serializeGridData = function (postData) {
				if (serializeGridDataUserEvent !== null) {
			        if (serializeGridDataUserEvent(postData) === false) {
			            return false;
			        }
			    }
//				Comportamiento por defecto del evento
				return serializeGridDataUserEvent_default(postData);
			};
			
			
			//Añadimos las propiedades del grid al elemento HTML para poder acceder a ellas desde el mantenimiento
			self[0].rup_gridProps = settings;
			//para la multiselección
			self[0].rup_gridProps.allPksArray = [];
			$.data(self[0] , "selectedRowsCont", 0);
			self.jqGrid({  
				url: (settings.loadOnStartUp && !settings.hasMaint ? settings.url : null), 
				datatype: (settings.loadOnStartUp && !settings.hasMaint ? 'json': "clientSide"),
				colNames: settings.colNames,
				colModel: settings.colModel,
				postData: settings.postData,
				viewrecords: settings.viewrecords,
				altRows: false,
				altclass: "",
				width: settings.width,
				imgpath: settings.imgpath,
				height: 'auto',
				rowNum: settings.rowNum,
				rowList: settings.rowList,
				multiselect: settings.multiselect,
				multiselectWidth: settings.multiselectWidth,
				pager: $('#' + settings.pagerName),
				editurl: null,
				caption: null,
				sortable: settings.sortable,
				sortorder: settings.sortorder,
				sortname: settings.sortname,
				//cellEdit: settings.cellEdit,
				multiboxonly: settings.multiboxonly,
				loadui: "block",
				//Eventos
				beforeRequest: function(){
					var url = $(this).rup_grid("getGridParam","url");
					$(this).rup_grid("setGridParam",{url:$.rup_utils.setNoPortalParam(url)});
					if (settings.beforeRequest){
						settings.beforeRequest.call();
					}
				},
				loadBeforeSend: settings.loadBeforeSend,
				serializeGridData: settings.serializeGridData,
				loadError: settings.loadError,
				gridComplete: settings.gridComplete,
				loadComplete: settings.loadComplete,
				afterInsertRow: settings.afterInsertRow,
				beforeSelectRow: settings.beforeSelectRow,
				onCellSelect: settings.onCellSelect,
				ondblClickRow: settings.ondblClickRow,
				onHeaderClick: settings.onHeaderClick,
				onPaging: settings.onPaging,
				onRightClickRow: settings.onRightClickRow,
				onSelectAll: settings.onSelectAll,
				onSelectRow: settings.onSelectRow,
				onSortCol: settings.onSortCol,
				jsonReader : {
					repeatitems: false,
					id:"rup_id"
				},
				prmNames : {
					id:"rup_id"
				},
				resizeStart: settings.resizeStart,
				resizeStop: settings.resizeStop,
				autoencode: settings.autoencode
			});	
			
			/* Si se ha configurado el grid para que no realice una busqueda al inicio, 
			una vez realizada la creacion del jqgrid, se vuelven a configurar los parametros url y datatype del grid 
			*/
			if (!settings.loadOnStartUp){
				self.setGridParam({url: (!settings.hasMaint ? settings.url : null),datatype:(!settings.hasMaint ? 'json': "clientSide")});
			}
			
			//$(".ui-jqgrid-title").text("");
			//***************************
			//   ESTILOS DE LA TABLA
			//***************************
			//se añade el feedback de la tabla
			$("<div/>").attr("id", "rup_feedback_" + self[0].id).insertBefore('#gbox_' + self[0].id);
			
			//Si la fila es ordenable cambiamos el cursor de 'pointer' a 'move' sino a 'default'
			if ($("#" + self[0].id).getGridParam('sortable')) {
				$('#gview_' + self[0].id + ' .ui-jqgrid-sortable').css("cursor", "move");
			} else {
				$('#gview_' + self[0].id + ' .ui-jqgrid-sortable').css("cursor", "default");
			}
			
			$("#rup_feedback_" + self[0].id).rup_feedback({
				closeLink: false,
				gotoTop: false,
				block: false
			});

			//Wrappear cada texto de la cabecera en un div
			$.each( $('#gview_' + self[0].id + ' .ui-jqgrid-sortable'), function (index, element){
					text = $(element).text();
					child = $(element).children();
					$(element).text("")
							.prepend($('<div />').css("cursor", "pointer").css("display","inline-table").html(text))
							.append(child);
			});

			
			//***************************
			//   PAGINADOR DE LA TABLA
			//***************************
			$('#'+settings.pagerName).css('height','auto'); //Posibilitar redimensionar paginador
		
			//Añadir clase a cada parte del paginador
			$('#'+settings.pagerName+'_left').addClass("pager_left");
			$('#'+settings.pagerName+'_center').addClass("pager_center");
			$('#'+settings.pagerName+'_right').addClass("pager_right");
			
			//pager_left
			//**********
			//Quitar posibles botones del paginador (y dejar la parte izquierda vacía)
			$('#' + settings.pagerName + '_left').html("");
		
			//Contador de seleccionados
			if (settings.multiselect === true){
				$('#' + settings.pagerName + '_left').append( $('<div/>').addClass('ui-paging-selected').html("0 " + $.rup.i18n.base.rup_grid.pager.selected));
			} 
		
			//pager_center
			//************
			$('#' + settings.pagerName + ' .pager_center table td').addClass('pagControls');
		
			//Cambiar flechas paginación por literales
			$('#' + settings.pagerName + '_center .ui-pg-table #first_pager')
				.html($('<span />').html($.rup.i18n.base.rup_grid.pager.primPag))
				.addClass('linkPaginacion')
				.removeClass('ui-pg-button');
			$('#' + settings.pagerName + '_center .ui-pg-table #prev_pager')
				.html($('<span />').html($.rup.i18n.base.rup_grid.pager.anterior))
				.addClass('linkPaginacion')
				.removeClass('ui-pg-button');
			$('#' + settings.pagerName + '_center .ui-pg-table #next_pager')
				.html($('<span />').html($.rup.i18n.base.rup_grid.pager.siguiente))
				.addClass('linkPaginacion')
				.removeClass('ui-pg-button');
			$('#' + settings.pagerName + '_center .ui-pg-table #last_pager')
				.html($('<span />').html($.rup.i18n.base.rup_grid.pager.ultiPag))
				.addClass('linkPaginacion')
				.removeClass('ui-pg-button');
	
			//En caso de tabla pequeña modificar los elementos y ponerlos en 2 filas
			porcentaje = settings.width*100/screen.width;
			if (porcentaje<65){
				//Añadir nueva fila
				$('#' + settings.pagerName + ' tr:eq(0)').parent().append($('<tr/>').attr('id', settings.pagerName + "_pagerNewLine"));
				
				//Mover pager_left y pager_right
				if (settings.multiselect === true){
					$('#' +settings.pagerName + '_pagerNewLine').append($('#'+settings.pagerName+' #'+settings.pagerName+'_left'));
					$('#' +settings.pagerName + '_center').attr("colspan","2");
				} else {
					$('#'+settings.pagerName + '_left').remove();
				}	
				$('#'+settings.pagerName + '_pagerNewLine').append($('#' + settings.pagerName + '_right'));
			}
			//sobre escribir el click del check
			if (settings.multiselect === true) {
				
				$('#cb_'+$.jgrid.jqID(self[0].id), "#gbox_"+self[0].id).unbind("click");
				$('#cb_'+$.jgrid.jqID(self[0].id), "#gbox_"+self[0].id).bind('click',function(){
					if (this.checked) {
						self[0].p.selarrrow = [];//esto es lo que estaba mal no reiniciaba las filas seleccionadas entonces en el selectAll habia todas las seleccioandas anteriormente y todas las filas
						$("[id^=jqg_" + self[0].id + "_" + "]").attr("checked", "checked");
						$(self[0].rows).each(function(i) {
							if ( i>0 ) {
								if(!$(this).hasClass("subgrid") && !$(this).hasClass("jqgroup")){
									$(this).addClass("ui-state-highlight").attr("aria-selected","true");
									self[0].p.selarrrow.push(this.id);
									self[0].p.selrow = this.id;
								}
							}
						});
						chk=true;
						emp=[];
					} else {
						$("[id^=jqg_"+self[0].p.id+"_"+"]").removeAttr("checked");
						$(self[0].rows).each(function(i) {
							if(i>0) {
								if(!$(this).hasClass("subgrid")){
									$(this).removeClass("ui-state-highlight").attr("aria-selected","false");
									emp.push(this.id);
								}
							}
						});
						self[0].p.selarrrow = []; self[0].p.selrow = null;
						chk=false;
					}
					if($.isFunction(self[0].p.onSelectAll)) {self[0].p.onSelectAll.call(self[0], chk ? self[0].p.selarrrow : emp,chk);}
				});
			}
	
		}
	});
	
	//Métodos públicos a invocar por los desarrolladores
	$.fn.rup_grid("extend",{
		addRowData : function (rowid, data, position, srcrowid) {
			var tableName = $(this)[0].id;			
			//Se aade la capa de separacion para diferenciar los nuevos elementos incluidos
			if ($("#" + tableName + " #separadorAadidos").html() === null) {
				$("#" + tableName + " tr:first-child").after($("#" + tableName + " tr:first-child").clone(false).css("display", "none").css("height", "").attr("id", "separadorAadidos"));
				
				$.each($("#" + tableName + " #separadorAadidos td") , function (index, object) {
					$(this).html("").attr("class", "tdAddSeparator");
				});
				
				$("#" + tableName + " #separadorAadidos").addClass("trAddSeparator");
				$("#" + tableName + " #separadorAadidos").css("display", "");
			}
			$(this).jqGrid("addRowData", rowid, data, position, srcrowid);
			//Añadimos los estilos de elemento añadido
			$("#" + tableName + " #" + rowid).addClass("addElement");
			//$("#" + tableName + " #" + rowid + " td").addClass("addElementBorder");
		},
		delRowData : function (rowid) {
			$(this).jqGrid("delRowData", rowid);
			if ($(this).jqGrid("getDataIDs").length === Number($(this).jqGrid("getGridParam", "rowNum"))) {
				//si tengo el mismo numero de registro que el numeroi de filas hay que quitar la barra
				//de nuevo registro
				$("#" +  $(this)[0].id + " #separadorAadidos").remove();
			}
		},
		setRowData : function (rowid, data, cssp) {
			//TODO antes de insertar
			$(this).jqGrid("setRowData", rowid, data, cssp);
			//TODO despues de insertar
		},
		getRowData : function (rowid) {
			//TODO antes de obtener los datos de una fila
			return $(this).jqGrid("getRowData", rowid);
			//TODO despues de obtener los datos de una fila
		},
		setSelection : function (selection, onsr) {
			//TODO antes de seleccionar una fila
			$(this).jqGrid("setSelection", selection, onsr);
			//TODO despues de seleccionar una fila
		},
		resetSelection : function () {
			if($.isFunction(this[0].rup_gridProps.resetSelection)){
				this[0].rup_gridProps.resetSelection.call();
			}else{
				$(this).jqGrid("resetSelection");				
			}
		},
		getDataIDs : function () {
			//TODO antes de obtener el array de datos
			return $(this).jqGrid("getDataIDs");
			//TODO despues de obtener el array de datos
		},
		getGridParam : function (pName) {
			//TODO antes de obtener el valor de la opcion que recibe como parametro
			return $(this).jqGrid("getGridParam", pName);
			//TODO despues de obtener el valor de la opcion que recibe como parametro
		},
		setGridParam : function (newParams) {
			//TODO antes de establecer el nuevo valor a cualquier opción que recibe como parametro
			$(this).jqGrid("setGridParam", newParams);
			//TODO despues de establecer el nuevo valor a cualquier opción que recibe como parametro
		},
		clearGridData : function (clearfooter) {
			//TODO antes de borrar el contenido del grid
			
			$(this).jqGrid("clearGridData", clearfooter);
			//TODO despues de borrar el contenido del grid
		},
		getSelectedRows : function () {	//Función que devuelve un array con los elementos seleccionados, comprobando si es multiselección o no
			var  isMultiselect = $(this).jqGrid("getGridParam", "multiselect");
			if (isMultiselect) { //si el grid es multiseleccion
				return $(this).jqGrid("getGridParam", "selarrrow");
			} else {
				return [$(this).jqGrid("getGridParam", "selrow")];
			}
		},
		reloadGrid : function () { //Funcion que recarga el grid
			$(this).trigger("reloadGrid");
		},
		editRow : function (rowid, keys, oneditfunc, succesfunc, url, extraparam, aftersavefunc, errorfunc, afterrestorefunc) {
			$(this).jqGrid("editRow", rowid, keys, oneditfunc, succesfunc, url, extraparam, aftersavefunc, errorfunc, afterrestorefunc);
		},
		saveRow : function (rowid, succesfunc, url, extraparam, aftersavefunc, errorfunc, afterrestorefunc) {
			
			// Funcion encargada de terminar con la accion de guardar la linea para el caso de controles rup
			function default_aftersavefunc(rowid, res){
				// se asigna al contenido de la celda el valor seleccionado en el combo
				var valor, rupCombos=$("tr#"+rowid+" select.rup_combo", this);
				
				for (var i=0;i<rupCombos.length;i=i+1){
					valor = $(rupCombos[i]).rup_combo("label");
					$(rupCombos[i]).parent().html(valor);
				}
				
				// Se ejecuta la funcion aftersavefunc indicada 
				if (aftersavefunc){
					aftersavefunc.call(rowid, res);
				}
			}
			
			$(this).jqGrid('saveRow', rowid, succesfunc, url, extraparam, default_aftersavefunc, errorfunc, afterrestorefunc);
		},
		restoreRow : function (rowid, afterrestorefunc) {

			var valor, rupCombos=$("tr#"+rowid+" select.rup_combo", this);
			
			var savedRow = $(this).jqGrid("getGridParam","savedRow");
			
			for (var i=0;i<rupCombos.length;i=i+1){
				valor = $(rupCombos[i]).rup_combo("value");
				savedRow[0][$(rupCombos[i]).attr("name")]=valor;
			}
			
			$(this).jqGrid('restoreRow', rowid, afterrestorefunc);
		},
		getColModel : function () {// Función que devuelve el colModel directamente.
			return $(this).jqGrid("getGridParam", "colModel");
		},
		GridToForm : function (rowid, formid) {
			$(this).jqGrid("GridToForm", rowid, formid);
		},
		FormToGrid : function (rowid, formid, mode, position) {
			$(this).jqGrid("FormToGrid", rowid, formid, mode, position);
		},
		isMultiselect : function () {//Función que devuelve si el mantenimiento es de tipo multi selección o no.
			return $(this).jqGrid("getGridParam", "multiselect");
		},
		getCol : function (rowid, colName) { //Función que devuelve el valro de la celda de la fila que se le pasa como paramtero. El colName puede ser o el indice de la columna o el nombre de la misma
			return $(this).jqGrid("getCell", rowid, colName);
		},
		isEditable : function () {//Función que devuelve si el grid es editable o no.
			return this[0].rup_gridProps.editable;
		},
		getEditingRowData : function (rowid) {
			var ind = this.jqGrid("getInd",rowid,true), aData = [], objData = {}, grid = this;
			if (ind === false) {
				return;
			}
			$('td',ind).each( function(i) {
				if (grid.jqGrid("getGridParam", "colModel")[i]) {
					objData[grid.jqGrid("getGridParam", "colModel")[i].name] = $(":first",this).val();
				}
			});
			return objData;
		},
		isEditing : function () {
			var rowids = this.jqGrid("getDataIDs");
			for (var i =0;i<rowids.length;i++){
				if ($(this.jqGrid("getInd",rowids[i],true)).attr("editable") === "1") {
					return true;
				}
			}
			return false;
		},
		reorderColumns : function (newOrder) {//función que lanza cuando se ordenan las columnas (Drag&Drop)
			if ($.isFunction(this[0].rup_gridProps.onAfterDragAndDrop)) { //lanza el evento onAfterDragAndDrop
				this[0].rup_gridProps.onAfterDragAndDrop.call(this, newOrder);
			}
		}
	});

	$.fn.rup_grid.defaults = {
		loadOnStartUp: true,
		hasMaint: false,
		imgpath: '',
		colNames: [],
		colModel: [],
		width: 800,
		filterParameters: null,
		pagerName: 'pager',
		url: '',
		multiselect: false,
		multiselectWidth: 40,
		rowNum: 10,
		rowList: [10, 20, 30],
		tableclose: true,
		viewrecords: true,
		searchOnEnter: true,
		sortable: true,
		sortorder: "asc",
		sortname: null,
		botones: null,
		menuContextual: null,
		editable: false,
		checkMultiBoxOnly: false,
		multiboxonly: false,
		noMulticheckSelection: false,
		// EVENTOS
		beforeRequest: null,
		loadBeforeSend: null,
		serializeGridData: null,
		loadError: null,
		gridComplete: null,
		loadComplete: null,
		afterInsertRow: null,
		beforeSelectRow: null,
		onCellSelect: null,
		ondblClickRow: null,
		onHeaderClick: null,
		onPaging: null,
		onRightClickRow: null,
		onSelectAll: null,
		onSelectRow: null,
		onSortCol: null,
		resizeStart: null,
		resizeStop: null,
		selectAllGetPrimaryKeys: null,
		onAfterDragAndDrop: null,
		autoencode: true
	};
})(jQuery);