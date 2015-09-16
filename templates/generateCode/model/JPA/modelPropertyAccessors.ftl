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
<#-- // Property accessors -->
<#foreach property in pojo.getAllPropertiesIterator()>
	<#if pojo.getMetaAttribAsBool(property, "gen-property", true)>
		<#if pojo.hasFieldJavaDoc(property)>    
	/**       
     * ${pojo.getFieldJavaDoc(property, 4)}.
     */
		</#if>
    <#include "ejb3PropertyGetAnnotation.ftl"/>
	<#-- Sustituye 'Set' por un 'List' -->
		<#if c2h.isCollection(property) && warSupressor.getJavaTypeName(property, jdk5,pojo,true)?starts_with('List') >
		${utilidades.generateJsonIgnoreAnnotation(property,pojo)}
		${pojo.getPropertyGetModifiers(property)} ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${warSupressor.getGetterSignature(property)}() {
		return this.${property.name};
	}

	/**
	 * Method 'set${pojo.getPropertyName(property)}'.
	 * @param ${property.name} ${warSupressor.getJavaTypeName(property, jdk5,pojo,true)}
	 * @return
	 */
	${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}(${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${property.name}) {
		this.${property.name} = ${property.name};
	}

		<#else>	
		${utilidades.generateJsonIgnoreAnnotation(property,pojo)}
		${utilidades.generateTimeStampAnnotationGetter(warSupressor.getJavaTypeName(property, jdk5,pojo,true),pojo)}
		${warSupressor.generateLobAnnotation(property,pojo)}
		${pojo.getPropertyGetModifiers(property)} ${warSupressor.getJavaTypeName(property, jdk5,pojo,true)} ${warSupressor.getGetterSignature(property)}() {
		return this.${property.name};
	}

	/**
	 * Method 'set${pojo.getPropertyName(property)}'.
	 * @param ${property.name} ${warSupressor.getJavaTypeName(property, jdk5,pojo,true)}
	 * @return
	 */
	${utilidades.generateTimeStampAnnotationSetter(warSupressor.getJavaTypeName(property, jdk5,pojo,true),pojo)}
	${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}(${warSupressor.getJavaTypeName(property, jdk5,pojo,true)} ${property.name}) {
		this.${property.name} = ${property.name};
	}
		</#if>
	</#if>
</#foreach>