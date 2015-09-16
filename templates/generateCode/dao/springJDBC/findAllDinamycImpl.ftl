<#-- 
 -- Copyright 2012 E.J.I.E., S.A.
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
    * Finds a List of rows in the ${pojo.getDeclarationName()} table.
    * 
    * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
    * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}
    * @return ${pojo.importType("java.util.List")} 
    */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAll(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination) {
		<#assign paramtabSelectDinamyc = paramTablaSelect >
		<#assign  selectFieldsDinamyc =utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		StringBuilder query = new StringBuilder("SELECT  <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> "); 
		query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
		
		//Where clause & Params
		Map<String, ?> mapaWhere = this.getWhereMap(${pojo.getDeclarationName()?lower_case}); <#assign  wheretablaJoin =utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);
		
		List<?> params = (List<?>) mapaWhere.get("params");

		if (pagination != null) {
			query = pagination.getPaginationQuery(query);
		}
		
		return (${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>) this.jdbcTemplate.query(query.toString(), this.rwMap, params.toArray());
	}
	
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
	 * Finds rows in the ${pojo.getDeclarationName()} table using like.
     * 
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}
     * @param startsWith Boolean
     * @return ${pojo.importType("java.util.List")} 
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAllLike(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination, Boolean startsWith) {
		<#assign paramtabSelectDinamyc = paramTablaSelect > <#assign  selectFieldsDinamyc =utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
		StringBuilder query = new StringBuilder("SELECT  <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> "); 
        query.append("FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
      	
		//Where clause & Params
		Map<String, ?> mapaWhere = this.getWhereLikeMap(${pojo.getDeclarationName()?lower_case},startsWith); <#assign  wheretablaJoin =utilidadesDao.whereDynamicSelect(pojo,cfg)>
		StringBuilder where = new StringBuilder(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>");
		where.append(mapaWhere.get("query"));
		query.append(where);

		List<?> params = (List<?>) mapaWhere.get("params");

		if (pagination != null) {
			query = pagination.getPaginationQuery(query);
		}
		
		return (${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>) this.jdbcTemplate.query(query.toString(), this.rwMap, params.toArray());
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
		
		StringBuffer where = new StringBuffer(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
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
	private Map<String, ?> getWhereLikeMap (${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, Boolean startsWith){
		
		StringBuffer where = new StringBuffer(${pojo.getDeclarationName()}DaoImpl.STRING_BUILDER_INIT);
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