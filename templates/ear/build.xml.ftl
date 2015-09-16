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
	
	<!-- MINIMIZAR -->
	<property name="version" value="2.4.2"/>
	<property name="yuiJarPath" value="${ant.home}/lib/yuicompressor-2.4.2.jar" description="Librería YUICompressor" />
	<property name="sourceDirJS" value="${srcDir}/rup/scripts" description="Directorio base de los ficheros JS" />
	<property name="destDirJS" value="${srcDir}/rup/scripts/min" description="Directorio destino del fichero JS minimizado" />
	<property name="sourceDirCSS" value="${srcDir}/rup/basic-theme" description="Directorio base de los ficheros JS" />
	<property name="destDirCSS" value="${srcDir}/rup/basic-theme" description="Directorio destino del fichero JS minimizado" />

	<property name="sourceDirAppJS" value="${srcDir}/x21a/scripts" description="Directorio base de los ficheros JS" />
	
	<target name="generateRupScriptsMin" description="Generar las versiones minimizadas de los ficheros js de rup">
		<antcall target="minimizeRupFiles">
			<param name="sourceDescriptorFile" value="jsMinList.txt"/>
			<param name="targetConcatFile" value="rup-${version}.js"/>
			<param name="targetMinFile" value="rup.min-${version}.js"/>
			<param name="sourceDirParam" value="${sourceDirJS}"/>
			<param name="destDirParam" value="${destDirJS}"/>
			
		</antcall>
	</target>
	
	<target name="generateRupStylesMin" description="Generar las versiones minimizadas de los ficheros css de rup">
		<antcall target="minimizeRupFiles">
			<param name="sourceDescriptorFile" value="cssMinList.txt"/>
			<param name="targetConcatFile" value="rup-${version}.css"/>
			<param name="targetMinFile" value="rup.min-${version}.css"/>
			<param name="sourceDirParam" value="${sourceDirCSS}"/>
			<param name="destDirParam" value="${destDirCSS}"/>
		</antcall>
	</target>
	
	
	<target name="minimizeRupFiles">
		<echo message="Inicio del proceso de generación del fichero minimizado de RUP." />
		<echo message="Se eliminan los ficheros minimizados existentes..." />
		<delete file="${destDirParam}/${targetConcatFile}"/>
		<delete file="${destDirParam}/${targetMinFile}"/>
		<echo message="Concatenando los ficheros fuente..." />
    	<loadfile property="file" srcfile="${sourceDescriptorFile}">
			 <filterchain>
			 	<striplinecomments>
			 	  <comment value="#"/>
			 	</striplinecomments>
			 	<scriptfilter language="javascript">
			 		self.setToken(self.getToken()+",");
			 	</scriptfilter>
			 	<striplinebreaks/>
			 	<scriptfilter language="javascript">
					self.setToken(self.getToken().substring(0,self.getToken().length()-1));
			 	</scriptfilter>
		      </filterchain>
		</loadfile>
		<echo message="Se van a unificar los siguientes ficheros :" />
		<echo message="${file}" />
		<concat destfile="${destDirParam}/${targetConcatFile}" append="true">
			<filelist dir="${sourceDirParam}" files="${file}" />
		</concat>
		<echo message="Generado el fichero unificado: ${destDirParam}/${targetConcatFile}" />
		
		<echo message="Comienzo de la generación del fichero minimizado ${destDirParam}/${targetMinFile}" />
        <apply executable="java" parallel="false" verbose="true" dest="${destDirParam}">
            <fileset dir="${destDirParam}">
                <include name="${targetConcatFile}" />
            </fileset>
            <arg line="-jar" />
            <arg path="${yuiJarPath}" />
            <arg value="--charset" />
            <arg value="UTF-8" />
            <arg value="-o" />
            <targetfile />
            <mapper type="glob" from="${targetConcatFile}" to="${targetMinFile}" />
        </apply>
        <echo message="Generado el fichero minimizado: ${destDirParam}/${targetMinFile}" />
		<delete file="${destDirParam}/${targetConcatFile}"/>
		<echo message="Se elimina el fichero temporal unificado: ${destDirParam}/${targetMinFile}" />
	</target>
	
	<target name="generateAppScriptsMin" description="Generar las versiones minimizadas de los ficheros js de la aplicación">
		<delete>
	      <fileset dir="${sourceDirAppJS}/min" includes="**/*.*"/>
	    </delete>
		<touch mkdirs="true">
	        <fileset dir="${sourceDirAppJS}">
	            <include name="**/*.js"/>
	        	<exclude name="min/*"/>
	        </fileset>
	        <regexpmapper from="^(.*)/[^/]*$$" to="${sourceDirAppJS}/min/\1/.tmp" handledirsep="true"/>
	    </touch>
	    <delete>
	      <fileset dir="${sourceDirAppJS}/min" includes="**/.tmp"/>
	    </delete>
		
		<apply executable="java" parallel="false" verbose="true" dest="${sourceDirAppJS}/min">
			<fileset dir="${sourceDirAppJS}">
				<include name="**/*.js"/>
				<exclude name="min/*"/>
			</fileset>
			<arg line="-jar" />
			<arg path="${yuiJarPath}" />
			<arg value="--charset" />
			<arg value="UTF-8" />
			<arg value="-o" />
			<targetfile />
			<mapper type="glob" from="*.js" to="*-min.js" />
		</apply>
		<echo message="Files compressed and copied to @{target}" />
	</target>
	

</project>