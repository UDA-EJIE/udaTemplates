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

<configuration>

	<!-- ContextName of aplication -->
	<contextName>${codapp}</contextName>
	
	<!-- Loaded of the properties file of the application -->
	<property resource="<#noparse>${CONTEXT_NAME}</#noparse>/<#noparse>${CONTEXT_NAME}</#noparse>.properties" />
	
	<!-- Definition of the default appenders -->
 	<!-- appender name="defaultOut" class="ch.qos.logback.core.ConsoleAppender"-->
  	<appender name="defaultOutAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
    	<File><#noparse>${log.path}</#noparse>/salidaEstandar_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.log</File>
    	<encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
    		<layout class="com.ejie.x38.log.LogLayout">
    			<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
        		<instance><#noparse>${weblogic.Name}</#noparse></instance>	
    		</layout>
    	</encoder>
    	<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      		<!-- rollover daily -->
     		<fileNamePattern><#noparse>${log.path}</#noparse>/salidaEstandar_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
      		<timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
				<maxFileSize>100MB</maxFileSize>
			</timeBasedFileNamingAndTriggeringPolicy>
      		<!-- 7-day history -->
      		<maxHistory>6</maxHistory>
		</rollingPolicy>
  	</appender>
		
	<!-- Root logger -->
  	<root level="<#noparse>${log.level.salidaEstandar}</#noparse>">
		<appender-ref ref="defaultOutAppender"/>
	</root>
	
</configuration>
