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
   /**
    * Finds a list of rows in the ${pojo.getDeclarationName()} table.
    * 
    * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
    * @param jqGridRequestDto ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")}
    * @return ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> 
    */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAll(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")} jqGridRequestDto) {
		<#assign paramtabSelectDinamyc = paramTablaSelect >
		<#assign selectFieldsDinamyc = utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		StringBuilder query = new StringBuilder("SELECT  <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> "); 
		query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
		
		//Where clause & Params
		Map<String, ?> mapaWhere = this.getWhereMap(${pojo.getDeclarationName()?lower_case}); <#assign  wheretablaJoin =utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);
		
		List<?> params = (List<?>) mapaWhere.get("params");

		if (jqGridRequestDto != null) {
			query = ${pojo.importType("com.ejie.x38.dto.JQGridManager")}.getPaginationQuery(jqGridRequestDto, query);
		}
		
		return (${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>) this.jdbcTemplate.query(query.toString(), this.rwMap, params.toArray());
	}
	
	/**
	 * Finds rows in the ${pojo.getDeclarationName()} table using like.
     * 
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param jqGridRequestDto ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")}
     * @param startsWith Boolean
     * @return ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAllLike(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")} jqGridRequestDto, Boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect > <#assign  selectFieldsDinamyc =utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		StringBuilder query = new StringBuilder("SELECT  <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> "); 
        query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
      	
		//Where clause & Params
		Map<String, ?> mapaWhere = this.getWhereLikeMap(${pojo.getDeclarationName()?lower_case},startsWith); <#assign wheretablaJoin = utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		List<?> params = (List<?>) mapaWhere.get("params");

		if (jqGridRequestDto != null) {
			query = ${pojo.importType("com.ejie.x38.dto.JQGridManager")}.getPaginationQuery(jqGridRequestDto, query);
		}
		
		return (${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>) this.jdbcTemplate.query(query.toString(), this.rwMap, params.toArray());
	}

	/*
	 * OPERACIONES RUP_TABLE
	 */
	
    /**
     * Counts rows in the ${pojo.getDeclarationName()} table.
     * 
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @return Long
     */
    @${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public Long findAllCount(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}) {
		<#assign paramtabSelectDinamycCont = paramTablaSelect >
		StringBuilder query = new StringBuilder("SELECT COUNT(1) FROM <#list paramtabSelectDinamycCont as param>${param}<#if param_has_next>, </#if></#list>");
		
		//Where clause & Params
		Map<String, ?> mapaWhere = this.getWhereMap(${pojo.getDeclarationName()?lower_case}); <#assign wheretablaJoinCont= wheretablaJoin >
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoinCont as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);		
		
		List<?> params = (List<?>) mapaWhere.get("params");
		
		return this.jdbcTemplate.queryForLong(query.toString(), params.toArray());
	}	
	
	/**
	 * Counts rows in the ${pojo.getDeclarationName()} table using like.
     * 
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param startsWith Boolean
     * @return Long 
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public Long findAllLikeCount(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, Boolean startsWith) {
		<#assign paramtabSelectDinamycCont = paramTablaSelect >
		StringBuilder query = new StringBuilder("SELECT COUNT(1) FROM <#list paramtabSelectDinamycCont as param>${param}<#if param_has_next>,</#if></#list>");

		//Where clause & Params
		Map<String, ?> mapaWhere = this.getWhereLikeMap(${pojo.getDeclarationName()?lower_case},startsWith); <#assign wheretablaJoinCont= wheretablaJoin >
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		List<?> params = (List<?>) mapaWhere.get("params");

		return this.jdbcTemplate.queryForLong(query.toString(), params.toArray());
	}

	/**
	 * Reorder the data list of ${pojo.getDeclarationName()} selected for rup_table
     * 
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param jqGridRequestDto ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")}
     * @param startsWith Boolean
     * @return List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>> 
     */
	@Override 
	public List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>> reorderSelection(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")} jqGridRequestDto, Boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect >
		<#assign  selectFieldsDinamyc =utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg)>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> "); 
		// FROM
        query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
		// FILTRADO
		//Where clause & Params
		Map<String, ?> mapaWhere = this.getWhereLikeMap(${pojo.getDeclarationName()?lower_case},startsWith); <#assign wheretablaJoin = utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);
		
		// Parámetros de filtrado
		@SuppressWarnings("unchecked")
		List<Object> filterParamList = (List<Object>) mapaWhere.get("params");		
		
		// SQL para la reordenación
		StringBuilder sbReorderSelectionSQL =  ${pojo.importType("com.ejie.x38.dto.JQGridManager")}.getReorderQuery(query, jqGridRequestDto, ${pojo.getDeclarationName()}.class, filterParamList, "<#list paramWhere as param>${param}<#if param_has_next>,</#if></#list>" );

		return this.jdbcTemplate.query(sbReorderSelectionSQL.toString(), new ${pojo.importType("com.ejie.x38.dao.RowNumResultSetExtractor")}<${pojo.getDeclarationName()}>(this.rwMapPK, jqGridRequestDto), filterParamList.toArray());
	}

	/**
	 * Search method for rup_table
     * 
     * @param filterParams ${pojo.getDeclarationName()}
     * @param searchParams ${pojo.getDeclarationName()}
     * @param jqGridRequestDto ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")}
     * @param startsWith Boolean
     * @return List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>> 
     */
	@Override
	public List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>> search(${pojo.getDeclarationName()} filterParams, ${pojo.getDeclarationName()} searchParams, ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")} jqGridRequestDto, Boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign  selectFieldsDinamyc = utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg)>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> "); 
		// FROM
        query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");	
        //TABLAS_ALIAS
		List<String> from_alias = new ArrayList<String>();
		<#list paramtabSelectDinamyc as param>
		from_alias.add("${param?substring(param?index_of(' t'),param?length)}");
		</#list>
		
		// FILTRADO
		Map<String, ?> mapaWhereFilter = this.getWhereLikeMap(filterParams, startsWith); <#assign wheretablaJoin = utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhereFilter.get("query"));
		query.append(where);
		// Filter params
		@SuppressWarnings("unchecked")
		List<Object> filterParamList = (List<Object>) mapaWhereFilter.get("params");
		
		// BUSQUEDA
		Map<String, Object> mapaWhereSearch = this.getWhereLikeMap(searchParams, startsWith);
		String searchSQL = ((StringBuilder) mapaWhereSearch.get("query")).toString();
		// Search params
		@SuppressWarnings("unchecked")
		List<Object> searchParamList = (List<Object>) mapaWhereSearch.get("params");
		
		// SQL
		StringBuilder sbReorderSelectionSQL = ${pojo.importType("com.ejie.x38.dto.JQGridManager")}.getSearchQuery(query, jqGridRequestDto, ${pojo.getDeclarationName()}.class, filterParamList, searchSQL, searchParamList, from_alias, "<#list paramWhere as param>${param}<#if param_has_next>,</#if></#list>");
		
		return this.jdbcTemplate.query(sbReorderSelectionSQL.toString(), new ${pojo.importType("com.ejie.x38.dao.RowNumResultSetExtractor")}<${pojo.getDeclarationName()}>(this.rwMapPK, jqGridRequestDto), filterParamList.toArray());		
	}

	/**
	 * Remove multiple method for rup_table
     * 
     * @param filter${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param jqGridRequestDto ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")}
     * @param startsWith Boolean 
     */
	@Override
	public void removeMultiple(${pojo.getDeclarationName()} filter${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")} jqGridRequestDto, Boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign  selectFieldsDinamyc = utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg)>
		// SELECT
		/** TODO: select por clave */
		StringBuilder query = new StringBuilder("SELECT <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> "); 
		// FROM
        query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");	
		
		// WHERE
		Map<String, Object> mapaWhere = this.getWhereLikeMap(filter${pojo.getDeclarationName()?lower_case}, startsWith); 
		StringBuilder where = new StringBuilder(" WHERE 1=1 ");
		where.append(mapaWhere.get("query"));
		query.append(where);
		
		@SuppressWarnings("unchecked")
		List<Object> params = (List<Object>) mapaWhere.get("params");

		StringBuilder sbRemoveMultipleSQL = ${pojo.importType("com.ejie.x38.dto.JQGridManager")}.getRemoveMultipleQuery(jqGridRequestDto, ${pojo.getDeclarationName()}.class, query, params, "<#list paramWhere as param>${param}<#if param_has_next>,</#if></#list>");
		this.jdbcTemplate.update(sbRemoveMultipleSQL.toString(), params.toArray());
	}

	/**
	 * Filter in the hierarchical ${pojo.getDeclarationName()} table.
     * 
     * @param filter${pojo.getDeclarationName()} ${pojo.getDeclarationName()}
     * @param jqGridRequestDto ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")}
     * @return List<${pojo.importType("com.ejie.x38.dto.JerarquiaDto")}<${pojo.getDeclarationName()}>> 
     */
	@Override
	public List<${pojo.importType("com.ejie.x38.dto.JerarquiaDto")}<${pojo.getDeclarationName()}>> findAllLikeJerarquia(${pojo.getDeclarationName()} filter${pojo.getDeclarationName()}, ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")} jqGridRequestDto) {
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign selectFieldsDinamyc = utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> "); 
		// FROM
        //StringBuilder from = new StringBuilder("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
        List<String> from = new ArrayList<String>();
        <#list paramtabSelectDinamyc as param>
        from.add("${param?substring(0, param?index_of(' t'))}");
        </#list>
        //TABLAS_ALIAS
		List<String> from_alias = new ArrayList<String>();
		<#list paramtabSelectDinamyc as param>
		from_alias.add("${param?substring(param?index_of(' t'),param?length)}");
		</#list>

		// JOINS TABLAS
		/*
		 * Ejemplo de como indicar joins entre las tablas de la query
		 */
		/*
		 * StringBuilder joins = new StringBuilder("");
		 * joins.append("AND T1.ID=T2.ID_T1");
		 */

		// CONDICIONES (negocio)
		/*
		 * Ejemplo de como incluir condiciones de negocio en la consulta de la
		 * jerarquía
		 */
		/*
		 * StringBuilder businessFilters = new StringBuilder(); List<Object>
		 * businessParams = new ArrayList<Object>();
		 * businessFilters.append("   AND t1.EJIE = ?  ");
		 * businessParams.add("1");
		 */

		//FILTRO
		Map<String, ?> mapaWhere = this.getWhereLikeMap(filter${pojo.getDeclarationName()}, false);
		
		//JERARQUIA
		// Especificar la columna padre correspondiente en lugar de la generada por defecto (ID_PADRE)
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg)>
		query = ${pojo.importType("com.ejie.x38.dto.JQGridManagerJerarquia")}.getQuery(jqGridRequestDto, query, mapaWhere, "<#list paramWhere as param>${param}<#if param_has_next>,</#if></#list>", "ID_PADRE", "NOMBRE", from, from_alias);
		
		/*
		 * Ejemplo de llamada en caso de indicar joins entre tablas y condiciones de negocio
		 */
//		query = JQGridManagerJerarquia.getQuery(jqGridRequestDto, query, mapaWhere, "ID", "ID_PADRE", "NOMBRE", from, from_alias, joins, businessFilters, businessParams);

		//PAGINACION
		if (jqGridRequestDto != null) {
			query = ${pojo.importType("com.ejie.x38.dto.JQGridManagerJerarquia")}.getPaginationQuery(jqGridRequestDto, query);
		}

		List<?> params = (List<?>) mapaWhere.get("params");
		return this.jdbcTemplate.query(query.toString(), this.rwMapJerarquia, params.toArray());
	}

	/**
	 * Count rows in hierarchy
     * 
     * @param filter${pojo.getDeclarationName()} ${pojo.getDeclarationName()}
     * @param jqGridRequestDto ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")}
     * @return Long 
     */
	@Override
	public Long findAllLikeCountJerarquia(${pojo.getDeclarationName()} filter${pojo.getDeclarationName()}, ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")} jqGridRequestDto) {
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign selectFieldsDinamyc = utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		// FROM
        //StringBuilder from = new StringBuilder("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
        List<String> from = new ArrayList<String>();
        <#list paramtabSelectDinamyc as param>
        from.add("${param?substring(0, param?index_of(' t'))}");
        </#list>
        
        //TABLAS_ALIAS
		List<String> from_alias = new ArrayList<String>();
		<#list paramtabSelectDinamyc as param>
		from_alias.add("${param?substring(param?index_of(' t'),param?length)}");
		</#list>

		// JOINS TABLAS
		/*
		 * Ejemplo de como indicar joins entre las tablas de la query
		 */
		/*
		 * StringBuilder joins = new StringBuilder("");
		 * joins.append("AND T1.ID=T2.ID_T1");
		 */

		// CONDICIONES (negocio)
		/*
		 * Ejemplo de como incluir condiciones de negocio en la consulta de la
		 * jerarquía
		 */
		/*
		 * StringBuilder businessFilters = new StringBuilder(); List<Object>
		 * businessParams = new ArrayList<Object>();
		 * businessFilters.append("   AND t1.EJIE = ?  ");
		 * businessParams.add("1");
		 */

		//FILTRO
		Map<String, ?> mapaWhere = this.getWhereLikeMap(filter${pojo.getDeclarationName()}, false);
		
		//JERARQUIA
		// Especificar la columna padre correspondiente en lugar de la generada por defecto (ID_PADRE)
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg)>
		StringBuilder query = ${pojo.importType("com.ejie.x38.dto.JQGridManagerJerarquia")}.getQueryCount(jqGridRequestDto, mapaWhere, "<#list paramWhere as param>${param}<#if param_has_next>,</#if></#list>", "ID_PADRE", from, from_alias);
		
		/*
		 * Ejemplo de llamada en caso de indicar joins entre tablas y condiciones de negocio
		 */
