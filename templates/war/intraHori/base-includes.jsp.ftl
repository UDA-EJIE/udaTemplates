<%@include file="/WEB-INF/views/includes/includeTemplate.inc"%>

<!-- Include de los elementos comunes -->
<script type="text/javascript">
	APP_RESOURCES = '${codapp}',
	CTX_PATH = '<%= request.getContextPath()%>/',
	RUP = '<#noparse>${staticsUrl}</#noparse>/rup',
	STATICS = '<#noparse>${staticsUrl}</#noparse>',
	DEFAULT_LANGUAGE = "<#noparse>${defaultLanguage}</#noparse>",
	LAYOUT = "<#noparse>${defaultLayout}</#noparse>",
	WAR_NAME = "${warNameShort}",
	AVAILABLE_LANGS = "${languageswithoutquotes}";
</script>


<!--  jQuery 1.4.4 + jQuery UI 1.8.8 (ui.menu 1.9m2) -->
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jquery-1.4.4.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jquery.blockUI.js" type="text/javascript"></script>

<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/ui/jquery-ui-1.8.11.custom.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/ui/jquery.ui.autocomplete.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/ui/jquery.ui.menu.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/ui/jquery-ui.multidatespicker.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/ui/jquery.ui.selectmenu.js" type="text/javascript"></script><!-- combo -->
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/ui/jquery-ui.timepicker.js" type="text/javascript"></script>

<!-- jqGrid 3.8 + i18n -->
<!-- script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jqgrid/i18n/grid.locale-sp.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jqgrid/jqGrid.min-3.8.1.js" type="text/javascript"></script-->
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jqgrid/i18n/grid.locale-es.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jquery.jqGrid.js" type="text/javascript"></script>

<!-- Plugin del Core -->
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jquery.form.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jquery.json-2.2.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/form2object.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/xbreadcrumbs.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/core/jquery.numeric.js" type="text/javascript"></script>

<!-- Utilidades -->
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.utils-1.0.0.js" type="text/javascript"></script>

<!-- Patrones (orden desc) -->
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.base-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.autocomplete-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.breadCrumb-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.combo-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.date-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.dialog-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.feedback-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.grid-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.lang-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.maint-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.menu-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.message-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.tabs-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.time-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.toolbar-1.0.0.js" type="text/javascript"></script>
<script src="<#noparse>${staticsUrl}</#noparse>/rup/scripts/rup.tooltip-1.0.0.js" type="text/javascript"></script>

<!-- Cargador del layout para el idioma, menu y migas -->
<script src="<#noparse>${staticsUrl}</#noparse>/${codapp}/scripts/layoutLoader${warNameShort?cap_first}.js" type="text/javascript"></script>