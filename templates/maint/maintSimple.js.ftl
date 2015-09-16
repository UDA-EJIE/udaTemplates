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
	//Botonera de gestión de la tabla
	$("#${maint.getToolbarMaint()}").rup_toolbar();
	</#if>

	$("#${maint.getNameMaint()}").rup_maint({
		${maint.printMaintProperties()}<#if maint.hasMaintEvents()>,
		//Eventos</#if>
		${maint.printMaintEvents()}		
	});
});