<#-- 
 -- Copyright 2019 E.J.I.E., S.A.
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
		
        <#if (maint.primaryKey)?has_content>
		primaryKey: "${maint.primaryKey}",
        </#if>
		filter:{
  	  		id:"${maint.nameMaint}_filter_form",
  	  		filterToolbar:"${maint.nameMaint}_filter_toolbar",
  	  		collapsableLayerId:"${maint.nameMaint}_filter_fieldset"
     	},
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
    					}
    					<#if columnProperties_has_next>,</#if>
    				</#list>
					}
    		   	},
			   	titleForm: jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_table.edit.editCaption')  
    		}
    		</#if>
    		,colReorder: {
				fixedColumnsLeft: 1
			}
    		<#if (maint.multiSelectMaint)?string == "true">
    	    ,multiSelect: {
           		style: 'multi'
       		}
       		<#else>
       		,select: {
           		activate: true
       		}
    		</#if>
    		<#if (maint.searchMaint)?string == "true">
    		,seeker: {
    			activate: true
			}
			</#if>
			<#if (maint.toolBarButtonsMaint)?string == "true">	
			,buttons: {
				activate: true
			}
			</#if>	
	});
});