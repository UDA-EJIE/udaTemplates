// NO EDITAR

(function ($) {
	
	/********************************************** MENU - WIDGET *********************************************************/
	$.widget("ui.nestedmenu", {
		options: {
			menuId: "menuId"
		},
		_init: function() {
			
			//Guardar el ID del menú
			this.options.menuId = $(this.element).parents('div').attr('id');

			var self = this;
			this.active = this.element;
			
			// hide submenus and create indicator icons
			this.element.find("ul").hide().prev("a").prepend('<span class="ui-icon ui-icon-carat-1-e"></span>');	
			
			this.element.find("ul").andSelf().menu({
				// disable built-in key handling
				input: $(),
				select: function (event, ui) {
					if (ui.item.context.href !== '') {
						window.location=ui.item.context.href;
					}
					event.stopPropagation();
				},
				focus: function(event, ui) {
					self.active = ui.item.parent();
					self.activeItem = ui.item;
					ui.item.parent().find("ul").hide();
					var nested = $(">ul", ui.item);
					if(event.originalEvent !== undefined && nested.length && /^mouse/.test(event.originalEvent.type)) {
						self._open(nested);
					}
				}
			});
		},
		
		_open: function(submenu) {
			submenu.show().css({
				top: 0,
				left: 0
			}).position({
				my: "left top",
				at: "right top",
				of: this.activeItem
			});
		},
		
		up: function(event) {
			if (this.active[0].id === this.element.context.id){
				return false;
			}
			this.active = this.active.menu("deactivate").hide().parent().parent();
			this.activeItem = this.active.data("menu").active;
		},
		
		down: function(event) {
			var submenu = $(">ul", this.activeItem);
			this._open(submenu, this.activeItem);
			submenu.menu("activate", event, submenu.children(":first"));
		},
		
		show: function() {
			this.active = this.element;
			this.element.show();
		},
		
		hide: function() {
			var id = this.element.context.id;
			while (this.active[0].id !== id){
				this.up();
			}
			if (id.indexOf(this.options.menuId+"_sub_") !== -1){
				//Menu Horizontal (ocultar todas las capas)
				this.element.find("ul").andSelf().menu("deactivate").hide();
			} else {
				//Menu Vertical
				$('#'+id+' ul').hide();
			}
			delete id;
		},
		
		click: function() {
			if (this.activeItem.children(":first").attr("href") !== '') {
				window.location=this.activeItem.children(":first").attr("href");
			}
		}
	});
	/*********************************************************************************************************************************/
	
	$.rup_menu = $.rup_menu || {};
	$.extend($.rup_menu, {
		extend : function (methods) {
			$.fn.extend(methods);
		}
	});
	
	$.rup_menu.extend({
		parseJSON_vertical: function (json, json_i18n, menu) {
			var submenu, element;
			//Añadir contenedor menu
			menu.append($('<ul>'));
			//Posicionarse en el UL donde se deben insertar los elementos
			menu = $(menu).children('ul:last-child');
			//Recorrer json para añadir elementos
			for (var i = json.length; i--; ) {
				element = json[i];
				if (element.url !== undefined){
					//Si tiene enlace no es submenu
					menu.prepend($('<li>').append(
						$('<a>').text($.rup.i18nParse(json_i18n,element.i18nCaption)).attr('href', $.rup.CTX_PATH+element.url).css('text-decoration', 'underline')
					));
				} else {
					//Si no tiene enlace es submenu
					menu.prepend($('<li>').append(
						$('<a>').text($.rup.i18nParse(json_i18n,element.i18nCaption)).css('cursor','default')
					));
					//Obtener el elemento que va a ser el submenu
					submenu = $(menu).children(':first-child');
					//Llamada recursiva para añadir subelementos del submenu
					submenu.append(this.parseJSON_vertical(element.submenu, json_i18n, submenu));
					delete submenu;
				}
			}
			delete element;
		},
		parseJSON_horizontal: function (json, json_i18n, menu){
			
			$(menu).addClass('ui-widget-header');
			//Recorrer json para añadir enlaces
			for (var i = json.length; i--; ) {
				element = json[i];

				if (element.url !== undefined){ 
					menu.prepend($('<div>').addClass('rup_div_menu').append($('<a>').text($.rup.i18nParse(json_i18n,element.i18nCaption)).attr('href', $.rup.CTX_PATH+element.url)));					
				} else {
					menu.prepend($('<div>').addClass('rup_div_menu').append($('<a>').text($.rup.i18nParse(json_i18n,element.i18nCaption))));
				}
			}
			delete element;
		} 
	});
	
    $.fn.rup_menu = function (properties) {
    	
		return this.each ( function(index, element) {		
			
			// Carga de los valores por defecto para los atributos que no ha introducido el usuario
			var settings = $.extend({}, $.fn.rup_menu.defaults, properties),
				t = $(this),
				menuLiterals,
				json, json_i18n;			
			settings.id = this.id;
			
			//Estilo para el menu
			t.addClass("rup_menu");
			
			
			//Obtener estructura y literales
			if (settings.json === undefined){
				json = settings.menu; 
				json_i18n = $.rup.i18n.app[settings.id];

			} else {
				json = settings.json;
				json_i18n = settings.json_i18n;
			}
			
			
			//Dependiendo del tipo de menú varía el tratamiento
			if (settings.display === 'horizontal'){
			
			/** MENU HORIZONTAL **/
				//Estilo para el menu horizontal
				t.addClass("rup_menu_horizontal");
				
				//Generar estructura de menu
				$(this).parseJSON_horizontal(json, json_i18n, $('#'+settings.id));
				//Procesar botones
				t.children('.rup_div_menu').children("a").button()
					.click(function(){
						var submenu = $(this),
							display = submenu.children("ul").css("display");
						//Ocultar submenu activo
						if(submenu.parent().parent().find("ul:visible").length>0){
							submenu.parent().parent().find("ul:visible").data("nestedmenu").active.data("menu").previous(); //resalto primera opción
							submenu.parent().parent().find("ul:visible").hide();
							submenu.parent().parent().find(".ui-state-focus").removeClass("ui-state-focus"); //quitar estilo botón seleccionado
						}
						
						//Mostrar actual
						if (display==='none'){
							submenu.children("ul").show();		 
							submenu.children("ul").data("nestedmenu").active.data("menu").next(); //resalto primera opción
							$(submenu.find("a")[0]).focus();
						} else {
							submenu.removeClass("ui-state-focus"); //quitar estilo botón seleccionado
						}
						delete submenu;
					});
				
				//Numero de entradas de menu 
				var menuNumber = t.children('.rup_div_menu').children("a").size() -1;
				//Añadir submenus botones
				$.each(t.children('.rup_div_menu').children("a"), function (index, element){
					if ($(element).attr('href') === undefined){
						var divID = settings.id+'_sub_'+index;
						$(element)
								//Aplicar estilo para imagen submenus (default: v )
								.button("option", "icons", {primary:null, secondary:'rup-menu_horizontalIcon'} )
								.css('cursor', 'default')
								.append($('<div>')
								.attr('id', divID));
						$('#'+divID).rup_menu({ display: 'vertical', interLevel: settings.interLevel+1, json: json[index].submenu, json_i18n:json_i18n });
						$('#'+divID).nestedmenu("hide");
						
						$(element).addClass("spanDesple");
					} else {
						$(element).children().css('text-decoration', 'underline');
					}
					
					//Se guarda el tamaño de las entradas de menu con negrita para que no se muevan al hacer el Hover
					$(element).css("font-weight", "bold");
					$(element).css("width",$(element).innerWidth()+1);
					$(element).css("font-weight", "");
					
				});
				
				//Se mira si el navegador es IE para ajustar el separador final del menú (no debe aparecer)
				if($.rup.browser.isIE){
					t.children('.rup_div_menu').children("a").last().css("border-right-width","0px");	
				}
				
			} else {
			/** MENU VERTICAL */
				
				//Estilo para el menu vertical
				t.addClass("rup_menu_vertical");
				
				//Generar estructura de menu
				$(this).parseJSON_vertical(json, json_i18n, $('#'+settings.id));
					
				//Se cambia la capa inicial por su UL hijo ya que así es como lo requiere ui.menu (se extienden los estilos asociados)
				$('#'+settings.id+ " ul:first-child").attr("class", $('#'+settings.id).attr("class"));
				$('#'+settings.id).replaceWith($('#'+settings.id+ " ul:first-child").attr('id', settings.id));
				
				
				//Si es menu vertical (no un submenu), se le cambia el estilo (position:absolute -> position: relative)
				if (settings.id.indexOf("_sub_") === -1){
					$('#'+settings.id).css("position","relative");
				} 
				
				//Mostrar menu vertical
				var menu_vertical = $('#'+settings.id).nestedmenu();
				menu_vertical.bind('mouseleave', function (){
					$('#'+settings.id).nestedmenu("hide");
					//contenido de menu horizontal: quitar pulsación botón
					var id = $('#'+settings.id).attr('id');
					if (id.indexOf('_sub_') !== -1){
						$('#'+settings.id).parent('a').removeClass('ui-state-focus');  //quitar estilo botón seleccionado
					}
				});
				
				//Aplicar estilo para imagen submenus (default: > )
				$('#'+settings.id+' a span').addClass('rup-menu_verticalIcon');

				//Eventos teclado
				menu_vertical.nestedmenu("widget").keydown(function(event) {
					var menu = menu_vertical.data("nestedmenu").active.data("menu");
					if (menu.widget().is(":hidden"))
						return;
					event.stopPropagation();
					switch (event.keyCode) {
						case $.ui.keyCode.PAGE_UP:
							menu.previousPage(event);
							break;
						case $.ui.keyCode.PAGE_DOWN:
							menu.nextPage(event);
							break;
						case $.ui.keyCode.UP:
							menu.previous(event);
							break;
						case $.ui.keyCode.LEFT:
							menu_vertical.nestedmenu("up", event);
							break;
						case $.ui.keyCode.RIGHT:
							menu_vertical.nestedmenu("down", event);
							break;
						case $.ui.keyCode.DOWN:
							menu.next(event);
							event.preventDefault();
							break;
						case $.ui.keyCode.ENTER:
							menu.select();
							menu_vertical.nestedmenu("click");
							event.preventDefault();
							break;
						case $.ui.keyCode.ESCAPE:
							menu_vertical.nestedmenu("hide");
							$(menu.element).parents("a").removeClass('ui-state-focus'); //Eliminar foco del botón en horizontal
							break;
						default:
							clearTimeout(menu.filterTimer);
							var prev = menu.previousFilter || "";
							var character = String.fromCharCode(event.keyCode);
							var skip = false;
							if (character == prev) {
								skip = true;
							} else {
								character = prev + character;
							}
							var match = menu.widget().children("li").filter(function() {
								return new RegExp("^" + character, "i").test($("a", this).text());
							});
							var match = skip && match.index(menu.active.next()) != -1 ? match.next() : match;
							if (!match.length) {
								character = String.fromCharCode(event.keyCode);
								match = menu.widget().children("li").filter(function() {
									return new RegExp("^" + character, "i").test($(this).text());
								});
							}
							if (match.length) {
								menu.activate(event, match);
								if (match.length > 1) {
									menu.previousFilter = character;
									menu.filterTimer = setTimeout(function() {
										delete menu.previousFilter;
									}, 1000);
								} else {
									delete menu.previousFilter;
								}
							} else {
								delete menu.previousFilter;
							}
					}
				});
				
				
			}//else vertical
			
			// Se gestiona el tamaño del menu vertical
			var contentMV = $("#contentMV");
			if(settings.display !== 'horizontal' && settings.interLevel ===0){
				if (contentMV.size() === 1){
					$('#'+settings.id).css("width",(contentMV.css("margin-left").substring(0,contentMV.css("margin-left").length-2))*0.885);
				} else {
					$.rup_messages("msgError", {
						title: $.rup.i18n.base.rup_menu.developerError,
						message: "<p>"+$.rup.i18n.base.rup_menu.structuralError+"</p>"
					});
				}
			}
			
		});//each
	};//rup_menu
	
	/* VALORES POR DEFECTO */
	$.fn.rup_menu.defaults = {
		display: 'horizontal',
		interLevel: 0
	};	
	
})(jQuery);