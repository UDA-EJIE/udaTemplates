<%--  
 -- Copyright 2019 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 -- 
 -- 	 http://ec.europa.eu/idabc/eupl.html
 -- 
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
 -- el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia. 
 --%>
 
<%@include file="/WEB-INF/includeTemplate.inc"%>

<!-- Include de los elementos comunes -->
<script type="text/javascript">
	// Añadir una variable para determinar si se hacen o no las trazas
	IS_EJIE = '${isEjie}',
	APP_RESOURCES = 'xxx',
	CTX_PATH = '<%= request.getContextPath()%>/',
	STATICS = '${staticsUrl}',
	RUP = '${staticsUrl}/rup',
	WAR_NAME = 'xxxPrueba',
	//model
	LAYOUT = '${empty defaultLayout ?  mvcInterceptor.defaultLayout : defaultLayout}',
	//mvc-config.xml
	LOCALE_COOKIE_NAME = '${localeResolver.cookieName}',
	LOCALE_PARAM_NAME = '${mvcInterceptor.paramName}',
	AVAILABLE_LANGS = '${mvcInterceptor.availableLangs}',
	//breadCrumbs
	LOGGED_USER = '${udaAuthenticationProvider.userCredentials.fullName}',
	DESTROY_XLNETS_SESSION = '${!empty sessionScope.SPRING_SECURITY_CONTEXT.authentication.principal ? sessionScope.SPRING_SECURITY_CONTEXT.authentication.credentials.destroySessionSecuritySystem : sessionScope.destroySessionSecuritySystem}';
</script>

<%-- Scripts RUP --%>
<%@include file="/WEB-INF/layouts/includes/rup.scripts.inc"%>
<%@include file="/WEB-INF/layouts/includes/xxx.scripts.inc"%>