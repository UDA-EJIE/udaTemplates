/**
  * Módulo que permite toda la multiseleción
  *
  * @summary 		Extensión del componente RUP Datatable
  * @module			"rup.table.multiSelect"
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
		define( ['jquery', 'datatables.net','../rup.contextMenu','../rup.feedback'], function ( $ ) {
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
DataTable.multiSelect = {};

DataTable.multiSelect.version = '1.2.4';

/**
* Se inicializa el componente multiselect
*
* @name init
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} dt - Es el objeto datatable.
*
*/
DataTable.multiSelect.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.multiSelect;
	var defaults = DataTable.defaults.multiSelect;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var info = true;
	var selector = 'td:first-child';
	var className = 'selected tr-highlight';
	var setStyle = false;

	ctx._multiSelect = {};

	//se Inicializa las propiedades de los select.
	//ctx.multiselection = $self._initializeMultiselectionProps();

	_paintCheckboxSelect(ctx);

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
		setStyle = true;
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
		setStyle = true;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
			setStyle = true;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.multiSelect.selector( selector );
	dt.multiSelect.items( items );
	dt.multiSelect.style( style );
	dt.multiSelect.blurable( blurable );
	dt.multiSelect.info( info );
	ctx._multiSelect.className = className;

	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._multiSelect.items === 'row' ) {
				return $( td ).parent().hasClass( settings._multiSelect.className );
			} else if ( settings._multiSelect.items === 'cell' ) {
				return $( td ).hasClass( settings._multiSelect.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( ! setStyle && $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.smultiSelect.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string     - Can be `rows`, `columns` or `cells`. Defines what item
	                   will be selected if the user is allowed to activate row
	                   selection using the mouse.
	style:string     - Can be `none`, `single`, `multi` or `os`. Defines the
	                   interaction style when selecting items
	blurable:boolean - If row selection can be cleared by clicking outside of
	                   the table
	info:boolean     - If the selection summary should be shown in the table
	                   information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 *
 * @name cellRange
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0 
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * 
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}

			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}

			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @name disabledMouseSelection
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 * 
 * @param {DataTable.Api} dt DataTable to remove events from
 * e
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._multiSelect.selector;

	$( dt.table().container() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' + dt.table().node().id );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @name enableMouseSelection
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 * 
 * @param {DataTable.Api} dt DataTable to remove events from
 * 
 */
function enableMouseSelection ( dt )
{
	var container = $( dt.table().container() );
	var ctx = dt.settings()[0];
	var selector = ctx._multiSelect.selector;

	container
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				container
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			container.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.multiSelect.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( window.getSelection ) {
				var selection = window.getSelection();

				// If the element that contains the selection is not in the table, we can ignore it
				// This can happen if the developer selects text from the click event
				if ( ! selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node() ) {
					if ( $.trim(selection.toString()) !== '' ) {
						return;
					}
				}
			}

			var ctx = dt.settings()[0];

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.dataTables_wrapper')[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._multiSelect_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect' + dt.table().node().id, function ( e ) {
		if ( ctx._multiSelect.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Ignore elements which have been removed from the DOM (i.e. paging
			// buttons)
			if ( $(e.target).parents('html').length === 0 ) {
			 	return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @name eventTrigger
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 * 
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * 
 */
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
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 *
 * @name info
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {DataTable.Api} api DataTable to update
 * 
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._multiSelect.info || ! ctx.aanFeatures.i ) {
		return;
	}

	if ( api.multiSelect.style() === 'api' ) {
		return;
	}
	var DataTable = $.fn.dataTable;

	var rows    = api.rows( { selected: true } ).flatten().length;
	var columns = api.columns( { selected: true } ).flatten().length;
	var cells   = api.cells( { selected: true } ).flatten().length;



	var add = function ( el, name, num ) {
		name = jQuery.rup.i18nTemplate(ctx.oLanguage, 'fila');
		var sels = jQuery.rup.i18nTemplate(ctx.oLanguage, 'seleccionadas');
		var sel = jQuery.rup.i18nTemplate(ctx.oLanguage, 'seleccionada');
		el.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s '+sels+'', 0: '', 1: '1 '+name+' '+sel+'' },
			num
		) ) );
	};

	rows = ctx.multiselection.numSelected;
	//Antes de mostrar la info se ha de ordenar.

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var output  = $('<span class="select-info"/>');
		add( output, 'row', rows );
		add( output, 'column', columns );
		add( output, 'cell', cells  );

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
	
	$('#'+ctx.sTableId).triggerHandler('tableMultiSelectionRowNumberUpdate');
}

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

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
		_drawSelectId(api,ctx);
		//Comprobar si hay algun feedback activado
		var feedback = ctx.multiselection.internalFeedback;
		 if(feedback.type !== undefined && feedback.type === 'eliminar'){
			 	var confDelay = ctx.oInit.feedback.okFeedbackConfig.delay;
				feedback.rup_feedback({message:feedback.msgFeedBack,type:"ok",block:false});
				//Aseguramos que el estilo es correcto.
				setTimeout(function(){
					feedback.rup_feedback('destroy');
					feedback.css('width','100%');
					$('#' + ctx.sTableId).triggerHandler('tableMultiSelectFeedbackDestroy');
				}, confDelay);
				feedback.type = '';
				feedback.msgFeedBack = '';
		 }
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Pinta los elementos selecionables, porque tiene los ids almacenados y mete la clase que se le indica.
 *
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered
 *
 * @name drawSelectId
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param  {DataTable.api} ctx
 * 
 */
function _drawSelectId(api,ctx){
	var DataTable = $.fn.dataTable;
	var pos = -1;
	
	$.each(ctx.multiselection.selectedIds, function( index, value ) {
		var idx = -1;
		$.each(api.context[0].json.rows, function( indexData, valueData ) {
			if(value === DataTable.Api().rupTable.getIdPk(valueData)){
				idx = indexData;
				return false;
			}
		});
		if(idx >= 0){
			api.context[0].aoData[ idx ]._multiSelect_selected = true;
			$( api.context[0].aoData[ idx ].nTr ).addClass( api.context[0]._multiSelect.className );
			$( api.context[0].aoData[ idx ].nTr ).triggerHandler('tableHighlightRowAsSelected');
			if(ctx.multiselection.lastSelectedId === value){
				pos = idx;
			}
			if(pos === -1 && ctx.multiselection.lastSelectedId === ''){//En caso de que no hay ninguna coincidencia se pone el ultimo.
				pos = idx;
			}
		}
	});
	if(pos >= 0){
		DataTable.Api().rupTable.selectPencil(api.context[0],pos);
	}
}

/**
 * Pinta la cabecera y pie del datatable con el checkbox all.
 *
 * @name paintCheckboxexSelect
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param  {DataTable.ctx} ctx Settings object to operate on
 *
 */
function _paintCheckboxSelect(ctx){
	var columnDefs = ctx.oInit.aoColumnDefs;
	if(columnDefs !== undefined && columnDefs[0].className !== undefined && columnDefs[0].className === 'select-checkbox'){
		//Se rellena todo, la columna select.

		var divHead =  $("<div/>").attr('id','divSelectTableHead'+ctx.sTableId).addClass("divSelectTableHead");

		var input =  $("<input/>")
									.attr('id','inputSelectTableHead'+ctx.sTableId)
									.attr('type','checkbox')
									.addClass("hiddenInput");

		var label = $("<label/>")
									.attr('id', 'labelSelectTableHead'+ctx.sTableId)
									.attr('for','inputSelectTableHead'+ctx.sTableId)
									.addClass("selectTableHead");

		var link = $("<a/>")
							 	 .addClass("ui-icon rup-datatable_checkmenu_arrow")
								 .attr('id','linkSelectTableHead'+ctx.sTableId);

		input.click(function () {
			var dt = new DataTable.Api( ctx );
			if(input.is(':checked')) {
				label.addClass("selectTableHeadCheck");
				link.addClass("rup-datatable_checkmenu_arrow_margin");
				selectAllPage(dt);
      } else {
				label.removeClass("selectTableHeadCheck");
				link.removeClass("rup-datatable_checkmenu_arrow_margin");
      	deselectAllPage(dt);
      }
	    });

		link.click(function () {
			var dt = new DataTable.Api( ctx );
			//Marcar todos
			if(ctx.multiselection.selectedAll && ctx.multiselection.deselectedIds.length  === 0){
				$("#contextMenu1 li.context-menu-icon-check").addClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-check_all").addClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-uncheck").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-uncheck_all").removeClass('disabledDatatable');
				// Marcamos el check del tHead
				$("#labelSelectTableHead" + ctx.sTableId).addClass('selectTableHeadCheck');
				$("#linkSelectTableHead" + ctx.sTableId).addClass('rup-datatable_checkmenu_arrow_margin');
			};
			//Desmarcar todos
			if(!ctx.multiselection.selectedAll && ctx.multiselection.selectedIds.length  === 0){
				$("#contextMenu1 li.context-menu-icon-check").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-check_all").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-uncheck").addClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-uncheck_all").addClass('disabledDatatable');
				// Desmarcamos el check del tHead
				$("#labelSelectTableHead" + ctx.sTableId).removeClass('selectTableHeadCheck');
				$("#linkSelectTableHead" + ctx.sTableId).removeClass('rup-datatable_checkmenu_arrow_margin');
			};
			if(ctx.multiselection.selectedIds.length  > 0){
				$("#contextMenu1 li.context-menu-icon-uncheck_all").removeClass('disabledDatatable');
			}
			if(ctx.multiselection.deselectedIds.length  > 0){
				$("#contextMenu1 li.context-menu-icon-check_all").removeClass('disabledDatatable');
			}
			//Si la pagina esta completamente seleccionada
			if(checkPageSelectedAll(dt,true)){
				$("#contextMenu1 li.context-menu-icon-uncheck_all").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-uncheck").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-check").addClass('disabledDatatable');
				// Marcamos el check del tHead
				$("#labelSelectTableHead" + ctx.sTableId).addClass('selectTableHeadCheck');
				$("#linkSelectTableHead" + ctx.sTableId).addClass('rup-datatable_checkmenu_arrow_margin');
			}else{
				$("#contextMenu1 li.context-menu-icon-check_all").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-check").removeClass('disabledDatatable');
				// Desmarcamos el check del tHead
				$("#labelSelectTableHead" + ctx.sTableId).removeClass('selectTableHeadCheck');
				$("#linkSelectTableHead" + ctx.sTableId).removeClass('rup-datatable_checkmenu_arrow_margin');
			}

			//Si la pagina esta completamente deseleccionada
			if(checkPageSelectedAll(dt,false)){
				$("#contextMenu1 li.context-menu-icon-check_all").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-check").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-uncheck").addClass('disabledDatatable');
				// Desmarcamos el check del tHead
				$("#labelSelectTableHead" + ctx.sTableId).removeClass('selectTableHeadCheck');
				$("#linkSelectTableHead" + ctx.sTableId).removeClass('rup-datatable_checkmenu_arrow_margin');
			}else{
				$("#contextMenu1 li.context-menu-icon-uncheck_all").removeClass('disabledDatatable');
				$("#contextMenu1 li.context-menu-icon-uncheck").removeClass('disabledDatatable');
				// Marcamos el check del tHead
				$("#labelSelectTableHead" + ctx.sTableId).addClass('selectTableHeadCheck');
				$("#linkSelectTableHead" + ctx.sTableId).addClass('rup-datatable_checkmenu_arrow_margin');
			}

	    });

		if(ctx.oInit.headerContextMenu.show){//Se mira si se quiere mostrar el menuContex
			_createContexMenuSelect($('#'+link[0].id),ctx)
			divHead.append(input, label, link);
		}

		if(ctx.nTable.tHead !== null){
			var th = $(ctx.nTable.tHead.rows[0].cells[0])
			th.append(divHead);
		}

		//Se aseguro que no sea orderable
		columnDefs[0].orderable = false;

		//Se genera el div para el feedback del datatable.
		var divFeedback = $('<div/>').attr('id', 'rup_feedback_' + ctx.sTableId).insertBefore('#' + ctx.sTableId).css('width','100%');
		ctx.multiselection.internalFeedback = divFeedback;
	}
}

