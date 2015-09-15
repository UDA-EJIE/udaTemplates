<#assign tablaMN =property.getValue().getCollectionTable().getName() > 
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
	 * Method 'unBind'.${ctrl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))}
	 *
	  <#list listaPk as auxList>
	  * @param ${auxList[0]} ${pojo.importType(auxList[1])}
	  </#list>
	  <#list listaMNPk as auxListMN> 
	   * @param ${auxListMN[0]} ${pojo.importType(auxListMN[1])} 
	  </#list>
	 */
	@${pojo.importType("org.springframework.web.bind.annotation.RequestMapping")}(value = "/unbind${ctrl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))}", method = ${pojo.importType("org.springframework.web.bind.annotation.RequestMethod")}.POST)
	 public void unBind${ctrl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))}(
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
	    this.${ctrl.stringDecapitalize(pojo.getDeclarationName())}Service.remove${pojo.beanCapitalize(ctrl.findHibernateName(tablaMN?lower_case))}(${ctrl.stringDecapitalize(pojo.getDeclarationName())});    
	}
		 /**
	 * Method 'bind'.${ctrl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))}
	 *
	  <#list listaPk as auxList>
	  * @param ${auxList[0]} ${pojo.importType(auxList[1])}
	  </#list>
	  <#list listaMNPk as auxListMN> 
	   * @param ${auxListMN[0]} ${pojo.importType(auxListMN[1])} 
	  </#list>
	 */
	@${pojo.importType("org.springframework.web.bind.annotation.RequestMapping")}(value = "/bind${ctrl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))}", method = ${pojo.importType("org.springframework.web.bind.annotation.RequestMethod")}.POST)
	 public void bind${ctrl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))}(
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
	    this.${ctrl.stringDecapitalize(pojo.getDeclarationName())}Service.add${pojo.beanCapitalize(ctrl.findHibernateName(tablaMN?lower_case))}(${ctrl.stringDecapitalize(pojo.getDeclarationName())});    
	}
