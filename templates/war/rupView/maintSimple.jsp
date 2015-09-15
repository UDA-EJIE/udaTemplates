<h1>Mantenimiento (Selecci&oacute;n simple)</h1>
	<div id="error" style="display:none"></div>
	<div id="EJIE_MAINT_persona">
		<!-- Botonera de gestion de la tabla -->	
		<div id="EJIE_TOOLBAR_persona" class="botonera"></div>

		<div id="contenido" style="margin-top:0.5em;margin-bottom:0.5em;width:600px;">
		<form id="searchForm" >
			<div  class="formulario_legend" id="titleSearch_persona">Criterios de busqueda:</div>
			<fieldset style="border:1px solid #DADADA;" id="FIELDSET_SEARCH_persona">	
					<!--  Columna izquierda -->
					<div class="formulario_columna_cnt">
						<div class="formulario_linea_izda_float">
							<div class="formulario_linea_label">Orden Id:</div>
							<input type="text" name="orderid" class="formulario_linea_input required" maxlength="20" id="orderid_search" tabindex="1" />
						</div>
						<div class="formulario_linea_izda_float">
							<div class="formulario_linea_label">Lugar de Envio:</div>
							<input type="text" name="shipmentinfo" class="formulario_linea_input required" maxlength="255" id="shipmentinfo_search" tabindex="2" />
						</div>
						<div class="formulario_linea_izda_float">
							<div class="formulario_linea_label">Estado:</div>
							<select name="status" class="formulario_linea_input required" id="status_search" tabindex="3">
								<option value="S">Enviado</option>
								<option value="N">Pendiente</option>
							</select>
						</div>
						<!--  div class="formulario_linea_izda_float">
							<div class="formulario_linea_label">Descuento:</div>
							<input type="text" name="discount" class="formulario_linea_input required" maxlength="255" id="discount_search" tabindex="2" />
						</div-->
						<!-- div class="formulario_linea_izda_float">
							<div class="formulario_linea_label">Ultima actu:</div>
							<input type="text" name="lastupdate" class="formulario_linea_input required" maxlength="255" id="lastupdate_search" tabindex="2" />
						</div-->
						<!-- button id="launch" >launch</button-->
					</div>
					<!-- Botones -->	
			</fieldset>
			</form>
		
		</div>
		<div id="RUP_GRID_persona">		
			<!-- Barra de mensajes -->
			<div id="feedbackTabla"></div>
			<!-- Tabla -->
			<table id="GRID_persona" cellpadding="0" cellspacing="0"></table>
			<!-- Barra de paginacion -->
			<div id="pager" style="text-align:center;"></div>
		</div>
<!-- div id="detailDiv"-->

<div id="detailBody" style="padding-top: 0.6em;display:none;" title="Detalle de la orden">
	<form id="detailForm_persona">
		<div id="pp" class="floating_left_pad_right">
			<label for="orderid">ID Pedido</label><br>
			<input type="text" size="10" maxlength="8" id="orderid" name="orderid" role="textbox" class="formulario_linea_input required numeric">
		</div>
		<div id="pp" class="floating_left_pad_right">
			<label for="shipmentinfo">Lugar de Envio</label><br>
			<input type="text" size="40" maxlength="40" id="shipmentinfo" name="shipmentinfo" role="textbox" class="formulario_linea_input required validableElem">
		</div>
		<div id="pp" class="floating_left_pad_right">
			<label for="status">Estado</label><br>
				<select role="select" size="1" maxlength="1" id="status" name="status" class="formulario_linea_input required">
					<option role="option" value="N">Pendiente</option>
					<option role="option" value="S">Enviado</option>
				</select>
		</div>
		<div id="pp" class="floating_left_pad_right">
			<label for="lastupdate">Ultima actualizacion</label><br>
			<input type="text" size="14" maxlength="10" id="lastupdate"	name="lastupdate" role="textbox" class="formulario_linea_input required datepicker">
		</div>
		<div id="pp" class="floating_left_pad_right">
			<label for="discount">Descuento</label><br>
			<input type="text" size="20" maxlength="20" id="discount" name="discount" role="textbox" class="formulario_linea_input required numeric">
		</div>
	</form>
</div>
</div>