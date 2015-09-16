<#-- 
 -- Copyright 2013 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, VersiÃ³n 1.1 exclusivamente (la Â«LicenciaÂ»);
 -- Solo podrÃ¡ usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislaciÃ³n aplicable o se acuerde por escrito, 
 -- el programa distribuido con arreglo a la Licencia se distribuye Â«TAL CUALÂ»,
 -- SIN GARANTÃAS NI CONDICIONES DE NINGÃšN TIPO, ni expresas ni implÃ­citas.
 -- VÃ©ase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
 <beans xmlns="http://www.springframework.org/schema/beans"
 	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 	xmlns:p="http://www.springframework.org/schema/p"
 	xsi:schemaLocation="
  		http://www.springframework.org/schema/beans
  		http://www.springframework.org/schema/beans/spring-beans-3.1.xsd">	
 
 	<!-- UDA exporters -->
	<bean id="csvReport" class="com.ejie.x38.reports.CSVReportView" />
	<bean id="odsReport" class="com.ejie.x38.reports.ODSReportView" />
	<bean id="xlsReport" class="com.ejie.x38.reports.XLSReportView" />
	<bean id="xlsxReport" class="com.ejie.x38.reports.XLSXReportView" />

 	<!-- PDF (Jasper) 
  	<bean id="pdfUsuario" p:url="/WEB-INF/resources/reports/usuario.jasper"	
  			class="com.ejie.x38.reports.PDFReportView" />
  	-->
</beans>