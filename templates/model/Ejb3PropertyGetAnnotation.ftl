			/**
			 * Method '${warSupressor.getGetterSignature(property)}'.
			 *
			 * @return  ${warSupressor.getJavaTypeName(property, jdk5,pojo,true)}
			 */
<#if ejb3>
 <#if pojo.hasIdentifierProperty()>
<#if property.equals(clazz.identifierProperty)>
   ${warSupressor.generateAnnIdGenerator(pojo)} 
    <#-- ${pojo.generateAnnIdGenerator()}  -->
</#if> 
</#if>

<#if c2h.isOneToOne(property)>
${pojo.generateOneToOneAnnotation(property, cfg)}
<#elseif c2h.isManyToOne(property)>
${pojo.generateManyToOneAnnotation(property)}
<#--TODO support optional and targetEntity-->    
${pojo.generateJoinColumnsAnnotation(property, cfg)}
<#elseif c2h.isCollection(property)>
${pojo.generateCollectionAnnotation(property, cfg)}
<#else>
<#--${pojo.generateBasicAnnotation(property)}-->
${utilidades.generateAnnColumnAnnotation(property,pojo)}
</#if>
</#if>