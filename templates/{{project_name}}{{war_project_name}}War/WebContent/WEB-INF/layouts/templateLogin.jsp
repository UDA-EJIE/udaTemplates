<!doctype html>

<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/includeTemplate.inc" %>
<%@ taglib prefix="tiles" uri="/WEB-INF/tld/tiles-jsp.tld" %>

<html class="no-js" lang="es">
<head>

	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title><spring:message code="app.title" /></title>
	<meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

	<%-- Estilos RUP --%>
	<%@include file="/WEB-INF/layouts/includes/rup.styles.inc"%>
	<%-- Estilos Aplicacion --%>
	<%@include file="/WEB-INF/layouts/includes/xxx.styles.inc"%>
	
	<script>
		// Habilitar el envío de trazas a PIB.
		window.IS_EJIE = true;
	</script>
</head>
	<body>
		<div class="contenedor">
			<!-- Cabecera -->
			<tiles:insertAttribute name="header" />

			<!-- Idioma -->
			<%-- 		<tiles:insertAttribute name="language" /><br/> --%>

			<!-- Migas de pan -->
			<tiles:insertAttribute name="breadCrumb" />

			<!-- Contenidos -->
			<div id="xxxPruebaWar_content" class="m-0 m-md-3 p-4 clear" >
				<tiles:insertAttribute name="content"/>
			</div>

			<!-- Pie -->
			<tiles:insertAttribute name="footer" />

			<!-- Includes JS -->
			<tiles:insertAttribute name="base-includes" />
			<tiles:insertAttribute name="includes" />
		</div>
	</body>
</html>