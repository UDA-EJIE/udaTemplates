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
<%@include file="/WEB-INF/includeTemplate.inc"%>
<h2>${maint.titleMaint}</h2>

	<div id="${maint.nameMaint}_div" class="rup-table-container">
	
	<div id="${maint.nameMaint}_feedback"></div>						<!-- Feedback de la tabla --> 
	<#if (maint.toolBarButtonsMaint)?string == "true">
	<div id="${maint.nameMaint}_toolbar"></div>							<!-- Botonera de la tabla -->
	</#if>	
	<#if (maint.filterMaint)?string == "true">
	<div id="${maint.nameMaint}_filter_div" class="rup-table-filter">	<!-- Capa contenedora del formulario de filtrado -->
			<form id="${maint.nameMaint}_filter_form">						<!-- Formulario de filtrado -->
			<div id="${maint.nameMaint}_filter_toolbar" class="formulario_legend"></div>	<!-- Barra de herramientas del formulario de filtrado -->
			<fieldset id="${maint.nameMaint}_filter_fieldset" class="rup-table-filter-fieldset">
				<div class="formulario_columna_cnt">
					<!-- Campos del formulario de filtrado -->
					<#list gridColumns as columnProperties>
					<#if (columnProperties.activated)?string == "true">
					<div class="formulario_linea_izda_float">
						<label for="${columnProperties.name}_filter_table" class="formulario_linea_label"><spring:message code="${columnProperties.label}"/>:</label>
						<#switch columnProperties.editType>
						<#case "Text">
						<input type="text" name="${columnProperties.name}" class="formulario_linea_input" id="${columnProperties.name}_filter_table"/>
							<#break>	
						<#case "Textarea">
						<textarea name="${columnProperties.name}" class="formulario_linea_input" id="${columnProperties.name}_filter_table"></textarea>							
							<#break>	
						<#case "Checkbox">
						<input type="checkbox" name="${columnProperties.name}" class="formulario_linea_input" id="${columnProperties.name}_filter_table"/>							
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
						<input type="text" name="${columnProperties.name}" class="formulario_linea_input" id="${columnProperties.name}_filter_table"/>
							<#break>	
					  	</#switch>
					</div>
					</#if>
					</#list>
					<!-- Fin campos del formulario de filtrado -->
				</div>
				<!-- Botonera del formulario de filtrado -->
				<div id="${maint.nameMaint}_filter_buttonSet" class="right_buttons">
					<!-- Botón de filtrado -->
					<input id="${maint.nameMaint}_filter_filterButton" type="button" class="ui-button ui-widget ui-state-default ui-corner-all" value='<spring:message code="filter" />' />
					<!-- Enlace de limpiar -->
					<a id="${maint.nameMaint}_filter_cleanLink" href="javascript:void(0)" class="rup-enlaceCancelar"><spring:message code="clear" /></a>
				</div>
			</fieldset>
		</form>
	</div>
	</#if>	

	<div id="${maint.nameMaint}_grid_div">
		<!-- Tabla -->
		<table id="${maint.nameMaint}"></table>
		<!-- Barra de paginación -->
		<div id="${maint.nameMaint}_pager"></div>
	</div>
</div>	

<#if (maint.isMaint)?string == "true" && (maint.typeMaint)?string == "DETAIL">
<!-- Formulario de detalle -->
<div id="${maint.nameMaint}_detail_div" class="rup-table-formEdit-detail">
	<div id ="${maint.nameMaint}_detail_navigation"></div>			<!-- Barra de navegación del detalle -->
	<div class="ui-dialog-content ui-widget-content" >
		<form id="${maint.nameMaint}_detail_form">					<!-- Formulario -->
			<div id ="${maint.nameMaint}_detail_feedback"></div>		<!-- Feedback del formulario de detalle -->
			<div class="floating_left_pad_right">
			
				<!-- Campos del formulario de detalle -->
				<#list gridColumns as columnProperties>
				<#if (columnProperties.activated)?string == "true">
				<div class="floating_left_pad_right one-column">
					<label for="${columnProperties.name}_detail_table"><spring:message code="${columnProperties.label}"/>:</label>
					<#switch columnProperties.editType>
					<#case "Text">
					<input type="text" name="${columnProperties.name}" class="formulario_linea_input" id="${columnProperties.name}_detail_table"/>
						<#break>	
					<#case "Textarea">
					<textarea name="${columnProperties.name}" class="formulario_linea_input" id="${columnProperties.name}_detail_table"></textarea>							
						<#break>	
					<#case "Checkbox">
					<input type="checkbox" name="${columnProperties.name}" class="formulario_linea_input" id="${columnProperties.name}_detail_table"/>							
						<#break>	
					<#case "Select">
					<select name="${columnProperties.name}" class="combo" id="${columnProperties.name}_detail_table"></select>							
						<#break>	
					<#case "Autocomplete">
					<input type="text" name="${columnProperties.name}" class="autocomplete" id="${columnProperties.name}_detail_table"/>
						<#break>	
					<#case "Datepicker">
					<input type="text" name="${columnProperties.name}" class="datepicker" id="${columnProperties.name}_detail_table"/>
						<#break>	
					<#default>
					<input type="text" name="${columnProperties.name}" class="formulario_linea_input" id="${columnProperties.name}_detail_table"/>
						<#break>	
				  	</#switch>
				</div>
				</#if>
				</#list>
				<!-- Fin campos del formulario de detalle -->
				
			</div>
		</form>
	</div>
	<!-- Botonera del formulario de detalle -->
	<div class="rup-table-buttonpane ui-widget-content ui-helper-clearfix">
		<div class="ui-dialog-buttonset">
			<!-- Botón Guardar -->
			<button id="${maint.nameMaint}_detail_button_save" type="button">
				<spring:message code="save" />
			</button>
			<#if (maint.detailMaintButtons)?string == "SAVE_REPEAT">
			<!-- Botón Guardar y continuar -->
			<button id="${maint.nameMaint}_detail_button_save_repeat" type="button">
				<spring:message code="saveAndContinue" />
			</button>
			</#if>
			<!-- Enlace cancelar -->
			<a href="javascript:void(0)" id="${maint.nameMaint}_detail_link_cancel"
				class="rup-enlaceCancelar"><spring:message code="cancel" /></a>
		</div>
	</div>
</div>
</#if>
