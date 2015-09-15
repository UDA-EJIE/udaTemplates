<?xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE tiles-definitions PUBLIC
       "-//Apache Software Foundation//DTD Tiles Configuration 2.0//EN"
       "http://tiles.apache.org/dtds/tiles-config_2_1.dtd">
       	
       	
<tiles-definitions>

  	<!-- ****************************** -->
  	<!--          PLANTILLAS            -->
  	<!-- ****************************** -->
	<definition name="template" template="/WEB-INF/layouts/template.jsp">	
		<put-attribute name="header" value="/WEB-INF/layouts/header.jsp" />
		<put-attribute name="language" value="/WEB-INF/layouts/language.jsp" />
		<put-attribute name="menu" value="/WEB-INF/layouts/menu.jsp" />
		<#if layout=='mixto'><put-attribute name="menuMixto" value="/WEB-INF/layouts/menuMixto.jsp" /></#if>
		<put-attribute name="breadCrumb" value="/WEB-INF/layouts/breadCrumb.jsp" />
		<put-attribute name="footer" value="/WEB-INF/layouts/footer.jsp" />
		<put-attribute name="base-includes" value="/WEB-INF/layouts/base-includes.jsp" />
		<put-attribute name="includes" value=""/>				
	</definition>
	
<#if isexamples>
	<!-- PLANTILLA rup -->
	<definition name="rupTemplate" template="/WEB-INF/layouts/rup/template.jsp">	
		<put-attribute name="header" value="/WEB-INF/layouts/rup/header.jsp" />
		<put-attribute name="language" value="/WEB-INF/layouts/rup/language.jsp" />
		<put-attribute name="menu" value="/WEB-INF/layouts/rup/menu.jsp" />
		<put-attribute name="breadCrumb" value="/WEB-INF/layouts/rup/breadCrumb.jsp" />
		<put-attribute name="footer" value="/WEB-INF/layouts/rup/footer.jsp" />
		<put-attribute name="base-includes" value="/WEB-INF/layouts/rup/base-includes.jsp" />
		<put-attribute name="includes" value=""/>			
	</definition>
	<!-- PLANTILLA rup (vertical) -->
	<definition name="rupTemplateVertical" template="/WEB-INF/layouts/rup/templateVertical.jsp">	
		<put-attribute name="header" value="/WEB-INF/layouts/rup/header.jsp" />
		<put-attribute name="language" value="/WEB-INF/layouts/rup/language.jsp" />
		<put-attribute name="menu" value="/WEB-INF/layouts/rup/menu.jsp" />
		<put-attribute name="breadCrumb" value="/WEB-INF/layouts/rup/breadCrumb.jsp" />
		<put-attribute name="footer" value="/WEB-INF/layouts/rup/footer.jsp" />
		<put-attribute name="base-includes" value="/WEB-INF/layouts/rup/base-includes.jsp" />
		<put-attribute name="includes" value=""/>			
	</definition>
	<!-- PLANTILLA rup (mixta) -->
	<definition name="rupTemplateMixto" template="/WEB-INF/layouts/rup/templateMixto.jsp">	
		<put-attribute name="header" value="/WEB-INF/layouts/rup/header.jsp" />
		<put-attribute name="language" value="/WEB-INF/layouts/rup/language.jsp" />
		<put-attribute name="menu" value="/WEB-INF/layouts/rup/menu.jsp" />
		<put-attribute name="menuMixto" value="/WEB-INF/layouts/rup/menuMixto.jsp" />
		<put-attribute name="breadCrumb" value="/WEB-INF/layouts/rup/breadCrumb.jsp" />
		<put-attribute name="footer" value="/WEB-INF/layouts/rup/footer.jsp" />
		<put-attribute name="base-includes" value="/WEB-INF/layouts/rup/base-includes.jsp" />
		<put-attribute name="includes" value=""/>			
	</definition>
</#if>	
	<definition name="errorTemplate" template="/WEB-INF/layouts/errorTemplate.jsp"></definition>
	
	<!-- ***************************** -->
  	<!--          PANTALLAS            -->
  	<!-- ***************************** -->
	<definition name="error" extends="errorTemplate">
		<put-attribute name="content" value="/WEB-INF/views/error.jsp"/>	
	</definition>
	<definition name="accessDenied" extends="errorTemplate">
		<put-attribute name="content" value="/WEB-INF/views/accessDenied.jsp"/>
	</definition>	
	<definition name="welcome" template="/WEB-INF/views/welcome.jsp"/>
