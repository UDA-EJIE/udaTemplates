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
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:util="http://www.springframework.org/schema/util"
	xmlns:jee="http://www.springframework.org/schema/jee"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="
	http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
	http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.1.xsd
	http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.1.xsd
	http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd">
	
	<!-- Crea un bean por cada clase anotada con @Service -->
	<context:component-scan base-package="com.ejie.${codapp}.service" />
           
	<!-- Application Message Bundle -->
	<bean id="appMessageSource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
		<property name="basename" value="${codapp}.i18n" />
		<property name="defaultEncoding" value="UTF-8"/>
		<property name="useCodeAsDefaultMessage" value="true" />
        <property name="fallbackToSystemLocale" value="false" />
	</bean> 	
	
	<!-- Application Configuration Properties -->
	<bean id="appConfiguration" class="org.springframework.beans.factory.config.PropertiesFactoryBean">
            <property name="location" value="classpath:${codapp}/${codapp}.properties"/>
            <property name="fileEncoding" value="UTF-8"/>
    </bean>
	
	<bean id="remoteEJBFactory" class="com.ejie.x38.remote.RemoteEJBFactoryImpl">
		<property name="appConfiguration" ref="appConfiguration" />
	</bean>
</beans>