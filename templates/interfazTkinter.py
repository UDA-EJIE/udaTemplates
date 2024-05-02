from customtkinter import *
import yaml
from pathlib import Path
import os
import yaml
from copier import Worker
import tkinter as tk
import logging



def toggle_textbox():# check localización por defecto
    if use_default_location.get():
        entry_location.configure(text_color="grey")
        entry_location.delete(0, "end")
        entry_location.insert(0, os.getcwd())
        entry_location.configure(state="disabled")
        location_button.configure(state="disabled")
    else:
        entry_location.configure(state="normal")
        location_button.configure(state="normal")
        entry_location.configure(text_color="black")

def update_default_language_options():
    idiomas_seleccionados = []
        # Iterar sobre los checkbox y agregar los idiomas seleccionados a la lista
    for lang_option, lang_var in zip(language_options, language_vars):
        if lang_var.get():
            idiomas_seleccionados.append(lang_option)
    default_language_combobox = CTkComboBox(idiomas_inner_frame, values= idiomas_seleccionados)
    default_language_combobox.grid(row=7, column=1, padx=(0, 20), pady=(25, 2), sticky="ew")
    default_language_combobox.set(idiomas_seleccionados[0] if idiomas_seleccionados else "")
    default_language_combobox._values = idiomas_seleccionados
    

def save_to_yaml():

    if(entry_code.get() == ''):
        configuration_warning.configure(text="Campo 'Código de aplicación' obligatorio")
        return FALSE
    if(entry_war.get() == ''):
        configuration_warning.configure(text="Campo 'Nombre del WAR' obligatorio")
        return FALSE
    configuration_warning.configure(text="")
    yaml_data = {
        "i18n_app": [lang_option for lang_option, lang_var in zip(language_options, language_vars) if lang_var.get()],
        "i18n_default_app": default_language_var.get(),
        "project_name": entry_code.get(),
        "security_app": security_var.get(),
        "war_project_name": entry_war.get()
    }


    ruta_archivo_actual = __file__
    directorio_actual = os.path.dirname(ruta_archivo_actual) + "\\proyecto"
    
    with Worker(src_path=directorio_actual, dst_path=entry_location.get(), data=yaml_data) as worker:
        logging.info('Inicio: Crear proyecto: ' + yaml_data["project_name"]+yaml_data["war_project_name"])
        worker.run_copy()
        logging.info('Fin: Crear proyecto: ' + yaml_data["project_name"]+yaml_data["war_project_name"])
        print('Fin: proyecto Creado: ' + yaml_data["project_name"]+yaml_data["war_project_name"])
      
def browse_location():
    folder_selected = filedialog.askdirectory()
    if not folder_selected == '':
        entry_location.delete(0, "end")
        entry_location.insert(0, folder_selected)

root = CTk()
root.title("Crear nueva aplicación")
root.geometry("900x700")

# Configurar el color de fondo de la ventana
root.config(bg="#E0E0E0")

root.columnconfigure(1, weight=1)

configuration_frame = CTkFrame(root)
configuration_frame.grid(row=0, column=0, columnspan=3, sticky="ew")

configuration_label = CTkLabel(configuration_frame,  text="Crear nueva aplicación", font=("Arial", 14, "bold"))
configuration_label.grid(row=0, column=0, columnspan=3, pady=(20, 5), padx=20, sticky="w")

configuration_warning = CTkLabel(configuration_frame,  text="", font=("Arial", 13, "bold"),text_color="red")
configuration_warning.grid(row=0, column=3, columnspan=3, pady=(20, 5), padx=70, sticky="w")

description_label = CTkLabel(configuration_frame, text="Este Wizard genera la estructura necesaria para desarrollar una aplicación estándar")
description_label.grid(row=1, column=0, columnspan=3, pady=(10, 5), padx=20, sticky="w")

code_label = CTkLabel(root, text="Código de aplicación:", bg_color='#E0E0E0', text_color="black", font=("Arial", 12, "bold"))
code_label.grid(row=2, column=0, sticky="w", padx=(20, 10), pady=(20, 2))
entry_code = CTkEntry(root, bg_color='#E0E0E0', fg_color='#69a3d6', border_color='#69a3d6', height=2.5, border_width=3, text_color="black")
entry_code.grid(row=2, column=1, padx=(30, 400), pady=(20, 2), sticky="ew")

use_default_location = tk.BooleanVar()
location_checkbox = CTkCheckBox(root,hover=True, text="Usar localización por defecto", checkbox_height=20, checkbox_width=20, border_color='#337ab7', variable=use_default_location, command=toggle_textbox, bg_color='#E0E0E0', text_color="black", font=("Arial", 12, "bold"))
location_checkbox.grid(row=3, column=0, columnspan=2, pady=(5, 2), padx=20, sticky="w")
location_checkbox.select()

