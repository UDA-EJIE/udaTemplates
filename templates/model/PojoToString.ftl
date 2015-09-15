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
		<#if !c2h.isCollection(field) && !c2h.isOneToOne(field) && !c2h.isOneToMany(field) && !c2h.isManyToOne(field) && !c2h.isManyToMany(field) && utilidades.getJavaTypeNameHibernate(field,false)!='java.sql.Clob' && utilidades.getJavaTypeNameHibernate(field,false)!='java.sql.Blob'  && utilidades.getJavaTypeNameHibernate(field,false)!='java.io.Serializable'  >
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