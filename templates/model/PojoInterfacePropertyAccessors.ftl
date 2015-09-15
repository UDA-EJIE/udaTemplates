<#-- if interface -->
<#-- Property accessors for interface -->
<#foreach property in pojo.getAllPropertiesIterator()><#if pojo.getMetaAttribAsBool(property, "gen-property", true)>   /**
   ${c2j.toJavaDoc(c2j.getMetaAsString(property, "field-description"), 4)} */
   <#if c2h.isCollection(field) && warSupressor.getJavaTypeName(field, jdk5,pojo,false)?starts_with('List') >
		${pojo.getPropertyGetModifiers(property)}  ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${warSupressor.getGetterSignature(property)}();
		${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}( ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${property.name});
  	<#else> 

         ${pojo.getPropertyGetModifiers(property)} ${warSupressor.getJavaTypeName(property, jdk5,pojo,false)} ${warSupressor.getGetterSignature(property)}();

		${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}(${warSupressor.getJavaTypeName(property, jdk5,pojo,false)} ${property.name});	
	</#if>	
</#if>
</#foreach>