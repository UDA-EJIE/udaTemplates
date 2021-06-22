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

<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="spring" uri="/WEB-INF/tld/spring.tld"%>
<%@taglib prefix="form" uri="/WEB-INF/tld/spring-form.tld"%>

<!-- Formulario -->
<c:set value="<#noparse>${actionType == 'POST' ? 'add': 'edit'}</#noparse>" var="endpoint" />
<spring:url value="${grid.url}/<#noparse>${endpoint}</#noparse>" var="url"/>
<form:form modelAttribute="${maint.modelObject?lower_case}" id="${maint.nameMaint}_detail_form" action="<#noparse>${url}</#noparse>" method="<#noparse>${actionType}</#noparse>">
	<!-- Feedback del formulario de detalle -->
	<div id="${maint.nameMaint}_detail_feedback"></div>
	<c:if test="<#noparse>${not empty fixedMessage}</#noparse>">
		<p><#noparse>${fixedMessage}</#noparse></p>
	</c:if>
	<!-- Campos del formulario de detalle -->
	<#list gridColumns as columnProperties>
	<#if (columnProperties.activated)?string == "true">
		<#switch columnProperties.editType>
		<#case "Text">
	<div class="form-groupMaterial col">
		<form:input path="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
			<#break>	
		<#case "Textarea">
	<div class="form-groupMaterial col">
		<form:textarea path="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
			<#break>	
		<#case "Checkbox">
	<div class="checkbox-material col">
		<form:checkbox path="${columnProperties.name}" id="${columnProperties.name}_detail_table" value=""/>
			<#break>
		<#case "Datepicker">
	<div class="form-groupMaterial col">
		<form:input path="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
			<#break>	
		<#case "Password">
	<div class="form-groupMaterial col">
		<form:input path="${columnProperties.name}" id="${columnProperties.name}_detail_table" type="password"/>
			<#break>		
		<#default>
	<div class="form-groupMaterial col">
		<form:input path="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
			<#break>	
	  	</#switch>
		<label for="${columnProperties.name}_detail_table">
			<spring:message code="${columnProperties.label}"/>
		</label>
	</div>
	</#if>
	</#list>
	<!-- Fin campos del formulario de detalle -->
</form:form>
