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

<header>
	  <div id="cabecera" class="cabecera" >

<#if entornoEjie == "true">
	
	  	<div style="float: left;" >
	  		<img src="<#noparse>${staticsUrl}</#noparse>/${codapp}/images/dept_logo_<#noparse>${cookie[localeResolver.cookieName].value}</#noparse>.gif"/>
	  	</div>
	  	<a href="#" style="float: right;">
	  		<img src="<#noparse>${staticsUrl}</#noparse>/${codapp}/images/euskadieus_logo.gif" alt="Euskadi Eus"/>
	  	</a>
	  
<#else>
	  	<div style="float: left;" >
	  		CABECERA PORTAL
	  	</div>
	  	<a href="#" style="float: right;">
	  		<img src="<#noparse>${staticsUrl}</#noparse>/rup/css/images/uda_logo.png" alt="Euskadi Eus"/>
	  	</a>

</#if>
	</div>
</header>
