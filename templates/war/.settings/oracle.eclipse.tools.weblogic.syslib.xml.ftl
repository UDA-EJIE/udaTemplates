<#-- 
 -- Copyright 2011 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versi�n 1.1 exclusivamente (la �Licencia�);
 -- Solo podr� usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislaci�n aplicable o se acuerde por escrito, 
 -- el programa distribuido con arreglo a la Licencia se distribuye �TAL CUAL�,
 -- SIN GARANT�AS NI CONDICIONES DE NING�N TIPO, ni expresas ni impl�citas.
 -- V�ase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
<?xml version="1.0" encoding="UTF-8"?>
<system-libraries>
    <library javadoc="http://java.sun.com/j2ee/1.4/docs/api" path="server/lib/api.jar"/>
<#if entornoEjie != "">
    <library path="%MODULES_DIR%/features/weblogic.client.modules_10.3.5.0.jar"/>
    <library path="%MODULES_DIR%/features/weblogic.server.modules.extra_10.3.5.0.jar"/>
</#if>
</system-libraries>