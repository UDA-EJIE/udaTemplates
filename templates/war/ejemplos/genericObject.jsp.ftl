<br><br>
<div id=response></div>

<script src="http://localhost:7001/${codapp}Statics/rup/scripts/core/jquery-1.4.4.js" type="text/javascript"></script> 
<script type="text/javascript">
jQuery(document).ready(function(){
	
	var data = {};
	data["entidades"]= [
		{"departamentoProvincia": { 
			"provincia": {"code":"1"},
			"departamento": {"code":"1"}
		}}
	];
	data["data"] = { "label":"code", "value":"desc_es", "style":"css" };
	data = $.toJSON(data);

	$.ajax({
		url: "/${warName}/genericObject/envio", 
		dataType:'json',
		contentType: 'application/json', 
		type:'POST', 
		data: data,
		success: function(data, textStatus, XMLHttpRequest){
			for (key in data) {
				$("#response").append("<label>"+data[key]["label"]+"</label> [<label>"+data[key]["value"]+"</label>]");
			}
  		},
  		error: function(XMLHttpRequest, textStatus, errorThrown){
			$.rup.errorGestor("Se ha producido un error en la prueba");
  		} 
	});
});
</script>