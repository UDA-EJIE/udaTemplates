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
<#--  /** default constructor */ -->
	/** 
	 * Method '${pojo.getDeclarationName()}'.
	 */
    public ${pojo.getDeclarationName()}() {
    }

<#--  /** Recoge las propiedades y la clave compuesta desglosada */ -->
<#assign propertiesKeys=''>
<#assign pksKeys=''>
<#assign hasCollection='false'>
<#--  /** Recupera las claves primarias o compuestas, y verifica si tiene alguna Collection (M:1 o M:N) */ -->
<#foreach field in pojo.getAllPropertiesIterator()>
    <#if hasCollection!='true' && c2h.isCollection(field)>
      <#assign hasCollection='true'>
    </#if>
    <#if field.equals(clazz.identifierProperty)>
      <#if clazz.identifierProperty.composite>
        <#assign primaryKeys = clazz.identifierProperty.value.getPropertyIterator()>
        <#list primaryKeys as pKey>
          <#assign propertiesKeys=propertiesKeys+'${warSupresor.getJavaTypeName(pKey, jdk5,pojo,true)}' + ' ${pKey.name}'>	
            <#if pKey_has_next>
              <#assign propertiesKeys=propertiesKeys+', '>
            </#if>	
        </#list>
      <#else>
        <#assign propertiesKeys=propertiesKeys+'${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
      </#if>
    </#if>
</#foreach>

	
	<#assign primKeys = ''>
    <#foreach attrib in pojo.getAllPropertiesIterator()> 
		<#if clazz.identifierProperty.composite && attrib.equals(clazz.identifierProperty)>
			<#assign listPrimKeysComposite = clazz.identifierProperty.value.getPropertyIterator()>
				<#list listPrimKeysComposite as pkComp>
					<#assign primKeys=primKeys+'${warSupresor.getJavaTypeName(pkComp, jdk5,pojo,true)}' + ' ${pkComp.name}'>
					 <#if pkComp_has_next>
              			<#assign primKeys=primKeys+', '>
            		</#if>
				</#list>
		<#elseif !clazz.identifierProperty.composite && attrib.equals(clazz.identifierProperty)>
			<#assign primKeys=primKeys+'${warSupresor.getJavaTypeName(attrib, jdk5,pojo,true)}' + ' ${attrib.name}'>	
		</#if>
	</#foreach>
	<#assign javadocFieldsPks = utilidades.getListFromCommaSeparatedString(primKeys)>
    <#-- PK´s constructor  -->    
    
    /** 
     * Method '${pojo.getDeclarationName()}'.
    <#foreach field in javadocFieldsPks>
     * @param ${field[1]} ${field[0]}
    </#foreach>
     */    
     public ${pojo.getDeclarationName()}(${primKeys}) {
    <#foreach attrib in pojo.getAllPropertiesIterator()> 
		<#if clazz.identifierProperty.composite && attrib.equals(clazz.identifierProperty)>
			<#assign listPrimKeysComposite = clazz.identifierProperty.value.getPropertyIterator()>
			<#list listPrimKeysComposite as pkComp>
          this.${pkComp.name} = ${pkComp.name};
			</#list>
		<#elseif !clazz.identifierProperty.composite && attrib.equals(clazz.identifierProperty)>
          this.${attrib.name} = ${attrib.name};
		</#if>
	</#foreach>
	}

<#if hasCollection='true'>
    <#--  /** Tratamiento para el constructor sin Collections */ -->
	<#assign propertiesFullColec=''>
    <#assign propertiesFullColecMany=''>
    <#foreach field in pojo.getPropertiesForFullConstructor()>
      <#if !field.equals(clazz.identifierProperty) && !c2h.isCollection(field)>
        <#if c2h.isManyToOne(field) || c2h.isOneToOne(field) >
          <#assign propertiesFullColecMany=propertiesFullColecMany+', ${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
        <#else>
           <#if propertiesFullColec='' >
             <#assign propertiesFullColec=propertiesFullColec+'${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
           <#else>
             <#assign propertiesFullColec=propertiesFullColec+', ${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
           </#if>	
        </#if>	
      </#if>
    </#foreach>
    <#if propertiesFullColec != ''>
        <#assign propertiesFullColec = propertiesKeys + ', ' + propertiesFullColec>
        <#if propertiesFullColec?ends_with(', ')>
          <#assign propertiesFullColec = propertiesFullColec?substring(0,propertiesFullColec?length-2)>
        </#if>
    <#else>
       <#assign propertiesFullColec = propertiesKeys>
    </#if>

    <#-- queremos que los manytoOne se muestren al final de los constructores, para asi poder manejarlos mejor en los daos  -->
    <#assign javadocFields= utilidades.getListFromCommaSeparatedString(propertiesFullColec + propertiesFullColecMany)>
    /** 
     * Method '${pojo.getDeclarationName()}'.
    <#foreach field in javadocFields>
     * @param ${field[1]} ${field[0]}
    </#foreach>
     */
     public ${pojo.getDeclarationName()}(${propertiesFullColec} ${propertiesFullColecMany}) {	
    <#foreach field in pojo.getPropertiesForFullConstructor()> 
        <#if clazz.identifierProperty.composite && field.equals(clazz.identifierProperty)>
          <#assign primaryKeys = clazz.identifierProperty.value.getPropertyIterator()>
          <#list primaryKeys as pKey>
        this.${pKey.name} = ${pKey.name};
          </#list>
       <#elseif !c2h.isCollection(field)>
        this.${field.name} = ${field.name};
       </#if>
    </#foreach>
	}
