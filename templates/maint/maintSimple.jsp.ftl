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

<%@include file="/WEB-INF/includeTemplate.inc"%>

<h2 class="title">${maint.titleMaint}</h2>
<#if (maint.filterMaint)?string == "true">
<jsp:include page="includes/${maint.nameMaint}FilterForm.jsp"></jsp:include>
<#else>
<!-- Formulario necesario para garantizar el correcto funcionamiento con Hdiv cuando filter = 'noFilter' -->
<spring:url value="${grid.url}/filter" var="noFilterURL"/>
<form:form modelAttribute="${maint.modelObject?lower_case}" id="${maint.nameMaint}_filter_form" class="d-none" action="<#noparse>${noFilterURL}</#noparse>" method="POST"/>
</#if>

<#if (maint.searchMaint)?string == "true">
<!-- Formulario necesario para garantizar el correcto funcionamiento del seeker con Hdiv -->
<spring:url value="${grid.url}/search" var="seekerURL"/>
<form:form modelAttribute="${maint.modelObject?lower_case}" id="${maint.nameMaint}_seeker_form" class="d-none" action="<#noparse>${seekerURL}</#noparse>" method="POST"/>
	<#list gridColumns as columnProperties>
	<#if ((maint.primaryKey)?has_content && !(maint.primaryKey)?contains(columnProperties.name)) && ((columnProperties.primaryKey)?string == "false")>
	<form:input path="${columnProperties.name}" id="${columnProperties.name}_${maint.nameMaint}_seeker_form" />
	</#if>
	</#list>
</form:form>
</#if>

<table id="${maint.nameMaint}" class="tableFit table-striped table-bordered table-material" 
	data-url-base="${grid.url}"
	data-filter-form="#${maint.nameMaint}_filter_form">
    <thead>
        <tr>
        	<#list gridColumns as columnProperties>
        	<#if ((maint.primaryKey)?has_content && !(maint.primaryKey)?contains(columnProperties.name)) && ((columnProperties.primaryKey)?string == "false" || (maint.typeMaint)?string != "INLINE")>
			<th data-col-prop="${columnProperties.name}" data-col-sidx="${columnProperties.name?replace(".","")?upper_case}"<#if (columnProperties.editType)?string != "text"> data-col-type="${columnProperties.editType}"</#if>>
				<spring:message code="${columnProperties.name}"/>
			</th>
			</#if>
            </#list>
        </tr>
    </thead>
</table>
<#if (maint.isMaint)?string == "true" && (maint.typeMaint)?string == "DETAIL">
<jsp:include page="includes/${maint.nameMaint}Edit.jsp"></jsp:include>
</#if>