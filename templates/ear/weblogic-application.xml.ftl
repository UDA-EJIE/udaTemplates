<?xml version="1.0" encoding="UTF-8"?>
<wls:weblogic-application
	xmlns:wls="http://xmlns.oracle.com/weblogic/weblogic-application"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/javaee_5.xsd http://xmlns.oracle.com/weblogic/weblogic-application http://xmlns.oracle.com/weblogic/weblogic-application/1.0/weblogic-application.xsd">
	<!--weblogic-version:10.3.1 -->
	<wls:application-param>
		<wls:param-name>webapp.encoding.default</wls:param-name>
		<wls:param-value>UTF-8</wls:param-value>
	</wls:application-param>
    <wls:prefer-application-packages>	
<#if radjpa>
		<wls:package-name>javax.persistence.*</wls:package-name>
		<wls:package-name>org.eclipse.persistence.*</wls:package-name>
</#if>
		<wls:package-name>org.apache.xerces.*</wls:package-name>
		<wls:package-name>org.apache.xerces.jaxp.*</wls:package-name> 
<#if entornoEjie != "">
		<!--<wls:package-name>org.apache.log4j.*</wls:package-name>-->
<#else>
		<wls:package-name>org.apache.log4j.*</wls:package-name>
</#if>
	</wls:prefer-application-packages>
</wls:weblogic-application>