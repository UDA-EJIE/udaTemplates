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
<!DOCTYPE project>
<project name="${codapp}EAR" default="mavenRunDependencies" xmlns:artifact="antlib:org.apache.maven.artifact.ant" xmlns:ivy="antlib:org.apache.ivy.ant">>
	
	<!-- Permite el uso de variables de entorno -->
	<property environment="env" />
		
	<!-- Obtener dependencias -->	
	<target name="mavenRunDependencies" description="Resuelve las dependencias del proyecto desde Maven">
		<path id="maven-ant-tasks.classpath" path="<#noparse>${ant.home}</#noparse>/lib/maven-ant-tasks-2.1.1.jar" />
		<typedef resource="org/apache/maven/artifact/ant/antlib.xml" uri="antlib:org.apache.maven.artifact.ant" classpathref="maven-ant-tasks.classpath" />	
		<artifact:dependencies settingsFile="<#noparse>${env.M2_HOME}</#noparse>/conf/settings.xml"/>
		<artifact:mvn pom="pom.xml" mavenHome="<#noparse>${env.M2_HOME}</#noparse>" fork="true">
			<arg value="package"/>
		</artifact:mvn>		
	</target>
	
	<target name="obtenerLibreriasLocal" description="Para actualizar librerias en local">                   
		<path id="ivy-ant-tasks.classpath" path="<#noparse>${ant.home}</#noparse>/lib/ivy-2.3.0.jar" />
		<typedef resource="org/apache/ivy/ant/antlib.xml" uri="antlib:org.apache.ivy.ant" classpathref="ivy-ant-tasks.classpath" />    
		<ivy:configure file="../<#noparse>${codapp}EAR</#noparse>/ivy/ivysettings.xml"/>
		<ivy:resolve file="ivy.xml" conf="${ivy.configurations}" />
		<ivy:retrieve pattern="../<#noparse>${codapp}EAR</#noparse>/EarContent/APP-INF/lib/[artifact]-[revision](-[classifier]).[ext]" conf="${ivy.configurations}" overwriteMode="always" />     
    </target>	

	
</project>