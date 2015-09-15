<?xml version="1.0" encoding="UTF-8"?>
<#if annot=0>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"    
    xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">	
<#else>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
      xmlns:jee="http://www.springframework.org/schema/jee"
      xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
            http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd
            http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd">
</#if>	
	<bean class="org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor" />
	<bean class="org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor" />
	
	<#-- <bean id="resourceLocalEntityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="persistenceUnitName" value="${proyectName?upper_case}_RESOURCE_LOCAL" />
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
	</bean>	 -->
	
	<bean id="jtaEntityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="persistenceUnitName" value="${proyectName?upper_case}_JTA" />
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
	<#if annot=0>
	 <#assign listClas = listaClases>
			 <#foreach reg in listClas>
				 <bean id="${reg[1]}" class="${reg[0]}Impl" />	
			 </#foreach>
	<#else>
	      <!-- Scans the classpath of this application for @Repository to deploy as beans -->
          <context:component-scan base-package="com.ejie.${proyectName}.dao" />		 
   	</#if>
</beans>

