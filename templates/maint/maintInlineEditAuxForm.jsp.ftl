<%--
 -- Copyright 2022 E.J.I.E., S.A.
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
<spring:url value="<#noparse>${endpoint}</#noparse>" var="url"/>
<form:form modelAttribute="<#noparse>${entity}</#noparse>" id="<#noparse>${tableID}</#noparse>_detail_inlineEdit_aux_form" class="d-none" action="<#noparse>${url}</#noparse>" method="<#noparse>${actionType}</#noparse>" enctype="<#noparse>${enctype}</#noparse>">
	<!-- Campos del formulario de detalle -->
	<#assign count = 0>
	<#assign closeTagInserted = false>
	<#list gridColumns as columnProperties>
		<#if (columnProperties.primaryKey)?string == "false">
			<#if (columnProperties.activated)?string == "true">
				<#switch columnProperties.editType>
					<#case "Text">
	<form:input path="${columnProperties.name}" id="${columnProperties.name}_inlineEdit_aux_form"/>
						<#break>	
					<#case "Textarea">
	<form:textarea path="${columnProperties.name}" id="${columnProperties.name}_inlineEdit_aux_form"/>
					<#break>	
					<#case "Checkbox">
	<form:checkbox path="${columnProperties.name}" id="${columnProperties.name}_inlineEdit_aux_form" value=""/>
					<#break>
					<#case "Datepicker">
	<form:input path="${columnProperties.name}" id="${columnProperties.name}_inlineEdit_aux_form"/>
					<#break>	
					<#case "Password">
	<form:input path="${columnProperties.name}" id="${columnProperties.name}_inlineEdit_aux_form" type="password"/>
					<#break>		
					<#default>
	<form:input path="${columnProperties.name}" id="${columnProperties.name}_inlineEdit_aux_form"/>
						<#break>	
	  			</#switch>
			</#if>
		<#else>
	<c:if test="<#noparse>${not empty pkValue}</#noparse>">
		<form:hidden path="id" value="<#noparse>${pkValue.id}</#noparse>" id="${columnProperties.name}_detail_table" />
	</c:if>
			<#assign count = count + 1>
		</#if>
	</#list>
	<!-- Fin campos del formulario de detalle -->
</form:form>
