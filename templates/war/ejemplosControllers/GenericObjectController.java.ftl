package com.ejie.${codapp}.control.ejemplos;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/*
// Código de ejemplo, sustituya por clases de la aplicación
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import com.ejie.${codapp}.model.DepartamentoProvincia;
import com.ejie.${codapp}.service.DepartamentoProvinciaService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import com.ejie.${codapp}.control.ejemplos.genericObjectUtils.GenericObject;
import com.ejie.${codapp}.control.ejemplos.genericObjectUtils.RUPBean;
*/

@Controller
@RequestMapping(value="/genericObject")
public class GenericObjectController {
	
	/**
	 * Service & DAO
	 */
/*
// Código de ejemplo, sustituya por clases de la aplicación	 
	@Autowired
	private DepartamentoProvinciaService departamentoProvinciaService;
	protected DepartamentoProvinciaService getDepartamentoProvinciaService() {
		return departamentoProvinciaService;
	}
	protected void setDepartamentoProvinciaService(DepartamentoProvinciaService departamentoProvinciaService) {
		this.departamentoProvinciaService = departamentoProvinciaService;
	}
*/
	
	/**
	 * Obtener JSP
	 */
	@RequestMapping(method=RequestMethod.GET)
	public String patronPrueba(Model model) {
		return "genericObject";
	}
	
	/**
	 * Procesamiento
	 */
/*
// Código de ejemplo, sustituya por clases de la aplicación	 
	@RequestMapping(value="envio",method=RequestMethod.POST)
	public @ResponseBody List<RUPBean> patronPruebaEnvio(@RequestBody GenericObject genericObject) throws Exception{
		
		System.out.println("ENTIDADES:");
		Map<String, Object> entidades = genericObject.getEntidades();
		Set<String> keys = entidades.keySet();
		for (Iterator<?> iterator = keys.iterator(); iterator.hasNext();) {
			String key = (String) iterator.next();
			System.out.println("key: "+key+" / value: "+ entidades.get(key));
		}
		
		System.out.println("EXTRA DATA:");
		System.out.println("label:"+genericObject.getData().get("label"));
		System.out.println("value:"+genericObject.getData().get("value"));
		System.out.println("style:"+genericObject.getData().get("style"));
		
		List<RUPBean> retorno = new ArrayList<RUPBean>();
		DepartamentoProvincia departamentoProvincia = (DepartamentoProvincia) genericObject.getEntidades().get("departamentoProvincia");
		for (DepartamentoProvincia element : departamentoProvinciaService.findAll(departamentoProvincia, null)) {
			retorno.add(new RUPBean(element.getCode().toString(), element.getDescEs(), ""));
		}
		return retorno;
	}
*/
	
}