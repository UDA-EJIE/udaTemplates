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
   		<#if clazz.identifierProperty.composite && field.equals(clazz.identifierProperty)>
		//Clave compuesta
		<#assign primaryKeys = clazz.identifierProperty.value.getPropertyIterator()>
		<#list primaryKeys as pKey>

		<#if !c2h.isCollection(pKey) && !c2h.isOneToOne(pKey) && !c2h.isOneToMany(pKey) && !c2h.isManyToAny(pKey) && utilidades.getJavaTypeNameHibernate(pKey,false)!='java.sql.Clob' && utilidades.getJavaTypeNameHibernate(pKey,false)!='java.sql.Blob'  && utilidades.getJavaTypeNameHibernate(pKey,false)!='java.io.Serializable'>
		 <#if resultado==0>
		  <#assign resultado=1>
		result.append("[ ${pKey.name}: ").append(this.${pKey.name}).append(" ]");
		 <#else>	
		result.append(", [ ${pKey.name}: ").append(this.${pKey.name}).append(" ]");
		 </#if>
        </#if>
		</#list>
		<#else>
		 <#if pojo.getMetaAttribAsBool(field, "gen-property", true)>
		  <#if !c2h.isCollection(field) && !c2h.isOneToOne(field) && !c2h.isOneToMany(field) && !c2h.isManyToOne(field) && !c2h.isManyToMany(field) && utilidades.getJavaTypeNameHibernate(field,false)!='java.sql.Clob' && utilidades.getJavaTypeNameHibernate(field,false)!='java.sql.Blob'  && utilidades.getJavaTypeNameHibernate(field,false)!='java.io.Serializable'   >
		   <#if resultado==0>
		    <#assign resultado=1>
		result.append(" [ ${field.name}: ").append(this.${field.name}).append(" ]");
		   <#else>
		result.append(", [ ${field.name}: ").append(this.${field.name}).append(" ]");
		   </#if>
		  </#if>
		 </#if>
		</#if>
		</#list>    
		result.append("}");
		return result.toString();
	}
