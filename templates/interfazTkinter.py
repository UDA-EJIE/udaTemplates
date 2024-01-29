import tkinter as tk
from tkinter import ttk, filedialog
import yaml
from pathlib import Path
from copier import Worker
import os


def toggle_textbox():
    if use_default_location.get():
        entry_location.config(state=tk.DISABLED)
    else:
        entry_location.config(state=tk.NORMAL)

def update_default_language_options():
    selected_languages = [lang_option for lang_option, lang_var in zip(language_options, language_vars) if lang_var.get()]
    default_language_combobox['values'] = selected_languages
    default_language_combobox.set(selected_languages[0] if selected_languages else "")


def save_to_yaml():
    data = {
        "i18n_app": [lang_option for lang_option, lang_var in zip(language_options, language_vars) if lang_var.get()],
        "i18n_default_app": default_language_var.get(),
        "project_name": entry_code.get(),
        "security_app": security_var.get(),
        "war_project_name": entry_war.get()
    }

    with open("respuestas_paso1.yml", "w") as yaml_file:
        yaml.dump(data, yaml_file, default_flow_style=False)
    
    

    # Añadir la lógica para copiar archivos
    src_path = str(Path("C:/Users/mllorente/Desktop/Entornos_UDA/workspaces/workspace_2020_v4/udaTemplates/templates"))
    dst_path = "C:/Users/mllorente/Desktop/ProyectoBueno"

    # Obtener la ruta del archivo actual (script o módulo)
    ruta_archivo_actual = __file__

    # Obtener el directorio que contiene el archivo
    directorio_actual = os.path.dirname(ruta_archivo_actual)

    print("Ruta del archivo actual:", ruta_archivo_actual)
    print("Directorio actual:", directorio_actual)
    print("esto es la aaaa", entry_location.get())

    with open("respuestas_paso1.yml", "r") as file:
        yaml_data = yaml.safe_load(file)
        print(yaml_data)
    
    with Worker(src_path=directorio_actual, dst_path=entry_location.get(), data=yaml_data) as worker:
        worker.run_copy()
      
def browse_location():
    folder_selected = filedialog.askdirectory()
    entry_location.delete(0, tk.END)
    entry_location.insert(0, folder_selected)


root = tk.Tk()
root.title("Crear nueva aplicación")
root.geometry("600x700")  # Ajusta las dimensiones de la ventana según tus necesidades

# Configurar la expansión de la última columna
root.columnconfigure(1, weight=1)

# Descripción
description_label = ttk.Label(root, text="Este Wizard genera la estructura necesaria para desarrollar una aplicación estándar", font=('Arial', 10))
description_label.grid(row=0, column=0, columnspan=3, pady=(10, 5), padx=20, sticky=tk.W)

# Código de aplicación
code_label = ttk.Label(root, text="Código de aplicación:")
code_label.grid(row=1, column=0, sticky=tk.W, padx=(20, 10), pady=(5, 2))
entry_code = ttk.Entry(root)
entry_code.grid(row=1, column=1, padx=(0, 20), pady=(5, 2), sticky=tk.EW)

# Usar localización por defecto
use_default_location = tk.BooleanVar()
location_checkbox = ttk.Checkbutton(root, text="Usar localización por defecto", variable=use_default_location, command=toggle_textbox)
location_checkbox.grid(row=2, column=0, columnspan=2, pady=(5, 2), padx=20, sticky=tk.W)

localizacion_label = ttk.Label(root, text="Localización:")
localizacion_label.grid(row=3, column=0, sticky=tk.W, padx=(20, 10), pady=(5, 2))
entry_location = ttk.Entry(root, state=tk.DISABLED)
entry_location.grid(row=3, column=1, pady=(5, 2), padx=20, sticky=tk.EW)

location_button = ttk.Button(root, text="Explorar", command=browse_location)
location_button.grid(row=3, column=2, pady=(5, 2), padx=5)

# Nombre del WAR
war_label = ttk.Label(root, text="Nombre del WAR:")
war_label.grid(row=4, column=0, sticky=tk.W, padx=(20, 10), pady=(5, 2))
entry_war = ttk.Entry(root)
entry_war.grid(row=4, column=1, padx=(0, 20), pady=(5, 2), sticky=tk.EW)

# Contenedor de idiomas
languages_frame = ttk.LabelFrame(root, text="Idiomas")
languages_frame.grid(row=5, column=0, columnspan=2, pady=10, padx=20, sticky=tk.EW)

language_options = ["Castellano", "Euskera", "Inglés", "Francés"]
language_vars = [tk.BooleanVar() for _ in language_options]
for i, (lang_option, lang_var) in enumerate(zip(language_options, language_vars)):
    ttk.Checkbutton(languages_frame, text=lang_option, variable=lang_var, command=update_default_language_options).grid(row=0, column=i, padx=5, pady=(5, 2), sticky=tk.W)

# Idioma por defecto
default_language_label = ttk.Label(root, text="Idioma por defecto:")
default_language_label.grid(row=6, column=0, sticky=tk.W, padx=(20, 10), pady=(5, 2))
default_language_var = tk.StringVar()
default_language_combobox = ttk.Combobox(root, textvariable=default_language_var)
default_language_combobox.grid(row=6, column=1, padx=(0, 20), pady=(5, 2), sticky=tk.EW)

# Contenedor de seguridad con XLNets
security_frame = ttk.LabelFrame(root, text="Seguridad con XLNets")
security_frame.grid(row=7, column=0, columnspan=2, pady=10, padx=20, sticky=tk.EW)

security_var = tk.StringVar(value="No")
security_yes_radio = ttk.Radiobutton(security_frame, text="Sí", value="Si", variable=security_var)
security_yes_radio.grid(row=0, column=0, padx=5, pady=(5, 2), sticky=tk.W)
security_no_radio = ttk.Radiobutton(security_frame, text="No", value="No", variable=security_var)
security_no_radio.grid(row=0, column=1, padx=5, pady=(5, 2), sticky=tk.W)

# Botones en la parte inferior
finish_button = ttk.Button(root, text="Finish", command=save_to_yaml)
finish_button.grid(row=11, column=0, pady=(20, 10), padx=20, sticky=tk.W)

cancel_button = ttk.Button(root, text="Cancelar", command=root.destroy)
cancel_button.grid(row=11, column=1, pady=(20, 10), padx=20, sticky=tk.E)

root.mainloop()