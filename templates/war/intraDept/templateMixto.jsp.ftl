<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ include file="/WEB-INF/views/includes/includeTemplate.inc" %>
<%@ taglib prefix="tiles" uri="/WEB-INF/tld/tiles-jsp.tld" %>

<html>
<head>
	<title>Uda</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=8" />
	
	<!-- BASE (sub-productos para patrones) -->
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/ui.jqgrid.css" rel="stylesheet" type="text/css" />
	
	<!-- jQuery UI (custom-theme) -->
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/custom-theme/jquery-ui-1.8.13.custom.css" rel="stylesheet" type="text/css" />
	
	<!-- Patrones (basic-theme) -->
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.base-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.autocomplete-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.breadCrumb-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.combo-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.date-1.0.0.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.feedback-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.grid-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.lang-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.maint-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.menu-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.messages-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.tabs-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.time-1.0.0.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.toolbar-1.0.1.css" rel="stylesheet" type="text/css" />
	<link href="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/theme.rup.tooltip-1.0.0.css" rel="stylesheet" type="text/css" />
	
	<!-- Aplicacion -->
	<link href="<#noparse>${staticsUrl}</#noparse>/${codapp}/styles/${codapp}.css" rel="stylesheet" type="text/css" />
</head>	
<body>
	<div class="contenedor">	
		<!-- Cabecera -->
		<tiles:insertAttribute name="header" />		
		
		<!-- Idioma -->
			<tiles:insertAttribute name="language" />
		<br/>
		<!-- Menu -->
		<tiles:insertAttribute name="menu" />
		<tiles:insertAttribute name="menuMixto" />
			
		<div id="contentMV" style="margin-left: 20em;">
			<!-- Migas de pan -->
			<tiles:insertAttribute name="breadCrumb" /><br/>
			
			<!-- Contenidos -->
			<tiles:insertAttribute name="content" />
		</div>
		
		<!-- Pie -->
		<tiles:insertAttribute name="footer" />	
		
		<!-- Includes JS -->
		<tiles:insertAttribute name="base-includes" />
		<tiles:insertAttribute name="includes" />
	</div>
</body>
</html>