/**
  * Módulo que habilita la edicción mediante un formulario.
  *
  * @summary 		Extensión del componente RUP Datatable
  * @module			"rup.table.editForm"
  * @version     1.0.0
  * @license
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
  * @copyright   Copyright 2018 E.J.I.E., S.A.
  *
  */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.editForm = {};

DataTable.editForm.version = '1.2.4';

/**
* Se inicializa el componente editForm
*
* @name init
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Es el objeto datatable.
*
*/
DataTable.editForm.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.multiSelect;
	var defaults = DataTable.defaults.multiSelect;
	var opts = init === undefined ?	defaults :	init;

	//DetailForm se convierte en function
	//Se inicializan los botones
	ctx.oInit.formEdit.detailForm = $(ctx.oInit.formEdit.detailForm);
	ctx.oInit.formEdit.idForm = ctx.oInit.formEdit.detailForm.find('form');
	ctx.oInit.formEdit.id = ctx.oInit.formEdit.detailForm[0].id.replace('_detail_div','');

	//Se coge el adapter, y se crea la barra de navegación
	if(ctx.oInit.multiSelect === undefined){// si es de select
		_callNavigationSelectBar(dt);
	}else{//si es de multiselect
		_callNavigationBar(dt);
	}
	//Se inicializa el editFrom la info
	_updateDetailPagination(ctx,1,1);

	//se añade el boton de cancelar
	ctx.oInit.formEdit.buttoCancel = ctx.oInit.formEdit.detailForm.find('#'+ctx.sTableId+'_detail_button_cancel');
	ctx.oInit.formEdit.buttoCancel.bind('click', function() {
		ctx.oInit.formEdit.okCallBack = false;
		var feedback = ctx.oInit.formEdit.detailForm.find('#'+ctx.sTableId+'_detail_feedback');

		//Despues de cerrar
		//Se limpia los elementos.
		if(ctx.oInit.formEdit.idForm.find('.error').length > 0){
			ctx.oInit.formEdit.idForm.rup_validate("resetElements");
		}

		//Se cierra el dialog
		ctx.oInit.formEdit.detailForm.rup_dialog("close");
		//Se cierran los mensajes del feedback
		if(feedback[0].className !== ''){
			feedback.rup_feedback('hide');
		}
	});
	var idRow;
	var rowsBody = $( ctx.nTBody);
	//Se edita el row/fila.
	if (ctx.oInit.multiSelect !== undefined || ctx.oInit.select !== undefined) { 
		rowsBody.on( 'dblclick.DT','tr[role="row"]',  function () {
			idRow = this._DT_RowIndex;
			//Añadir la seleccion del mismo.
			if (ctx.oInit.multiSelect !== undefined) {
				dt['row'](idRow).multiSelect();
			}else{
				$('tr',rowsBody).removeClass('selected tr-highlight');
				DataTable.Api().select.selectRowIndex(dt,idRow,true);
			}
			_getRowSelected(dt,'PUT');
			DataTable.editForm.fnOpenSaveDialog('PUT',dt,idRow);
			$('#'+ctx.sTableId).triggerHandler('tableEditFormClickRow');
		} );
	}

	// Creacion del Context Menu
	if (ctx.oInit.buttons !== undefined) {
		var botonesToolbar = ctx._buttons[0].inst.s.buttons;
		var items = {};
		$.when(
			$.each(botonesToolbar, function (i) {
				// Entra si tiene marcada la opcion para habilitarlo dentro del contextMenu
				if (this.conf.insideContextMenu) {
					// Poblamos el objeto 'items' con los botones habilitados
					items[this.conf.id] =
					{
						id: this.conf.id + '_contextMenuToolbar',
						name: this.conf.text(dt),
						inCollection: this.inCollection,
						idCollection: undefined
					}
				}
				// Comprueba si tiene botones hijos
				if (this.buttons.length > 0) {
					var idCollection = this.conf.id;
					$.each(this.buttons, function (i) {
						// Entra si tiene marcada la opcion para habilitarlo dentro del contextMenu
						if (this.conf.insideContextMenu) {
							// Poblamos el objeto 'items' con los botones habilitados
							items[this.conf.id] =
							{
								id: this.conf.id + '_contextMenuToolbar',
								name: this.conf.text(dt),
								inCollection: this.inCollection,
								idCollection: idCollection
							}
						}
					});
				}
			})
		).done(function () {
			var tableTr = $('#' + ctx.sTableId + ' > tbody > tr');
			tableTr.rup_contextMenu({
				callback: function(key, options) {
					var selector = items[key];
					// Recogemos el id de la accion pulsada en el context menu
					var contextMenuActionId = selector.id;
					// Le quitamos la extension '_contextMenuToolbar' para tener asi
					// el id del boton que queremos accionar
					var buttonId = contextMenuActionId.replace('_contextMenuToolbar', '');
					// Variable que nos dira si esta dentro de una coleccion
					var inCollection = selector.inCollection;
					// Variable que almacena el id de la coleccion (si no pertenece a una
					// siempre sera 'undefined')
					var idCollection = selector.idCollection;
					// Comprobamos si existe el elemento con este id
					if (inCollection && idCollection !== undefined) {
						// Obtenemos la info necesaria del boton y la guardamos en variables
						var buttonName;
						var eventDT;
						var eventConfig;

						$.each( ctx.ext.buttons, function( key ) {
							var buttonObject = ctx.ext.buttons[key];
							if (buttonObject.id === buttonId) {
								buttonName = key;
								eventDT = buttonObject.eventDT;
								eventConfig = buttonObject;
							}
						});

						// Llamamos directamente al action para no hacer aparecer y desaparecer
						// el boton, empeorando la UX
						ctx.ext.buttons[buttonName].action(undefined, eventDT, undefined, eventConfig);
					} else {
						$('#' + buttonId).trigger('click');
					}
					
			  },
				items
			});
		});
	}

	//Se captura evento de cierre
	ctx.oInit.formEdit.detailForm.on( "dialogbeforeclose", function( event, ui ) {
		// si es igual no hacer nada.
		var formSerializado = _editFormSerialize(ctx.oInit.formEdit.idForm);
		if(ctx.oInit.formEdit.dataOrigin === formSerializado){
			return true;
		}
		if(ctx.oInit.formEdit.dataOrigin !== formSerializado && !ctx.oInit.formEdit.okCallBack){

			$.rup_messages('msgConfirm', {
				message: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.saveAndContinue'),
				title: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.changes'),
				OKFunction: function () {
					ctx.oInit.formEdit.okCallBack = true;
					ctx.oInit.formEdit.detailForm.rup_dialog("close");
					},
				CANCELFunction: function (){
					ctx.oInit.formEdit.okCallBack = false
					}
			});


		}
		//En caso de aceptar se cierrar y se limpia.
		if(!ctx.oInit.formEdit.okCallBack || ctx.oInit.formEdit.okCallBack === undefined){
			return false;
		}

	} );
	ctx.oInit.formEdit.detailForm.settings = {type: $.rup.dialog.DIV};

};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @name init
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 *
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	//
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._multiSelect_selected ) {
				$( row ).addClass( ctx._multiSelect.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._multiSelect_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._multiSelect.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).multiSelect();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).multiSelect();
				} );
			}
		} );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}

