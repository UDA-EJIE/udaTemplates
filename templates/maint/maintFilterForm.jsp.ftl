<%@include file="/WEB-INF/includeTemplate.inc"%>
<form id="${maint.nameMaint}_filter_form">						<!-- Formulario de filtrado -->
			<div id="${maint.nameMaint}_filter_toolbar" class="formulario_legend"></div>	<!-- Barra de herramientas del formulario de filtrado -->
			<fieldset id="${maint.nameMaint}_filter_fieldset" class="rup-table-filter-fieldset">
				<div class="form-row">
					<!-- Campos del formulario de filtrado -->
					<#list gridColumns as columnProperties>
					<#if (columnProperties.activated)?string == "true">
					<div class="form-group col-sm">
						<label for="${columnProperties.name}_filter_table" class="formulario_linea_label"><spring:message code="${columnProperties.label}"/></label>
						<#switch columnProperties.editType>
						<#case "Text">
						<input type="text" name="${columnProperties.name}" class="formulario_linea_input form-control" id="${columnProperties.name}_filter_table"/>
							<#break>	
						<#case "Textarea">
						<textarea name="${columnProperties.name}" class="formulario_linea_input form-control" id="${columnProperties.name}_filter_table"></textarea>							
							<#break>	
						<#case "Checkbox">
						<input type="checkbox" name="${columnProperties.name}" class="formulario_linea_input form-control" id="${columnProperties.name}_filter_table"/>							
							<#break>	
						<#case "Select">
						<select name="${columnProperties.name}" class="combo" id="${columnProperties.name}_filter_table"></select>							
							<#break>	
						<#case "Autocomplete">
						<input type="text" name="${columnProperties.name}" class="autocomplete" id="${columnProperties.name}_filter_table"/>
							<#break>	
						<#case "Datepicker">
						<input type="text" name="${columnProperties.name}" class="datepicker" id="${columnProperties.name}_filter_table"/>
							<#break>	
						<#default>
						<input type="text" name="${columnProperties.name}" class="formulario_linea_input form-control" id="${columnProperties.name}_filter_table"/>
							<#break>	
					  	</#switch>
					  </div>
					</#if>
					</#list>
					<!-- Fin campos del formulario de filtrado -->
				</div>
				<!-- Botonera del formulario de filtrado -->
				<div id="${maint.nameMaint}_filter_buttonSet" class="right_buttons">
					<!-- Botón de limpiar -->
					<button id="${maint.nameMaint}_filter_cleanButton" type="button" class="btn btn-primary rup-limpiar">
						<i class="fa fa-eraser"></i>
						<span><spring:message code="clear" /></span>
					</button>
					<!-- Botón de filtrado -->
					<button id="${maint.nameMaint}_filter_filterButton" type="button" class="btn rup-filtrar btn-primary" >
						<i class="fa fa-filter"></i>
						<span><spring:message code="filter" /></span>
					</button>
				</div>
			</fieldset>
</form>