/**
* Metodo que comprueba que todos los checks de la página están seleccionados
*
* @name checkPageSelectedAll
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Es el objeto datatable.
* @param {boolean} selected - Es true o false para saber cual de los 2 quieres buscar.
*
*/
function checkPageSelectedAll(dt,selected){
	var count = 0;

	$.each(dt.rows().nodes().flatten(), function( idx ,value) {
		if(selected && value.className.indexOf('selected') >= 0){
			count ++;
		}else if(!selected && value.className.indexOf('selected') < 0){
			count ++;
		}
	});
	if(dt.rows().nodes().flatten().length === count){
		return true;
	}

	return false;
}

/**
* Metodo que crea el contexMenu de la tabla
*
* @name createContexMenuSelect
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {string} id - Es el identificador del datatable.
* @param {object} ctx - datatable.settings.
*
*/
function _createContexMenuSelect(id,ctx){
	var items = {};
	var options = ctx.oInit;
	var dt = new DataTable.Api( ctx );

	if (options.headerContextMenu.selectAllPage) {
		jQuery.extend(items, {
			'selectAllPage': {
				name: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.plugins.multiselection.selectAllPage'),
				icon: 'check',
				disabled: function (key, opt) {
					//
				},
				callback: function (key, options) {
					selectAllPage(dt);
				}
			}
		});

	}
	if (options.headerContextMenu.deselectAllPage) {
		jQuery.extend(items, {
			'deselectAllPage': {
				name: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.plugins.multiselection.deselectAllPage'),
				icon: 'uncheck',
				disabled: function (key, opt){
					//
				},
				callback: function (key, options) {
					deselectAllPage(dt);
				}
			}
		});
	}
	if (options.separator) {
		jQuery.extend(items, {
			'separator': ''
		});
	}
	if (options.headerContextMenu.selectAll) {
		jQuery.extend(items, {
			'selectAll': {
				name: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.plugins.multiselection.selectAll'),
				icon: 'check_all',
				disabled: function (key, opt) {
					//
				},
				callback: function (key, options) {
					selectAll(dt);
				}
			}
		});
	}
	if (options.headerContextMenu.deselectAll) {
		jQuery.extend(items, {
			'deselectAll': {
				name: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.plugins.multiselection.deselectAll'),
				icon: 'uncheck_all',
				disabled: function (key, opt) {
					//
				},
				callback: function (key, options) {
					deselectAll(dt);
				}
			}
		});
	}

	id.rup_contextMenu({
		trigger: 'left',
		items: items,
		position: function (contextMenu, x, y) {
			contextMenu.$menu.css({
				top: this.parent().offset().top + this.parent().height(),
				left: this.parent().parent().offset().left
			});
		}
	});
}