/**
* Función que lleva todo el comportamiento para abrir el dialog y editar un registro.
*
* @name openSaveDialog
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {string} actionType - Es la acción que se va a ajecutar en el formulario para ir al controller, basado en rest.
* @param {object} dt - Es el objeto datatable.
* @param {integer} idRow - Número con la posición de la fila que hay que obtener.
*
*/
DataTable.editForm.fnOpenSaveDialog = function _openSaveDialog(actionType,dt,idRow){
	var ctx = dt.settings()[0];
	var idForm = ctx.oInit.formEdit.idForm;

	//Se limpia los errores. Si hubiese
	var feed = ctx.oInit.formEdit.detailForm.find('#'+ctx.sTableId+'_detail_feedback');
	var divErrorFeedback = ctx.oInit.formEdit.detailForm.find('#'+feed[0].id + '_ok');
	if(divErrorFeedback.length > 0){
		divErrorFeedback.hide();
	}

	//se añade el boton de guardar
	var button = ctx.oInit.formEdit.detailForm.find('#'+ctx.sTableId+'_detail_button_save');
	//se añade el boton de guardar y continuar
	var buttonContinue = ctx.oInit.formEdit.detailForm.find('#'+ctx.sTableId+'_detail_button_save_repeat');

	if(actionType === 'CLONE'){//En caso de ser clonado, solo se debe guardar.
		actionType = 'POST';
		buttonContinue.hide();
	}else{
		buttonContinue.show();
	}

	if(idRow < 0){
		idRow = 1;
	}
	$('#'+ctx.sTableId).triggerHandler('tableEditFormAddEditBeforeInitData');
	var row = ctx.json.rows[idRow];
	var rowArray = $.rup_utils.jsontoarray(row);
	var title;

	if (actionType === 'PUT') {
		$.rup_utils.populateForm(rowArray, idForm);
		var multiselection = ctx.multiselection;
		var indexInArray = jQuery.inArray(DataTable.Api().rupTable.getIdPk(row), multiselection.selectedIds);
		if(ctx.multiselection.selectedAll){//Si es selecAll recalcular el numero de los selects.,solo la primera vez es necesario.
			indexInArray = ctx.oInit.formEdit.$navigationBar.numPosition;
		}
		if(indexInArray === undefined){
			indexInArray = 0;
			ctx.oInit.formEdit.$navigationBar.numPosition = 0;
		}
		var numTotal = multiselection.numSelected;
		if(ctx.oInit.multiSelect === undefined){
			numTotal = ctx.json.recordsTotal;
			indexInArray = (Number(ctx.json.page)-1) * 10;
			indexInArray = indexInArray + idRow;
		}
		$('#'+ctx.sTableId).triggerHandler('tableEditFormAfterFillData');
		_updateDetailPagination(ctx,indexInArray+1,numTotal);
		DataTable.Api().rupTable.selectPencil(ctx,idRow);
		//Se guarda el ultimo id editado.
		ctx.multiselection.lastSelectedId = DataTable.Api().rupTable.getIdPk(row);
		//Se muestra el dialog.
		ctx.oInit.formEdit.$navigationBar.show();
		// Asignamos un valor a la variable del título del formulario
		title =  $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.edit.editCaption');
		// Comprobamos si se desea bloquear la edicion de las claves primarias
		if(ctx.oInit.blockPKeditForm) {
			$.each(ctx.oInit.primaryKey,function(key,id) {
				$(idForm[0]).find("input[name=" + id + "]").prop("readOnly", true);
			});
		}
	} else if(actionType === 'POST'){
		$.rup_utils.populateForm(rowArray, idForm);
		ctx.oInit.formEdit.$navigationBar.hide();
		// Asignamos un valor a la variable del título del formulario
		title = $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.edit.addCaption');
	}
	
	$('#'+ctx.sTableId).triggerHandler('tableEditFormAddEditBeforeShowForm');
	// Establecemos el título del formulario
	ctx.oInit.formEdit.detailForm.rup_dialog("setOption", "title", title);
	
	ctx.oInit.formEdit.detailForm.rup_dialog(ctx.oInit.formEdit.detailForm.settings);
	ctx.oInit.formEdit.detailForm.rup_dialog("open");
	
	// Establecemos el foco al primer elemento input o select que se
	// encuentre habilitado en el formulario
	$(idForm[0]).find('input,select').filter(':not([readonly]):first').focus();

	//Se guardan los datos originales
	ctx.oInit.formEdit.dataOrigin = _editFormSerialize(idForm);
	ctx.oInit.formEdit.okCallBack = false


	button.unbind( "click" );
	button.bind('click', function() {
		//Comprobar si row ha sido modificada
		//Se serializa el formulario con los cambios
		row = _editFormSerialize(idForm);
        
		//Verificar los checkbox vacíos.
        row = _returnCheckEmpty(idForm,_editFormSerialize(idForm));
        
        //Se transforma
		row = $.rup_utils.queryStringToJson(row);
		ctx.oInit.formEdit.okCallBack = true;

		_callSaveAjax(actionType,dt,row,idRow,false,ctx.oInit.formEdit.detailForm,'');
	});


	ctx.oInit.formEdit.detailForm.buttonSaveContinue = buttonContinue;
	ctx.oInit.formEdit.detailForm.buttonSaveContinue.actionType = actionType;
	buttonContinue.unbind( "click" );
	buttonContinue.bind('click', function() {
		var actionSaveContinue = ctx.oInit.formEdit.detailForm.buttonSaveContinue.actionType;
		//Comprobar si row ha sido modificada
		//Se serializa el formulario con los cambios
		row = _editFormSerialize(idForm);
		
		//Verificar los checkbox vacíos.
		row = _returnCheckEmpty(idForm,_editFormSerialize(idForm));
		
		//Se transforma
		row = $.rup_utils.queryStringToJson(row);
		
		_callSaveAjax(actionSaveContinue,dt,row,idRow,true,ctx.oInit.formEdit.detailForm,'')
	});

	$('#'+ctx.sTableId).triggerHandler('tableEditFormAddEditAfterShowForm');
}


