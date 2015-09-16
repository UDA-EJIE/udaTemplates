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

	$.rup_utils  = {};
	$.rup_utils.arr = [];
	$.rup_utils.autoGenerateIdNum = 0;
	$.extend($.rup_utils, {
		//Funcion encargada de devolver el idioma capitalizado
		capitalizedLang : function (){
			if ($.rup.lang==null){ return ""; }
    		return $.rup.lang.charAt(0).toUpperCase() + $.rup.lang.slice(1);
		},
		jsontoarray : function (obj) {
			var arr = [];
			function parseJSON (obj, path) {// parsea un json a un array
				path = path || '';			
				// iteracion a traves (objects / arrays)
				if (obj === undefined || obj === null) {
					// Si no existe un valor para el path indicado se envia '' 
					parseJSON('', path);
				} else if (obj.constructor == Object) {
					for (var prop in obj) {
						//var name = path + (path == '' ? prop : '[' + prop + ']');
						var name = path + (path == '' ? prop : '.' + prop);
						parseJSON(obj[prop], name);
					}
				} else if (obj.constructor == Array) {
					if(obj.length == 0){         
						parseJSON('[]', path);     
					} else { 
						for (var i = 0; i < obj.length; i++)	{
							var index	= '[' + i + ']', name = path + index;
							parseJSON(obj[i], name);
						}
					}
				} else {// assignment (values) if the element name hasn't yet been defined, create it as a single value
					if (arr[path] == undefined) {
						arr[path] = obj;
					} else if (arr[path].constructor != Array) {// if the element name HAS been defined, but it's a single value, convert to an array and add the new value
						arr[path] = [arr[path], obj];
					} else { // if the element name HAS been defined, and is already an array, push the single value on the end of the stack
						arr[path].push(obj);
					}
				}
			}
			
			parseJSON(obj);
			return arr; 
			
		},
		// Realiza una desanidacion del json pasado (p.e.: {entidad:{propiedad:valor}}  --> {'entidad.propiedad':valor}
		unnestjson : function(obj){
			
			var array = $.rup_utils.jsontoarray(obj);
			
			var json={};
			for (key in array) {
                if (!$.isFunction(array[key])){
    			    json[key]=array[key];
                }
			}
			
			return json;
			
		},
		// Devuelve el objeto del dom existente en la posición indicada
		elementFromPoint : function(x, y, argCheck) {
			var isRelative = true, check = argCheck || true;
			if (!document.elementFromPoint)
				return null;

			if (!check) {
				var sl;
				if ((sl = $(document).scrollTop()) > 0) {
					isRelative = (document.elementFromPoint(0, sl
							+ $(window).height() - 1) == null);
				} else if ((sl = $(document).scrollLeft()) > 0) {
					isRelative = (document.elementFromPoint(sl
							+ $(window).width() - 1, 0) == null);
				}
				check = (sl > 0);
			}

			if (!isRelative) {
				x += $(document).scrollLeft();
				y += $(document).scrollTop();
			}

			return document.elementFromPoint(x, y);
		},
		firstCharToLowerCase : function(cadena){
			return cadena.substring(0,1).toLowerCase()+cadena.substring(1);
		},
		getJQueryId: function(sid, escaped){
			var returnIdSelector;
			
			if (typeof sid === "string"){
				returnIdSelector = sid;
				if (escaped === true){
					returnIdSelector = String(returnIdSelector).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g,"\\$&");
				}
				return returnIdSelector[0]==="#"?returnIdSelector:"#"+returnIdSelector;
			}
			
			return null;
		},
		// Convierte una cadena querystring en un objeto json 
		queryStringToJson: function(queryString){
			
			function setValue(root, path, value) {
				if (path.length > 1) {
					var dir = path.shift();
					if (typeof root[dir] == 'undefined') {
						root[dir] = path[0] == '' ? [] : {};
					}
	
					arguments.callee(root[dir], path, value);
				} else {
					if (root instanceof Array) {
						root.push(value);
					} else {
						root[path] = value;
					}
				}
			};
			
			var nvp = queryString.split('&'), data = {}, pair, name, value, path, first;
			
			for ( var i = 0; i < nvp.length; i++) {
				pair = nvp[i].split('=');
				name = decodeURIComponent(pair[0]);
				value = decodeURIComponent(pair[1]);

				path = name.match(/(^[^\[]+)(\[.*\]$)?/);
				first = path[1];
				
				if (path[2]) {
					// case of 'array[level1]' ||
					// 'array[level1][level2]'
					path = path[2].match(/(?=\[(.*)\]$)/)[1]
							.split('][');
				} else {
					// case of 'name'
					path = [];
				}
				path.unshift(first);

				setValue(data, path, value);
			}
			return data;
		},
		populateForm : function (aData, formid) { //rellena un formulario que recibe como segundo parametro con los datos que recibe en el segundo parametro
			var ruptype, formElem;
			var tree_data,selectorArray;
			if (aData) {
				
				for (var i in aData) {
					tree_data= new Array();
					formElem = $("[name='" + i + "']", formid);
					if (formElem.length==0){
						selectorArray=i.substr(0,i.indexOf('['));
						formElem= $("[name='" + selectorArray + "']", formid);
						
							
					}
					if (formElem.is("[ruptype]")){
						if (formElem.hasClass("jstree")){
							
							for (var a in aData){
								if (a.substr(0,a.indexOf('['))==selectorArray){
									tree_data.push(aData[a]);
								}
							}
							formElem["rup_"+formElem.attr("ruptype")]("setRupValue",tree_data);
							var $arbol=[];
							$arbol[selectorArray]=tree_data;
							formElem.on("loaded.jstree", function (event, data) {
								var selectorArbol= this.id;
								//$(this).rup_tree("setRupValue",$arbol[selectorArbol]);
								
								$(this).trigger("rup_filter_treeLoaded",$arbol[selectorArbol]);
							});
							
						}else{
						// Forma de evitar el EVAL
						formElem["rup_"+formElem.attr("ruptype")]("setRupValue",aData[i]);
						}
					}else if (formElem.is("input:radio") || formElem.is("input:checkbox"))  {
						formElem.each(function () {
							if ($(this).val() == aData[i]) {
								$(this).attr("checked", "checked");
							} else {
								$(this).removeAttr("checked");
							}
						});
					} else if (formElem.is("select") ){
						formElem.val(aData[i]).click();
					} else if(formElem.is(":not(img)")) {// this is very slow on big table and form.
						formElem.val(aData[i]);
					}
				}
			}
		},
		
		//DATE UTILS
		createDate : function (day, month, year) {
			return $.datepicker.formatDate($.rup.i18n.base["rup_date"].dateFormat, new Date(year, month-1, day));
		},
		createTime : function (hour, minute, second) {
			return new Date(null, null, null, hour, minute, second);
		},
		/*!
		 * jQuery CooQuery Plugin v2
		 * http://cooquery.lenonmarcel.com.br/
		 *
		 * Copyright 2009, 2010 Lenon Marcel
		 * Dual licensed under the MIT and GPL licenses.
		 * http://www.opensource.org/licenses/mit-license.php
		 * http://www.gnu.org/licenses/gpl.html
		 *
		 * Date: 2010-01-24 (Sun, 24 January 2010)
		 */
		
		//TODO: Documentacion -> http://plugins.jquery.com/project/cooquery
		setCookie : function( name, value, options ){
			if( typeof name === 'undefined' || typeof value === 'undefined' || name === null || value === null ){
				$.rup.errorGestor("["+$.rup.i18nParse($.rup.i18n.base,"rup_global.metodError") + "setCookie] - "+$.rup.i18nParse($.rup.i18n.base,"rup_utils.paramsError"));
				return false;
			}
		
		    var str = name + '=' + encodeURIComponent(value);
		    
		    if (typeof options !== 'undefined' && options !== null){
			    if( options.domain ) str += '; domain=' + options.domain;
			    if( options.path ) str += '; path=' + options.path;
			    if( options.duration ){
			    	var date = new Date();
			    	date.setTime( date.getTime() + options.duration * 24 * 60 * 60 * 1000 );
			    	str += '; expires=' + date.toGMTString();
			    }
			    if( options.secure ) str += '; secure';
		    }
		
		    return (document.cookie = str);
		},
	
		delCookie : function( name ){
			if( typeof name === 'undefined' || name === null){
				$.rup.errorGestor("["+$.rup.i18nParse($.rup.i18n.base,"rup_global.metodError") + "delCookie] - "+$.rup.i18nParse($.rup.i18n.base,"rup_utils.paramsError"));
				return false;
			}
			
			return $.rup_utils.setCookie( name, '', { duration: -1 } );
		},
	
		readCookie : function( name ){
			if( typeof name === 'undefined' || name === null){
				$.rup.errorGestor("["+$.rup.i18nParse($.rup.i18n.base,"rup_global.metodError") + "readCookie] - "+$.rup.i18nParse($.rup.i18n.base,"rup_utils.paramsError"));
				return false;
			}
			
			var value = document.cookie.match('(?:^|;)\\s*' + name.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '=([^;]*)');
			return (value) ? decodeURIComponent(value[1]) : null;
		},
		get : function(name, json) {
			var cookieValue = null;
	        if (document.cookie && document.cookie != '') {
	            var cookies = document.cookie.split(';');
	            for (var i = 0; i < cookies.length; i++) {
	                var cookie = $.trim(cookies[i]);
	                if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    cookieValue = json ? $.JSON.decode(decodeURIComponent(cookie.substring(name.length + 1))):decodeURIComponent(cookie.substring(name.length + 1));
	                    break;
	                }
	            }
	        }
	        return cookieValue;
		},
		set : function(name,value,options){
	   		options = $.extend({}, options);
	   		
	        if (value === null) {
	            value = '';
	            options.expires = -1;
	        }
	        var expires = '';
	        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
	            var date;
	            if (typeof options.expires == 'number') {
	                date = new Date();
	                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
	            } else {
	                date = options.expires;
		}
	            expires = '; expires=' + date.toUTCString();
	        }
	        
	  		value = options.json ? encodeURIComponent($.JSON.encode(value)):encodeURIComponent(value);
	  
	        var path = options.path ? '; path=' + (options.path) : '';
	        var domain = options.domain ? '; domain=' + (options.domain) : '';
	        var secure = options.secure ? '; secure' : '';
	        
	        document.cookie = [name, '=', value, expires, path, domain, secure].join('');
		},
		//compare objects function 
		compareObjects : function (x, y) {
			   var objectsAreSame = true;
			   if (Object.keys(x).length !== Object.keys(y).length){
				   return false;
			   }
			   for(var propertyName in x) {
				  if(typeof x[propertyName] == 'object' && typeof y[propertyName] == 'object'){
						 objectsAreSame = compareObjects(x[propertyName], y[propertyName]);
						 if (!objectsAreSame) break;
				  }else{
				      if(x[propertyName] !== y[propertyName]) {
					     objectsAreSame = false;
						 break;
					  }
				  }
			   }
			   return objectsAreSame;
			},
		escapeId : function(id){
			if (id){
				return id.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1");
			}
			
			return ""; 
		},
		selectorId : function(id){
			if ((typeof id === "string") && (id.substring(0,1) !== "#")){
				return("#"+id);
			} else {
				return(id);
			}
		},
		//Genera un identificador aleatorio para un objeto determinado
		randomIdGenerator : function(selectObject){
			var id = "rupRandomLayerId-"+$.rup_utils.autoGenerateIdNum;
			selectObject.attr("id", id).addClass("rupRandomLayerId");
			$.rup_utils.autoGenerateIdNum = $.rup_utils.autoGenerateIdNum+1;
			return id;
		},
		//Función encargada de gestionar las url's de las aplicaciones en portal 
		setNoPortalParam : function(url){
			if(url !== undefined && url !== null){
            	if ($.rup_utils.readCookie("r01PortalInfo") !== null && url.match("R01HNoPortal") === null && (($("div.r01gContainer").length > 0)) || ($("div.r01gApplication").length > 0)){
            		return url + (url.match("\\?") === null ? "?" : "&") + "R01HNoPortal=true";
            	}
			}
			return url;
		},
		//Función encargada de detectar si la aplicación esta integrada en portal
		aplicatioInPortal : function(){
			if (!($.rup_utils.readCookie("r01PortalInfo") !== null && $("div.r01gContainer").length > 0)){
				return false;
			} else {
				return true;
			}
		},
		//Funcion encargada de pasar las urls relativas a absolutas. 
		//Esta diseñado para terminar con los problemas de comportamientos anómalo de los navegadores en la redirecciones relativas 
		relToAbsUrl : function(url){
			
			var urlPage = $(location);
			
			if (typeof url === "string"){
				var fChar1 = url.substring(0,1);
				var fChar2 = url.substring(1,2);
				
				if($.url(url).attr('protocol') === undefined || $.url(url).attr('protocol') === ""){
					if (fChar1 === "/"){
						if(fChar2 === undefined || fChar2 !== "/"){
							return(urlPage.attr('protocol')+"//"+urlPage.attr('host')+url);
						} else {
							return(urlPage.attr('protocol')+url);
						}
					} else if (fChar1 === "."){
						if (fChar2 === undefined){
							$.rup.errorGestor($.rup.i18nParse($.rup.i18n.base,"rup_utils.relToAbsUrlParamError")+url+$.rup.i18nParse($.rup.i18n.base,"rup_utils.relToAbsUrlParamErrorEnd"));
							return(undefined);
						} else if (fChar2 === "/"){
							var analyzedUrl = $.url(urlPage.attr('href'),true);
							return (analyzedUrl.attr('base')+analyzedUrl.attr('directory')+url.substring(2,url.length));
						} else if (fChar2 === "."){
							var urlPageFragments = urlPage.attr('pathname').split("/");
							var urlPageLength = (urlPageFragments.length)-2;
							if ((url.substring(2,3) !== undefined) && (url.substring(2,3) === "/")){
								var urlFragments = url.split("../");
								var urlLength = (urlFragments.length)-1;
								if (urlLength >= urlPageLength){
									return(urlPage.attr('protocol')+"//"+urlPage.attr('host')+"/"+urlFragments[urlFragments.length-1]);
								} else {
									var cade = "";
									for(var i = urlPageLength-urlLength; i > 0; i--){
										cade = urlPageFragments[i]+"/"+cade;
									}
									return(urlPage.attr('protocol')+"//"+urlPage.attr('host')+"/"+cade+urlFragments[urlFragments.length-1]);
								}
							} else {
								var urlFragments = url.split("..");
								var urlLength = (urlFragments.length)-1;
								if (urlLength >= urlPageLength){
									return(urlPage.attr('protocol')+"//"+urlPage.attr('host')+urlFragments[urlFragments.length-1]);
								} else {
									var cade = "";
									for(var i = urlPageLength-urlLength; i > 0; i--){
										cade = urlPageFragments[i]+"/"+cade;
									}
									return(urlPage.attr('protocol')+"//"+urlPage.attr('host')+"/"+cade+urlFragments[urlFragments.length-1]);
								}
							}
						} else {
							$.rup.errorGestor($.rup.i18nParse($.rup.i18n.base,"rup_utils.relToAbsUrlParamError")+url+$.rup.i18nParse($.rup.i18n.base,"rup_utils.relToAbsUrlParamErrorEnd"));
							return(undefined);
						}
					} else {
						var analyzedUrl = $.url(urlPage.attr('href'),true);
						return (analyzedUrl.attr('base')+analyzedUrl.attr('directory')+url);
					}
				} else {
					return(url);
				}
			} else {
				$.rup.errorGestor($.rup.i18nParse($.rup.i18n.base,"rup_utils.relToAbsUrlParamFormatError"));
				return(undefined);
			}
		},
		printMsg : function(msg){
			var ret="";
			if (typeof msg ==="string"){
				return msg+"<br/>";
			}else if (typeof msg ==="object"){
				if (jQuery.isArray(msg)){
					for (var i=0;i<msg.length;i++){
						ret+=$.rup_utils.printMsgAux(msg[i],1);
					}
					return ret;
				}else{
					ret+=$.rup_utils.printMsgAux(msg,1);
				}
			}
			return ret;
		},
		printMsgAux : function(msg,nivel){
			var ret="";
			if (typeof msg ==="string"){
				return $("<span>").append(msg)[0].outerHTML+"<br/>";
			}else if (typeof msg ==="object"){
				if (jQuery.isArray(msg)){
					var ul=$("<ul>").addClass("rup-maint_feedbackUL");
					for (var i=0;i<msg.length;i++){
//						if (typeof msg[i]==="string" || (typeof msg[i]==="object" && !jQuery.isArray(msg))){
						if (nivel===1){
							ul.append($("<li>").append($.rup_utils.printMsgAux(msg[i],nivel+1)));
						}else{
							ul.append($.rup_utils.printMsgAux(msg[i],nivel+1));
						}
					}
					return ret+=ul[0].outerHTML;
				}else{
					var span = $("<span>");
					
					if(msg.style!==undefined){
						span.addClass(msg.style);
					}
					
					if(msg.label!==undefined){
						span.append(msg.label);
					}
					
					return span[0].outerHTML+"<br/>";
				}
			}
		},
		//Función encargada de recuperar todas las variables pasadas por QueryString (en la url)
		getUrlVars: function(){
			if ($.rup.getParams === undefined){
				var vars = {}, hash;
			    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			    for(var i = 0; i < hashes.length; i++)
			    {
			      hash = decodeURIComponent(hashes[i]).split('=');
			      vars[hash[0]] = hash[1];
			    }
			    $.rup.getParams = vars;
			}
			return $.rup.getParams;
			
		},
		//Función encargada de recuperar una variable especifica de las pasadas por QueryString (en la url)
		getUrlVar: function(name){
			return $.rup_utils.getUrlVars()[name];
		},
		sortArray: function(array, sortFnc){
			
			function defaultSortFnc(obj1, obj2){
				return obj1 - obj2;
			}
			
			function bubbleSort(a, fnc)
			{
			    var swapped;
			    do {
			        swapped = false;
			        for (var i=0; i < a.length-1; i++) {
			            if (fnc(a[i], a[i+1])<0) {
			                var temp = a[i];
			                a[i] = a[i+1];
			                a[i+1] = temp;
			                swapped = true;
			            }
			        }
			    } while (swapped);
			}
			
			if (!$.isArray(array)){
				return undefined;
			}
			
			if ($.isFunction(sortFnc)){
				bubbleSort(array, sortFnc);
			}else{
				bubbleSort(array, defaultSortFnc);
			}
		},
		insertSorted: function(array, elem, sortFnc){
			
			function defaultSortFnc(obj1, obj2){
				return obj2 - obj1;
			}
			
			if (!$.isArray(array)){
				return undefined;
			}
			
			array.push(elem);
			
			if ($.isFunction(sortFnc)){
				$.rup_utils.sortArray(array, sortFnc);
			}else{
				$.rup_utils.sortArray(array, defaultSortFnc);
			}
			
			return $.inArray(elem, array);
		},
		getRupValueAsJson: function(name, value){
			var arrTmp, returnArray, dotNotation=false, dotProperty, tmpJson, returnArray=[];
			
			if (name){
				// Miramos si el name contiene notación dot
				arrTmp =  name.split(".");
				if (arrTmp.length>1){
					dotNotation = true;
					dotProperty = arrTmp[arrTmp.length-1];
				}else{
					dotProperty = arrTmp[0];
				}
				
				if (jQuery.isArray(value)){
					// Devolvemos un array de resultados.
					for (var i=0; i<value.length;i++){
						tmpJson={};
						if (dotNotation){
							tmpJson[dotProperty]=value[i];
							returnArray.push(tmpJson)
						}else{
							tmpJson[dotProperty]=value[i];
							returnArray.push(tmpJson)
						}
					}
					
					return returnArray;
				}else{
					// Devolvemos un único valor.
					tmpJson={};
					tmpJson[dotProperty]=value;
					
					return tmpJson;
				}
			}
			
			return null;
		},
		getRupValueWrapped: function(name, value){
			var arrTmp, dotNotation = false, dotProperty, wrapObj={};
			if (name){
				// Miramos si el name contiene notación dot
				arrTmp =  name.split(".");
				if (arrTmp.length>1){
					dotNotation = true;
					dotProperty = arrTmp[arrTmp.length-1];
				}else{
					return value;
				}
			
				wrapObj[dotProperty] = value;
				
				return wrapObj;
			}
			
			return null;
		}
		
	});
	
	//Utilidades de los formularios
	$.fn.serializeToObject = function () {//Para enviar los campos que contienen valor (!= "")
		var o = {}, a = this.serializeArrayWithoutNulls();
		$.each(a, function () {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value;
			}
		});
		return o;
	};
	
	$.fn.serializeArrayWithoutNulls = function () { //crea un array con campos de un formulario que tienen valor !=""
		return this.map(function () {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function () {
			return this.name && !this.disabled &&
				(this.checked || (/select|textarea/i).test(this.nodeName) ||
					(/color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i).test(this.type));
		})
		.map(function (i, elem) {
			var val = jQuery(this).val();
			if ((jQuery(this).hasClass("numeric") || jQuery(this).hasClass("datepicker")) /*&& val === ""*/) {
				return { name: elem.name, value: null };
			}
			return val === null || val === "" ?
				null :
				jQuery.isArray(val) ?
					jQuery.map(val, function (val, i) {
					return { name: elem.name, value: val };
				}) :
					{ name: elem.name, value: val };
		}).get();
	};
	
	$.fn.serializeObject = function () {//Para enviar los campos nulos con null en vez de en blanco
		var o = {}, a = this.serializeArrayNull();
		$.each(a, function () {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value;
			}
		});
		return o;
	};
	
	$.fn.serializeArrayNull = function () {
		return this.map(function () {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function () {
			return this.name && !this.disabled &&
				(this.checked || (/select|textarea/i).test(this.nodeName) ||
					(/color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i).test(this.type));
		})
		.map(function (i, elem) {
			var val = jQuery(this).val();
			if ((jQuery(this).hasClass("numeric") || jQuery(this).hasClass("datepicker")) && val === "") {
				return { name: elem.name, value: null };
			}
			return val === null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map(val, function (val, i) {
					return { name: elem.name, value: val };
				}) :
					{ name: elem.name, value: val };
		}).get();
	};
	
	jQuery.rup_utils.base64 = {
		    // private property
		    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		    // public method for encoding
		    encode : function (input) {
		        var output = "";
		        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		        var i = 0;
		        input = jQuery.rup_utils.base64._utf8_encode(input);
		        while (i < input.length) {
		            chr1 = input.charCodeAt(i++);
		            chr2 = input.charCodeAt(i++);
		            chr3 = input.charCodeAt(i++);
		            enc1 = chr1 >> 2;
		            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		            enc4 = chr3 & 63;
		            if (isNaN(chr2)) {
		                enc3 = enc4 = 64;
		            } else if (isNaN(chr3)) {
		                enc4 = 64;
		            }
		            output = output +
		            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
		            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		        }
		        return output;
		    },
		    // public method for decoding
		    decode : function (input) {
		        var output = "";
		        var chr1, chr2, chr3;
		        var enc1, enc2, enc3, enc4;
		        var i = 0;
		        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		        while (i < input.length) {
		            enc1 = this._keyStr.indexOf(input.charAt(i++));
		            enc2 = this._keyStr.indexOf(input.charAt(i++));
		            enc3 = this._keyStr.indexOf(input.charAt(i++));
		            enc4 = this._keyStr.indexOf(input.charAt(i++));
		            chr1 = (enc1 << 2) | (enc2 >> 4);
		            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		            chr3 = ((enc3 & 3) << 6) | enc4;
		            output = output + String.fromCharCode(chr1);
		            if (enc3 != 64) {
		                output = output + String.fromCharCode(chr2);
		            }
		            if (enc4 != 64) {
		                output = output + String.fromCharCode(chr3);
		            }
		        }
		        output = jQuery.rup_utils.base64._utf8_decode(output);
		        return output;
		    },
		    // private method for UTF-8 encoding
		    _utf8_encode : function (string) {
		        string = string.replace(/\r\n/g,"\n");
		        var utftext = "";
		        for (var n = 0; n < string.length; n++) {
		            var c = string.charCodeAt(n);
		            if (c < 128) {
		                utftext += String.fromCharCode(c);
		            }
		            else if((c > 127) && (c < 2048)) {
		                utftext += String.fromCharCode((c >> 6) | 192);
		                utftext += String.fromCharCode((c & 63) | 128);
		            }
		            else {
		                utftext += String.fromCharCode((c >> 12) | 224);
		                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		                utftext += String.fromCharCode((c & 63) | 128);
		            }
		        }
		        return utftext;
		    },
		    // private method for UTF-8 decoding
		    _utf8_decode : function (utftext) {
		        var string = "";
		        var i = 0;
		        var c = c1 = c2 = 0;
		        while ( i < utftext.length ) {
		            c = utftext.charCodeAt(i);
		            if (c < 128) {
		                string += String.fromCharCode(c);
		                i++;
		            }
		            else if((c > 191) && (c < 224)) {
		                c2 = utftext.charCodeAt(i+1);
		                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
		                i += 2;
		            }
		            else {
		                c2 = utftext.charCodeAt(i+1);
		                c3 = utftext.charCodeAt(i+2);
		                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
		                i += 3;
		            }
		        }
		        return string;
		    }
		};


	
})(jQuery);