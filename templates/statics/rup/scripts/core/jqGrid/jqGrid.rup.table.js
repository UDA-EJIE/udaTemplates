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
var rp_ge = {};
(function ($) {
	
	
	$.extend($.jgrid,{
		createData : function(rowid,obj,tb,maxcols){
			/*ADD*/var $form = tb.parent(); 
			
			
			var $t=this, $self= $($t), settings = $self.data("settings"), nm, hc,trdata, cnt=0,tmp, dc,elc, retpos=[], ind=false,
// 			tdtmpl = "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>", tmpl="", i;
			/*ADD*/tmpl = "<label class='CaptionTD floating_left_pad_right'></label>", i;

			for (i =1; i<=maxcols;i++) {
				tb.append($("<div>")
						.attr("id","col_"+parseInt((parseInt(i,10) || 1)*2,10))
						.addClass("floating_left_pad_right")
						.width((100/maxcols)*0.95+"%")
				);
			}
			if(rowid != '_empty') {
				ind = $(obj).jqGrid("getInd",rowid);
			}

			$(obj.p.colModel).each( function(i) {
				nm = this.name;
				// hidden fields are included in the form
				if(this.editrules && this.editrules.edithidden === true) {
					hc = false;
				} else {
					hc = this.hidden === true ? true : false;
				}
				dc = hc ? "style='display:none'" : "";
				if ( nm !== 'cb' && nm !== 'subgrid' && this.editable===true && nm !== 'rn') {
					if(ind === false) {
						tmp = "";
					} else {
						if(nm == obj.p.ExpandColumn && obj.p.treeGrid === true) {
							tmp = $("td[role='gridcell']:eq("+i+")",obj.rows[ind]).text();
						} else {
							try {
								tmp =  $.unformat.call(obj, $("td[role='gridcell']:eq("+i+")",obj.rows[ind]),{rowId:rowid, colModel:this},i);
							} catch (_) {
								tmp =  (this.edittype && this.edittype == "textarea") ? $("td[role='gridcell']:eq("+i+")",obj.rows[ind]).text() : $("td[role='gridcell']:eq("+i+")",obj.rows[ind]).html();
							}
							if(!tmp || tmp == "&nbsp;" || tmp == "&#160;" || (tmp.length==1 && tmp.charCodeAt(0)==160) ) {tmp='';}
						}
					}
					var opt = $.extend({}, this.editoptions || {} ,{id:nm,name:nm}),
					frmopt = $.extend({}, {elmprefix:'',elmsuffix:'',rowabove:false,rowcontent:''}, this.formoptions || {}),
					rp = parseInt(frmopt.rowpos,10) || cnt+1,
					cp = parseInt((parseInt(frmopt.colpos,10) || 1)*2,10);
					if(rowid == "_empty" && opt.defaultValue ) {
						tmp = $.isFunction(opt.defaultValue) ? opt.defaultValue.call($t) : opt.defaultValue;
					}
					if(!this.edittype) {this.edittype = "text";}
					if($t.p.autoencode) {tmp = $.jgrid.htmlDecode(tmp);}
					elc = $.jgrid.createEl.call($t,this.edittype,opt,tmp,false,$.extend({},$.jgrid.ajaxOptions,obj.p.ajaxSelectOptions || {}));
					if(tmp === "" && this.edittype == "checkbox") {tmp = $(elc).attr("offval");}
					if(tmp === "" && this.edittype == "select") {tmp = $("option:eq(0)",elc).text();}
					/* MODIFICADO */
					if (this.edittype==="custom"){
						elc = $(elc).children()[0];
					}
					$(elc).addClass("FormElement formulario_linea_input");
					
					/* TODO : Permitir la personalización de los estilos de los campos de texto */
//					if( $.inArray(this.edittype, ['text','textarea','password','select']) > -1) {
//						$(elc).addClass("ui-widget-content ui-corner-all");
//					}
					
					trdata = $(tb).find("tr[rowpos="+rp+"]");
					if(frmopt.rowabove) {
						var newdata = $("<div><span class='contentinfo'>"+frmopt.rowcontent+"</span></div>");
						$(tb).append(newdata);
						newdata[0].rp = rp;
					}
					if ( trdata.length===0 ) {
						/*MOD trdata = $("<tr "+dc+" rowpos='"+rp+"'></tr>").addClass("FormData").attr("id","tr_"+nm);*/
						trdata = $("<div "+dc+" rowpos='"+rp+"'></div>").addClass("FormData floating_left_pad_right").attr("id","tr_"+nm);
						/*MOD END */
						$(trdata).append(tmpl);
						$(tb).find("#col_"+cp).append(trdata);
						trdata[0].rp = rp;
					}
					$("label",trdata[0]).attr("for",obj.p.colNames[i]).html( typeof frmopt.label === 'undefined' ? obj.p.colNames[i]: frmopt.label).parent().append("<br/>").append(frmopt.elmprefix).append(elc).append(frmopt.elmsuffix);
					retpos[cnt] = i;
					cnt++;
				}
			});
			if( cnt > 0) {
				/*MOD trdata var idrow = $("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+ (maxcols*2-1)+"' class='DataTD '><input class='FormElement' id='id_g' type='text' name='"+obj.p.id+"_id' value='"+rowid+"'/></td></tr>");*/
				var idrow = $("<div class='FormData' style='display:none'><span class='CaptionTD'></span><span class='DataTD '><input class='FormElement' id='id_g' type='text' name='"+obj.p.id+"_id' value='"+rowid+"'/></span></div>");
				idrow[0].rp = cnt+999;
				$(tb).append(idrow);
				if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData[obj.p.id+"_id"] = rowid;}
			}
			return retpos;
		},
		fillDataClientSide: function(rowid,obj,fmid, frmoper){
			var $t = this, $self = $($t), gID = $t.p.id, frmgr = $.fn.jqGrid.rup.edit.detail.detailFormId +gID, frmtborg = $.fn.jqGrid.rup.edit.detail.detailBodyId +gID, frmtb = "#"+$.jgrid.jqID(frmtborg),
			nm,cnt=0,tmp, fld,opt,vl,vlc;
			if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData = {};rp_ge[$t.p.id]._savedData[obj.p.id+"_id"]=rowid;}
			var cm = obj.p.colModel;
			if(rowid == '_empty') {
				$(cm).each(function(){
					nm = this.name;
					opt = $.extend({}, this.editoptions || {} );
					fld = $("#"+$.jgrid.jqID(nm),"#"+fmid);
					if(fld && fld.length && fld[0] !== null) {
						vl = "";
						if(opt.defaultValue ) {
							vl = $.isFunction(opt.defaultValue) ? opt.defaultValue.call($t) : opt.defaultValue;
							if(fld[0].type=='checkbox') {
								vlc = vl.toLowerCase();
								if(vlc.search(/(false|0|no|off|undefined)/i)<0 && vlc!=="") {
									fld[0].checked = true;
									fld[0].defaultChecked = true;
									fld[0].value = vl;
								} else {
									fld[0].checked = false;
									fld[0].defaultChecked = false;
								}
							} else {fld.val(vl);}
						} else {
							if( fld[0].type=='checkbox' ) {
								fld[0].checked = false;
								fld[0].defaultChecked = false;
								vl = $(fld).attr("offval");
							} else if (fld[0].type && fld[0].type.substr(0,6)=='select') {
								fld[0].selectedIndex = 0;
							} else {
								fld.val(vl);
							}
						}
						if(rp_ge[$t.p.id].checkOnSubmit===true || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData[nm] = vl;}
					}
				});
				$("#id_g","#"+fmid).val(rowid);
				return;
			}
			var tre = $(obj).jqGrid("getInd",rowid,true);
			if(!tre) {return;}
			$('td[role="gridcell"]',tre).each( function(i) {
				nm = cm[i].name;
				// hidden fields are included in the form
				if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn' && cm[i].editable===true) {
					if(nm == obj.p.ExpandColumn && obj.p.treeGrid === true) {
						tmp = $(this).text();
					} else {
						try {
							tmp =  $.unformat.call(obj, $(this),{rowId:rowid, colModel:cm[i]},i);
						} catch (_) {
							tmp = cm[i].edittype=="textarea" ? $(this).text() : $(this).html();
						}
					}
					if($t.p.autoencode) {tmp = $.jgrid.htmlDecode(tmp);}
					if(rp_ge[$t.p.id].checkOnSubmit===true || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData[nm] = tmp;}
					nm = $.jgrid.jqID(nm);
					switch (cm[i].edittype) {
						case "password":
						case "text":
						case "button" :
						case "image":
						case "textarea":
							if(tmp == "&nbsp;" || tmp == "&#160;" || (tmp.length==1 && tmp.charCodeAt(0)==160) ) {tmp='';}
							$("#"+nm,"#"+fmid).val(tmp);
							break;
						case "select":
							var opv = tmp.split(",");
							opv = $.map(opv,function(n){return $.trim(n);});
							$("#"+nm+" option","#"+fmid).each(function(){
								if (!cm[i].editoptions.multiple && ($.trim(tmp) == $.trim($(this).text()) || opv[0] == $.trim($(this).text()) || opv[0] == $.trim($(this).val())) ){
									this.selected= true;
								} else if (cm[i].editoptions.multiple){
									if(  $.inArray($.trim($(this).text()), opv ) > -1 || $.inArray($.trim($(this).val()), opv ) > -1  ){
										this.selected = true;
									}else{
										this.selected = false;
									}
								} else {
									this.selected = false;
								}
							});
							break;
						case "checkbox":
							tmp = String(tmp);
							if(cm[i].editoptions && cm[i].editoptions.value) {
								var cb = cm[i].editoptions.value.split(":");
								if(cb[0] == tmp) {
									$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("checked",true);
									$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("defaultChecked",true); //ie
								} else {
									$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("checked", false);
									$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("defaultChecked", false); //ie
								}
							} else {
								tmp = tmp.toLowerCase();
								if(tmp.search(/(false|0|no|off|undefined)/i)<0 && tmp!=="") {
									$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("checked",true);
									$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("defaultChecked",true); //ie
								} else {
									$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("checked", false);
									$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("defaultChecked", false); //ie
								}
							}
							break;
						case 'custom' :
							try {
								if(cm[i].editoptions && $.isFunction(cm[i].editoptions.custom_value)) {
									cm[i].editoptions.custom_value.call($t, $("#"+nm,"#"+fmid),'set',tmp);
								} else {throw "e1";}
							} catch (e) {
								if (e=="e1") {$.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.nodefined,$.jgrid.edit.bClose);}
								else {$.jgrid.info_dialog($.jgrid.errors.errcap,e.message,$.jgrid.edit.bClose);}
							}
							break;
					}
					cnt++;
				}
			});
			if(cnt>0) {$("#id_g",frmtb).val(rowid);}
		},
		fillDataServerSide: function(rowid,$form, frmoper){
			var $t = this, $self = $($t), settings = $self.data("settings"),
			$detailFormToPopulate = ($form!==undefined?$form:settings.formEdit.$detailForm),
			dataIDs = $self.jqGrid("getDataIDs"),
			detailURL,
			parentColPks, 
			parent, 
			parentSelectedRow, 
			page = $self.jqGrid("getGridParam", "page");
			
			var ajaxOptions = $.extend({
				success: function (xhr, ajaxOptions) {
					var detailIndex, 
						page = $self.rup_table("getGridParam", "page"), 
						totalRows, rowsXpage, totalElements, xhrArray, objSerializedForm;
					
					// Se actualiza el contador de registros
//					self.rup_maint("updateDetailPagination", detailIndex.current, detailIndex.total);
					
					if (xhr.id && xhr.id instanceof Object){//estamos en JPA
						if (xhr.id instanceof Object) {//es que estamos en jpa y traemos una clave compuesta
							xhr["JPA_ID"] = xhr.id;
							delete xhr.id;
						}
					}
					xhrArray = $.rup_utils.jsontoarray(xhr);
					
					$.rup_utils.populateForm(xhrArray, $detailFormToPopulate);
					
					rp_ge[$t.p.id]._savedData = xhr;
					rp_ge[$t.p.id]._savedData[settings.id+"_id"]=rowid;
					$("#id_g",$form).val(rowid);
					
//					if ($.isFunction(mnt.prop.onbeforeDetailShow)) {
//						mnt.prop.onbeforeDetailShow.call(mnt, mnt.prop.detailDiv, xhr, ajaxOptions);
//					}
//					objSerializedForm = $.map(self._getDataForFormModifications(mnt.prop.detailForm), function(elem,i){
//						if(xhrArray[elem.name]){
//						    return {name:elem.name,value:(xhrArray[elem.name]!==null?xhrArray[elem.name]:"")};
//						}else{
//							return {name:elem.name,value:(elem.value!==null?elem.value:"")};
//						}
//					});
					
//					//Gestor de cambios
//					mnt.prop.detailForm.data('initialData', $.param(objSerializedForm));
//
//					if (!mnt.prop.detailDiv.rup_dialog("isOpen")) {
//						mnt.prop.detailDiv.rup_dialog("open");
//					}
//					
//					if ($.isFunction(mnt.prop.onafterDetailShow)) {
//						mnt.prop.onafterDetailShow.call(mnt, mnt.prop.detailDiv, xhr, ajaxOptions);
//					}
//
//					//establecemos el foco al primer elemento
////						$("input:not(readonly):visible:first", mnt.prop.detailForm).focus();
//					$("input:not([readonly]):not(:disabled):visible:first", mnt.prop.detailForm).focus();
//					
//						return false;
					},
					error: function (xhr, ajaxOptions, thrownError) {
						mnt.prop.feedback.rup_feedback("option", "delay", null);
						mnt.prop.feedback.rup_feedback("set", xhr.responseText, "error");
						mnt.prop.feedback.rup_feedback("option", "delay", 1000);
					}
			}, settings.formEdit.detailOptions.ajaxDetailOptions);
			
			ajaxOptions.url+="/"+rowid;
			$.when($.rup_ajax(ajaxOptions)).then(function(success, statusText, xhr){
				$self.triggerHandler("jqGridAddEditAfterFillData", [$form, frmoper]);
			});
		},
		fillData : function(rowid,obj,fmid, frmoper){
			var $t = this, $self = $($t), settings = $self.data("settings");
			
			switch ((rowid == '_empty'?"clientSide":settings.formEdit.editOptions.fillDataMethod)){
				case "clientSide":
					$.proxy($.jgrid.fillDataClientSide, $t)(rowid,obj,fmid, frmoper);
					break;
				case "serverSide":
				default:
					$.proxy($.jgrid.fillDataServerSide, $t)(rowid,settings.formEdit.$detailForm,frmoper);
					break;
			}
		},
        getFormData : function(postdata, extpost){
			var $t = this, $self = $(this), settings = $self.data("settings"), gID = $t.p.id, frmgr = $.fn.jqGrid.rup.edit.detail.detailFormId +gID, frmtborg = $.fn.jqGrid.rup.edit.detail.detailBodyId +gID, frmtb = "#"+$.jgrid.jqID(frmtborg);
			$(frmtb+" .FormElement").each(function() {
//				var celm = $("input,select .customelement");
				if ($(this).hasClass("customelement")) {
					var  elem = this, nm = $(elem).attr('name');
					$.each($t.p.colModel, function(){
						if(this.name === nm && this.editoptions && $.isFunction(this.editoptions.custom_value)) {
							try {
								postdata[nm] = this.editoptions.custom_value.call($t, $("#"+$.jgrid.jqID(nm),frmtb),'get');
								if (postdata[nm] === undefined) {throw "e1";}
							} catch (e) {
								if (e==="e1") {$.jgrid.info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.novalue,jQuery.jgrid.edit.bClose);}
								else {$.jgrid.info_dialog(jQuery.jgrid.errors.errcap,e.message,jQuery.jgrid.edit.bClose);}
							}
							return true;
						}
					});
				} else {
				switch ($(this).get(0).type) {
					case "checkbox":
						if($(this).is(":checked")) {
							postdata[this.name]= $(this).val();
						}else {
							var ofv = $(this).attr("offval");
							postdata[this.name]= ofv;
						}
					break;
					case "select-one":
						postdata[this.name]= $("option:selected",this).val();
						extpost[this.name]= $("option:selected",this).text();
					break;
					case "select-multiple":
						postdata[this.name]= $(this).val();
						if(postdata[this.name]) {postdata[this.name] = postdata[this.name].join(",");}
						else {postdata[this.name] ="";}
						var selectedText = [];
						$("option:selected",this).each(
							function(i,selected){
								selectedText[i] = $(selected).text();
							}
						);
						extpost[this.name]= selectedText.join(",");
					break;
					case "password":
					case "text":
					case "textarea":
					case "button":
						postdata[this.name] = $(this).val();

					break;
				}
				if($t.p.autoencode) {postdata[this.name] = $.jgrid.htmlEncode(postdata[this.name]);}
				}
			});
			return true;
		},postIt : function(postdata, extpost, frmoper) {
			var $t = this, gID = $t.p.id, frmgr = $.fn.jqGrid.rup.edit.detail.detailFormId +gID, frmtborg = $.fn.jqGrid.rup.edit.detail.detailBodyId +gID, frmtb = "#"+$.jgrid.jqID(frmtborg),
			copydata, ret=[true,"",""], onCS = {}, opers = $t.p.prmNames, idname, oper, key, selr, i;
			
			var retvals = $($t).triggerHandler("jqGridAddEditBeforeCheckValues", [$("#"+frmgr), frmoper]);
			if(retvals && typeof retvals === 'object') {postdata = retvals;}
			
			if($.isFunction(rp_ge[$t.p.id].beforeCheckValues)) {
				retvals = rp_ge[$t.p.id].beforeCheckValues.call($t, postdata,$("#"+frmgr),postdata[$t.p.id+"_id"] == "_empty" ? opers.addoper : opers.editoper);
				if(retvals && typeof retvals === 'object') {postdata = retvals;}
			}
			for( key in postdata ){
				if(postdata.hasOwnProperty(key)) {
					ret = $.jgrid.checkValues.call($t,postdata[key],key,$t);
					if(ret[0] === false) {break;}
				}
			}
			$.proxy($.jgrid.setNulls, $t)();
			if(ret[0]) {
				onCS = $($t).triggerHandler("jqGridAddEditClickSubmit", [rp_ge[$t.p.id], postdata, frmoper]);
				if( onCS === undefined && $.isFunction( rp_ge[$t.p.id].onclickSubmit)) { 
					onCS = rp_ge[$t.p.id].onclickSubmit.call($t, rp_ge[$t.p.id], postdata) || {}; 
				}
				ret = $($t).triggerHandler("jqGridAddEditBeforeSubmit", [postdata, $("#"+frmgr), frmoper]);
				if(ret === undefined) {
					ret = [true,"",""];
				}
				if( ret[0] && $.isFunction(rp_ge[$t.p.id].beforeSubmit))  {
					ret = rp_ge[$t.p.id].beforeSubmit.call($t,postdata,$("#"+frmgr));
				}
			}

//			if(ret[0] && !rp_ge[$t.p.id].processing) {
			if(ret[0]) {
				rp_ge[$t.p.id].processing = true;
				$("#sData", frmtb+"_2").addClass('ui-state-active');
				oper = opers.oper;
				idname = opers.id;
				// we add to pos data array the action - the name is oper
				postdata[oper] = ($.trim(postdata[$t.p.id+"_id"]) == "_empty") ? opers.addoper : opers.editoper;
				if(postdata[oper] != opers.addoper) {
					postdata[idname] = postdata[$t.p.id+"_id"];
				} else {
					// check to see if we have allredy this field in the form and if yes lieve it
					if( postdata[idname] === undefined ) {postdata[idname] = postdata[$t.p.id+"_id"];}
				}
				delete postdata[$t.p.id+"_id"];
				postdata = $.extend(postdata,rp_ge[$t.p.id].editData,onCS);
				if($t.p.treeGrid === true)  {
					if(postdata[oper] == opers.addoper) {
					selr = $($t).jqGrid("getGridParam", 'selrow');
						var tr_par_id = $t.p.treeGridModel == 'adjacency' ? $t.p.treeReader.parent_id_field : 'parent_id';
						postdata[tr_par_id] = selr;
					}
					for(i in $t.p.treeReader){
						if($t.p.treeReader.hasOwnProperty(i)) {
							var itm = $t.p.treeReader[i];
							if(postdata.hasOwnProperty(itm)) {
								if(postdata[oper] == opers.addoper && i === 'parent_id_field') {continue;}
								delete postdata[itm];
							}
						}
					}
				}
				
				postdata[idname] = $.jgrid.stripPref($t.p.idPrefix, postdata[idname]);
				postdata[idname] = $.jgrid.stripPref($t.p.idPrefix, postdata[idname]);
				var ajaxOptions = $.extend({
					url: rp_ge[$t.p.id].url || $($t).jqGrid('getGridParam','editurl'),
					type: rp_ge[$t.p.id].mtype,
					data: $.isFunction(rp_ge[$t.p.id].serializeEditData) ? rp_ge[$t.p.id].serializeEditData.call($t,postdata) :  postdata,
					complete:function(data,status){
						var key;
						postdata[idname] = $t.p.idPrefix + postdata[idname];
						if(status != "success") {
							ret[0] = false;
							ret[1] = $($t).triggerHandler("jqGridAddEditErrorTextFormat", [data, frmoper]);
							if ($.isFunction(rp_ge[$t.p.id].errorTextFormat)) {
								ret[1] = rp_ge[$t.p.id].errorTextFormat.call($t, data);
							} else {
								ret[1] = status + " Status: '" + data.statusText + "'. Error code: " + data.status;
							}
						} else {
							// data is posted successful
							// execute aftersubmit with the returned data from server
							ret = $($t).triggerHandler("jqGridAddEditAfterSubmit", [data, postdata, frmoper]);
							if(ret === undefined) {
								ret = [true,"",""];
							}
							if( ret[0] && $.isFunction(rp_ge[$t.p.id].afterSubmit) ) {
								ret = rp_ge[$t.p.id].afterSubmit.call($t, data,postdata);
							}
						}
						if(ret[0] === false) {
							$("#FormError>td",frmtb).html(ret[1]);
							$("#FormError",frmtb).show();
						} else {
							// remove some values if formattaer select or checkbox
							$.each($t.p.colModel, function(){
								if(extpost[this.name] && this.formatter && this.formatter=='select') {
									try {delete extpost[this.name];} catch (e) {}
								}
							});
							postdata = $.extend(postdata,extpost);
							if($t.p.autoencode) {
								$.each(postdata,function(n,v){
									postdata[n] = $.jgrid.htmlDecode(v);
								});
							}
							//rp_ge[$t.p.id].reloadAfterSubmit = rp_ge[$t.p.id].reloadAfterSubmit && $t.p.datatype != "local";
							// the action is add
							if(postdata[oper] == opers.addoper ) {
								//id processing
								// user not set the id ret[2]
								if(!ret[2]) {ret[2] = $.jgrid.randId();}
								postdata[idname] = ret[2];
								if(rp_ge[$t.p.id].closeAfterAdd) {
									if(rp_ge[$t.p.id].reloadAfterSubmit) {$($t).trigger("reloadGrid");}
									else {
										if($t.p.treeGrid === true){
											$($t).jqGrid("addChildNode",ret[2],selr,postdata );
										} else {
										$($t).jqGrid("addRowData",ret[2],postdata,rp_ge[$t.p.id].addedrow);
											$($t).jqGrid("setSelection",ret[2]);
										}
									}
									$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:rp_ge[$t.p.id].jqModal,onClose: rp_ge[$t.p.id].onClose});
								} else if (rp_ge[$t.p.id].clearAfterAdd) {
									if(rp_ge[$t.p.id].reloadAfterSubmit) {$($t).trigger("reloadGrid");}
									else {
										if($t.p.treeGrid === true){
											$($t).jqGrid("addChildNode",ret[2],selr,postdata );
										} else {
											$($t).jqGrid("addRowData",ret[2],postdata,rp_ge[$t.p.id].addedrow);
											// TODO : Añadido para que seleccione el registro insertado. Tratar de hacerlo en el evento jqGridAfterInsertRow
											$($t).jqGrid("setSelection",ret[2]);
										}
									}
									$.proxy($.jgrid.fillData, $t)("_empty",$t,frmgr);
								} else {
									if(rp_ge[$t.p.id].reloadAfterSubmit) {$($t).trigger("reloadGrid");}
									else {
										if($t.p.treeGrid === true){
											$($t).jqGrid("addChildNode",ret[2],selr,postdata );
										} else {
											$($t).jqGrid("addRowData",ret[2],postdata,rp_ge[$t.p.id].addedrow);
								}
									}
								}
							} else {
								// the action is update
								if(rp_ge[$t.p.id].reloadAfterSubmit) {
									$($t).trigger("reloadGrid");
									if( !rp_ge[$t.p.id].closeAfterEdit ) {setTimeout(function(){$($t).jqGrid("setSelection",postdata[idname]);},1000);}
								} else {
									if($t.p.treeGrid === true) {
										$($t).jqGrid("setTreeRow", postdata[idname],postdata);
									} else {
										$($t).jqGrid("setRowData", postdata[idname],postdata);
									}
								}
								if(rp_ge[$t.p.id].closeAfterEdit) {$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:rp_ge[$t.p.id].jqModal,onClose: rp_ge[$t.p.id].onClose});}
							}
							if($.isFunction(rp_ge[$t.p.id].afterComplete)) {
								copydata = data;
								setTimeout(function(){
									$($t).triggerHandler("jqGridAddEditAfterComplete", [copydata, postdata, $("#"+frmgr), frmoper]);
									rp_ge[$t.p.id].afterComplete.call($t, copydata, postdata, $("#"+frmgr));
									copydata=null;
								},500);
							}
						if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {
							$("#"+frmgr).data("disabled",false);
							if(rp_ge[$t.p.id]._savedData[$t.p.id+"_id"] !="_empty"){
								for(key in rp_ge[$t.p.id]._savedData) {
									if(rp_ge[$t.p.id]._savedData.hasOwnProperty(key) && postdata[key]) {
										rp_ge[$t.p.id]._savedData[key] = postdata[key];
									}
								}
							}
						}
						}
						rp_ge[$t.p.id].processing=false;
						$("#sData", frmtb+"_2").removeClass('ui-state-active');
						try{$(':input:visible',"#"+frmgr)[0].focus();} catch (e){}
					}
				}, $.jgrid.ajaxOptions, rp_ge[$t.p.id].ajaxEditOptions );

				if (!ajaxOptions.url && !rp_ge[$t.p.id].useDataProxy) {
					if ($.isFunction($t.p.dataProxy)) {
						rp_ge[$t.p.id].useDataProxy = true;
					} else {
						ret[0]=false;ret[1] += " "+$.jgrid.errors.nourl;
					}
				}
				if (ret[0]) {
					if (rp_ge[$t.p.id].useDataProxy) {
						var dpret = $t.p.dataProxy.call($t, ajaxOptions, "set_"+$t.p.id); 
						if(dpret === undefined) {
							dpret = [true, ""];
						}
						if(dpret[0] === false ) {
							ret[0] = false;
							ret[1] = dpret[1] || "Error deleting the selected row!" ;
						} else {
							if(ajaxOptions.data.oper == opers.addoper && rp_ge[$t.p.id].closeAfterAdd ) {
								$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:rp_ge[$t.p.id].jqModal, onClose: rp_ge[$t.p.id].onClose});
							}
							if(ajaxOptions.data.oper == opers.editoper && rp_ge[$t.p.id].closeAfterEdit ) {
								$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:rp_ge[$t.p.id].jqModal, onClose: rp_ge[$t.p.id].onClose});
							}
						}
					} else {
						$.ajax(ajaxOptions); 
					}
				}
			}
			if(ret[0] === false) {
				$("#FormError>td",frmtb).html(ret[1]);
				$("#FormError",frmtb).show();
				// return;
			}
		},setNulls : function () {
			var $t = this;
			$.each($t.p.colModel, function(i,n){
				if(n.editoptions && n.editoptions.NullIfEmpty === true) {
					if(postdata.hasOwnProperty(n.name) && postdata[n.name] === "") {
						postdata[n.name] = 'null';
					}
				}
			});
			
		},compareData : function(nObj, oObj ) {
			var ret = false, key;
			for (key in nObj) {
				if(nObj.hasOwnProperty(key) && nObj[key] != oObj[key]) {
					ret = true;
					break;
				}
			}
			return ret;
		},checkUpdates : function(extpost, okCallback) {
			var $self = $(this), $t = this, gID = $t.p.id, frmgr = $.fn.jqGrid.rup.edit.detail.detailFormId +gID, frmtborg = $.fn.jqGrid.rup.edit.detail.detailBodyId +gID, frmtb = "#"+$.jgrid.jqID(frmtborg),
			stat = true;
//			$("#FormError",frmtb).hide();
			if(rp_ge[$t.p.id].checkOnUpdate) {
				postdata = {};extpost={};
				$.proxy($.jgrid.getFormData, $t)(postdata, extpost);
				newData = $.extend({},postdata,extpost);
				diff = $.proxy($.jgrid.compareData, $t)(newData,rp_ge[$t.p.id]._savedData);
				if(diff) {
					$.rup_messages("msgConfirm", {
						message: $.rup.i18nParse($.rup.i18n.base,"rup_maint.saveAndContinue"),
						title: $.rup.i18nParse($.rup.i18n.base,"rup_maint.changes"),
						OKFunction : function () {
							$(this).dialog("destroy").remove();
							if (jQuery.isFunction(okCallback)){
								jQuery.proxy(okCallback, $self)();
							}
						}
					});
//					$("#"+frmgr).data("disabled",true);
//					$(".confirm","#"+IDs.themodal).show();
					stat = false;
				}
			}
			return stat;
		},restoreInline : function(rowid) {
			var $t = this, i;
			if (rowid !== "_empty" && typeof($t.p.savedRow) !== "undefined" && $t.p.savedRow.length > 0 && $.isFunction($.fn.jqGrid.restoreRow)) {
				for (i=0;i<$t.p.savedRow.length;i++) {
					if ($t.p.savedRow[i].id == rowid) {
						$($t).jqGrid('restoreRow',rowid);
						break;
					}
				}
			}
		},
		getCurrPos : function() {
			var $t = this, $self = $(this), gID = $t.p.id, frmgr = $.fn.jqGrid.rup.edit.detail.detailFormId +gID, frmtborg = $.fn.jqGrid.rup.edit.detail.detailBodyId +gID, frmtb = "#"+$.jgrid.jqID(frmtborg), rowsInGrid = $($t).jqGrid("getDataIDs"),
			selrow = ($("#id_g",frmtb).val()!==undefined?$("#id_g",frmtb).val():$self.jqGrid('getGridParam','selrow'));
			pos = $.inArray(selrow,rowsInGrid);
			return [pos,rowsInGrid];
		},
		updateNav : function(cr,posarr){
			var $self = $(this), totr;
			if (posarr!==undefined && posarr[1] !== undefined){
				totr = posarr[1].length-1;
				if (cr===0) {
					$("#pData",frmtb+"_2").addClass('ui-state-disabled');
				} else if( posarr[1][cr-1] !== undefined && $("#"+$.jgrid.jqID(posarr[1][cr-1])).hasClass('ui-state-disabled')) {
						$("#pData",frmtb+"_2").addClass('ui-state-disabled');
				} else {
					$("#pData",frmtb+"_2").removeClass('ui-state-disabled');
				}
				
				if (cr==totr) {
					$("#nData",frmtb+"_2").addClass('ui-state-disabled');
				} else if( posarr[1][cr+1] !== undefined && $("#"+$.jgrid.jqID(posarr[1][cr+1])).hasClass('ui-state-disabled')) {
					$("#nData",frmtb+"_2").addClass('ui-state-disabled');
				} else {
					$("#nData",frmtb+"_2").removeClass('ui-state-disabled');
				}
			}
			$self.rup_table("updateDetailPagination");
		}
	});
	
	/*
	 * MODIFICACIONES
	 * Funciones extendidas (MODIFICADAS) del componente jqGrid.
	 * 
	 * Los métodos aquí indicados han sido extendidos partiendo de la implementación original.
	 * Las modificaciones han sido realizadas debido a la incompatibilidad de su implementación con los requisitos exigidos.
	 * 
	 * Los métodos extendidos para su modificación son los siguientes:
	 * 
	 * - editGridRow
	 */ 
	$.jgrid.extend({
		editGridRow : function(rowid, p){
			p = $.extend({
				top : 0,
				left: 0,
				width: 300,
				height: 'auto',
				dataheight: 'auto',
				modal: false,
				overlay : 30,
				drag: true,
				resize: true,
				url: null,
				mtype : "POST",
				clearAfterAdd :true,
				closeAfterEdit : false,
				reloadAfterSubmit : true,
				onInitializeForm: null,
				beforeInitData: null,
				beforeShowForm: null,
				afterShowForm: null,
				beforeSubmit: null,
				afterSubmit: null,
				onclickSubmit: null,
				afterComplete: null,
				onclickPgButtons : null,
				afterclickPgButtons: null,
				editData : {},
				recreateForm : false,
				jqModal : true,
				closeOnEscape : false,
				addedrow : "first",
				topinfo : '',
				bottominfo: '',
				saveicon : [],
				closeicon : [],
				savekey: [false,13],
				navkeys: [false,38,40],
				checkOnSubmit : false,
				checkOnUpdate : false,
				_savedData : {},
				processing : false,
				onClose : null,
				ajaxEditOptions : {},
				serializeEditData : null,
				viewPagerButtons : true
			}, $.jgrid.edit, p || {});
			rp_ge[$(this)[0].p.id] = p;
			return this.each(function(){
				var $t = this, $self= $($t), settings = $self.data("settings");
				if (!$t.grid || !rowid) {return;}
				var gID = $t.p.id,
				frmgr = $.fn.jqGrid.rup.edit.detail.detailFormId +gID, frmtborg = $.fn.jqGrid.rup.edit.detail.detailBodyId +gID, frmtb = "#"+$.jgrid.jqID(frmtborg), 
				IDs = {themodal:$.fn.jqGrid.rup.edit.detail.detailDivId + gID,modalhead:'edithd'+gID,modalcontent:'editcnt'+gID, scrollelm : frmgr},
				onBeforeShow = $.isFunction(rp_ge[$t.p.id].beforeShowForm) ? rp_ge[$t.p.id].beforeShowForm : false,
				onAfterShow = $.isFunction(rp_ge[$t.p.id].afterShowForm) ? rp_ge[$t.p.id].afterShowForm : false,
				onBeforeInit = $.isFunction(rp_ge[$t.p.id].beforeInitData) ? rp_ge[$t.p.id].beforeInitData : false,
				onInitializeForm = $.isFunction(rp_ge[$t.p.id].onInitializeForm) ? rp_ge[$t.p.id].onInitializeForm : false,
				showFrm = true,
				maxCols = 1, maxRows=0,	postdata, extpost, newData, diff, frmoper;
				frmgr = $.jgrid.jqID(frmgr);
				if (rowid === "new") {
					rowid = "_empty";
					frmoper = "add";
					p.caption=rp_ge[$t.p.id].addCaption;
				} else {
					p.caption=rp_ge[$t.p.id].editCaption;
					frmoper = "edit";
				}
				settings.opermode = frmoper;
				if(p.recreateForm===true && $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined) {
					$("#"+$.jgrid.jqID(IDs.themodal)).remove();
				}
				var closeovrl = true;
				if(p.checkOnUpdate && p.jqModal && !p.modal) {
					closeovrl = false;
				}
				if ( $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined ) {
					showFrm = $($t).triggerHandler("jqGridAddEditBeforeInitData", [(settings.formEdit.$detailForm?settings.formEdit.$detailForm:$("#"+frmgr)), frmoper]);
					if(showFrm === undefined) {
						showFrm = true;
					}
					if(showFrm && onBeforeInit) {
						showFrm = onBeforeInit.call($t,(settings.formEdit.$detailForm?settings.formEdit.$detailForm:$("#"+frmgr)));
					}
					if(showFrm === false) {return;}
					$.proxy($.jgrid.restoreInline, $t)(rowid);
					$(".ui-jqdialog-title","#"+$.jgrid.jqID(IDs.modalhead)).html(p.caption);
					$("#FormError",frmtb).hide();
					if(rp_ge[$t.p.id].topinfo) {
						$(".topinfo",frmtb).html(rp_ge[$t.p.id].topinfo);
						$(".tinfo",frmtb).show();
					} else {
						$(".tinfo",frmtb).hide();
					}
					if(rp_ge[$t.p.id].bottominfo) {
						$(".bottominfo",frmtb+"_2").html(rp_ge[$t.p.id].bottominfo);
						$(".binfo",frmtb+"_2").show();
					} else {
						$(".binfo",frmtb+"_2").hide();
					}
					$.proxy($.jgrid.fillData, $t)(rowid,$t, frmgr, frmoper);
					///
					if(rowid=="_empty" || !rp_ge[$t.p.id].viewPagerButtons) {
						$("#pData, #nData",frmtb+"_2").hide();
					} else {
						$("#pData, #nData",frmtb+"_2").show();
					}
					if(rp_ge[$t.p.id].processing===true) {
						rp_ge[$t.p.id].processing=false;
						$("#sData", frmtb+"_2").removeClass('ui-state-active');
					}
					if((settings.formEdit.$detailForm?settings.formEdit.$detailForm:$("#"+frmgr)).data("disabled")===true) {
						$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).hide();
						(settings.formEdit.$detailForm?settings.formEdit.$detailForm:$("#"+frmgr)).data("disabled",false);
					}
					$($t).triggerHandler("jqGridAddEditBeforeShowForm", [(settings.formEdit.$detailForm?settings.formEdit.$detailForm:$("#"+frmgr)), frmoper]);
					if(onBeforeShow) { onBeforeShow.call($t, (settings.formEdit.$detailForm?settings.formEdit.$detailForm:$("#"+frmgr))); }
					$("#"+$.jgrid.jqID(IDs.themodal)).data("onClose",rp_ge[$t.p.id].onClose);
					$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, jqM: false, overlay: p.overlay, modal:p.modal});
					if(!closeovrl) {
						$(".jqmOverlay").click(function(){
							if(!$.proxy($.jgrid.checkUpdates, $t)(extpost)) {return false;}
							$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
							return false;
						});
					}
					$($t).triggerHandler("jqGridAddEditAfterShowForm", [(settings.formEdit.$detailForm?settings.formEdit.$detailForm:$("#"+frmgr)), frmoper]);
					if(onAfterShow) { onAfterShow.call($t, (settings.formEdit.$detailForm?settings.formEdit.$detailForm:$("#"+frmgr))); }
				} else {
					var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight+"px",
					dw = isNaN(p.datawidth) ? p.datawidth : p.datawidth+"px",
					frm = $(jQuery.rup.i18nTemplate(jQuery.rup.i18n.base,"rup_table.templates.detailForm.form", frmgr, dh)).data("disabled",false),
					tbl = $(jQuery.rup.i18nTemplate(jQuery.rup.i18n.base,"rup_table.templates.detailForm.body", frmtborg)),
					showFrm = $($t).triggerHandler("jqGridAddEditBeforeInitData", [$("#"+frmgr), frmoper]);
					if(typeof(showFrm) == "undefined") {
						showFrm = true;
					}
					if(showFrm && onBeforeInit) {
						showFrm = onBeforeInit.call($t,$("#"+frmgr));
					}
					if(showFrm === false) {return;}
					$.proxy($.jgrid.restoreInline, $t)(rowid);
					$($t.p.colModel).each( function() {
						var fmto = this.formoptions;
						maxCols = Math.max(maxCols, fmto ? fmto.colpos || 0 : 0 );
						maxRows = Math.max(maxRows, fmto ? fmto.rowpos || 0 : 0 );
					});
					$(frm).append(tbl);
					flr = $(jQuery.rup.i18nTemplate(jQuery.rup.i18n.base,"rup_table.templates.detailForm.errorFeedback","FormError"));
					flr[0].rp = 0;
					$(tbl).append(flr);
/* ADD	*/			flr = $("<div class='tinfo' style='display:none'><span class='topinfo'>"+rp_ge[$t.p.id].topinfo+"</span></div>");
					/*MOD END*/
					flr[0].rp = 0;
					$(tbl).append(flr);
					// set the id.
					// use carefull only to change here colproperties.
					// create data
					var rtlb = $t.p.direction == "rtl" ? true :false,
					bp = rtlb ? "nData" : "pData",
					bn = rtlb ? "pData" : "nData";
/* DEL				createData(rowid,$t,tbl,maxCols); */
					if (settings.formEdit.$detailForm===undefined){
						settings.formEdit.$detailForm = tbl.parent();
						$.proxy($.jgrid.createData, $t)(rowid,$t,tbl,maxCols);
					}
					
					if (!settings.formEdit.$detailForm.is(":visible")){
						settings.formEdit.$detailForm.show();
					}
					frm = settings.formEdit.$detailForm[0];
					if (frmoper==="edit"){
						$.proxy($.jgrid.fillData, $t)(rowid, $t);
						
					}
//					}else{
						
//					}
					
//					if (settings.$detailForm){
//						if (!settings.$detailForm.is(":visible")){
//							settings.$detailForm.show();
//						}
//						frm = settings.$detailForm[0];
//						if (settings.editOptions.fillDataMethod==="serverSide"){
//							if (frmoper==="edit"){
//								$.proxy($.jgrid.fillDataServerSide, $t)(rowid, settings.$detailForm);
//							}
//						}
//					}else{
//						settings.$detailForm = tbl.parent();
//						$.proxy($.jgrid.createData, $t)(rowid,$t,tbl,maxCols);
//					}
					
					// buttons at footer
					var bP = "<a href='javascript:void(0)' id='"+bp+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
					bN = "<a href='javascript:void(0)' id='"+bn+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
					bS  ="<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'>"+p.bSubmit+"</a>",
					bC  ="<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>"+p.bCancel+"</a>";
					var bt = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='"+frmtborg+"_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>"+(rtlb ? bN+bP : bP+bN)+"</td><td class='EditButton'>"+bS+bC+"</td></tr>";
					bt += "<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>"+rp_ge[$t.p.id].bottominfo+"</td></tr>";
					bt += "</tbody></table>";
					
/*
 * MODIFICADO POR UDA. 
 * Adaptar la ordenación a la nueva disposición mediante divs en vez de table.
 */
					if(maxRows >  0) {
						for (var i=1;i<=maxCols;i++){
							// Por cada columna
							var $colLayer = tbl.find("#col_"+parseInt((parseInt(i,10) || 1)*2,10));
							var sd=[];
							$.each($colLayer.find("div"),function(i,r){
								sd[i] = r;
							});
							sd.sort(function(a,b){
								if(a.rp > b.rp) {return 1;}
								if(a.rp < b.rp) {return -1;}
								return 0;
							});
							$.each(sd, function(index, row) {
								$colLayer.append(row);
							});
						}
					}
/*
 * FIN MODIFICACION 
 */
					
					p.gbox = "#gbox_"+$.jgrid.jqID(gID);
					var cle = false;
					if(p.closeOnEscape===true){
						p.closeOnEscape = false;
						cle = true;
					}
					
/*
 * MODIFICADO POR UDA
 * Añadida barra de navegación entre elementos
 */
					
					
					var barraNavegacion = $self.rup_table("createDetailNavigation");
//					var tms = barraNavegacion.after(frm).after(bt);
					var tms = barraNavegacion.after(frm);
					
					function saveData (){
						postdata = {};extpost={};
						$("#FormError",frmtb).hide();
						
						// all depend on ret array
						//ret[0] - succes
						//ret[1] - msg if not succes
						//ret[2] - the id  that will be set if reload after submit false
						$.proxy($.jgrid.getFormData, $t)(postdata);
						if(postdata[$t.p.id+"_id"] == "_empty")	{$.proxy($.jgrid.postIt, $t)(postdata, extpost, settings.opermode);}
						else if(p.checkOnSubmit===true ) {
							newData = $.extend({},postdata,extpost);
							diff = compareData(newData,rp_ge[$t.p.id]._savedData);
							if(diff) {
								$("#"+frmgr).data("disabled",true);
								$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).show();
							} else {
								$.proxy($.jgrid.postIt, $t)(postdata, extpost, settings.opermode);
							}
						} else {
							$.proxy($.jgrid.postIt, $t)(postdata, extpost, settings.opermode);
						}
						return false;
					};
					
					var saveButton = {
						text: $.rup.i18nParse($.rup.i18n.base,"rup_global.save"),
						click: function () { 
							$self.data("tmp.formEditSaveType", "SAVE");
							if (!saveData()){return false;}
						}
					};
					
					var saveAndRepeatButton = {
						text: $.rup.i18nParse($.rup.i18n.base,"rup_global.save_repeat"),
						click: function () { 
							$self.data("tmp.formEditSaveType", "SAVE_REPEAT");
							if (!saveData()){return false;}
						}
					};
					
					var cancelLink = {
						text: $.rup.i18nParse($.rup.i18n.base,"rup_global.cancel"),
						btnType: $.rup.dialog.LINK,
						click: function () {
							if(!$.proxy($.jgrid.checkUpdates, $t)(extpost, function(){
								$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
							})) {return false;}
							$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
							return false;
						}
					};
					
					p.buttons = [saveButton, saveAndRepeatButton, cancelLink];
					p.onClose = function(){
						if(!$.proxy($.jgrid.checkUpdates, $t)(extpost, function(){
							$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
						})) {return false;}
						$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
						return false;
					};
					$.jgrid.createModal(IDs,tms,p,"#gview_"+$.jgrid.jqID($t.p.id),$("#gbox_"+$.jgrid.jqID($t.p.id))[0]);
					
					
					
					if (settings.formEdit.$detailFormDiv === undefined){
						settings.formEdit.$detailFormDiv = $("#"+$.jgrid.jqID(IDs.themodal));
					}
					
					/*
					 * Creacion rup_form
					 */
					
					if(rtlb) {
						$("#pData, #nData",frmtb+"_2").css("float","right");
						$(".EditButton",frmtb+"_2").css("text-align","left");
					}
					if(rp_ge[$t.p.id].topinfo) {$(".tinfo",frmtb).show();}
					if(rp_ge[$t.p.id].bottominfo) {$(".binfo",frmtb+"_2").show();}
					tms = null;bt=null;
					$("#"+$.jgrid.jqID(IDs.themodal)).keydown( function( e ) {
						var wkey = e.target;
						if ($("#"+frmgr).data("disabled")===true ) {return false;}//??
						if(rp_ge[$t.p.id].savekey[0] === true && e.which == rp_ge[$t.p.id].savekey[1]) { // save
							if(wkey.tagName != "TEXTAREA") {
								$("#sData", frmtb+"_2").trigger("click");
								return false;
							}
						}
						if(e.which === 27) {
/* DEL 						if(!checkUpdates()) {return false;} */
/* ADD */					if(!$.proxy($.jgrid.checkUpdates, $t)(extpost)) {return false;}
							if(cle)	{$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:p.gbox,jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});}
							return false;
						}
						if(rp_ge[$t.p.id].navkeys[0]===true) {
							if($("#id_g",frmtb).val() == "_empty") {return true;}
							if(e.which == rp_ge[$t.p.id].navkeys[1]){ //up
								$("#pData", frmtb+"_2").trigger("click");
								return false;
							}
							if(e.which == rp_ge[$t.p.id].navkeys[2]){ //down
								$("#nData", frmtb+"_2").trigger("click");
								return false;
							}
						}
					});
					if(p.checkOnUpdate) {
						$("a.ui-jqdialog-titlebar-close span","#"+$.jgrid.jqID(IDs.themodal)).removeClass("jqmClose");
						$("a.ui-jqdialog-titlebar-close","#"+$.jgrid.jqID(IDs.themodal)).unbind("click")
						.click(function(){
/* DEL 						if(!checkUpdates()) {return false;} */
/* ADD */					if(!$.proxy($.jgrid.checkUpdates, $t)(extpost)) {return false;}
							$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
							return false;
						});
					}
					p.saveicon = $.extend([true,"left","ui-icon-disk"],p.saveicon);
					p.closeicon = $.extend([true,"left","ui-icon-close"],p.closeicon);
					// beforeinitdata after creation of the form
					if(p.saveicon[0]===true) {
						$("#sData",frmtb+"_2").addClass(p.saveicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
						.append("<span class='ui-icon "+p.saveicon[2]+"'></span>");
					}
					if(p.closeicon[0]===true) {
						$("#cData",frmtb+"_2").addClass(p.closeicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
						.append("<span class='ui-icon "+p.closeicon[2]+"'></span>");
					}
//					if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {
//						bS  ="<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bYes+"</a>";
//						bN  ="<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bNo+"</a>";
//						bC  ="<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bExit+"</a>";
//						var zI = p.zIndex  || 999;zI ++;
//						$("<div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:"+zI+";display:none;'>&#160;"+"</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:"+(zI+1)+"'>"+p.saveData+"<br/><br/>"+bS+bN+bC+"</div>").insertAfter("#"+frmgr);
//						$("#sNew","#"+$.jgrid.jqID(IDs.themodal)).click(function(){
///* DEL						postIt(); */
///* ADD */					$.proxy($.jgrid.postIt, $t)(postdata, extpost, frmoper);
//							$("#"+frmgr).data("disabled",false);
//							$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).hide();
//							return false;
//						});
//						$("#nNew","#"+$.jgrid.jqID(IDs.themodal)).click(function(){
//							$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).hide();
//							$("#"+frmgr).data("disabled",false);
//							setTimeout(function(){$(":input","#"+frmgr)[0].focus();},0);
//							return false;
//						});
//						$("#cNew","#"+$.jgrid.jqID(IDs.themodal)).click(function(){
//							$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).hide();
//							$("#"+frmgr).data("disabled",false);
//							$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
//							return false;
//						});
//					}
					// here initform - only once
					$($t).triggerHandler("jqGridAddEditInitializeForm", [settings.formEdit.$detailForm, frmoper]);
					if(onInitializeForm) {onInitializeForm.call($t,settings.formEdit.$detailForm);}
					if(rowid=="_empty" || !rp_ge[$t.p.id].viewPagerButtons) {$("#pData,#nData",frmtb+"_2").hide();} else {$("#pData,#nData",frmtb+"_2").show();}
					$($t).triggerHandler("jqGridAddEditBeforeShowForm", [settings.formEdit.$detailForm, frmoper]);
					if(onBeforeShow) { onBeforeShow.call($t, settings.formEdit.$detailForm);}
					$("#"+$.jgrid.jqID(IDs.themodal)).data("onClose",rp_ge[$t.p.id].onClose);
					$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, overlay: p.overlay,modal:p.modal});
					if(!closeovrl) {
						$(".jqmOverlay").click(function(){
/* DEL 						if(!checkUpdates()) {return false;} */
/* ADD */					if(!$.proxy($.jgrid.checkUpdates, $t)(extpost)) {return false;}
							$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
							return false;
						});
					}
					$($t).triggerHandler("jqGridAddEditAfterShowForm", [settings.formEdit.$detailForm, frmoper]);
					if(onAfterShow) { onAfterShow.call($t, settings.formEdit.$detailForm); }
					$(".fm-button","#"+$.jgrid.jqID(IDs.themodal)).hover(
						function(){$(this).addClass('ui-state-hover');},
						function(){$(this).removeClass('ui-state-hover');}
					);
					
				}
				var posInit =$.proxy($.jgrid.getCurrPos, $t)();
				$self.rup_table("updateDetailPagination");
				$.proxy($.jgrid.updateNav, $t)(posInit[0],posInit[1].length-1);
			});
		}
	});
	
	$.fn.jqGrid.rup={};
	$.fn.jqGrid.rup.edit = {
			detail:{
				detailDivId: "detailDiv_",
				detailBodyId: "detailBody_",
				detailFormId: "detailForm_"
			},
			navigation:{
				forward:{
					id:"#nData"					
				},
				back:{
					id:"#pData"					
				}
			}
	};
	
})(jQuery);