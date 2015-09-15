<?xml version="1.0"?>
<!DOCTYPE project>
<project name="Metamodel Generation" default="main" basedir=".">

	<property name="src.dir" location="src/com/ejie/${codapp?lower_case}/model" />
	<property name="delete.dir" location=".delete" />
	<!--<property name="dist.dir" location=".ant_generated" />-->
	<property name="dist.dir" location="src" />
	
	<path id="compile.classpath">
<#if mavenRepository != "">
		<fileset dir="${mavenRepository}/org/eclipse/persistence/org.eclipse.persistence.jpa.modelgen/2.3.0-SNAPSHOT">
<#else>
		<fileset dir="<#noparse>${user.home}</#noparse>/.m2/repository/org/eclipse/persistence/org.eclipse.persistence.jpa.modelgen/2.3.0-SNAPSHOT">
</#if>		
			<include name="org.eclipse.persistence.jpa.modelgen-2.3.0-SNAPSHOT.jar" />
		</fileset>
		<fileset dir="../${codapp?lower_case}EAR/EarContent/APP-INF/lib">
			<include name="*.jar" />
		</fileset>
		<pathelement path="<#noparse>${java.class.path}</#noparse>"/>
	</path>

	<target name="clean1">
		<!--<delete dir="<#noparse>${dist.dir}</#noparse>" />-->
		<delete dir="<#noparse>${delete.dir}</#noparse>" />
	</target>

	<target name="makedir" depends="clean1">
		<!--<mkdir dir="<#noparse>${dist.dir}</#noparse>" />-->
		<mkdir dir="<#noparse>${delete.dir}</#noparse>" />
	</target>	

	<target name="generate-metamodel" depends="makedir">
		<property name="metaPackage" value="metamodel" />
		<delete>
			<fileset dir="<#noparse>${src.dir}</#noparse>" includes="**/*_.java" />
		</delete>
		<echo message="generating MetaData " />
		<javac srcdir="<#noparse>${src.dir}</#noparse>" verbose="true" destdir="<#noparse>${delete.dir}</#noparse>" classpathref="compile.classpath">
			<compilerarg value="-Aeclipselink.persistencexml=src/META-INF/udaPersistence.xml" compiler="javac1.6" />
			<compilerarg line=" -processor org.eclipse.persistence.internal.jpa.modelgen.CanonicalModelProcessor" />
			<compilerarg line=" -proc:only" compiler="javac1.6" />
		</javac>
	</target>
	
	<target name="copy" depends="generate-metamodel">
		<copy todir="<#noparse>${dist.dir}</#noparse>">
			<fileset dir="<#noparse>${delete.dir}</#noparse>" excludes="**/*.class"/>
		</copy>
	</target>
	
	<target name="clean2" depends="copy">
		<delete dir="<#noparse>${delete.dir}</#noparse>" />
	</target>
	
	<target name="main" depends="clean2">
		<description>Main target</description>
	</target>

</project>