localizacion_label = CTkLabel(root, text="Localización:",  bg_color='#E0E0E0', text_color="black", font=("Arial", 12, "bold"))
localizacion_label.grid(row=4, column=0, sticky="w", padx=(20, 10), pady=(5, 2))
entry_location = CTkEntry(root, state="normal", bg_color='#E0E0E0', fg_color='#69a3d6', border_color='#69a3d6', height=2.5, border_width=3)
entry_location.grid(row=4, column=1, padx=(30, 130), pady=(5, 2), sticky="ew")
entry_location.configure(placeholder_text=os.getcwd())
entry_location.configure(placeholder_text_color="grey")
entry_location.configure(text_color="grey")
entry_location.delete(0, "end")
entry_location.insert(0, os.getcwd())
entry_location.configure(state="disabled")

location_button = CTkButton(root,state="disabled", text="Explorar", command=browse_location, bg_color='#E0E0E0', fg_color='#69a3d6', border_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"), width= 100, height=25)
location_button.grid(row=4, column=1, pady=(5, 2), padx=(600, 20))

war_label = CTkLabel(root, text="Nombre del WAR:", bg_color='#E0E0E0', text_color="black", font=("Arial", 12, "bold"))
war_label.grid(row=5, column=0, sticky="w", padx=(20, 10), pady=(5, 30))
entry_war = CTkEntry(root, bg_color='#E0E0E0', fg_color='#69a3d6', border_color='#69a3d6', height=2.5, border_width=3)
entry_war.grid(row=5, column=1, padx=(30, 20), pady=(5, 30), sticky="ew")

languages_frame = CTkFrame(root,  bg_color='#E0E0E0', fg_color='#E0E0E0', border_color='#69a3d6', border_width=3)
languages_frame.grid(row=6, column=0, columnspan=2, pady=(5, 30), padx=20, sticky="ew")

# Crear un marco interno para organizar los widgets dentro del contenedor "Idiomas"
idiomas_inner_frame = CTkFrame(languages_frame, fg_color='#E0E0E0', bg_color='#E0E0E0', border_color='#69a3d6')
idiomas_inner_frame.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")

# Crear un widget Label encima del borde del marco
label_on_border = CTkLabel(root, text="Idiomas", bg_color="#E0E0E0", fg_color="#E0E0E0", text_color="black", font=("Arial", 12, "bold"))
label_on_border.place(in_=languages_frame, anchor="sw" )

# pbligatoria Castellano y Euskera
language_options = ["Castellano", "Euskera", "Inglés", "Francés"]
language_vars = []
language_vars.append(tk.BooleanVar(name="Castellano",value=TRUE))
language_vars.append(tk.BooleanVar(name="Euskera",value=TRUE))
language_vars.append(tk.BooleanVar(name="Inglés",value=False))
language_vars.append(tk.BooleanVar(name="Francés",value=False))
stateCheck = "disabled"
for i, (lang_option, lang_var) in enumerate(zip(language_options, language_vars)):
    if(lang_option != 'Castellano' and lang_option != 'Euskera'):
        stateCheck = "normal"
    CTkCheckBox(idiomas_inner_frame,state=stateCheck, text=lang_option, variable=lang_var, command=update_default_language_options, checkbox_height=20, checkbox_width=20, border_color='#337ab7', bg_color='#E0E0E0', text_color="black", font=("Arial", 12, "bold")).grid(row=0, column=i, padx=5, pady=(10, 2), sticky="w")

default_language_label = CTkLabel(idiomas_inner_frame, text="Idioma por defecto:", text_color="black", font=("Arial", 12, "bold"))
default_language_label.grid(row=7, column=0, sticky="w", padx=(10, 10), pady=(25, 2))
default_language_var = tk.StringVar()

update_default_language_options()
security_frame = CTkFrame(root, bg_color='#E0E0E0', fg_color='#E0E0E0', border_color='#69a3d6', border_width=3)
security_frame.grid(row=8, column=0, columnspan=2, pady=(30, 20), padx=20, sticky="ew")

# Crear un widget Label encima del borde del marco
labelSecurityFrame = CTkLabel(root, text="Seguridad con XLNets", bg_color="#E0E0E0", fg_color="#E0E0E0", text_color="black", font=("Arial", 12, "bold"))
labelSecurityFrame.place(in_=security_frame, anchor="sw" )

security_var = tk.StringVar(value="Si")
security_yes_radio = CTkRadioButton(security_frame, text="Sí", value="Si", variable=security_var, text_color="black", radiobutton_height= 18 , radiobutton_width= 18)
security_yes_radio.grid(row=0, column=0, padx=5, pady=(20, 10), sticky="nsew")
security_no_radio = CTkRadioButton(security_frame, text="No", value="No", variable=security_var, text_color="black", radiobutton_height= 18 , radiobutton_width= 18)
security_no_radio.grid(row=0, column=1, padx=5, pady=(20, 10), sticky="nsew")

finish_button = CTkButton(root, text="Finish", command=save_to_yaml, bg_color='#E0E0E0', fg_color='#69a3d6', border_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"), width= 100, height=25)
finish_button.grid(row=11, column=1, pady=(7, 7), padx=(500, 0))

cancel_button = CTkButton(root, text="Cancelar", command=root.destroy, bg_color='#E0E0E0', fg_color='#69a3d6', border_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"), width= 100, height=25)
cancel_button.grid(row=11, column=1, pady=(7, 7), padx=(300, 0))

root.mainloop()
