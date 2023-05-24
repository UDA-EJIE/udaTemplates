<#-- 
* Copyright 2023 E.J.I.E., S.A.
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

import com.ejie.hdiv.config.annotation.ExclusionRegistry;
import com.ejie.hdiv.config.annotation.RuleRegistry;
import com.ejie.hdiv.config.annotation.ValidationConfigurer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import com.ejie.x38.hdiv.config.EjieValidationConfigurer.EjieValidationConfig.EjieEditableValidationConfigurer;
import com.ejie.x38.hdiv.config.UDA4HdivConfigurerAdapter;

@Configuration
@EnableAspectJAutoProxy
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
	
	@Override
	protected String getErrorPage() {
		return "/error";
	}

	@Override
	public void addCustomExclusions(final ExclusionRegistry registry) {
	}

	@Override
	public void addCustomRules(final RuleRegistry registry) {
	}

	@Override
	public void customConfigureEditableValidation(final ValidationConfigurer validationConfigurer) {
		// Multifiltro
		((EjieEditableValidationConfigurer) validationConfigurer
				.addValidation(".*/multiFilter")
				.forParameters("mapping", "tableID", "containerClass", "labelClass", "defaultContainerClass", "defaultCheckboxClass")
				.rules("text"))
				.setAsClientParameter(true);
		
		((EjieEditableValidationConfigurer) validationConfigurer
				.addValidation(".*/multiFilter/getDefault")
				.forParameters("filterSelector", "user")
				.rules("text"))
				.setAsClientParameter(true);
		
		((EjieEditableValidationConfigurer) validationConfigurer
				.addValidation(".*/multiFilter/getAll")
				.forParameters("filterSelector", "user")
				.rules("text"))
				.setAsClientParameter(true);
	}
}