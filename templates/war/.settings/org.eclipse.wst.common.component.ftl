<?xml version="1.0" encoding="UTF-8"?><project-modules id="moduleCoreId" project-version="1.5.0">
    <wb-module deploy-name="${warName}">
        <wb-resource deploy-path="/" source-path="/WebContent"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/test-integration"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/test-system"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/test-unit"/>
        <property name="context-root" value="${warName}"/>
        <property name="java-output-path" value="/${warName}/build/classes"/>
    </wb-module>
</project-modules>