<#if isexamples>	
	<!-- INICIAL -->
	<definition name="welcome" extends="template">
		<put-attribute name="content" value="/WEB-INF/views/welcome.jsp"/>
	</definition>

	<!-- EJEMPLOS!-->
		<!-- FASE 1 -->
		<definition name="fase1" extends="rupTemplate">
			<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase1/_fase1.jsp"/>				
		</definition>
			 <definition name="dialog" extends="rupTemplateMixto">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase1/dialog.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase1/dialog-includes.jsp"/>					
			</definition>
			<definition name="feedback" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase1/feedback.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase1/feedback-includes.jsp"/>					
			</definition>
			<definition name="message" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase1/message.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase1/message-includes.jsp"/>						
			</definition>
			<definition name="tooltip" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase1/tooltip.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase1/tooltip-includes.jsp"/>				
			</definition>
		
		<!-- FASE 2 -->
		<definition name="fase2" extends="rupTemplate">
			<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase2/_fase2.jsp"/>				
		</definition>
			<definition name="grid" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase2/grid.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase2/grid-includes.jsp"/>				
			</definition>	
			<definition name="maintSimple" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase2/maintSimple.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase2/maintSimple-includes.jsp"/>				
			</definition>
			<definition name="maintMulti" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase2/maintMulti.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase2/maintMulti-includes.jsp"/>				
			</definition>
			<definition name="maintEditable" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase2/maintEditable.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase2/maintEditable-includes.jsp"/>				
			</definition>
			<definition name="maintMD" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase2/maintMD.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase2/maintMD-includes.jsp"/>				
			</definition>
			<definition name="toolbar" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase2/toolbar.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase2/toolbar-includes.jsp"/>				
			</definition>
	
		<!-- FASE 3 -->
		<definition name="fase3" extends="rupTemplate">
			<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase3/_fase3.jsp"/>				
		</definition>
			<definition name="autocomplete" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase3/autocomplete.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase3/autocomplete-includes.jsp"/>					
			</definition>
			<definition name="combo" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase3/combo.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase3/combo-includes.jsp"/>					
			</definition>
			<definition name="comboEnlazado" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase3/comboEnlazado.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase3/comboEnlazado-includes.jsp"/>					
			</definition>
			<definition name="comboEnlazadoMultiple" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase3/comboEnlazadoMultiple.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase3/comboEnlazadoMultiple-includes.jsp"/>					
			</definition>
		
		<!-- FASE 4 -->
		<definition name="fase4" extends="rupTemplate">
			<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase4/_fase4.jsp"/>				
		</definition>
			<definition name="menu" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase4/menu.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase4/menu-includes.jsp"/>				
			</definition>
			<definition name="menuVertical" extends="rupTemplateVertical">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase4/menu.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase4/menu-includes.jsp"/>				
			</definition>
		
		<!-- FASE 5 -->
		<definition name="fase5" extends="rupTemplate">
			<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase5/_fase5.jsp"/>				
		</definition>
			<definition name="tabs" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase5/tabs.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase5/tabs-includes.jsp"/>
			</definition>
			<definition name="tabsContent_1" template="/WEB-INF/views/ejemplos/fase5/tabsContent_1.jsp"></definition>
			<definition name="tabsContent_2" template="/WEB-INF/views/ejemplos/fase5/tabsContent_2.jsp"></definition>
			<definition name="tabsContent_3" template="/WEB-INF/views/ejemplos/fase5/tabsContent_3.jsp"></definition>
		
		<!-- FASE 6 -->
		<definition name="fase6" extends="rupTemplate">
			<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase6/_fase6.jsp"/>				
		</definition>
			<definition name="date" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase6/date.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase6/date-includes.jsp"/>				
			</definition>
	<definition name="time" extends="rupTemplate">
				<put-attribute name="content" value="/WEB-INF/views/ejemplos/fase6/time.jsp"/>		
				<put-attribute name="includes" value="/WEB-INF/views/ejemplos/fase6/time-includes.jsp"/>				
			</definition>
	<!-- FIN EJEMPLOS -->
</#if>

</tiles-definitions>