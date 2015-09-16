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
<#assign tablaMN = ctrTl.getRelationName(property.getValue().getCollectionTable().getName()) >

<#-- Obtenemos el nombre de la tabla hijo -->
<#assign subclass = cfg.getClassMapping(property.getValue().getElement().getReferencedEntityName())>
<#assign nombreSubclassEntero=subclass.getClassName()>
<#assign nombreSubclass= nombreSubclassEntero?substring(nombreSubclassEntero?last_index_of(".")+1,nombreSubclassEntero?length) >
<#assign tablaHija= property?substring(property?last_index_of("(")+1,property?length-1)>
	/**
	 * Adds multiple rows in ${tablaMN} table.
	 * 
	 * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()} 
	 * @return           
	 */
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")}(rollbackFor=Throwable.class)
	public void add${tablaMN} (${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}){
		${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}Aux = this.${pojo.getDeclarationName()?lower_case}Dao.find(${pojo.getDeclarationName()?lower_case}.get${pojo.beanCapitalize(clazz.identifierProperty.name)}());
		${pojo.importType("java.util.Iterator")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}>  ${ctrTl.stringDecapitalize(nombreSubclass)}s = ${pojo.getDeclarationName()?lower_case}.get${pojo.beanCapitalize(tablaHija)}().iterator();
		while (${ctrTl.stringDecapitalize(nombreSubclass)}s.hasNext()) {
			${ctrTl.stringDecapitalize(pojo.getDeclarationName())}Aux.get${pojo.beanCapitalize(tablaHija)}().add
									(this.${ctrTl.stringDecapitalize(nombreSubclass)}Dao.find( ${ctrTl.stringDecapitalize(nombreSubclass)}s.next().get${pojo.beanCapitalize(subclass.identifierProperty.name)}()));
		}
		this.${pojo.getDeclarationName()?lower_case}Dao.update(${ctrTl.stringDecapitalize(pojo.getDeclarationName())}Aux);
	}

	/**
	 * Deletes multiple rows in ${tablaMN} table.
	 * 
	 * @param ${pojo.getDeclarationName()?lower_case} ${pojo.getDeclarationName()} 
	 * @return
	 */  
	@${pojo.importType("org.springframework.transaction.annotation.Transactional")}(rollbackFor=Throwable.class)
	public void remove${tablaMN}(${pojo.getDeclarationName()} ${pojo.getDeclarationName()?lower_case}){
		${pojo.importType("java.util.Iterator")}<${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}> iterator = ${pojo.getDeclarationName()?lower_case}.get${pojo.beanCapitalize(tablaHija)}().iterator();
		while (iterator.hasNext()) {
			${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}Aux = this.${pojo.getDeclarationName()?lower_case}Dao.find${tablaMN}( ${pojo.getDeclarationName()?lower_case},iterator.next(),null);
			${ctrTl.stringDecapitalize(pojo.getDeclarationName())}Aux.get${pojo.beanCapitalize(tablaHija)}().remove(0);
			this.${pojo.getDeclarationName()?lower_case}Dao.update(${ctrTl.stringDecapitalize(pojo.getDeclarationName())}Aux);
			break;
		}
	}
		
	/**
	 * Find a single row in ${tablaMN} Many To Many relationship.
	 * 
	 * @param ${ctrTl.findHibernateName(ctrTl.stringDecapitalize(nombreSubclass))}
	 *            ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
	 * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}
	 *            ${pojo.getDeclarationName()}
	 * @param pagination ${pojo.importType("com.ejie.x38.dto.Pagination")}
	 * @return ${pojo.getDeclarationName()}
	 */
	public ${pojo.getDeclarationName()} find${tablaMN}(${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())},${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${ctrTl.stringDecapitalize(nombreSubclass)},${pojo.importType("com.ejie.x38.dto.Pagination")} pagination){
		return this.find${tablaMN}( ${ctrTl.stringDecapitalize(pojo.getDeclarationName())},${ctrTl.stringDecapitalize(nombreSubclass)}, pagination);
	}
	   
	/**
	 * Counts the rows in ${tablaMN} Many To Many relationship.
	 * 
	 * @param ${ctrTl.findHibernateName(ctrTl.stringDecapitalize(nombreSubclass))}
	 *            ${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))}
	 * @param ${ctrTl.stringDecapitalize(pojo.getDeclarationName())}
	 *            ${pojo.getDeclarationName()}
	 * @return ${pojo.getDeclarationName()}
	 */
	public Long find${tablaMN}Count(${pojo.getDeclarationName()} ${ctrTl.stringDecapitalize(pojo.getDeclarationName())},${pojo.importType(pojo.getPackageName()+'.model.'+ pojo.beanCapitalize(nombreSubclass))} ${ctrTl.stringDecapitalize(nombreSubclass)}){
		return find${tablaMN}Count(${ctrTl.stringDecapitalize(pojo.getDeclarationName())},${ctrTl.stringDecapitalize(nombreSubclass)});
	}
