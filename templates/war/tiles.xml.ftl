<?xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE tiles-definitions PUBLIC
       "-//Apache Software Foundation//DTD Tiles Configuration 2.0//EN"
       "http://tiles.apache.org/dtds/tiles-config_2_1.dtd">
       	
       	
<tiles-definitions>

  	<!-- ****************************** -->
  	<!--          PLANTILLAS            -->
  	<!-- ****************************** -->
	<definition name="template" template="/WEB-INF/layouts/template.jsp">	
		<put-attribute name="header" value="/WEB-INF/layouts/header.jsp" />
		<put-attribute name="language" value="/WEB-INF/layouts/language.jsp" />
		<put-attribute name="menu" value="/WEB-INF/layouts/menu.jsp" />
		<#if layout=='mixto'><put-attribute name="menuMixto" value="/WEB-INF/layouts/menuMixto.jsp" /></#if>
		<put-attribute name="breadCrumb" value="/WEB-INF/layouts/breadCrumb.jsp" />
		<put-attribute name="footer" value="/WEB-INF/layouts/footer.jsp" />
		<put-attribute name="base-includes" value="/WEB-INF/layouts/base-includes.jsp" />
		<put-attribute name="includes" value=""/>				
	</definition>
	<definition name="errorTemplate" template="/WEB-INF/layouts/errorTemplate.jsp"></definition>
	
	<!-- ***************************** -->
  	<!--          PANTALLAS            -->
  	<!-- ***************************** -->
	<definition name="error" extends="errorTemplate">
		<put-attribute name="content" value="/WEB-INF/views/error.jsp"/>	
	</definition>
	<definition name="accessDenied" extends="errorTemplate">
		<put-attribute name="content" value="/WEB-INF/views/accessDenied.jsp"/>
	</definition>	
	<definition name="welcome" template="/WEB-INF/views/welcome.jsp"/>

</tiles-definitions>