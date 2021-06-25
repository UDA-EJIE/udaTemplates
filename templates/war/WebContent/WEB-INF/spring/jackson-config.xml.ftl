<#-- 
* Copyright 2021 E.J.I.E., S.A.
*
* Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
* Solo podrá usarse esta obra si se respeta la Licencia.
* Puede obtenerse una copia de la Licencia en
*
* http://ec.europa.eu/idabc/eupl.html
*
* Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
* el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
* SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
* Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
* que establece la Licencia.
 -->
<?xml version="1.0" encoding="utf-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:mvc="http://www.springframework.org/schema/mvc"
	xmlns:p="http://www.springframework.org/schema/p"
	xmlns:c="http://www.springframework.org/schema/c"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:util="http://www.springframework.org/schema/util"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.3.xsd 
		http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-4.3.xsd 
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.3.xsd
		http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-4.3.xsd">


	<!-- Serializador utilizado por UDA  -->
    <bean id="customSerializer" class="com.ejie.x38.serialization.CustomSerializer" />  
    
    <!-- Serializador utilizado por Hdiv  -->
    <bean id="secureSerializerModule" class="com.ejie.x38.serialization.HdivSecureModule" />  
    
    <bean id="udaMappingJackson2HttpMessageConverter" class="com.ejie.x38.serialization.UdaMappingJackson2HttpMessageConverter">
		<property name="supportedMediaTypes" ref="jacksonSupportedMediaTypes" />
		<property name="udaModule" ref="udaModule" />
	</bean>
    
    <!-- Modulo de UDA para Jackson -->
    <bean id="udaModule" class="com.ejie.x38.serialization.UdaModule" >
    	<#if listaClases!=''>
    	<property name="serializers">
			<util:map>
				<#foreach reg in listaClases>
					<entry key="<#noparse>#{T</#noparse>(com.ejie.${codapp}.model.${ctrUtils.stringCapitalize(reg)})<#noparse>}</#noparse>" value-ref="customSerializer" />
				</#foreach>
			</util:map>
      	</property>
		</#if>      	
      	<property name="serializationInclusions" ref="serializationInclusions" />
      	<property name="serializationFeature" ref="serializationFeature" />
      	<property name="deserializationFeature" ref="deserializationFeature" />
	</bean>
	
	<!-- MediaTypes soportados por jackson -->
	<util:list id="jacksonSupportedMediaTypes">
		<bean class="org.springframework.http.MediaType">
			<constructor-arg value="text" />
			<constructor-arg value="plain" />
			<constructor-arg
				value="<#noparse>#{T(org.springframework.http.converter.json.MappingJackson2HttpMessageConverter).DEFAULT_CHARSET}</#noparse>" />
		</bean>
		<bean class="org.springframework.http.MediaType">
			<constructor-arg value="application" />
			<constructor-arg value="json" />
			<constructor-arg
				value="<#noparse>#{T(org.springframework.http.converter.json.MappingJackson2HttpMessageConverter).DEFAULT_CHARSET}</#noparse>" />
		</bean>
	</util:list>
	
	<!-- Features de configuracion de la serializacion -->
	<util:map id="serializationFeature">
		<entry key="<#noparse>#{T(com.fasterxml.jackson.databind.SerializationFeature).ORDER_MAP_ENTRIES_BY_KEYS}</#noparse>" value="true" />
	</util:map>
	
	<!-- Features de configuracion de la deserializacion -->
	<util:map id="deserializationFeature">
		<entry key="<#noparse>#{T(com.fasterxml.jackson.databind.DeserializationFeature).FAIL_ON_UNKNOWN_PROPERTIES}</#noparse>" value="false" />
	</util:map>
	
	<!-- Inclusiones de serializacion -->
	<util:list id="serializationInclusions">
<!-- 		<value type="org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion">NON_NULL</value> -->
	</util:list>
	
</beans>