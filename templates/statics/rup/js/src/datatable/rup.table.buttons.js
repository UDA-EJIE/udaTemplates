/**
  * Genera los botones del datatable
  *
  * @summary 		Extensión del componente RUP Datatable
  * @module			"rup.table.buttons"
  * @version     1.5.1
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


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

// Default ID naming counter
var _buttonIdCounter = 1;

var _dtButtons = DataTable.ext.buttons;

/**
  * Botones
  *
  * @name Buttons
  * @function
  * @since UDA 3.4.0 // Datatable 1.0.0
  *
  * @param {object} dt
  * @param {object} config
  *
  */
var Buttons = function( dt, config )
{
	var idTable = dt.context[0].sTableId;
	var ctx = dt.context[0];
	ctx.ext = DataTable.ext;
	ctx.ext.buttons = {};
	ctx.ext.buttons.copyButton = {
		text: function (dt) {
			return $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.toolbar.reports.copyButton');
		},
		id: idTable+'copyButton_1', // Campo obligatorio si se quiere usar desde el contextMenu
		className: 'buttons-copyButton',
		displayRegex: /^[1-9][0-9]*$/, // Se muestra siempre que sea un numero mayor a 0
		insideContextMenu: true, // Independientemente de este valor, sera 'false' si no tiene un id definido
		type: 'copyButton',
		init: function (dt, node, config) {
			ctx.ext.buttons.copyButton.eventDT = dt;
		},
		action: function (e, dt, button, config) {
			// Si es llamado desde el contextMenu este paso es innecesario y la condicion
			// del if evita un error
			if (this.processing !== undefined) {
				this.processing(true);
			}
			var that = this;
			$('#' + ctx.sTableId).triggerHandler('tableButtonsBeforeCopyClick');
			_reportsCopyData(dt, that, config);
			$('#' + ctx.sTableId).triggerHandler('tableButtonsAfterCopyClick');
		}
	};

	ctx.ext.buttons.addButton = {
		text: function (dt) {
			return $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.toolbar.add');
		},
		id: idTable+'addButton_1', // Campo obligatorio si se quiere usar desde el contextMenu
		className: 'datatable_toolbar_btnAdd',
		displayRegex: /^\d+$/, // Se muestra siempre que sea un numero positivo o neutro
		insideContextMenu: true, // Independientemente de este valor, sera 'false' si no tiene un id definido
		type: 'add',
		init: function (dt, node, config) {
			ctx.ext.buttons.addButton.eventDT = dt;
		},
		action: function (e, dt, node, config) {
			$('#' + ctx.sTableId).triggerHandler('tableButtonsBeforeAddClick');
			DataTable.Api().buttons.actions(dt, config);
			$('#' + ctx.sTableId).triggerHandler('tableButtonsAfterAddClick');
		}
	};

	ctx.ext.buttons.editButton = {
		text: function (dt) {
			return $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.toolbar.edit');
		},
		id: idTable+'editButton_1', // Campo obligatorio si se quiere usar desde el contextMenu
		className: 'datatable_toolbar_btnEdit',
		displayRegex: /^[1-9][0-9]*$/, // Se muestra siempre que sea un numero mayor a 0
		insideContextMenu: true, // Independientemente de este valor, sera 'false' si no tiene un id definido
		type: 'edit',
		init: function (dt, node, config) {
			ctx.ext.buttons.editButton.eventDT = dt;
		},
		action: function (e, dt, node, config) {
			$('#' + ctx.sTableId).triggerHandler('tableButtonsBeforeEditClick');
			DataTable.Api().buttons.actions(dt, config);
			$('#' + ctx.sTableId).triggerHandler('tableButtonsAfterEditClick');
		}
	};

	ctx.ext.buttons.cloneButton = {
		text: function (dt) {
			return $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.toolbar.clone');
		},
		id: idTable+'cloneButton_1', // Campo obligatorio si se quiere usar desde el contextMenu
		className: 'datatable_toolbar_btnClone',
		displayRegex: /^1$/, // Se muestra solo cuando sea igual a 1
		insideContextMenu: true, // Independientemente de este valor, sera 'false' si no tiene un id definido
		type: 'clone',
		init: function (dt, node, config) {
			ctx.ext.buttons.cloneButton.eventDT = dt;
		},
		action: function (e, dt, node, config) {
			$('#' + ctx.sTableId).triggerHandler('tableButtonsBeforeCloneClick');
			DataTable.Api().buttons.actions(dt, config);
			$('#' + ctx.sTableId).triggerHandler('tableButtonsAfterCloneClick');
		}
	};

	ctx.ext.buttons.deleteButton = {
		text: function (dt) {
			return $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.toolbar.delete');
		},
		id: idTable+'deleteButton_1', // Campo obligatorio si se quiere usar desde el contextMenu
		className: 'datatable_toolbar_btnDelete',
		displayRegex: /^[1-9][0-9]*$/, // Se muestra siempre que sea un numero mayor a 0
		insideContextMenu: true, // Independientemente de este valor, sera 'false' si no tiene un id definido
		type: 'delete',
		init: function (dt, node, config) {
			ctx.ext.buttons.deleteButton.eventDT = dt;
		},
		action: function (e, dt, node, config) {
			$('#' + ctx.sTableId).triggerHandler('tableButtonsBeforeDeleteClick');
			DataTable.Api().buttons.actions(dt, config);
			$('#' + ctx.sTableId).triggerHandler('tableButtonsAfterDeleteClick');
		}
	};

	ctx.ext.buttons.reportsButton = {
		extend: 'collection',
		text: function (dt) {
			return $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.toolbar.reports.main');
		},
		id: idTable+'informes_01',
		className: 'align-right',
		displayRegex: /^[1-9][0-9]*$/, // Se muestra siempre que sea un numero mayor a 0
		autoClose: true,
		type: 'reports',
		buttons: [
			'copyButton'
		]
	};
	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};
	}

	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( $.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

 /**
	 * Get the action of a button
	 *
	 * @name action
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {int|string} Button index
	 * @return {function}
	 *
	 */
 /**
	 * Set the action of a button
	 *
	 * @name action
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 *
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 *
	 * @name active
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 *
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 *
	 * @name add
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 *
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, false, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 *
	 * @name container
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @return {jQuery} Buttons node
	 *
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 *
	 * @name disable
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 *
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node).addClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 *
	 * @name destroy
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @return {Buttons} Self for chaining
	 *
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 *
	 * @name enable
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 *
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node).removeClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 *
	 * @name name
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @return {string} Instance name
	 *
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node
	 *
	 * @name node
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} node Button node
	 * @return {jQuery} Button element
	 *
	 */
	node: function ( node )
	{
		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 *
	 * @name processing
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 *
	 */
	processing: function ( node, flag )
	{
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		return this;
	},

	/**
	 * Remove a button.
	 *
	 * @name remove
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 *
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 *
	 * @name text
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *
	 */
 /**
	 * Set the text for a button
	 *
	 * @name text
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 *
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 *
	 * @name _constructor
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function () {
			that.destroy();
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 *
	 * @name _addKey
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param {object} conf Resolved button configuration object
	 *
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 *
	 * @name _draw
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 *
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 *
	 * @name _expandButton
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 *
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! $.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( $.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				built.collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className )
					.attr( 'role', 'menu') ;
				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 *
	 * @name _buildButton
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 *
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var ctx = dt.settings()[0];
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config
			] );
		};

		var button = $('<'+buttonDom.tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}

				button.blur();
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( buttonDom.tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.id ) {
			button.attr( 'id', config.id );
		} else {
			// Se desactiva el acceso desde el contextMenu por no tener un id establecido
			config.insideContextMenu = false;
			// Se asigna un id dinamico en funcion del nombre del datatable al que pertenece
			config.id = ctx.sTableId + '_button_' + (_buttonIdCounter++);
			button.attr( 'id', config.id );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', text( config.titleAttr ) );
		}

		if ( config.attr ) {
			button.attr( config.attr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		if ( !config.icon ) {
			// Comprueba si es alguno de los botones con iconos definidos por defecto
			switch (config.type) {
				case 'add':
					config.icon = "fa-plus";
					break;
				case 'edit':
					config.icon = "fa-pencil-square-o";
					break;
				case 'clone':
					config.icon = "fa-clone";
					break;
				case 'delete':
					config.icon = "fa-trash-o";
					break;
				case 'reports':
					config.icon = "fa-file-o";
					break;
				case 'copyButton':
					config.icon = "fa-clipboard";
					break;
				default:
					config.icon = "fa-cog";
			}
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 *
	 * @name _nodeToButton
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 *
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 *
	 * @name _nodeToHost
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 *
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 *
	 * @name _keypress
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 *
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 *
	 * @name _removeKey
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {object} conf Button configuration
	 *
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 *
	 * @name _resolveExtends
   * @function
   * @since UDA 3.4.0 // Datatable 1.0.0
	 *
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 *
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var ctx = dt.context[0];
		var _dtButtonsTable = ctx.ext.buttons;
		_dtButtonsTable.collection = _dtButtons.collection;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! $.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtonsTable[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtonsTable[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return $.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtonsTable[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtonsTable[ conf.extend ] );
			if ( $.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 *
 * @name Buttons.background
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden
 * @param  {string} Class to assign to the background
 *
 * @static
 *
 */
Buttons.background = function ( show, className, fade ) {
	if ( fade === undefined ) {
		fade = 400;
	}

	if ( show ) {
		$('<div/>')
			.addClass( className )
			.css( 'display', 'none' )
			.appendTo( 'body' )
			.fadeIn( fade );
	}
	else {
		$('body > div.'+className)
			.fadeOut( fade, function () {
				$(this)
					.removeClass( className )
					.remove();
			} );
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 *
 * @name Buttons.instanceSelector
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 *
 * @static
 *
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( ! group ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( $.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( $.trim(input), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};

	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 *
 * @name Buttons.buttonSelector
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 *
 * @static
 *
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( $.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( $.trim(a[i]), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site. Contiene los botones expuestos en el toolbar.
 *
 * @name Buttons.defaults
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @type {Object}
 *
 * @static
 *
 */
Buttons.defaults = {
	buttons: [ 'addButton', 'editButton', 'cloneButton', 'deleteButton', 'reportsButton' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection'
		},
		button: {
			tag: 'button',
			className: 'btn btn-primary',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 *
 * @name Buttons.version
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @type {string}
 *
 * @static
 *
 */
Buttons.version = '1.5.1';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return $.rup.i18nParse($.rup.i18n.base, 'rup.datatable.collection');
		},
		className: 'buttons-collection',
		action: function ( e, dt, button, config ) {
			var host = button;
			var collectionParent = $(button).parents('div.dt-button-collection');
			var hostPosition = host.position();
			var tableContainer = $( dt.table().container() );
			var multiLevel = false;
			var insertPoint = host;

			// Remove any old collection
			if ( collectionParent.length ) {
				multiLevel = $('.dt-button-collection').position();
				insertPoint = collectionParent;
				$('body').trigger( 'click.dtb-collection' );
			}

			config._collection
				.addClass( config.collectionLayout )
				.css( 'display', 'none' )
				.insertAfter( insertPoint )
				.fadeIn( config.fade );


			var position = config._collection.css( 'position' );

			if ( multiLevel && position === 'absolute' ) {
				config._collection.css( {
					top: multiLevel.top,
					left: multiLevel.left
				} );
			}
			else if ( position === 'absolute' ) {
				config._collection.css( {
					top: hostPosition.top + host.outerHeight(),
					left: hostPosition.left
				} );

				// calculate overflow when positioned beneath
				var tableBottom = tableContainer.offset().top + tableContainer.height();
				var listBottom = hostPosition.top + host.outerHeight() + config._collection.outerHeight();
				var bottomOverflow = listBottom - tableBottom;

				// calculate overflow when positioned above
				var listTop = hostPosition.top - config._collection.outerHeight();
				var tableTop = tableContainer.offset().top;
				var topOverflow = tableTop - listTop;

				// if bottom overflow is larger, move to the top because it fits better
				if (bottomOverflow > topOverflow) {
					config._collection.css( 'top', hostPosition.top - config._collection.outerHeight() - 5);
				}

				var listRight = hostPosition.left + config._collection.outerWidth();
				var tableRight = tableContainer.offset().left + tableContainer.width();
				if ( listRight > tableRight ) {
					config._collection.css( 'left', hostPosition.left - ( listRight - tableRight ) );
				}
			}
			else {
				// Fix position - centre on screen
				var top = config._collection.height() / 2;
				if ( top > $(window).height() / 2 ) {
					top = $(window).height() / 2;
				}

				config._collection.css( 'marginTop', top*-1 );
			}

			if ( config.background ) {
				Buttons.background( true, config.backgroundClassName, config.fade );
			}

			// Need to break the 'thread' for the collection button being
			// activated by a click - it would also trigger this event
			setTimeout( function () {
				// This is bonkers, but if we don't have a click listener on the
				// background element, iOS Safari will ignore the body click
				// listener below. An empty function here is all that is
				// required to make it work...
				$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

				$('body').on( 'click.dtb-collection', function (e) {
					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';

					if ( ! $(e.target).parents()[back]().filter( config._collection ).length ) {
						config._collection
							.fadeOut( config.fade, function () {
								config._collection.detach();
							} );

						$('div.dt-button-background').off( 'click.dtb-collection' );
						Buttons.background( false, config.backgroundClassName, config.fade );

						$('body').off( 'click.dtb-collection' );
						dt.off( 'buttons-action.b-internal' );
					}
				} );
			}, 10 );

			if ( config.autoClose ) {
				dt.on( 'buttons-action.b-internal', function () {
					$('div.dt-button-background').click();
				} );
			}
		},
		background: true,
		collectionLayout: '',
		backgroundClassName: 'dt-button-background',
		autoClose: false,
		fade: 400,
		attr: {
			'aria-haspopup': true
		}
	},
	addButton: function ( dt, conf ) {
		var ctx = dt.context[0];
		var collection =  _dtButtons['collection'];
		_dtButtons = ctx.ext.buttons;
		_dtButtons.collection = collection;
		if ( _dtButtons.addButton ) {
			return 'addButton';
		}
	},
	editButton: function ( dt, conf ) {
		if ( _dtButtons.editButton ) {
			return 'editButton';
		}
	},
	cloneButton: function ( dt, conf ) {
		if ( _dtButtons.cloneButton ) {
			return 'cloneButton';
		}
	},
	deleteButton: function ( dt, conf ) {
		if ( _dtButtons.deleteButton ) {
			return 'deleteButton';
		}
	},
	reportsButton: function ( dt, conf ) {
		if ( _dtButtons.reportsButton  ) {
			return 'reportsButton';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = $.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = $.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'rup_datatable.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( text( dt ) );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Get the container elements
DataTable.Api.registerPlural( 'buttons().containers()', 'buttons().container()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		$('#datatables_buttons_info').fadeOut( function () {
			$(this).remove();
		} );
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	$('<div id="datatables_buttons_info" class="dt-button-info"/>')
		.html( title )
		.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
		.css( 'display', 'none' )
		.appendTo( 'body' )
		.fadeIn();

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );

// Gestiona las acciones de los botones
DataTable.Api.register( 'buttons.actions()', function ( dt, config ) {
	var ctx = dt.settings()[0];
	// Añade aquí las funciones de tus botones
	switch (config.type) {
		case 'add':
			var idTableDetail = ctx.oInit.formEdit.detailForm;
			// Limpiamos el formulario
			$(idTableDetail).find('form')[0].reset();
			if(ctx.multiselection.numSelected > 0){
				$.rup_messages('msgConfirm', {
					message: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.checkSelectedElems'),
					title: $.rup.i18nParse($.rup.i18n.base, 'rup_datatable.changes'),
					OKFunction: function () {
						// Abrimos el formulario
						if(ctx.oInit.seeker !== undefined){
							DataTable.Api().seeker.limpiarSeeker(dt, ctx);// Y deselecionamos los checks y seekers
						}else{
							if(ctx.oInit.multiSelect !== undefined){
								DataTable.Api().multiSelect.deselectAll(dt);// Y deselecionamos los checks y seekers
							}else if(ctx.oInit.select !== undefined){
								DataTable.Api().select.deselect(ctx);// Y deselecionamos los checks y seekers
						}
						}
						DataTable.Api().editForm.openSaveDialog('POST', dt, null);
					}
				});
			}else{
				DataTable.Api().editForm.openSaveDialog('POST', dt, null);
			}
			break;
		case 'edit':
			// Abrimos el formulario
			//Se busca el idRow con el ultimó seleccionado en caso de no existir será el primero.
			var idRow = DataTable.Api().editForm.getRowSelected(dt,'PUT').line;
			DataTable.Api().editForm.openSaveDialog('PUT', dt, idRow);
			break;
		case 'clone':
			// Abrimos el formulario
			var idRow = DataTable.Api().editForm.getRowSelected(dt,'CLONE').line;
			DataTable.Api().editForm.openSaveDialog('CLONE', dt, idRow);
			break;
		case 'delete':
			// borramos todos los seleccionados.
			DataTable.Api().editForm.deleteAllSelects(dt);
			break;
	}
} );

// Detecta el numero de filas seleccionadas y en funcion a eso muestra u oculta
// los botones
DataTable.Api.register( 'buttons.displayRegex()', function (ctx) {
	var opts = ctx._buttons[0].inst.s.buttons;
	var numOfSelectedRows = ctx.multiselection.numSelected;
	var collectionObject;
	$.each(opts, function (i) {
		collectionObject = null;
		_manageButtonsAndButtonsContextMenu(opts[i], numOfSelectedRows, collectionObject,ctx);
		// Comprueba si tiene botones hijos
		if (this.buttons.length > 0) {
			collectionObject = this;
			_manageButtonsAndButtonsContextMenu(opts[i], numOfSelectedRows, collectionObject,ctx);
		}
	});
} );



/**
 * Get the file name for an exported file.
 *
 * @name _filename
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 *
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = $.trim( filename.replace( '*', $('head > title').text() ) );
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @name _stringOrFunction
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {undefined|string|function} option Option
 *
 * @return {null|string} Resolved value
 *
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @name _title
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {object} config	Button configuration
 *
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};







var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		}
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		// Always remove script tags
		str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

		if ( config.stripHtml ) {
			str = str.replace( /<[^>]*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;

	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [ rows ];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	return {
		header: header,
		footer: footer,
		body:   body
	};
};

/**
 * Activa la coleccion
 *
 * @name _enableCollection
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {string} id	Id of the button
 *
 */
var _enableCollection = function ( id )
{
	$('#' + id).removeClass('disabledDatatable');
};

/**
 * Desactiva la coleccion
 *
 * @name _disableCollection
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {string} id	Id of the button
 *
 */
var _disableCollection = function ( id )
{
	$('#' + id).addClass('disabledDatatable');
};

/**
 * Activa el boton y su opcion dentro del context menu
 *
 * @name _enableButtonAndContextMenuOption
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {string} id	Id of the button
 *
 */
var _enableButtonAndContextMenuOption = function ( id )
{
	$('#' + id + ', #' + id + '_contextMenuToolbar').removeClass('disabledDatatable');
};

/**
 * Desactiva el boton y su opcion dentro del context menu
 *
 * @name _disableButtonAndContextMenuOption
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {string} id	Id of the button
 *
 */
var _disableButtonAndContextMenuOption = function ( id )
{
	$('#' + id + '_contextMenuToolbar, #' + id).addClass('disabledDatatable');
};

/**
 * Gestiona la propiedad de activado/desactivado de los botones y de sus opciones
 * dentro del context menu.
 *
 * @name _manageButtonsAndButtonsContextMenu
 * @function
 * @since UDA 3.4.0 // Datatable 1.0.0
 *
 * @param {object} opts	Buttons properties
 * @param {int} numOfSelectedRows	Number of selected rows
 * @param {null|object} collectionObject	Collection button properties
 *
 */
var _manageButtonsAndButtonsContextMenu = function ( opts, numOfSelectedRows, collectionObject,ctx )
{
	// Si pertenece a un collection o es un collection
	if (opts.collection !== null && collectionObject) {
		var collectionId = collectionObject.conf.id;
		var collectionDisplayRegex = collectionObject.conf.displayRegex;
		var alreadyExecuted = false;
		// Recorre todos los botones dentro del collection
		$.each(collectionObject.buttons, function(key, value) {
			// Activa/desactiva en funcion de la propiedad 'displayRegex' del padre y los hijos
			if (collectionDisplayRegex !== undefined && value.conf.displayRegex !== undefined) {
				if (collectionDisplayRegex.test(numOfSelectedRows) && value.conf.displayRegex.test(numOfSelectedRows)) {
					_enableButtonAndContextMenuOption(value.conf.id);
				}
				else {
					_disableButtonAndContextMenuOption(value.conf.id);
				}
			}
			// Activa/desactiva en funcion de la propiedad 'displayRegex' de sus hijos
			else if (collectionDisplayRegex === undefined && value.conf.displayRegex !== undefined) {
				// Habilita la coleccion si cumple el regex (solo se ejecuta una vez como
				// maximo gracias al booleano 'alreadyExecuted')
				if (value.conf.displayRegex.test(numOfSelectedRows) && !alreadyExecuted) {
					_enableCollection(collectionId);
					alreadyExecuted = true;
				}
				// Habilita el boton si cumple el displayRegex
				if (value.conf.displayRegex.test(numOfSelectedRows)) {
					_enableButtonAndContextMenuOption(value.conf.id);
				}
				// Como este boton no cumple el 'displayRegex' para ser habilitado, se deshabilitan
				// tanto el boton como su opcion en el contextMenu
				else {
					_disableButtonAndContextMenuOption(value.conf.id);
				}
				// En caso de que ningun regex cumpliese, se fuerza la deshabilitacion
				if (!alreadyExecuted) {
					_disableCollection(collectionId);
				}
			}
			// Desactiva todo si ni el collection ni los hijos tienen la propiedad 'displayRegex'
			// o simplemente si los hijos no tienen la propiedad
			else {
				_disableButtonAndContextMenuOption(value.conf.id);
				if (!alreadyExecuted) {
					_disableCollection(collectionId);
					alreadyExecuted = true;
				}
			}
		});
		// Genera un evento encargado de ocultar los botones dentro del collection.
		// Se comprueba mediante una clase si ya tiene o no el evento, mejorando asi
		// el rendimiento
		$('#' + collectionId + ':not(.listening)').addClass('listening').on('click', function ( e ) {
			// Se establece el valor de 'numOfSelectedRows' porque sino siempre tendria
			// el valor recibido cuando se creo el evento
			var numOfSelectedRows = ctx.multiselection.numSelected;
			$.each(collectionObject.buttons, function(key, value) {
				// Habilita el boton dentro del collection
				if (value.conf.displayRegex.test(numOfSelectedRows)) {
					_enableButtonAndContextMenuOption(value.conf.id);
				}
				// Deshabilita el boton dentro del collection
				else {
					_disableButtonAndContextMenuOption(value.conf.id);
				}
			});
		} );
	}
	// Si el boton no tiene un regex definido, permanecera siempre desactivado
	else if (opts.conf.displayRegex === undefined) {
		// Deshabilita el boton y su opcion dentro del context menu
		_disableButtonAndContextMenuOption(opts.conf.id);
	}
	// Si tiene un regex definido, lo activa y desactiva en funcion de este
	else if (opts.conf.displayRegex !== undefined) {
		// Si el regex recibido de cada boton cumple la sentencia al probarlo contra
		// el numero de filas seleccionadas, se mostrara, en caso contrario, permanecera
		// oculto
		if (opts.conf.displayRegex.test(numOfSelectedRows)) {
			// Habilita el boton y su opcion dentro del context menu
			_enableButtonAndContextMenuOption(opts.conf.id);
		} else {
			// Deshabilita el boton y su opcion dentro del context menu
			_disableButtonAndContextMenuOption(opts.conf.id);
		}
	}
};

/**
* Establece el tipo de llamada necesario para obtener los datos según lo seleccionado
* e inicia la gestión para finalmente obtenerlos
*
* @name _reportsCopyData
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt Instancia del datatable
* @param {object} that Objeto del boton
* @param {object} config Configuracion del boton
*
*/
var _reportsCopyData = function (dt, that, config)
{
var ctx = dt.settings()[0];
var info = dt.buttons.exportInfo(config);
var type;
var multiselection = ctx.multiselection;
var selectedAll = multiselection.selectedAll;
var deselectedIds = multiselection.deselectedIds;

if (selectedAll) {
	if (deselectedIds.length > 0) {
		// Este caso es para cuando se selecciona todo y despues se
		// deseleccionan algunos registros
		type = "all-deselected";
	} else {
		// Este caso es para cuando se seleccionan todos los registros
		type = "all";
	}
} else {
	// Este caso para cuando hay determinados registros seleccionados manualmente
	type = "selected";
}

$.when(_reportsTypeOfCopy(dt, type, multiselection, selectedAll, deselectedIds)).then(function (exportData) {
	var exportDataRows = exportData.length;
	var exportDataParsed = JSON.stringify(exportData);

	var hiddenDiv = $('<div/>')
		.css({
			height: 1,
			width: 1,
			overflow: 'hidden',
			position: 'fixed',
			top: 0,
			left: 0
		});

	exportDataParsed = _convertToTabulador(exportDataParsed,true);
	var textarea = $('<textarea readonly/>')
		.val(exportDataParsed)
		.appendTo(hiddenDiv);

	_reportsOpenMessage(dt, ctx, that, exportDataRows, hiddenDiv, textarea);
});
};

/**
* Se encarga de mapear los datos de json a datos separados por el tabulador.
*
* @name ConvertToTabulador
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} objArray Objeto que contiene los datos a exportar
* @param {boolean} true en caso de querer que se mueste la cabecera
*
* @return {object}
*
*/
var _convertToTabulador = function(objArray,showLabel) {
var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
var str = '';

if (showLabel) {
    var row = "";
    
    // Se asignan los nombres de las columnas
    $.each(array[0], function(key, value) {
    	// Comprobar si es un objeto, en caso afirmativo lo recorremos y lo concatenamos
        if($.isPlainObject(value)) {
        	var objectName = key;
        	$.each(this, function(key, value) {
        		var keyToCamelKeys = key.substring(0,1).toLocaleUpperCase() + key.substring(1);
        		row += objectName + keyToCamelKeys + ';';
        	});
        } else {
        	row += key + ';';
        }
    });
    row = row.slice(0, -1);
    str += row + '\r\n';
}

// Se asignan los valores
$.each(array, function() {
    var line = '';
    $.each(this, function(key, value) {
        // Comprobar si es un objeto, en caso afirmativo lo recorremos y lo concatenamos
        if($.isPlainObject(value)) {
        	$.each(this, function(key, value) {
        		line += value + ';';
        	});
        } else {
        	line += value + ';';
        }
    });
    line = line.slice(0, -1);
    str += line + '\r\n';
});

return str;
}

/**
* Según el tipo de función de copia solicitada, realiza unas u otras comprobaciones
* antes de solicitar los datos al servidor
*
* @name _reportsTypeOfCopy
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt Instancia del datatable
* @param {string} type Tipo de funcion de copia a ejecutar
* @param {object} multiselection Propiedades de la multiseleccion
* @param {boolean} selectedAll Cuando es true significa que todas las filas estan marcadas
* @param {array} [deselectedIds] ID's de las filas deseleccionadas
*
* @return {object}
*
*/
var _reportsTypeOfCopy = function (dt, type, multiselection, selectedAll, deselectedIds)
{
var ctx = dt.settings()[0];
var deferred = $.Deferred();
var exportData;
var selectedIds = multiselection.selectedIds;
var selectedRows = multiselection.selectedRowsPerPage;
var ajaxOptions = {};
var urlAjax;
var typeAjax;
var contentTypeAjax = 'application/json';
var dataTypeAjax = 'json';

switch (type) {
	case 'selected':
		var localAccess = true;
		var exportData = [];

		// Comprueba si todos los valores seleccionados estan en la misma pagina
		$.each(selectedRows, function(key, value) {
			if (ctx.json.page != value.page) {
				localAccess = false;
				return false;
			}
		});
		if (localAccess) {
			// Puede acceder a los valores seleccionados localmente
			$.each(selectedRows, function(key, value) {
				var idPadre = value.id;
				$.each(ctx.json.rows, function(key, value) {
					if (DataTable.Api().rupTable.getIdPk(value) === idPadre) {
						exportData.push(value);
					}
				});
			});
			deferred.resolve(exportData);
		} else {
			// Accede a los datos mediante el servidor ya que se ha hecho uso de la paginacion
			// Parametros necesarios para configurar la llamada AJAX
			urlAjax = '/clipboardReport';
			typeAjax = 'POST';
			ajaxOptions = _reportsPrepareRequestData(ajaxOptions, urlAjax, typeAjax, contentTypeAjax, dataTypeAjax, ctx, selectedAll, deselectedIds, selectedIds);

			$.when(_reportsRequestData(ajaxOptions, ctx)).then(function (data) {
				exportData = data;
				deferred.resolve(exportData);
			});
		}
		break;
	case 'all':
		// Parametros necesarios para configurar la llamada AJAX
		typeAjax = 'GET';
		ajaxOptions = _reportsPrepareRequestData(ajaxOptions, urlAjax, typeAjax, contentTypeAjax, dataTypeAjax, ctx, selectedAll, deselectedIds, selectedIds);

		$.when(_reportsRequestData(ajaxOptions, ctx)).then(function (data) {
			ctx.ext.buttons.allData = data;
			exportData = ctx.ext.buttons.allData;
			deferred.resolve(exportData);
		});
		break;
	case 'all-deselected':
		// Parametros necesarios para configurar la llamada AJAX
		urlAjax = '/clipboardReport';
		typeAjax = 'POST';
		ajaxOptions = _reportsPrepareRequestData(ajaxOptions, urlAjax, typeAjax, contentTypeAjax, dataTypeAjax, ctx, selectedAll, deselectedIds, selectedIds);

		$.when(_reportsRequestData(ajaxOptions, ctx)).then(function (data) {
			exportData = data;
			deferred.resolve(exportData);
		});
		break;
}

return deferred.promise();
};

/**
* Se encarga de generar las opciones de configuración con las que se llamara a la API
*
* @name _reportsPrepareRequestData
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} ajaxOptions Parametros de la llamada Ajax
* @param {string} urlAjax Parametro para la URL
* @param {string} typeAjax Tipo de llamada a la API
* @param {string} contentTypeAjax Formato de datos enviados
* @param {string} dataTypeAjax Formato de datos esperados
* @param {object} ctx Contexto
* @param {boolean} selectedAll Cuando es true significa que todas las filas estan marcadas
* @param {array} [deselectedIds] ID's de las filas deseleccionadas
* @param {array} [selectedIds] ID's de las filas seleccionadas
*
* @return {object}
*
*/
var _reportsPrepareRequestData = function (ajaxOptions, urlAjax, typeAjax, contentTypeAjax, dataTypeAjax, ctx, selectedAll, deselectedIds, selectedIds)
{
var row = {};
row.core =  {
	'pkToken': ctx.oInit.multiplePkToken,
	'pkNames': ctx.oInit.primaryKey
};
row.multiselection = {};
row.multiselection.selectedAll = selectedAll;
if (row.multiselection.selectedAll) {
	row.multiselection.selectedIds = deselectedIds;
} else {
	row.multiselection.selectedIds = selectedIds;
}
// Completa el objeto 'ajaxOptions' con los parametros necesarios para la
// llamada que se realizara al servidor
ajaxOptions.contentType = contentTypeAjax;
ajaxOptions.dataType = dataTypeAjax;
if (urlAjax !== undefined) {
	ajaxOptions.url = ctx.oInit.urlBase + urlAjax;
} else {
	ajaxOptions.url = ctx.oInit.urlBase;
}
ajaxOptions.type = typeAjax;
if (typeAjax === 'POST') {
		ajaxOptions.data = JSON.stringify(row);
}

return ajaxOptions;
};

/**
* Se encarga de llamar a la API y de devolver los datos recibidos
*
* @name _reportsRequestData
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} ajaxOptions Parametros de la llamada Ajax
* @param {object} ctx Contexto
*
* @return {object}
*
*/
var _reportsRequestData = function (ajaxOptions, ctx)
{
var deferred = $.Deferred();
$.ajax(ajaxOptions)
	.done(function(data) {
		deferred.resolve(data);
		$('#' + ctx.sTableId).triggerHandler('tableButtonsSuccessReportsRequestData');
	})
	.complete(function() {
		$('#' + ctx.sTableId).triggerHandler('tableButtonsCompleteReportsRequestData');
	})
	.error(function() {
		$('#' + ctx.sTableId).triggerHandler('tableButtonsErrorReportsRequestData');
	});
return deferred.promise();
};

/**
* Gestiona la apertura/cierre del mensaje de confirmación de copia
*
* @name _reportsOpenMessage
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt Instancia del datatable
* @param {object} ctx Contexto
* @param {object} that Objeto del boton
* @param {int} exportDataRows Numero de filas a ser exportadas
* @param {object} hiddenDiv Elemento del DOM
* @param {object} textarea Elemento del DOM
*
*/
var _reportsOpenMessage = function (dt, ctx, that, exportDataRows, hiddenDiv, textarea)
{
$.rup_messages('msgConfirm', {
	title: dt.i18n('rup_datatable.copyButton.changes', 'Copia de registros en clipboard'),
	message: dt.i18n('rup_datatable.copyButton.saveAndContinue', {
		_: '¿Desea copiar %d registros?',
		1: '¿Desea copiar un registro?'
	}, exportDataRows),
	OKFunction: function () {
		ctx.oInit.formEdit.okCallBack = true;
		_reportsCopyDataToClipboard(dt, that, exportDataRows, hiddenDiv, textarea);
		ctx.oInit.formEdit.detailForm.rup_dialog("close");
	},
	beforeClose: function (){
		ctx.oInit.formEdit.okCallBack = false
		// Si es llamado desde el contextMenu este paso es innecesario y la condicion
		// del if evita un error
		if (that.processing !== undefined) {
			that.processing(false);
		}
	}
});
};

/**
* Copia los datos recibidos al portapapeles
*
* @name _reportsCopyDataToClipboard
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
*
* @param {object} dt Instancia del datatable
* @param {object} that Objeto del boton
* @param {int} exportDataRows Numero de filas a ser exportadas
* @param {object} hiddenDiv Elemento del DOM
* @param {object} textarea Elemento del DOM
*
*/
var _reportsCopyDataToClipboard = function (dt, that, exportDataRows, hiddenDiv, textarea)
{
// Para los navegadores que soportan el comando de copia 'execCommand'
if (document.queryCommandSupported('copy')) {
	hiddenDiv.appendTo(dt.table().container());
	textarea[0].focus();
	textarea[0].select();

	try {
		var successful = document.execCommand('copy');
		hiddenDiv.remove();

		if (successful) {
			dt.buttons.info(
				dt.i18n('rup_datatable.copyButton.changes', 'Copia de registros en portapapeles'),
				dt.i18n('rup_datatable.copyButton.saved', {
					_: 'Copiados %d registros al portapapeles',
					1: 'Copiado un registro al portapapeles'
				}, exportDataRows),
				2000
			);
			// Si es llamado desde el contextMenu este paso es innecesario y la condicion
			// del if evita un error
			if (that.processing !== undefined) {
				that.processing(false);
			}
			return;
		}
	}
	catch (t) {}
}

// Si no soportan la copia mediante 'execCommand', se mostrara un text box
// con las instrucciones de como copiar los elementos seleccionados
var message = $('<span>' + dt.i18n('rup_datatable.copyButton.copyKeys',
	'Presiona ctrl o ⌘ + C para copiar los datos de la tabla al portapapeles.' +
	'Para cancelar, haz click sobre este mensaje o pulsa el botón escape.') + '</span>'
)
.append(hiddenDiv);

dt.buttons.info(dt.i18n('rup_datatable.copyButton.copyTitle', 'Copiar al portapapeles'), message, 0);

// Selecciona el texto para cuando el usuario accione la copia al portapapeles
// se le pegue ese texto
textarea[0].focus();
textarea[0].select();

// Evento que oculta el mensaje cuando el usuario ha terminado con la copia
var container = $(message).closest('.dt-button-info');
var close = function () {
	container.off('click.buttons-copy');
	$(document).off('.buttons-copy');
	dt.buttons.info(false);
	// Si es llamado desde el contextMenu este paso es innecesario y la condicion
	// del if evita un error
	if (that.processing !== undefined) {
		that.processing(false);
	}
};

container.on('click.buttons-copy', close);
$(document)
	.on('keydown.buttons-copy', function (e) {
		if (e.keyCode === 27) { // esc
			close();
		}
	})
	.on('copy.buttons-copy cut.buttons-copy', function () {
		close();
		// Si es llamado desde el contextMenu este paso es innecesario y la condicion
		// del if evita un error
		if (that.processing !== undefined) {
			that.processing(false);
		}
	});
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;

function inicio(ctx) {
	var opts = ctx._buttons[0].inst.s.buttons;
	var numOfSelectedRows = ctx.multiselection.numSelected;
	var collectionObject;

	$.each(opts, function (i) {
		// Activa/desactiva los botones en el inicio en funcion de la propiedad
		// 'displayRegex' que tengan asociada
		collectionObject = null;
		_manageButtonsAndButtonsContextMenu(opts[i], numOfSelectedRows, collectionObject,ctx);
		// Comprueba si tiene botones hijos
		if (this.buttons.length > 0) {
			collectionObject = this;
			_manageButtonsAndButtonsContextMenu(opts[i], numOfSelectedRows, collectionObject,ctx);
		}
		// Comprueba si tiene un icono asociado
		if (this.conf.icon !== undefined) {
			// Establece el icono de los botones
			$('#' + this.conf.id).prepend('<i class="fa ' + this.conf.icon + ' right-separator" aria-hidden="true"></i>');
			// Comprueba si tiene botones hijos
			if (this.buttons.length > 0 && $('#' + this.conf.id).length > 0) {
				// Añadimos un evento para cuando se pulse sobre el boton padre, se le
				// asignen los iconos a los hijos
				$('#' + this.conf.id)[0].addEventListener('click', function eventHandler() {
					var that = this;
					$.each(opts[i].buttons, function (i) {
						var selectorCollection = $('#' + this.conf.id);
						// Establece el icono de los botones hijos
						selectorCollection.prepend('<i class="fa ' + this.conf.icon + ' right-separator" aria-hidden="true"></i>');
						that.removeEventListener('click', eventHandler);
					});
				}, false);
			}
		}
	});

	// Detecta cuando se selecciona o se deselecciona una fila en el datatable
	$('#' + ctx.sTableId).DataTable().on( 'select deselect contextmenu', function (event) {
		DataTable.Api().buttons.displayRegex(ctx);
		if(event.type === 'contextmenu' && event.srcElement) {
			$(event.srcElement.parentElement).triggerHandler('tableButtonsOpenContextMenu');
		}
	} );
	
} ;

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: function( settings ) {
		var api = new DataTable.Api( settings );
		var opts = api.init().buttons || DataTable.defaults.buttons;

		return new Buttons( api, opts ).container();
	},
	cFeature: "B"
} );

//DataTables creation - check if the buttons have been defined for this table,
//they will have been if the `B` option was used in `dom`, otherwise we should
//create the buttons instance here so they can be inserted into the document
//using the API. Listen for `init` for compatibility with pre 1.10.10, but to
//be removed in future.
$(document).on( 'plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if ( settings.oInit.buttons !== undefined && settings._buttons ) {
		inicio(settings);
	}
} );

return Buttons;
}));
