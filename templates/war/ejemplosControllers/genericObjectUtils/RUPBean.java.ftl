package com.ejie.${codapp}.control.ejemplos.genericObjectUtils;

import java.lang.reflect.InvocationTargetException;

import org.springframework.util.StringUtils;

public class RUPBean {

	private String value;
	private String label;
	private String style;
	
//UTILS
	public static String parseColumn(String column){ //CamelCase y parsear '_'
		column = column.toLowerCase();
		int index;
		while (column.indexOf('_')!=-1){
			index = column.indexOf('_');
			column = new StringBuffer(column.substring(0,index)).append(column.substring(index+1,index+2).toUpperCase()).append(column.substring(index+2)).toString();
		}
		return StringUtils.capitalize(column);
	}
////////
	
	public RUPBean() {
	}
	
	public RUPBean(Object datos, Object obj){
		
		try {
			
			//Clase de la entidad para introspección
			Class<?> cls = datos.getClass();
			
			//Obtener nombres columnas de BD (presentacion) [Parsear nombres para pasar a CamelCase y evitar '-']
			String column_value = RUPBean.parseColumn((String)cls.getMethod("getValue").invoke(datos));
			String column_label = RUPBean.parseColumn((String)cls.getMethod("getLabel").invoke(datos));
			String column_style = RUPBean.parseColumn((String)cls.getMethod("getStyle").invoke(datos));
			
//			System.out.println("column_value:"+column_value);
//			System.out.println("column_label:"+column_label);
//			System.out.println("column_style:"+column_style);
			
			//Obtener datos en BD a mostrar en pantalla  
			Object value = cls.getMethod("get"+column_value).invoke(obj);
			Object label = cls.getMethod("get"+column_label).invoke(obj);
			Object style = cls.getMethod("get"+column_style).invoke(obj);
			
//			System.out.println("value_0:"+value);
//			System.out.println("label_0:"+label);
//			System.out.println("style_0:"+style);
			
			//Evitar valores nulos
			value = value==null?"":value;
			label = label==null?"":label;
			style = style==null?"":style;
			
//			System.out.println("value_1:"+value);
//			System.out.println("label_1:"+label);
//			System.out.println("style_1:"+style);
			
			//Castear los datos obtenidos de BD usando el tipo de las columnas de BD accedidas [Parsear nombres a nomenclatura de campos Java] 
			this.value = cls.getDeclaredField(StringUtils.uncapitalize(column_value)).getType().cast(value).toString();
			this.label = cls.getDeclaredField(StringUtils.uncapitalize(column_label)).getType().cast(label).toString();
			this.style = cls.getDeclaredField(StringUtils.uncapitalize(column_style)).getType().cast(style).toString();
			
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		}
	}

	public RUPBean(String value, String label, String style) {
		super();
		this.value = value;
		this.label = label;
		this.style = style;
	}
	
	public String getValue() {
		return value;
	}
	
	public void setValue(String value) {
		this.value = value;
	}
	
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}


	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	@Override
	public String toString() {
		return this.label + "-" + this.value + "-"
				+ this.style;
	}

}
