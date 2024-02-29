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
<#-- if interface -->
<#-- Property accessors for interface -->
<#foreach property in pojo.getAllPropertiesIterator()>
	<#if pojo.getMetaAttribAsBool(property, "gen-property", true)>   /**
	${c2j.toJavaDoc(c2j.getMetaAsString(property, "field-description"), 4)} */
    <#if c2h.isCollection(field) && warSupresor.getJavaTypeName(field, jdk5,pojo,true)?starts_with('List') >
		${pojo.getPropertyGetModifiers(property)}  ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${warSupresor.getGetterSignature(property,pojo)}();
		${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}( ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${property.name});
	<#else> 
		${pojo.getPropertyGetModifiers(property)} ${pojo.importType(warSupresor.typeConverter(warSupresor.getJavaTypeName(property, jdk5,pojo,true)))} ${warSupresor.getGetterSignature(property,pojo)}();
		${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}(${pojo.importType(warSupresor.typeConverter(warSupresor.getJavaTypeName(property, jdk5,pojo,true)))} ${property.name});	
	</#if>	
	</#if>
</#foreach>