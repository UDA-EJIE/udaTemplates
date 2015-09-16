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
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:util="http://www.springframework.org/schema/util"
	xmlns:jee="http://www.springframework.org/schema/jee"
	xsi:schemaLocation="
	http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
	http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.1.xsd
	http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.1.xsd
	http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd">

<#assign listClas = listaClases>
<#assign claseAnt=''>
<#assign lista = listClas>
<#list lista as reg>
	<#if claseAnt!=''>
		<#if reg[2] != claseAnt>
			</bean>			
		</#if>
	</#if>	
	<#if reg[2] != claseAnt>
 		<bean id="${reg[2]}" class="${reg[0]}Impl">
	</#if>
		<property name="${reg[1]}" ref="${reg[1]}" />
	<#if reg[2] != claseAnt>
		<#assign claseAnt=reg[2]>
	</#if>
	<#if claseAnt=''>
 		<#assign claseAnt=reg[2]>
	</#if>
  	<#if !reg_has_next>
  		</bean>
  	</#if>	
</#list>
</beans>