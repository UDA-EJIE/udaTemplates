(function ($) { 

	$.rup_utils  = {};
	$.rup_utils.arr = [];
	$.extend($.rup_utils, {
		//Funcion encargada de devolver el idioma capitalizado
		capitalizedLang : function (){
    		return $.rup.lang.charAt(0).toUpperCase() + $.rup.lang.slice(1);
		},
		jsontoarray : function (obj) {
			var arr = [];
			function parseJSON (obj, path) {// parsea un json a un array
				path = path || '';			
				// iteracion a traves (objects / arrays)
				if (obj === undefined || obj === null) {
					// nada
				} else if (obj.constructor == Object) {
					for (var prop in obj) {
						//var name = path + (path == '' ? prop : '[' + prop + ']');
						var name = path + (path == '' ? prop : '.' + prop);
						parseJSON(obj[prop], name);
					}
				} else if (obj.constructor == Array) {
					for (var i = 0; i < obj.length; i++)	{
						var index	= '[' + index + ']', name = path + index;
						parseJSON(obj[i], name);
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
		populateForm : function (aData, formid) { //rellena un formulario que recibe como segundo parametro con los datos que recibe en el segundo parametro 
			if (aData) {
				for (var i in aData) {
					if ($("[name=" + i + "]", formid).is("input:radio") || $("[name=" + i + "]", formid).is("input:checkbox"))  {
						$("[name=" + i + "]", formid).each(function () {
							if ($(this).val() == aData[i]) {
								$(this).attr("checked", "checked");
							} else {
								$(this).attr("checked", "");
							}
						});
					} else {// this is very slow on big table and form.
						$("[name=" + i + "]", formid).val(aData[i]);
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
		    if( typeof name === 'undefined' || typeof value === 'undefined' )
		      return false;
		
		    var str = name + '=' + encodeURIComponent(value);
		
		    if( options.domain ) str += '; domain=' + options.domain;
		    if( options.path ) str += '; path=' + options.path;
		    if( options.duration ){
		      var date = new Date();
		      date.setTime( date.getTime() + options.duration * 24 * 60 * 60 * 1000 );
		      str += '; expires=' + date.toGMTString();
		    }
		    if( options.secure ) str += '; secure';
		
		    return (document.cookie = str);
		},
	
		delCookie : function( name ){
			return $.rup_utils.setCookie( name, '', { duration: -1 } );
		},
	
		readCookie : function( name ){
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
})(jQuery);