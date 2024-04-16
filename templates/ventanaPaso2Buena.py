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


class PaginaUno(ttk.Frame):
    def __init__(self, master, tables=None, columns=None, *args, **kwargs):
        super().__init__(master, *args, **kwargs)

        # Descripción
        description_label = ttk.Label(self, text="Este Wizard genera el código fuente para desplegar una aplicación UDA", wraplength=500, font=('Arial', 10))
        description_label.grid(row=0, column=0, columnspan=2, pady=(10, 20), padx=20)

        # Formulario
        labels = ["Service name:", "SID:", "Host:", "Puerto:", "Usuario:", "Contraseña:", "Esquema Catálogo:", "URL:"]
        self.entries = []

        for i, label_text in enumerate(labels):
            label = ttk.Label(self, text=label_text)
            label.grid(row=i+1, column=0, sticky=tk.W, padx=(20, 10), pady=5)
            entry = ttk.Entry(self, show='*' if label_text == 'Contraseña:' else '')
            entry.grid(row=i+1, column=1, padx=(0, 20), pady=5, sticky=tk.W+tk.EW)
            self.entries.append(entry)

        # Botón de "Probar conexión"
        test_button = ttk.Button(self, text="Probar conexión", command=self.probar_conexion)
        test_button.grid(row=len(labels)+1, column=0, columnspan=2, pady=20, padx=20, sticky=tk.W+tk.EW)

        # Botón de "Siguiente"
        next_button = ttk.Button(self, text="Siguiente", command=self.master.mostrar_pagina_siguiente)
        next_button.grid(row=len(labels)+2, column=1, pady=10, padx=20, sticky=tk.E)

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


      

