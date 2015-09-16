<#-- 
 -- Copyright 2011 E.J.I.E., S.A.
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
<?xml version="1.0" encoding="UTF-8"?>
<system-libraries>
    <module id="javax.ejb"/>
    <module id="javax.interceptor"/>
	<module id="javax.persistence"/>
<#if entornoEjie != "">
    <library path="%MODULES_DIR%/features/weblogic.server.modules_10.3.5.0.jar"/>
    <library path="%MODULES_DIR%/features/weblogic.server.modules.extra_10.3.5.0.jar"/>
</#if>	
</system-libraries>