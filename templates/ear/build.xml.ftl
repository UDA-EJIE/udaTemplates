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
	
	<!-- Portalizar estilos -->
	<property name="codApp" value="${codapp}"/>
	<property name="srcDir" value="../<#noparse>${codApp}</#noparse>Statics/WebContent"/>
	<property name="destDir" value="../<#noparse>${codApp}</#noparse>Statics/<#noparse>${codApp}</#noparse>PortalStatics"/>

	<target name="generatePortalStatics" description="Genera directorio ${codapp}PortalStatics para despliegue de en portal">
		<echo>Regenerando directorio (${codapp}PortalStatics)</echo>
		<delete dir="<#noparse>${destDir}</#noparse>" />
		<mkdir  dir="<#noparse>${destDir}</#noparse>" />
		<copy todir="<#noparse>${destDir}</#noparse>/rup" >
	 		<fileset dir="<#noparse>${srcDir}</#noparse>/rup" />
		</copy>
		<copy todir="<#noparse>${destDir}</#noparse>/<#noparse>${codApp}</#noparse>" >
			<fileset dir="<#noparse>${srcDir}</#noparse>/<#noparse>${codApp}</#noparse>" />
		</copy>
		
		<!-- Desplegar en LOCAL -->
		<copy todir="<#noparse>${destDir}</#noparse>/WEB-INF" >
			<fileset dir="<#noparse>${srcDir}</#noparse>/WEB-INF" />
		</copy>
		<replace file="<#noparse>${destDir}</#noparse>/WEB-INF/weblogic.xml" token="${codapp}Statics" value="${codapp}PortalStatics" />
		
		
		<echo>Parseando ficheros de estilos (.css)</echo>
		<taskdef name="portalizeCss" classname="com.ejie.uda.UDAPortalizeCss" classpath="<#noparse>${ant.home}</#noparse>/lib/com.ejie.uda.statics.tools.jar" />
		<portalizeCss codApp="<#noparse>${codApp}</#noparse>" destDir="<#noparse>${destDir}</#noparse>" parserHacks="<#noparse>${ant.home}</#noparse>/lib/com.ejie.uda.statics.tools.style_hacks"/>
	</target>

</project>