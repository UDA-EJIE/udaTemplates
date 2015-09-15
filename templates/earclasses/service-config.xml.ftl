<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:util="http://www.springframework.org/schema/util"
	xmlns:jee="http://www.springframework.org/schema/jee"
	xsi:schemaLocation="
	http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
	http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.0.xsd
	http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd">
	
	<!-- Application Message Bundle -->
	<bean id="appMessageSource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
		<property name="basename" value="${codapp}.i18n" />
		<property name="defaultEncoding" value="UTF-8"/>
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