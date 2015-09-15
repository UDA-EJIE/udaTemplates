package com.ejie.${codapp}.control.ejemplos;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/fase5")
public class Fase5Controller {
	@Autowired
	Properties appConfiguration;

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView inicio(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("fase5", "model", model);
	}

	@RequestMapping(value = "tabs", method = RequestMethod.GET)
	public ModelAndView patronTabs(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("tabs", "model", model);
	}

	@RequestMapping(value = { "fragmento1", "fragmento2", "fragmento3" }, method = RequestMethod.GET)
	public ModelAndView tabsContent(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("tabsContent_1", "model", model);
	}

	@RequestMapping(value = { "tab2Fragment" }, method = RequestMethod.GET)
	public ModelAndView tabs2Content(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("tabsContent_2", "model", model);
	}

	@RequestMapping(value = { "tab3Fragment" }, method = RequestMethod.GET)
	public ModelAndView tabs3Content(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("tabsContent_3", "model", model);
	}
}