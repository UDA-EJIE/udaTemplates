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
<%@include file="/WEB-INF/includeTemplate.inc"%>

<!-- Formulario de filtrado -->
<form:form modelAttribute="${maint.modelObject?lower_case}" id="${maint.nameMaint}_filter_form">
	<!-- Barra de herramientas del formulario de filtrado -->
	<div id="${maint.nameMaint}_filter_toolbar" class="formulario_legend"></div>
	<fieldset id="${maint.nameMaint}_filter_fieldset" class="rup-table-filter-fieldset">
		<div class="form-row">
			<!-- Campos del formulario de filtrado -->
			<#list gridColumns as columnProperties>
				<#if (columnProperties.activated)?string == "true">
					<div class="form-groupMaterial col-sm">
						<#switch columnProperties.editType>
							<#case "Text">
								<form:input path="${columnProperties.name}" id="${columnProperties.name}_filter_table"/>
								<#break>	
							<#case "Textarea">
								<form:textarea path="${columnProperties.name}" id="${columnProperties.name}_filter_table"/>
								<#break>	
							<#case "Checkbox">
								<form:checkbox path="${columnProperties.name}" id="${columnProperties.name}_filter_table"/>							
								<#break>	
							<#case "Select">
								<form:select path="${columnProperties.name}" id="${columnProperties.name}_filter_table"/>
								<#break>	
							<#case "Autocomplete">
								<form:input path="${columnProperties.name}" id="${columnProperties.name}_filter_table"/>
								<#break>	
							<#case "Datepicker">
								<form:input path="${columnProperties.name}" id="${columnProperties.name}_filter_table"/>
								<#break>	
							<#default>
								<form:input path="${columnProperties.name}" id="${columnProperties.name}_filter_table"/>
								<#break>	
					  	</#switch>
						<label for="${columnProperties.name}_filter_table"><spring:message code="${columnProperties.label}"/></label>
					</div>
				</#if>
			</#list>
			<!-- Fin campos del formulario de filtrado -->
		</div>
		<!-- Botonera del formulario de filtrado -->
		<div id="${maint.nameMaint}_filter_buttonSet" class="text-right">
			<!-- Botón de limpiar -->
			<button id="${maint.nameMaint}_filter_cleanButton" type="button" class="btn-material btn-material-primary-low-emphasis mr-2">
				<i class="mdi mdi-eraser"></i>
				<span><spring:message code="clear" /></span>
			</button>
			<!-- Botón de filtrado -->
			<button id="${maint.nameMaint}_filter_filterButton" type="button" class="btn-material btn-material-primary-low-emphasis" >
				<i class="mdi mdi-filter"></i>
				<span><spring:message code="filter" /></span>
			</button>
		</div>
	</fieldset>
</form:form>