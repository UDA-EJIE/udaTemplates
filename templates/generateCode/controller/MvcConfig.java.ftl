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

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

import com.ejie.x38.util.StaticsContainer;

@Configuration
public class MvcConfig {

	/** 
     * Gestiona la locale (idioma) mediante una cookie.
     * 
     * @param webApplicationContext Contexto de la aplicación Web.
     * @return La cookie de idioma.
     */
	@Bean
	public CookieLocaleResolver localeResolver(WebApplicationContext webApplicationContext) {
		final CookieLocaleResolver cookieLocaleResolver = new CookieLocaleResolver();
		cookieLocaleResolver.setCookieName("language");
		cookieLocaleResolver.setCookieHttpOnly(false);
		cookieLocaleResolver.setCookieSecure(StaticsContainer.isCookieSecure());
		cookieLocaleResolver.setCookiePath(
				(StaticsContainer.isCookiePathRoot() ? "/" : webApplicationContext.getServletContext().getContextPath())
						+ "; SameSite=Lax;");
		return cookieLocaleResolver;
	}

}
