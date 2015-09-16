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
<#-- // Fields -->

	private static final long serialVersionUID = 1L;

	<#foreach field in pojo.getAllPropertiesIterator()>
		<#if pojo.getMetaAttribAsBool(field, "gen-property", true)>
			<#if pojo.hasMetaAttribute(field, "field-description")>
    /**
     * ${pojo.getFieldJavaDoc(field, 0)}.
     */
			</#if>			
			<#-- si es un Set lo que devuelve Hibernate lo ponemos como tipo List -->
			<#if c2h.isCollection(field) && warSupressor.getJavaTypeName(field, jdk5,pojo,true)?starts_with('List') >
	/**
	 * ${field.name}
	 */
	protected ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(field.getValue().getElement().getReferencedEntityName())).getClassName())}> ${field.name} = new ${pojo.importType("java.util.ArrayList")}<${pojo.importType((cfg.getClassMapping(field.getValue().getElement().getReferencedEntityName())).getClassName())}>(0);
	
			<#else>
	/**
	 * ${field.name}
	 */
	protected   ${warSupressor.getJavaTypeName(field, jdk5,pojo,true)}  ${field.name}<#if pojo.hasFieldInitializor(field, jdk5)> = ${pojo.getFieldInitialization(field, jdk5)}</#if>;
			</#if>	
		</#if>
	</#foreach>