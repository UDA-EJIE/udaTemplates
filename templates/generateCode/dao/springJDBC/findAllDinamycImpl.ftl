<#--
 -- Copyright 2023 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la Â«LicenciaÂ»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
 -- el programa distribuido con arreglo a la Licencia se distribuye Â«TAL CUALÂ»,
 -- SIN GARANTÃ�AS NI CONDICIONES DE NINGÃšN TIPO, ni expresas ni implÃ­citas.
 -- VÃ©ase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
   /**
    * Finds a list of rows in the ${pojo.getDeclarationName()} table.
    *
    * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
    * @param tableRequestDto ${pojo.importType("com.ejie.x38.dto.TableRequestDto")}
    *
    * @return ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>
    */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAll(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.TableRequestDto")} tableRequestDto) {
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign selectFieldsDinamyc = utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT  <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> ");
		
		// FROM
		query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");

		// WHERE clause & Params
		Map<String, ?> mapaWhere = this.getWhereMap(${pojo.getDeclarationName()?lower_case}); <#assign  wheretablaJoin =utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		List<?> params = (List<?>) mapaWhere.get("params");

		if (tableRequestDto != null) {
			query = ${pojo.importType("com.ejie.x38.dto.TableManager")}.getPaginationQuery(tableRequestDto, query, ${pojo.getDeclarationName()}DaoImpl.ORDER_BY_WHITE_LIST);
		}

		return this.jdbcTemplate.query(query.toString(), this.rwMap, params.toArray());
	}
	
	/**
     * Finds a List of rows containing the CP field in the ${pojo.getDeclarationName()} table.
     *
     * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())} ${pojo.getDeclarationName()}
	 * @param startsWith boolean
     *
     * @return ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAllIds(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign pkSelect = utilidadesDao.pkSelectFind(pojo,cfg)>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT <#list pkSelect as param>${param}<#if param_has_next>,</#if></#list> ");
		
		// FROM
		query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");

		// WHERE clause & Params
		Map<String, ?> mapaWhere = this.getWhereLikeMap(${pojo.getDeclarationName()?lower_case}, startsWith); <#assign wheretablaJoin = utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		List<?> params = (List<?>) mapaWhere.get("params");

		return this.jdbcTemplate.query(query.toString(), this.rwMapPK, params.toArray());
	}

	/**
	 * Finds rows in the ${pojo.getDeclarationName()} table using like.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param tableRequestDto ${pojo.importType("com.ejie.x38.dto.TableRequestDto")}
     * @param startsWith Boolean
     *
     * @return ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAllLike(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.TableRequestDto")} tableRequestDto, Boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect > <#assign  selectFieldsDinamyc =utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT  <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> ");
		
		// FROM
        query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");

		// WHERE clause & Params
		Map<String, ?> mapaWhere = this.getWhereLikeMap(${pojo.getDeclarationName()?lower_case},startsWith); <#assign wheretablaJoin = utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		List<?> params = (List<?>) mapaWhere.get("params");

		if (tableRequestDto != null) {
			query = ${pojo.importType("com.ejie.x38.dto.TableManager")}.getPaginationQuery(tableRequestDto, query, ${pojo.getDeclarationName()}DaoImpl.ORDER_BY_WHITE_LIST);
		}

		return this.jdbcTemplate.query(query.toString(), this.rwMap, params.toArray());
	}

	/*
	 * OPERACIONES RUP_TABLE
	 */

    /**
     * Counts rows in the ${pojo.getDeclarationName()} table.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     *
     * @return Long
     */
    @${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public Long findAllCount(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}) {
		<#assign paramtabSelectDinamycCont = paramTablaSelect>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT COUNT(1) FROM <#list paramtabSelectDinamycCont as param>${param}<#if param_has_next>, </#if></#list>");

		// WHERE clause & Params
		Map<String, ?> mapaWhere = this.getWhereMap(${pojo.getDeclarationName()?lower_case}); <#assign wheretablaJoinCont= wheretablaJoin >
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoinCont as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		List<?> params = (List<?>) mapaWhere.get("params");

		return this.jdbcTemplate.queryForObject(query.toString(), params.toArray(), Long.class);
	}

	/**
	 * Counts rows in the ${pojo.getDeclarationName()} table using like.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param startsWith Boolean
     *
     * @return Long
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public Long findAllLikeCount(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, Boolean startsWith) {
		<#assign paramtabSelectDinamycCont = paramTablaSelect>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT COUNT(1) FROM <#list paramtabSelectDinamycCont as param>${param}<#if param_has_next>,</#if></#list>");

		// WHERE clause & Params
		Map<String, ?> mapaWhere = this.getWhereLikeMap(${pojo.getDeclarationName()?lower_case},startsWith); <#assign wheretablaJoinCont= wheretablaJoin >
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		List<?> params = (List<?>) mapaWhere.get("params");

		return this.jdbcTemplate.queryForObject(query.toString(), params.toArray(), Long.class);
	}

	/**
	 * Reorder the data list of ${pojo.getDeclarationName()} selected for rup_table
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param tableRequestDto ${pojo.importType("com.ejie.x38.dto.TableRequestDto")}
     * @param startsWith Boolean
     *
     * @return List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>>
     */
	@Override
	public List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>> reorderSelection(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.TableRequestDto")} tableRequestDto, Boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign  selectFieldsDinamyc =utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg,true)>
		// SELECT
		StringBuilder query = new StringBuilder("SELECT <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> ");
		// FROM
        query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
		// FILTRADO
		// WHERE clause & Params
		Map<String, ?> mapaWhere = this.getWhereLikeMap(${pojo.getDeclarationName()?lower_case},startsWith); <#assign wheretablaJoin = utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		// Parámetros de filtrado
		@SuppressWarnings("unchecked")
		List<Object> filterParamList = (List<Object>) mapaWhere.get("params");

		// SQL para la reordenación
		StringBuilder sbReorderSelectionSQL =  ${pojo.importType("com.ejie.x38.dto.TableManager")}.getReorderQuery(query, tableRequestDto, ${pojo.getDeclarationName()}.class, filterParamList, <#list paramWhere as param>"${param?lower_case}"<#if param_has_next>,</#if></#list> );

		return this.jdbcTemplate.query(sbReorderSelectionSQL.toString(), new ${pojo.importType("com.ejie.x38.dao.RowNumResultSetExtractor")}<${pojo.getDeclarationName()}>(this.rwMapPK, tableRequestDto), filterParamList.toArray());
	}

	/**
	 * Search method for rup_table
     *
     * @param filterParams ${pojo.getDeclarationName()}
     * @param searchParams ${pojo.getDeclarationName()}
     * @param tableRequestDto ${pojo.importType("com.ejie.x38.dto.TableRequestDto")}
     * @param startsWith Boolean
     *
     * @return List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>>
     */
	@Override
	public List<${pojo.importType("com.ejie.x38.dto.TableRowDto")}<${pojo.getDeclarationName()}>> search(${pojo.getDeclarationName()} filterParams, ${pojo.getDeclarationName()} searchParams, ${pojo.importType("com.ejie.x38.dto.TableRequestDto")} tableRequestDto, Boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect>
		<#assign  selectFieldsDinamyc = utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg,true)>
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
		StringBuilder sbReorderSelectionSQL = ${pojo.importType("com.ejie.x38.dto.TableManager")}.getSearchQuery(query, tableRequestDto, ${pojo.getDeclarationName()}.class, filterParamList, searchSQL, searchParamList, from_alias, "<#list paramWhere as param>${param}<#if param_has_next>,</#if></#list>");

		return this.jdbcTemplate.query(sbReorderSelectionSQL.toString(), new ${pojo.importType("com.ejie.x38.dao.RowNumResultSetExtractor")}<${pojo.getDeclarationName()}>(this.rwMapPK, tableRequestDto), filterParamList.toArray());
	}

	/**
	 * Remove multiple method for rup_table
     *
     * @param tableRequestDto ${pojo.importType("com.ejie.x38.dto.TableRequestDto")}
     */
	@Override
	public void removeMultiple(${pojo.importType("com.ejie.x38.dto.TableRequestDto")} tableRequestDto) {
		<#assign paramWhere = utilidadesDao.getWherePk(pojo,cfg,true)>	
		StringBuilder sbRemoveMultipleSQL = ${pojo.importType("com.ejie.x38.dto.TableManager")}.getRemoveMultipleQuery(null,tableRequestDto, ${pojo.getDeclarationName()}.class, "${ctrTl.findDataBaseName(pojo.getDeclarationName())?upper_case}","t1", new String[]{<#list paramWhere as param>"${param}"<#if param_has_next>,</#if></#list>});
		
		<#if paramWhere?size gt 1>
		List<String> selectedIds = tableRequestDto.getMultiselection().getSelectedIds();
		List<String> params = new ArrayList<String>();
		
		for(String row : selectedIds) {
			String[] parts = row.split(${pojo.importType("com.ejie.x38.util.Constants")}.PK_TOKEN);
			for(String param : parts) {
				params.add(param);
			}
		}
		<#else>
		List<String> params = tableRequestDto.getMultiselection().getSelectedIds();
		</#if>
		
		this.jdbcTemplate.update(sbRemoveMultipleSQL.toString(), params.toArray());
	}

	/*
	 * MÃ‰TODOS PRIVADOS
	 */

	/**
	 * Returns a map with the needed value to create the conditions to filter by
	 * the ${pojo.getDeclarationName()} entity
	 *
	 * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
	 *            Bean with the criteria values to filter by.
	 *
	 * @return Map created with two keys
	 *         key query stores the sql query syntax
	 *         key params stores the parameter values to be used in the condition sentence.
	 */
	private Map<String, ?> getWhereMap(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}) {
		StringBuilder where = new StringBuilder(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
		List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();

		<#-- sentencias para crear las querys dinamicas -->
		<#assign listaPropiedades = daoUtilities.getDesglosePropiedadesSpringJdbc(pojo,cfg)>
		<#list listaPropiedades as propiedades>
		if (<#if propiedades[3]!=' '>${pojo.getDeclarationName()?lower_case}!=null && </#if>${pojo.getDeclarationName()?lower_case}${propiedades[3]} != null <#if propiedades[5]!=''>&& ${pojo.getDeclarationName()?lower_case}.${propiedades[5]} != null</#if> && ${pojo.getDeclarationName()?lower_case}.${propiedades[0]} != null) {
			where.append(" AND ${propiedades[2]} = ?");
			params.add(${pojo.getDeclarationName()?lower_case}.${propiedades[0]});
		}
		</#list>

		${pojo.importType("java.util.Map")}<String,Object> mapWhere = new ${pojo.importType("java.util.HashMap")}<String, Object>();
		mapWhere.put("query", where);
		mapWhere.put("params", params);

		return mapWhere;
	}

	/**
	 * Returns a map with the needed value to create the conditions to filter by
	 * the ${pojo.getDeclarationName()} entity
	 *
	 * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
	 *            Bean with the criteria values to filter by.
     * @param startsWith Boolean
     *
	 * @return Map created with two keys
	 *         key query stores the sql query syntax
	 *         key params stores the parameter values to be used in the condition sentence.
	 */
	private Map<String, Object> getWhereLikeMap(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, Boolean startsWith) {
		StringBuilder where = new StringBuilder(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
		List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();

		<#-- sentencias para crear las querys dinamicas -->
		<#assign listaPropiedades = daoUtilities.getDesglosePropiedadesSpringJdbc(pojo,cfg)>
		<#list listaPropiedades as propiedades>
		<#assign strings=propiedades[4]>
		<#-- si es una fecha entonces comparar con igual sino utilizar like -->
		if (<#if propiedades[3]!=' ' >${pojo.getDeclarationName()?lower_case}!=null && </#if>${pojo.getDeclarationName()?lower_case}${propiedades[3]} != null <#if propiedades[5]!=''>&& ${pojo.getDeclarationName()?lower_case}.${propiedades[5]} != null</#if> && ${pojo.getDeclarationName()?lower_case}.${propiedades[0]} != null ) {
		<#if strings!='0'>
			where.append(" AND UPPER(${propiedades[2]}) like ? ESCAPE  '\\'");
			if (startsWith) {
				params.add(${pojo.getDeclarationName()?lower_case}.${propiedades[0]}.toUpperCase() + "%");
			} else {
				params.add("%"+${pojo.getDeclarationName()?lower_case}.${propiedades[0]}.toUpperCase() + "%");
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