/**
* Metodo que selecciona todos los elementos de una misma página.
*
* @name selectAllPage
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Datatable.
*
*/
function selectAllPage(dt){
	var ctx = dt.settings()[0];
	ctx.multiselection.accion = "checkAll";
	dt['rows']().multiSelect();
	
	$("#contextMenu1 li.context-menu-icon-check").addClass('disabledDatatable');
	// Marcamos el check del tHead
	$("#labelSelectTableHead" + ctx.sTableId).addClass('selectTableHeadCheck');
	$("#linkSelectTableHead" + ctx.sTableId).addClass('rup-datatable_checkmenu_arrow_margin');

	//FeedBack
	var countPage = dt.page()+1;
	var selectMsg = jQuery.rup.i18nTemplate(jQuery.rup.i18n.base, 'rup_datatable.selectMsg', '<b>' + dt.rows()[0].length + '</b>', '<b>' + countPage + '</b>');
	var selectRestMsg = jQuery.rup.i18nTemplate(jQuery.rup.i18n.base, 'rup_datatable.selectRestMsg', ctx.json.recordsTotal);
	var remainingSelectButton = jQuery.rup.i18nTemplate(jQuery.rup.i18n.base, 'rup_datatable.templates.multiselection.selectRemainingRecords', dt.context[0].sTableId, selectRestMsg, jQuery.rup.i18nParse(jQuery.rup.i18n.base, 'selectAll'));
	if(!ctx.multiselection.selectedAll ||
			(ctx.multiselection.selectedAll && ctx.multiselection.deselectedIds.length  > 0)){
		ctx.multiselection.internalFeedback.rup_feedback({message:selectMsg+remainingSelectButton,type:"alert"});
		ctx.multiselection.internalFeedback.type = 'fijo';
		$('#' + ctx.sTableId).triggerHandler('tableMultiSelectFeedbackSelectAll');
	}
	$('#'+$(remainingSelectButton)[0].id).on('click', function (event) {
		selectAll(dt);
	});
	
	$('#'+ctx.multiselection.internalFeedback[0].id+'_closeDiv').on('click', function (event) {
		ctx.multiselection.internalFeedback.rup_feedback('destroy');
		ctx.multiselection.internalFeedback.css('width','100%');
		$('#' + ctx.sTableId).triggerHandler('tableMultiSelectFeedbackDestroy');
	});

	//Se deja marcado el primero de la pagina.
	ctx.multiselection.lastSelectedId = dt.data()[0].id;
	DataTable.Api().rupTable.selectPencil(ctx,0);
}

