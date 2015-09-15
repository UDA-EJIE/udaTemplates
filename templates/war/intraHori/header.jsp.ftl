<%@include file="/WEB-INF/views/includes/includeTemplate.inc"%>

<div id="cabecera" class="cabecera">
	<span style="font-size: 2em;color: #000000;">${codapp} - Demo RUP</span>
	
	<a href="<%= request.getContextPath()%>/" style="float: right;">
		<img src="<#noparse>${staticsUrl}</#noparse>/${codapp}/images/logo_GV.gif" alt="Gobierno Vasco"/>
	</a>
</div>