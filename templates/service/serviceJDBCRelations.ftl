<#-- Obtenemos el nombre de la tabla M:N -->
<#assign tablaMN =property.getValue().getCollectionTable().getName() >
<#-- Obtenemos el nombre de la tabla hijo -->
<#assign subclass = cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())>
<#assign nombreSubclassEntero=subclass.getClassName()>
<#assign nombreSubclass= nombreSubclassEntero?substring(nombreSubclassEntero?last_index_of(".")+1,nombreSubclassEntero?length) >

    /**
     * Inserts a single row in the ${ctrTl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))} table.
     *
     * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}  ${pojo.getDeclarationName()}
     * @return ${pojo.getDeclarationName()} 
     */
 ${pojo.getDeclarationName()} add${pojo.beanCapitalize(ctrTl.findHibernateName(tablaMN?lower_case))} (${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())});

    /**
     * Deletes a single row in the ${pojo.beanCapitalize(tablaMN?lower_case)} table.
     *
     * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())} ${pojo.getDeclarationName()}
     */
 void remove${pojo.beanCapitalize(ctrTl.findHibernateName(tablaMN?lower_case))}(${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())});

   /**
     * Find a single row in the find${ctrTl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))} Many To Many relationship.
     *
     * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()}
     * @param  ${nombreSubclass?lower_case} ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
     * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}
     * @return ${pojo.getDeclarationName()}
     */
  ${pojo.getDeclarationName()} find${pojo.beanCapitalize(ctrTl.findHibernateName(tablaMN?lower_case))}(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${nombreSubclass?lower_case}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination);

    /**
     * Counts rows in the ${pojo.getDeclarationName()} table.
     * 
     * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())} ${pojo.getDeclarationName()}
     * @param  ${nombreSubclass?lower_case} ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
     * @return ${pojo.importType("java.util.List")}
     */
 Long find${pojo.beanCapitalize(ctrTl.findHibernateName(tablaMN?lower_case))}Count(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}, ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize((nombreSubclass)))} ${nombreSubclass?lower_case}) ;
