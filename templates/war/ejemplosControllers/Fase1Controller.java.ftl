package com.ejie.${codapp}.control.ejemplos;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/fase1")
public class Fase1Controller {

	@Autowired
	Properties appConfiguration;

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView inicio(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));

		return new ModelAndView("fase1", "model", model);

	}

	@RequestMapping(value = "dialog", method = RequestMethod.GET)
	public ModelAndView patronDialog(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("dialog", "model", model);
	}

	@RequestMapping(value = "feedback", method = RequestMethod.GET)
	public ModelAndView patronFeedback(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("feedback", "model", model);
	}

	@RequestMapping(value = "message", method = RequestMethod.GET)
	public ModelAndView patronMessage(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("message", "model", model);
	}

	@RequestMapping(value = "tooltip", method = RequestMethod.GET)
	public ModelAndView patronTooltip(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));
		return new ModelAndView("tooltip", "model", model);
	}
}