/**
* Metodo que deselecciona todos los elementos de una misma página.
*
* @name deselectAllPage
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} dt - Datatable.
*
*/
function deselectAllPage(dt){
	var ctx = dt.settings()[0];
	ctx.multiselection.accion = "uncheck";
	dt['rows']().deselect();
	
	$("#contextMenu1 li.context-menu-icon-uncheck").addClass('disabledDatatable');
	// Desmarcamos el check del tHead
	$("#labelSelectTableHead" + ctx.sTableId).removeClass('selectTableHeadCheck');
	$("#linkSelectTableHead" + ctx.sTableId).removeClass('rup-datatable_checkmenu_arrow_margin');

	//FeedBack
	var countPage = dt.page()+1;
	var deselectMsg = jQuery.rup.i18nTemplate(jQuery.rup.i18n.base, 'rup_datatable.deselectMsg', '<b>' + dt.rows()[0].length + '</b>', '<b>' + countPage + '</b>');
	var selectRestMsg = jQuery.rup.i18nTemplate(jQuery.rup.i18n.base, 'rup_datatable.deselectRestMsg', ctx.multiselection.numSelected);
	var remainingDeselectButton = jQuery.rup.i18nTemplate(jQuery.rup.i18n.base, 'rup_datatable.templates.multiselection.deselectRemainingRecords', dt.context[0].sTableId, selectRestMsg, jQuery.rup.i18nParse(jQuery.rup.i18n.base, 'deSelectAll'));
	if(ctx.multiselection.numSelected  > 0){
		ctx.multiselection.internalFeedback.rup_feedback({message:deselectMsg+remainingDeselectButton,type:"alert"});
		ctx.multiselection.internalFeedback.type = 'fijo';
		$('#' + ctx.sTableId).triggerHandler('tableMultiSelectFeedbackDeselectAll');
	}
	$('#'+$(remainingDeselectButton)[0].id).on('click', function (event) {
		deselectAll(dt);
	});
	$('#'+ctx.sTableId+' tbody tr td.select-checkbox span.ui-icon-pencil').remove();

}

