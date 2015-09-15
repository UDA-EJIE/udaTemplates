<h1>Grid</h1>		
	<div id="idDialog" style="display:none">Esto es una prueba de un diologo con texto dentro de el.</div>
	<div id="grid">
		<table id="GRID_persona" cellpadding="0" cellspacing="0"></table>
		<div id="pager" style="text-align:center;"></div>
	</div>
	<div style="margin-top:20px">
		
		<div>
			<table width="100%">
				<tr>
					<td width="" style="width: 81px; ">ID Pedido:</td>
					<td><input type="text" name="orderid" maxlength="20" id="orderid_add" tabindex="1" /></td>
				</tr>
				<tr>
					<td width="" style="width: 137px; ">Lugar de Envio</td>
					<td><input type="text" name="shipmentinfo" maxlength="255" id="shipmentinfo_add" tabindex="1" /></td>
				</tr>
				<tr>
					<td width="" style="width: 81px; ">Estado:</td>
					<td>
						<select name="status" class="formulario_linea_input required" id="status_add" tabindex="3">
								<option value="S">Enviado</option>
								<option value="N">Pendiente</option>
						</select>
					</td>
				</tr>
				<tr>
					<td width="" style="width: 81px; ">Descuento:</td>
					<td><input type="text" name="discount" maxlength="255" id="discount_add" tabindex="1" /></td>
				</tr>
				<tr>
					<td width="" style="width: 81px; ">Ultima actu:</td>
					<td><input type="text" name="lastupdate" maxlength="255" id="lastupdate_add" tabindex="1" /></td>
				</tr>
			</table>
			<button id="btnInsertar">Insertar Fila</button>
			<button id="btnEditar">Asignar valoresa a la fila seleccionada</button>
			<button id="btnSel">Obtener Seleccionados</button>
		</div>
		<div style="margin-top:12px">
		<button id="btnBorrar">Eliminar Fila</button>
		<button id="btnReload">Recargar Grid</button>
		</div>		
	</div>
