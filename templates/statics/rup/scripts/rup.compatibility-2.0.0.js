/*!
 * Copyright 2012 E.J.I.E., S.A.
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

// Funciones y estructuras destinadas a hacer compatibles diferentes aspectos de los plug-in's subyacentes. Por ejemplo: en casos de cambio de versión, en condiciones funcionales extremas,...

(function ($) {
	
	$.rup.compatibility = $.rup.compatibility || {};
	$.extend($.rup.compatibility, {
		menu: {
			delay: 10,
			outDelay: 10,
			focus: function( event, item ) {
				var nested, borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
				this.blur( event );
				
				if ( this._hasScroll() ) {
					borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
					paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
					offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
					scroll = this.activeMenu.scrollTop();
					elementHeight = this.activeMenu.height();
					itemHeight = item.height();

					if ( offset < 0 ) {
						this.activeMenu.scrollTop( scroll + offset );
					} else if ( offset + itemHeight > elementHeight ) {
						this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
					}
				}

				var lastActive = this.activeMenu;
				this.active = item.first();
				
				if(!(this.active.hasClass("rup_menu_horizontal_children"))){
					this.element.attr( "aria-activedescendant",
						this.active.children( "a" )
							.addClass( "ui-state-focus" )
							.attr( "id" ) );
				} else {
					this.element.attr( "aria-activedescendant",
						this.active.children( "a" )
							.attr( "id" ) );
					this.active.addClass( "ui-state-focus" );
				}

				// highlight active parent menu item, if any
				this.active.parent().closest( ".ui-menu-item" ).children( "a:first" ).addClass( "ui-state-active" );

				if(this.active.children("a").hasClass("ui-state-active")){
					this.active.children("a").removeClass("ui-state-active");
					if(this.active.find("[aria-expanded = 'true']").size() > 1){
						this._close(lastActive);
					}
				} else {
					this._close();
					nested = $( "> .ui-menu", item );
					if (( nested.length && ( /^focus/.test( event.type ) && item.attr("rupMenu_firsLevel") !== 'true') ) || ( nested.length && ( /^click/.test( event.type ) && item.attr("rupMenu_firsLevel") === 'true') )) {
						this._startOpening(nested);
					}
				}
				
				this.activeMenu = item.parent();
			},
			_create: function() {
				this.activeMenu = this.element;
				this.menuId = this.element.attr( "id" ) || "ui-menu-" + idIncrement++;
				if ( this.element.find( ".ui-icon" ).length ) {
					this.element.addClass( "ui-menu-icons" );
				}
				this.element
					.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
					.attr({
						id: this.menuId,
						role: "menu",
						tabIndex: 0
					})
					// need to catch all clicks on disabled menu
					// not possible through _bind
					.bind( "click.menu", $.proxy(function( event ) {
						if ( this.options.disabled ) {
							event.preventDefault();
						}
					}, this ));

				if ( this.options.disabled ) {
					this.element.addClass( "ui-state-disabled" );
				}
				this._bind({
					// Prevent focus from sticking to links inside menu after clicking
					// them (focus should always stay on UL during navigation).
					"mousedown .ui-menu-item > a": function( event ) {
						event.preventDefault();
					},
					"click .ui-state-disabled > a": function( event ) {
						event.preventDefault();
					},
					"click .ui-menu-item:has(a)": function( event ) {
						event.stopImmediatePropagation();
						var target = $( event.currentTarget );
						// Don't select disabled menu items
						if (!(target.attr("rupMenu_firsLevel") !== 'true')){
							if(target.children("[aria-expanded = 'true']").size() > 0){
								this._close(target);
							}
							else {
								this.focus( event, target );
							}
						}
					},
					"mouseover": function( event ) {
						$(event.currentTarget).attr("rup_menu_nofocus","true");	 
					},
					"mouseover .ui-menu-item": function( event ) {
						event.stopImmediatePropagation();
						var target = $( event.currentTarget );
						
						// Remove ui-state-active class from siblings of the newly focused menu item
						// to avoid a jump caused by adjacent elements both having a class with a border
						target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
						
						if ((target.offset().left+target.width() > event.pageX) && (target.offset().top+$("#"+this.menuId).height() > event.pageY)){
							if (!($("#"+target.children("a").attr("id")+":focus" ).size() > 0)){
								$("#"+target.children("a").attr("id")).focus();
							} else {
								if(!(target.hasClass("rup_menu_horizontal_children"))){
									if(!$("#"+target.children("a").attr("id")).hasClass("ui-state-focus")){
										$("#"+target.children("a").attr("id")).addClass("ui-state-focus");
									}
								} else {
									if(!(target.hasClass("ui-state-focus"))){
										target.addClass("ui-state-focus");
									}
								}
							}
						}
						
					},
					"mouseleave": function(event){
						this.collapseAll(event, true);
						$(".ui-state-focus").removeClass("ui-state-focus");
						$(event.currentTarget).removeAttr("rup_menu_nofocus");	 
					},
					"mouseleave .ui-menu-item": function(event){
						var target = $( event.currentTarget );
						if (target.attr("rupmenu_firslevel") === undefined || ((target.offset().top-1 < event.pageY) && (target.offset().top+$("#"+this.menuId).height()+1 < event.pageY))){
							$(".ui-state-focus").removeClass("ui-state-focus");
						}
					},
					"mouseleave .rup_menu_horizontal_children_last": function(event){
						this.collapseAll(event, true);
						$(".ui-state-focus").removeClass("ui-state-focus");
					},
					"focus .ui-menu-item a": function(event) {
						var target = $( event.currentTarget ).parent();
						this.focus( event, target );
					},
					"focus": function(event){
						if ($(event.currentTarget).attr("rup_shift_nofocus") === undefined){
							if($(event.currentTarget).attr("rup_menu_nofocus") === undefined){
								$(event.currentTarget).find(".ui-menu-item a").first().focus();
							}
						} else {
								$(event.currentTarget).removeAttr("rup_shift_nofocus");
						}
					},
					"blur": function( event ) {
						this._delay(function() {
							if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
								this.collapseAll( event );
							}
						});
					},
					"keydown": "_keydown"
				});

				this.refresh();

				this._bind( this.document, {
					click: function( event ) {
						if ( !$( event.target ).closest( ".ui-menu" ).length ) {
							this.collapseAll( event );
						}
					}
				});
			},
			_open: function( submenu ) {
				clearTimeout( this.timer );
				this.element.find( ".ui-menu" ).not( submenu.parents() )
					.hide()
					.attr( "aria-hidden", "true" );

				var position = $.extend( {}, {
						of: this.active
					}, $.type(this.options.position) === "function" ?
						this.options.position(this.active) :
						this.options.position
					);
				if(submenu.parent().attr("rupMenu_firsLevel") === 'true'){
					position.my = "left top";
					position.at = "left bottom";
				}
				submenu
					.show()
					.removeAttr( "aria-hidden" )
					.attr( "aria-expanded", "true" )
					.position( position );
			},
			expand: function( event ) {
				var newItem = this.active &&
					this.active
						.children( ".ui-menu " )
						.children( ".ui-menu-item" )
						.not( ".ui-state-disabled" )
						.first();

				if ( newItem && newItem.length ) {
					this._open( newItem.parent() );

					//timeout so Firefox will not hide activedescendant change in expanding submenu from AT
					this._delay(function() {
						this.focus( event, newItem );
					}, this.delay );
					return true;
				}
			},
			collapseAll: function( event, all ) {
				clearTimeout( this.timer );
				this.timer = this._delay(function() {
					// if we were passed an event, look for the submenu that contains the event
					var currentMenu;
					if(all){
						currentMenu = this.element;
					} else {
						currentMenu = $( event && event.target ).closest( this.element.find( ".ui-menu" ) );
					}

					// if we found no valid submenu ancestor, use the main menu to close all sub menus anyway
					if ( !currentMenu.length ) {
						currentMenu = this.element;
					}

					this._close( currentMenu );

					this.blur( event );
					this.activeMenu = currentMenu;
				}, this.outDelay );
			},
			blur: function( event ) {
				clearTimeout( this.timer );

				if ( !this.active ) {
					return;
				}
				
				if (!(this.active.hasClass("ui-state-focus"))){
					this.active.find(".ui-state-focus").removeClass( "ui-state-focus" );					
				} else {
					this.active.removeClass( "ui-state-focus" );
				}
				
				this.active = null;

				this._trigger( "blur", event, { item: this.active } );
			},
			_keydown: function( event ) {
				event.stopPropagation();
				var horizontal = (($(event.currentTarget).hasClass("rup_menu_horizontal")) && ($(event.currentTarget).find(".ui-state-focus").size() === 0)) || ($(event.currentTarget).find(".ui-state-focus").children().hasClass("rup_menu_horizontal_children_entry"));
				
				switch ( event.keyCode ) {
				case $.ui.keyCode.PAGE_UP:
					this.previousPage( event );
					event.preventDefault();
					event.stopImmediatePropagation();
					
					break;
				case $.ui.keyCode.PAGE_DOWN:
					this.nextPage( event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.HOME:
					this._move( "first", "first", event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.END:
					this._move( "last", "last", event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.UP:
					if(!horizontal){
						this.previous( event );
						event.stopImmediatePropagation();
						break;
					} else {
						if (this.collapse( event )) {
							event.stopImmediatePropagation();
						}
						event.preventDefault();
						break;
					}
				case $.ui.keyCode.DOWN:
					if(!horizontal){
						this.next( event );
						event.stopImmediatePropagation();
						break;
					} else {
						if (this.expand( event )) {
							event.stopImmediatePropagation();
						}
						event.preventDefault();
						break;
					}
				case $.ui.keyCode.LEFT:
					if(!horizontal){
						if (this.collapse( event )) {
							event.stopImmediatePropagation();
						}
						event.preventDefault();
						break;
					} else {
						this.previous( event );
						event.stopImmediatePropagation();
						break;		
					}
				case $.ui.keyCode.RIGHT:
					if(!horizontal){
						if (this.expand( event )) {
							event.stopImmediatePropagation();
						}
						event.preventDefault();
						break;
					} else {
						this.next( event );
						event.stopImmediatePropagation();
						$(event.currentTarget).find(".ui-state-focus").focus();
						break;
					}
				case $.ui.keyCode.ENTER:
					if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
						if ( this.expand( event ) ) {
							event.stopImmediatePropagation();
						}
					}
					else {
						this.select( event );
						event.stopImmediatePropagation();
					}
					event.preventDefault();
					break;
				case $.ui.keyCode.ESCAPE:
					if ( this.collapse( event ) ) {
						event.stopImmediatePropagation();
					}
					event.preventDefault();
					break;
				case $.ui.keyCode.TAB:
					this.collapseAll(event, true);
					if(event.shiftKey){
						$(event.currentTarget).attr("rup_shift_nofocus","true");
						$(event.currentTarget).focus();
					}
				default:
					event.stopPropagation();
					clearTimeout( this.filterTimer );
					var match,
						prev = this.previousFilter || "",
						character = String.fromCharCode( event.keyCode ),
						skip = false;

					if ( character === prev ) {
						skip = true;
					} else {
						character = prev + character;
					}
					function escape( value ) {
						return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
					}
					match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
						return new RegExp( "^" + escape( character ), "i" )
							.test( $( this ).children( "a" ).text() );
					});
					match = skip && match.index(this.active.next()) !== -1 ?
						this.active.nextAll(".ui-menu-item") :
						match;
					if ( !match.length ) {
						character = String.fromCharCode(event.keyCode);
						match = this.activeMenu.children(".ui-menu-item").filter(function() {
							return new RegExp( "^" + escape(character), "i" )
								.test( $( this ).children( "a" ).text() );
						});
					}
					if ( match.length ) {
						this.focus( event, match );
						if ( match.length > 1 ) {
							this.previousFilter = character;
							this.filterTimer = this._delay(function() {
								delete this.previousFilter;
							}, 1000 );
						} else {
							delete this.previousFilter;
						}
					} else {
						delete this.previousFilter;
					}
				}
			}
		}
		
	});
	
})(jQuery);