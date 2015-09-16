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
package ${pojo.getPackageName()}.model.dto;
<#foreach import in utilesDto.getDtoImports(pojo,cfg)>
import ${import};
</#foreach>
<#assign classbody>
<#include "modelTypeDeclarationDto.ftl"/> {

<#if !pojo.isInterface()>
<#include "modelFieldsDto.ftl"/>
<#include "modelPropertyAccessorsDto.ftl"/>
<#else>
 <#include "modelInterfacePropertyAccessorsDto.ftl"/> 
</#if>
<#include "../modelToString.ftl"/>
}
</#assign>

${pojo.generateImports()}
${classbody}
