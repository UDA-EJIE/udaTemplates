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
<?xml version="1.0" encoding="utf-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:security="http://www.springframework.org/schema/security"
xmlns:util="http://www.springframework.org/schema/util"
xsi:schemaLocation="http://www.springframework.org/schema/security
		http://www.springframework.org/schema/security/spring-security-3.1.xsd
		http://www.springframework.org/schema/beans
		http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
		http://www.springframework.org/schema/util
		http://www.springframework.org/schema/util/spring-util.xsd">
		
<#if idSecurity != "">
	<!-- Especificar un valor entre 0 (no cacheo - peticiones continuas) y 600 segundos -->
	<bean id="perimetralSecurityWrapper" class="com.ejie.x38.security.PerimetralSecurityWrapperN38Impl">		
		<property name="xlnetCachingPeriod" value="120" />
	</bean>
<#else>
	<bean id="perimetralSecurityWrapper" class="com.ejie.x38.security.PerimetralSecurityWrapperMockImpl">
		<property name="principal">
			<list>
				<map>
					<entry key="userName" value="USER_${codrole}"/>
					<entry key="name" value="${codrole}"/>
					<entry key="surname" value="User"/>
					<entry key="fullName" value="${codrole} User"/>
					<entry key="nif" value="17398234h"/>
					<entry key="nif" value="00000001R"/>
					<entry key="policy" value="1"/>
					<entry key="position" value="01"/>
					<entry key="isCertificate" value="no"/>
					<entry key="roles">
						<list>
							<value>${codrole}</value>
						</list>
					</entry>
				</map>
			</list>
		</property>
	</bean>
</#if>

	<bean id="filterSecurityInterceptor"
	        class="org.springframework.security.web.access.intercept.FilterSecurityInterceptor">
	  <property name="authenticationManager" ref="authenticationManager"/>
	  <property name="accessDecisionManager" ref="affirmativeBased"/>
	  <property name="securityMetadataSource">
		<security:filter-security-metadata-source use-expressions="true" request-matcher="regex">
			<security:intercept-url pattern="/**" access=""/>
			<security:intercept-url pattern="/logout" access="isAuthenticated()" />
			<#if listaClases!=''>
				<#assign listClas = listaClases>
					<#foreach reg in listClas>
<!--				<security:intercept-url pattern="/${reg?lower_case}/*" access="${codroleAux}"/> -->
					</#foreach>
			</#if>
		 </security:filter-security-metadata-source>
	  </property>
	</bean>
	
</beans>