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

<!-- Include de los elementos comunes -->
<script type="text/javascript">
	APP_RESOURCES = '${codapp}',
	CTX_PATH = '<%= request.getContextPath()%>/',
	STATICS = '<#noparse>${staticsUrl}</#noparse>',
	RUP = '<#noparse>${staticsUrl}</#noparse>/rup',
	WAR_NAME = '${warNameShort}',
	//model
	LAYOUT = '<#noparse>${empty defaultLayout ?  mvcInterceptor.defaultLayout : defaultLayout}</#noparse>',
	//mvc-config.xml
	LOCALE_COOKIE_NAME = '<#noparse>${localeResolver.cookieName}</#noparse>',
	LOCALE_PARAM_NAME = '<#noparse>${mvcInterceptor.paramName}</#noparse>',
	AVAILABLE_LANGS = '<#noparse>${mvcInterceptor.availableLangs}</#noparse>',
	//breadCrumbs
	LOGGED_USER = '<#noparse>${udaAuthenticationProvider.userCredentials.fullName}</#noparse>',
	DESTROY_XLNETS_SESSION = '<#noparse>${!empty sessionScope.SPRING_SECURITY_CONTEXT.authentication.principal ? sessionScope.SPRING_SECURITY_CONTEXT.authentication.credentials.destroySessionSecuritySystem : sessionScope.destroySessionSecuritySystem}</#noparse>';
</script>

<%-- Scripts RUP sin minimizar (DESARROLLO) --%>
<%-- <%@include file="/WEB-INF/layouts/includes/rup.scripts.inc"%> --%>
<%-- Scripts RUP minimizados (PRODUCCION) --%>
<%@include file="/WEB-INF/layouts/includes/rup.scripts.min.inc"%>

<%@include file="/WEB-INF/layouts/includes/${codapp}.scripts.inc"%>