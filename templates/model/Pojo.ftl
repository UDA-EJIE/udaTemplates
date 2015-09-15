package ${pojo.getPackageName()}.model;


<#assign classbody>
<#include "PojoTypeDeclarationJpa.ftl"/> {

<#if !pojo.isInterface()>
<#include "PojoFields.ftl"/>
<#include "PojoDtoConstructor.ftl"/>
<#include "PojoConstructors.ftl"/>
<#include "PojoPropertyAccessors.ftl"/>
<#include "PojoEqualsHashcode.ftl"/>
<#else>
 <#include "PojoInterfacePropertyAccessors.ftl"/> 
</#if>
<#include "PojoExtraClassCode.ftl"/>
<#include "PojoToString.ftl"/>
}
</#assign>

${pojo.generateImports()}
${classbody}
