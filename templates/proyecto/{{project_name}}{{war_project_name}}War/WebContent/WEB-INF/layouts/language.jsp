 <%@include file="/WEB-INF/includeTemplate.inc"%>
<div id="xxxPruebaWar_language" class="rup-language_root">
	<div class="languageHelpContact">
		<a target="_blank" title='<spring:message code="language.ayuda" />' href="#" id="header_ayuda">
			<spring:message code="language.ayuda" />
		</a>
		<span class="ui-icon ui-icon-extlink rup_external_link">&nbsp;&nbsp;&nbsp;&nbsp;</span>
		&nbsp;&nbsp;&nbsp;
		<spring:url value="mailto:uda@uda.es" var="urlMail" htmlEscape="true" />
		<a target="_blank" title='<spring:message code="language.contacto" />' href="${urlMail}">
			<spring:message code="language.contacto" />	
		</a>
		<span class="ui-icon ui-icon-extlink rup_external_link">&nbsp;&nbsp;&nbsp;&nbsp;</span>
	</div>
</div>