<#--<#if pojo.getPackageName()!=''>
package ${pojo.getPackageName()}.model;
<#else>
package model;
</#if>-->
package ${pojo.getPackageName()}.model;

<#assign classbody>
<#include "PojoTypeDeclaration.ftl"/> {

<#if !pojo.isInterface()>
 <#include "PojoFieldsSpringJdbc.ftl"/>

<#include "PojoConstructorsSpringJdbc.ftl"/>

<#include "PojoPropertyAccessorsSpringJdbc.ftl"/>

<#include "PojoToStringJdbc.ftl"/>

<#include "PojoEqualsHashcode.ftl"/>

<#else>
<#include "PojoInterfacePropertyAccessorsSpringJdbc.ftl"/>

</#if>
<#include "PojoExtraClassCode.ftl"/>
}
</#assign>

${pojo.generateImports()}
${classbody}
