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
<#assign tablaMN =property.getValue().getCollectionTable().getName() > 
<#assign tablaMNName = ctrTl.getRelationName(tablaMN) >

<#-- Obtenemos el nombre de la tabla hijo -->
<#assign subclass = cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())>
<#assign nombreSubclassEntero=subclass.getClassName()>
<#assign nombreSubclass= nombreSubclassEntero?substring(nombreSubclassEntero?last_index_of(".")+1,nombreSubclassEntero?length) >
<#-- Obtenemos la clave primaria de la M:N -->
<#assign primariasMN = property.getValue().getCollectionTable().getPrimaryKey().getColumns() >	
<#-- Obtenemos las columnas relacionadas de la tabla actual con la M:N -->
<#assign campoPadre = property.getValue().getKey().getColumnIterator() > 
	
	/**
     * Inserts a single row in the ${tablaMNName} table.
     * 
     * @param ${pojo.getDeclarationName()?lower_case}  ${pojo.getDeclarationName()}
     * @return ${pojo.getDeclarationName()} 
     */
 	public ${pojo.getDeclarationName()} add${tablaMNName} (${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}) {
    	<#assign inserMNFields = utilidadesDao.insertMNFields(pojo,cfg,property)>
     	String query = "INSERT INTO ${tablaMN} " 
     		+ "( <#list inserMNFields as prim>${prim}<#if prim_has_next>,</#if></#list>) " 
     		+ " values (<#list primariasMN as prim>?<#if prim_has_next>, </#if></#list>)";

		<#assign getMNRecord = utilidadesDao.getMNObject(pojo,cfg,property)>
		${pojo.importType("java.util.List")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> auxiliar${pojo.beanCapitalize(nombreSubclass?lower_case)} = ${pojo.getDeclarationName()?lower_case}.get${pojo.beanCapitalize(property.getName())}();
		${pojo.importType("java.util.Iterator")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> it =  auxiliar${pojo.beanCapitalize(nombreSubclass?lower_case)}.iterator();
		while (it.hasNext()) {
			${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}	${nombreSubclass?lower_case} = (${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}) it.next();
			this.jdbcTemplate.update(query, <#list getMNRecord as param>${param}<#if param_has_next>, </#if></#list>);
		}
		return ${pojo.getDeclarationName()?lower_case};	
	}

    /**
     * Deletes a single row in the ${tablaMNName} table.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @return
     */
    public  void remove${tablaMNName}(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}) {
		<#assign deleteMNFields = utilidadesDao.deleteMNWhere(pojo,cfg,property)>
		String query = "DELETE  FROM ${tablaMN} "
			+ " WHERE <#list deleteMNFields as param>${param}=?<#if param_has_next> AND </#if></#list>" ;
      	<#assign getMNRecordRemove = getMNRecord>
		${pojo.importType("java.util.List")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> auxiliar${pojo.beanCapitalize(nombreSubclass?lower_case)} = ${pojo.getDeclarationName()?lower_case}.get${pojo.beanCapitalize(property.getName())}();
		${pojo.importType("java.util.Iterator")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> it =  auxiliar${pojo.beanCapitalize(nombreSubclass?lower_case)}.iterator();
		while (it.hasNext()) {
			${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}	${nombreSubclass?lower_case} = (${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}) it.next();
		    this.jdbcTemplate.update(query, <#list getMNRecord as param>${param}<#if param_has_next>, </#if></#list>);	
		}
	}
	
    /**
     * Find a single row in the find${tablaMNName} Many To Many relationship.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param  ${nombreSubclass?lower_case} ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
     * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}
     * @return ${pojo.getDeclarationName()}
     */
    @${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)	
    public ${pojo.getDeclarationName()} find${tablaMNName}(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${nombreSubclass?lower_case}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination) {

		StringBuilder where = new StringBuilder(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
		List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();
		<#assign whereFindMN = utilidadesDao.wherefindMN(pojo,cfg,property)>
		
		where.append("where <#list whereFindMN as param>${param}<#if param_has_next> AND </#if></#list>");
		
		<#foreach var in gener.getPrimaryKeyPojo(pojo,cfg)>
		params.add(${pojo.getDeclarationName()?lower_case}.get${pojo.beanCapitalize(var[0])}());
		</#foreach>	
		
		<#assign listaPropiedadesMan = daoUtilities.getFieldManyToManySpring(pojo,cfg,property)>
		<#list listaPropiedadesMan as propiedades >
		if (${nombreSubclass?lower_case}.${propiedades[0]} != null) {
			where.append(" AND t2.${propiedades[2]} = ?");
			params.add(${nombreSubclass?lower_case}.${propiedades[0]});
		}	
		</#list>	
		
		<#assign selectCamposRelacionados = utilidadesDao.selectFieldsMN(pojo,cfg,property)>
		StringBuilder query =  new StringBuilder("SELECT <#list selectCamposRelacionados as param>${param}<#if param_has_next>, </#if></#list> FROM ${pojo.beanCapitalize(tablaMN?lower_case)} t1,${subclass.getTable().getName()} t2  ");
		query.append(where);

		StringBuilder order = new StringBuilder(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
		if (pagination != null) {
			if (pagination.getSort() != null) {
				order.append(" order by " + pagination.getSort() + " " + pagination.getAscDsc());
				query.append(order);
			}
			query = new StringBuilder(${pojo.importType("com.ejie.x38.dto.PaginationManager")}.getPaginationQuery(pagination, query));
      	}	
		${pojo.importType("java.util.List")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> listaHijo =  this.jdbcTemplate.query(query.toString(),
			new RowMapper<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}>() {
         		public ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} mapRow(ResultSet resultSet, int rowNum)
           				throws SQLException {		
             		return new ${pojo.beanCapitalize(nombreSubclass)}(
				${utilidadesDao.findMNChild(pojo,cfg,property)}
				);
			}
		} , params.toArray() );	
		${pojo.getDeclarationName()?lower_case}.set${pojo.beanCapitalize(daoUtilities.getFieldNameFromType(pojo,cfg,nombreSubclass))}(listaHijo);
		return ${pojo.getDeclarationName()?lower_case};
	}

    /**
     * Counts rows in the ${tablaMNName} table.
     * 
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param  ${nombreSubclass?lower_case} ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
     * @return Long
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)	
    public Long find${tablaMNName}Count(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${nombreSubclass?lower_case}) {

		StringBuilder where = new StringBuilder(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
		List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();
		<#assign whereFindMNCont = whereFindMN >
		where.append("where <#list whereFindMNCont as param>${param}<#if param_has_next> AND </#if></#list>");
		
		<#foreach var in gener.getPrimaryKeyPojo(pojo,cfg)> 
		params.add(${pojo.getDeclarationName()?lower_case}.get${pojo.beanCapitalize(var[0])}());
		</#foreach>
		
		<#assign listaPropiedadesMan = daoUtilities.getFieldManyToManySpring(pojo,cfg,property)>
		<#list listaPropiedadesMan as propiedades >
		if (${nombreSubclass?lower_case}.${propiedades[0]} != null) {
			where.append(" AND t2.${propiedades[2]} = ?");
			params.add(${nombreSubclass?lower_case}.${propiedades[0]});
		}	
		</#list>	

		StringBuilder query =  new StringBuilder("SELECT count(1) FROM ${pojo.beanCapitalize(tablaMN?lower_case)} t1,${subclass.getTable().getName()} t2  ");
		query.append(where);	
		return this.jdbcTemplate.queryForLong(query.toString(), params.toArray());
    }
