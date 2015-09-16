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

/*
	 Plugin que genera la combo de idiomas con el siguiente formato.
		<ul>
			<li id="idiomaActivo" class="activo">Castellano </li>
			<li id="enlace" class="ultimo cambio_idioma" >
				<a href="#">Cambiar Idioma</a>
			</li>					
			<li id="listado" class="ultimo cambio_idioma_desplegado" style="display: none;">
				<div  class="caja_idiomas">
					<a id="caja_listado" class="opcion_cambio" >Cambiar Idioma</a>
					<div class="listado_idiomas">
						<a id="cerrar" class="cerrar_idiomas" href="#" title="Cerrar"><span class="hidden">Cerrar</span></a>
						
						<ul class="principal">			                	
								<li id="idioma_es" class="activo">
									<a class="idioma">Castellano</a>
								</li>
								<li id="idioma_eu">
									<a class="idioma">Euskera</a>
								</li>
						</ul>
					 </div>
				 </div>
			</li>
		</ul>
*/

(function ($) {
	$.widget("$.rup_language", {
		options: {
			languages: null, 
			active: null
		},
		_create: function () {
			this.options.active = $.rup.lang==null?"[lang]":$.rup.lang;
			this.options.languages = $.rup.AVAILABLE_LANGS.split(",");
			// Carga de los valores por defecto para los atributos que no ha introducido el usuario
			var self = this.element, ul = $("<ul>"), timerID,  
				liIdiomaActivo = $("<li>").attr("id", "rup_active_language").addClass("rup-language_active").text($.rup.i18nParse($.rup.i18n.base,"rup_language."+this.options.active)), 
				liEnlace = $("<li>").addClass("rup-language_change").attr("id", "rup_language_link"), 
				liListado = $("<li>").attr("id", "rup_language_list").addClass("rup-language_change_opened").css("display", "none"), 
				divCajaIdiomas = $("<div>"), 
				aChangeLang = $("<a>").attr("id", "rup_language_choice").addClass("rup-language_change_option").text($.rup.i18nParse($.rup.i18n.base,"rup_language.changeLanguage")),
				listadoIdiomas = $("<div>").addClass("rup-language_language_list"),
				cerrarIdioma = $("<a>")
					.addClass("rup-language_close_languages")
					.attr("id", "rup_language_close")
					.attr("href", "#")
					.attr("title", $.rup.i18nParse($.rup.i18n.base,"rup_language.closingLiteral"))
					.html($.rup.i18nParse($.rup.i18n.base,"rup_global.cerrar")),
				ulPrincipal = $("<ul>");
			
			ul.append(liIdiomaActivo);
			
			$("<a>").attr("href", "#").text($.rup.i18nParse($.rup.i18n.base,"rup_language.changeLanguage")).appendTo(liEnlace);
			ul.append(liEnlace);			
			divCajaIdiomas.append(aChangeLang);
			
			listadoIdiomas.append(cerrarIdioma);
			
			$.each(this.options.languages, function (key, value) { 
				value = value.replace(/^\s*|\s*$/g,"");
				var liIdioma = $("<li>").attr("id", "rup_language_lng_" + value), 
					txt = $.rup.i18nParse($.rup.i18n.base,"rup_language."+value); 
				$("<a>").appendTo(liIdioma).attr("href", "?"+$.rup.LOCALE_PARAM_NAME+"=" + value).text(txt)
				.attr("title", $.rup.i18nParse($.rup.i18n.base,"rup_language.changeLanguageLiteral_"+value)+$.rup.i18nParse($.rup.i18n.base,"rup_language."+value));
				liIdioma.appendTo(ulPrincipal);
			});	
			listadoIdiomas.append(ulPrincipal);
			divCajaIdiomas.append(listadoIdiomas);
			liListado.append(divCajaIdiomas);
			ul.append(liListado);
			self.append(ul);
			
			//hacemos que sea el lenguage actual el activo
			$("#rup_language_lng_" + $.rup.lang).addClass("rup-language_language_list_active");
			$("#rup_language_lng_" + $.rup.lang).children().attr("href","#"); //Permitir foco
			//evento click para mostrar el listado de idiomas
			liEnlace.click(function () {
					liEnlace.hide();
					liListado.show();
					$(".rup-language_language_list").find("li:not(.rup-language_language_list_active)").first().children("a").focus();
			});
			
			//evento del enlace de cambio de idioma
			aChangeLang.click(function () {
				liListado.hide(); 
				liEnlace.show();  		 
			});
			//evento del boton de cerrar		
			cerrarIdioma.click(function () {
				liListado.hide(); 
				liEnlace.show(); 
			});
			
			// gestion de eventos del raton sobre la parte del cambio de idioma
			liListado.mouseenter(function () {
				self.one("mouseleave", function () {
					liListado.hide(); 
					liEnlace.show();
				});
			});
			
			self.bind("keydown", function (event) {
				switch (event.keyCode) {
					case $.ui.keyCode.UP:
						if ($(event.target).parent().prevAll("li:not(.rup-language_language_list_active)").length > 0) {
							$(event.target).parent().prevAll("li:not(.rup-language_language_list_active)").first().children().focus();
						} else {
							$(event.target).parent().siblings("li:not(.rup-language_language_list_active)").last().children().focus();
						}
						break;
					case $.ui.keyCode.DOWN:
						if ($(event.target).parent().nextAll("li:not(.rup-language_language_list_active)").length > 0) {
							$(event.target).parent().nextAll("li:not(.rup-language_language_list_active)").first().children().focus();
						} else {
							$(event.target).parent().siblings("li:not(.rup-language_language_list_active)").first().children().focus();
						}
						break;
					case $.ui.keyCode.ESCAPE:
						liListado.hide(); 
						liEnlace.show();  
						break;
					default:
				}
			});
			
			// Se aplica el tooltip
			self.find("[title]").rup_tooltip({"applyToPortal": true});
		},
		_setOption: function (key, value) {
			$.Widget.prototype._setOption.apply(this, arguments);			
		},
		destroy: function () {
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);