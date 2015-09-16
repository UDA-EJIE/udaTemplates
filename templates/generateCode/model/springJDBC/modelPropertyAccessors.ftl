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
<#-- // Property accessors -->
<#foreach property in pojo.getAllPropertiesIterator()>
  <#if clazz.identifierProperty.composite && property.equals(clazz.identifierProperty)>
     <#assign primaryKeys = clazz.identifierProperty.value.getPropertyIterator()>
     <#list primaryKeys as pKey>
       <#if pojo.getMetaAttribAsBool(pKey, "gen-property", true)>
        <#if pojo.hasFieldJavaDoc(pKey)>
	/**
     * ${pojo.getFieldJavaDoc(pKey, 4)}.
     */
        </#if>
	/**
     * Method '${warSupresor.getGetterSignature(pKey,pojo)}'.
     *
     * @return ${warSupresor.typeConverter(warSupresor.getJavaTypeName(pKey, jdk5,pojo,false),false)}
     */
	${utilidades.generateJsonIgnoreAnnotationJdbc(pKey,pojo)}
	${utilidades.generateTimeStampAnnotationGetter(warSupresor.getJavaTypeName(pKey, jdk5,pojo,true) ,pojo)}
	${pojo.getPropertyGetModifiers(pKey)} ${pojo.importType(warSupresor.typeConverter(warSupresor.getJavaTypeName(pKey, jdk5,pojo,false),false))} ${warSupresor.getGetterSignature(pKey,pojo)}() {
		return this.${pKey.name};
	}
	
	/**
	 * Method 'set${pojo.getPropertyName(pKey)}'.
	 *
	 * @param ${pKey.name} ${warSupresor.typeConverter(warSupresor.getJavaTypeName(pKey, jdk5,pojo,false),false)}
	 * @return
	 */
	${utilidades.generateTimeStampAnnotationSetter(warSupresor.getJavaTypeName(pKey, jdk5,pojo,false) ,pojo)}
	${pojo.getPropertySetModifiers(pKey)} void set${pojo.getPropertyName(pKey)}(${pojo.importType(warSupresor.typeConverter(warSupresor.getJavaTypeName(pKey, jdk5,pojo,false),false))} ${pKey.name}) {
		this.${pKey.name} = ${pKey.name};
	}
       </#if>
     </#list>
  <#else>
       <#if pojo.getMetaAttribAsBool(property, "gen-property", true)>
        <#if pojo.hasFieldJavaDoc(property)>
	/**
     * ${pojo.getFieldJavaDoc(property, 4)}.
     */
        </#if>
        <#-- Si hibernate devuelve Set queremos que ponga List. Por ello debemos tratar este caso aparte -->
        <#if c2h.isCollection(property) && warSupresor.getJavaTypeName(property, jdk5,pojo,true)?starts_with('List') >
	/**
	 * Method '${warSupresor.getGetterSignature(property,pojo)}'.
	 *
	 * @return ${pojo.importType("java.util.List")}
	 */
	${utilidades.generateJsonIgnoreAnnotationJdbc(property,pojo)}
	${pojo.getPropertyGetModifiers(property)} ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${warSupresor.getGetterSignature(property,pojo)}() {
		return this.${property.name};
	}
	
	/**
	 * Method 'set${pojo.getPropertyName(property)}'.
	 *
	 * @param ${property.name} ${pojo.importType("java.util.List")}
	 * @return
	 */
	${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}(${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${property.name}) {
		this.${property.name} = ${property.name};
	}
        <#else>
    /**
	 * Method '${warSupresor.getGetterSignature(property,pojo)}'.
	 *
	 * @return ${warSupresor.typeConverter(warSupresor.getJavaTypeName(property, jdk5,pojo,true),true)}
	 */
	${utilidades.generateJsonIgnoreAnnotationJdbc(property,pojo)}
	${utilidades.generateTimeStampAnnotationGetter(warSupresor.getJavaTypeName(property, jdk5,pojo,true),pojo)}
	${pojo.getPropertyGetModifiers(property)} ${pojo.importType(warSupresor.typeConverter(warSupresor.getJavaTypeName(property, jdk5,pojo,true),true))} ${warSupresor.getGetterSignature(property,pojo)}() {
		return this.${property.name};
	}

	/**
	 * Method 'set${pojo.getPropertyName(property)}'.
	 *
	 * @param ${property.name} ${warSupresor.typeConverter(warSupresor.getJavaTypeName(property,jdk5,pojo,true),true)}
	 * @return
     */
	${utilidades.generateTimeStampAnnotationSetter(warSupresor.getJavaTypeName(property, jdk5,pojo,true),pojo)}
	${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}(${pojo.importType(warSupresor.typeConverter(warSupresor.getJavaTypeName(property,jdk5,pojo,true),true))} ${property.name}) {
		this.${property.name} = ${property.name};
	}
        </#if>
       </#if>
  </#if>
</#foreach>