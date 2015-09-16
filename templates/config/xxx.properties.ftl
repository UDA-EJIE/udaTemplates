<#-- 
 -- Copyright 2013 E.J.I.E., S.A.
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
<#if entornoEjie != "">
statics.path = http://desarrollo.jakina.ejiedes.net:7001/${codapp?lower_case}Statics
xlnets.path = http://xlnets.servicios.jakina.ejiedes.net/n38a/N38LoginInicioServlet
<#else>
statics.path = /${codapp?lower_case}Statics
</#if>
#TRUE if it is portal embedded
xlnets.inPortal=FALSE 

#Loggin parameters
log.path=c:/datos/${codapp}/log
log.level.salidaEstandar=INFO
log.level.udaTrazas=TRACE
log.level.aplicTrazas=INFO
log.level.auditoriaAccesos=INFO