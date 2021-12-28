<%--
 -- Copyright 2022 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la "Licencia");
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
 -- el programa distribuido con arreglo a la Licencia se distribuye "TAL CUAL",
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 --%>

<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="spring" uri="/WEB-INF/tld/spring.tld"%>
<%@taglib prefix="form" uri="/WEB-INF/tld/spring-form.tld"%>

<!-- Formulario -->
<c:set value="<#noparse>${actionType == 'POST' ? 'add': 'edit'}</#noparse>" var="endpoint" />
<spring:url value="<#noparse>${mapping}/${endpoint}</#noparse>" var="url"/>
<form:form modelAttribute="<#noparse>${entity}</#noparse>" id="<#noparse>${tableID}</#noparse>_detail_inlineEdit_aux_form" class="d-none" action="<#noparse>${url}</#noparse>" method="<#noparse>${actionType}</#noparse>"/>
