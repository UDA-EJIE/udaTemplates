<?xml version="1.0" encoding="UTF-8"?>
<system-libraries>
    <module id="javax.ejb"/>
    <module id="javax.interceptor"/>
	<module id="javax.persistence"/>
<#if entornoEjie != "">
    <library path="%MODULES_DIR%/features/weblogic.client.modules_10.3.1.0.jar"/>
    <library path="%MODULES_DIR%/features/weblogic.server.modules.extra_10.3.1.0.jar"/>
</#if>	
</system-libraries>