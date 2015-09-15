#log4j.rootLogger=TRACE, stdout, logfile0
#Subsistema Negocio Componentes
log4j.logger.com.ejie.${codapp?lower_case}=TRACE, stdout, logfile0
#Subsistema Negocio Navegacion
log4j.logger.com.ejie.${codapp?lower_case}.control=TRACE, stdout, logfile1
#Subsistema Sistema Incidencias
log4j.logger.com.ejie.x38.UdaFilter=TRACE, stdout, logfile2
log4j.logger.com.ejie.x38.validation.ValidationFilter=TRACE, stdout, logfile2
#Subsistema Sistema Trazas
log4j.logger.com.ejie.x38=TRACE, stdout, logfile3
log4j.logger.org.springframework.core=INFO, stdout, logfile3
log4j.logger.org.springframework.beans=INFO, stdout, logfile3
log4j.logger.org.springframework.context=INFO, stdout, logfile3
log4j.logger.org.springframework.web=INFO, stdout, logfile3
log4j.logger.org.springframework.security=INFO, stdout, logfile3
log4j.logger.org.springframework.jndi=INFO, stdout, logfile3
log4j.logger.org.springframework.ui=TRACE, stdout, logfile3
log4j.logger.org.springframework.aop=TRACE, stdout, logfile3
log4j.logger.org.springframework.transaction=TRACE, stdout, logfile3
log4j.logger.org.hibernate.validator=TRACE, stdout, logfile3
log4j.logger.org.apache.commons=WARN, stdout, logfile3
#Subsistema Auditoria Acceso BBDD
log4j.logger.org.springframework.jdbc=INFO, stdout, logfile4
log4j.logger.org.springframework.orm=TRACE, stdout, logfile4
log4j.logger.org.springframework.dao=TRACE, stdout, logfile4
log4j.logger.org.eclipse=TRACE, stdout, logfile4
log4j.logger.javax.persistence=TRACE, stdout, logfile4
#Subsistema Auditoria Acceso Aplicacion
log4j.logger.com.ejie.x38.validation=TRACE, stdout, logfile5
log4j.logger.org.apache.tiles=WARN, stdout, logfile5

log4j.additivity.com.ejie.x38.UdaFilter=false
log4j.additivity.com.ejie.x38.validation.ValidationFilter=false
log4j.additivity.com.ejie=false
log4j.additivity.org.springframework=false
log4j.additivity.org.eclipse=false
log4j.additivity.org.hibernate.validator=false
log4j.additivity.javax.persistence=false
log4j.additivity.org.apache=false

log4j.appender.stdout=org.apache.log4j.DailyRollingFileAppender
log4j.appender.stdout.File=c:/datos/${codapp?lower_case}/log/stdout_${codapp?lower_case}_
log4j.appender.stdout.Append=true
log4j.appender.stdout.DatePattern=yyyy-MM-dd'.log'
log4j.appender.stdout.layout=com.ejie.x38.log.LogLayout

log4j.appender.logfile0=org.apache.log4j.DailyRollingFileAppender
log4j.appender.logfile0.File=c:/datos/${codapp?lower_case}/log/componentes_${codapp?lower_case}_
log4j.appender.logfile0.Append=true
log4j.appender.logfile0.DatePattern=yyyy-MM-dd'.log'
log4j.appender.logfile0.layout=com.ejie.x38.log.LogLayout

log4j.appender.logfile1=org.apache.log4j.DailyRollingFileAppender
log4j.appender.logfile1.File=c:/datos/${codapp?lower_case}/log/navegacion_${codapp?lower_case}_
log4j.appender.logfile1.Append=true
log4j.appender.logfile1.DatePattern=yyyy-MM-dd'.log'
log4j.appender.logfile1.layout=com.ejie.x38.log.LogLayout

log4j.appender.logfile2=org.apache.log4j.DailyRollingFileAppender
log4j.appender.logfile2.File=c:/datos/${codapp?lower_case}/log/incidencias_${codapp?lower_case}_
log4j.appender.logfile2.Append=true
log4j.appender.logfile2.DatePattern=yyyy-MM-dd'.log'
log4j.appender.logfile2.layout=com.ejie.x38.log.LogLayout

log4j.appender.logfile3=org.apache.log4j.DailyRollingFileAppender
log4j.appender.logfile3.File=c:/datos/${codapp?lower_case}/log/trazas_${codapp?lower_case}_
log4j.appender.logfile3.Append=true
log4j.appender.logfile3.DatePattern=yyyy-MM-dd'.log'
log4j.appender.logfile3.layout=com.ejie.x38.log.LogLayout

log4j.appender.logfile4=org.apache.log4j.DailyRollingFileAppender
log4j.appender.logfile4.File=c:/datos/${codapp?lower_case}/log/accesoBBDD_${codapp?lower_case}_
log4j.appender.logfile4.Append=true
log4j.appender.logfile4.DatePattern=yyyy-MM-dd'.log'
log4j.appender.logfile4.layout=com.ejie.x38.log.LogLayout

log4j.appender.logfile5=org.apache.log4j.DailyRollingFileAppender
log4j.appender.logfile5.File=c:/datos/${codapp?lower_case}/log/accesoApp_${codapp?lower_case}_
log4j.appender.logfile5.Append=true
log4j.appender.logfile5.DatePattern=yyyy-MM-dd'.log'
log4j.appender.logfile5.layout=com.ejie.x38.log.LogLayout