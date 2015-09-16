<#-- 
 -- Copyright 2011 E.J.I.E., S.A.
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
<#assign tablaHija= property?substring(property?last_index_of("(")+1,property?length-1)>
<#assign nombreSubclasse= nombreSubclass>
    /**
     * Find a single row in the ${tablaMNName} Many To Many relationship.
     * 
     * @param ${ctrTl.findHibernateName(ctrTl.stringDecapitalize(nombreSubclass))}
     *            ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
     * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}
     *            ${pojo.getDeclarationName()}
	 * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}	  
     * @return ${pojo.getDeclarationName()}
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")}(readOnly = true)
    public ${pojo.getDeclarationName()} find${tablaMNName}(${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())},${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${ctrTl.stringDecapitalize(nombreSubclass)}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination	){
		
		${pojo.importType("javax.persistence.EntityManager")} em = this.getEntityManager();
		${pojo.importType("javax.persistence.criteria.CriteriaBuilder")} cb =  em.getCriteriaBuilder();
		${pojo.importType("javax.persistence.criteria.CriteriaQuery")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> query = cb.createQuery(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}.class);
		${pojo.importType("javax.persistence.criteria.Root")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> ${ctrTl.stringDecapitalize(nombreSubclass)}Aux = query.from(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}.class);
		${pojo.importType("java.util.List")}<${pojo.importType("javax.persistence.criteria.Predicate")}> predicates = new ${pojo.importType("java.util.ArrayList")}<${pojo.importType("javax.persistence.criteria.Predicate")}>();
			
		<#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(nombreSubclass)+'_')>
			 <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(nombreSubclass))>
		<#foreach temp in daoUtilities.getFromParams(c2j.getPOJOClass(subclass),cfg) >
		    <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp[1])+'_')>
			 <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp[1]))>
			 <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp[0])+'_')>
			 <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp[0]))>
			 ${pojo.importType("javax.persistence.criteria.Join")}< ${pojo.beanCapitalize(temp[0])}, ${pojo.beanCapitalize(temp[1])}> ${temp[2]} = ${temp[3]}.join(
			${pojo.beanCapitalize(temp[0])}_.${temp[4]}, ${pojo.importType("javax.persistence.criteria.JoinType")}.LEFT);
		</#foreach>
		
		
		<#foreach temp2 in daoUtilities.getFirsLevelFields(c2j.getPOJOClass(subclass),true) >
	       if (${ctrTl.stringDecapitalize(nombreSubclass)} != null && ${ctrTl.stringDecapitalize(nombreSubclass)}.${temp2[2]} != null <#if temp2[5]!=''> ${temp2[5]} </#if>) {
				predicates.add(cb.equal(${ctrTl.stringDecapitalize(nombreSubclass)}Aux.get(${nombreSubclass}_.${temp2[1]}), ${ctrTl.stringDecapitalize(nombreSubclass)}.${temp2[2]}));
	       }                                         
		</#foreach>
	
		<#foreach temp3 in daoUtilities.getSecondLevelFields(c2j.getPOJOClass(subclass),cfg,true) >
	       if (${temp3[0]?lower_case}.get${pojo.beanCapitalize(temp3[1])}() != null && ${temp3[0]?lower_case}.get${pojo.beanCapitalize(temp3[1])}().${temp3[3]} != null <#if temp3[8]!=''> ${temp3[8]} </#if>) {
				predicates.add(cb.equal(${temp3[4]}.get(${pojo.beanCapitalize(temp3[1])}_.${temp3[2]}), ${temp3[0]?lower_case}.get${pojo.beanCapitalize(temp3[1])}().${temp3[3]}));
	       }                                   
		</#foreach>
		<#foreach temp4 in daoUtilities.getThirdLevelFields(c2j.getPOJOClass(subclass),cfg, true) >
	       if (${temp4[0]?lower_case}.get${pojo.beanCapitalize(temp4[1])}().get${pojo.beanCapitalize(temp4[2])}() != null && ${temp4[0]?lower_case}.get${pojo.beanCapitalize(temp4[1])}().get${pojo.beanCapitalize(temp4[2])}().${temp4[4]} != null <#if temp4[8]!=''> ${temp4[8]} </#if>) {
				predicates.add(cb.equal(${temp4[5]}.get(${pojo.beanCapitalize(temp4[2])}_.${temp4[3]}), ${temp4[0]?lower_case}.get${pojo.beanCapitalize(temp4[1])}().get${pojo.beanCapitalize(temp4[2])}().${temp4[4]}));
			}                      
		</#foreach>

		${pojo.importType("javax.persistence.criteria.Join")}< ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}, ${pojo.getDeclarationName()}> ${pojo.beanCapitalize(tablaHija)}_${ctrTl.stringDecapitalize(pojo.getDeclarationName())} = ${ctrTl.stringDecapitalize(nombreSubclass)}Aux.join(
		${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}_.${daoUtilities.getFieldNameFromType(c2j.getPOJOClass(subclass), cfg, pojo.getDeclarationName())}, ${pojo.importType("javax.persistence.criteria.JoinType")}.INNER);

	 	if (${ctrTl.stringDecapitalize(pojo.getDeclarationName())}!=null && ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}.get${pojo.beanCapitalize(clazz.identifierProperty.name)}() != null){
				predicates.add(cb.equal(${pojo.beanCapitalize(tablaHija)}_${ctrTl.stringDecapitalize(pojo.getDeclarationName())}.get(${pojo.getDeclarationName()}_.${clazz.identifierProperty.name}),
                             ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}.get${pojo.beanCapitalize(clazz.identifierProperty.name)}()));
		}
		query.where(predicates.toArray(new Predicate[] {}));
      
	 	  
		List<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> listaAuxiliar = (List<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}>) queryPagination${tablaMNName}(pagination, query,${ctrTl.stringDecapitalize(nombreSubclass)}Aux
					,cb).getResultList();
		 ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}.set${pojo.beanCapitalize(daoUtilities.getFieldNameFromType(pojo, cfg, nombreSubclass))}(listaAuxiliar);
	  return  ${ctrTl.stringDecapitalize(pojo.getDeclarationName())};
	}
	
	/**
     * Counts the rows in the ${tablaMNName} Many To Many relationship.
     * 
     * @param ${ctrTl.findHibernateName(ctrTl.stringDecapitalize(nombreSubclass))}
     *            ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
     * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}
     *            ${pojo.getDeclarationName()}
     * @return ${pojo.getDeclarationName()}
     */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")}(readOnly = true)
    public Long find${tablaMNName}Count(${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())},${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${ctrTl.stringDecapitalize(nombreSubclass)}){
        
		${pojo.importType("javax.persistence.EntityManager")} em = this.getEntityManager();
		${pojo.importType("javax.persistence.criteria.CriteriaBuilder")} cb =  em.getCriteriaBuilder();
		${pojo.importType("javax.persistence.criteria.CriteriaQuery")}<Long> query = cb.createQuery(Long.class);
		${pojo.importType("javax.persistence.criteria.Root")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> ${ctrTl.stringDecapitalize(nombreSubclass)}Aux = query.from(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}.class);
		${pojo.importType("java.util.List")}<${pojo.importType("javax.persistence.criteria.Predicate")}> predicates = new ${pojo.importType("java.util.ArrayList")}<${pojo.importType("javax.persistence.criteria.Predicate")}>();
			
		<#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(nombreSubclass)+'_')>
		<#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(nombreSubclass))>
		<#foreach temp in daoUtilities.getFromParams(c2j.getPOJOClass(subclass),cfg) >
		    <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp[1])+'_')>
			 <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp[1]))>
			 <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp[0])+'_')>
			 <#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp[0]))>
			 ${pojo.importType("javax.persistence.criteria.Join")}< ${pojo.beanCapitalize(temp[0])}, ${pojo.beanCapitalize(temp[1])}> ${temp[2]} = ${temp[3]}.join(
			${pojo.beanCapitalize(temp[0])}_.${temp[1]}, ${pojo.importType("javax.persistence.criteria.JoinType")}.LEFT);
		</#foreach>
		
		
		<#foreach temp2 in daoUtilities.getFirsLevelFields(c2j.getPOJOClass(subclass),true) >
	       if (${ctrTl.stringDecapitalize(nombreSubclass)} != null && ${ctrTl.stringDecapitalize(nombreSubclass)}.${temp2[2]} != null <#if temp2[5]!=''> ${temp2[5]} </#if>) {
				predicates.add(cb.equal(${ctrTl.stringDecapitalize(nombreSubclass)}Aux.get(${nombreSubclass}_.${temp2[1]}), ${ctrTl.stringDecapitalize(nombreSubclass)}.${temp2[2]}));
	       }                                         
		</#foreach>
		
		<#foreach temp3 in daoUtilities.getSecondLevelFields(c2j.getPOJOClass(subclass),cfg,true) >
	       if (${temp3[0]?lower_case}.get${pojo.beanCapitalize(temp3[1])}() != null && ${temp3[0]?lower_case}.get${pojo.beanCapitalize(temp3[1])}().${temp3[3]} != null <#if temp3[8]!=''> ${temp3[8]} </#if>) {
				predicates.add(cb.equal(${temp3[4]}.get(${pojo.beanCapitalize(temp3[1])}_.${temp3[2]}), ${temp3[0]?lower_case}.get${pojo.beanCapitalize(temp3[1])}().${temp3[3]}));
	       }                                   
		</#foreach>
		<#foreach temp4 in daoUtilities.getThirdLevelFields(c2j.getPOJOClass(subclass),cfg,true) >
	       if (${temp4[0]?lower_case}.get${pojo.beanCapitalize(temp4[1])}().get${pojo.beanCapitalize(temp4[2])}() != null && ${temp4[0]?lower_case}.get${pojo.beanCapitalize(temp4[1])}().get${pojo.beanCapitalize(temp4[2])}().${temp4[4]} != null <#if temp4[8]!=''> ${temp4[8]} </#if>) {
				predicates.add(cb.equal(${temp4[5]}.get(${pojo.beanCapitalize(temp4[2])}_.${temp4[3]}), ${temp4[0]?lower_case}.get${pojo.beanCapitalize(temp4[1])}().get${pojo.beanCapitalize(temp4[2])}().${temp4[4]}));
			}                      
		</#foreach>

		${pojo.importType("javax.persistence.criteria.Join")}< ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}, ${pojo.getDeclarationName()}> ${pojo.beanCapitalize(tablaHija)}_${ctrTl.stringDecapitalize(pojo.getDeclarationName())} = ${ctrTl.stringDecapitalize(nombreSubclass)}Aux.join(
		${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}_.${daoUtilities.getFieldNameFromType(c2j.getPOJOClass(subclass), cfg, pojo.getDeclarationName())}, ${pojo.importType("javax.persistence.criteria.JoinType")}.INNER);

	 	if (${ctrTl.stringDecapitalize(pojo.getDeclarationName())}!=null && ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}.get${pojo.beanCapitalize(clazz.identifierProperty.name)}() != null){
				predicates.add(cb.equal(${pojo.beanCapitalize(tablaHija)}_${ctrTl.stringDecapitalize(pojo.getDeclarationName())}.get(${pojo.getDeclarationName()}_.${clazz.identifierProperty.name}),
                             ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}.get${pojo.beanCapitalize(clazz.identifierProperty.name)}()));
		}
		query.select(cb.count(${ctrTl.stringDecapitalize(nombreSubclass)}Aux)); 
		query.where(predicates.toArray(new Predicate[] {}));
	    return (Long) em.createQuery(query).getSingleResult();
	}
	
	private  ${pojo.importType("javax.persistence.TypedQuery")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> queryPagination${tablaMNName}(${pojo.importType("com.ejie.x38.dto.Pagination")} pagination,
                  ${pojo.importType("javax.persistence.criteria.CriteriaQuery")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> query, ${pojo.importType("javax.persistence.criteria.Root")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> ${ctrTl.stringDecapitalize(nombreSubclass)}Aux,
                  ${pojo.importType("javax.persistence.criteria.CriteriaBuilder")} cb) {
		    
		if (pagination != null && pagination.getSort() != null ) {
			<#foreach temp2 in daoUtilities.getFirsLevelFields(c2j.getPOJOClass(subclass),false) >
			<#if temp2[4]!=''>
				if (pagination.getSort().equals("${temp2[4]}")) {
				    if (pagination.getAscDsc().equals("desc")) {
						query.orderBy(cb.desc(${ctrTl.stringDecapitalize(nombreSubclass)}Aux.get(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}__.${temp2[1]}).get(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}Id_.${temp2[4]})));
					}else{
					    query.orderBy(cb.asc(${ctrTl.stringDecapitalize(nombreSubclass)}Aux.get(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}__.${temp2[1]}).get(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}Id_.${temp2[4]})));
					}	
				}    
			<#else>
				if (pagination.getSort().equals("${temp2[1]}")) {
				    if (pagination.getAscDsc().equals("desc")) {
						query.orderBy(cb.desc(${ctrTl.stringDecapitalize(nombreSubclass)}Aux.get(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}_.${temp2[1]})));
					}else{
					    query.orderBy(cb.asc(${ctrTl.stringDecapitalize(nombreSubclass)}Aux.get(${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}_.${temp2[1]})));
					}	
				}    
            </#if>	   
			</#foreach>
			<#foreach temp3 in daoUtilities.getSecondLevelFieldsPK(c2j.getPOJOClass(subclass),cfg,false) >
				<#if temp3[7]!=''>
				if (pagination.getSort().equals("${temp3[7]}")) {
			  		if (pagination.getAscDsc().equals("desc")) {
			  			<#assign importar=pojo.importType(pojo.getPackageName()+'.model.'+pojo.beanCapitalize(temp3[1])+'Id_')>
	                	query.orderBy(cb.desc(${pojo.getDeclarationName()?lower_case}Aux.get(${pojo.getDeclarationName()}_.${ctrTl.stringDecapitalize(temp3[1])})
	                                         .get(${pojo.beanCapitalize(temp3[1])}_.${temp3[2]}).get(${pojo.beanCapitalize(temp3[1])}Id_.${temp3[7]})));
	        		} else {
	                	query.orderBy(cb.asc(${pojo.getDeclarationName()?lower_case}Aux.get(${pojo.getDeclarationName()}_.${ctrTl.stringDecapitalize(temp3[1])})
	                                         .get(${pojo.beanCapitalize(temp3[1])}_.${temp3[2]}).get(${pojo.beanCapitalize(temp3[1])}Id_.${temp3[7]})));
				<#else>
				if (pagination.getSort().equals("${temp3[2]}")) {
			       if (pagination.getAscDsc().equals("desc")) {
	                	query.orderBy(cb.desc(${pojo.getDeclarationName()?lower_case}Aux.get(${pojo.getDeclarationName()}_.${ctrTl.stringDecapitalize(temp3[1])})
	                                         .get(${pojo.beanCapitalize(temp3[1])}_.${temp3[2]})));
	            	} else {
	                	query.orderBy(cb.asc(${pojo.getDeclarationName()?lower_case}Aux.get(${pojo.getDeclarationName()}_.${ctrTl.stringDecapitalize(temp3[1])})
	                                         .get(${pojo.beanCapitalize(temp3[1])}_.${temp3[2]})));
				</#if>
        		}
	 		}				
			</#foreach>
		}
		TypedQuery<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> queryPag = this.getEntityManager().createQuery(
                    query);
        if (pagination != null && pagination.getRows() != null
                    && pagination.getPage() != null) {
              queryPag.setFirstResult((int) ((pagination.getPage() - 1) * pagination
                         .getRows()));
              queryPag.setMaxResults(pagination.getRows().intValue() - 1);
        } else if (pagination != null && pagination.getRows() != null
                    && pagination.getPage() == null) {
              queryPag.setFirstResult(1);
              queryPag.setMaxResults(pagination.getRows().intValue() - 1);
        }
    	return queryPag;
	}