/**
* Llamada al servidor con los datos de edición.
*
* @name _callSaveAjax
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {string} actionType - Es la acción que se va a ajecutar en el formulario para ir al controller, basado en rest.
* @param {object} dt - Es el objeto datatable.
* @param {object} row - Son los datos que se cargan.
* @param {integer} idRow - Número con la posición de la fila que hay que obtener.
* @param {boolean} continuar - Si es true guarda la pagina y se queda en el dialog , si es false guarda y cierra el dialog.
* @param {string} idTableDetail - Identificdor del detail de la table.
* @param {string} url - Url que se añade para llamar  al controller.
*
*/
function _callSaveAjax(actionType,dt,row,idRow,continuar,idTableDetail,url){
	var ctx = dt.settings()[0];
	$('#'+ctx.sTableId).triggerHandler('tableEditFormBeforeCallAjax');
	// add Filter
	var feed = idTableDetail.find('#'+ctx.sTableId+'_detail_feedback');
	var msgFeedBack = $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.modifyOK');
	if(url === '/deleteAll' || actionType === 'DELETE'){
		msgFeedBack = $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.deletedOK');
	}
	var ajaxOptions = {
		url : ctx.oInit.urlBase+url,
		accepts: {'*':'*/*','html':'text/html','json':'application/json, text/javascript',
			'script':'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
			'text':'text/plain','xml':'application/xml, text/xml'},
		type : actionType,
		data : row,
		dataType : 'json',
		showLoading : false,
		contentType : 'application/json',
		async : true,
		success : function(data, status, xhr) {

			if(url !== '/deleteAll' && actionType !== 'DELETE'){
				if(continuar){//Se crea un feddback_ok,para que no se pise con el de los errores
					var divOkFeedback = idTableDetail.find('#'+feed[0].id + '_ok');
					if(divOkFeedback.length === 0){
						divOkFeedback = $('<div/>').attr('id', feed[0].id + '_ok').insertBefore(feed)
					}
					_callFeedbackOk(ctx,divOkFeedback,msgFeedBack,'ok');//Se informa,feedback del formulario
				}else{
					ctx.oInit.formEdit.detailForm.rup_dialog("close");
					_callFeedbackOk(ctx,ctx.multiselection.internalFeedback,msgFeedBack,'ok');//Se informa feedback de la tabla
				}

				if(actionType === 'PUT'){//Modificar
					dt.row(idRow).data(row);// se actualiza al editar
					ctx.json.rows[idRow] = row;
					// Actualizamos el ultimo id seleccionado (por si ha sido editado)
					var posicion = 0;
					$.each(ctx.multiselection.selectedRowsPerPage,function(index,p) {
						if(p.id === ctx.multiselection.lastSelectedId){
							posicion = index;
							return;
						}
					});
					if(ctx.seeker !== undefined && !jQuery.isEmptyObject(ctx.seeker.ajaxOption.data.search)
							&& ctx.seeker.search.funcionParams.length > 0){
						_comprobarSeeker(row,ctx,idRow);
					}
					ctx.multiselection.lastSelectedId = DataTable.Api().rupTable.getIdPk(row);
					ctx.multiselection.selectedRowsPerPage[posicion].id = DataTable.Api().rupTable.getIdPk(row);
				}else{
					//Se actualiza la tabla temporalmente. y deja de ser post para pasar a put(edicion)
					if(ctx.oInit.select !== undefined){
						DataTable.Api().select.deselect(ctx);
					}
					var rowAux = row;
					$.each(ctx.json.rows,function(index,r) {
						var rowNext = r;
						dt.row(index).data(rowAux);
						rowAux = rowNext;
					});
					ctx.json.rows.pop();
					ctx.json.rows.splice(0,0,row);
					//Se guardan los datos para pasar de nuevo a editable.
					ctx.oInit.formEdit.detailForm.buttonSaveContinue.actionType = 'PUT';
					ctx.oInit.formEdit.dataOrigin = _editFormSerialize(ctx.oInit.formEdit.idForm);
					if(ctx.oInit.multiSelect !== undefined){
						ctx.multiselection.internalFeedback.type = "noBorrar";
						dt['row']().multiSelect();
					}
					//Se actualiza la linea
					if (ctx.json.reorderedSelection !== null && ctx.json.reorderedSelection !== undefined) {
						ctx.multiselection.selectedRowsPerPage[0].line = ctx.json.reorderedSelection[0].pageLine;
					}
					$('#'+ctx.sTableId).triggerHandler('tableEditFormAfterInsertRow');
				}
				
			}else{// Eliminar
				ctx.multiselection.internalFeedback.type = 'eliminar';
				ctx.multiselection.internalFeedback.msgFeedBack = msgFeedBack;
				if(ctx.oInit.multiSelect !== undefined){
					DataTable.Api().multiSelect.deselectAll(dt);
				}else if(ctx.oInit.select !== undefined){
					DataTable.Api().select.deselect(ctx);
				}
				$('#' + ctx.sTableId).triggerHandler('tableEditFormAfterDelete');
			}
			// Recargar datos
			dt.ajax.reload();
			$('#' + ctx.sTableId).triggerHandler('tableEditFormSuccessCallSaveAjax');
		},
		complete : function() {
			$('#' + ctx.sTableId).triggerHandler('tableEditFormCompleteCallSaveAjax');
		},
		error : function(xhr, ajaxOptions,thrownError) {
			var divErrorFeedback = idTableDetail.find('#'+feed[0].id + '_ok');
			if(divErrorFeedback.length === 0){
				divErrorFeedback = $('<div/>').attr('id', feed[0].id + '_ok').insertBefore(feed)
			}
			_callFeedbackOk(ctx,divErrorFeedback,xhr.responseText,'error');
			$('#' + ctx.sTableId).triggerHandler('tableEditFormErrorCallSaveAjax');
		},
		validate:ctx.oInit.formEdit.validate,
		feedback:feed.rup_feedback({type:"ok",block:false})
	};

	ctx.oInit.formEdit.idForm.rup_form('ajaxSubmit', ajaxOptions);
}

