<#-- 
 -- Copyright 2012 E.J.I.E., S.A.
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
	<h1>${maint.getTitleMaint()}</h1>
	<div id="error" style="display:none"></div>
	<div id="${maint.getNameMaint()}">
		<#if maint.getToolbarMaint() != "">
		<!-- Botonera de gestiónn de la tabla -->
		<div id="${maint.getToolbarMaint()}" class="botonera"></div>
		</#if>
		<div id="contenido" style="margin-top:0.5em;margin-bottom:0.5em;width:${grid.getWidth()}px;">
			<#if maint.getSearchMaint() != "" && maint.getSearchMaint() != "searchForm">
			<form id="${maint.getSearchMaint()}">
			<!-- Introducir código del formulario de búsqueda -->
			<#else>
			<form id="searchForm">
				<div  class="formulario_legend" id="titleSearch_${maint.getNameMaint()}"><spring:message code="searchCriteria" />:</div>
				<fieldset style="border:1px solid #DADADA;" id="FIELDSET_SEARCH_${maint.getNameMaint()}">
					<div class="formulario_columna_cnt"><#foreach columnProperties in gridColumns>${columnProperties.getColumnSearchForm()}</#foreach>
					</div>
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
			<!-- Barra de paginacion -->
			<div id="${grid.getPagerName()}" style="text-align:center;"></div>
		</div>
	</div>