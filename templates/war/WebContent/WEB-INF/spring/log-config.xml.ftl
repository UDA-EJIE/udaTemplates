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
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="
            http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.1.xsd
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd">

	<bean id="udaFilter" class="com.ejie.x38.UdaFilter" />
	
	<bean id="webContextParameterManager" class="com.ejie.x38.util.WebContextParameterManager" />
	
	<bean id="webLoggingManager" class="com.ejie.x38.log.LoggingManagerImpl" />
	
	<bean id="filterLoggingAdvice" class="com.ejie.x38.log.FilterLoggingAdviceImpl">
		<property name="loggingManager" ref="webLoggingManager"/>
	</bean>
	
	<bean id="webMainAdvice" class="com.ejie.x38.aop.MainAdvice">
		<property name="filterLoggingAdvice" ref="filterLoggingAdvice" />
	</bean>
	
</beans>