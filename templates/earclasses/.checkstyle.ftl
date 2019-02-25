<?xml version="1.0" encoding="UTF-8"?>
<fileset-config file-format-version="1.2.0" simple-config="true">
<#if radjpa>
  	<fileset name="JpaMetaModel" enabled="true" check-config-name="UDA Checkstyle Project" local="false">
    	<file-match-pattern match-pattern="^src[/\\]com[/\\]ejie[/\\]${codapp?lower_case}[/\\](?!model[/\\].[^/]*._).*.java" include-pattern="true"/>
 	</fileset>
 	<filter name="FileTypesFilter" enabled="true">
    	<filter-data value="properties"/>
    	<filter-data value="java"/>
  	</filter>
<#else>
	<fileset name="all" enabled="true" check-config-name="UDA Checkstyle Project" local="false">
    	<file-match-pattern match-pattern="." include-pattern="true"/>
	</fileset>	
</#if>
</fileset-config>