/**
* Metodo que selecciona todos los elementos.
*
* @name selectAll
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Datatable.
*
*/
function selectAll(dt){
	var ctx = dt.settings()[0];
	ctx.multiselection.selectedAll = true;
	ctx.multiselection.deselectedIds = [];
	ctx.multiselection.deselectedRowsPerPage = [];
	ctx.multiselection.numSelected = ctx.json.recordsTotal;
	ctx.multiselection.accion = "checkAll";
	$("#contextMenu1 li.context-menu-icon-check_all").addClass('disabledDatatable');
	$("#contextMenu1 li.context-menu-icon-check").addClass('disabledDatatable');
	// Marcamos el check del tHead
	$("#labelSelectTableHead" + ctx.sTableId).addClass('selectTableHeadCheck');
	$("#linkSelectTableHead" + ctx.sTableId).addClass('rup-datatable_checkmenu_arrow_margin');

	dt['rows']().multiSelect();
	if(dt.page() === 0){
		DataTable.Api().rupTable.selectPencil(ctx,0);
		ctx.multiselection.lastSelectedId = DataTable.Api().rupTable.getIdPk(dt.data()[0]);
	}else{
		DataTable.Api().rupTable.selectPencil(ctx,-1);
		ctx.multiselection.lastSelectedId = '';
	}
	
	$('#'+ctx.sTableId).triggerHandler('tableMultiSelectSelectAll');
}


/**
* Metodo que deselecciona todos los elementos.
*
* @name deselectAll
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt - Datatable.
*
*/
function deselectAll(dt){
	var ctx = dt.settings()[0];
	$self._initializeMultiselectionProps(ctx);

	ctx.multiselection.accion = "uncheckAll";
	$('#'+ctx.sTableId+' tbody tr td.select-checkbox span.ui-icon-pencil').remove();
	dt['rows']().deselect();

}


/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @name rowColumnRange
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * 
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @name clear
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 * 
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * 
 */
function clear( ctx, force )
{
	if ( force || ctx._multiSelect.style === 'single' ) {
		var api = new DataTable.Api( ctx );

		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @name typeSelect
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * 
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.multiSelect.style();
	var isSelected = dt[type]( idx, { selected: true } ).any();

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).multiSelect( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._multiSelect_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._multiSelect_lastCell ?
					ctx._multiSelect_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._multiSelect_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._multiSelect_lastCell ?
					ctx._multiSelect_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).multiSelect( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).multiSelect( ! isSelected );
	}
}

