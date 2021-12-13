/*!
 * Copyright 2021 E.J.I.E., S.A.
 *
 * Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la "Licencia");
 * Solo podrá usarse esta obra si se respeta la Licencia.
 * Puede obtenerse una copia de la Licencia en
 *
 *      http://ec.europa.eu/idabc/eupl.html
 *
 * Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
 * el programa distribuido con arreglo a la Licencia se distribuye "TAL CUAL",
 * SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 * Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 * que establece la Licencia.
 */

jQuery(function($) {
	<#list gridColumns as columnProperties>
	<#if (columnProperties.activated)?string == "true">
		<#switch columnProperties.editType>
		<#case "Datepicker">
	$("#${columnProperties.name}_detail_table").rup_date();
	$("#${columnProperties.name}_filter_table").rup_date();
	
			<#break>
		<#default>
			<#break>
	  	</#switch>
	</#if>
	</#list>
let tableColModels = [
		<#list gridColumns as columnProperties>
		<#if ((maint.primaryKey)?has_content && !(maint.primaryKey)?contains(columnProperties.name)) && ((columnProperties.primaryKey)?string == "false" || (maint.typeMaint)?string != "INLINE")>
		{
			name: "${columnProperties.name}",
			index: "${columnProperties.name}",
			editable: ${columnProperties.editable?string},
			<#switch columnProperties.editType>
				<#case "Combo">
					<#assign rupType = "combo">
					<#break>
				<#case "Autocomplete">
					<#assign rupType = "autocomplete">
					<#break>
				<#case "Datepicker">
					<#assign rupType = "datepicker">
					<#break>
				<#default>
					<#assign rupType = "">
			</#switch>
			<#if rupType != "">
			ruptype: "${rupType}",
			</#if>
			hidden: ${columnProperties.hidden?string}
		}<#if columnProperties_has_next>,</#if>
		</#if>
		</#list>
	];
	<#-- Comprobar si la primaryKey existe y no es multipk, cuando las condiciones no se cumplan, se generará el identificador por defecto -->
	<#if (maint.primaryKey)?has_content && !(maint.primaryKey)?contains(";")>
		<#assign primaryKey = maint.primaryKey>
	<#else>
		<#assign primaryKey = "id">
    </#if>
	
	// Formulario de filtrado.
	$('#${primaryKey}_filter_table').rup_autocomplete({
		source : './allIds',
		sourceParam : {label: 'nid', value: '${primaryKey}'},
		menuMaxHeight: 175,
		combobox: true,
		contains: true,
		showDefault: true
	});

	$("#${maint.nameMaint}").rup_table({
		colReorder: {
			fixedColumnsLeft: 1
		},
		colModel: tableColModels,
		primaryKey: "${primaryKey}",
        <#if (maint.filterMaint)?string == "true">
		filter: {
  	  		id: "${maint.nameMaint}_filter_form",
  	  		filterToolbar: "${maint.nameMaint}_filter_toolbar",
  	  		collapsableLayerId: "${maint.nameMaint}_filter_fieldset"
     	},
     	<#else>
     	filter: "noFilter",
     	</#if> 
     	<#if (maint.isMaint)?string == "true">
     		<#if (maint.typeMaint)?string == "DETAIL">
     	formEdit: {
     		titleForm: jQuery.rup.i18nParse(jQuery.rup.i18n.base, "rup_table.edit.editCaption"),
        	detailForm: "#${maint.nameMaint}_detail_div",
        	<#if (maint.detailServerMaint)?string == "true">
        	fillDataMethod: "clientSide",
        	</#if>
		   	<#if (maint.detailServerMaint)?string == "false">
		   	direct: true,
		   	</#if>
        	<#if (maint.clientValidationMaint)?string == "true">
			<#-- Reglas de validaciÃƒÂ³n -->
         	validate: { 
    			rules: {
				<#list gridColumns as columnProperties>
    				"${columnProperties.name}": {
						required: ${columnProperties.requiredEditRules?string}<#if columnProperties.typeEditRules?has_content>,</#if>
						<#switch columnProperties.typeEditRules>
							<#case "number">
							number: true<#if (columnProperties.minValueEditRules)?has_content || (columnProperties.maxValueEditRules)?has_content>,
							min: ${columnProperties.minValueEditRules?string}</#if><#if (columnProperties.maxValueEditRules)?has_content>,
							max: ${columnProperties.maxValueEditRules?string}</#if>
								<#break>	
							<#case "integer">
							integer: true
								<#break>
							<#case "email">
							email: true
								<#break>
							<#case "url">
							url: true
								<#break>
							<#case "date">
							date: true
								<#break>
							<#case "time">
							time: true
								<#break>
							<#default>
								<#break>
						</#switch>	
					}<#if columnProperties_has_next>,</#if>					
				</#list>
				}
		   	}
		   	</#if>
		},
    		</#if>
    		<#if (maint.typeMaint)?string == "INLINE">		
    	inlineEdit: {
    			<#if (maint.clientValidationMaint)?string == "true">
			<#-- Reglas de validaciÃƒÂ³n -->
         	validate: { 
    			rules: {
					<#list gridColumns as columnProperties>
    				"${columnProperties.name}": {
						required: ${columnProperties.requiredEditRules?string}<#if columnProperties.typeEditRules?has_content>,</#if>
						<#switch columnProperties.typeEditRules>
							<#case "number">
								number: true<#if (columnProperties.minValueEditRules)?has_content || (columnProperties.maxValueEditRules)?has_content>,
								min: ${columnProperties.minValueEditRules?string}</#if><#if (columnProperties.maxValueEditRules)?has_content>,
								max: ${columnProperties.maxValueEditRules?string}</#if>
								<#break>	
							<#case "integer">
								integer: true
								<#break>
							<#case "email">
								email: true
								<#break>
							<#case "url">
								url: true
								<#break>
							<#case "date">
								date: true
								<#break>
							<#case "time">
								time: true
								<#break>
							<#default>
								<#break>
						</#switch>	
					}<#if columnProperties_has_next>,</#if>
    				</#list>
				}
    		}
    			</#if>
    	},
    		</#if>
    	</#if>
		<#if (maint.multiSelectMaint)?string == "true">
	    multiSelect: {
       		style: "multi"
   		},
   		<#else>
   		select: {
       		activate: true
   		},
		</#if>
		<#if (maint.searchMaint)?string == "true">
		seeker: {
			activate: true
		},
		</#if>
		<#if (maint.toolBarButtonsMaint)?string == "true">	
		buttons: {
			activate: true
			<#if (maint.isMaint)?string == "false">
			,blackListButtons : ["addButton", "editButton", "cloneButton", "deleteButton"]
			</#if>
			<#if (maint.contextMenuMaint)?string == "false">
			,contextMenu: false
			</#if>
		},
		</#if>
		order: [[${grid.sortPosition + maint.multiSelectMaint?string(1, 0)?number}, "${grid.sortOrder}"]]
	});
});
