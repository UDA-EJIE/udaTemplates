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

	<!-- Crea un bean por cada clase anotada con @Repository -->
    <context:component-scan base-package="com.ejie.${codapp}.dao" />
    
<#if radjpa>
	<bean class="org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor" />
	<bean class="org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor" />
	<bean id="jtaEntityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="persistenceUnitName" value="${codapp?upper_case}_JTA" />
		<property name="persistenceXmlLocation" value="classpath:META-INF/udaPersistence.xml" />
		<property name="loadTimeWeaver"> 
			<bean class="org.springframework.instrument.classloading.weblogic.WebLogicLoadTimeWeaver"/> 
		</property> 
		<property name="jpaVendorAdapter">		
			<bean class="org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter">
				<property name="database" value="ORACLE" />
				<property name="showSql" value="true" />
			</bean>
		</property>
	</bean>	
<#else>
	<jee:jndi-lookup id="dataSource" jndi-name="${codapp?lower_case}.${codapp?lower_case}DataSource" resource-ref="false" />
</#if>
</beans>
