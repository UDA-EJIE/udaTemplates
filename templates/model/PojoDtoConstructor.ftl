/*
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
	
