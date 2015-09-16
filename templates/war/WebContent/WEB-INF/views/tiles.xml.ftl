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
	
	<definition name="templateLogin" template="/WEB-INF/layouts/templateLogin.jsp">	
		<put-attribute name="header" value="/WEB-INF/layouts/header.jsp"/>
		<put-attribute name="language" value="/WEB-INF/layouts/language.jsp"/>
		<put-attribute name="breadCrumb" value="/WEB-INF/layouts/breadCrumb.jsp" />
		<put-attribute name="footer" value="/WEB-INF/layouts/footer.jsp"/>
		<put-attribute name="base-includes" value="/WEB-INF/layouts/base-includes.jsp"/>
		<put-attribute name="includes" value=""/>				
	</definition>
	
	<definition name="templateError" template="/WEB-INF/layouts/templateError.jsp">	
		<put-attribute name="header" value="/WEB-INF/layouts/header.jsp"/>
		<put-attribute name="footer" value="/WEB-INF/layouts/footer.jsp"/>
		<put-attribute name="base-includes" value="/WEB-INF/layouts/base-includes.jsp"/>
	</definition>
	
	<!-- ***************************** -->
  	<!--          PANTALLAS            -->
  	<!-- ***************************** -->
	<definition name="welcome" extends="template">
        <put-attribute name="content" value="/WEB-INF/views/welcome.jsp"/>
    </definition>	
    
    <definition name="mockLoginPage" extends="templateLogin">
        <put-attribute name="content" value="/WEB-INF/views/mockLogin/mockLoginPage.jsp"/>
        <put-attribute name="includes" value="/WEB-INF/views/mockLogin/mockLoginPage-includes.jsp"/>
    </definition>
   	<definition name="mockLoginAjaxPage" extends="templateLogin">
        <put-attribute name="content" value="/WEB-INF/views/mockLogin/mockLoginAjaxPage.jsp"/>
        <put-attribute name="includes" value="/WEB-INF/views/mockLogin/mockLoginAjaxPage-includes.jsp"/>
    </definition>
    
    <definition name="error" extends="templateError" >
		<put-attribute name="content" value="/WEB-INF/views/error.jsp"/>	
	</definition>
	<definition name="accessDenied" extends="templateError" >
		<put-attribute name="content" value="/WEB-INF/views/accessDenied.jsp"/>
	</definition>	

</tiles-definitions>