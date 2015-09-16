<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="/WEB-INF/tld/spring.tld" %>
<%@page import="com.ejie.x38.util.StaticsContainer"%>
<c:set var="staticsUrl" value='<%= StaticsContainer.staticsUrl %>'/>