</#if>
    
<#if pojo.needsFullConstructor()>
	<#--  /** Tratamiento para el constructor completo */ -->
	<#assign propertiesFull=''>
	<#assign propertiesFullColecMany=''>
	<#assign propertiesFullColecManyMany=''>
	<#foreach field in pojo.getPropertiesForFullConstructor()>
	  <#if !field.equals(clazz.identifierProperty)>
        <#-- Las variables de tipo Set se transforman a tipo List -->
        <#if c2h.isCollection(field) && warSupresor.getJavaTypeName(field, jdk5,pojo,true)?starts_with('List') >
          <#assign propertiesFullColecManyMany=propertiesFullColecManyMany+', ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(field.getValue().getElement().getReferencedEntityName())).getClassName())}>' + ' ${field.name}'>	
        <#elseif c2h.isManyToOne(field) || c2h.isOneToOne(field) >
          <#assign propertiesFullColecMany=propertiesFullColecMany+', ${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
        <#else>			
          <#if propertiesFull=''>
             <#assign propertiesFull=propertiesFull+'${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
          <#else>
             <#assign propertiesFull=propertiesFull+', ${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
          </#if>	
        </#if>	
      </#if>
	</#foreach>
	<#if clazz.identifierProperty.composite>
      <#if propertiesFull != ''>
		<#assign propertiesFull = propertiesKeys + ', ' + propertiesFull>
	  <#else>
		<#assign propertiesFull = propertiesKeys>
      </#if>	
      <#assign javadocFields= utilidades.getListFromCommaSeparatedString(propertiesFull + propertiesFullColecMany + propertiesFullColecManyMany)>
   /** 
    * Method '${pojo.getDeclarationName()}'.
	  <#foreach field in javadocFields>
   * @param ${field[1]} ${field[0]}
	  </#foreach>
   */
   public ${pojo.getDeclarationName()}(${propertiesFull} ${propertiesFullColecMany} ${propertiesFullColecManyMany}) {
	<#else>
      <#assign propertiesFull=''>
      <#assign propertiesFullColecMany='' >
      <#assign propertiesFullManytoMany='' >
      <#foreach field in pojo.getPropertiesForFullConstructor()>
		<#if !field.equals(clazz.identifierProperty)>
			<#if c2h.isCollection(field) && warSupresor.getJavaTypeName(field, jdk5,pojo,true)?starts_with('List') >
	         	<#assign propertiesFullManytoMany =  propertiesFullManytoMany+', ${pojo.importType("java.util.List")}<${pojo.importType((cfg.getClassMapping(field.getValue().getElement().getReferencedEntityName())).getClassName())}> ${field.name}'> 
			<#else>
	         	<#if c2h.isManyToOne(field) || c2h.isOneToOne(field) >
	         		<#if propertiesFullColecMany=''>
						<#assign propertiesFullColecMany=propertiesFullColecMany+'${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
					<#else>	
						<#assign propertiesFullColecMany=propertiesFullColecMany+', ${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
					</#if>
				<#else>
					<#if propertiesFull=''>
						<#assign propertiesFull=propertiesFull+'${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
					<#else>
						<#assign propertiesFull=propertiesFull+', ${warSupresor.getJavaTypeName(field, jdk5,pojo,true)}' + ' ${field.name}'>	
					</#if>
				</#if>	
			</#if>	
		</#if>
      </#foreach>
      <#if clazz.identifierProperty.composite>
		<#if propertiesFull != ''>		
			<#assign propertiesFull = propertiesKeys + ', ' + propertiesFull>
		<#else>
			<#assign propertiesFull = propertiesKeys>
		</#if>	
	  <#else>
		<#if propertiesFull != ''>
			<#assign propertiesFull = propertiesKeys + ', ' + propertiesFull>	
		<#else>
			<#assign propertiesFull = propertiesKeys>
		</#if>
	  </#if>	

	  <#assign parametros = propertiesFull>
	  <#if  propertiesFullColecMany != '' > 
		<#if propertiesFull!='' >
			<#assign parametros=parametros+', ' + propertiesFullColecMany> 
		<#else>
			<#assign parametros= propertiesFullColecMany> 
		</#if>		
	  </#if>
	  <#assign parametros=parametros+propertiesFullManytoMany>
	  <#assign javadocFields= utilidades.getListFromCommaSeparatedString(parametros)>
    /** 
     * Method '${pojo.getDeclarationName()}'.
	  <#foreach field in javadocFields>
     * @param ${field[1]} ${field[0]}
	  </#foreach>
     */
   public ${pojo.getDeclarationName()}(${parametros}) {	
	</#if>
	<#if pojo.isSubclass() && !pojo.getPropertyClosureForSuperclassFullConstructor().isEmpty()>
     super(${c2j.asArgumentList(pojo.getPropertyClosureForSuperclassFullConstructor())});        
	</#if>

	<#foreach field in pojo.getAllPropertiesIterator()> 
		<#if clazz.identifierProperty.composite && field.equals(clazz.identifierProperty)>
			<#assign primaryKeys = clazz.identifierProperty.value.getPropertyIterator()>
			<#list primaryKeys as pKey>
           this.${pKey.name} = ${pKey.name};		
			</#list>
		<#else>
           this.${field.name} = ${field.name};
		</#if>
	</#foreach>
    }
</#if>