 
<%@include file="/WEB-INF/includeTemplate.inc"%>

<div id="mockPageContent" class="preview">
	<div class="login-inner ui-widget">	
		<div class="login-up">
			<div class="separator"></div>
			<img src="${staticsUrl}/rup/basic-theme/images/login.png" alt='<spring:message code="app.title"/>'>
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
