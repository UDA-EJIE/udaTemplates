<%--
 -- Copyright 2023 E.J.I.E., S.A.
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
<%@taglib prefix="form" uri="/WEB-INF/tld/x38-form.tld"%>

<!-- Formulario -->
<spring:url value="${grid.url}/<#noparse>${endpoint}</#noparse>" var="url"/>
<form:form modelAttribute="${maint.modelObject?lower_case}" id="${maint.nameMaint}_detail_form" action="<#noparse>${url}</#noparse>" method="<#noparse>${actionType}</#noparse>" enctype="<#noparse>${enctype}</#noparse>">
	<!-- Feedback del formulario de detalle -->
	<div id="${maint.nameMaint}_detail_feedback"></div>
	<!-- Campos del formulario de detalle -->
	<#assign multipkInserted = false>
	<#assign count = 0>
	<#assign closeTagInserted = false>
	<#list gridColumns as columnProperties>
		<#if (columnProperties.primaryKey)?string == "false">
			<#if count % 2 == 0 && closeTagInserted>
	<div class="form-row">
				<#assign closeTagInserted = false>
			</#if>
			<#if (columnProperties.activated)?string == "true">
				<#switch columnProperties.editType>
					<#case "Text">
		<div class="form-groupMaterial col-sm">
			<form:input path="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
						<#break>	
					<#case "Textarea">
		<div class="form-groupMaterial col-sm">
			<form:textarea path="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
					<#break>	
					<#case "Checkbox">
		<div class="checkbox-material col-sm">
			<form:checkbox path="${columnProperties.name}" id="${columnProperties.name}_detail_table" value=""/>
					<#break>
					<#case "Datepicker">
		<div class="form-groupMaterial col-sm">
			<form:input path="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
					<#break>	
					<#case "Password">
		<div class="form-groupMaterial col-sm">
			<form:input path="${columnProperties.name}" id="${columnProperties.name}_detail_table" type="password"/>
					<#break>		
					<#default>
		<div class="form-groupMaterial col-sm">
			<form:input path="${columnProperties.name}" id="${columnProperties.name}_detail_table"/>
						<#break>	
	  			</#switch>
			<label for="${columnProperties.name}_detail_table">
				<spring:message code="${columnProperties.label}"/>
			</label>
		</div>
			</#if>
			<#if (count + 1) == gridColumns?size>
	</div>
				<#assign closeTagInserted = true>
			<#elseif count % 2 == 0>
	</div>
	<div class="form-row">
				<#assign closeTagInserted = false>
			</#if>
			<#assign count = count + 1>
		<#else>
			<#if (multipk)?string == "false">
	<c:if test="<#noparse>${not empty pkValue}</#noparse>">
		<form:hidden path="${columnProperties.name}" value="<#noparse>${pkValue.id}</#noparse>" id="${columnProperties.name}_detail_table" />
	</c:if>
			</#if>
			<#if (multipk)?string == "true" && (multipkInserted)?string == "false">
	<c:choose>
		<c:when test="<#noparse>${actionType.equals('POST')}</#noparse>">
			<div class="form-row">
				<#assign primaryKeys = primaryKey?split(";")>
				<#list primaryKeys as key>
				<div class="form-groupMaterial col-sm">
					<form:input path="${key}" id="${key}_multipk_detail_table"/>
					<label for="${key}_multipk_detail_table">
						<spring:message code="${key}"/>
					</label>
				</div>
				</#list>
			</div>
		</c:when>
		<c:when test="<#noparse>${not empty pkValue}</#noparse>">
			<form:hidden path="id" value="<#noparse>${pkValue.id}</#noparse>" id="id_multipk_detail_table" />
		</c:when>
	</c:choose>
				<#assign multipkInserted = true>
			</#if>
			<#if count % 2 == 0>
	<div class="form-row">
			</#if>
			<#assign count = count + 1>
		</#if>
	</#list>
	<!-- Fin campos del formulario de detalle -->
</form:form>
