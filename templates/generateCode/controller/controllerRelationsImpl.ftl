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
<#-- Obtenemos el nombre de la tabla M:N -->
<#assign tablaMN = ctrl.getRelationName(property.getValue().getCollectionTable().getName()) >

<#-- Obtenemos el nombre de la tabla hijo -->
<#assign subclass = cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())>
<#assign nombreSubclassEntero=subclass.getClassName()>
<#assign nombreSubclass= nombreSubclassEntero?substring(nombreSubclassEntero?last_index_of(".")+1,nombreSubclassEntero?length) >
<#assign listaPk=ctrlUtils.getPrimaryKey(pojo,cfg)>
<#assign listaPkAux = listaPk>
<#assign listaPkSetter = listaPk>
<#assign listaMNPk =ctrlUtils.getMNPk(pojo,cfg,property)>
<#assign listaMNPkAux =listaMNPk >
<#assign listaMNPkSetter =listaMNPk >
<#assign tablaHija= property?substring(property?last_index_of("(")+1,property?length-1)>
	/**
	 * Method 'unBind' ${tablaMN}
	 *
	 <#list listaPk as auxList>
	 * @param ${auxList[0]} ${pojo.importType(auxList[1])}
	 </#list>
	 <#list listaMNPk as auxListMN> 
	 * @param ${auxListMN[0]} ${pojo.importType(auxListMN[1])} 
	 </#list>	 
	 */
	@${pojo.importType("org.springframework.web.bind.annotation.RequestMapping")}(value = "/unbind${tablaMN}", method = ${pojo.importType("org.springframework.web.bind.annotation.RequestMethod")}.POST)
	public void unBind${tablaMN}(
	  <#list listaPk as auxList>@${pojo.importType("org.springframework.web.bind.annotation.RequestParam")}(value = "${auxList[0]}", required = false) ${pojo.importType(auxList[1])} ${auxList[0]}<#if auxList_has_next>,</#if></#list>,
	  <#list listaMNPk as auxListMN> 
				@${pojo.importType("org.springframework.web.bind.annotation.RequestParam")}(value = "${auxListMN[0]}", required = false) ${pojo.importType(auxListMN[1])} ${auxListMN[0]}<#if auxListMN_has_next>,</#if>
	  </#list>) {
		${pojo.getDeclarationName()} ${ctrl.stringDecapitalize(pojo.getDeclarationName())}= new ${pojo.getDeclarationName()}();
		${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}     ${ctrl.stringDecapitalize(nombreSubclass)} = new ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}();
		if (<#list listaPkAux as auxList>${auxList[0]}!= null <#if auxList_has_next> && </#if></#list>){
			<#foreach field in ctrlUtils.getPrimaryKey(pojo,cfg)>
				${field[2]}.set${pojo.beanCapitalize(field[3])}(${field[0]});
			</#foreach>	
		}
		if (<#list listaMNPkAux as auxList>${auxList[0]}!= null <#if auxList_has_next> && </#if></#list>){
		    <#list listaMNPkSetter as auxList>${ctrl.stringDecapitalize(nombreSubclass)}.set${pojo.beanCapitalize(auxList[2])}(${auxList[0]});</#list>
		}
		${ctrl.stringDecapitalize(pojo.getDeclarationName())}.get${pojo.beanCapitalize(tablaHija)}().add(${ctrl.stringDecapitalize(nombreSubclass)});
	    this.${ctrl.stringDecapitalize(pojo.getDeclarationName())}Service.remove${tablaMN}(${ctrl.stringDecapitalize(pojo.getDeclarationName())});    
	}
	
	/**
	 * Method 'bind' ${tablaMN}
	 *
	 <#list listaPk as auxList>
	 * @param ${auxList[0]} ${pojo.importType(auxList[1])}
	 </#list>
	 <#list listaMNPk as auxListMN> 
	 * @param ${auxListMN[0]} ${pojo.importType(auxListMN[1])} 
	 </#list>
	 */
	@${pojo.importType("org.springframework.web.bind.annotation.RequestMapping")}(value = "/bind${tablaMN}", method = ${pojo.importType("org.springframework.web.bind.annotation.RequestMethod")}.POST)
	public void bind${tablaMN}(
	  <#list listaPk as auxList>@${pojo.importType("org.springframework.web.bind.annotation.RequestParam")}(value = "${auxList[0]}", required = false) ${pojo.importType(auxList[1])} ${auxList[0]}<#if auxList_has_next>,</#if></#list>,
	  <#list listaMNPk as auxListMN> 
				@${pojo.importType("org.springframework.web.bind.annotation.RequestParam")}(value = "${auxListMN[0]}", required = false) ${pojo.importType(auxListMN[1])} ${auxListMN[0]}<#if auxListMN_has_next>,</#if>
	  </#list>) {
		${pojo.getDeclarationName()} ${ctrl.stringDecapitalize(pojo.getDeclarationName())}= new ${pojo.getDeclarationName()}();
		${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}     ${ctrl.stringDecapitalize(nombreSubclass)} = new ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}();
		if (<#list listaPkAux as auxList>${auxList[0]}!= null <#if auxList_has_next> && </#if></#list>){
		   <#foreach field in ctrlUtils.getPrimaryKey(pojo,cfg)>
				${field[2]}.set${pojo.beanCapitalize(field[3])}(${field[0]});
			</#foreach>	
		}
		if (<#list listaMNPkAux as auxList>${auxList[0]}!= null <#if auxList_has_next> && </#if></#list>){
		    <#list listaMNPkSetter as auxList>${ctrl.stringDecapitalize(nombreSubclass)}.set${pojo.beanCapitalize(auxList[2])}(${auxList[0]});</#list>
		}
		${ctrl.stringDecapitalize(pojo.getDeclarationName())}.get${pojo.beanCapitalize(tablaHija)}().add(${ctrl.stringDecapitalize(nombreSubclass)});
	    this.${ctrl.stringDecapitalize(pojo.getDeclarationName())}Service.add${tablaMN}(${ctrl.stringDecapitalize(pojo.getDeclarationName())});    
	}
