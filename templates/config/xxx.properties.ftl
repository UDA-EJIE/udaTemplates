<#if entornoEjie != "">
statics.path = http://desarrollo.jakina.ejiedes.net:7001/${codapp?lower_case}Statics
xlnets.path = http://xlnets.servicios.jakina.ejiedes.net/n38a/N38LoginInicioServlet
<#else>
statics.path = http://localhost:7001/${codapp?lower_case}Statics
</#if>


${warName}.default.language = ${defaultlanguage}
${warName}.default.layout = ${layout}