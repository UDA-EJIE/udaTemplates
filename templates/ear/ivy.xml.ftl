<#-- 
 -- Copyright 2019 E.J.I.E., S.A.
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
<ivy-module version="2.0" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			xmlns:maven="http://ant.apache.org/ivy/maven"
            xsi:noNamespaceSchemaLocation=
                   "http://ant.apache.org/ivy/schemas/ivy.xsd">
    <info status="integration" revision="0.1" organisation="com.ejie" module="${codapp}"/>
    <dependencies>

	<#if radjpa>
		<dependency org="org.eclipse.persistence" 			name="eclipselink" 				rev="2.3.0" conf="default" transitive="false"/>
		<dependency org="org.eclipse.persistence" 			name="javax.persistence" 		rev="2.0.1" conf="default" transitive="false"/>
		<dependency org="org.eclipse.persistence" 			name="org.eclipse.persistence.jpa.modelgen.processor" 		rev="2.3.0" conf="default" transitive="false"/>
	</#if>	
	
		<!-- Spring Framework -->
        <dependency org="org.springframework" 			name="spring-aop" 				rev="4.3.22.RELEASE" conf="default" transitive="false"/>
		<dependency org="org.springframework"			name="spring-beans"				rev="4.3.22.RELEASE" conf="default" transitive="false"/>
        <dependency org="org.springframework" 			name="spring-core"	 			rev="4.3.22.RELEASE" conf="default" transitive="false"/>
		<dependency org="org.springframework"			name="spring-expression"		rev="4.3.22.RELEASE" conf="default" transitive="false"/>
		<dependency org="org.springframework"			name="spring-jdbc"				rev="4.3.22.RELEASE" conf="default" transitive="false"/>
        <dependency org="org.springframework" 			name="spring-context" 			rev="4.3.22.RELEASE" conf="default" transitive="false"/>
        <dependency org="org.springframework" 			name="spring-context-support"	rev="4.3.22.RELEASE" conf="default" transitive="false"/>
        <dependency org="org.springframework" 			name="spring-orm" 				rev="4.3.22.RELEASE" conf="default" transitive="false"/>
		<dependency org="org.springframework"			name="spring-web"				rev="4.3.22.RELEASE" conf="default" transitive="false"/>
        <dependency org="org.springframework" 			name="spring-webmvc" 			rev="4.3.22.RELEASE" conf="default" transitive="false"/>
		<dependency org="org.springframework"			name="spring-tx"				rev="4.3.22.RELEASE" conf="default" transitive="false"/>
		
		<!-- Spring Framework Security -->
        <dependency org="org.springframework.security" 	name="spring-security-acl" 		rev="4.2.11.RELEASE"  conf="default" transitive="false"/>
        <dependency org="org.springframework.security" 	name="spring-security-config" 	rev="4.2.11.RELEASE"  conf="default" transitive="false"/>
        <dependency org="org.springframework.security" 	name="spring-security-core" 	rev="4.2.11.RELEASE"  conf="default" transitive="false"/>
        <dependency org="org.springframework.security" 	name="spring-security-taglibs" 	rev="4.2.11.RELEASE"  conf="default" transitive="false"/>
        <dependency org="org.springframework.security" 	name="spring-security-web" 		rev="4.2.11.RELEASE"  conf="default" transitive="false"/>
				
		<!-- Validation -->
		<dependency org="org.hibernate" 				name="hibernate-validator" 		rev="5.4.3.Final" 	 conf="default" transitive="false"/>
		<dependency org="javax.validation" 				name="validation-api" 			rev="1.1.0.Final" 		 conf="default" transitive="false"/>

		<!-- Serialization -->
		<dependency org="com.fasterxml.jackson.core"    name="jackson-core"             rev="2.7.9"          conf="default" transitive="false"/>	
		<dependency org="com.fasterxml.jackson.core"    name="jackson-annotations"      rev="2.7.0"          conf="default" transitive="false"/>
		<dependency org="com.fasterxml.jackson.core"    name="jackson-databind"         rev="2.7.9.5"          conf="default" transitive="false"/>
		
		<!-- Logging -->
		<dependency org="ch.qos.logback" 				name="logback-core" 			rev="1.2.3" 		 conf="default" transitive="false"/> 
		<dependency org="ch.qos.logback" 				name="logback-classic" 			rev="1.2.3" 		 conf="default" transitive="false"/>
		<dependency org="org.slf4j" 					name="slf4j-api" 				rev="1.7.25" 		 conf="default" transitive="false"/>
        <dependency org="org.slf4j" 					name="slf4j-ext" 				rev="1.7.25" 		 conf="default" transitive="false"/>
		<dependency org="org.slf4j" 					name="jcl-over-slf4j" 			rev="1.7.25" 		 conf="default" transitive="false"/>		
		
		<!-- Tiles Pages -->
		<dependency org="org.apache.tiles" 				name="tiles-api" 				rev="3.0.8" 		 conf="default" transitive="false"/>
		<dependency org="org.apache.tiles" 				name="tiles-core" 				rev="3.0.8" 		 conf="default" transitive="false"/>
        <dependency org="org.apache.tiles" 				name="tiles-jsp" 				rev="3.0.8" 		 conf="default" transitive="false"/>
		<dependency org="org.apache.tiles" 				name="tiles-servlet" 			rev="3.0.8" 		 conf="default" transitive="false"/>
		<dependency org="org.apache.tiles" 				name="tiles-template" 			rev="3.0.8" 		 conf="default" transitive="false"/>

		<!-- Others -->
        <dependency org="aopalliance" 					name="aopalliance" 				rev="1.0" 			conf="default" transitive="false"/>
        <dependency org="org.aspectj" 					name="aspectjweaver" 			rev="1.8.13" 		conf="default" transitive="false"/>
		<dependency org="commons-digester" 				name="commons-digester" 		rev="2.1" 			conf="default" transitive="false"/>
		<dependency org="commons-httpclient" 			name="commons-httpclient" 		rev="3.0.1" 		conf="default" transitive="false"/>
		<dependency org="commons-lang" 					name="commons-lang" 			rev="2.6" 			conf="default" transitive="false"/>

		<!-- UDA -->
		<dependency org="com.ejie.x38" 					name="x38ShLibClasses" 			rev="4.2.0-RELEASE"  conf="default" transitive="false"/>
        <dependency org="com.ejie.x38" 					name="x38ShLibClasses-rup"		rev="4.2.0-RELEASE"  conf="default" transitive="false"/>
		
