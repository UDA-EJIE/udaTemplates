<#-- 
 -- Copyright 2013 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, VersiÃ³n 1.1 exclusivamente (la Â«LicenciaÂ»);
 -- Solo podrÃ¡ usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislaciÃ³n aplicable o se acuerde por escrito, 
 -- el programa distribuido con arreglo a la Licencia se distribuye Â«TAL CUALÂ»,
 -- SIN GARANTÃ�AS NI CONDICIONES DE NINGÃšN TIPO, ni expresas ni implÃ­citas.
 -- VÃ©ase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
/*!
 * Copyright 2012 E.J.I.E., S.A.
 *
 * Licencia con arreglo a la EUPL, VersiÃ³n 1.1 exclusivamente (la Â«LicenciaÂ»);
 * Solo podrÃ¡ usarse esta obra si se respeta la Licencia.
 * Puede obtenerse una copia de la Licencia en
 *
 *      http://ec.europa.eu/idabc/eupl.html
 *
 * Salvo cuando lo exija la legislaciÃ³n aplicable o se acuerde por escrito, 
 * el programa distribuido con arreglo a la Licencia se distribuye Â«TAL CUALÂ»,
 * SIN GARANTÃ�AS NI CONDICIONES DE NINGÃšN TIPO, ni expresas ni implÃ­citas.
 * VÃ©ase la Licencia en el idioma concreto que rige los permisos y limitaciones
 * que establece la Licencia.
 */

jQuery(document).ready(function(){

	// Evitar conflictos entre Bootstrap y jQueryUI
	$.fn.bootstrapBtn = $.fn.button.noConflict();

	//logo
	$("#rup_dept_logo").attr("src", $.rup.APP_STATICS + "/images/dept_logo_" + $.rup.lang + ".gif");
		
	//rastro de migas
	$("#${warName}_migas").rup_breadCrumb({
		breadCrumb: {}	
	});
	
	//idioma
	$("#${warName}_language").rup_language({languages: $.rup.AVAILABLE_LANGS_ARRAY, modo: "default"});
	
	//menu
	$("#${warName}_menu").rup_menu({
		display: ($.rup.LAYOUT === "vertical" ? 'vertical' : 'horizontal')
	});
	if ($.rup.LAYOUT === "mixto") {
		$("#${warName}_menu_mixto").rup_menu({
			display: 'vertical'
		});
	}
	
	//NAVBAR Menu
	$("#navbarResponsive").rup_navbar();
	
	//pie
	$(".footer [title]").rup_tooltip();
});