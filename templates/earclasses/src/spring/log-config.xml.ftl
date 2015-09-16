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
		
	<!-- Se especifica la inicializacion de los log's mediante logback -->
	<bean id="logSystemInitializer" class="org.springframework.beans.factory.config.MethodInvokingFactoryBean">  
		<property name="staticMethod" value="com.ejie.x38.log.LogbackConfigurer.initLogging" />  
   		<property name="arguments">  
      		<list>  
      			<!-- Se especifica la ubicación del fichero de configuración de logback (puede ser una ruta del classpath o absoluta) -->
        		<value>${codapp}/logback.xml</value>
        		<!-- Se especifica si se desea que se pinte el estado de la configuración de logback por la salida de log correspondiente -->
        		<value>true</value>
      		</list>  
   		</property>  
	</bean>
		
	<!-- Se configuran los aspectos que gestionaran las trazas en las distintas capas de la aplicación (services, dao,...) -->
	<bean id="loggingManager" class="com.ejie.x38.log.LoggingManagerImpl" />
	
	<bean id="serviceLoggingAdvice" class="com.ejie.x38.log.ServiceLoggingAdviceImpl">
		<property name="loggingManager" ref="loggingManager"/>
	</bean>
	
	<bean id="daoLoggingAdvice" class="com.ejie.x38.log.DaoLoggingAdviceImpl">
		<property name="loggingManager" ref="loggingManager"/>
	</bean>
	
	<bean id="incidenceLoggingAdvice" class="com.ejie.x38.log.IncidenceLoggingAdviceImpl" >
		<property name="loggingManager" ref="loggingManager"/>
	</bean>
	
	<bean id="mainAdvice" class="com.ejie.x38.aop.MainAdvice">
		<property name="serviceLoggingAdvice" ref="serviceLoggingAdvice" />
		<property name="daoLoggingAdvice" ref="daoLoggingAdvice" />
		<property name="incidenceLoggingAdvice" ref="incidenceLoggingAdvice" />
	</bean>
	
	<aop:config>
		<aop:pointcut id="serviceCall"
			expression="execution(*
			com.ejie.*.service..*.*(..))" />
		<aop:aspect id="serviceLogAspect" ref="mainAdvice">
			<aop:around pointcut-ref="serviceCall" method="serviceLogCall" />
		</aop:aspect>
	</aop:config>
	
	<aop:config>
		<aop:pointcut id="daoCall"
			expression="execution(*
			com.ejie.*.dao..*.*(..))" />
		<aop:aspect id="daoLogAspect" ref="mainAdvice">
			<aop:around pointcut-ref="daoCall" method="daoLogCall" />
		</aop:aspect>
	</aop:config>

	<aop:config>
		<aop:pointcut id="incidenceCreation"
			expression="execution(* com.ejie.*.service..*.*(..)) &amp;&amp;target(target)" />
		<aop:aspect id="incidenceLogAspect" ref="mainAdvice">
			<aop:after-throwing throwing="exception"
				pointcut-ref="incidenceCreation" method="logIncidence" />
		</aop:aspect>
	</aop:config>
</beans>