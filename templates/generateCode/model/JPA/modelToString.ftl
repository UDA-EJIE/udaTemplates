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
	/**
	 * Intended only for logging and debugging.
	 * 
	 * Here, the contents of every main field are placed into the result.
	 * @return String
	 */
	@Override
	public String toString() {
		StringBuilder result = new StringBuilder();
		result.append(this.getClass().getName()).append(" Object { " ); 
    	<#assign resultado=0>		
		<#list pojo.getAllPropertiesIterator() as field>
		<#if !c2h.isCollection(field) && !c2h.isOneToOne(field) && !c2h.isOneToMany(field) && !c2h.isManyToOne(field) && !c2h.isManyToMany(field) && utilidades.getJavaTypeNameHibernate(field,false)!='java.sql.Clob' && utilidades.getJavaTypeNameHibernate(field,false)!='java.sql.Blob'  && utilidades.getJavaTypeNameHibernate(field,false)!='java.io.Serializable'>
			<#if resultado==0>
		<#assign resultado=1>
		result.append("[ ${field.name}: ").append(this.${field.name}).append(" ]");
			<#else>	
		result.append(", [ ${field.name}: ").append(this.${field.name}).append(" ]" );
		   </#if>
		</#if>
		</#list> 
		 
		result.append(" }");
		return result.toString();
	}