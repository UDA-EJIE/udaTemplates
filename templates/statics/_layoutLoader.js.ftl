<#-- 
 -- Copyright 2011 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, 
 -- el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
/*!
 * Copyright 2011 E.J.I.E., S.A.
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

jQuery(document).ready(function(){
	$("#rup_dept_logo").attr("src", $.rup.APP_STATICS + "/images/dept_logo_" + $.rup.lang + ".gif");
	var vertical = false, mixto = false;
	if ($.rup.LAYOUT === "vertical") {
		vertical = true;
	} else if ($.rup.LAYOUT === "mixto") {
		mixto = true;
	}
	
	//rastro de migas
	$("#${warName}_migas").rup_breadCrumb({
		breadCrumb: {}	
	});
	//idioma
	$("#${warName}_language").rup_language({languages: [${languages}]});
	
	$("#${warName}_menu").rup_menu({
		display: (vertical ? 'vertical' : 'horizontal'),
		menu: [
				{"i18nCaption":"inicio", "url": "" },
				{"i18nCaption":"menu1", "submenu":[
				{"i18nCaption":"inicio", "url": "" },
				{"i18nCaption":"menu11", "url" : "" },
				{"i18nCaption":"menu12", "url" : "" },
				{"i18nCaption":"menu13", "url" : "" }
				]}
		]
	});
	
	if (mixto) {
		$("#${warName}_menu_mixto").rup_menu({
			display: 'vertical',
			menu: [
				{"i18nCaption":"inicio", "url": "" },
				{"i18nCaption":"menu1", "submenu":[
				{"i18nCaption":"inicio", "url": "" },
				{"i18nCaption":"menu11", "url" : "" },
				{"i18nCaption":"menu12", "url" : "" },
				{"i18nCaption":"menu13", "url" : "" }
				]}
			]
		});
	}
});