<%@include file="/WEB-INF/views/includes/includeTemplate.inc"%>
<h1><spring:message  code="patronDialogTitle" /></h1>		
<div id="idDialog" style="display:none"><spring:message code="divDialogContent" />.</div>
<div id="pruebas">
	<button id="btnDialog"><spring:message  code="dialogoNormal" /></button>
	<button id="btnAjaxDialog"><spring:message  code="dialogoAjax" />Dialo con petici&oacute;n Ajax</button>
	<button id="btnTextDialog"><spring:message  code="dialogoText" />Dialogo con texto</button>
	<button id="btnTextDialog2"><spring:message  code="dialogoText2" />Dialogo con otro texto</button>
</div>