class PaginaDos(ttk.Frame):
    def __init__(self, master, tables, *args, **kwargs):
        super().__init__(master, *args, **kwargs)

         # Establecer colores
        color_principal = "#2E3B55"  # Azul oscuro
        color_secundario = "#FFFFFF"  # Blanco
        color_boton = "#4CAF50"       # Verde

        # Fuente y estilos
        fuente_titulo = ("Arial", 16, "bold")
        fuente_descripcion = ("Arial", 12)
        fuente_texto_adicional = ("Arial", 10)
        fuente_botones = ("Arial", 12, "bold")

        self.original_tables = copy.deepcopy(tables)  # Copia profunda de las tablas originales
       
      # Contenedor del scrollbar
        scrollbar_container = tk.Frame(self, bg=color_principal, padx=10, pady=10)
        scrollbar_container.pack(fill=tk.BOTH, expand=True)
        # Configurar el peso de las columnas para que el contenedor del scrollbar se expanda horizontalmente
        scrollbar_container.grid_columnconfigure(0, weight=1)

        self.scrollbar = ttk.Scrollbar(scrollbar_container, orient="vertical")
        self.canvas = tk.Canvas(scrollbar_container, yscrollcommand=self.scrollbar.set)
        self.inner_frame = ttk.Frame(self.canvas)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Ajustar el tamaño del Frame interno al Canvas
        self.canvas.create_window((0, 0), window=self.inner_frame, anchor="nw")

        self.scrollbar.config(command=self.canvas.yview)
        self.canvas.bind(("<Configure>",lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))))
        self.canvas.grid(row=0, column=0, sticky="nsew")
        self.scrollbar.grid(row=0, column=1, sticky="ns")

        
        # Pie de página con botones
        contenedor_botones = tk.Frame(self, bg=color_principal, padx=10, pady=10)
        contenedor_botones.pack(side=tk.BOTTOM, fill=tk.X)

        # Botones
        estilo_boton = ttk.Style()
        estilo_boton.configure("Custom.TButton", font=fuente_botones, foreground=color_principal, background=color_boton)
        back_button = ttk.Button(contenedor_botones, text="Back", style="Custom.TButton")
        back_button.pack(side=tk.RIGHT, padx=5)

        finish_button = ttk.Button(contenedor_botones, text="Siguiente", style="Custom.TButton", command=lambda: self.master.mostrar_pagina_tres(self.obtener_seleccion()))
        finish_button.pack(side=tk.RIGHT, padx=5, )

        cancel_button = ttk.Button(contenedor_botones, text="Cancel", style="Custom.TButton")
        cancel_button.pack(side=tk.RIGHT, padx=5)



        self.tables = []
        self.row_index = 0  # Inicializar el índice de fila

        self.mostrar_tablas(tables)

        # Ajustar el peso de las filas en el contenedor principal
        self.grid_rowconfigure(1, weight=0)  # Contenedor del scrollbar
        self.grid_rowconfigure(1, weight=0)  # Contenedor de los botones

        # Agregar evento de rueda del ratón al contenedor principal
        self.bind_all("<MouseWheel>", self.on_mousewheel)

    def obtener_seleccion(self):
        seleccion = []
        for table_frame, original_table in zip(self.tables, self.original_tables):
            table_name = original_table.name
            selected_columns = []

            for child, original_column in zip(table_frame.columns_frame.winfo_children(), original_table.columns):
                if isinstance(child, ttk.Checkbutton) and child.instate(["selected"]):
                    selected_columns.append(original_column)

            # Solo agregar la tabla al nuevo array si tiene columnas seleccionadas
            if selected_columns:
                selected_table = {"name": table_name, "columns": selected_columns}
                seleccion.append(selected_table)

        print("Esto es la selección:", seleccion)
        return seleccion

    def mostrar_tablas(self, tables):
        for table in tables:
            table_frame = ttk.Frame(self.inner_frame)
            table_frame.grid(row=self.row_index, column=0, sticky="ew")
            self.row_index += 1  # Incrementar el índice de fila

            # Checkbox para la tabla
            table_checkbox = ttk.Checkbutton(table_frame, text=table.name)
            table_checkbox.grid(row=0, column=0, sticky="w")
            table_frame.table_checkbox = table_checkbox

            # Botón para expandirf o contraer las columnas
            expand_button = ttk.Button(table_frame, text="+", command=lambda f=table_frame: self.toggle_columns(f))
            expand_button.grid(row=0, column=1, sticky="w")

            # Crear un Frame para las columnas de la tabla
            table.columns_frame = ttk.Frame(table_frame)
            table_frame.columns_frame = table.columns_frame

            # Agregar checkboxes para las columnas
            for i, column in enumerate(table.columns):
                checkbox_text = f"{column.name} ({table.name})"
                column_checkbox = ttk.Checkbutton(table.columns_frame, text=checkbox_text)
                column_checkbox.grid(row=i + 1, column=0, sticky="w", padx=20)
                column_checkbox.state(["!alternate"])  # Deseleccionar checkbox por defecto

            # Empaquetar el Frame para las columnas de la tabla usando grid
            table_frame.columns_frame.grid(row=1, column=0, sticky="w")

            self.tables.append(table_frame)

        # Actualizar la región de desplazamiento del canvas después de agregar las tablas
        self.update_scroll_region()

    def toggle_columns(self, table_frame):
        # Obtener el índice de la tabla en la lista
        index = self.tables.index(table_frame)

        # Mostrar u ocultar el Frame de las columnas de la tabla
        if table_frame.columns_frame.winfo_ismapped():
            table_frame.columns_frame.grid_remove()
        else:
            table_frame.columns_frame.grid(row=1, column=0, sticky="w")

        # Actualizar la región de desplazamiento del canvas después de expandir o contraer las tablas
        self.update_scroll_region()

    def update_scroll_region(self):
        self.canvas.update_idletasks()
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def on_canvas_configure(self, event):
        """Actualiza scrollregion cuando el tamaño del Canvas cambia."""
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

        # Ajustar el ancho del inner_frame para que coincida con el ancho del canvas
        self.inner_frame.config(width=event.width)

        # Actualizar la posición de la ventana de desplazamiento para evitar erroreso
        self.canvas.update_idletasks()

        # Asegurar que el tamaño del inner_frame se actualice correctamente
        self.inner_frame.update()

    def on_mousewheel(self, event):
        """Controla el desplazamiento del scrollbar con la rueda del ratón."""
        self.canvas.yview_scroll(-1 * (event.delta // 120), "units")




class PaginaTres(ttk.Frame):
    def __init__(self, master, tables, *args, **kwargs):
        super().__init__(master, *args, **kwargs)

        # Variables para controlar el estado de los checkboxes
        self.modelo_datos_var = tk.BooleanVar(value=False)
        self.daos_var = tk.BooleanVar(value=False)
        self.servicios_var = tk.BooleanVar(value=False)
        self.controladores_var = tk.BooleanVar(value=False)

        # Contenedor principal
        main_container = ttk.Frame(self)
        main_container.pack(fill="both", expand=True, padx=10, pady=10)

        # Contenedor de Componentes de Negocio
        negocio_container = ttk.Frame(main_container)
        negocio_container.pack(fill="x", pady=(0, 10))

        # Título "Componentes de Negocio"
        ttk.Label(negocio_container, text="Componentes de Negocio").pack(anchor="w", pady=(0, 5))

        # Componentes "Modelo de Datos", "DAOs" y "Servicios"
        for component, var in [("Modelo de Datos", self.modelo_datos_var), 
                               ("DAOs", self.daos_var), 
                               ("Servicios", self.servicios_var)]:
            component_container = ttk.Frame(negocio_container)
            ttk.Checkbutton(component_container, variable=var, command=self.update_search_state).pack(side="left")
            ttk.Label(component_container, text=component).pack(side="left", padx=5)
            component_container.pack(fill="x", pady=5)

        # Contenedor de texto al lado del botón "Buscar" para Componentes de Negocio
        self.search_container_negocio = ttk.Frame(negocio_container)
        self.search_entry_negocio = ttk.Entry(self.search_container_negocio, state="disabled")
        self.search_entry_negocio.pack(side="left")
        self.search_button_negocio = ttk.Button(self.search_container_negocio, text="Buscar", command=self.buscar_archivos)
        self.search_button_negocio.pack(side="left", padx=5)
        self.search_container_negocio.pack(fill="x", pady=5)

        # Contenedor de Componentes de Presentación
        presentacion_container = ttk.Frame(main_container)
        presentacion_container.pack(fill="x", pady=(0, 10))

        # Título "Componentes de Presentación"
        ttk.Label(presentacion_container, text="Componentes de Presentación").pack(anchor="w", pady=(0, 5))

        # Checkbox para "Controladores"
        controladores_checkbox = ttk.Checkbutton(presentacion_container, text="Controladores", variable=self.controladores_var, command=self.update_search_state)
        controladores_checkbox.pack(anchor="w")

        # Contenedor de texto y botón para "Controladores"
        self.search_container_presentacion = ttk.Frame(presentacion_container)
        self.search_entry_presentacion = ttk.Entry(self.search_container_presentacion, state="disabled")
        self.search_entry_presentacion.pack(side="left")
        self.search_button_presentacion = ttk.Button(self.search_container_presentacion, text="Buscar", state="disabled")
        self.search_button_presentacion.pack(side="left")
        self.search_container_presentacion.pack(fill="x", pady=5)

        #me lo pillsa

        tabla_resultados = []
        for tb in tables:
            tabla = {}
            tabla['name'] = tb['name']
            tabla['columns'] = []
            for column in tb['columns']:
                columna_dict = {
                'name': column.name,
                'type': column.type,
                'dataPrecision': column.dataPrecision,
                'datoImport': column.datoImport,
                'datoType': column.datoType,
                'nullable': column.nullable,
                'primaryKey': column.primaryKey,
                'tableName': column.tableName
            }

                tabla['columns'].append(columna_dict)
            tabla_resultados.append(tabla)

        json_resultado = json.dumps(tabla_resultados)



       
        data = { "project_name": "ppp",
        "security_app": "",
        "war_project_name": "Www",
        "PACKAGE_NAME": "com.ejie."+"ppp"+".control",
        "directorio_actual" : "C:/Users/mllorente/Desktop/Entornos_UDA/workspaces/workspace_2020_v5/udaTemplates/templates/generateCode/",
        "destinoApp" : "C:/Users/mllorente/Desktop/paso2Copier/"
        }
        
        # Botones finales
        buttons_container = ttk.Frame(main_container)
        buttons_container.pack(fill="x", pady=(0, 5), side="bottom", anchor="e")
        ttk.Button(buttons_container, text="Botón 1", command=lambda: p2.initPaso2(tabla_resultados, data)).pack( side="right", padx=5)
        ttk.Button(buttons_container, text="Botón 2").pack(side="right", padx=5)

    def update_search_state(self):
        """
        Actualiza el estado de los contenedores de búsqueda
        según el estado de los checkboxes.
        """
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
            # Mostrar la nueva ventana con la lista de archivos encontrados
            self.new_window = NuevaVentana(self.master, files)
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

class VentanaPrincipal(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Generar código para una aplicación UDA")
        self.geometry("600x600")  # Ajusta las dimensiones de la ventana según tus necesidades
        self.resizable(width=True, height=True)  # Permitir redimensionar la ventana

        self.grid_rowconfigure(0, weight=1)  # Ajusta el peso de la primera fila
        self.grid_columnconfigure(0, weight=1)  # Ajusta el peso de la primera columna

        self.pagina_actual = None
        self.mostrar_pagina(PaginaUno, tables=None)

    def mostrar_pagina(self, pagina, tables):
        nueva_pagina = pagina(self, tables)
        if self.pagina_actual:
            self.pagina_actual.destroy()
        nueva_pagina.grid(row=0, column=0, sticky="nsew")
        self.pagina_actual = nueva_pagina

    def mostrar_pagina_siguiente(self, tables):
        self.mostrar_pagina(PaginaDos, tables)

    def mostrar_pagina_anterior(self):
        self.mostrar_pagina(PaginaUno)

    def mostrar_pagina_tres(self, tables):
        self.mostrar_pagina(PaginaTres, tables)


if __name__ == "__main__":
    app = VentanaPrincipal()
    app.mainloop()