/**
* Metodo que inicialida las propiedades para el multiselect.
*
* @name initializeMultiselectionProps
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
*
*/
function _initializeMultiselectionProps ( ctx ) {
	var $self = {};
	// Se almacenan en los settings internos las estructuras de control de los registros seleccionados
	if ($self.multiselection === undefined) {
		$self.multiselection = {};
	}
	if(ctx.multiselection !== undefined){
		$self.multiselection.internalFeedback = ctx.multiselection.internalFeedback;
	}
	// Flag indicador de selección de todos los registros
	$self.multiselection.selectedAll = false;
	// Numero de registros seleccionados
	$self.multiselection.numSelected = 0;
	// Propiedades de selección de registros
	$self.multiselection.selectedRowsPerPage = [];
	//$self.multiselection.selectedLinesPerPage = [];
	//$self.multiselection.selectedRows = [];
	$self.multiselection.selectedIds = [];
	$self.multiselection.lastSelectedId = "";
	//$self.multiselection.selectedPages = [];
	// Propiedades de deselección de registros
	$self.multiselection.deselectedRowsPerPage = [];
	//$self.multiselection.deselectedLinesPerPage = [];
	//$self.multiselection.deselectedRows = [];
	$self.multiselection.deselectedIds = [];
	$self.multiselection.accion = "";//uncheckAll,uncheck
	//$self.multiselection.deselectedPages = [];
	$("#contextMenu1 li.context-menu-icon-uncheck").addClass('disabledDatatable');
	$("#contextMenu1 li.context-menu-icon-uncheck_all").addClass('disabledDatatable');
	// Desmarcamos el check del tHead
	$("#labelSelectTableHead" + ctx.sTableId).removeClass('selectTableHeadCheck');
	$("#linkSelectTableHead" + ctx.sTableId).removeClass('rup-datatable_checkmenu_arrow_margin');

	DataTable.Api().rupTable.selectPencil(ctx,-1);
	return $self.multiselection;
} ;

/**
* Metodo que añade y quita los seleccionados.
*
* @name maintIdsRows
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param  {DataTables.Api}     DataTable   DataTable
* @param  {string}     id   - id seleccionado
* @param  {boolean}    select   si es seleccionado o no
* @param  {integer}    pagina   página en la que se encuentra el seleccionado
* @param  {integer}    line   linea en la que se encuentra el seleccionado
*
*/
//1 select, 0 deselect
function maintIdsRows(DataTable,id,select,pagina,line,ctx){
	var indexInArray = -1;
	
	if(select){// se elimina de los deselecionados
		indexInArray = jQuery.inArray(id, ctx.multiselection.deselectedIds)
		if(indexInArray > -1 && !pagina){//Si se encuentra y además no se está paginando.
			ctx.multiselection.deselectedIds.splice(indexInArray,1);
			ctx.multiselection.deselectedRowsPerPage.splice(indexInArray,1);
			if(ctx.multiselection.numSelected === ctx.json.recordsTotal){
				ctx.multiselection.selectedAll = true;
			}
		}
		if(id !== undefined && ctx.multiselection.selectedIds.indexOf(id) < 0){
			var pos = 0;
			var arra = {id:id,page:ctx.json.page,line:line};
			//ctx.multiselection.selectedIds.splice(pos,0,id);
			//ctx.multiselection.selectedRowsPerPage.splice(pos,0,{id:id,page:ctx.json.page,line:line});

			//Inicio de ordenacion, Se ordena los selected ids.

			$.each(ctx.multiselection.selectedRowsPerPage,function(index,p) {
			  if(arra.page < p.page){
				  pos = index;
				  return false;
			  }else if(arra.page === p.page){
			  // mirar linea
			  	if(arra.line < p.line){
			  		pos = index;
			  		return false;
			    }else{
			   	 pos = index+1;//Posible
			    }
			  }else if(arra.page > p.page){
				  pos = index+1;//Posible
			  }
			});

			ctx.multiselection.selectedIds.splice(pos,0,id);
			ctx.multiselection.selectedRowsPerPage.splice(pos,0,arra);


			//FIn ordenacion
		}
	}else{//Deselect
		indexInArray = jQuery.inArray(id, ctx.multiselection.selectedIds);//Se elimina el ids

		if(indexInArray > -1){//se borra
			ctx.multiselection.selectedIds.splice(indexInArray,1);
			ctx.multiselection.selectedRowsPerPage.splice(indexInArray,1);
			if(ctx.multiselection.lastSelectedId === id){
				ctx.multiselection.lastSelectedId = "";
			}
			DataTable.Api().rupTable.selectPencil(ctx,-1);
			if(ctx.multiselection.numSelected === 0){
				ctx.multiselection.selectedAll = false
			}
		}
		//Se mete el id para mantener el selectAll o no.
		if(id !== undefined && ctx.multiselection.deselectedIds.indexOf(id) < 0){
			if(line === undefined){
				$.each(ctx.json.rows, function( index, value ) {
 					if (DataTable.Api().rupTable.getIdPk(value) === id){
						line = index;
						return false;
					}
				});

			}
			var posDeselect = 0;
			var arraDeselect = {id:id,page:ctx.json.page,line:line};

			//Inicio de ordenacion, Se ordena los selected ids.
			$.each(ctx.multiselection.deselectedRowsPerPage,function(index,p) {
			  if(arraDeselect.page < p.page){
				  posDeselect = index;
				  return false;
			  }else if(arraDeselect.page === p.page){
			  // mirar linea
			  	if(arraDeselect.line < p.line){
			  		posDeselect = index;
			  		return false;
			    }else{
			    	posDeselect = index+1;//Posible
			    }
			  }else if(arraDeselect.page > p.page){
				  posDeselect = index+1;//Posible
			  }
			});

			ctx.multiselection.deselectedIds.splice(posDeselect,0,id);
			ctx.multiselection.deselectedRowsPerPage.splice(posDeselect,0,arraDeselect);
			if(ctx.multiselection.lastSelectedId === id){
				ctx.multiselection.lastSelectedId = '';
			}
			DataTable.Api().rupTable.selectPencil(ctx,-1);
		}
	}
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected === undefined ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._multiSelect_selected === true) ||
			     (selected === false && ! data._multiSelect_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'multiSelect()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.multiSelect.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'multiSelect.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._multiSelect.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._multiSelect.blurable = flag;
	} );
} );

