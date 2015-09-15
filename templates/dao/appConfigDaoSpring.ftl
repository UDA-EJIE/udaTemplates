<?xml version="1.0" encoding="UTF-8"?>
<#if annot=0>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"    
	xmlns:jee="http://www.springframework.org/schema/jee"
    xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
		http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd">
<#else>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
      xmlns:jee="http://www.springframework.org/schema/jee"
      xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
            http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd
            http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd">
</#if>

	<jee:jndi-lookup id="dataSource" jndi-name="${proyectName}.${proyectName}DataSource" resource-ref="false" />
	<#if annot=0>
   	
		<#assign listClas = listaClases>
			 <#foreach reg in listClas>
				 <bean id="${reg[1]}" class="${reg[0]}Impl">
					<property name="dataSource" ref="dataSource" />
			</bean>		
			 </#foreach>
	<#else>
	      <!-- Scans the classpath of this application for @Repository to deploy as beans -->
          <context:component-scan base-package="com.ejie.${proyectName}.dao" />
	</#if>		 
   	
</beans>