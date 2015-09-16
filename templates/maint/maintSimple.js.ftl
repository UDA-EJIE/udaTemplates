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
jQuery(function($){
	$("#GRID_${maint.getNameMaint()}").rup_grid({
		${grid.printGridProperties()}
		colNames: [
			<#foreach columnPropertiesLabel in gridColumns>
			"${columnPropertiesLabel.getLabel()}"<#if columnPropertiesLabel_has_next>,</#if>
			</#foreach>
		],
		colModel: [
			<#foreach columnProperties in gridColumns>
			${columnProperties.printProperties()}<#if columnProperties_has_next>,</#if>
			</#foreach>
        ]<#if grid.hasGridEvents()>,
		//Eventos</#if>
		${grid.printGridEvents()}
	});
	
	<#if maint.getToolbarMaint() != "">
	//Botonera de gesti�n de la tabla
	$("#${maint.getToolbarMaint()}").rup_toolbar();
	</#if>

	$("#${maint.getNameMaint()}").rup_maint({
		${maint.printMaintProperties()}<#if maint.hasMaintEvents()>,
		//Eventos</#if>
		${maint.printMaintEvents()}		
	});
});