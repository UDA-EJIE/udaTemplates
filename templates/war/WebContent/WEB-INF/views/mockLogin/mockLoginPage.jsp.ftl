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

<div id="mockPageContent" class="mt-3 mb-5">
	<div class="login-inner">	
		<div class="mx-5">
			<div class="separator"></div>
			<img src="<#noparse>${staticsUrl}</#noparse>/rup/css/images/login.png" alt='<spring:message code="app.title"/>'>
			<div class="separator"></div>
		</div>
		<div class="row d-flex justify-content-center">
			<h2 class="userComboTitle">
				<spring:message code="mockLogin.selectUser"/>
			</h2>
			<div class="col-10" id="userCombolayer">
				<select id="userCombo"></select>
			</div>
			<div id="loginButton" class="mt-4">
				<input id="loginButtonObject" type="submit" tabindex="3" value='<spring:message code="mockLogin.login_button"/>' />
			</div>
		</div>
	</div>
</div>
