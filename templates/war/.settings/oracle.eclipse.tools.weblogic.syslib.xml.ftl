<?xml version="1.0" encoding="UTF-8"?>
<system-libraries>
    <library javadoc="http://java.sun.com/j2ee/1.4/docs/api" path="server/lib/api.jar"/>
<#if entornoEjie != "">
    <library path="%MODULES_DIR%/features/weblogic.client.modules_10.3.1.0.jar"/>
    <library path="%MODULES_DIR%/features/weblogic.server.modules.extra_10.3.1.0.jar"/>
</#if>
</system-libraries>