<#-- 
 -- Copyright 2013 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, 
 -- el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 -- SIN GARANT�?AS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.ejie.${codapp}</groupId>
	<artifactId>${codapp}EAR</artifactId>
	<packaging>pom</packaging>
	<version>1.0-SNAPSHOT</version>
	<name>${codapp}EAR</name>
	<url>http://maven.apache.org</url>
	<properties>
<#if radjpa>	
		<eclipselink.version>2.3.0</eclipselink.version>
		<javax.persistence.version>2.0.1</javax.persistence.version>
</#if>		
		<org.springframework.version>3.2.17.RELEASE</org.springframework.version>
		<org.springframework.security.version>3.2.9.RELEASE</org.springframework.security.version>
		<org.logback.version>1.1.7</org.logback.version>
		<org.slf4j.version>1.7.21</org.slf4j.version>
		<com.ejie.x38.version>3.6.0-RELEASE</com.ejie.x38.version>
	</properties>
		
	<dependencies>
<#if radjpa>
		<!-- EclipseLink -->
		<dependency>
			<groupId>org.eclipse.persistence</groupId>
			<artifactId>eclipselink</artifactId>
			<version><#noparse>${eclipselink.version}</#noparse></version>
		</dependency>
		<dependency>
			<groupId>org.eclipse.persistence</groupId>
			<artifactId>javax.persistence</artifactId>
			<version><#noparse>${javax.persistence.version}</#noparse></version>
		</dependency>
		<!-- MetaModel Generation -->
		<dependency>
			<groupId>org.eclipse.persistence</groupId>
			<artifactId>org.eclipse.persistence.jpa.modelgen.processor</artifactId>
			<version><#noparse>${eclipselink.version}</#noparse></version>
		</dependency>
