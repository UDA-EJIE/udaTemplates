<h1>Combo Enlazado Multiple</h1>

<div id=local style="float: left;">
	<h2>Local</h2>
	<div style="margin-left:1.5em;">
		<h3><label for="departamento">Departamento</label></h3>
		<select id="departamento" class="rup-combo"></select>

		<h3><label for="provincia">Provincia</label></h3>
		<select id="provincia" class="rup-combo"></select>

		<h3><label for="dptoProv">Departamento-Provincia</label></h3>
		<select id="dptoProv" class="rup-combo"></select>
	</div>
</div>

<div id=remote style="float: left; margin-left: 4em;">
	<h2>Remoto</h2>
	<div style="margin-left:1.5em;">
		<h3><label for="departamentoRemote">Departamento</label></h3>
		<select id="departamentoRemote" name="departamento.code" class="rup-combo"></select>

		<h3><label for="provinciaRemote">Provincia</label></h3>
		<select id="provinciaRemote" name="provincia.code" class="rup-combo"></select>

		<h3><label for="dptoProvRemote">Departamento-Provincia</label></h3>
		<select id="dptoProvRemote" class="rup-combo"></select>
	</div>		
</div>

<div id=mixto style="float: left; margin-left: 4em;">
	<h2>Mixto I</h2>
	<div style="margin-left:1.5em;">
		<h3><label for="mixto_departamentoRemote">Departamento (remoto)</label></h3>
		<select id="mixto_departamentoRemote" name="departamento.code" class="rup-combo"></select>
		
		<h3><label for="mixto_provincia">Provincia (local)</label></h3>
		<select id="mixto_provincia" name="provincia.code" class="rup-combo"></select>
		
		<h3><label for="mixto_dptoProvRemote">Departamento-Provincia (remoto)</label></h3>
		<select id="mixto_dptoProvRemote" class="rup-combo"></select>
	</div>
</div>

<div id=mixto2 style="margin-left: 70em; margin-bottom: 3em;">
	<h2>Mixto II</h2>
	<div style="margin-left:1.5em;">
		<h3><label for="mixto2_departamento">Departamento (local)</label></h3>
		<select id="mixto2_departamento" class="rup-combo"></select>
		
		<h3><label for="mixto2_provinciaRemote">Provincia (remoto)</label></h3>
		<select id="mixto2_provinciaRemote" class="rup-combo"></select>
		
		<h3><label for="mixto2_dptoProv">Departamento-Provincia (local)</label></h3>
		<select id="mixto2_dptoProv" class="rup-combo"></select>
	</div>
</div>