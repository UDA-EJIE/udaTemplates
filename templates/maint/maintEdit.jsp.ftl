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

<#if (maint.isMaint)?string == "true" && (maint.typeMaint)?string == "DETAIL">
<!-- Formulario de detalle -->
<div id="${maint.nameMaint}_detail_div" class="rup-table-formEdit-detail">
	<!-- Barra de navegación del detalle -->
	<div id ="${maint.nameMaint}_detail_navigation" class="row no-gutters"></div>
	<!-- Separador -->
	<hr class="m-1">
	<div class="dialog-content-material">
		<!-- Formulario -->
		<form id="${maint.nameMaint}_detail_form">
			<!-- Feedback del formulario de detalle -->
			<div id ="${maint.nameMaint}_detail_feedback"></div>
			<div class="form-row">	
				<!-- Campos del formulario de detalle -->
				<#list gridColumns as columnProperties>
				<#if (columnProperties.activated)?string == "true">
				<div class="form-row">
					<#switch columnProperties.editType>
					<#case "Text">
						<div class="form-groupMaterial col-sm">
							<input type="text" name="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
						<#break>	
					<#case "Textarea">
						<div class="form-groupMaterial col-sm">
							<textarea name="${columnProperties.name}" id="${columnProperties.name}_detail_table"></textarea>							
						<#break>	
					<#case "Checkbox">
						<div class="col-sm checkbox-material">
							<input type="checkbox" name="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>							
						<#break>	
					<#case "Radio">
						<div class="col-sm radio-material">
							<input type="radio" name="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>							
						<#break>	
					<#case "Select">
						<div class="form-groupMaterial col-sm">
							<select name="${columnProperties.name}" id="${columnProperties.name}_detail_table"></select>							
						<#break>	
					<#case "Autocomplete">
						<div class="form-groupMaterial col-sm">
							<input type="text" name="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
						<#break>	
					<#case "Datepicker">
						<div class="form-groupMaterial col-sm">
							<input type="text" name="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
						<#break>	
					<#default>
						<div class="form-groupMaterial col-sm">
							<input type="text" name="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
						<#break>	
				  	</#switch>
					<label for="${columnProperties.name}_detail_table"><spring:message code="${columnProperties.label}"/></label>
					</div>
				</div>
				</#if>
				</#list>
				<!-- Fin campos del formulario de detalle -->
			</div>
		</form>
	</div>
	<!-- Botonera del formulario de detalle -->
	<div class="rup-table-buttonpanel-material">
		<div class="text-right">
			<!-- Botón cancelar -->
			<button id="${maint.nameMaint}_detail_button_cancel" class="btn-material btn-material-sm btn-material-primary-low-emphasis" type="button">
				<spring:message code="cancel" />
			</button>
			<!-- Botón guardar -->
			<button id="${maint.nameMaint}_detail_button_save" class="btn-material btn-material-sm btn-material-primary-high-emphasis" type="button">
				<spring:message code="save" />
			</button>
			<#if (maint.detailMaintButtons)?string == "SAVE_REPEAT">
			<!-- Botón guardar y continuar -->
			<button id="${maint.nameMaint}_detail_button_save_repeat" class="btn-material btn-material-sm btn-material-primary-high-emphasis" type="button">
				<spring:message code="saveAndContinue" />
			</button>
			</#if>
		</div>
	</div>	
</div>
</#if>
