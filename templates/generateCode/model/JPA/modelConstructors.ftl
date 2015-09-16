<#-- 
 -- Copyright 2011 E.J.I.E., S.A.
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
<#--  /** default constructor */ -->
	/**
	 * Method '${pojo.getDeclarationName()}'.
	 */
	public ${pojo.getDeclarationName()}() {
    }
	
<#--  /** Recoge todas las propiedades */ -->
<#assign properties=''>
<#assign propertiesWithOutCollec=''>
<#assign hasCollection='false'>
<#--  /** Verifica si tiene alguna Collection (M:1 o M:N) */ -->
<#foreach field in pojo.getAllPropertiesIterator()>
	<#if hasCollection!='true' && c2h.isCollection(field)>
		<#assign hasCollection='true'>
	</#if>
	<#-- Sustituye 'Set' por un 'List' -->
	<#if c2h.isCollection(field) && warSupressor.getJavaTypeName(field, jdk5,pojo,true)?starts_with('List') >
		<#assign properties=properties+'${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(field.getValue().getElement().getReferencedEntityName())).getClassName())}> ${field.name}'>
		<#else>	
			<#assign properties=properties+'${warSupressor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>
			<#assign propertiesWithOutCollec=propertiesWithOutCollec+'${warSupressor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>
	</#if>	
	<#if field_has_next>
		<#assign properties=properties+', '>
		<#if propertiesWithOutCollec != '' && !propertiesWithOutCollec?ends_with(', ')>
			<#assign propertiesWithOutCollec=propertiesWithOutCollec+', '>
		</#if>	
	</#if>
</#foreach>
<#if properties != ''>
	<#if properties?ends_with(', ')>
		<#assign properties = properties?substring(0,properties?length-2)>
	</#if>
</#if>	
<#if propertiesWithOutCollec != ''>
	<#if propertiesWithOutCollec?ends_with(', ')>
		<#assign propertiesWithOutCollec = propertiesWithOutCollec?substring(0,propertiesWithOutCollec?length-2)>
	</#if>
</#if>
<#if hasCollection='true'>
	<#--  /** Tratamiento para el constructor sin Collections */ -->
	<#assign javadocFields= utilidades.getListFromCommaSeparatedString(propertiesWithOutCollec)>
	/** Method '${pojo.getDeclarationName()}'. 
	<#foreach field in javadocFields> 
	 * @param ${field[1]} ${field[0]}
	</#foreach>
	 */
	public ${pojo.getDeclarationName()}(${propertiesWithOutCollec}) {	
	<#foreach field in pojo.getAllPropertiesIterator()> 
		<#if !c2h.isCollection(field)>
		this.${field.name} = ${field.name};
		</#if>
	</#foreach>
    }
</#if>
<#if pojo.needsFullConstructor()>
	<#--  /** Tratamiento para el constructor completo */ -->
	<#assign javadocFields= utilidades.getListFromCommaSeparatedString(properties)>
	/** Method '${pojo.getDeclarationName()}'.
	<#foreach field in javadocFields> 
	 * @param ${field[1]} ${field[0]}
	</#foreach>
	 */
	public ${pojo.getDeclarationName()}(${properties}) {
	<#foreach field in pojo.getAllPropertiesIterator()>
		this.${field.name} = ${field.name};
	</#foreach>
    }
</#if>