/**
* Llamada para crear el feedback dentro del dialog.
*
* @name callFeedbackOk
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} ctx - Settings object to operate on.
* @param {object} feedback - Div donde se va ejecutar el feedback.
* @param {string} msgFeedBack - Mensaje para el feedback.
* @param {string} type - Tipos del feedback, mirar en el rup.feedback..
*
*/
function _callFeedbackOk(ctx,feedback,msgFeedBack,type){
	$('#' + ctx.sTableId).triggerHandler('tableEditFormFeedbackShow');
	var confDelay = ctx.oInit.feedback.okFeedbackConfig.delay;
	feedback.rup_feedback({message:msgFeedBack,type:type,block:false});
	feedback.rup_feedback('set',msgFeedBack);
	//Aseguramos que el estilo es correcto.
	if(type === 'ok'){
		setTimeout(function(){
			feedback.rup_feedback('destroy');
			feedback.css('width','100%');
			$('#' + ctx.sTableId).triggerHandler('tableEditFormInternalFeedbackClose');
		}, confDelay);
	}
}


/**
* Se verifican los check vacios dentro de un formulario.
*
* @name returnCheckEmpty
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} idForm - Identificador del formulario.
* @param {string} values - Values ya añadidos al formulario.
*
*/
function _returnCheckEmpty(idForm,values){
	var maps = jQuery(idForm.selector+' input[type=checkbox]:not(:checked)').map(
                    function() {
                        return "&"+this.name+"=0"
                    }).get().toString();
	return values+maps;
}

/**
* Actualiza la navegación del dialogo.
*
* @name updateDetailPagination
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} ctx - Settings object to operate on.
* @param {integer} currentRowNum - Número de la posción actual del registro selecionado.
* @param {integer} totalRowNum - Número total de registros seleccionados.
*
*/
function _updateDetailPagination(ctx,currentRowNum,totalRowNum){
	var formId = ctx.oInit.formEdit.id;
	var tableId = ctx.oInit.formEdit.$navigationBar[0].id;
	if (currentRowNum === 1) {
		$('#first_' + tableId + ', #back_' + tableId, ctx.oInit.formEdit.detailForm).addClass('ui-state-disabled');
	} else {
		$('#first_' + tableId + ', #back_' + tableId, ctx.oInit.formEdit.detailForm).removeClass('ui-state-disabled');
	}
	if (currentRowNum === totalRowNum) {
		$('#forward_' + tableId + ', #last_' + tableId, ctx.oInit.formEdit.detailForm).addClass('ui-state-disabled');
	} else {
		$('#forward_' + tableId + ', #last_' + tableId, ctx.oInit.formEdit.detailForm).removeClass('ui-state-disabled');
	}

	$('#rup_table_selectedElements_' + tableId).text(jQuery.jgrid.format(jQuery.rup.i18nParse(jQuery.rup.i18n.base, 'rup_datatable.defaults.detailForm_pager'), currentRowNum, totalRowNum));
}