</#if>
		
		<!-- Spring Framework -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context</artifactId>
			<version><#noparse>${org.springframework.version}</#noparse></version>
			<exclusions>
				<!-- Exclude Commons Logging in favor of logback -->
				<exclusion>
					<groupId>commons-logging</groupId>
					<artifactId>commons-logging</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-webmvc</artifactId>
			<version><#noparse>${org.springframework.version}</#noparse></version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-orm</artifactId>
			<version><#noparse>${org.springframework.version}</#noparse></version>
		</dependency>
		<dependency>
		    <groupId>org.springframework</groupId>
		    <artifactId>spring-context-support</artifactId>
		    <version><#noparse>${org.springframework.version}</#noparse></version>
		</dependency>
		
		<!-- Spring Security -->
		<dependency>
		    <groupId>org.springframework.security</groupId>
		    <artifactId>spring-security-core</artifactId>
		    <version><#noparse>${org.springframework.security.version}</#noparse></version>
		</dependency>
		<dependency>
		    <groupId>org.springframework.security</groupId>
		    <artifactId>spring-security-config</artifactId>
		    <version><#noparse>${org.springframework.security.version}</#noparse></version>
		</dependency>
		<dependency>
		    <groupId>org.springframework.security</groupId>
		    <artifactId>spring-security-acl</artifactId>
		    <version><#noparse>${org.springframework.security.version}</#noparse></version>
		</dependency>
		<dependency>
		    <groupId>org.springframework.security</groupId>
		    <artifactId>spring-security-web</artifactId>
		    <version><#noparse>${org.springframework.security.version}</#noparse></version>
		</dependency>
		<dependency> 
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-taglibs</artifactId>
        	<version><#noparse>${org.springframework.security.version}</#noparse></version>
		</dependency>
		
		<!-- Logging -->
		<!-- SLF4J -->
		<dependency>
			<groupId>org.slf4j</groupId>
			<artifactId>jcl-over-slf4j</artifactId>
			<version><#noparse>${org.slf4j.version}</#noparse></version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.slf4j</groupId>
			<artifactId>slf4j-api</artifactId>
			<version><#noparse>${org.slf4j.version}</#noparse></version>
		</dependency>
		<dependency>
			<groupId>org.slf4j</groupId>
			<artifactId>slf4j-ext</artifactId>
			<version><#noparse>${org.slf4j.version}</#noparse></version>
			<exclusions>
				<!-- Exclude Compiler assisted localization library (CAL10N) -->
				<exclusion>
					<groupId>ch.qos.cal10n</groupId>
					<artifactId>cal10n-api</artifactId>
				</exclusion>				
			</exclusions>			
		</dependency>
		<!-- Logback -->
		<dependency>
			<groupId>ch.qos.logback</groupId>
			<artifactId>logback-core</artifactId>
			<version><#noparse>${org.logback.version}</#noparse></version>						
		</dependency>
		<dependency>
			<groupId>ch.qos.logback</groupId>
			<artifactId>logback-classic</artifactId>
			<version><#noparse>${org.logback.version}</#noparse></version>
		</dependency>

		<!-- JSR 303 with Hibernate Validator -->
		<dependency>
			<groupId>org.hibernate</groupId>
			<artifactId>hibernate-validator</artifactId>
			<version>4.3.2.Final</version>
		</dependency>
		
		<!-- Jackson JSON Mapper -->	
		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-databind</artifactId>
			<version>2.6.5</version>
		</dependency>	

		<!-- AspectJ -->
		<dependency>
			<groupId>org.aspectj</groupId>
			<artifactId>aspectjweaver</artifactId>
			<version>1.6.9</version>
		</dependency>

		<!-- x38 -->
		<dependency>
			<groupId>com.ejie.x38</groupId>
			<artifactId>x38ShLibClasses</artifactId>
			<version><#noparse>${com.ejie.x38.version}</#noparse></version>
		</dependency>
		<dependency>
			<groupId>com.ejie.x38</groupId>
			<artifactId>x38ShLibClasses-rup</artifactId>
			<version><#noparse>${com.ejie.x38.version}</#noparse></version>
		</dependency>
		
		<!-- Tiles -->
		<dependency>
			<groupId>org.apache.tiles</groupId>
			<artifactId>tiles-jsp</artifactId>
			<version>2.2.2</version>
		</dependency>
		
	
		<!-- INI:PIF 1.4 EN APLICACION UDA -->
		<dependency>
			<groupId>com.ejie</groupId>
			<artifactId>y31b</artifactId>
			<version>1.4</version>
			<classifier>ifaz</classifier>
		</dependency>
		<dependency>
			<groupId>com.ejie</groupId>
			<artifactId>y31c</artifactId>
			<version>1.4</version>
			<classifier>impl</classifier>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-client</artifactId>
			<version>1.0.3</version>
			<exclusions>
				<exclusion>
					<groupId>org.apache.hadoop</groupId>
					<artifactId>hadoop-core</artifactId>
				</exclusion>
				<exclusion>
					<groupId>commons-cli</groupId>
					<artifactId>commons-cli</artifactId>
				</exclusion>
				<exclusion>
					<groupId>xmlenc</groupId>
					<artifactId>xmlenc</artifactId>
				</exclusion>
				<exclusion>
					<groupId>commons-codec</groupId>
					<artifactId>commons-codec</artifactId>
				</exclusion>
				<exclusion>
					<groupId>xmlenc</groupId>
					<artifactId>xmlenc</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.apache.commons</groupId>
					<artifactId>commons-math</artifactId>
				</exclusion>
				<exclusion>
					<groupId>commons-configuration</groupId>
					<artifactId>commons-configuration</artifactId>
				</exclusion>
				<exclusion>
					<groupId>commons-net</groupId>
					<artifactId>commons-net</artifactId>
				</exclusion>
				<exclusion>
					<groupId>commons-el</groupId>
					<artifactId>commons-el</artifactId>
				</exclusion>
				<exclusion>
					<groupId>hsqldb</groupId>
					<artifactId>hsqldb</artifactId>
				</exclusion>
				<exclusion>
					<groupId>oro</groupId>
					<artifactId>oro</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.codehaus.jackson</groupId>
					<artifactId>jackson-mapper-asl</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
   			<groupId>commons-beanutils</groupId>
   			<artifactId>commons-beanutils</artifactId>
   			<version>1.8.0</version>
   			<exclusions>
				<!-- Exclude Commons Logging in favor of logback -->
				<exclusion>
					<groupId>commons-logging</groupId>
					<artifactId>commons-logging</artifactId>
				 </exclusion>
				 <exclusion>
					<groupId>commons-collections</groupId>
					<artifactId>commons-collections</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>commons-codec</groupId>
			<artifactId>commons-codec</artifactId>
			<version>1.6</version>
		</dependency>
		<dependency>
			<groupId>net.sf.ezmorph</groupId>
			<artifactId>ezmorph</artifactId>
			<version>1.0.2</version>
			<exclusions>
				<exclusion>
					<groupId>commons-lang</groupId>
					<artifactId>commons-lang</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>net.sf.json-lib</groupId>
			<artifactId>json-lib</artifactId>
			<version>2.3</version>
			<classifier>jdk15</classifier>
		</dependency>
		<dependency>
			<groupId>eu.medsea.mimeutil</groupId>
			<artifactId>mime-util</artifactId>
			<version>2.1.3</version>
			<exclusions>
				<exclusion>
					<groupId>log4j</groupId>
					<artifactId>log4j</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.slf4j</groupId>
					<artifactId>slf4j-api</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.slf4j</groupId>
					<artifactId>slf4j-log4j12</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>org.mortbay.jetty</groupId>
			<artifactId>jetty-util</artifactId>
			<version>6.1.26</version>
			<exclusions>
				<exclusion>
					<groupId>junit</groupId>
					<artifactId>junit</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.mortbay.jetty</groupId>
					<artifactId>servlet-api</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.slf4j</groupId>
					<artifactId>slf4j-api</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>javax.ws.rs</groupId>
			<artifactId>javax.ws.rs-api</artifactId>
			<version>2.0.1</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-core-without-webhdfs</artifactId>
			<version>1.0.3</version>
		</dependency>
		<dependency>
			<groupId>com.ejie</groupId>
			<artifactId>w43ta</artifactId>
			<version>1.1</version>
		</dependency>
		<dependency>
			<groupId>org.apache.avro</groupId>
			<artifactId>avro</artifactId>
			<version>1.7.7</version>
			<exclusions>
				<exclusion>
					<groupId>com.thoughtworks.paranamer</groupId>
					<artifactId>paranamer</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.xerial.snappy</groupId>
					<artifactId>snappy-java</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.apache.commons</groupId>
					<artifactId>commons-compress</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.tukaani</groupId>
					<artifactId>xz</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>org.apache.httpcomponents</groupId>
			<artifactId>httpclient</artifactId>
			<version>4.3.3</version>
		</dependency>
		<dependency>
			<groupId>org.apache.httpcomponents</groupId>
			<artifactId>httpcore</artifactId>
			<version>4.3.3</version>
		</dependency>
		<dependency>
			<groupId>org.codehaus.jackson</groupId>
			<artifactId>jackson-core-asl</artifactId>
			<version>1.9.13</version>
		</dependency>
		<dependency>
			<groupId>org.codehaus.jackson</groupId>
			<artifactId>jackson-mapper-asl</artifactId>
			<version>1.9.13</version>
		</dependency>
		<dependency>
			<groupId>io.dropwizard.metrics</groupId>
			<artifactId>metrics-core</artifactId>
			<version>3.1.2</version>
		</dependency>
		<dependency>
			<groupId>commons-collections</groupId>
			<artifactId>commons-collections</artifactId>
			<version>3.2.2</version>
		</dependency>
		<dependency>
			<groupId>net.sf.flexjson</groupId>
			<artifactId>flexjson</artifactId>
			<version>2.1</version>
		</dependency>
		<dependency>
			<groupId>commons-httpclient</groupId>
			<artifactId>commons-httpclient</artifactId>
			<version>3.0.1</version>
		</dependency>
		<!-- FIN:PIF 1.4 EN APLICACION UDA -->

	
	
	
	
	
	
	</dependencies>
	<repositories>
