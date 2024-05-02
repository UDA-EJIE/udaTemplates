import tkinter as tk
from tkinter import ttk
import yaml
import oracledb
from Column import Column
from Table import Table
import os
from tkinter import filedialog
import plugin.paso2 as p2
import plugin.utils as utl
import copy
import json
from customtkinter import *
import customtkinter as ctk


class PaginaUno(CTkFrame):
    def __init__(self, master, tables=None, columns=None, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.configure(corner_radius=10, fg_color="#E0E0E0", border_color="#69a3d6", border_width=4)


        # Configura el contenedor principal para que las columnas se expandan
        self.grid_columnconfigure(0, weight=1)  # Esto hace que la columna se expanda
        
        configuration_frame = CTkFrame(self)
        configuration_frame.grid(row=0, column=0, columnspan=3, sticky="ew")

        configuration_label = CTkLabel(configuration_frame,  text="Crear nueva aplicación", font=("Arial", 14, "bold"))
        configuration_label.pack(row=0, column=0, columnspan=3, pady=(20, 5), padx=20, sticky="w")

        description_label = CTkLabel(configuration_frame, text="Este Wizard genera la estructura necesaria para desarrollar una aplicación estándar")
        description_label.grid(row=1, column=0, columnspan=3, pady=(10, 5), padx=20, sticky="w")

      

        # Formulario
        labels = ["Service name:", "SID:", "Host:", "Puerto:", "Usuario:", "Contraseña:", "Esquema Catálogo:", "URL:"]
        self.entries = []
        
        for i, label_text in enumerate(labels):
            label = CTkLabel(self, text=label_text, fg_color="#E0E0E0", text_color="black", font=("Arial", 12, "bold"))
            label.grid(row=i+1, column=0, sticky="w", padx=(20, 10), pady=(20, 2))
            entry = CTkEntry(self, fg_color='#69a3d6', border_color='#69a3d6', height=2.5, width=500, text_color="black", show='*' if label_text == 'Contraseña:' else None)
            entry.grid(row=i+1, column=1, padx=(0, 200), pady=(20, 2), sticky="ew")
            self.entries.append(entry)

        # Botones
        test_button = CTkButton(self, text="Probar conexión", command=self.probar_conexion, fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        test_button.grid(row=len(labels) + 1, column=0, columnspan=2, pady=20, padx=20, sticky="ew")

        next_button = CTkButton(self, text="Siguiente", command=lambda: master.mostrar_pagina_siguiente(), fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        next_button.grid(row=len(labels) + 2, column=1, pady=10, padx=20, sticky="e")

    def probar_conexion(self):
        # Obtener datos de los cuadros de texto
        data = {
            "Service name": self.entries[0].get(),
            "SID": self.entries[1].get(),
            "Host": self.entries[2].get(),
            "Puerto": self.entries[3].get(),
            "Usuario": self.entries[4].get(),
            "Contraseña": self.entries[5].get(),
            "Esquema Catálogo": self.entries[6].get(),
            "URL": self.entries[7].get()
        }

        # Guardar datos en un archivo YAML
        with open("respuestas_paso1.yml", "w") as yaml_file:
            yaml.dump(data, yaml_file, default_flow_style=False)

        # Puedes agregar aquí la lógica para probar la conexión a la base de datos
        print("Conexión probada")

        tables = [] 
        columns = [] 
        un = self.entries[4].get()
        cs = self.entries[2].get() + ":" + self.entries[3].get() + "/" + self.entries[0].get()
        pw = self.entries[5].get()
        d = "C:/oracle/instantclient_21_12"
        print(cs)
        query = """select tb1.table_name, tb1.column_name,tb1.DATA_TYPE,tb1.NULLABLE,tb2.constraint_type, tb1.SYNONYM_NAME, tb1.DATA_PRECISION
         FROM  
            (SELECT ta.table_name,sy.SYNONYM_NAME, utc.COLUMN_NAME, utc.data_type,utc.nullable,utc.DATA_PRECISION
             FROM user_tables ta
             LEFT JOIN user_synonyms sy
             ON ta.TABLE_NAME = sy.TABLE_NAME
             INNER JOIN USER_TAB_COLUMNS utc
             ON ta.TABLE_NAME = utc.TABLE_NAME 
             order by sy.SYNONYM_NAME,ta.table_name,utc.column_name) tb1 
        LEFT JOIN 
            (select all_cons_columns.owner , all_cons_columns.table_name, all_cons_columns.column_name, all_constraints.constraint_type
            from all_constraints, all_cons_columns 
            where 
                all_constraints.constraint_type = 'P' AND all_constraints.owner = :esquema
                and all_constraints.constraint_name = all_cons_columns.constraint_name
                and all_constraints.owner = all_cons_columns.owner 
            order by all_cons_columns.owner,all_cons_columns.table_name) tb2
        ON tb1.table_name = tb2.table_name AND tb1.column_name = tb2.column_name"""
        
        oracledb.init_oracle_client(lib_dir=d)
        with oracledb.connect(user=un, password=pw, dsn=cs) as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, esquema="X21B")
                rows = cursor.fetchall()
                tableName = ''
                cont = 0
                contPrimaryKey = 0
                for row in rows:
                    cont = cont + 1
                    tableNameBBDD = row[0]
                    if row[5] != None: #sinonimos
                      tableNameBBDD = row[5]  
                    #snakeCamelCase)   
                    if tableName == tableNameBBDD:
                        #se crea la columna
                        column = Column(tableNameBBDD,row[1],row[2],row[3],row[4],None,None,row[6])
                        columns.append(column)
                        if row[4]  == 'P': #primarykey
                            contPrimaryKey = contPrimaryKey + 1
                    else:
                        if cont > 1 and contPrimaryKey < len(columns):
                            tables.append(Table(tableName,columns)) 
                        contPrimaryKey = 0    
                        if row[4]  == 'P': #primarykey
                            contPrimaryKey = contPrimaryKey + 1    
                        columns = []
                        #se crea la columna
                        column = Column(tableNameBBDD,row[1],row[2],row[3],row[4],None,None,row[6])
                        columns.append(column)  
                    
                    if cont == len(rows) and contPrimaryKey < len(columns): #si es la última se mete a la tabla
                        tables.append(Table(tableName,columns))   
                    tableName = tableNameBBDD   
     
        self.master.mostrar_pagina_siguiente(tables)           


      

class PaginaDos(ctk.CTkFrame):
    def __init__(self, master, tables, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.configure(corner_radius=10, fg_color="#E0E0E0")

        self.original_tables = copy.deepcopy(tables)
        self.tables = []

        # Header frame using grid
        self.header_frame = ctk.CTkFrame(self, fg_color="#4CAF50")
        self.header_frame.grid(row=0, column=0, sticky="ew")
        self.grid_columnconfigure(0, weight=1)  # Ensure this column can expand
        self.grid_rowconfigure(1, weight=1)     # Central row where the scrollable frame will go

        header_label = ctk.CTkLabel(self.header_frame, text="Gestión de Tablas", font=("Arial", 14, "bold"))
        header_label.pack(pady=10, padx=10)

        # Scrollable frame in the middle using pack inside a grid row
        self.middle_frame = ctk.CTkFrame(self)
        self.middle_frame.grid(row=1, column=0, sticky="nsew")
        self.scrollable_frame = ctk.CTkScrollableFrame(self.middle_frame, fg_color="#E0E0E0", scrollbar_fg_color="#4CAF50")
        self.scrollable_frame.pack(fill="both", expand=True, padx=10, pady=10)

        self.populate_scrollable_frame(self.scrollable_frame, tables)

        # Footer frame using grid for buttons
        self.footer_frame = ctk.CTkFrame(self, fg_color="#2E3B55")
        self.footer_frame.grid(row=2, column=0, pady=(5, 30) ,sticky="ew")
        self.setup_footer_buttons()

    def populate_scrollable_frame(self, frame, tables):
        for table in tables:
            table_frame = ctk.CTkFrame(frame, fg_color="#FFFFFF", corner_radius=10)
            table_frame.pack(fill="x", padx=10, pady=2, expand=True)

            table_checkbox = ctk.CTkCheckBox(table_frame, text=table.name, variable=tk.BooleanVar(value=True), 
                                            text_color="black", font=("Arial", 10, "bold"),
                                            checkbox_height=15, checkbox_width=15, border_color='#337ab7')
            table_checkbox.pack(side="left", padx=5)

            expand_icon = ctk.CTkLabel(table_frame, text="▼", fg_color="#FFFFFF", cursor="hand2", 
                                    text_color="black", font=("Arial", 10, "bold"))
            expand_icon.pack(side="left", padx=5)
            expand_icon.bind("<Button-1>", lambda event, f=table_frame: self.toggle_columns(f))

            columns_frame = ctk.CTkFrame(table_frame, fg_color="#F0F0F0", corner_radius=10)
            table_frame.columns_frame = columns_frame
            columns_frame.pack(fill="x", expand=True, padx=20, pady=2)
            columns_frame.pack_forget()  # Start with columns hidden

            # Correct placement of column checkboxes inside the columns_frame
            for column in table.columns:
                column_checkbox = ctk.CTkCheckBox(columns_frame, text=column.name, variable=tk.BooleanVar(value=True), 
                                                text_color="black", font=("Arial", 10, "bold"),
                                                checkbox_height=15, checkbox_width=15, border_color='#337ab7')
                column_checkbox.pack(anchor="w", padx=20)

            self.tables.append(table_frame)

    def toggle_columns(self, table_frame):
    # Asegúrate de referirte al columns_frame para expandir/contraer
        if table_frame.columns_frame.winfo_viewable():
            table_frame.columns_frame.pack_forget()
            table_frame.winfo_children()[1].configure(text="▼")  # Icono cambia a 'expandir'
        else:
            table_frame.columns_frame.pack(fill="x", expand=True, padx=20, pady=2)
            table_frame.winfo_children()[1].configure(text="▲")  # Icono cambia a 'contraer'

    def obtener_seleccion_checkbox(self):
        seleccion_checkbox = []
        
        
        for table_frame, original_table in zip(self.tables, self.original_tables):

            table_name = original_table.name  # Nombre de la tabla
            selected_columns = []


            for child, original_column in zip(table_frame.columns_frame.winfo_children(), original_table.columns):
                if child.get() == 1:
                    selected_columns.append(original_column)

            if selected_columns:
                seleccion_checkbox.append({"name": table_name, "columns": selected_columns})

        print("Esto es la selección de checkboxes:", seleccion_checkbox)
        return seleccion_checkbox
    
    def setup_footer_buttons(self):
        select_all_button = ctk.CTkButton(self.footer_frame, text="Seleccionar Todas", command=self.select_all)
        select_all_button.pack(side="left", padx=5)

        deselect_all_button = ctk.CTkButton(self.footer_frame, text="Deseleccionar Todas", command=self.deselect_all)
        deselect_all_button.pack(side="left", padx=5)

        back_button = ctk.CTkButton(self.footer_frame, text="Back")
        back_button.pack(side="right", padx=5)

        next_button = ctk.CTkButton(self.footer_frame, text="Siguiente",  command=lambda: self.master.mostrar_pagina_tres(self.obtener_seleccion_checkbox()))
        next_button.pack(side="right", padx=5)
        
        cancel_button = ctk.CTkButton(self.footer_frame, text="Cancel")
        cancel_button.pack(side="right", padx=5)


    def select_all(self):
        for table_frame in self.tables:
            # Assuming _state is an attribute that holds the checkbox state
            table_frame.winfo_children()[0].select()  # Checkbox de la tabla
            for checkbox in table_frame.columns_frame.winfo_children():
                checkbox.select()

    def deselect_all(self):
        for table_frame in self.tables:
            # Assuming _state is an attribute that holds the checkbox state
            table_frame.winfo_children()[0].deselect()  # Checkbox de la tabla
            for checkbox in table_frame.columns_frame.winfo_children():
                checkbox.deselect() # Checkbox de las columnas
            
class PaginaTres(ctk.CTkFrame):
    def __init__(self, master, tables, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        
         # Header frame using grid
        self.header_frame = ctk.CTkFrame(self, fg_color="#4CAF50")
        self.header_frame.grid(row=0, column=0, sticky="ew")
        self.grid_columnconfigure(0, weight=1)  # Ensure this column can expand
        self.grid_rowconfigure(2, weight=1)     # Central row where the scrollable frame will go

        header_label = ctk.CTkLabel(self.header_frame, text="Gestión de Tablas", font=("Arial", 14, "bold"))
        header_label.pack(pady=10, padx=10)

        self.configure(corner_radius=10)
        # Variables para controlar el estado de los checkboxes
        self.modelo_datos_var = tk.BooleanVar(value=False)
        self.daos_var = tk.BooleanVar(value=False)
        self.servicios_var = tk.BooleanVar(value=False)
        self.controladores_var = tk.BooleanVar(value=False)

        # Contenedor principal
        main_container = ctk.CTkFrame(self, fg_color="#E0E0E0")
        main_container.grid(row=1, column=0, sticky="ew")

        # Contenedor de Componentes de Negocio
        negocio_container = ctk.CTkFrame(main_container, fg_color="#E0E0E0", border_width=3, border_color="#69a3d6")
        negocio_container.pack(fill="x", padx=(0,0), pady=(0, 30))

        # Título "Componentes de Negocio"
        ctk.CTkLabel(negocio_container, text="Componentes de Negocio",  text_color="black", font=("Arial", 14, "bold")).pack(anchor="w", pady=(0, 5), padx=(20,20))
 
        # Componentes "Modelo de Datos", "DAOs" y "Servicios"
        for component, var in [("Modelo de Datos", self.modelo_datos_var), 
                               ("DAOs", self.daos_var), 
                               ("Servicios", self.servicios_var)]:
            component_container = ctk.CTkFrame(negocio_container, fg_color="#69a3d6")
            ctk.CTkCheckBox(component_container, variable=var, onvalue=True, offvalue=False, text=component, text_color="black", font=("Arial", 11, "bold"), command=self.update_search_state).pack(side="left", padx=(20,0), pady=(0, 5))
            component_container.pack(fill="x", pady=5, padx=(20,20))

        # Contenedor de texto al lado del botón "Buscar" para Componentes de Negocio"
        self.search_container_negocio = ctk.CTkFrame(negocio_container)

        self.search_container_negocio
        self.search_entry_negocio = ctk.CTkEntry(self.search_container_negocio, state="disabled")
        self.search_entry_negocio.pack(side="left")
        self.search_button_negocio = ctk.CTkButton(self.search_container_negocio, text="Buscar", command=self.buscar_archivos)
        self.search_button_negocio.pack(side="left", padx=5)
        self.search_container_negocio.pack(fill="x", pady=5)

        # Contenedor de Componentes de Presentación
        presentacion_container = ctk.CTkFrame(main_container, fg_color="#E0E0E0")
        presentacion_container.pack(fill="x", pady=(0, 10))

        # Título "Componentes de Presentación"
        ctk.CTkLabel(presentacion_container, text="Componentes de Presentación", text_color="black", font=("Arial", 14, "bold")).pack(anchor="w", pady=(0, 5))

        # Checkbox para "Controladores"
        controladores_checkbox = ctk.CTkCheckBox(presentacion_container, text="Controladores", variable=self.controladores_var, command=self.update_search_state)
        controladores_checkbox.pack(anchor="w")

        # Contenedor de texto y botón para "Controladores"
        self.search_container_presentacion = ctk.CTkFrame(presentacion_container)
        self.search_entry_presentacion = ctk.CTkEntry(self.search_container_presentacion, state="disabled")
        self.search_entry_presentacion.pack(side="left")
        self.search_button_presentacion = ctk.CTkButton(self.search_container_presentacion, text="Buscar", state="disabled")
        self.search_button_presentacion.pack(side="left")
        self.search_container_presentacion.pack(fill="x", pady=5)
 
        # tabla_resultados = []
        # for tb in tables:
        #     tabla = {}
        #     tabla['name'] = tb['name']
        #     tabla['columns'] = []
        #     for column in tb['columns']:
        #         columna_dict = {
        #         'name': column.name,
        #         'type': column.type,
        #         'dataPrecision': column.dataPrecision,
        #         'datoImport': column.datoImport,
        #         'datoType': column.datoType,
        #         'nullable': column.nullable,
        #         'primaryKey': column.primaryKey,
        #         'tableName': column.tableName
        #     }

        #         tabla['columns'].append(columna_dict)
        #     tabla_resultados.append(tabla)

        # json_resultado = json.dumps(tabla_resultados)



       
        data = { "project_name": "aaa",
        "security_app": "",
        "war_project_name": "bbb",
        "PACKAGE_NAME": "com.ejie."+"ppp"+".control",
        "directorio_actual" : "C:/Users/mllorente/Desktop/Entornos_UDA/workspaces/workspace_2020_v5/udaTemplates/templates/generateCode/",
        "destinoApp" : "C:/pruebacopier/"
        }

     
        # Botones finales
        buttons_container = ctk.CTkFrame(self)
        buttons_container.grid(row=2, column=0, sticky="ew")
        ctk.CTkButton(buttons_container, text="Siguiente", command=lambda: p2.initPaso2(tabla_resultados, data)).pack(side="right", padx=5)
        ctk.CTkButton(buttons_container, text="Atras").pack(side="right", padx=5)

    def update_search_state(self):
        """Actualiza el estado de los contenedores de búsqueda según el estado de los checkboxes."""
        if any([self.modelo_datos_var.get(), self.daos_var.get(), self.servicios_var.get()]):
            self.search_entry_negocio.config(state="normal")
            self.search_button_negocio.config(state="normal")
        else:
            self.search_entry_negocio.config(state="disabled")
            self.search_button_negocio.config(state="disabled")

        if self.controladores_var.get():
            self.search_entry_presentacion.config(state="normal")
            self.search_button_presentacion.config(state="normal")
        else:
            self.search_entry_presentacion.config(state="disabled")
            self.search_button_presentacion.config(state="disabled")

    def buscar_archivos(self):
        """Busca archivos con terminación 'Classes' en la misma ruta del script Python."""
        folder_path = os.path.dirname(__file__)
        files = [file for file in os.listdir(folder_path) if file.endswith("Classes")]
        if files:
            print(f"Se encontraron los siguientes archivos en la ruta '{folder_path}':")
            for file in files:
                print(file)
        else:
            print("No se encontraron archivos con terminación 'Classes' en la ruta actual.")

   

class NuevaVentana(tk.Toplevel):
    def __init__(self, master, files, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.title("Selección de Archivos")
        self.geometry("300x300")

        # Lista de archivos con checkboxes
        self.files_vars = []
        for file in files:
            file_var = tk.BooleanVar(value=False)
            ttk.Checkbutton(self, text=file, variable=file_var).pack(anchor="w")
            self.files_vars.append(file_var)

        # Botones "Cancelar" y "OK"
        buttons_container = ttk.Frame(self)
        buttons_container.pack(fill="x", pady=5, side="bottom", anchor="e")
        ttk.Button(buttons_container, text="Cancelar", command=self.destroy).pack(side="right", padx=5)
        ttk.Button(buttons_container, text="OK", command=lambda: self.ok_button_clicked(files)).pack(side="right", padx=5)

        # Variable para almacenar el archivo seleccionado
        self.selected_file = None

    def ok_button_clicked(self, files):
        """Acción al hacer clic en el botón 'OK'."""
        # Obtener el archivo seleccionado
        selected_file = None
        print("el zip", zip(self.files_vars, files))
        for file, file_var in zip(self.files_vars, files): 
            print("esto es el file", file)
            print("esto es el file_var", file_var)
            if file_var:
                selected_file = file_var
                break

        if selected_file:
            print(f"Se seleccionó el archivo: {selected_file}")
        else:
            print("Ningún archivo seleccionado.")   

class VentanaPrincipal(CTk):
    def __init__(self):
        super().__init__()
        self.title("Generar código de negocio y control")
        self.geometry("900x700") # Puedes ajustar las dimensiones según tus necesidades
        self.resizable(width=True, height=True)

        self.grid_rowconfigure(0, weight=1)
        self.columnconfigure(0, weight=1)

        self.pagina_actual = None
        self.mostrar_pagina(PaginaUno)

    def mostrar_pagina(self, pagina, tables=None):
        if self.pagina_actual is not None:
            self.pagina_actual.destroy()
        self.pagina_actual = pagina(self, tables)
        self.pagina_actual.grid(row=0, column=0, sticky="nsew")

    def mostrar_pagina_siguiente(self, tables=None):
        self.mostrar_pagina(PaginaDos, tables)

    def mostrar_pagina_tres(self, tables=None):
        self.mostrar_pagina(PaginaTres, tables)

    def mostrar_pagina_anterior(self):
        # Lógica para volver a la página anterior
        print("Volviendo a la página anterior")

if __name__ == "__main__":
    app = VentanaPrincipal()
    app.mainloop()
