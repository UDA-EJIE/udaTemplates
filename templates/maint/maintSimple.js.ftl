<#-- 
 -- Copyright 2013 E.J.I.E., S.A.
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

	$("#${maint.nameMaint}").rup_table({
		
		url: "${grid.url}",
		colNames: [
			<#list gridColumns as columnPropertiesLabel>
			"${columnPropertiesLabel.label}"<#if columnPropertiesLabel_has_next>,</#if>
			</#list>
		],
		colModel: [
			<#list gridColumns as columnProperties>
			{ 	name: "${columnProperties.name}", 
			 	label: "${columnProperties.label}",
				align: "${columnProperties.align}", 
				width: ${columnProperties.width}, 
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
			  	<#if (columnProperties.firstSortOrder)?has_content>
				firstsortorder: "${columnProperties.firstSortOrder}",
				</#if>
				fixed: ${columnProperties.fixed?string}, 
				hidden: ${columnProperties.hidden?string}, 
				resizable: ${columnProperties.resizable?string}, 
				sortable: ${columnProperties.sortable?string}
			}<#if columnProperties_has_next>,</#if>
			</#list>
        ],

        model:"${maint.modelObject}",
        usePlugins:[
			<#if (maint.isMaint)?string == "true">
			<#switch maint.typeMaint>
				<#case "INLINE">
			"inlineEdit",
					<#break>	
				<#case "DETAIL">
			"formEdit",
					<#break>
			</#switch>
        	</#if>
        	"feedback"<#if (maint.toolBarButtonsMaint)?string == "true">,
			"toolbar"</#if><#if (maint.contextMenuMaint)?string == "true">,
        	"contextMenu"</#if><#if (maint.fluidMaint)?string == "true">,
        	"fluid"</#if><#if (maint.filterMaint)?string == "true">,
        	"filter"</#if><#if (maint.searchMaint)?string == "true">,
        	"search"</#if><#if (maint.multiSelectMaint)?string == "true">,
        	"multiselection"</#if><#if (maint.hierarchyMaint)?string == "true">,
         	"jerarquia"</#if>
         	],
        <#if (maint.primaryKey)?has_content>
		primaryKey: "${maint.primaryKey}",
        </#if>
		sortname: "${grid.sortName}",
		sortorder: "${grid.sortOrder}",
		loadOnStartUp: ${grid.loadOnStartUp?string},
        formEdit:{
        	detailForm: "#${maint.nameMaint}_detail_div"<#if (maint.detailServerMaint)?string == "true">,
			fillDataMethod: "clientSide"</#if><#if (maint.clientValidationMaint)?string == "true">,
			<#-- Reglas de validación -->
         	validate:{ 
    			rules:{
					<#list gridColumns as columnProperties>
    				"${columnProperties.name}":{
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
        }
	});
});