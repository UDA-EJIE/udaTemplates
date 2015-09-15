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