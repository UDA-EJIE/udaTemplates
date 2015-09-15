package com.ejie.${codapp}.control.ejemplos;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/")
public class WelcomeController {

	@Autowired
	private Properties appConfiguration;

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView getCreateForm(Model model) {
		model.addAttribute("defaultLanguage",
				appConfiguration.get("${warName}.default.language"));
		model.addAttribute("defaultLayout",
				appConfiguration.get("${warName}.default.layout"));

		return new ModelAndView("welcome", "model", model);
	}
}