apiRegister( 'multiSelect.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._multiSelect.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._multiSelect.info = flag;
	} );
} );

apiRegister( 'multiSelect.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._multiSelect.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._multiSelect.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'multiSelect.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._multiSelect.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._multiSelect.style = style;

		if ( ! ctx._multiSelect_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );

		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'multiSelect.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._multiSelect.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._multiSelect.selector = selector;

		if ( ctx._multiSelect.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );

apiRegister( 'multiSelect.deselectAll()', function ( dt ) {
	deselectAll(dt);
} );

apiRegisterPlural( 'rows().multiSelect()', 'row().multiSelect()', function ( multiSelect ) {
	var api = this;
	var DataTable = $.fn.dataTable;
	var pagina = true;
	var ctx = api.context[0];
	
	if(ctx.multiselection === undefined){
		return false;
	}
	//Al pagina comprobar el checkGeneral.

	//Se miral si hay feedback y en ese caso se elimina.
	var feedBack = ctx.multiselection.internalFeedback;
	if($('#rup_feedback_'+ctx.sTableId).children().length > 1 && feedBack.type !== undefined && feedBack.type === 'fijo'){
		ctx.multiselection.internalFeedback.rup_feedback('destroy');
		ctx.multiselection.internalFeedback.css('width','100%');
		$('#' + ctx.sTableId).triggerHandler('tableMultiSelectFeedbackDestroy');
	}

	if ( multiSelect === false ) {
		maintIdsRows(DataTable,DataTable.Api().rupTable.getIdPk(api.data()),0,pagina,0,ctx);
		//Cuando se resta de 1 en 1 la accion es empty
		ctx.multiselection.accion = '';
		var deselectes = this.deselect();
		return deselectes;

	}


	this.iterator( 'row', function ( ctx, idx ) {
		$(ctx.aoData[ idx ].nTr).triggerHandler('tableMultiSelectBeforeSelectRow');
		clear( ctx );
		pagina = false;
		ctx.aoData[ idx ]._multiSelect_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._multiSelect.className );
		var id = DataTable.Api().rupTable.getIdPk(ctx.aoData[ idx ]._aData);

		//Se mira el contador para sumar seleccionados
		if(ctx.multiselection.numSelected < ctx.json.recordsTotal &&
				id !== undefined && ctx.multiselection.selectedIds.indexOf(id) < 0){
			ctx.multiselection.numSelected++;
		}

		//para seleccionar todos los de la pagina actual.
		maintIdsRows(DataTable,id,1,pagina,idx,ctx);
		//Se marca el ultimo.
		ctx.multiselection.lastSelectedId = id;
		$(ctx.aoData[ idx ].nTr).triggerHandler('tableMultiSelectAfterSelectRow');

	} );
	if(pagina){//Cuando se pagina, se filtra, o se reordena.
		if(ctx.multiselection.selectedAll){//Si pagina y están todos sleccionados se pintan.
			var ctx = api.settings()[0];
			$.each(api.context[0].aoData, function( idx ) {
				var id = DataTable.Api().rupTable.getIdPk(ctx.aoData[ idx ]._aData);
				//Si esta en la lista de deselecionados, significa que no debería marcarse.
				if(jQuery.inArray(id, ctx.multiselection.deselectedIds) === -1){
					ctx.aoData[ idx ]._multiSelect_selected = true;
					$( ctx.aoData[ idx ].nTr ).addClass( ctx._multiSelect.className );

					//para seleccionar todos los de la pagina actual.
					maintIdsRows(DataTable,id,1,pagina,0,ctx);
				}
			});
		}
		if (ctx.oInit.buttons !== undefined) {
			//Mirar la propiedad para el contex menu y dejar la clase marcada.
			$('#' + ctx.sTableId + ' > tbody > tr').addClass('context-menu-cursor');
		}
	}
	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	//al paginar
	var input = $("#divSelectTableHead"+ctx.sTableId+" :input");
	var label = $("#divSelectTableHead"+ctx.sTableId).find("label");
	var link = $("#divSelectTableHead"+ctx.sTableId).find("a");

	if(checkPageSelectedAll(api,true)){
		input.attr('checked',true);
		label.addClass("selectTableHeadCheck");
		link.addClass("rup-datatable_checkmenu_arrow_margin");
	}else{
		input.attr('checked',false);
		label.removeClass("selectTableHeadCheck");
		link.removeClass("rup-datatable_checkmenu_arrow_margin");
	}

	return this;
} );

