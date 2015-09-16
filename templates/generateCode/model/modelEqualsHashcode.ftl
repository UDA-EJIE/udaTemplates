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
<#if pojo.needsEqualsHashCode() && !clazz.superclass?exists>   
	/** Method 'equals'.
	 *
	 * @param other Object
	 * @return boolean
	 */
	public boolean equals(Object other) {
         if ((this == other)) { return true; }
		 if ((other == null)) { return false; }
		 if (!(other instanceof ${pojo.getDeclarationName()})){ return false; }
		 ${pojo.getDeclarationName()} castOther = (${pojo.getDeclarationName()}) other; 
		 return ${warSupressor.generateEquals("this", "castOther", jdk5,pojo)};
	}
	
	/**
	 * Method 'hashCode'.
	 *
	 * @return int
	 */
	public int hashCode() {
		int result = 17;
		<#foreach property in pojo.getAllPropertiesIterator()>
		${warSupressor.generateHashCode(property, "result", "this", jdk5)}
		</#foreach>
		return result;
	}
</#if>