// NO EDITAR

(function ($) {
	
	$.rup_toolbar = $.rup_toolbar || {};
	$.extend($.rup_toolbar, {
		extend : function (methods) {
			$.fn.extend(methods);
		}
	});
	
	//Variable interna del toolbar para gestión de MButtons
	$.rup_toolbar.showingMB = null;
	
	$.rup_toolbar.extend({
		addButton : function (obj, json_i18n) { //añade a la toolbar un 'button'
			var boton = $("<button/>").text($.rup.i18nParse(json_i18n,obj.i18nCaption)).addClass("rup-toolbar_button");
			boton.button().button("option", "icons", {primary:obj.css, secondary:null} );
			$(this).append(boton);
			if (obj.click) { //Añadir eventos 
				boton.click({i18nCaption: obj.i18nCaption}, obj.click); 
			} 
			return boton;
		},
		
		addMButton : function (obj, json_i18n){ //añade a la toolbar un 'mbutton' (sin botones)
			var boton = '';
			if (obj.id === undefined) {
				alert("El atributo ID es obligatorio en los MButtons.");
				boton = null;
			} else {
				boton = $("<a/>").attr("id", obj.id).text($.rup.i18nParse(json_i18n,obj.i18nCaption)).addClass("rup-toolbar_menuButton");
				//Si no se define un estilo especial se aplica por defecto
				if (obj.css === undefined){
					obj.css = "rup-toolbar_menuButtonIcon";
				}
				boton.button().button("option", "icons", {primary:null, secondary:obj.css} );
			}
			$(this).append(boton);
			if (obj.click) { //Añadir eventos 
				boton.click({i18nCaption: obj.i18nCaption}, obj.click); 
			} 
			return boton;
		},
		
		addButtonsToMButton : function (buttons, menuButton, json_i18n) { //añade botones al 'mbutton'
			//Contenedor del menuButton
			var div = $('<div>')
					.addClass("ui-widget ui-widget-content rup-toolbar_menuButtonContainer")
					.attr("id","mbutton_"+menuButton[0].id)
					.css("display","none"),
			//Lista no numerada del menuButton
				ul = $('<ul>')
					.attr("role","menu")
					.attr("aria-activedescendant","active-menuitem")
					.attr("aria-labelledby","active-menuitem"),
			//numero de botones a añadir
				length = buttons.length;
			
			//Se añaden cada uno de los botones del menuButton
			for (var i = length; i--; ) {
				ul.prepend($("<li>").css("display", "block").append(this.addButton(buttons[i],json_i18n).addClass("rup-toolbar_menuButtonElement")));
			}

			//Añadir elementos al DOM 
			div.appendTo("body");
			div.append(ul);
			
			//Borrar referencias
			delete ul;
			delete div;
		},
		
		showMButton : function () {//Muestra la capa con los mbuttons

				var self = $(this),
					top = self.offset().top + self.getTotalHeight(),
					showingMB = $.rup_toolbar.showingMB,
					actualMB = this.id;
				
				//Se pulsa sobre el útimo que se ha mostrado (se oculta)
				if (showingMB === actualMB) {
					$("#mbutton_" + actualMB).slideUp("fast");
					self.removeClass("rup-toolbar_menuButtonSlided");
					showingMB = null;
				//Se pulsa sobre otro elemento
				} else {
					$("#mbutton_" + showingMB).slideUp("fast");	
					$("#mbutton_" + actualMB).css("position","absolute").css("top",top).css("left",self.offset().left).slideDown("fast");
					$("#" + showingMB).removeClass("rup-toolbar_menuButtonSlided");
					self.addClass("rup-toolbar_menuButtonSlided");
					showingMB = actualMB;
				}

				$.rup_toolbar.showingMB = showingMB;
				
				delete actualMB;
				delete showingMB;
				delete top;
				delete self;
					
				return false;
		}
	});
	
	$.rup_toolbar.hideMButtons = function () {
		var showingMB = $.rup_toolbar.showingMB;
		$("#mbutton_" + showingMB).slideUp("fast");	
		$("#" + showingMB).removeClass("rup-toolbar_menuButtonSlided");
		showingMB = null;
		$.rup_toolbar.showingMB = showingMB;
		delete showingMB;
	};
	
	$.fn.getTotalHeight = function(){//Función auxilliar que obtiene el alto total del boton, teniendo en cuenta todos los posibles paddings
		return $(this).height() + parseInt($(this).css('paddingTop')) + parseInt($(this).css('paddingBottom')) + parseInt($(this).css('borderTopWidth')) + parseInt($(this).css('borderBottomWidth'));
	};

    $.fn.rup_toolbar = function( properties ) {
		return this.each( function() {		
	    	// Carga de los valores por defecto para los atributos que no ha introducido el usuario
			var settings = $.extend({}, $.fn.rup_toolbar.defaults, properties),
				t = $(this),
				json_i18n;
			settings.id = this.id;
			
			//Literales
			json_i18n = $.rup.i18n.app[settings.id];
			
			//Anyadir estilo
			t.addClass("rup-toolbar");
			t.addClass("ui-widget-header");
			
			//Tamanyo
			if (settings.width!=null){
				t.width(settings.width);
			}
			
			//Asignar evento de ocultación de mbuttons cuando se pinche fuera de ellos
			$(document).click($.rup_toolbar.hideMButtons);
			
			//Botones
			for (var i = 0; i<settings.buttons.length ; i+=1) {
				t.addButton(settings.buttons[i],json_i18n);
			}
			
			//MButtons
			if (settings.mbuttons!=null){
				for (var i = 0; i<settings.mbuttons.length ; i+=1) {
					var mb = settings.mbuttons[i],
						menu =  t.addMButton ({id:mb.id, i18nCaption:mb.i18nCaption, css:mb.css, click:t.showMButton },json_i18n);
					//Se crea un mbutton (addMButoon) y se le asociand sus botones (addButtonsToMButton)
					if (menu !== null){
						t.addButtonsToMButton (mb.buttons, menu, json_i18n);
					}
				}
			}
		});
	};
	
	/* VALORES POR DEFECTO */
	$.fn.rup_toolbar.defaults = {
		width: null,
		buttons:[],
		mbuttons:null
	};	
	
})(jQuery);