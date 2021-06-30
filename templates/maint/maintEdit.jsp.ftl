<%--
 -- Copyright 2021 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la "Licencia");
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
 -- el programa distribuido con arreglo a la Licencia se distribuye "TAL CUAL",
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 --%>

<%@include file="/WEB-INF/includeTemplate.inc"%>

<#if (maint.isMaint)?string == "true" && (maint.typeMaint)?string == "DETAIL">
<!-- Formulario de detalle -->
<div id="${maint.nameMaint}_detail_div" class="rup-table-formEdit-detail d-none">
	<!-- Barra de navegación del detalle -->
	<div id="${maint.nameMaint}_detail_navigation" class="row no-gutters"></div>
	<!-- Separador -->
	<hr class="m-1">
	<div id="${maint.nameMaint}_detail_form_container" class="dialog-content-material">
		<!-- El formulario será insertado mediante una llamada Ajax -->
	</div>
	<!-- Botonera del formulario de detalle -->
	<div class="rup-table-buttonpanel-material">
		<div class="text-right">
			<!-- Botón cancelar -->
			<button id="${maint.nameMaint}_detail_button_cancel" type="button">
				<spring:message code="cancel"/>
			</button>
			<!-- Botón guardar -->
			<button id="${maint.nameMaint}_detail_button_save" type="button">
				<spring:message code="save"/>
			</button>
			<#if (maint.detailMaintButtons)?string == "SAVE_REPEAT">
			<!-- Botón guardar y continuar -->
			<button id="${maint.nameMaint}_detail_button_save_repeat" type="button">
				<spring:message code="saveAndContinue"/>
			</button>
			</#if>
		</div>
	</div>	
</div>
</#if>
