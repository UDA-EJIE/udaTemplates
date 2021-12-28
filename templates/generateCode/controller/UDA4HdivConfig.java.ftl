<#-- 
* Copyright 2022 E.J.I.E., S.A.
*
* Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
* Solo podrá usarse esta obra si se respeta la Licencia.
* Puede obtenerse una copia de la Licencia en
*
* http://ec.europa.eu/idabc/eupl.html
*
* Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
* el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
* SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
* Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
* que establece la Licencia.
 -->
 
package ${PACKAGE_NAME};

import java.util.List;

import org.hdiv.config.annotation.ExclusionRegistry;
import org.hdiv.config.annotation.RuleRegistry;
import org.hdiv.config.annotation.builders.SecurityConfigBuilder;
import org.hdiv.ee.config.annotation.ValidationConfigurer;
import org.hdiv.ee.validator.ValidationTargetType;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.hateoas.Link;

import com.ejie.x38.hdiv.config.UDA4HdivConfigurerAdapter;
import com.hdivsecurity.services.config.EnableHdiv4ServicesSecurityConfiguration;

@Configuration
@EnableAspectJAutoProxy
@EnableHdiv4ServicesSecurityConfiguration
@ComponentScan("com.ejie.x38.hdiv.aspect")
public class UDA4HdivConfig extends UDA4HdivConfigurerAdapter {

	@Override
	protected String getHomePage() {
		return "/";
	}

	@Override
	protected String getLoginPage() {
		return "/mockLoginPage";
	}
	
	protected String getDashboardUser() {
		return "dashboard-admin";
	}

	protected String getDashboardPass() {
		return "password";
	}

	@Override
	public void addCustomExclusions(final ExclusionRegistry registry) {
	}

	@Override
	public void addCustomRules(final RuleRegistry registry) {
	}

	@Override
	public void customConfigureEditableValidation(final ValidationConfigurer validationConfigurer) {
		validationConfigurer.addValidation(".*/multiFilter/getDefault").forParameters("user").rules("text").target(ValidationTargetType.CLIENT_PARAMETERS);
	}

	@Override
	protected List<Link> getStaticLinks() {
		return null;
	}
	
	@Override
    public void configure(SecurityConfigBuilder builder) {
        builder.errorPage("/error.jsp");
    }
}