/**
* Constructor de la barra de navegación.
*
* @name callNavigatorBar
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Es el objeto datatable.
*
*/
function _callNavigationBar(dt){
	var ctx = dt.settings()[0];
	ctx.oInit._ADAPTER = $.rup.adapter[jQuery.fn.rup_table.plugins.core.defaults.adapter];
	ctx.oInit.formEdit.$navigationBar = ctx.oInit.formEdit.detailForm.find('#'+ctx.sTableId+'_detail_navigation');
	var settings = {};
	//Funcion para obtener los parametros de navegacion.
	settings.fncGetNavigationParams = function getNavigationParams_multiselection(linkType) {
		var execute = false,
			changePage = false,
			index = 0,
			newPageIndex = 0,
			npos = ctx.oInit.formEdit.$navigationBar.currentPos,
			page = dt.page()+1,
			newPage = page,
			lastPage = ctx.json.total;
		var multiselection = ctx.multiselection;
		var rowSelected;

		switch (linkType) {
		case 'first':
			// Si no se han seleccionado todos los elementos
			if (!multiselection.selectedAll) {
				rowSelected = multiselection.selectedRowsPerPage[0];
				rowSelected.indexSelected = 0;
			} else {
				// En el caso de que se hayan seleccionado todos los elementos de la tabla
				// Recorremos las páginas buscando la primera en la que existan elementos seleccionados
				ctx.oInit.formEdit.$navigationBar.numPosition = 0;
				rowSelected = ctx.oInit.formEdit.$navigationBar.currentPos;
				rowSelected.page = _getNextPageSelected (ctx,1,'next');
				if(Number(rowSelected.page) === page){//Si es la misma pagina.buscar la linea
					rowSelected.line = _getLineByPageSelected(ctx,-1);
				}else{
					rowSelected.line = 0; // luego hay que buscar la linea
				}
			}
			break;
		case 'prev':
			// Si no se han seleccionado todos los elementos
			if (!multiselection.selectedAll) {
				var indexPrev = ctx.oInit.formEdit.$navigationBar.currentPos.indexSelected-1;
				rowSelected = multiselection.selectedRowsPerPage[indexPrev];
				rowSelected.indexSelected = indexPrev;
			}else{
				ctx.oInit.formEdit.$navigationBar.numPosition--;
				var linea = _getLineByPageSelectedReverse(ctx,ctx.oInit.formEdit.$navigationBar.currentPos.line);
				if(linea === -1){//Es que hay que cambiar de pagina.
					//buscarPAgina.
					rowSelected = ctx.oInit.formEdit.$navigationBar.currentPos;
					rowSelected.page = _getPrevPageSelected (ctx,page-1);

				}else{
					rowSelected = ctx.oInit.formEdit.$navigationBar.currentPos;
				}
			}

			break;
		case 'next':
			// Si no se han seleccionado todos los elementos
			if (!multiselection.selectedAll) {
				var indexNext = ctx.oInit.formEdit.$navigationBar.currentPos.indexSelected+1;
				rowSelected = multiselection.selectedRowsPerPage[indexNext];
				rowSelected.indexSelected = indexNext;
			}else{
				ctx.oInit.formEdit.$navigationBar.numPosition++;
				//2 casos: Si hay que navegar o no.
				var lineaNext = _getLineByPageSelected(ctx,ctx.oInit.formEdit.$navigationBar.currentPos.line);
				if(lineaNext === -1){//Es que hay que cambiar de pagina.
					//buscarPAgina.
					rowSelected = ctx.oInit.formEdit.$navigationBar.currentPos;
					rowSelected.page = _getNextPageSelected (ctx,page+1,'next');
					rowSelected.line = 0; // luego hay que buscar la linea
				}else{
					rowSelected = ctx.oInit.formEdit.$navigationBar.currentPos;
				}
			}

			break;
		case 'last':
				// Si no se han seleccionado todos los elementos
			if (!multiselection.selectedAll) {
				var indexLast = multiselection.selectedRowsPerPage.length-1;
				rowSelected = multiselection.selectedRowsPerPage[indexLast];
				rowSelected.indexSelected = indexLast;
			} else {
				ctx.oInit.formEdit.$navigationBar.numPosition = ctx.multiselection.numSelected - 1;
				rowSelected = ctx.oInit.formEdit.$navigationBar.currentPos;
				rowSelected.page = _getPrevPageSelected (ctx,lastPage);
				if(Number(rowSelected.page) === page){//Si es la misma pagina.buscar la linea
					rowSelected.line = _getLineByPageSelectedReverse(ctx,-1);
				}
			}

		}
		if(Number(rowSelected.page) !== page){
			var table = $('#'+ctx.sTableId).DataTable();
			table.page( rowSelected.page-1 ).draw( 'page' );
			//Se añaden los parametros para luego ejecutar, la funcion del dialog.
			ctx.oInit.formEdit.$navigationBar.funcionParams = ['PUT',dt,rowSelected.line,linkType];
		}else{//Si nose pagina se abre directamente la funcion.
			DataTable.editForm.fnOpenSaveDialog('PUT',dt,rowSelected.line);
		}
		//Se actualiza la ultima posicion movida.
		ctx.oInit.formEdit.$navigationBar.currentPos = rowSelected;
		//Se añade un parametro respecto el rup.table para permitir la convivencia.
		return [linkType, execute, changePage, index - 1, npos, newPage, newPageIndex - 1,''];

	};


	ctx.oInit.formEdit.$navigationBar.data('settings', settings);
	//var barraNavegacion = $.proxy(ctx.oInit.adapter.createDetailNavigation,ctx.oInit.formEdit.$navigationBar);
	var barraNavegacion = $.proxy(ctx.oInit._ADAPTER.createDetailNavigation,ctx.oInit.formEdit.$navigationBar);
	ctx.oInit.formEdit.$navigationBar.append(barraNavegacion);
}

