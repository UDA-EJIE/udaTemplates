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