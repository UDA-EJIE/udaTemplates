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

<div id="mockPageContent" class="preview">
	<div class="login-inner ui-widget">	
		<div class="login-up">
			<div class="separator"></div>
			<img src="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/images/login.png" alt='<spring:message code="app.title"/>'>
			<div class="separator"></div>
		</div>
		<div class="login-down">
			<h2 class="userComboTitle"><spring:message code="mockLogin.selectUser"/></h2>
			<div class="separator"></div>
			<div class="userCombo" id="userCombolayer">
				<div id="userCombo"></div>
				<span id="selectedUser" class="selectedUser"><spring:message code="mockLogin.selectedUser"/></span>
			</div>
			<div id="loginButton" class="loginButton">
				<input id="loginButtonObject" type="submit" tabindex="3" class="ui-button" value='<spring:message code="mockLogin.login_button"/>' />
			</div>
		</div>
	</div>
</div>
