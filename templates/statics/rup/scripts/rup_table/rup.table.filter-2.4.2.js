/*!
 * Copyright 2013 E.J.I.E., S.A.
 *
 * Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 * Solo podrá usarse esta obra si se respeta la Licencia.
 * Puede obtenerse una copia de la Licencia en
 *
 *      http://ec.europa.eu/idabc/eupl.html
 *
 * Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, 
 * el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 * SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 * Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 * que establece la Licencia.
 */

(function ($) {

	/**
	 * Definición de los métodos principales que configuran la inicialización del plugin.
	 * 
	 * postConfiguration: Método que se ejecuta después de la invocación del componente jqGrid.
	 * 
	 */
	jQuery.rup_table.registerPlugin("filter",{
		loadOrder:1,
		preConfiguration: function(settings){
			var $self = this;
			return $self.rup_table("preConfigureFilter", settings);
		},
		postConfiguration: function(settings){
			var $self = this;
			return $self.rup_table("postConfigureFilter", settings);
		}
	});
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//********************************
	
	/**
	 * Extensión del componente rup_table para permitir la gestión del filtrado de registros de la tabla. 
	 * 
	 * Los métodos implementados son:
	 * 
	 * postConfigureFilter(settings): Método que define la preconfiguración necesaria para el correcto funcionamiento del componente.
	 * 
	 * Se almacena la referencia de los diferentes componentes:
	 * 
	 * settings.filter.$filterContainer : Contenedor del formulario de filtrado
	 * settings.filter.$filterButton : Botón que realiza el filtrado
	 * settings.filter.$cleanLink : Enlace para limpiar el formulario
	 * settings.filter.$collapsableLayer : Capa que puede ser ocultada/mostrada
	 * settings.filter.$toggleIcon1Id : Control que oculta muestra el fomulario 
	 * settings.filter.$filterSummary : Contenedor donde se especifican los criterios de filtrado
	 *  
	 */
	jQuery.fn.rup_table("extend",{
		preConfigureFilter: function(settings){
			var $self = this, tableId = settings.id, filterSettings = settings.filter, filterFormId,
			toggleIcon1Tmpl,toggleLabelTmpl,filterSummaryTmpl,toggleIcon2Tmpl,$toggleIcon1,$toggleLabel,$filterSummary,$toggleIcon2;
			
			/*
			 * Inicialización de los identificadores y componentes por defecto de los componentes de filtrado  
			 */
			filterSettings.id = (filterSettings.id!==undefined?filterSettings.id:tableId+"_filter_form");
			filterSettings.filterToolbarId = (filterSettings.filterToolbar!==undefined?filterSettings.filterToolbar:tableId+"_filter_toolbar");
			filterSettings.filterButtonId = (filterSettings.filterButtonId!==undefined?filterSettings.filterButtonId:tableId+"_filter_filterButton");
			filterSettings.cleanLinkId = (filterSettings.cleanLinkId!==undefined?filterSettings.cleanLinkId:tableId+"_filter_cleanLink");
			filterSettings.collapsableLayerId = (filterSettings.collapsableLayerId!==undefined?filterSettings.collapsableLayerId:tableId+"_filter_fieldset");
			
			filterSettings.toggleIcon1Id = (filterSettings.toggleIcon1!==undefined?filterSettings.toggleIcon1:tableId+"_filter_toggle_icon1");
			filterSettings.toggleLabelId = (filterSettings.toggleLabelId!==undefined?filterSettings.toggleLabelId:tableId+"_filter_toggle_label");
			filterSettings.filterSummaryId = (filterSettings.filterSummaryId!==undefined?filterSettings.filterSummaryId:tableId+"_filter_summary");
			filterSettings.toggleIcon2Id = (filterSettings.toggleIcon2!==undefined?filterSettings.toggleIcon2:tableId+"_filter_toggle_icon2");
			
			filterSettings.$filterContainer = jQuery("#"+filterSettings.id);
			filterSettings.$filterToolbar = jQuery("#"+filterSettings.filterToolbarId);
			
			if (filterSettings.$filterContainer.length===0){
				alert("El identificador especificado para el fomulario de búsqueda no existe.");
			}else if (filterSettings.$filterToolbar.length===0){
				alert("El identificador especificado para la barra de controles del formulario de filtrado no existe.");
			}else{
				/*
				 * Se almacena la referencia de los diferentes componentes
				 * 
				 * $filterContainer : Contenedor del formulario de filtrado
				 * $filterButton : Botón que realiza el filtrado
				 * $cleanLink : Enlace para limpiar el formulario
				 * $collapsableLayer : Capa que puede ser ocultada/mostrada
				 * $toggleIcon1Id : Control que oculta muestra el fomulario 
				 * $filterSummary : Contenedor donde se especifican los criterios de filtrado
				 */
				toggleIcon1Tmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,"rup_table.templates.filter.toggleIcon1");
				toggleLabelTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,"rup_table.templates.filter.toggleLabel");
				filterSummaryTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,"rup_table.templates.filter.filterSummary");
				toggleIcon2Tmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,"rup_table.templates.filter.toggleIcon2");
				
				$toggleIcon1 = $(jQuery.jgrid.format(toggleIcon1Tmpl, filterSettings.toggleIcon1Id));
				$toggleLabel = $(jQuery.jgrid.format(toggleLabelTmpl, filterSettings.toggleLabelId, $.rup.i18n.base.rup_table.plugins.filter.filterCriteria));
				$filterSummary = $(jQuery.jgrid.format(filterSummaryTmpl, filterSettings.filterSummaryId));
				$toggleIcon2 = $(jQuery.jgrid.format(toggleIcon2Tmpl, filterSettings.toggleIcon2Id));
				
				filterSettings.$filterToolbar.append($toggleIcon1).append($toggleLabel).append($filterSummary).append($toggleIcon2);
				
				filterSettings.$filterContainer = jQuery("#"+filterSettings.id);
				filterSettings.$filterButton = jQuery("#"+filterSettings.filterButtonId);
				filterSettings.$cleanLink = jQuery("#"+filterSettings.cleanLinkId);
				filterSettings.$collapsableLayer = jQuery("#"+filterSettings.collapsableLayerId);
				
				filterSettings.$toggleIcon1 = $toggleIcon1;
				filterSettings.$toggleLabel = $toggleLabel;
				filterSettings.$filterSummary = $filterSummary;
				filterSettings.$toggleIcon2 = $toggleIcon2;
				
				
				/*
				 * TODO: Comprobar que la configruación es correcta
				 */
				
				if (filterSettings.$filterContainer.prop("tagName")==="FORM"){
					filterSettings.$filterContainer.ajaxForm();
				}
				
				// Se utiliza el plugin ajaxForm de jQuery para configurar el formualario de busqueda como AJAX.
				// Se redimensiona el formulario de busqueda al tamanyo del grid.
				filterSettings.$filterContainer.parent().css("width",$self.rup_table("getGridParam", "width"));
				
				// Se configura la url de filtrado
				if (settings.filter.url === null){
					settings.filter.url = settings.baseUrl +"/filter";
				}
				settings.url = settings.filter.url;
				
				// Se almacena en las propiedades la url utilizada para la busqueda a partir de la especificada en el grid.
				settings.searchURL = $self.rup_table("getGridParam", "url");
				
				
				// Se asigna a la tecla ENTER la funcion de busqueda. 
				filterSettings.$filterContainer.bind("keydown", function(evt) {
					if (evt.keyCode == 13) {
						// TODO : poner como evento 
						$self.rup_table("showSearchCriteria");
						$self.rup_table("filter");
					}
				});
				
				// Creacion del boton de busqueda.
				filterSettings.$filterButton.bind("click", function () {
					// TODO: Control cambios
					// TODO : poner como evento 
					$self.rup_table("showSearchCriteria");
					$self.rup_table("filter");
				});
				
				// Creacion del enlace de limpiar formulario.
				filterSettings.$cleanLink.bind("click", function () {
					// TODO : poner como evento 
					$self.rup_table("cleanFilterForm").rup_table("filter");
					if (filterSettings.validate!==undefined){
						jQuery(".rup-maint_validateIcon", filterSettings.$filterContainer).remove();
					}
					$self.rup_table("showSearchCriteria");
				});
				
				filterSettings.$toggleIcon1.add(filterSettings.$toggleLabel).add(filterSettings.$toggleIcon2)
				.attr("tabindex","0")
				.on({
					"keydown":function(evt) {
						if (evt.keyCode == 13) {
							$self.rup_table("toggleFilterForm");
						}
					}
				});
				
				filterSettings.$filterToolbar.addClass("cursor_pointer").on({
					"click":function(){
						$self.rup_table("toggleFilterForm");
					}
				});
				
				if (settings.filter.showHidden === true){
					filterSettings.$collapsableLayer.hide();
//						filterSettings.$collapsableRowShow.show();
					filterSettings.$toggleIcon1.removeClass("ui-icon-triangle-1-n").addClass("ui-icon-triangle-1-s");
					filterSettings.$filterSummary.parent().addClass("rup-maint_searchCriteria");
				}
				
				// Configuración de validaciones
				if (filterSettings.validate!==undefined){
					filterSettings.$filterContainer.rup_validate(filterSettings.validate);
					
					$self.on({
						"rupTable_beforeFilter.filter.validate": function(){
//							filterSettings.$filterContainer.rup_validate("resetForm");
							return filterSettings.$filterContainer.valid();
						}
					});
				}
			}
			
			$self.on({
				"rupTable_serializeGridData.filter": function(events, postData){
					var	filterParams = form2object(settings.filter.$filterContainer[0]),
					queryStrFilterParams = jQuery.param(filterParams),
					lastFilterParams = $self.data("tmp.lastFilterParams");
					
					jQuery.extend(postData, {"filter":filterParams});
					
					if (lastFilterParams === undefined || lastFilterParams !== queryStrFilterParams){
						jQuery.extend(postData, {page:"1"});
						$self.data("tmp.lastFilterParams", queryStrFilterParams);
					}
					
				}
			});
		},
		/*
		 * Método que define la preconfiguración necesaria para el correcto funcionamiento del componente.
		 * 
		 * TODO: internacionalizar mensajes de error.
		 */
		postConfigureFilter: function(settings){
			var $self = this, filterFormId, filterSettings;
			
		}
	});
	
	//********************************
	// DEFINICIÓN DE MÉTODOS PÚBLICOS
	//********************************
	
	/**
	 * Métodos públicos del plugin filter.
	 * 
	 * cleanFilterForm: Realiza una limpieza de los campos del formulario.
	 * filter: Lanza el filtrado de la tabla de acuerdo a los criterios indicados en el formulario.
	 * toggleFilterForm: Método encargado de ocultar y mostrar el formulario de filtrado.
	 * 
	 */
	jQuery.fn.rup_table("extend",{
		cleanFilterForm : function () {
			var $self = this, 
				settings = $self.data("settings");
			
			$self.rup_table("resetForm", settings.filter.$filterContainer);
			
			return $self;
		},
		filter : function(async){
			var $self = this,
			settings = $self.data("settings"); 
			
			var bfr = $self.triggerHandler("rupTable_beforeFilter");
			if (bfr === false || bfr === 'stop') { return; }
			
			if ($.isFunction(settings.filter.beforeFilter)) {
				bfr = settings.filter.beforeFilter.call($self);
				if(bfr === undefined) { bfr = true; }
				if ( bfr === false ) { return; }
			}
			
			$self.rup_table("setGridParam",{page:"1"});
			
			$self.trigger("reloadGrid");
		},
		getFilterParams : function(){
			var $self = this, 
			settings = $self.data("settings"); 
			
			return form2object(settings.filter.$filterContainer[0]);
		},
		hideFilterForm: function(){
			var $self = $(this), settings = $self.data("settings"), filterSettings = settings.filter;
			
			filterSettings.$collapsableLayer.hide(settings.filter.transitionConfig);
			
//			filterSettings.$collapsableRowShow.show(settings.filter.transitionConfig);
			
			filterSettings.$toggleIcon2.removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
			filterSettings.$toggleIcon1.removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
			filterSettings.$filterSummary.parent().addClass("rup-maint_searchCriteria");
		},
		showFilterForm: function(){
			var $self = $(this), settings = $self.data("settings"), filterSettings = settings.filter;
			// Se muestra el formulario de búsqueda
			filterSettings.$collapsableLayer.show($.extend(settings.filter.transitionConfig,{
				complete: function(){
					// Anadido el foco al primer campo del formulario
					jQuery("input:first", filterSettings.$filterContainer).focus();
				}
			}));
			
			filterSettings.$toggleIcon2.removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
			filterSettings.$toggleIcon1.removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
			filterSettings.$filterSummary.parent().removeClass("rup-maint_searchCriteria");
			//Eliminar tooltip
//			$titleSearch.rup_tooltip("destroy");
			
//			filterSettings.$collapsableRowShow.hide(settings.filter.transitionConfig);
		},
		toggleFilterForm: function(filterCriteriaLoad){
			var $self = $(this), settings = $self.data("settings"), filterSettings = settings.filter;

			if (filterSettings.$collapsableLayer.is(":hidden")) {
				//MOSTRAR
				$self.rup_table("showFilterForm");
				
			}else{
				// OCULTAR
				$self.rup_table("hideFilterForm");
			}
			
			return $self;
		},
		showSearchCriteria: function(){
			var $self = this, settings = $self.data("settings"),
			searchString = " ", temp = "", aux, searchForm,
			field, fieldId, fieldName, fieldValue,
			aux = settings.filter.$filterContainer.serializeArray();
			searchForm = settings.filter.$filterContainer,
			filterMulticombo = new Array();  

			for (var i = 0; i < aux.length; i++) {
				if (aux[i].value !== "") {

					//CAMPO a tratar
					field = $("[name='" + aux[i].name + "']",searchForm);

					//Comprobar si se debe excluir el campo
					if ($.inArray(field.attr("id"), settings.filter.filterExclude) !== -1){
						continue;
					}
					
					//Seleccionar radio
					if (field.length > 1){
						field = $("[name='" + aux[i].name + "']:checked",searchForm);
					}
					//Omitir campos hidden
					if ($(field).attr("type") === "hidden"){
						continue;
					}
					
					//ID del campo
					fieldId = $(field).attr("id");
						//ID para elementos tipo rup.combo
						if ($(field).attr("ruptype") === "combo"){
							if (field.next(".ui-multiselect").length==0){
								fieldId += "-button";
							}
						}
						//ID para elementos tipo rup.autocomplete
						if ($(field).attr("ruptype") === "autocomplete"){
							fieldId = fieldId.substring(0, fieldId.indexOf("_label"));
						}
					
					//NAME
					label = $("label[for^='" + fieldId + "']",searchForm);
					if (label.length>0){
						// <label for='xxx' />
						fieldName = label.html();
					} else {
						// <div />
						// <div />
						if ($(field).attr("ruptype") !== "combo"){
							//fieldName= $("[name='" + aux[i].name + "']",searchForm).prev('div').html();
							fieldName= $("[name='" + aux[i].name + "']",searchForm).prev('div').find('label').first().html();
						} else {
							//fieldName= $("[name='" + aux[i].name + "']",searchForm).parent().prev('div').html();
							
							// Buscamos el label asociado al combo
							// Primero por id 
							var $auxField = $("[name='" + aux[i].name + "']",searchForm), $labelField;
							
							$labelField = jQuery("[for='"+$auxField.attr("id")+"']");
							
							if ($labelField.length>0){
								fieldName = $labelField.first().text();
							}else{
								fieldName= $("[name='" + aux[i].name + "']",searchForm).parent().prev('div').find('label').first().html();
							}
						}
					}
					if (fieldName === null || fieldName === undefined){
						fieldName = "";
					}
					
					//VALUE
					fieldValue = " = ";
					switch($(field)[0].tagName){
						case "INPUT":
							fieldValue = fieldValue + $(field).val();
							if ($(field)[0].type === "checkbox" || $(field)[0].type === "radio"){
								fieldValue = "";
							}
							break;
						case "SELECT":
							if (field.next(".ui-multiselect").length==0){
								fieldValue = fieldValue + $("option[value='"+aux[i].value+"']",field).html();
							} else {
								if ($.inArray($(field).attr("id"), filterMulticombo)===-1){
									numSelected = field.rup_combo("value").length;
									if (numSelected !== 0){
										fieldValue += numSelected; 
									} else {
										fieldName = "";
										fieldValue = "";
									}
									filterMulticombo.push($(field).attr("id"));
								} else {
									fieldName = "";
									fieldValue = "";
								}
							}
							break;
					}
					
					//Parsear NAME
					var parseableChars = new Array(":","=");
					for (var j=0; j<parseableChars.length; j++){
						if (fieldName !== "" && fieldName.indexOf(parseableChars[j])!== -1){
							fieldName = fieldName.substring(0,fieldName.indexOf(parseableChars[j]));
							break;
						}
					}
					
					//Controlar rup.combo con valor vacío
					while (fieldValue.indexOf("&amp;nbsp;")!==-1){
						fieldValue = fieldValue.replace ("&amp;nbsp;","");
					}
					
					//Si no tiene NAME sacar solo el valor
					if (fieldName === "" && fieldValue.indexOf(" = ")!==-1){
						fieldValue = fieldValue.substring(2, fieldValue.length); 
					}
					
					
					//Si no tiene NAME ni VALUE omitir
					if (fieldName === "" && $.trim(fieldValue) === ""){
						continue;
					}
					searchString = searchString + fieldName + fieldValue + ", ";
				}
			}
			//Contiene criterios
//			if (searchString.length>1){
				searchString = searchString.substring(0, searchString.length-2);
				
				var initialHeight = $('#titleSearch_' + settings.id.name).css("height"),
					height,
					tmp = searchString,
					tooltip = false;

				//Añadir criterios
				while(true){
					settings.filter.$filterSummary.html(" <i>" + tmp + "</i>");
					height = $('#titleSearch_' + settings.id.name).css("height");
					if (height === initialHeight){
						break;
					}
					tmp = tmp.substring(0, tmp.lastIndexOf(",")) + " <b>...</b>";
					tooltip = true;
				}

				//Tooltip con criterios
				if (tooltip){
					settings.filter.$filterSummary
						.rup_tooltip({
							content: {
								text: searchString.substring(1)
							},
							position: {
								my: 'bottom center',
								at: 'top center'
							}
						});
				}
			}
//		}
	});
	
	//*******************************
	// DEFINICIÓN DE MÉTODOS PRIVADOS
	//*******************************
	
	jQuery.fn.rup_table("extend",{
		_getSearchFormFieldLabel: function($field, $form){
			var fieldId = $field.attr("id"), $label, formFieldLabel="", rupType = $field.attr("ruptype");
			
			if (rupType !== "combo"){
				$label = jQuery("label[for='"+fieldId+"']", $form);
			}else{
				$label = jQuery("label[for='"+fieldId+"-button']", $form);
			}
			
			if ($label.length>0){
				// <label for='xxx' />
				formFieldLabel = $label.html();
			} else {
				// <div />
				// <div />
				if ($field.attr("ruptype") !== "combo"){
					//fieldName= $("[name='" + aux[i].name + "']",searchForm).prev('div').html();
					formFieldLabel= $("[name='" + name + "']", $form).prev('div').find('label').first().html();
				} else {
					//fieldName= $("[name='" + aux[i].name + "']",searchForm).parent().prev('div').html();
					formFieldLabel= $("[name='" + name + "']", $form).parent().prev('div').find('label').first().html();
				}
			}
			
			// Eliminamos los caracteres ':' y '=' que puedan existir en el label
			formFieldLabel = formFieldLabel.replace(/[:=]/g,"");;
			
			return formFieldLabel;
		},
		_getSearchFormFieldValue: function($field, $form){
			var fieldValue = " = ", filterMulticombo = [], numSelected;
			
			//VALUE
			switch($field.prop("tagName")){
				case "INPUT":
					fieldValue = fieldValue + $field.val();
					if ($field.attr("type") === "checkbox" || $field.attr("type") === "radio"){
						fieldValue = "";
					}
					break;
				case "SELECT":
					if ($field.next(".ui-multiselect").length==0){
						fieldValue = fieldValue + $("option[value='"+$field.rup_combo("getRupValue")+"']", $field).html();
					} else {
						if ($.inArray($field.attr("id"), filterMulticombo)===-1){
							numSelected = $field.rup_combo("value").length;
							if (numSelected !== 0){
								fieldValue += numSelected; 
							} else {
								fieldName = "";
								fieldValue = "";
							}
							filterMulticombo.push($field.attr("id"));
						} else {
							fieldName = "";
							fieldValue = "";
						}
					}
					break;
			}
			
			//Controlar rup.combo con valor vacío
			while (fieldValue.indexOf("&amp;nbsp;")!==-1){
				fieldValue = fieldValue.replace ("&amp;nbsp;","");
			}
			
			return fieldValue;
		}
		
	});
		
	//*******************************************************
	// DEFINICIÓN DE LA CONFIGURACION POR DEFECTO DEL PATRON  
	//*******************************************************
	
	/**
	 * Parámetros de configuración por defecto para el plugin filter.
	 * 
	 */
	jQuery.fn.rup_table.plugins.filter = {};
	jQuery.fn.rup_table.plugins.filter.defaults = {
			filter:{
				url: null,
				showHidden:false,
				transitionConfig:{
					duration: "slow",
					effect: "blind"
				}
			}
	};
	
		
	
})(jQuery);