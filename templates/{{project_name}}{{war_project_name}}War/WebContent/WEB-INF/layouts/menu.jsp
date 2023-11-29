<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@include file="/WEB-INF/includeTemplate.inc"%>
 
<nav class="rup-navbar navbar">
	<button type="button" class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
	<div id="navbarResponsive" class="collapse navbar-toggleable-md col-md-12 no-gutter">
		<spring:url value="/" var="home" htmlEscape="true"/>
		<a class="navbar-brand" href="${home}">
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
	        	<a class="nav-link rup-nav-tool-icon" href="#" id="xxxPruebaWar_language" data-toggle="dropdown">
	        		<i class="mdi mdi-earth" aria-hidden="true"></i>
	        		<span data-rup-lang-current=""></span>
	        	</a>
				<div class="dropdown-menu" aria-labelledby="xxxPruebaWar_language"></div>
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