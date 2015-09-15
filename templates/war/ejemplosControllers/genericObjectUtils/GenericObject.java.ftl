package com.ejie.${codapp}.control.ejemplos.genericObjectUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.util.StringUtils;

import com.ejie.x38.util.StaticsContainer;


public class GenericObject {

	/**
	 * Constructor
	 */
	public GenericObject() {
		super();
		this.entidades = new HashMap<String, Object>();
		this.data = new HashMap<String, String>();
	}

	/**
	 * Atributtes
	 */
	private Map<String, Object> entidades;
	private Map<String, String> data;
	
	
	@SuppressWarnings("unchecked")
	public void setEntidades(List<Object> entidades) {
		try {
			for (Object entidad : entidades) {
				String nombreEntidad = ((LinkedHashMap<String, Object>) entidad).keySet().iterator().next();
				Object pojo = PojoMapper.fromJson(
								//Obtener el JSON del objeto compuesto de cada entidad (no sirve un .toString() ya que devuelve texto no JSON)
								PojoMapper.toJson((((LinkedHashMap<String, Object>) entidad).get(nombreEntidad)), false), 
								//Se obtiene la referencia a la clase de la entidad
								Class.forName(StaticsContainer.modelPackageName  + StringUtils.capitalize(nombreEntidad)));
				this.entidades.put(nombreEntidad, pojo);
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	public Map<String, Object> getEntidades() {
		return this.entidades;
	}


	public Map<String, String> getData() {
		return data;
	}
	public void setData(Map<String, String> data) {
		this.data = data;
	}
}