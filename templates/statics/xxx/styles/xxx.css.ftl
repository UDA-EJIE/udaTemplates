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

footer {
	clear: both;
	vertical-align: baseline;
	background: #69a3d6;
	color: #ffffff;
	height: 2em;
	margin-top: 1em;
	padding-top: 0.2em;
}

@media ( max-width : 767px) {
	footer {
		padding-left: 0em;
		padding-right: 0em;
	}
}

footer .footer-informacion-legal {
	float: left;
}

footer .footer-ejgv {
	float: right;
}

footer .footer-row-1 {
	clear: both;
	background: #69a3d6;
	padding: 0rem 2rem;
	line-height: 3rem;
	height: 3rem;
}

footer .footer-row-2 {
	background: url('../images/web01-2014_oina_logo_atzekoa.gif') no-repeat
		left bottom #1f1f1f;
	clear: both;
	text-align: center;
	height: 15rem;
	padding-top: 2rem;
}

/*************/
/* RUP NAVBAR */
/**************/

/** CONTAINER */
.content {
	margin: 1rem;
	clear: both;
	background: #ffffff;
	display: block;
	padding: 2rem;
}

@media ( max-width : 767px) {
	.content {
		margin: 0em;
	}
}

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