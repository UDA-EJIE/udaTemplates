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
<wls:weblogic-application
	xmlns:wls="http://xmlns.oracle.com/weblogic/weblogic-application"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="
		http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/javaee_5.xsd 
		http://xmlns.oracle.com/weblogic/weblogic-application 
		http://xmlns.oracle.com/weblogic/weblogic-application/1.2/weblogic-application.xsd">
	<!--weblogic-version:10.3.5-->
	<wls:application-param>
		<wls:param-name>webapp.encoding.default</wls:param-name>
		<wls:param-value>UTF-8</wls:param-value>
	</wls:application-param>
	<wls:session-descriptor>
		<wls:persistent-store-type>replicated_if_clustered</wls:persistent-store-type>
	</wls:session-descriptor>
    <wls:prefer-application-packages>	
<#if radjpa>
		<wls:package-name>org.eclipse.persistence.*</wls:package-name>
</#if>
		<wls:package-name>org.apache.xerces.*</wls:package-name>
		<wls:package-name>org.apache.xerces.jaxp.*</wls:package-name>
		<wls:package-name>javax.persistence.*</wls:package-name>
	</wls:prefer-application-packages>
</wls:weblogic-application>