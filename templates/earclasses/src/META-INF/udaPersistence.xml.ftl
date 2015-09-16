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
<#assign classbody><?xml version="1.0" encoding="UTF-8"?> 
<persistence version="2.0" xmlns="http://java.sun.com/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd">
    <#--<persistence-unit name="${warName}_RESOURCE_LOCAL" transaction-type="RESOURCE_LOCAL">
        <provider>org.eclipse.persistence.jpa.PersistenceProvider</provider>
			<#assign listClas = listaClases>
			 <#foreach reg in listClas>
				 <class>${reg}</class>
			 </#foreach>
		<exclude-unlisted-classes>false</exclude-unlisted-classes>        
        <properties>
        	<property name="eclipselink.target-database" value="org.eclipse.persistence.platform.database.OraclePlatform"/>
        	<property name="eclipselink.target-server" value="WebLogic_10"/>
			<property name="eclipselink.logging.logger" value="com.ejie.x38.log.SLF4JLogger" />
            <property name="eclipselink.logging.level" value="FINEST"/>
            <property name="eclipselink.weaving" value="false"/>
            <property name="eclipselink.ddl-generation" value="drop-and-create-tables"/>
      		<property name="eclipselink.ddl-generation.output-mode" value="both"/>
      		<property name="eclipselink.drop-ddl-jdbc-file-name" value="drop.sql"/>
			<property name="javax.persistence.jdbc.driver" value="oracle.jdbc.driver.OracleDriver"/>
        	<property name="javax.persistence.jdbc.url" value="jdbc:oracle:thin:@localhost:1521:xe"/>
        	<property name="javax.persistence.jdbc.user" value="UDA"/>
        	<property name="javax.persistence.jdbc.password" value="UDA"/>
        </properties>       
    </persistence-unit> -->
    <persistence-unit name="${warName}_JTA" transaction-type="JTA">
        <provider>org.eclipse.persistence.jpa.PersistenceProvider</provider>
        <jta-data-source>${warName?lower_case}.${warName?lower_case}DataSource</jta-data-source>
        <#if listaClases!=''>
			 <#assign listClas = listaClases>
			 <#foreach reg in listClas>
				 <class>${reg}</class>
			 </#foreach>
		</#if>	 
		<exclude-unlisted-classes>false</exclude-unlisted-classes>        
        <properties>
        	<property name="eclipselink.target-database" value="org.eclipse.persistence.platform.database.OraclePlatform"/>
            <property name="eclipselink.target-server" value="WebLogic_10"/>
			<property name="eclipselink.logging.logger" value="com.ejie.x38.log.SLF4JLogger" />
            <property name="eclipselink.logging.level" value="FINEST"/>
            <property name="eclipselink.weaving" value="false"/>
        </properties>       
    </persistence-unit>   
</persistence>
</#assign>
${classbody}