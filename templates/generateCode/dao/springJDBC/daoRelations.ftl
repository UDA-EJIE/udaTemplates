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
<#assign tablaMN = ctrTl.getRelationName(property.getValue().getCollectionTable().getName()) >

<#-- Obtenemos el nombre de la tabla hijo -->
<#assign subclass = cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())>
<#assign nombreSubclassEntero=subclass.getClassName()>
<#assign nombreSubclass= nombreSubclassEntero?substring(nombreSubclassEntero?last_index_of(".")+1,nombreSubclassEntero?length) >
	
	/**
	 * Inserts a single row in the ${tablaMN} table.
	 *
	 * @param ${pojo.getDeclarationName()?lower_case}  ${pojo.getDeclarationName()}
	 * @return ${pojo.getDeclarationName()} 
	 */
	${pojo.getDeclarationName()} add${tablaMN}(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case});   

    /**
     * Deletes a single row in the ${tablaMN} table.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @return 
     */
	void remove${tablaMN}(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case});

    /**
     * Find a single row in the find${tablaMN} Many To Many relationship.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param  ${nombreSubclass?lower_case} ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
     * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}
     * @return ${pojo.getDeclarationName()}
     */
	${pojo.getDeclarationName()} find${tablaMN}(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${nombreSubclass?lower_case}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination);

    /**
     * Counts rows rows in the ${tablaMN} table.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param  ${nombreSubclass?lower_case} ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
     * @return Long
     */
	Long find${tablaMN}Count(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${nombreSubclass?lower_case});
