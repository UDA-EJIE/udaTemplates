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
<project name="${codapp}_minimizado_estaticos" xmlns:artifact="antlib:org.apache.maven.artifact.ant">
	
	<!-- Permite el uso de variables de entorno -->
	<property environment="env" />
			
	
	
	<!-- MINIMIZAR -->
	<property name="version" value="2.4.5"/>
	<property name="codApp" value="${codapp}"/>
	
	<property name="srcDir" value="../<#noparse>${codApp}</#noparse>Statics/WebContent"/>
	<property name="destDir" value="../<#noparse>${codApp}</#noparse>Statics/<#noparse>${codApp}</#noparse>PortalStatics"/>
	<property name="yuiJarPath" value="<#noparse>${ant.home}</#noparse>/lib/yuicompressor-2.4.2.jar" description="Librería YUICompressor" />
	<property name="sourceDirJS" value="<#noparse>${srcDir}</#noparse>/rup/scripts" description="Directorio base de los ficheros JS" />
	<property name="destDirJS" value="<#noparse>${srcDir}</#noparse>/rup/scripts/min" description="Directorio destino del fichero JS minimizado" />
	<property name="sourceDirCSS" value="<#noparse>${srcDir}</#noparse>/rup/basic-theme" description="Directorio base de los ficheros JS" />
	<property name="destDirCSS" value="<#noparse>${srcDir}</#noparse>/rup/basic-theme" description="Directorio destino del fichero JS minimizado" />

	<property name="sourceDirAppJS" value="<#noparse>${srcDir}</#noparse>/${codapp}/scripts" description="Directorio base de los ficheros JS" />
	
	<target name="generateRupScriptsMin" description="Generar las versiones minimizadas de los ficheros js de rup">
		<antcall target="minimizeRupFiles">
			<param name="sourceDescriptorFile" value="jsMinList.txt"/>
			<param name="targetConcatFile" value="rup-<#noparse>${version}</#noparse>.js"/>
			<param name="targetMinFile" value="rup.min-<#noparse>${version}</#noparse>.js"/>
			<param name="sourceDirParam" value="<#noparse>${sourceDirJS}</#noparse>"/>
			<param name="destDirParam" value="<#noparse>${destDirJS}</#noparse>"/>
			
		</antcall>
	</target>
	
	<target name="generateRupStylesMin" description="Generar las versiones minimizadas de los ficheros css de rup">
		<antcall target="minimizeRupFiles">
			<param name="sourceDescriptorFile" value="cssMinList.txt"/>
			<param name="targetConcatFile" value="rup-<#noparse>${version}</#noparse>.css"/>
			<param name="targetMinFile" value="rup.min-<#noparse>${version}</#noparse>.css"/>
			<param name="sourceDirParam" value="<#noparse>${sourceDirCSS}</#noparse>"/>
			<param name="destDirParam" value="<#noparse>${destDirCSS}</#noparse>"/>
		</antcall>
	</target>
	
	
	<target name="minimizeRupFiles">
		<echo message="Inicio del proceso de generación del fichero minimizado de RUP." />
		<echo message="Se eliminan los ficheros minimizados existentes..." />
		<delete file="<#noparse>${destDirParam}</#noparse>/<#noparse>${targetConcatFile}</#noparse>"/>
		<delete file="<#noparse>${destDirParam}</#noparse>/<#noparse>${targetMinFile}</#noparse>"/>
		<echo message="Concatenando los ficheros fuente..." />
    	<loadfile property="file" srcfile="<#noparse>${sourceDescriptorFile}</#noparse>">
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
		<concat destfile="<#noparse>${destDirParam}</#noparse>/<#noparse>${targetConcatFile}</#noparse>" append="true">
			<filelist dir="<#noparse>${sourceDirParam}</#noparse>" files="${file}" />
		</concat>
		<echo message="Generado el fichero unificado: <#noparse>${destDirParam}</#noparse>/<#noparse>${targetConcatFile}</#noparse>" />
		
		<echo message="Comienzo de la generación del fichero minimizado <#noparse>${destDirParam}</#noparse>/<#noparse>${targetMinFile}</#noparse>" />
        <apply executable="java" parallel="false" verbose="true" dest="<#noparse>${destDirParam}</#noparse>">
            <fileset dir="<#noparse>${destDirParam}</#noparse>">
                <include name="<#noparse>${targetConcatFile}</#noparse>" />
            </fileset>
            <arg line="-jar" />
            <arg path="<#noparse>${yuiJarPath}</#noparse>" />
            <arg value="--charset" />
            <arg value="UTF-8" />
            <arg value="-o" />
            <targetfile />
            <mapper type="glob" from="<#noparse>${targetConcatFile}</#noparse>" to="<#noparse>${targetMinFile}</#noparse>" />
        </apply>
        <echo message="Generado el fichero minimizado: <#noparse>${destDirParam}</#noparse>/<#noparse>${targetMinFile}</#noparse>" />
		<delete file="<#noparse>${destDirParam}</#noparse>/<#noparse>${targetConcatFile}</#noparse>"/>
		<echo message="Se elimina el fichero temporal unificado: <#noparse>${destDirParam}</#noparse>/<#noparse>${targetMinFile}</#noparse>" />
	</target>
	
	<target name="generateAppScriptsMin" description="Generar las versiones minimizadas de los ficheros js de la aplicación">
		<delete>
	      <fileset dir="<#noparse>${sourceDirAppJS}</#noparse>/min" includes="**/*.*"/>
	    </delete>
		<touch mkdirs="true">
	        <fileset dir="<#noparse>${sourceDirAppJS}</#noparse>">
	            <include name="**/*.js"/>
	        	<exclude name="min/*"/>
	        </fileset>
	        <regexpmapper from="^(.*)/[^/]*$$" to="<#noparse>${sourceDirAppJS}</#noparse>/min/\1/.tmp" handledirsep="true"/>
	    </touch>
	    <delete>
	      <fileset dir="<#noparse>${sourceDirAppJS}</#noparse>/min" includes="**/.tmp"/>
	    </delete>
		
		<apply executable="java" parallel="false" verbose="true" dest="<#noparse>${sourceDirAppJS}</#noparse>/min">
			<fileset dir="<#noparse>${sourceDirAppJS}</#noparse>">
				<include name="**/*.js"/>
				<exclude name="min/*"/>
			</fileset>
			<arg line="-jar" />
			<arg path="<#noparse>${yuiJarPath}</#noparse>" />
			<arg value="--charset" />
			<arg value="UTF-8" />
			<arg value="-o" />
			<targetfile />
			<mapper type="glob" from="*.js" to="*-min.js" />
		</apply>
		<echo message="Files compressed and copied to @{target}" />
	</target>
</project>