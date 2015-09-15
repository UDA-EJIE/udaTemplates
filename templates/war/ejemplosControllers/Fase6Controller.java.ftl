package com.ejie.${codapp}.control.ejemplos;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/fase6")
public class Fase6Controller {
	@Autowired
	Properties appConfiguration;

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView inicio(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("fase6", "model", model);
	}

	@RequestMapping(value = "date", method = RequestMethod.GET)
	public ModelAndView patronDate(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("date", "model", model);
	}

	@RequestMapping(value = "time", method = RequestMethod.GET)
	public ModelAndView patronTime(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("time", "model", model);
	}
}