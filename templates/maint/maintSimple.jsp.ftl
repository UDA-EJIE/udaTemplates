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

<h2>${maint.titleMaint}</h2>
<#if (maint.filterMaint)?string == "true">
<jsp:include page="includes/${maint.nameMaint}FilterForm.jsp"></jsp:include>
</#if>

<table id="${maint.nameMaint}" class="tableFit table-striped table-bordered table-material" 
	data-url-base="${grid.url}"
	data-filter-form="#${maint.nameMaint}_filter_form">
    <thead>
        <tr>
        	<#list gridColumns as columnProperties>
                <th data-col-prop="${columnProperties.name}" data-col-sidx="${columnProperties.name?replace(".","")?upper_case}" 
                	<#if (columnProperties.editType)?string != "text">
                		data-col-type="${columnProperties.editType}"
                	</#if>>
                	${columnProperties.name}
                </th>
            </#list>
        </tr>
    </thead>
</table>
<#if (maint.isMaint)?string == "true">
<jsp:include page="includes/${maint.nameMaint}Edit.jsp"></jsp:include>
</#if>