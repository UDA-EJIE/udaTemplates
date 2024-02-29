import tkinter as tk
from tkinter import ttk
import yaml
import copier as co

from pathlib import Path
from copier import Worker


def guardar_formulario():
 # Declare these variables as global
    global codigo_aplicacion_var, usar_localizacion_var, nombre_war_var, idiomas_var
    global idioma_por_defecto_var, seguridad_xlnets_var, ejb_app_var, ejb_project_name_var

    seguridad_xlnets = seguridad_xlnets_var.get()
    if seguridad_xlnets not in ["Sí", "No"]:
        print("Error: La opción de seguridad con XLNets debe ser 'Sí' o 'No'.")
        return
    
    datos_formulario = {
        "project_name": codigo_aplicacion_var.get(),
        "war_project_name": nombre_war_var.get(),
        "layout_app_type": "Intranet/Extranet/JASO" if usar_localizacion_var.get() else "Internet",
        "layout_app_category": "Horizontal",
        "i18n_app": [idioma for i, idioma in enumerate(["Castellano", "Euskera", "Inglés", "Francés"]) if idiomas_var[i].get()],
        "i18n_default_app": idioma_por_defecto_var.get(),
        "security_app": seguridad_xlnets_var.get(),
        "ejb_app": "Sí" if ejb_app_var.get() else "No",
        "ejb_project_name": ejb_project_name_var.get() if ejb_app_var.get() else None
    }

    # Guardar los datos en un archivo YAML temporal
    with open("respuestas_paso1.yml", "w") as file:      
        yaml.dump(datos_formulario, file)


    # Utilizar copier para llenar la plantilla con las respuestas
        
    src_path = str(Path("C:/Users/mllorente/Desktop/Entornos_UDA/workspaces/workspace_2020_v5/udaTemplates/templates"))
    dst_path = "C:/Users/mllorente/Desktop/Entornos_UDA/workspaces/workspace_2020_v5/udaTemplates/templates"
   
    with open("respuestas_paso1.yml", "r") as file:
        yaml_data = yaml.safe_load(file)
        print(yaml_data)
    with Worker(src_path=src_path, dst_path=Path(dst_path), data=yaml_data) as worker:
         worker.run_copy()

    print("Formulario guardado:")
    print(yaml.dump(datos_formulario))

# Crear la ventana principal
ventana = tk.Tk()
ventana.title("Formulario")


# Variables and widgets for the form
codigo_aplicacion_var = tk.StringVar()
usar_localizacion_var = tk.BooleanVar()
nombre_war_var = tk.StringVar()
idiomas_var = [tk.BooleanVar() for _ in range(4)]
idioma_por_defecto_var = tk.StringVar(value="Castellano")
seguridad_xlnets_var = tk.StringVar()
ejb_app_var = tk.BooleanVar()
ejb_project_name_var = tk.StringVar()

# Estilo para mejorar la apariencia
style = ttk.Style()
style.configure('TFrame', background='#E8E8E8')
style.configure('TLabel', background='#E8E8E8', font=('Arial', 12))
style.configure('TButton', background='#4CAF50', foreground='#FFFFFF', font=('Arial', 12))

# Variables de control
codigo_aplicacion_var = tk.StringVar()
usar_localizacion_var = tk.BooleanVar()
nombre_war_var = tk.StringVar()
idiomas_var = [tk.BooleanVar() for _ in range(4)]
idioma_por_defecto_var = tk.StringVar(value="Castellano")
seguridad_xlnets_var = tk.StringVar()

# Crear marco para organizar los elementos
marco = ttk.Frame(ventana, padding=(20, 10))
marco.grid(row=0, column=0, sticky="nsew")

# Crear widgets con estilo mejorado
label_codigo_aplicacion = ttk.Label(marco, text="Código de aplicación:")
entry_codigo_aplicacion = ttk.Entry(marco, textvariable=codigo_aplicacion_var)

checkbox_usar_localizacion = ttk.Checkbutton(marco, text="Usar localización por defecto", variable=usar_localizacion_var)

label_nombre_war = ttk.Label(marco, text="Nombre del WAR:")
entry_nombre_war = ttk.Entry(marco, textvariable=nombre_war_var)

label_idiomas = ttk.Label(marco, text="Idiomas:")
checkbox_castellano = ttk.Checkbutton(marco, text="Castellano", variable=idiomas_var[0])
checkbox_euskera = ttk.Checkbutton(marco, text="Euskera", variable=idiomas_var[1])
checkbox_ingles = ttk.Checkbutton(marco, text="Ingles", variable=idiomas_var[2])
checkbox_frances = ttk.Checkbutton(marco, text="Frances", variable=idiomas_var[3])

label_idioma_por_defecto = ttk.Label(marco, text="Idioma por defecto:")
opciones_idiomas = ["Castellano", "Euskera", "Ingles", "Frances"]
combo_idioma_por_defecto = ttk.Combobox(marco, values=opciones_idiomas, textvariable=idioma_por_defecto_var)

label_seguridad_xlnets = ttk.Label(marco, text="Seguridad con XLNets:")
radio_si = ttk.Radiobutton(marco, text="Si", variable=seguridad_xlnets_var, value="Sí")
radio_no = ttk.Radiobutton(marco, text="No", variable=seguridad_xlnets_var, value="No")

boton_guardar = ttk.Button(marco, text="Guardar", command=guardar_formulario)

# Organizar widgets en el marco
label_codigo_aplicacion.grid(row=0, column=0, padx=10, pady=5, sticky=tk.W)
entry_codigo_aplicacion.grid(row=0, column=1, padx=10, pady=5, sticky=tk.W)

checkbox_usar_localizacion.grid(row=1, column=0, columnspan=2, pady=5, sticky=tk.W)

label_nombre_war.grid(row=2, column=0, padx=10, pady=5, sticky=tk.W)
entry_nombre_war.grid(row=2, column=1, padx=10, pady=5, sticky=tk.W)

label_idiomas.grid(row=3, column=0, padx=10, pady=5, sticky=tk.W)
checkbox_castellano.grid(row=4, column=0, padx=10, pady=5, sticky=tk.W)
checkbox_euskera.grid(row=4, column=1, padx=10, pady=5, sticky=tk.W)
checkbox_ingles.grid(row=5, column=0, padx=10, pady=5, sticky=tk.W)
checkbox_frances.grid(row=5, column=1, padx=10, pady=5, sticky=tk.W)

label_idioma_por_defecto.grid(row=6, column=0, padx=10, pady=5, sticky=tk.W)
combo_idioma_por_defecto.grid(row=6, column=1, padx=10, pady=5, sticky=tk.W)

label_seguridad_xlnets.grid(row=7, column=0, padx=10, pady=5, sticky=tk.W)
radio_si.grid(row=8, column=0, padx=10, pady=5, sticky=tk.W)
radio_no.grid(row=8, column=1, padx=10, pady=5, sticky=tk.W)

boton_guardar.grid(row=9, column=0, columnspan=2, pady=10)

# Configurar el marco para que se expanda con la ventana
ventana.columnconfigure(0, weight=1)
ventana.rowconfigure(0, weight=1)

# Iniciar el bucle principal
ventana.mainloop()