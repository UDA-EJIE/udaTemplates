   /**
    * Finds a List of rows in the ${pojo.getDeclarationName()} table.
    * 
    * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
    * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}
    * @return ${pojo.importType("java.util.List")} 
    */
@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAll(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination) {
      StringBuffer where = new StringBuffer(3000);
      List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();
      <#assign  wheretablaJoin =utilidadesDao.whereDynamicSelect(pojo,cfg)>
      where.append(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>	");
      <#assign paramtabSelectDinamyc = paramTablaSelect >
      <#assign  selectFieldsDinamyc =utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
      StringBuffer query = new StringBuffer("SELECT  <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> " 
        + "FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
      <#-- sentencias para crear las querys dinamicas -->
      <#assign listaPropiedades = daoUtilities.getDesglosePropiedadesSpringJdbc(pojo,cfg)>
      <#list listaPropiedades as propiedades >
        if (<#if propiedades[3]!=' ' >${pojo.getDeclarationName()?lower_case}!=null && </#if>${pojo.getDeclarationName()?lower_case}${propiedades[3]} != null <#if propiedades[5]!=''>&& ${pojo.getDeclarationName()?lower_case}.${propiedades[5]} != null</#if> && ${pojo.getDeclarationName()?lower_case}.${propiedades[0]} != null ) {
           where.append(" AND ${propiedades[2]} = ?");
           params.add(${pojo.getDeclarationName()?lower_case}.${propiedades[0]});
        }
      </#list>			
	     query.append(where);
        

        StringBuffer order = new StringBuffer(3000);
        if (pagination != null) {
          if (pagination.getSort() != null) {
             order.append(" ORDER BY " + pagination.getSort() + " " + pagination.getAscDsc());
             query.append(order);
          }

          query = new StringBuffer(${pojo.importType("com.ejie.x38.util.PaginationManager")}.getQueryLimits(pagination,query.toString()));
        }
		
		return (${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>) this.jdbcTemplate.query(query.toString(),rwMap, params.toArray());
    }
    /**
     * Counts rows in the ${pojo.getDeclarationName()} table.
     * 
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @return Long
     */
    @${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
     public Long findAllCount(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}) {

       StringBuffer where = new StringBuffer(3000);
       List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();
       <#assign wheretablaJoinCont= wheretablaJoin >
       where.append(" WHERE 1=1  <#list wheretablaJoinCont as param>and ${param} </#list>");

      <#assign paramtabSelectDinamycCont = paramTablaSelect >
      StringBuffer query = new StringBuffer("SELECT COUNT(1) FROM <#list paramtabSelectDinamycCont as param> ${param} <#if param_has_next> , </#if></#list>");
      <#-- sentencias para crear las querys dinamicas -->
	
      <#assign listaPropiedades = daoUtilities.getDesglosePropiedadesSpringJdbc(pojo,cfg)>
        <#list listaPropiedades as propiedades >
          if (<#if propiedades[3]!=' ' >${pojo.getDeclarationName()?lower_case}!=null && </#if>${pojo.getDeclarationName()?lower_case}${propiedades[3]} != null <#if propiedades[5]!=''>&& ${pojo.getDeclarationName()?lower_case}.${propiedades[5]} != null</#if> && ${pojo.getDeclarationName()?lower_case}.${propiedades[0]} != null ) {
            where.append(" AND ${propiedades[2]} = ?");
            params.add(${pojo.getDeclarationName()?lower_case}.${propiedades[0]});
          }
        </#list>

        query.append(where);

         return this.jdbcTemplate.queryForLong(query.toString(), params.toArray());


    }
  /**
    * Finds rows in the ${pojo.getDeclarationName()} table using like.
    * 
    * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
    * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}
    * @return ${pojo.importType("java.util.List")} 
    */
@${pojo.importType("org.springframework.transaction.annotation.Transactional")} (readOnly = true)
    public ${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}> findAllLike(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination, Boolean startsWith) {
      StringBuffer where = new StringBuffer(3000);
      List<Object> params = new ${pojo.importType("java.util.ArrayList")}<Object>();
      <#assign  wheretablaJoin =utilidadesDao.whereDynamicSelect(pojo,cfg)>
      where.append(" WHERE 1=1 <#list wheretablaJoin as param>AND ${param} </#list>	");
      <#assign paramtabSelectDinamyc = paramTablaSelect >
      <#assign  selectFieldsDinamyc =utilidadesDao.camposSelectFindDinamyc(pojo,cfg)>
      StringBuffer query = new StringBuffer("SELECT  <#list selectFieldsDinamyc as param>${param}<#if param_has_next>,</#if></#list> " 
        + "FROM <#list paramtabSelectDinamyc as param>${param}<#if param_has_next>,</#if></#list>");
      <#-- sentencias para crear las querys dinamicas -->

      <#assign listaPropiedades = daoUtilities.getDesglosePropiedadesSpringJdbc(pojo,cfg)>
      <#list listaPropiedades as propiedades >
	  <#assign strings=propiedades[4]> 
        if (<#if propiedades[3]!=' ' >${pojo.getDeclarationName()?lower_case}!=null && </#if>${pojo.getDeclarationName()?lower_case}${propiedades[3]} != null <#if propiedades[5]!=''>&& ${pojo.getDeclarationName()?lower_case}.${propiedades[5]} != null</#if> && ${pojo.getDeclarationName()?lower_case}.${propiedades[0]} != null ) {
			where.append(" AND <#if strings!='0'>UPPER(</#if>${propiedades[2]}<#if strings!='0'>)</#if> like ? ESCAPE  '\\'");
			if (startsWith){
				params.add(${pojo.getDeclarationName()?lower_case}.${propiedades[0]}<#if strings!='0'>.toUpperCase()</#if>  +"%");
			}else{
				params.add("%"+${pojo.getDeclarationName()?lower_case}.${propiedades[0]}<#if strings!='0'>.toUpperCase()</#if> +"%");
			}	
				where.append(" AND ${propiedades[2]} IS NOT NULL");
		
        }
      </#list>			
        
        query.append(where);
        

        StringBuffer order = new StringBuffer(3000);
        if (pagination != null) {
          if (pagination.getSort() != null) {
             order.append(" ORDER BY " + pagination.getSort() + " " + pagination.getAscDsc());
             query.append(order);
          }

          query = new StringBuffer(${pojo.importType("com.ejie.x38.util.PaginationManager")}.getQueryLimits(pagination,query.toString()));
        }
		
		return (${pojo.importType("java.util.List")}<${pojo.getDeclarationName()}>) this.jdbcTemplate.query(query.toString(),rwMap, params.toArray());
    }
