header {
	background-color: #ffffff;
	height: 0px;
	overflow: hidden;
	position: relative;
	z-index: 99;
}

header div.cabecera>a {
	padding-top: 1.3em;
	padding-right: 1em;
}

@media ( min-width : 768px) {
	header {
		height: 6em;
	}
}

/*************/
/* RUP NAVBAR */
/**************/

/** CONTAINER */
section>h1, section>h2, section>h3, section>h4, section>h5, section>h6 {
	margin-top: 2rem;
	margin-bottom: 1rem;
}

#rwdExampleSection {
	background-color: #eaeaea;
}

#rwdExample div.row>div>p {
	background-color: #fff;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	padding: 1em;
}

/* FORMULARIOS */
.formulario_legend {
    color: #000000 !important;
    font-size: 0.96em;
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
.formulario_linea_input:not(.ui-selectmenu-menu) {
	border:0.1em solid #D1D1D1;
	color:#666666;
	font-size:100%;
	height: 16px;
}
.formulario_required {
    color: #FF0000;
}
.floating_left_pad_right {
	float:left;
	padding-right:10px;
	font-family:Arial,Verdana,Helvetica,sans-serif;	
	font-size:11px;
	text-align:left;
	margin-top:5px;
}

.ui-state-highlight, .ui-widget-content .ui-state-highlight, .ui-widget-header .ui-state-highlight {
	background: url("../../rup/custom-theme/images/ui-bg_glass_55_fffeda_1x400.png") repeat-x scroll 50% 50% #FFFEDA;
    border: 1px solid #AAAAAA;
}

a.ui-selectmenu { text-decoration: none; color: black }