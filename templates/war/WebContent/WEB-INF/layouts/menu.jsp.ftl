<#-- 
 -- Copyright 2013 E.J.I.E., S.A.
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
<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@include file="/WEB-INF/includeTemplate.inc"%>
 
<nav class="rup-navbar navbar">
	<button type="button" class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
	<div id="navbarResponsive" class="collapse navbar-toggleable-md col-md-12 no-gutter">
		<spring:url value="/" var="home" htmlEscape="true"/>
		<a class="navbar-brand" href="<#noparse>${home}</#noparse>">
    		<spring:message code="inicio" />
    	</a>
    	<ul class="nav navbar-nav">
      		<li class="nav-item dropdown">
        		<a class="nav-link dropdown-toggle" href="#" id="responsiveNavbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        			<spring:message code="menu1" />
        		</a>
        		<div class="dropdown-menu" aria-labelledby="responsiveNavbarDropdown">
	            	<a class="dropdown-item" href="#">
	            		<spring:message code="submenu11" />
	           		</a>
		            <a class="dropdown-item" href="#">
		            	<spring:message code="submenu12" />
		           	</a>
		           	<a class="dropdown-item" href="#">
		            	<spring:message code="submenu13" />
		           	</a>
        		</div>
      		</li>
    	</ul>
    	<ul class="nav navbar-nav float-md-right rup-nav-tools">
      		<li class="nav-item">
	        	<a class="nav-link rup-nav-tool-icon" href="#" id="${warName}_language" data-toggle="dropdown">
	        		<i class="mdi mdi-earth" aria-hidden="true"></i>
	        		<span data-rup-lang-current=""></span>
	        	</a>
				<div class="dropdown-menu" aria-labelledby="${warName}_language"></div>
      		</li>
      		<li class="nav-item">
        		<a class="nav-link rup-nav-tool-icon" href="#">
        			<i class="mdi mdi-settings" aria-hidden="true"></i>
        		</a>
      		</li>
			<li class="nav-item">
				<a class="nav-link rup-nav-user rup-nav-tool-icon" href="#">
					<i class="mdi mdi-account-circle" aria-hidden="true"></i>
				</a>
			</li>
			<li class="nav-item swingTop">
				<a class="nav-link rup-nav-user rup-nav-tool-icon" href="#">
					<i class="mdi mdi-arrow-up" aria-hidden="true"></i>
				</a>
			</li>
    	</ul>
  	</div>
</nav>

<div id="overlay"></div>