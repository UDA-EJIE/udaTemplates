package com.ejie.${codapp}.control.ejemplos;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/fase2")
public class Fase2Controller {
	@Autowired
	Properties appConfiguration;

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView inicio(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("fase2", "model", model);
	}

	@RequestMapping(value = "grid", method = RequestMethod.GET)
	public ModelAndView patronDialog(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("grid", "model", model);
	}

	@RequestMapping(value = "maintSimple", method = RequestMethod.GET)
	public ModelAndView patronMaintSimple(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("maintSimple", "model", model);
	}

	@RequestMapping(value = "maintMulti", method = RequestMethod.GET)
	public ModelAndView patronMaint(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("maintMulti", "model", model);
	}

	@RequestMapping(value = "maintEditable", method = RequestMethod.GET)
	public ModelAndView patronMaintEditable(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("maintEditable", "model", model);
	}

	@RequestMapping(value = "maintMD", method = RequestMethod.GET)
	public ModelAndView patronMaintMD(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("maintMD", "model", model);
	}

	@RequestMapping(value = "toolbar", method = RequestMethod.GET)
	public ModelAndView patronFeedback(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("toolbar", "model", model);
	}
}