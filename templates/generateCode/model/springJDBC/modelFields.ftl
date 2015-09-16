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
<#-- // Fields -->
	private static final long serialVersionUID = 1L;
    <#assign  encontrado = 'false' >
	<#foreach field in pojo.getAllPropertiesIterator()>
	<#if clazz.identifierProperty.composite && field.equals(clazz.identifierProperty)>
    //Clave compuesta
    <#assign primaryKeys = clazz.identifierProperty.value.getPropertyIterator()>
      <#list primaryKeys as pKey>
        <#if pojo.getMetaAttribAsBool(pKey, "gen-property", true)>
          <#if pojo.hasMetaAttribute(pKey, "field-description")>  
	/**
     * ${pojo.getFieldJavaDoc(pKey, 0)}.
	 */
          </#if>
          <#if (c2h.isOneToMany(pKey) || c2h.isManyToOne(pKey)) && warSupresor.getJavaTypeName(pKey, jdk5,pojo,true)?starts_with('List')  >
            ${pojo.getFieldModifiers(pKey)} ${warSupresor.typeConverter(warSupresor.getJavaTypeName(pKey, jdk5,pojo,true),true)} <${pojo.importType((cfg.getClassMapping(pKey.getType().getName())).getClassName())}> ${pKey.name} = new ${pojo.importType("java.util.ArrayList")}<${pojo.importType((cfg.getClassMapping(pKey.getType().getName())).getClassName())}>();
          <#else>  
            ${pojo.getFieldModifiers(pKey)} ${warSupresor.typeConverter(warSupresor.getJavaTypeName(pKey, jdk5,pojo,true),true)} ${pKey.name}<#if pojo.hasFieldInitializor(pKey, jdk5)> = ${pojo.getFieldInitialization(pKey, jdk5)}</#if>;
          </#if>
        </#if>
      </#list>
	<#else>
        <#if pojo.getMetaAttribAsBool(field, "gen-property", true)>
          <#if pojo.hasMetaAttribute(field, "field-description")>		
    /**
     * ${pojo.getFieldJavaDoc(field, 0)}.
	 */
          </#if>
          <#-- si es un Set lo que devuelve Hibernate lo ponemos como tipo List -->
          <#if c2h.isCollection(field) && warSupresor.getJavaTypeName(field, jdk5,pojo,true)?starts_with('List') >
            ${pojo.getFieldModifiers(field)} ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(field.getValue().getElement().getReferencedEntityName())).getClassName())}> ${field.name} = new ${pojo.importType("java.util.ArrayList")}<${pojo.importType((cfg.getClassMapping(field.getValue().getElement().getReferencedEntityName())).getClassName())}>();
          <#else>
            ${pojo.getFieldModifiers(field)} ${pojo.importType(warSupresor.typeConverter(warSupresor.getJavaTypeName(field, jdk5,pojo,true),true))} ${field.name}<#if pojo.hasFieldInitializor(field, jdk5)> = ${pojo.getFieldInitialization(field, jdk5)}</#if>;
          </#if>
        </#if>
	</#if>
</#foreach>