<#if entornoEjie != "">
		<repository>
			<id>ejie</id>
			<name>ejie</name>
			<url>http://www.otc.ejiedes.net/archiva/repository/repoEJIE</url>
			<snapshots>
				<enabled>true</enabled>
			</snapshots>
		</repository>
<#else>

	<#if radjpa>	
		<!-- For EclipseLink -->
		<repository>
			<id>EclipseLink Repo</id>
			<url>http://download.eclipse.org/rt/eclipselink/maven.repo</url>
		</repository>
	</#if>
		<!-- For Hibernate Validator -->
		<repository>
			<id>org.jboss.repository.release</id>
			<name>JBoss Maven Release Repository</name>
			<url>https://repository.jboss.org/nexus/content/repositories/releases</url>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</repository>
		<repository>
			<id>repo2.maven.org</id>
			<name>Official Maven Repository</name>
			<url>http://repo2.maven.org/maven2/</url>
			<snapshots>
				<enabled>true</enabled>
			</snapshots>
		</repository>
</#if>		
	</repositories>
	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-dependency-plugin</artifactId>
				<executions>
					<execution>
						<id>copy-dependencies</id>
						<phase>package</phase>
						<goals>
							<goal>copy-dependencies</goal>
						</goals>
						<configuration>
							<outputDirectory>./EarContent/APP-INF/lib</outputDirectory>
							<overWriteReleases>false</overWriteReleases>
							<overWriteSnapshots>true</overWriteSnapshots>
							<excludeTransitive>false</excludeTransitive>
							<excludeScope>provided</excludeScope>
						</configuration>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>
</project>