<%@include file="/WEB-INF/views/includes/includeTemplate.inc"%>

<div id="cabecera" class="cabecera">

<#if entornoEjie == "true">
	<span style="font-size: 2em;color: #000000;">CABECERA PORTAL</span>
	<a href="<%= request.getContextPath()%>/" style="float: right;margin-top:-2em;">
		<img src="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/images/euskadi_net.gif" alt="Euskadi Net"/>
	</a>
<#else>
	<span style="font-size: 2em;color: #000000;">CABECERA PORTAL</span>
	<a href="<%= request.getContextPath()%>/" style="float: right;margin-top:-2em;">
		<img src="<#noparse>${staticsUrl}</#noparse>/rup/basic-theme/images/uda_logo.png" alt="Uda"/>
	</a>
</#if>
</div>
