<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:security="http://www.springframework.org/schema/security"
	xmlns:util="http://www.springframework.org/schema/util"
	xsi:schemaLocation="
            http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
            http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd">
	
	<security:global-method-security>
        <security:protect-pointcut expression="execution(* com.ejie.*.service..*.find*(..))" access="${codroleAux}"/>
		<security:protect-pointcut expression="execution(* com.ejie.*.service..*.add*(..))"  access="${codroleAux}"/>
        <security:protect-pointcut expression="execution(* com.ejie.*.service..*.remove*(..))" access="${codroleAux}"/>
        <security:protect-pointcut expression="execution(* com.ejie.*.service..*.update*(..))" access="${codroleAux}"/>
	</security:global-method-security>
</beans>