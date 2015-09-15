<?xml version="1.0" encoding="UTF-8"?>
<#if annot=0>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:util="http://www.springframework.org/schema/util"
	xmlns:jee="http://www.springframework.org/schema/jee"
	xsi:schemaLocation="
	http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
	http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.0.xsd
	http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd">
<#else>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:util="http://www.springframework.org/schema/util"
	xmlns:jee="http://www.springframework.org/schema/jee" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.0.xsd http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd
	http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd">
</#if>

    	<!-- Application Message Bundle -->
		<bean id="appMessageSource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
			<property name="basename" value="${proyectName}.i18n" />
			<property name="defaultEncoding" value="UTF-8"/>
		</bean> 	
		<!-- Application Configuration Properties -->
		<bean id="appConfiguration" class="org.springframework.beans.factory.config.PropertiesFactoryBean">
	            <property name="location" value="classpath:${proyectName}/${proyectName}.properties"/>
	            <property name="fileEncoding" value="UTF-8"/>
	    </bean>
        
	<#if annot=0>
      <#assign listClas = listaClases>
	  <#assign claseAnt=''>
	  <#assign lista = listClas>
			 <#list lista as reg>
			    <#if claseAnt!=''>
					<#if reg[2] != claseAnt>
						</bean>			
					</#if>
				</#if>	
			    <#if reg[2] != claseAnt>
			     <bean id="${reg[2]}" class="${reg[0]}Impl">
			    </#if>
					<property name="${reg[1]}" ref="${reg[1]}" />
			    	<#if reg[2] != claseAnt>
						<#assign claseAnt=reg[2]>
						
					</#if>
				<#if claseAnt=''>
				 <#assign claseAnt=reg[2]>
				</#if>
			  <#if !reg_has_next>
			      </bean>
			  </#if>	
			 </#list>
	<#else>
		   <!-- Scans the classpath of this application for @Service to deploy as beans --> 
           <context:component-scan base-package="com.ejie.${proyectName}.service" />

   	</#if>
</beans>