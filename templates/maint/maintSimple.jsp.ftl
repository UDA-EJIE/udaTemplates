	<%@include file="/WEB-INF/views/includes/includeTemplate.inc"%>
	<h1>${maint.getTitleMaint()}</h1>
	<div id="error" style="display:none"></div>
	<div id="${maint.getNameMaint()}">
		<#if maint.getToolbarMaint() != "">
		<!-- Botonera de gestión de la tabla -->
		<div id="${maint.getToolbarMaint()}" class="botonera"></div>
		</#if>
		<div id="contenido" style="margin-top:0.5em;margin-bottom:0.5em;width:${grid.getWidth()}px;">
			<#if maint.getSearchMaint() != "" && maint.getSearchMaint() != "searchForm">
			<form id="${maint.getSearchMaint()}">
			<!-- Introducir código del formulario de bÃºsqueda -->
			<#else>
			<form id="searchForm">
				<div  class="formulario_legend" id="titleSearch_${maint.getNameMaint()}"><spring:message code="searchCriteria" />:</div>
				<fieldset style="border:1px solid #DADADA;" id="FIELDSET_SEARCH_${maint.getNameMaint()}">
					<div class="formulario_columna_cnt"><#foreach columnProperties in gridColumns>${columnProperties.getColumnSearchForm()}</#foreach>
					</div>
					<!-- Botones -->	
				</fieldset>
			</#if>
			</form>
		</div>

		<div id="RUP_GRID_${maint.getNameMaint()}">
			<#if maint.getFeedbackMaint() != "">
			<!-- Barra de mensajes -->
			<div id="${maint.getFeedbackMaint()}"></div>
			</#if>
			<!-- Tabla -->
			<table id="GRID_${maint.getNameMaint()}" cellpadding="0" cellspacing="0"></table>
			<!-- Barra de paginación -->
			<div id="${grid.getPagerName()}" style="text-align:center;"></div>
		</div>
	</div>