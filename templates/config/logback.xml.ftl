<#--
 -- Copyright 2021 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 -- http://ec.europa.eu/idabc/eupl.html
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
	
	<!-- Definition of StatusListener that manages the StatusManager -->
	<statusListener class="com.ejie.x38.log.UdaLogStatusListener" />  
 	
 	<!-- Definition of the aplic appenders -->
 	
 	<!-- General output -->
 	<!-- appender name="traceSystem" class="ch.qos.logback.core.ConsoleAppender"-->
  	<appender name="salidaEstandarAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
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
  	
	<appender name="incidenciasAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
    	<File><#noparse>${log.path}</#noparse>/incidencias_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.log</File>
    	<filter class="com.ejie.x38.log.UdaLogFilter">
      		<logIncidences>true</logIncidences>
    	</filter>
    	<encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
	    	<layout class="com.ejie.x38.log.LogLayout">
	    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
	        	<instance><#noparse>${weblogic.Name}</#noparse></instance>	
	    	</layout>
	    </encoder>
    	<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- rollover daily -->
			<fileNamePattern><#noparse>${log.path}</#noparse>/incidencias_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
			<timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
				<maxFileSize>100MB</maxFileSize>
			</timeBasedFileNamingAndTriggeringPolicy>
			<!-- 7-day history -->
      		<maxHistory>6</maxHistory>
		</rollingPolicy>
  	</appender>
  	
 	<appender name="udaTrazasAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<File><#noparse>${log.path}</#noparse>/udaTrazas_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.log</File>
		<filter class="com.ejie.x38.log.UdaLogFilter"/>
		<encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
			<layout class="com.ejie.x38.log.LogLayout">
	    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
	        	<instance><#noparse>${weblogic.Name}</#noparse></instance>	
	    	</layout>
	    </encoder>
	    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- rollover daily -->
			<fileNamePattern><#noparse>${log.path}</#noparse>/udaTrazas_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
			<timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
				<maxFileSize>100MB</maxFileSize>
			</timeBasedFileNamingAndTriggeringPolicy>
			<!-- 7-day history -->
      		<maxHistory>6</maxHistory>
		</rollingPolicy>
	</appender>
	 
	<appender name="aplicTrazasAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<File><#noparse>${log.path}</#noparse>/<#noparse>${CONTEXT_NAME}</#noparse>Trazas_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.log</File>
		<filter class="com.ejie.x38.log.UdaLogFilter"/>
		<encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">	
			<layout class="com.ejie.x38.log.LogLayout">
	    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
	        	<instance><#noparse>${weblogic.Name}</#noparse></instance>	
	    	</layout>
	    </encoder>
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- rollover daily -->
			<fileNamePattern><#noparse>${log.path}</#noparse>/<#noparse>${CONTEXT_NAME}</#noparse>Trazas_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
			<timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
				<maxFileSize>100MB</maxFileSize>
			</timeBasedFileNamingAndTriggeringPolicy>
			<!-- 7-day history -->
      		<maxHistory>6</maxHistory>
		</rollingPolicy>
  	</appender>
  	
	<appender name="auditoriaAccesosAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
    	<File><#noparse>${log.path}</#noparse>/auditoriaAccesos_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.log</File>
    	<filter class="com.ejie.x38.log.UdaLogFilter"/>
    	<encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
	    	<layout class="com.ejie.x38.log.LogLayout">
	    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
	        	<instance><#noparse>${weblogic.Name}</#noparse></instance>	
	    	</layout>
	    </encoder>
    	<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- rollover daily -->
			<fileNamePattern><#noparse>${log.path}</#noparse>/auditoriaAccesos_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
			<timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
				<maxFileSize>100MB</maxFileSize>
			</timeBasedFileNamingAndTriggeringPolicy>
			<!-- 7-day history -->
      		<maxHistory>6</maxHistory>
		</rollingPolicy>
  	</appender>
  	
  	<#if entornoEjie != "">
	<appender name="salidaHdivAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<File><#noparse>${log.path}</#noparse>/salidaHdiv_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.log</File>
		<encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
			<layout class="com.ejie.x38.log.LogLayout">
				<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
				<instance><#noparse>${weblogic.Name}</#noparse></instance>	
			</layout>
		</encoder>
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- rollover daily -->
			<fileNamePattern><#noparse>${log.path}</#noparse>/salidaHdiv_<#noparse>${CONTEXT_NAME}</#noparse>_<#noparse>${weblogic.Name}</#noparse>.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
			<timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
				<maxFileSize>100MB</maxFileSize>
			</timeBasedFileNamingAndTriggeringPolicy>
			<!-- 7-day history -->
			<maxHistory>6</maxHistory>
		</rollingPolicy>
	</appender>
	
  	<!-- MOMO Appenders -->
  	
  	<appender name="salidaEstandarMomoAppender" class="com.ejie.x38.log.MomoAppender">
  	
  		<servicio><#noparse>${momo.servicio}</#noparse></servicio>
		<app><#noparse>${momo.app}</#noparse></app>
		<securityTokenId><#noparse>${momo.securityTokenId}</#noparse></securityTokenId>
		<w43taEndpointUri><#noparse>${momo.w43taEndpointUri}</#noparse></w43taEndpointUri>
		<w43taEndpointPort><#noparse>${momo.w43taEndpointPort}</#noparse></w43taEndpointPort>
		<develomentMode><#noparse>${momo.develomentMode}</#noparse></develomentMode>
		<doMomo><#noparse>${momo.doMomo.salidaEstandar}</#noparse></doMomo>
  	
   		<layout class="com.ejie.x38.log.LogLayout">
   			<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
       		<instance><#noparse>${weblogic.Name}</#noparse></instance>	
   		</layout>
  	</appender>
  	
	<appender name="incidenciasMomoAppender" class="com.ejie.x38.log.MomoAppender">
	
		<servicio><#noparse>${momo.servicio}</#noparse></servicio>
		<app><#noparse>${momo.app}</#noparse></app>
		<securityTokenId><#noparse>${momo.securityTokenId}</#noparse></securityTokenId>
		<w43taEndpointUri><#noparse>${momo.w43taEndpointUri}</#noparse></w43taEndpointUri>
		<w43taEndpointPort><#noparse>${momo.w43taEndpointPort}</#noparse></w43taEndpointPort>
		<develomentMode><#noparse>${momo.develomentMode}</#noparse></develomentMode>
		<doMomo><#noparse>${momo.doMomo.incidencias}</#noparse></doMomo>
	
    	<filter class="com.ejie.x38.log.UdaLogFilter">
      		<logIncidences>true</logIncidences>
    	</filter>
    	<layout class="com.ejie.x38.log.LogLayout">
    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
       		<instance><#noparse>${weblogic.Name}</#noparse></instance>	
    	</layout>
    	
  	</appender>
  	
 	<appender name="udaTrazasMomoAppender" class="com.ejie.x38.log.MomoAppender">
 	
 		<servicio><#noparse>${momo.servicio}</#noparse></servicio>
		<app><#noparse>${momo.app}</#noparse></app>
		<securityTokenId><#noparse>${momo.securityTokenId}</#noparse></securityTokenId>
		<w43taEndpointUri><#noparse>${momo.w43taEndpointUri}</#noparse></w43taEndpointUri>
		<w43taEndpointPort><#noparse>${momo.w43taEndpointPort}</#noparse></w43taEndpointPort>
		<develomentMode><#noparse>${momo.develomentMode}</#noparse></develomentMode>
		<doMomo><#noparse>${momo.doMomo.udaTrazas}</#noparse></doMomo>
 	
		<filter class="com.ejie.x38.log.UdaLogFilter"/>
		<layout class="com.ejie.x38.log.LogLayout">
    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
       		<instance><#noparse>${weblogic.Name}</#noparse></instance>	
    	</layout>
	</appender>
	 
	<appender name="aplicTrazasMomoAppender" class="com.ejie.x38.log.MomoAppender">
	
		<servicio><#noparse>${momo.servicio}</#noparse></servicio>
		<app><#noparse>${momo.app}</#noparse></app>
		<securityTokenId><#noparse>${momo.securityTokenId}</#noparse></securityTokenId>
		<w43taEndpointUri><#noparse>${momo.w43taEndpointUri}</#noparse></w43taEndpointUri>
		<w43taEndpointPort><#noparse>${momo.w43taEndpointPort}</#noparse></w43taEndpointPort>
		<develomentMode><#noparse>${momo.develomentMode}</#noparse></develomentMode>
		<doMomo><#noparse>${momo.doMomo.aplicTrazas}</#noparse></doMomo>
	
		<filter class="com.ejie.x38.log.UdaLogFilter"/>
		<layout class="com.ejie.x38.log.LogLayout">
    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
       		<instance><#noparse>${weblogic.Name}</#noparse></instance>	
    	</layout>
	    
  	</appender>
  	
	<appender name="auditoriaBBDDMomoAppender" class="com.ejie.x38.log.MomoAppender">
	
		<servicio><#noparse>${momo.servicio}</#noparse></servicio>
		<app><#noparse>${momo.app}</#noparse></app>
		<securityTokenId><#noparse>${momo.securityTokenId}</#noparse></securityTokenId>
		<w43taEndpointUri><#noparse>${momo.w43taEndpointUri}</#noparse></w43taEndpointUri>
		<w43taEndpointPort><#noparse>${momo.w43taEndpointPort}</#noparse></w43taEndpointPort>
		<develomentMode><#noparse>${momo.develomentMode}</#noparse></develomentMode>
		<doMomo><#noparse>${momo.doMomo.auditoriaAccesos}</#noparse></doMomo>
		
		<filter class="com.ejie.x38.log.UdaLogFilter"/>

		<layout class="com.ejie.x38.log.LogLayout">
    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
       		<instance><#noparse>${weblogic.Name}</#noparse></instance>
    	</layout>

  	</appender>
  	
	<appender name="auditoriaAccesosMomoAppender" class="com.ejie.x38.log.MomoAppender">
	
		<servicio><#noparse>${momo.servicio}</#noparse></servicio>
		<app><#noparse>${momo.app}</#noparse></app>
		<securityTokenId><#noparse>${momo.securityTokenId}</#noparse></securityTokenId>
		<w43taEndpointUri><#noparse>${momo.w43taEndpointUri}</#noparse></w43taEndpointUri>
		<w43taEndpointPort><#noparse>${momo.w43taEndpointPort}</#noparse></w43taEndpointPort>
		<develomentMode><#noparse>${momo.develomentMode}</#noparse></develomentMode>
		<doMomo><#noparse>${momo.doMomo.auditoriaAccesos}</#noparse></doMomo>
	
    	<filter class="com.ejie.x38.log.UdaLogFilter"/>
    	<layout class="com.ejie.x38.log.LogLayout">
    		<appCode><#noparse>${CONTEXT_NAME}</#noparse></appCode>
       		<instance><#noparse>${weblogic.Name}</#noparse></instance>
    	</layout>
  	</appender>
  	
  	<!--  END MOMO Appenders -->
  	
  	</#if>
  	
  	<!-- Root logger -->
	<root level="<#noparse>${log.level.salidaEstandar}</#noparse>">
	  <appender-ref ref="salidaEstandarAppender"/>
	  <appender-ref ref="incidenciasAppender"/>
	</root>
	
	<!-- Business loggers -->
	<logger name="com.ejie.x38" level="<#noparse>${log.level.udaTrazas}</#noparse>">
		<appender-ref ref="udaTrazasAppender"/>
		<#if entornoEjie != "">
		<appender-ref ref="udaTrazasMomoAppender"/>
		</#if>
	</logger>
	
	<logger name="com.ejie.<#noparse>${CONTEXT_NAME}</#noparse>" level="<#noparse>${log.level.aplicTrazas}</#noparse>">
		<appender-ref ref="aplicTrazasAppender"/>
		<#if entornoEjie != "">
		<appender-ref ref="aplicTrazasMomoAppender"/>
		</#if>
	</logger>
	
	<!-- Audit loggers -->
	<logger name="com.ejie.x38.UdaListener" level="<#noparse>${log.level.auditoriaAccesos}</#noparse>">
		<appender-ref ref="auditoriaAccesosAppender"/>
		<#if entornoEjie != "">
		<appender-ref ref="auditoriaAccesosMomoAppender"/>
		</#if>
	</logger>
	
	<logger name="com.ejie.x38.security" level="<#noparse>${log.level.auditoriaAccesos}</#noparse>">
		<appender-ref ref="auditoriaAccesosAppender"/>
		<#if entornoEjie != "">
		<appender-ref ref="auditoriaAccesosMomoAppender"/>
		</#if>
	</logger>
	
	<#if entornoEjie != "">
	<!-- Appender para las trazas de Hdiv -->
	<logger name="com.ejie.x38.hdiv" level="<#noparse>${log.level.udaTrazas}</#noparse>">
		<appender-ref ref="salidaHdivAppender"/>
	</logger>
	
	<logger name="com.hdivsecurity" level="<#noparse>${log.level.udaTrazas}</#noparse>">
		<appender-ref ref="salidaHdivAppender"/>
	</logger>
	
	<logger name="org.hdiv" level="<#noparse>${log.level.udaTrazas}</#noparse>">
		<appender-ref ref="salidaHdivAppender"/>
	</logger>
	</#if>
  
</configuration>
