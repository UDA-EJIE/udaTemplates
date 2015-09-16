<#-- 
 -- Copyright 2012 E.J.I.E., S.A.
 --
 -- Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
 -- Solo podrá usarse esta obra si se respeta la Licencia.
 -- Puede obtenerse una copia de la Licencia en
 --
 --      http://ec.europa.eu/idabc/eupl.html
 --
 -- Salvo cuando lo exija la legislación aplicable o se acuerde por escrito, 
 -- el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
 -- SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 -- Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
 -- que establece la Licencia.
 -->
body {
	margin: 0;
	padding: 0;
	background: #efefef;
	font-family:Arial, Helvetica, sans-serif;
	font-size: 73%;
	color: #666666;
}

div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,body,html,p,blockquote,fieldset,input {margin:0; padding:0}
a img,:link img,:visited img,form,fieldset {border:none}

/* Hx */
h1 { font-size:2.2em; color:#000000; display:block; margin:0 0 0.5em 0; padding:0 0 0.3em 0; border-bottom:1px solid #cccccc;width: 100%}
h2 { font-size:1.8em; color:#000000; display:block; margin:1.5em 0 0 0; padding:0; }
h3 { font-size:1.4em; color:#555555; display:block; margin:1.5em 0 0.5em 0; padding:0; }

/* Parrafo */
p { color:#000000; line-height:1.7em; margin:0; }

/* Input deshabilitado */
input.disabled { background-color: #D3D3D3; }

/* GENERALES */
.contenedor { 
	width:90%; 
	margin:0 auto; 
	padding: 2em; 
	background:#FFF;  
}
.cabecera {
	margin-bottom: 2em;
	width: 100%;
}
.menu {
	margin-top: 1em; 
	margin-bottom: 1em;
}
.footer {
	border-top:1px solid #DADADA;
	clear:both;
	color:#000000;
	font-size:0.9em;
	margin:2em 0 0;
	padding:0.7em;
	padding-bottom: 0em;
}
.footer a {
	color:#000;
}

/** FEEDBACK **/
.feedbackImgPruebas {
	background-image: url("../images/feedbackImgPruebas.png");
	background-repeat: no-repeat;
	background-position: 8px 12px;
	padding-bottom:1em;
	padding-left:4.5em;
	padding-right:0.5em;
	padding-top:1em;
}

/*Posicionamiento a la derecha de los botones*/
.right_buttons{ 
	text-align:right;
	margin-bottom:5px;
}

.formulario_legend { 
	color:#000000 !important; 
	font-size:1.2em;
}

.formulario_columna_cnt {
	color:#666666; 
	float:left; 
	width:99%;
}
.formulario_linea_izda_float { 
	margin-top: 1em;
	margin-left: 2em;
	margin-right: 2em;
	float:left;
}
.formulario_linea_label { 
	float: left;
	width: 8em;
}
.formulario_linea_input { 
	border:0.1em solid #D1D1D1;
	color:#666666;
	/*font-size:1.2em;*/ 
	font-size:100%;
	/*width: 15em; */
}
.floating_left_pad_right {
	float:left;
	padding-right:10px;
	font-family:Verdana,Arial,Helvetica,sans-serif;	
	font-size:11px;
	text-align:left;
	margin-top:5px;
}

.ui-state-highlight, .ui-widget-content .ui-state-highlight, .ui-widget-header .ui-state-highlight {
	background: url("../../rup/custom-theme/images/ui-bg_glass_55_fffeda_1x400.png") repeat-x scroll 50% 50% #FFFEDA;
    border: 1px solid #AAAAAA;
}

a.ui-selectmenu { text-decoration: none; color: black }