<#if pojo.needsEqualsHashCode() && !clazz.superclass?exists>   
	/** Method 'equals'.
	*  @param other Object
	*  @return boolean
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
	* @return int
	*/
   public int hashCode() {
         int result = 17;
<#foreach property in pojo.getAllPropertiesIterator()>         ${warSupressor.generateHashCode(property, "result", "this", jdk5)}
</#foreach>  
      return result;
   }
</#if>