<#if entornoEjie != "">

		<!-- PIF 1.4 -->
		<dependency org="com.ejie" 						name="y31b" 					rev="1.4" 			conf="default" transitive="false">
			<artifact name="y31b" maven:classifier="ifaz" type="jar" ext="jar"/>
		</dependency>
		<dependency org="com.ejie" 						name="y31c" 					rev="1.4" 			conf="default" transitive="false">
			<artifact name="y31c" maven:classifier="impl" type="jar" ext="jar"/>
		</dependency>
		<dependency org="org.apache.hadoop" 			name="hadoop-client" 			rev="1.0.3" 		conf="default" transitive="false"/>
		<dependency org="org.apache.hadoop" 			name="hadoop-core-without-webhdfs"	rev="1.0.3" 	conf="default" transitive="false"/>
		<dependency org="commons-beanutils" 			name="commons-beanutils" 		rev="1.8.3" 		conf="default" transitive="false"/>
		<dependency org="commons-codec" 				name="commons-codec" 			rev="1.6" 			conf="default" transitive="false"/>
		<dependency org="commons-collections" 			name="commons-collections" 		rev="3.2.2" 		conf="default" transitive="false"/>
		<dependency org="net.sf.ezmorph" 				name="ezmorph" 					rev="1.0.6" 		conf="default" transitive="false"/>
		<dependency org="net.sf.json-lib" 				name="json-lib" 				rev="2.3" 			conf="default" transitive="false">
			<artifact name="json-lib" maven:classifier="jdk15" type="jar" ext="jar"/>
		</dependency>
		<dependency org="net.sf.flexjson" 				name="flexjson" 				rev="2.1" 			conf="default" transitive="false"/>
		<dependency org="eu.medsea.mimeutil" 			name="mime-util" 				rev="2.1.3" 		conf="default" transitive="false"/>
		<dependency org="org.mortbay.jetty" 			name="jetty-util" 				rev="6.1.26" 		conf="default" transitive="false"/>
		<dependency org="javax.ws.rs" 					name="javax.ws.rs-api" 			rev="2.0.1" 		conf="default" transitive="false"/>
		
		<dependency org="com.ejie" 						name="w43ta" 					rev="2.4" 		 	conf="default" transitive="false"/>		
        <dependency org="org.apache.avro"				name="avro"						rev="1.7.7" 		conf="default" transitive="false"/>
		<dependency org="org.apache.httpcomponents" 	name="httpclient" 				rev="4.3.3"			conf="default" transitive="false" />
		<dependency org="org.apache.httpcomponents" 	name="httpcore" 				rev="4.3.3" 		conf="default" transitive="false" />
		<dependency org="org.codehaus.jackson" 			name="jackson-mapper-asl" 		rev="1.9.13" 		conf="default" transitive="false"/>
		<dependency org="org.codehaus.jackson"			name="jackson-core-asl"			rev="1.9.13"		conf="default" transitive="false"/>
		<dependency org="io.dropwizard.metrics" 		name="metrics-core" 			rev="3.1.2" 		conf="default" transitive="false"/>
</#if>	

	</dependencies>
</ivy-module>