<?xml version="1.0" encoding="utf-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:mvc="http://www.springframework.org/schema/mvc"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd">
	
	<!-- Scans the classpath of this application for @Components to deploy as beans -->
	<context:component-scan base-package="com.ejie.${proyectName?lower_case}.control" />

	<!-- Maps requests to @Controllers based on @RequestMapping("path") annotation values -->
	<bean class="org.springframework.web.servlet.mvc.annotation.DefaultAnnotationHandlerMapping">
		<property name="order" value="1" />
	</bean>

	<!-- Enables annotated @Controllers; responsible for invoking an annotated POJO @Controller when one is mapped. -->
	<bean class="org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter">
		<property name="messageConverters">
			<list>
				<bean class="com.ejie.x38.serialization.UdaMappingJacksonHttpMessageConverter">
					<property name="jacksonJsonObjectMapper" ref="jacksonJsonObjectMapper" />
				</bean>
			</list>
		</property>
	</bean>

	<bean id="jacksonJsonObjectMapper" class="com.ejie.x38.serialization.CustomObjectMapper">
		<property name="customSerializerFactory" ref="jacksonJsonCustomSerializerFactory" />
	</bean>

	<bean id="customSerializer" class="com.ejie.x38.serialization.CustomSerializer" />
	
	<!-- Configures Handler Interceptors -->
	<mvc:interceptors>
		<!-- Changes the locale when a 'locale' request parameter is sent; e.g. /?locale=en -->
		<bean class="org.springframework.web.servlet.i18n.LocaleChangeInterceptor" />
	</mvc:interceptors>	
	
	<!-- Saves a locale change using a cookie -->
	<bean id="localeResolver"
		class="org.springframework.web.servlet.i18n.CookieLocaleResolver">
		<property name="cookieName">
			<value>language</value>
		</property>
	</bean>	
	<mvc:view-controller path="/" view-name="welcome" />
	<mvc:view-controller path="/error" view-name="error" />
	<mvc:view-controller path="/accessDenied" view-name="accessDenied" />
	
	<!-- Web Module Message Bundle -->
    <bean id="messageSource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
    	<property name="parentMessageSource" ref="appMessageSource" />
        <property name="basename" value="/WEB-INF/resources/${nombreWar}.i18n" />
        <property name="defaultEncoding" value="UTF-8"/>
    </bean>
	
	<bean id="tilesConfigurer"
		class="org.springframework.web.servlet.view.tiles2.TilesConfigurer">
		<property name="definitions">
			<list>
				<value>/WEB-INF/views/tiles.xml</value>
			</list>
		</property>
	</bean>
	<bean id="viewResolver"
		class="org.springframework.web.servlet.view.UrlBasedViewResolver">
		<property name="viewClass"
			value="org.springframework.web.servlet.view.tiles2.TilesView" />
	</bean>
	 
		<bean id="jacksonJsonCustomSerializerFactory" class="com.ejie.x38.serialization.CustomSerializerFactoryRegistry">
			<property name="serializers">
				<map>
				<#foreach reg in listaClases>
					<entry key="com.ejie.${codapp}.model.${ctrUtils.stringCapitalize(reg[2])}" value-ref="customSerializer" />
				</#foreach>	
				</map>
			</property>
		</bean>		
    
	 <#if annot=0>
		 <#assign listClas = listaClases>
			 <#foreach reg in listClas>
				 <bean id="${reg[2]?lower_case}Controller" class="${reg[0]}">
					<property name="${reg[1]}" ref="${reg[1]}" />
					<property name="appConfiguration" ref="appConfiguration" />
			</bean>		
			 </#foreach>	
	</#if>
</beans>