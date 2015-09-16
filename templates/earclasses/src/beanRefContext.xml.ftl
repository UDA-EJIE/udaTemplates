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
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd">

	<!-- contents of beanRefContext.xml: notice that the bean id is the value 
		specified by the parentContextKey param -->
	<bean id="ear.context"
		class="org.springframework.context.support.ClassPathXmlApplicationContext">
		<constructor-arg>
			<list>
				<value>spring/dao-config.xml</value>
				<value>spring/log-config.xml</value>
				<value>spring/service-config.xml</value>
				<value>spring/security-config.xml</value>				
				<value>spring/tx-config.xml</value>
			</list>
		</constructor-arg>
	</bean>	
</beans>