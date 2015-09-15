<#-- // Property accessors -->
<#foreach property in pojo.getAllPropertiesIterator()>
    <#--<#if property.equals(clazz.identifierProperty)>
		 ${pojo.generateAnnIdGenerator()}  
	</#if> -->
	<#-- Sustituye 'Set' por un 'List' -->
	<#if c2h.isCollection(property) && warSupressor.getJavaTypeName(property, jdk5,pojo,true)?starts_with('List') >
   /**
	* Method 'get${pojo.getPropertyName(property)}'.
	*  @return ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}>
	*/
	${pojo.getPropertyGetModifiers(property)} ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${warSupressor.getGetterSignature(property)}() {
		return this.${property.name};
	}

	/**
	* Method 'set${pojo.getPropertyName(property)}'.
	*  @param ${property.name} ${warSupressor.getJavaTypeName(property, jdk5,pojo,true)}
	*/
	${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}(${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())).getClassName())}> ${property.name}) {
		this.${property.name} = ${property.name};
	}

	<#else>	
    /**
	* Method 'get${pojo.getPropertyName(property)}'.
	*  @return ${warSupressor.getJavaTypeName(property, jdk5,pojo,true)}
	*/
	 ${pojo.getPropertyGetModifiers(property)} ${warSupressor.getJavaTypeName(property, jdk5,pojo,true)} ${warSupressor.getGetterSignature(property)}() {
				return this.${property.name};
	}

	/**
	* Method 'set${pojo.getPropertyName(property)}'.
	*  @param ${property.name} ${warSupressor.getJavaTypeName(property, jdk5,pojo,true)}
	*/
			${pojo.getPropertySetModifiers(property)} void set${pojo.getPropertyName(property)}(${warSupressor.getJavaTypeName(property, jdk5,pojo,true)} ${property.name}) {
				this.${property.name} = ${property.name};
			}
	  	
	</#if>
</#foreach>