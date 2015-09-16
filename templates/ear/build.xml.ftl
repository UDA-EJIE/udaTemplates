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
<project name="${codapp}EAR" default="mavenRunDependencies" xmlns:artifact="antlib:org.apache.maven.artifact.ant">
	<target name="mavenRunDependencies" description="Resuelve las dependencias del proyecto desde Maven">
		<path id="maven-ant-tasks.classpath" path="<#noparse>${ant.home}</#noparse>/lib/maven-ant-tasks-2.1.1.jar" />
		<typedef resource="org/apache/maven/artifact/ant/antlib.xml" uri="antlib:org.apache.maven.artifact.ant" classpathref="maven-ant-tasks.classpath" />	
		<artifact:dependencies settingsFile="${mavenSettings}"/>
		<artifact:mvn pom="pom.xml" mavenHome="${mavenHome}" fork="true">
			<arg value="package"/>
		</artifact:mvn>			
	</target>
</project>