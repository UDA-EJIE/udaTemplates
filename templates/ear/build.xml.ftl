<#--
 -- Copyright 2022 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 -- http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
 -- el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
-->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE project>
<project name="${codapp}EAR" default="mavenRunDependencies">
	
	<!-- Permite el uso de variables de entorno -->
	<property environment="env" />
	<property name="outputDirectory" value="EarContent/APP-INF/lib/" />
	<property name="mavenCommand" value="<#noparse>${env.M2_HOME}</#noparse>/bin/${mavenFileType}" />
	<#if entornoEjie != "">
	<property name="mavenSettings" value="<#noparse>${env.M2_HOME}</#noparse>/conf/settings-nexus3.xml" />
	<#else>
	<property name="mavenSettings" value="<#noparse>${env.M2_HOME}</#noparse>/conf/settings.xml" />
	</#if>
		
	<!-- Obtener dependencias -->
	<target name="mavenRunDependencies" description="Resuelve las dependencias del proyecto desde Maven">
		<exec executable="<#noparse>${mavenCommand}</#noparse>">
			<arg value="-s"/>
			<arg value="<#noparse>${mavenSettings}</#noparse>"/>
			<arg value="-f"/>
			<arg value="pom.xml"/>
			<arg value="dependency:copy-dependencies"/>
			<arg value="-DoutputDirectory=<#noparse>${outputDirectory}</#noparse>"/>
		</exec>
	</target>
	
</project>