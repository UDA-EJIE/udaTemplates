//NO EDITAR

(function ($) {
	
	//*****************************************************************************************************************
	// DEFINICIÓN BASE DEL PATRÓN (definición de la variable privada que contendrá los métodos y la función de jQuery)
	//*****************************************************************************************************************
	
	var rup_messages = {};
	
	//Se configura el arranque de UDA para que alberge el nuevo patrón 
	$.extend($.rup.iniRup, $.rup.rupObjectConstructor("rup_messages", rup_messages));
	
	window.alert = function (text) {
        $.rup_messages("msgAlert", {title: $.rup.i18n.base.rup_message.alert, message: text});    
    };
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//********************************
	
	$.rup_messages("extend", {
		msgError : function (properties) {
            var self = this._createDiv().appendTo("body");
            self.dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                closeText: $.rup.i18n.base.rup_message.tituloError.cerrar,
                title: (properties.title === null || properties.title === "" ? $.rup.i18n.base.rup_message.tituloError: properties.title),
                close: function () {
                    self.dialog("destroy");
                    self.remove();
                    self = null;
                },
                buttons: [{
                        text: $.rup.i18n.base.rup_message.aceptar,
                        click: function () { 
                            self.dialog("close"); 
                        }
                    }]
                });    
            if ($.isFunction(properties.beforeClose)) {//la funcion recibira dos par?metros event, ui
                self.bind("dialogbeforeclose", properties.beforeClose);
            }
			this._createCloseLink(self);
			this._addStyles(self, "error", properties.message);
            self.dialog("open");
        },
        msgConfirm : function (properties) {    
            var self = this._createDiv().appendTo("body"), aceptButton;
            self.dialog({
                    autoOpen: false,
                    modal: true,
                    resizable: false,
                    closeText: $.rup.i18n.base.rup_message.tituloError.cerrar,
                    title: (properties.title === null || properties.title === "" ?$.rup.i18n.base.rup_message.confirmacion: properties.title),
                    close: function () {
                        self.dialog("destroy");
                        self.remove();
                        self = null;
                    }
                });            
            aceptButton = [{
                    text: $.rup.i18n.base.rup_message.aceptar,
                    click: function () { 
                        self.dialog("close"); 
                        properties.OKFunction.call(this, self);
                    }
                }];
            self.dialog("option", "buttons", aceptButton);
            if ($.isFunction(properties.beforeClose)) {//la funcion recibira dos par?metros event, ui
                self.bind("dialogbeforeclose", properties.beforeClose);
            }
			this._createCloseLink(self);
			this._addStyles(self, "confirm", properties.message);
			this._createLinkButton(self);
            self.dialog("open");
            //Le ponemos el foco al botón aceptar en vez de al enlace
            $('div[aria-labelledby=ui-dialog-title-' + self[0].id + '] .ui-dialog-buttonpane button:first').focus();
        },
        msgOK : function (properties) {    
            var self = this._createDiv().appendTo("body");
            self.dialog({
                    autoOpen: false,
                    modal: true,
                    resizable: false,
                    closeText: $.rup.i18n.base.rup_message.tituloError.cerrar,
                    title: (properties.title === null || properties.title === "" ? $.rup.i18n.base.rup_message.correct: properties.title),
                    close: function () {
                        self.dialog("destroy");
                        self.remove();
                        self = null;
                    },
                    buttons: [{ 
							text: $.rup.i18n.base.rup_message.aceptar,
							click: function () { 
								self.dialog("close"); 
							}
                    	}]
                	});    
            if ($.isFunction(properties.beforeClose)) {//la funcion recibira dos par?metros event, ui
                self.bind("dialogbeforeclose", properties.beforeClose);
            }
            this._createCloseLink(self);
			this._addStyles(self, "ok", properties.message);
            self.dialog("open");
        },
        msgAlert : function (properties) {
            var self = this._createDiv().appendTo("body");
            self.dialog({
                    autoOpen: false,
                    modal: true,
                    resizable: false,
                    closeText: $.rup.i18n.base.rup_global.cerrar,
                    title: (properties.title === null || properties.title === "" ? $.rup.i18n.base.rup_message.alert: properties.title),
                    close: function () {
                        self.dialog("destroy");
                        self.remove();
                        self = null;
                    },
                    buttons: [{ 
							text: $.rup.i18n.base.rup_message.aceptar,
							click: function () { 
								self.dialog("close"); 
							}
                    	}]
                	});    
            if ($.isFunction(properties.beforeClose)) {//la funcion recibira dos par?metros event, ui
                self.bind("dialogbeforeclose", properties.beforeClose);
            }                
            this._createCloseLink(self);
			this._addStyles(self, "alert", properties.message);
            self.dialog("open");
        }
	});
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PRIVADOS
	//********************************
	
	$.rup_messages("extend", {
			_createDiv : function () { //Crea los divs de los mensajes
				return $("<div/>").attr("id", "rup_msgDIV_" + new Date().getTime());
			},
			_createCloseLink : function (self) { //Crea el enlace de cerrar junto a la x de cerrar.
				var closeSpan = "<span id='closeText_" + self[0].id + "' style='float:right;font-size:0.85em;'>" + $.rup.i18n.base.rup_global.cerrar + "</span>", 
	            aClose = $("<a href='#'></a>")
	                    .attr("role", "button")
	                    .css("margin-right", "0.9em")
	                    .css("float", "right")
	                    .addClass("ui-dialog-title")
	                    .html(closeSpan)
	                    .click(function (event) {
	                    self.dialog("close");
	                    return false;
	                }).hover(function (eventObject) { //Evento lanzado para que se cambie el icono de la X a hover, marcado por ARISTA
						$('div[aria-labelledby=ui-dialog-title-' + self[0].id + '] .ui-dialog-titlebar-close').addClass("ui-state-hover");
						$('div[aria-labelledby=ui-dialog-title-' + self[0].id + '] .ui-dialog-titlebar-close').css("padding", "0px");
					},
					function (eventObject) {
						$('div[aria-labelledby=ui-dialog-title-' + self[0].id + '] .ui-dialog-titlebar-close').removeClass("ui-state-hover");
						$('div[aria-labelledby=ui-dialog-title-' + self[0].id + '] .ui-dialog-titlebar-close').attr("style", "");					
					}).insertAfter("#ui-dialog-title-" + self[0].id); 
				$('div[aria-labelledby=ui-dialog-title-' + self[0].id + '] .ui-dialog-titlebar-close').hover(
				function () { 
					aClose.css("text-decoration", "none");
				},
				function () {
					aClose.css("text-decoration", "");
				});		
			},
			_addStyles : function (self, css, message) { //Le a?ade los divs del mensaje a mostrar y el icono correpondiente
				var divMessageIcon = $("<div>").attr("id", "rup_msgDIV_msg_icon").addClass("rup-message_icon-" + css), 
	            divMessage = $("<div>").attr("id", "rup_msgDIV_msg").addClass("rup-message_msg-" + css).html(message);
	            self.append(divMessageIcon);
	            self.append(divMessage);
			},
			_createLinkButton : function (self) { //Creamos un boton como si fuera un
            //creamos el enlace
				var cancelHREF = $("<a href='#'></a>")
                        .attr("role", "button")
                        .attr("id", self[0].id + "_cancel")
                        .addClass("rup-enlaceCancelar")
                        .html($.rup.i18n.base.rup_global.cancel)
                        .click(function (event) {
                    self.dialog("close");
                    return false;
                });
				$('div[aria-labelledby=ui-dialog-title-' + self[0].id + '] .ui-dialog-buttonset ').prepend(cancelHREF);
			}
		});
		
	//******************************************************
	// DEFINICIN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//******************************************************
		
	
})(jQuery);