//		StringBuilder query = JQGridManagerJerarquia.getQueryCount(jqGridRequestDto, mapaWhere, "ID", "ID_PADRE", from, from_alias, joins, businessFilters, businessParams);


		List<?> params = (List<?>) mapaWhere.get("params");
		return this.jdbcTemplate.queryForLong(query.toString(), params.toArray());
	}

	/**
	 * Find dependent hierarchical rows
     * 
     * @param filter${pojo.getDeclarationName()} ${pojo.getDeclarationName()}
     * @param jqGridRequestDto ${pojo.importType("com.ejie.x38.dto.JQGridRequestDto")}
     * @return List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>> 
     */
	@Override
	public List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>> findAllChild(${pojo.getDeclarationName()} filter${pojo.getDeclarationName()}, JQGridRequestDto jqGridRequestDto) {
		
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign selectFieldsDinamyc = utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		// FROM
        //StringBuilder from = new StringBuilder("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
        List<String> from = new ArrayList<String>();
        <#list paramtabSelectDinamyc as param>
        from.add("${param?substring(0, param?index_of(' t'))}");
        </#list>
        
        //TABLAS_ALIAS
		List<String> from_alias = new ArrayList<String>();
		<#list paramtabSelectDinamyc as param>
		from_alias.add("${param?substring(param?index_of(' t'),param?length)}");
		</#list>
		
		// JOINS TABLAS
		/*
		 * Ejemplo de como indicar joins entre las tablas de la query
		 */
		/*
		 * StringBuilder joins = new StringBuilder("");
		 * joins.append("AND T1.ID=T2.ID_T1");
		 */

		// CONDICIONES (negocio)
		/*
		 * Ejemplo de como incluir condiciones de negocio en la consulta de la
		 * jerarquía
		 */
		/*
		 * StringBuilder businessFilters = new StringBuilder(); List<Object>
		 * businessParams = new ArrayList<Object>();
		 * businessFilters.append("   AND t1.EJIE = ?  ");
		 * businessParams.add("1");
		 */

		//FILTRO
		Map<String, ?> mapaWhere = this.getWhereLikeMap(filter${pojo.getDeclarationName()}, false);
		
		//MULTISELECCION
		// Especificar la columna padre correspondiente en lugar de la generada por defecto (ID_PADRE)
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg)>
		StringBuilder query = ${pojo.importType("com.ejie.x38.dto.JQGridManagerJerarquia")}.getQueryChildren(jqGridRequestDto, mapaWhere, "<#list paramWhere as param>${param}<#if param_has_next>,</#if></#list>", "ID_PADRE", from, from_alias);
		
		/*
		 * Ejemplo de llamada en caso de indicar joins entre tablas y condiciones de negocio
		 */
