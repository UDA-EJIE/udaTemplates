package com.ejie.${codapp}.control.ejemplos;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;


/*
// Código de ejemplo, sustituya por clases de la aplicación
import org.springframework.web.bind.annotation.RequestBody;
import com.ejie.${codapp}.control.ejemplos.genericObjectUtils.RUPBean;
import com.ejie.${codapp}.model.Departamento;
import com.ejie.${codapp}.model.DepartamentoProvincia;
import com.ejie.${codapp}.model.Patrones;
import com.ejie.${codapp}.model.Provincia;
import com.ejie.${codapp}.service.DepartamentoProvinciaService;
import com.ejie.${codapp}.service.DepartamentoService;
import com.ejie.${codapp}.service.PatronesService;
import com.ejie.${codapp}.service.ProvinciaService;
*/

@Controller
@RequestMapping(value = "/fase3")
public class Fase3Controller {
	@Autowired
	Properties appConfiguration;

/*
// Código de ejemplo, sustituya por clases de la aplicación
	@Autowired
	private PatronesService patronesService;

	protected PatronesService getPatronesService() {
		return patronesService;
	}

	protected void setPatronesService(PatronesService patronesService) {
		this.patronesService = patronesService;
	}
*/

	// /////////////////////////////////////////////////////////////////////////////////////////////

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView inicio(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("fase3", "model", model);
	}

	@RequestMapping(value = "autocomplete", method = RequestMethod.GET)
	public ModelAndView patronAutocomplete(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("autocomplete", "model", model);
	}

	@RequestMapping(value = "autocomplete/remote", method = RequestMethod.GET)
	public @ResponseBody
	List<HashMap<String, String>> getRemoteAutocomplete(
			@RequestParam(value = "column_label", required = false) String column_label,
			@RequestParam(value = "column_value", required = false) String column_value,
			@RequestParam(value = "term", required = false) String term) {
		// return patronesService.findContains(column_label, column_value,
		// term);
		return null;
	}

	/**
	 * Combos
	 */

	@RequestMapping(value = "combo", method = RequestMethod.GET)
	public ModelAndView patronCombo(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("combo", "model", model);
	}

/*
// Código de ejemplo, sustituya por clases de la aplicación
	@RequestMapping(value = "combo/remote", method = RequestMethod.GET)
	public @ResponseBody
	List<Patrones> getRemoteCombo() {
		Patrones p1 = new Patrones("c1", "descas1", "descues1", "css1");
		Patrones p2 = new Patrones("c2", "descas2", "descues2", "css2");
		ArrayList<Patrones> l = new ArrayList<Patrones>();
		l.add(p1);
		l.add(p2);
		return l;
		// return patronesService.findAll(null, null);
	}
*/

	/**
	 * Combos Enlazados (simple)
	 */
	@RequestMapping(value = "comboEnlazado", method = RequestMethod.GET)
	public ModelAndView patronComboEnlazado(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("comboEnlazado", "model", model);
	}

