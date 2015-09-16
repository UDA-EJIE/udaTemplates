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
	 * Constructor
	 * @param ${ctrUtils.stringDecapitalize(pojo.getDeclarationName())}Dto ${pojo.importType(pojo.getPackageName()+".model.dto."+ pojo.getDeclarationName()+"Dto")} 
	 */
	public ${pojo.getDeclarationName()}(${pojo.importType(pojo.getPackageName()+".model.dto."+ pojo.getDeclarationName()+"Dto")} ${ctrUtils.stringDecapitalize(pojo.getDeclarationName())}Dto) {	
	<#foreach field in pojo.getAllPropertiesIterator()> 
		<#if !c2h.isCollection(field)>
		this.${field.name} = ${ctrUtils.stringDecapitalize(pojo.getDeclarationName())}Dto.get${pojo.beanCapitalize(field.name)}();
		</#if>
	</#foreach>
    }
	