//		StringBuilder query = JQGridManagerJerarquia.getQueryChildren(jqGridRequestDto, mapaWhere, "ID", "ID_PADRE", from, from_alias, joins, businessFilters, businessParams);

		List<?> params = (List<?>) mapaWhere.get("params");
		
		return this.jdbcTemplate.query(query.toString(), new ${pojo.importType("com.ejie.x38.dao.RowNumResultSetExtractor")}<${pojo.getDeclarationName()}>(this.rwMapPK, "<#list paramWhere as param>${param}<#if param_has_next>,</#if></#list>"), params.toArray());
	}

	/*
	 * MÉTODOS PRIVADOS
	 */
	 	
	/**
	 * Returns a map with the needed value to create the conditions to filter by 
	 * the ${pojo.getDeclarationName()} entity 
	 * 
	 * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
	 *            Bean with the criteria values to filter by.
	 * @return Map created with two keys
	 *         key query stores the sql query syntax
	 *         key params stores the parameter values to be used in the condition sentence.
	 */
	// CHECKSTYLE:OFF CyclomaticComplexity - Generación de código de UDA
	private Map<String, ?> getWhereMap (${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}){
		
		StringBuilder where = new StringBuilder(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
		List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();

		<#-- sentencias para crear las querys dinamicas -->
		<#assign listaPropiedades = daoUtilities.getDesglosePropiedadesSpringJdbc(pojo,cfg)>
		<#list listaPropiedades as propiedades >
		if (<#if propiedades[3]!=' ' >${pojo.getDeclarationName()?lower_case}!=null && </#if>${pojo.getDeclarationName()?lower_case}${propiedades[3]} != null <#if propiedades[5]!=''>&& ${pojo.getDeclarationName()?lower_case}.${propiedades[5]} != null</#if> && ${pojo.getDeclarationName()?lower_case}.${propiedades[0]} != null ) {
			where.append(" AND ${propiedades[2]} = ?");
			params.add(${pojo.getDeclarationName()?lower_case}.${propiedades[0]});
		}
		</#list>

		${pojo.importType("java.util.Map")}<String,Object> mapWhere = new ${pojo.importType("java.util.HashMap")}<String, Object>();
		mapWhere.put("query", where);
		mapWhere.put("params", params);
		
		return mapWhere;		
	}
	// CHECKSTYLE:ON CyclomaticComplexity - Generación de código de UDA
	
	/**
	 * Returns a map with the needed value to create the conditions to filter by  
	 * the ${pojo.getDeclarationName()} entity 
	 * 
	 * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
	 *            Bean with the criteria values to filter by.
     * @param startsWith Boolean	 
	 * @return Map created with two keys
	 *         key query stores the sql query syntax
	 *         key params stores the parameter values to be used in the condition sentence.
	 */
	// CHECKSTYLE:OFF CyclomaticComplexity - Generación de código de UDA
	private Map<String, Object> getWhereLikeMap (${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, Boolean startsWith){
		
		StringBuilder where = new StringBuilder(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
		List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();

		<#-- sentencias para crear las querys dinamicas -->
		<#assign listaPropiedades = daoUtilities.getDesglosePropiedadesSpringJdbc(pojo,cfg)>
		<#list listaPropiedades as propiedades >
		<#assign strings=propiedades[4]> 
		<#-- si es una fecha entonces comparar con igual sino utilizar like -->
		if (<#if propiedades[3]!=' ' >${pojo.getDeclarationName()?lower_case}!=null && </#if>${pojo.getDeclarationName()?lower_case}${propiedades[3]} != null <#if propiedades[5]!=''>&& ${pojo.getDeclarationName()?lower_case}.${propiedades[5]} != null</#if> && ${pojo.getDeclarationName()?lower_case}.${propiedades[0]} != null ) {
		<#if strings!='0'>
			where.append(" AND UPPER(${propiedades[2]}) like ? ESCAPE  '\\'");
			if (startsWith){
				params.add(${pojo.getDeclarationName()?lower_case}.${propiedades[0]}.toUpperCase() +"%");
			}else{
				params.add("%"+${pojo.getDeclarationName()?lower_case}.${propiedades[0]}.toUpperCase() +"%");
			}
			where.append(" AND ${propiedades[2]} IS NOT NULL");
		<#else>
			where.append(" AND ${propiedades[2]} = ?");
			params.add(${pojo.getDeclarationName()?lower_case}.${propiedades[0]});
		</#if>
	     }			
		</#list>

		${pojo.importType("java.util.Map")}<String,Object> mapWhere = new ${pojo.importType("java.util.HashMap")}<String, Object>();
		mapWhere.put("query", where);
		mapWhere.put("params", params);
		
		return mapWhere;		
	}
	// CHECKSTYLE:ON CyclomaticComplexity - Generación de código de UDA
	
	/**
	 * StringBuilder initilization value
	 */
	 public static final int STRING_BUILDER_INIT = 4096;