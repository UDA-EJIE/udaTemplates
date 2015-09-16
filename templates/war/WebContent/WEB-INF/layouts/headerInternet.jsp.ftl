<#-- 
 -- Copyright 2011 E.J.I.E., S.A.
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

<div id="cabecera" class="cabecera">

<#if entornoEjie == "true">
	<span style="font-size: 2em;color: #000000;">CABECERA PORTAL</span>
	<a href="<%= request.getContextPath()%>/" style="float: right;margin-top:-2em;">
		<img src="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/images/euskadi_net.gif" alt="Euskadi Net"/>
	</a>
<#else>
	<span style="font-size: 2em;color: #000000;">CABECERA PORTAL</span>
	<a href="<%= request.getContextPath()%>/" style="float: right;margin-top:-2em;">
		<img src="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/images/uda_logo.png" alt="Uda"/>
	</a>
</#if>
</div>
