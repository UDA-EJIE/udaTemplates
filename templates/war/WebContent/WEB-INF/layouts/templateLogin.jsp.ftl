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

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ include file="/WEB-INF/includeTemplate.inc" %>
<%@ taglib prefix="tiles" uri="/WEB-INF/tld/tiles-jsp.tld" %>

<html>
<head>
	<%@include file="/WEB-INF/includeTemplate.inc"%>
	<title><spring:message code="app.title" /></title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	
	<%-- Estilos RUP sin minimizar (DESARROLLO) --%>
<%-- <%@include file="/WEB-INF/layouts/includes/rup.styles.inc"%> --%>
	<%-- Estilos RUP sin minimizar (PRODUCCION) --%>
	<%@include file="/WEB-INF/layouts/includes/rup.styles.min.inc" %>
	<%-- Estilos Aplicacion --%>
	<%@include file="/WEB-INF/layouts/includes/${codapp}.styles.inc"%>
	<%@include file="/WEB-INF/layouts/includes/mockLoginPage.styles.inc"%>
</head>	
<body>
	<div class="contenedor">	
		<!-- Cabecera -->
		<tiles:insertAttribute name="header" />

		<!-- Idioma -->
		<tiles:insertAttribute name="language" />
		
		<!-- Migas de pan -->
		<tiles:insertAttribute name="breadCrumb" />
		
		<!-- Contenidos -->
		<tiles:insertAttribute name="content"/>
		
		<!-- Pie -->
		<tiles:insertAttribute name="footer" />
		
		<!-- Includes JS -->
		<tiles:insertAttribute name="base-includes" />
		<tiles:insertAttribute name="includes" />
	</div>
</body>
</html>