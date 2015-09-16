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

<h2 style="float:none;">ERROR</h2> <br>
<a href="<%= request.getContextPath() %>/"><spring:message code="error.volver" /></a>

<h3>Name: </h3><#noparse>${(empty param)? exception_name : param.exception_name}</#noparse><br>
<h3>Message: </h3><#noparse>${(empty param)? exception_message : param.exception_message}</#noparse><br>
<h3>Trace: </h3><#noparse>${(empty param)? exception_trace : param.exception_trace}</#noparse><br>