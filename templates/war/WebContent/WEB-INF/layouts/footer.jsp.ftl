<%--  
 -- Copyright 2020 E.J.I.E., S.A.
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 -- 
 -- http://ec.europa.eu/idabc/eupl.html
 -- 
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
 -- el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia. 
 --%>
 
<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ include file="/WEB-INF/includeTemplate.inc" %>
<footer>
	<div class="row footer-row-base">
		<div class="col-12">
			<img class="img-fluid mx-auto d-block" src="<#noparse>${staticsUrl}</#noparse>/${codapp}/images/web01-2014_claim_pertsona_helburu_es.gif" />
		</div>
		<div class="col-sm-6 text-center">
			<p class="text-white">
				<spring:message code="footer.avisoLegal"/>
			</p>
		</div>
		<div class="col-sm-6 text-center">
			<p class="text-white">
				<spring:message code="footer.ejgv"/>
			</p>
		</div>
	</div>
</footer>