	@RequestMapping(value = "comboEnlazado/remoteEnlazado", method = RequestMethod.GET)
	public @ResponseBody
	List<HashMap<String, String>> getRemoteComboEnlazado(
			@RequestParam(value = "column_label", required = false) String column_label,
			@RequestParam(value = "column_value", required = false) String column_value,
			@RequestParam(value = "column_class", required = false) String column_class) {

		ArrayList<HashMap<String, String>> returnData = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> opc = new HashMap<String, String>();
		if (column_label.equals("abuelo")) {
			opc.put("label", "Alava");
			opc.put("value", "01");
			returnData.add(opc);
			opc = new HashMap<String, String>();
			opc.put("label", "Vizcaya");
			opc.put("value", "02");
			returnData.add(opc);
			opc = new HashMap<String, String>();
			opc.put("label", "Gipuzcoa");
			opc.put("value", "03");
			returnData.add(opc);
		} else if (column_label.equals("hijo")) {
			if (column_value.equals("01")) {
				opc.put("label", "Alava-Zona1");
				opc.put("value", "a1");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Alava-Zona2");
				opc.put("value", "a2");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Alava-Zona3");
				opc.put("value", "a3");
				returnData.add(opc);
			} else if (column_value.equals("02")) {
				opc.put("label", "Vizcaya-Gran Bilbao");
				opc.put("value", "b1");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Vizcaya-Margen Derecha");
				opc.put("value", "b2");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Vizcaya-Margen Izquierda");
				opc.put("value", "b3");
				returnData.add(opc);
			} else if (column_value.equals("03")) {
				opc.put("label", "Gipuzcoa-Zona1");
				opc.put("value", "g1");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Gipuzcoa-Zona2");
				opc.put("value", "g2");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Gipuzcoa-Zona3");
				opc.put("value", "g3");
				returnData.add(opc);
			}
		} else if (column_label.equals("nieto")) {
			if (column_value.equals("b1")) {
				opc.put("label", "Bilbao");
				opc.put("value", "b11");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Basauri");
				opc.put("value", "b12");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Galdakao");
				opc.put("value", "b13");
				returnData.add(opc);
			} else if (column_value.equals("b2")) {
				opc.put("label", "Leioa");
				opc.put("value", "b21");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Las Arenas");
				opc.put("value", "b22");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Getxo");
				opc.put("value", "b23");
				returnData.add(opc);
			} else if (column_value.equals("b3")) {
				opc.put("label", "Sestao");
				opc.put("value", "b31");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Barakaldo");
				opc.put("value", "b32");
				returnData.add(opc);
				opc = new HashMap<String, String>();
				opc.put("label", "Portu");
				opc.put("value", "b33");
				returnData.add(opc);
			}
		}
		return returnData;
	}

/*
// Código de ejemplo, sustituya por clases de la aplicación	
	// ////////////////////////////
	// COMBOS ENLAZADOS MULTIPLES//
	// ////////////////////////////
	@Autowired
	private DepartamentoService departamentoService;

	public DepartamentoService getDepartamentoService() {
		return departamentoService;
	}

	public void setDepartamentoService(DepartamentoService departamentoService) {
		this.departamentoService = departamentoService;
	}

	@Autowired
	private ProvinciaService provinciaService;

	public ProvinciaService getProvinciaService() {
		return provinciaService;
	}

	public void setProvinciaService(ProvinciaService provinciaService) {
		this.provinciaService = provinciaService;
	}

	@Autowired
	private DepartamentoProvinciaService departamentoProvinciaService;

	public DepartamentoProvinciaService getDepartamentoProvinciaService() {
		return departamentoProvinciaService;
	}

	public void setDepartamentoProvinciaService(
			DepartamentoProvinciaService departamentoProvinciaService) {
		this.departamentoProvinciaService = departamentoProvinciaService;
	}
*/

	@RequestMapping(value = "comboEnlazadoMultiple", method = RequestMethod.GET)
	public ModelAndView patronComboEnlazadoMultiple(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("comboEnlazadoMultiple", "model", model);
	}
	
/*
// Código de ejemplo, sustituya por clases de la aplicación
	@RequestMapping(value = "comboEnlazadoMultiple/departamentoRemote", method = RequestMethod.POST)
	public @ResponseBody
	List<RUPBean> getEnlMultDpto(@RequestBody Departamento departamento) {
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		List<RUPBean> retorno = new ArrayList<RUPBean>();
		for (Departamento element : departamentoService.findAll(departamento,
				null)) {
			retorno.add(new RUPBean(departamento, element));
		}
		return retorno;
	}

	@RequestMapping(value = "comboEnlazadoMultiple/provinciaRemote", method = RequestMethod.POST)
	public @ResponseBody
	List<RUPBean> getEnlMultProv(@RequestBody Provincia provincia) {
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		List<RUPBean> retorno = new ArrayList<RUPBean>();
		for (Provincia element : provinciaService.findAll(provincia, null)) {
			retorno.add(new RUPBean(provincia, element));
		}
		return retorno;
	}

	@RequestMapping(value = "comboEnlazadoMultiple/dptoProvRemote", method = RequestMethod.POST)
	public @ResponseBody
	List<RUPBean> getEnlMultDptoProv(
			@RequestBody DepartamentoProvincia departamentoProvincia) {
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		List<RUPBean> retorno = new ArrayList<RUPBean>();
		for (DepartamentoProvincia element : departamentoProvinciaService
				.findAll(departamentoProvincia, null)) {
			retorno.add(new RUPBean(departamentoProvincia, element));
		}
		return retorno;
	}
*/
	// ////////////////////////////
	// ////////////////////////////
}