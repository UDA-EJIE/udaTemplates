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

<jsp:include page="includes/${maint.nameMaint}FilterForm.jsp"></jsp:include>

<table id="${maint.nameMaint}" class="table table-striped table-bordered" 
	data-url-base="${grid.url}"
	data-filter-form="#${maint.nameMaint}_filter_form" 
	cellspacing="0" width="100%">
        <thead>
            <tr>
            	<#list gridColumns as columnProperties>
	                <th data-col-prop="${columnProperties.columnName}" data-col-sidx="${columnProperties.columnName}" <#if (columnProperties.editType)?string != "text">data-col-type="${columnProperties.editType}"</#if>>${columnProperties.name}</th>
                </#list>
            </tr>
        </thead>
        <tfoot>
          <tr>
          	 <#list gridColumns as columnProperties>	
	              <th>${columnProperties.name}</th>
              </#list>
          </tr>
        </tfoot>
</table>

<jsp:include page="includes/${maint.nameMaint}Edit.jsp"></jsp:include>