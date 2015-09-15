<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"    
<#if radjpa>
    xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">	
	
	<bean class="org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor" />
	<bean class="org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor" />
	
	<#-- <bean id="resourceLocalEntityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="persistenceUnitName" value="${codapp?upper_case}_RESOURCE_LOCAL" />
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
	</bean>	-->
	
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
	xmlns:jee="http://www.springframework.org/schema/jee"
    xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
		http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd">

		<jee:jndi-lookup id="dataSource" jndi-name="${codapp?lower_case}.${codapp?lower_case}DataSource" resource-ref="false" />
</#if>
</beans>

