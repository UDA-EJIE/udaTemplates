<#-- Obtenemos el nombre de la tabla M:N -->
<#assign tablaMN =property.getValue().getCollectionTable().getName() > 
<#-- Obtenemos el nombre de la tabla hijo -->
<#assign subclass = cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())>
<#assign nombreSubclassEntero=subclass.getClassName()>
<#assign nombreSubclass= nombreSubclassEntero?substring(nombreSubclassEntero?last_index_of(".")+1,nombreSubclassEntero?length) >
<#-- Obtenemos la clave primaria de la M:N -->
<#assign primariasMN = property.getValue().getCollectionTable().getPrimaryKey().getColumns() >	
<#-- Obtenemos las columnas relacionadas de la tabla actual con la M:N -->
<#assign campoPadre = property.getValue().getKey().getColumnIterator() > 
      /**
      * Find a single row in the Vendor_payment Many To Many relationship.
      * 
      * @param ${ctrTl.stringDecapitalize(nombreSubclass)}
      *            ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
      * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}
      *            ${pojo.getDeclarationName()}
	  * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}	  
      * @return ${pojo.getDeclarationName()}
       */
        ${pojo.getDeclarationName()} find${ctrTl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))}( ${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())},${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${ctrTl.stringDecapitalize(nombreSubclass)}, ${pojo.importType("com.ejie.x38.dto.Pagination")} pagination);
		 
		   /**
      * Counts the rows in the Vendor_payment Many To Many relationship.
      * 
      * @param ${ctrTl.findHibernateName(ctrTl.stringDecapitalize(nombreSubclass))}
      *            ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
      * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}
      *            ${pojo.getDeclarationName()}
      * @return ${pojo.getDeclarationName()}
      */
       public Long find${ctrTl.findHibernateName(pojo.beanCapitalize(tablaMN?lower_case))}Count(${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())},${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${ctrTl.stringDecapitalize(nombreSubclass)});
    