apiRegisterPlural( 'columns().multiSelect()', 'column().multiSelect()', function ( multiSelect ) {
	var api = this;

	if ( multiSelect === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._multiSelect_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._multiSelect.className );
		$( column.footer() ).addClass( ctx._multiSelect.className );

		column.nodes().to$().addClass( ctx._multiSelect.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'multiSelect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().multiSelect()', 'cell().multiSelect()', function ( multiSelect ) {
	var api = this;

	if ( multiSelect === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._multiSelect.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'multiSelect', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;
	var DataTable = $.fn.dataTable;
	var ctx = api.context[0];
	//Se mira si hay feedback y en ese caso se elimina.
	var feedBack = ctx.multiselection.internalFeedback;
	if($('#rup_feedback_'+ctx.sTableId).children().length > 1 && feedBack.type !== undefined && feedBack.type === 'fijo'){
		ctx.multiselection.internalFeedback.rup_feedback('destroy');
		ctx.multiselection.internalFeedback.css('width','100%');
		$('#' + ctx.sTableId).triggerHandler('tableMultiSelectFeedbackDestroy');
	}

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._multiSelect_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._multiSelect.className );
		var id = DataTable.Api().rupTable.getIdPk(ctx.aoData[ idx ]._aData);

		//Se mira el contador para restar deselecionados.
		if(ctx.multiselection.numSelected > 0 &&
				id !== undefined && ctx.multiselection.deselectedIds.indexOf(id) < 0){
			ctx.multiselection.numSelected--;
		}

		//para deseleccionar todos los de la pagina actual.
		if((ctx.multiselection.numSelected > 0 && ctx.multiselection.accion === "uncheckAll")
			|| (ctx.multiselection.numSelected >= 0 && ctx.multiselection.accion === "uncheck")){
			maintIdsRows(DataTable,id,0,false,0,ctx);
		}else if(ctx.multiselection.accion === ""){//es que se resta uno solo.
			ctx.multiselection.numSelected--;
		}

	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	//al paginar
	var input = $("#divSelectTableHead"+ctx.sTableId+" :input");
	var label = $("#divSelectTableHead"+ctx.sTableId).find("label");
	var link = $("#divSelectTableHead"+ctx.sTableId).find("a");

	if(checkPageSelectedAll(api,true)){
		input.attr('checked',true);
		label.addClass("selectTableHeadCheck");
		link.addClass("rup-datatable_checkmenu_arrow_margin");
	}else{
		input.attr('checked',false);
		label.removeClass("selectTableHeadCheck");
		link.removeClass("rup-datatable_checkmenu_arrow_margin");
	}

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._multiSelect_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._multiSelect.className );
		$( column.footer() ).removeClass( ctx._multiSelect.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._multiSelect.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._multiSelect_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._multiSelect.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

// Common events with suitable namespaces
function namespacedEvents ( config ) {
	var unique = config._eventNamespace;

	return 'draw.dt.DT'+unique+' multiSelect.dt.DT'+unique+' deselect.dt.DT'+unique;
}

var _buttonNamespace = 0;

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.multiSelect'+(_buttonNamespace++);

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( namespacedEvents(config), function () {
				var enable = that.rows( { selected: true } ).any() ||
				             that.columns( { selected: true } ).any() ||
				             that.cells( { selected: true } ).any();

				that.enable( enable );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.multiSelect'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.multiSelect.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.multiSelect'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'multiSelect'+item+'s' ] = {
		text: i18n( 'multiSelect'+item+'s', 'multiSelect '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}
	if(ctx.oInit.multiSelect !== undefined){
		DataTable.multiSelect.init( new DataTable.Api( ctx ) );
	}
} );


return DataTable.multiSelect;
}));