/**
* Constructor de la barra de navegación.
*
* @name callNavigatorSelectBar
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Es el objeto datatable.
*
*/
function _callNavigationSelectBar(dt){
	var ctx = dt.settings()[0];
	ctx.oInit._ADAPTER = $.rup.adapter[jQuery.fn.rup_table.plugins.core.defaults.adapter];
	ctx.oInit.formEdit.$navigationBar = ctx.oInit.formEdit.detailForm.find('#'+ctx.sTableId+'_detail_navigation');
	var settings = {};

	//Funcion para obtener los parametros de navegacion.
	settings.fncGetNavigationParams = function getNavigationParams_multiselection(linkType) {
		var execute = false,
			changePage = false,
			index = 0,
			newPageIndex = 0,
			npos = ctx.oInit.formEdit.$navigationBar.currentPos,
			page = dt.page()+1,
			newPage = page,
			lastPage = ctx.json.total;
		var futurePage = page;

		switch (linkType) {
		case 'first':
			futurePage = 1;
			ctx.multiselection.selectedRowsPerPage[0].line = 0;
			break;
		case 'prev':
			ctx.multiselection.selectedRowsPerPage[0].line = ctx.multiselection.selectedRowsPerPage[0].line-1;
			if(ctx.json.rows[ctx.multiselection.selectedRowsPerPage[0].line] === undefined){
				futurePage = futurePage-1;
			}
			break;
		case 'next':
			ctx.multiselection.selectedRowsPerPage[0].line = ctx.multiselection.selectedRowsPerPage[0].line+1;
			if(ctx.json.rows[ctx.multiselection.selectedRowsPerPage[0].line] === undefined){
				futurePage = futurePage+1;
			}
			break;
		case 'last':
			futurePage = lastPage;
			ctx.multiselection.selectedRowsPerPage[0].line = ctx.json.rows.length-1;

		}
		//Cambio de pagina
		if(Number(futurePage) !== page){
			var table = $('#'+ctx.sTableId).DataTable();
			ctx.select.selectedRowsPerPage = {};
			ctx.select.selectedRowsPerPage.cambio = linkType;
			ctx.select.selectedRowsPerPage.page = futurePage;
			table.page( futurePage-1 ).draw( 'page' );
		}else{//Si nose pagina se abre directamente la funcion.
			DataTable.editForm.fnOpenSaveDialog('PUT',dt,ctx.multiselection.selectedRowsPerPage[0].line);
			var rowSelectAux = ctx.json.rows[ctx.multiselection.selectedRowsPerPage[0].line];
			ctx.multiselection.selectedRowsPerPage[0].id = DataTable.Api().rupTable.getIdPk(rowSelectAux);
			DataTable.Api().select.deselect(ctx);
			DataTable.Api().select.drawSelectId(ctx);
		}

	};


	ctx.oInit.formEdit.$navigationBar.data('settings', settings);
	//var barraNavegacion = $.proxy(ctx.oInit.adapter.createDetailNavigation,ctx.oInit.formEdit.$navigationBar);
	var barraNavegacion = $.proxy(ctx.oInit._ADAPTER.createDetailNavigation,ctx.oInit.formEdit.$navigationBar);
	ctx.oInit.formEdit.$navigationBar.append(barraNavegacion);
}

