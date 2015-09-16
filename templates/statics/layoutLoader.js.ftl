jQuery(document).ready(function(){
	$("#rup_dept_logo").attr("src", $.rup.APP_STATICS + "/images/dept_logo_" + $.rup.lang + ".gif");
	var vertical = false, mixto = false;
	if ($.rup.LAYOUT === "vertical") {
		vertical = true;
	} else if ($.rup.LAYOUT === "mixto") {
		mixto = true;
	}
	
	//rastro de migas
	$("#${warName}_migas").rup_breadCrumb({
		breadCrumb: {}	
	});
	//idioma
	$("#${warName}_language").rup_language({languages: [${languages}]});
	
	$("#${warName}_menu").rup_menu({
		display: (vertical ? 'vertical' : 'horizontal'),
		menu: [
				{"i18nCaption":"inicio", "url": "" },
				{"i18nCaption":"menu1", "submenu":[
				{"i18nCaption":"inicio", "url": "" },
				{"i18nCaption":"menu11", "url" : "" },
				{"i18nCaption":"menu12", "url" : "" },
				{"i18nCaption":"menu13", "url" : "" }
				]}
		]
	});
	
	if (mixto) {
		$("#${warName}_menu_mixto").rup_menu({
			display: 'vertical',
			menu: [
				{"i18nCaption":"inicio", "url": "" },
				{"i18nCaption":"menu1", "submenu":[
				{"i18nCaption":"inicio", "url": "" },
				{"i18nCaption":"menu11", "url" : "" },
				{"i18nCaption":"menu12", "url" : "" },
				{"i18nCaption":"menu13", "url" : "" }
				]}
			]
		});
	}
});