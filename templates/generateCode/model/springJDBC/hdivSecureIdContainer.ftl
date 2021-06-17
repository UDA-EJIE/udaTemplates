	/**
	 * Method 'getId'.
	 * 
	 * @return String
	 */
	@Override
	public String getId() {
		
		<#assign resultado=0>
		<#list pojo.getAllPropertiesIterator() as field>
   		<#if clazz.identifierProperty.composite && field.equals(clazz.identifierProperty)>
		//Clave compuesta 	
		<#assign resul = 'return ('>
		<#assign comprobar = 'if ('>
		<#assign primaryKeys = clazz.identifierProperty.value.getPropertyIterator()>
			<#list primaryKeys as pKey>	
				<#if !c2h.isCollection(pKey) && !c2h.isOneToOne(pKey) && !c2h.isOneToMany(pKey) && !c2h.isManyToAny(pKey) && utilidades.getJavaTypeNameHibernate(pKey,false)!='java.sql.Clob' && utilidades.getJavaTypeNameHibernate(pKey,false)!='java.sql.Blob'  && utilidades.getJavaTypeNameHibernate(pKey,false)!='java.io.Serializable'>
				 <#if resultado==0>
				  <#assign resultado=1>
				  	<#assign comprobar = comprobar + pKey.name + ' == null '>
					<#assign resul = resul + 'this.'+pKey.name + '.toString() '>
				 <#else>	
				 	<#assign comprobar = comprobar + ' || ' + pKey.name + ' == null '>
					<#assign resul = resul + ' + ${pojo.importType("com.ejie.x38.util.Constants")}.PK_TOKEN  + ' + 'this.'+pKey.name + '.toString()  '>
				 </#if>
		        </#if>		      
			</#list>
			<#assign resul = resul + ').replaceAll(" ", "_space_");'>
			<#assign comprobar = comprobar + '){'>
		${comprobar}	
			return null;
		}		
		${resul}
		</#if>
		</#list>    
	}
	
	/**
	 * Method 'setId'.
	 * 
	 * @param id String
	 * @return
	 */
	
	public void setId(String id) {
		if (id != null && !"".equals(id)) {
			id = id.replaceAll("_space_", " ");
			String[] parts = id.split(Constants.PK_TOKEN);
		<#assign resultClase=''>
		<#assign resul=''>
		<#assign claseInterna=''>
		<#assign resultado=0>
		<#assign compuesto=0>
		<#assign camposDoc = ctrlUtils.getPrimaryKey(pojo,cfg)>
			<#list camposDoc as camposPrim>					
				<#if !pojo.getDeclarationName().toUpperCase().equals(camposPrim[2].toUpperCase())>
				<#assign resultClase = resultClase + 'new '+camposPrim[1] +'(parts[ ' + resultado + ']) ' + ' , '>
				<#assign claseInterna = camposPrim[4]>
				<#assign compuesto = 1>
				<#else>
				<#assign resul = camposPrim[0] + ' = new '+camposPrim[1]+'(parts[ ' + resultado + ']); '>
				</#if>
				<#assign resultado = resultado + 1> 
			${resul}
			</#list>
			<#if compuesto == 1>
				<#assign resultClase = ctrlUtils.eliminarComa(resultClase)>
				<#assign resultClase = ctrlUtils.snakeToCamel(claseInterna) + ' = new ' + claseInterna + '(' + resultClase + ');'>
			${resultClase}
			</#if>
						
		}		
	}
