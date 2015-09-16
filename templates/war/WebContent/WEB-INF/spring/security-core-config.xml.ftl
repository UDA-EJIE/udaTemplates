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
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:security="http://www.springframework.org/schema/security"
	xsi:schemaLocation="http://www.springframework.org/schema/security
		http://www.springframework.org/schema/security/spring-security-3.1.xsd
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-3.1.xsd">

	<bean id="springSecurityFilterChain" 
	  class="org.springframework.security.web.FilterChainProxy">
	  <security:filter-chain-map request-matcher="regex">
	  	<security:filter-chain pattern="/error.*" filters="none"/>
		<security:filter-chain pattern="/accessDenied.*" filters="none"/>
		<security:filter-chain pattern="/mockLoginPage.*" filters="none"/>
	  	<security:filter-chain pattern="/mockLoginAjaxPage.*" filters="none"/>
		<security:filter-chain pattern="**" filters="	    	
	    	exceptionTranslationFilter,
	    	securityContextPersistenceFilter,
	    	logoutFilter,
	    	preAuthenticateProcessingFilter,
	    	filterSecurityInterceptor" />
	  </security:filter-chain-map>
	</bean>

	<bean id="securityContextPersistenceFilter" class="org.springframework.security.web.context.SecurityContextPersistenceFilter"/>
	
	<!-- Se configura el filtro que gestiona el "logout" -->
	<bean id="logoutFilter" class="org.springframework.security.web.authentication.logout.LogoutFilter">
		<!-- the post-logout destination -->
		<constructor-arg value="/" />
		<constructor-arg>
			<array>
				<ref local="myLogoutHandler" />
			</array>
		</constructor-arg>
		<property name="filterProcessesUrl" value="/logout" />
	</bean>
	
	<!-- Para la completa interacción con XLNets se especifica un "logoutHandler" especifico -->
	<bean id="myLogoutHandler" class="com.ejie.x38.security.MyLogoutHandler">
		<property name="perimetralSecurityWrapper" ref="perimetralSecurityWrapper" />
		<property name="invalidateHttpSession" value="true" />
		<property name="invalidateUserSession" value="true" />
	</bean>

	<!-- Se define el sistema especifico de autenticación aplicado al sistema de seguridad -->
	<!-- Se define que con cambios de usurio se recargen los datos de seguridad y se mate la session, cual es el "perimetralSecurityWrapper" y el "authenticationManager" -->
	<bean id="preAuthenticateProcessingFilter" class="com.ejie.x38.security.PreAuthenticateProcessingFilter">
		<property name="checkForPrincipalChanges" value="true" />
		<property name="invalidateSessionOnPrincipalChange" value="true" />
		<property name="perimetralSecurityWrapper" ref="perimetralSecurityWrapper" />
		<property name="authenticationManager" ref="authenticationManager" />
	</bean>
	
	<!-- El "authenticationManager" es el componente encargado de implementar el proceso de autenticación -->
	<security:authentication-manager alias="authenticationManager">
		<security:authentication-provider
			ref="xlnetAuthenticationProvider" />
	</security:authentication-manager>
	
	<!-- El bean "xlnetAuthenticationProvider" es el "authentication-provider" del sistema de login -->
	<!-- El "authentication-provider" determina el objeto "UserDetail" encargado de recoger y servir los datos de seguridad -->
	<bean id="xlnetAuthenticationProvider" class="com.ejie.x38.security.XlnetAuthenticationProvider">
		<property name="myAuthenticatedUserDetailsService" ref="myAuthenticatedUserDetailsService" />
	</bean>
	
	<!-- Además de especificarse la clase encargada de almacenar los datos de seguridad -->
	<!-- se determina que la interacción con el "loggin provider" es mediante un Wrapper especifico (se determina cual en el security-config.xml) -->
	<bean id="myAuthenticatedUserDetailsService" class="com.ejie.x38.security.MyAuthenticatedUserDetailsService">
		<property name="perimetralSecurityWrapper" ref="perimetralSecurityWrapper" />
	</bean>

	<!-- Este filtro se encarga de recoger y gestionar todas las excepciones producidas durante la gestión de la seguridad -->
	<bean id="exceptionTranslationFilter" class="org.springframework.security.web.access.ExceptionTranslationFilter">
	  <property name="authenticationEntryPoint" ref="myAuthenticationEntryPoint"/>
	  <property name="accessDeniedHandler" ref="myAccessDeniedHandler"/>
	</bean>
	
	<!-- Se define el "AuthenticationEntryPoint" (encargado de proveer el punto de entrada para la autenticación de los usuarios)  -->
	<!-- Cuando el filtro "ExceptionTranslationFilter" determina que requiere de una autenticación, el redirecciona al punto (ruta)del sistema de autenticación -->
	<bean id="myAuthenticationEntryPoint" class="com.ejie.x38.security.MyAuthenticationEntryPoint">
		<property name="perimetralSecurityWrapper" ref="perimetralSecurityWrapper" />
	</bean>
	
	<!-- Se define el "AccessDeniedHandler" que gestiona los casos en los que el usuario no tiene los permisos necesarios -->
	<!-- Por defecto, se configura para que se redireccione a una pagina de error (/accessDenied) -->
	<bean id="myAccessDeniedHandler" class="com.ejie.x38.security.MyAccessDeniedHandler">
		<property name="errorPage" value="/accessDenied" />
	</bean> 
	
	<!-- Conjunto de parametrizaciones para determinar la metódica de decisión a la hora de permitir el acceso al sistema -->
	<bean id="affirmativeBased" class="org.springframework.security.access.vote.AffirmativeBased">
		<property name="decisionVoters">
			<list>
				<ref bean="expressionVoter" />
			</list>
		</property>
	</bean>
	
	<!-- El "expressionVoter" determina el tipo de gestión que se hace para permitir o no el acceso a recursos -->
	<!-- Por defecto, se parametriza para que tenga que cumplir alguna de las condiciones especificadas (tener alguna de las instancias) -->
	<bean id="expressionVoter" class="org.springframework.security.web.access.expression.WebExpressionVoter">
		<property name="expressionHandler" ref="expressionHandler" />
	</bean>
	<bean id="expressionHandler" class="org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler"/>

</beans>