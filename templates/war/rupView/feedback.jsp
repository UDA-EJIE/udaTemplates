<h1>Feedback</h1>
<hr>
Texto pre capa
<div id=feedback></div>
Texto post capa<br>
<hr>

<table id="feedback_table">
	<tr>
		<td colspan="2">Valores feedback:</td>
	</tr>
	<tr>
		<td style="width: 110px">type:</td>
		<td>
			<select id=feedback_type >
				<option value="">---</option>
				<option value="ok" selected>ok</option>
				<option value="alert">alert</option>
				<option value="error">error</option>
			</select>
		</td>
	</tr>
	<tr>
		<td>imgClass:</td>
		<td><input id=feedback_imgClass type=text /> (feedbackImgPruebas) </td>
	</tr>
	<tr>
		<td>delay (ms):</td><td><input id=feedback_delay type=text /></td>
	</tr>
	<tr>
		<td>fadeSpeed (ms):</td><td><input id=feedback_fadeSpeed type=text /></td>
	</tr>
	<tr>
		<td>gotoTop:</td>
		<td>
			<select id=feedback_gotoTop>
				<option value="true">true</option>
				<option value="false">false</option>
			</select>
		</td>
	</tr>
	<tr>
		<td>block:</td>
		<td>
			<select id=feedback_block>
				<option value=true>true</option>
				<option value=false>false</option>
			</select>
		</td>
	</tr>
	<tr>
		<td>closeLink:</td>
		<td>
			<select id=feedback_closeLink>
				<option value=true>true</option>
				<option value=false>false</option>
			</select>
		</td>
	</tr>
</table>
				
<input id=boton_create type=button value=_Create />
<input id=boton_destroy type=button value=Destroy disabled />
<input id=boton_set type=button value=Set />
<input id=boton_setOptions type=button value=Set_options />
<input id=boton_setType type=button value=Set_type />
<input id=boton_setImgClass type=button value=Set_imgClass />
<input id=boton_hide type=button  value=Hide />
<input id=boton_close type=button value=Close />
<input id=boton_show type=button value=Show />