/**
* Metodo que obtiene la fila siguiente seleccionada.
*
* @name getRowSelected
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Es el objeto datatable.
* @param {string} actionType - Es el objeto datatable.
*
* @return {object} que contiene  el identificador, la pagina y la linea de la fila seleccionada
*
*/
function _getRowSelected(dt,actionType){
	var ctx = dt.settings()[0];
	var rowDefault = {id:0,page:1,line:0};
	var lastSelectedId = ctx.multiselection.lastSelectedId;
	if(!ctx.multiselection.selectedAll){
		//Si no hay un ultimo señalado se coge el ultimo;

		if(lastSelectedId === undefined || lastSelectedId === ''){
			ctx.multiselection.lastSelectedId = ctx.multiselection.selectedRowsPerPage[0].id;
		}
		$.each(ctx.multiselection.selectedRowsPerPage,function(index,p) {
			if(p.id === ctx.multiselection.lastSelectedId){
				rowDefault.id = p.id;
				rowDefault.page = p.page;
				rowDefault.line = p.line;
				rowDefault.indexSelected = index;
				ctx.oInit.formEdit.$navigationBar.currentPos = rowDefault;
				return false;
			}
		});
	}else{
		ctx.oInit.formEdit.$navigationBar.numPosition = 0;//variable para indicar los mostrados cuando es selectAll y no se puede calcular,El inicio es 0.
		if(lastSelectedId === undefined || lastSelectedId === ''){
			rowDefault.page = _getNextPageSelected (ctx,1,'next');//Como arranca de primeras la pagina es la 1.
			rowDefault.line = _getLineByPageSelected(ctx,-1);
		}else{
			//buscar la posicion y pagina
			var result = $.grep(ctx.multiselection.selectedRowsPerPage, function(v) {
				return v.id === ctx.multiselection.lastSelectedId;
			});
			rowDefault.page = result[0].page;
			rowDefault.line = result[0].line;
			var index = ctx._iDisplayLength * (Number(rowDefault.page)-1);
			index = index+1+rowDefault.line;
			//Hay que restar los deselecionados.
			 result = $.grep(ctx.multiselection.deselectedRowsPerPage, function(v) {
					return Number(v.page) < Number(rowDefault.page) || (Number(rowDefault.page) === Number(v.page) && Number(v.line) < Number(rowDefault.line));
				});
			rowDefault.indexSelected = index-result.length;//Buscar indice
			ctx.oInit.formEdit.$navigationBar.numPosition = rowDefault.indexSelected-1;
		}

		ctx.oInit.formEdit.$navigationBar.currentPos = rowDefault;
	}

	//En caso de estar en una pagina distinta , navegamos a ella
	if(dt.page()+1 !== Number(rowDefault.page)){
		var table = $('#'+ctx.sTableId).DataTable();
		table.page( rowDefault.page-1 ).draw( 'page' );
		ctx.oInit.formEdit.$navigationBar.funcionParams = [actionType,dt,rowDefault.line];
	}

	return rowDefault;
}

/**
* Metodo que obtiene la página siguiente donde esta el primer elemento o elemento seleccionado.
*
* @name getNextPageSelected
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} ctx - Settings object to operate on.
* @param {integer} pageInit - Página a partir de la cual hay que mirar, en general serà la 1.
* @param {string} orden - Pueder ser pre o next, en función de si necesitar ir hacia adelante o hacia atrás.
*
* @return integer - devuele la página
*
*/
function _getNextPageSelected(ctx,pageInit,orden){
	var pagina = pageInit;
	var pageTotals = ctx.json.total;
	if(orden === 'prev'){//Si es previo se resta.
		pageTotals = 1;
	}
	if(ctx.multiselection.deselectedRowsPerPage.length > 0){
		var maxPagina = ctx.json.rows.length;
		var count = 0;
		//Buscar la pagina donde va estar el seleccionado.
		for (var page=pageInit; page<pageTotals;) {
			$.each(ctx.multiselection.deselectedRowsPerPage,function(index,p) {
				if(page === Number(p.page)){
					count++;
				}
				if(count === maxPagina){
					return false;
				}
			});
			if(count < maxPagina){
				pagina = page;
				page = ctx.json.total;//Se pone el total para salir del bucle.
			}
			count = 0;
			if(orden === 'next'){
				page++;
			}else if(orden === 'prev'){
				page--;
			}
		}
	}
	return pagina;
}

/**
* Metodo que obtiene la página siguiente donde esta el primer elemento o elemento seleccionado.
*
* @name getPrevPageSelected
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} ctx - Settings object to operate on.
* @param {integer} pageInit - Página a partir de la cual hay que mirar, en general serà la 1.
*
* @return integer - devuele la página
*
*/
function _getPrevPageSelected(ctx,pageInit){
	var pagina = pageInit;
	var pageTotals = 1;
	if(ctx.multiselection.deselectedRowsPerPage.length > 0){
		var maxPagina = ctx.json.rows.length;
		if(ctx.json.total === pagina){//Es ultima pagina, calcular los registros{
			maxPagina =  ctx.json.records % ctx._iDisplayLength;
		}
		var count = 0;
		//Buscar la pagina donde va estar el seleccionado.
		for (var page=pageInit; pageTotals <= page;) {
			$.each(ctx.multiselection.deselectedRowsPerPage,function(index,p) {
				if(Number(page) === Number(p.page)){
					count++;
				}
				if(count === maxPagina){
					return false;
				}
			});
			if(count < maxPagina){
				pagina = page;
				pageTotals = ctx.json.total;//Se pone el total para salir del bucle.
			}
			count = 0;
			page--;
		}
	}
	return pagina;
}


/**
* Metodo que obtiene la linea siguiente donde esta el primer elemento o elemento seleccionado.
*
* @name getLineByPageSelected
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} ctx - Settings object to operate on.
* @param {integer} lineInit - Linea a partir de la cual hay que mirar, en general será la 1.
*
* @return integer - devuele la linea
*
*/
function _getLineByPageSelected(ctx,lineInit){
	var line = -1;
	var rows = ctx.json.rows;

	$.each(rows, function( index, row ) {
		if(index > lineInit){
			var indexInArray = jQuery.inArray(DataTable.Api().rupTable.getIdPk(row), ctx.multiselection.deselectedIds);
			if(indexInArray === -1){
				line = index;
				var arra = {id:DataTable.Api().rupTable.getIdPk(row),page:ctx.json.page,line:index};
				ctx.oInit.formEdit.$navigationBar.currentPos = arra;
				return false;
			}
		}
	});
	return line;
}

