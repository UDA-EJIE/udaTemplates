//NO EDITAR
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
			this.options.active = $.rup.lang;
			this.options.languages = $.rup.AVAILABLE_LANGS.split(",");
			// Carga de los valores por defecto para los atributos que no ha introducido el usuario
			var self = this.element, ul = $("<ul>"), timerID,  
				liIdiomaActivo = $("<li>").attr("id", "rup_active_language").addClass("rup-language_active").text($.rup.i18n.base.rup_language[this.options.active]), 
				liEnlace = $("<li>").addClass("rup-language_change").attr("id", "rup_language_link"), 
				liListado = $("<li>").attr("id", "rup_language_list").addClass("rup-language_change_opened").css("display", "none"), 
				divCajaIdiomas = $("<div>"), aChangeLang = $("<a>").attr("id", "rup_language_choice").addClass("rup-language_change_option").text($.rup.i18n.base.rup_language.changeLanguage),
				listadoIdiomas = $("<div>").addClass("rup-language_language_list"), cerrarIdioma = $("<a>").addClass("rup-language_close_languages").attr("id", "rup_language_close").attr("href", "#").attr("title", $.rup.i18n.base.rup_global.close), 
				span = $("<span>").addClass("rup-language_hidden").text($.rup.i18n.base.rup_global.close), ulPrincipal = $("<ul>");
			
			ul.append(liIdiomaActivo);
			
			$("<a>").attr("href", "#").text($.rup.i18n.base.rup_language.changeLanguage).appendTo(liEnlace);
			ul.append(liEnlace);			
			divCajaIdiomas.append(aChangeLang);
			
			cerrarIdioma.append(span);
			listadoIdiomas.append(cerrarIdioma);
			
			$.each(this.options.languages, function (key, value) { 
				value = value.replace(/^\s*|\s*$/g,"");
				var liIdioma = $("<li>").attr("id", "rup_language_lng_" + value), txt = $.rup.i18n.base.rup_language[value]; 
				//$("<a>").attr("href", "?locale=" + value).text(txt).appendTo(liIdioma);
				$("<a>").appendTo(liIdioma).attr("href", "?locale=" + value).text(txt);
				liIdioma.appendTo(ulPrincipal);
			});	
			listadoIdiomas.append(ulPrincipal);
			divCajaIdiomas.append(listadoIdiomas);
			liListado.append(divCajaIdiomas);
			ul.append(liListado);
			self.append(ul);
			
			//hacemos que sea el lenguage actual el activo
			$("#rup_language_lng_" + $.rup.lang).addClass("rup-language_language_list_active");
			$("#rup_language_lng_" + $.rup.lang).children().removeAttr("href");
			//evento click para mostrar el listado de idiomas
			liEnlace.click(function () {
				if (liListado.css("display") === "none") {
					liListado.show(); 
					liEnlace.hide();
					// timer para ocultar al de 4 segundos
					timerID = setTimeout(function () {
						liListado.hide(); 
						liEnlace.show();
					}, 4000);
				} else { 
					liListado.hide(); 
					liEnlace.show(); 
				}
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
				clearTimeout(timerID);
				self.one("mouseleave", function () {
					timerID = setTimeout(function () {
							liListado.hide(); 
							liEnlace.show();
						}, 1000);
				});
			});
		},
		_setOption: function (key, value) {
			$.Widget.prototype._setOption.apply(this, arguments);			
		},
		destroy: function () {
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);