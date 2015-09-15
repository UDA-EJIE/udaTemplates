package ${pojo.getPackageName()}.model.dto;
<#foreach import in utilesDto.getDtoImports(pojo,cfg)>
import ${import};
</#foreach>
<#assign classbody>
<#include "PojoTypeDeclarationDto.ftl"/> {

<#if !pojo.isInterface()>
<#include "PojoFieldsDto.ftl"/>
<#include "PojoPropertyAccessorsDto.ftl"/>
<#else>
 <#include "PojoInterfacePropertyAccessorsDto.ftl"/> 
</#if>
<#include "PojoToString.ftl"/>
}
</#assign>

${pojo.generateImports()}
${classbody}