/**
* Metodo que obtiene la última linea siguiente donde esta el primer elemento o elemento seleccionado.
*
* @name getLineByPageSelectedReverse
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} ctx - Settings object to operate on.
* @param {integer} lineInit - Linea a partir de la cual hay que mirar.
*
* @return integer - devuele la linea
*
*/
function _getLineByPageSelectedReverse(ctx,lineInit){
	var line = -1;
	var rows = ctx.json.rows;

	for (var index=rows.length-1; index>=0;index--) {
		var row = rows[index];
		if(index < lineInit){
			var indexInArray = jQuery.inArray(DataTable.Api().rupTable.getIdPk(row), ctx.multiselection.deselectedIds);
			if(indexInArray === -1){
				line = index;
				var arra = {id:DataTable.Api().rupTable.getIdPk(row),page:ctx.json.page,line:index};
				ctx.oInit.formEdit.$navigationBar.currentPos = arra;
				index = -1;
			}
		}
	};
	return line;
}

/**
* Metodo que elimina todos los registros seleccionados.
*
* @name deleteAllSelects
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Es el objeto datatable.
*
*/
function _deleteAllSelects(dt){
	var ctx = dt.settings()[0];
	var row = ctx.multiselection.selectedIds;
	var idRow = 0;
	$.rup_messages('msgConfirm', {
		message: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.deleteAll'),
		title: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.delete'),
		OKFunction: function () {
			if(ctx.multiselection.selectedIds.length > 1){
				var row = {};
				row.core =  {'pkToken': ctx.oInit.multiplePkToken,'pkNames': ctx.oInit.primaryKey};
				row.multiselection = {};
				row.multiselection.selectedAll = ctx.multiselection.selectedAll;
				if(row.multiselection.selectedAll){
					row.multiselection.selectedIds = ctx.multiselection.deselectedIds;
				}else{
					row.multiselection.selectedIds = ctx.multiselection.selectedIds;
				}
				_callSaveAjax('POST',dt,row,idRow,false,ctx.oInit.formEdit.detailForm,'/deleteAll');
			}else{
				row = ctx.multiselection.selectedIds[0];
				row = row.replace(ctx.oInit.multiplePkToken,'/');
				_callSaveAjax('DELETE',dt,'',idRow,false,ctx.oInit.formEdit.detailForm,'/'+row);
			}
		}
	});
}

/**
* Metodo que serializa los datos del formulario.
*
* @name _editFormSerialize
* @function
* @since UDA 3.6.0 // Datatable 1.2.0
*
* @param {object} idForm - Formulario que alberga los datos.
*
* @return {string} - Devuelve los datos del formulario serializados
*
*/
function _editFormSerialize(idForm){
	var serializedForm = '';
	var idFormArray = idForm.formToArray();
	var length = idFormArray.length;
	
	$.each( idFormArray, function( key, obj ) {
		serializedForm += (obj.name + "=" + obj.value);
		
		if(key < length - 1) {
			serializedForm += "&";
		}
	});
	
	return serializedForm;
}

function _comprobarSeeker(row,ctx,idRow){
	var cumple = true;
	$.each( ctx.seeker.ajaxOption.data.search, function( key, obj ) {
		if(row[key].indexOf(obj)  === -1){
			cumple = false;
			return false;
		}
	});
	if(!cumple){// eliminar del seeker, por pagina y linea		
		ctx.seeker.search.funcionParams = jQuery.grep(ctx.seeker.search.funcionParams, function(search) {
			  return (search.page !== Number(ctx.json.page) || search.pageLine !== idRow+1);
			});
		// se borra el icono
		
		$('#'+ctx.sTableId+' tbody tr:eq('+idRow+') td.select-checkbox span.ui-icon-search').remove();
		$('#'+ctx.sTableId+' tbody tr:eq('+idRow+') td span.ui-icon-search').remove();
		DataTable.Api().seeker.updateDetailSeekPagination(1,ctx.seeker.search.funcionParams.length,ctx);
	}
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;

apiRegister( 'editForm.openSaveDialog()', function ( actionType,dt,idRow ) {//Se declara la variable del editForm para que puede ser invocada desde cualquier sitio.
	DataTable.editForm.fnOpenSaveDialog(actionType,dt,idRow );
} );

apiRegister( 'editForm.updateDetailPagination()', function ( ctx,currentRowNum,totalRowNum ) {
	_updateDetailPagination(ctx,currentRowNum,totalRowNum)
} );

apiRegister( 'editForm.getRowSelected()', function ( dt,actionType ) {
	return _getRowSelected(dt,actionType);
} );

apiRegister( 'editForm.deleteAllSelects()', function ( dt ) {
	return _deleteAllSelects(dt);
} );

apiRegister( 'editForm.getLineByPageSelected()', function ( ctx,linea ) {
	return _getLineByPageSelected(ctx,linea);
} );

apiRegister( 'editForm.getLineByPageSelectedReverse()', function ( ctx,linea ) {
	return _getLineByPageSelectedReverse(ctx,linea);
} );

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'plugin-init.dt', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if(ctx.oInit.formEdit !== undefined){
		DataTable.editForm.init( new DataTable.Api( ctx ) );
		$(ctx.oInit.formEdit.detailForm).rup_dialog($.extend({}, {
			type: $.rup.dialog.DIV,
			autoOpen: false,
			modal: true,
			resizable: '',
			width: 569
		}, {}));
	}

} );


return DataTable.editForm;
}));
