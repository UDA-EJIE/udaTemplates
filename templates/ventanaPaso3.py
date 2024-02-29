import tkinter as tk
from tkinter import ttk
import yaml
import oracledb
from Column import Column
from Table import Table
import os
from tkinter import filedialog

class PaginaUno(ttk.Frame):
    def __init__(self, master, tables=None, data_mantenimiento=None, *args, **kwargs):
        super().__init__(master, *args, **kwargs)

        # Descripción
        description_label = ttk.Label(self, text="Este Wizard genera el código fuente para desplegar una aplicación UDA", wraplength=500, font=('Arial', 10))
        description_label.grid(row=0, column=0, columnspan=2, pady=(10, 20), padx=20)

        # Contenedor de texto
        self.text_container = tk.Text(self, height=5, width=50)
        self.text_container.grid(row=1, column=0, columnspan=2, padx=20, pady=5, sticky=tk.W)

        # Botón de búsqueda
        search_button = ttk.Button(self, text="Buscar")
        search_button.grid(row=1, column=2, padx=10, pady=5, sticky=tk.W)

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
        d = "C:\oracle\instantclient_21_12"
        print(cs)
        query = """select tb1.table_name, tb1.column_name,tb1.DATA_TYPE,tb1.NULLABLE,tb2.constraint_type, tb1.SYNONYM_NAME
        FROM  
            (SELECT ta.table_name,sy.SYNONYM_NAME, utc.COLUMN_NAME, utc.data_type,utc.nullable
            FROM user_tables ta
            LEFT JOIN user_synonyms sy
            ON ta.TABLE_NAME = sy.TABLE_NAME
            INNER JOIN USER_TAB_COLUMNS utc
            ON ta.TABLE_NAME = utc.TABLE_NAME 
            order by sy.SYNONYM_NAME,ta.table_name) tb1 
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

                    if tableName == tableNameBBDD:
                        #se crea la columna
                        column = Column(tableNameBBDD,row[1],row[2],row[3],row[4])
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
                        column = Column(tableNameBBDD,row[1],row[2],row[3],row[4])
                        columns.append(column)  
                    
                    if cont == len(rows) and contPrimaryKey < len(columns): #si es la última se mete a la tabla
                        tables.append(Table(tableName,columns))   
                    tableName = tableNameBBDD   
    
        self.master.mostrar_pagina_siguiente(tables) 


class ventanaPaso2(ttk.Frame):
    def __init__(self, master, tables, data_mantenimineto=None, *args, **kwargs):
        super().__init__(master, *args, **kwargs)


        print("estos son las tablas", tables)
        # Cabecera
        cabecera = ttk.Label(self, text="Generar nuevo mantenimiento para una aplicación", font=("Arial", 14, "bold"))
        cabecera.grid(row=0, column=0, columnspan=2, pady=(10, 20), padx=20)

        # Texto
        texto = ttk.Label(self, text="Rellene los campos con las propiedades del mantenimiento")
        texto.grid(row=1, column=0, columnspan=2, padx=20)

        # Nombre del mantenimiento
        nombre_label = ttk.Label(self, text="Nombre del mantenimiento:")
        nombre_label.grid(row=2, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.nombre_entry = ttk.Entry(self)
        self.nombre_entry.grid(row=2, column=1, padx=(0, 20), pady=5, sticky=tk.W+tk.EW)

        # Título del mantenimiento
        titulo_label = ttk.Label(self, text="Título del mantenimiento:")
        titulo_label.grid(row=3, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.titulo_entry = ttk.Entry(self)
        self.titulo_entry.grid(row=3, column=1, padx=(0, 20), pady=5, sticky=tk.W+tk.EW)

        # Mantenimiento
        mantenimiento_label = ttk.Label(self, text="Mantenimiento:")
        mantenimiento_label.grid(row=4, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.checkbox_var = tk.BooleanVar()
        self.mantenimiento_checkbox = ttk.Checkbutton(self, text="Realizado", variable=self.checkbox_var)
        self.mantenimiento_checkbox.grid(row=4, column=1, padx=(0, 20), pady=5, sticky=tk.W)

        # Tipo de Mantenimiento
        tipo_label = ttk.Label(self, text="Tipo de Mantenimiento:")
        tipo_label.grid(row=5, column=0, sticky=tk.W, padx=(20, 10), pady=5)

        self.tipo_var = tk.StringVar(value="Edición en línea")
        self.tipo_radio1 = ttk.Radiobutton(self, text="Edición en línea", variable=self.tipo_var, value="Edición en línea")
        self.tipo_radio1.grid(row=5, column=1, sticky=tk.W, padx=(0, 20), pady=5)

        self.tipo_radio2 = ttk.Radiobutton(self, text="Formulario de detalle", variable=self.tipo_var, value="Formulario de detalle")
        self.tipo_radio2.grid(row=6, column=1, sticky=tk.W, padx=(0, 20), pady=5)


         # Botonera
        mantenimiento_label = ttk.Label(self, text="Botonera:")
        mantenimiento_label.grid(row=7, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.checkbox_var1 = tk.BooleanVar()
        self.botonera_checkbox = ttk.Checkbutton(self, text="", variable=self.checkbox_var1)
        self.botonera_checkbox.grid(row=7, column=1, padx=(0, 20), pady=5, sticky=tk.W)

         # Mantenimiento
        menu_label = ttk.Label(self, text="Menú contextual:")
        menu_label.grid(row=8, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.checkbox_var2 = tk.BooleanVar()
        self.menu_checkbox = ttk.Checkbutton(self, text="", variable=self.checkbox_var2)
        self.menu_checkbox.grid(row=8, column=1, padx=(0, 20), pady=5, sticky=tk.W)

         # Mantenimiento
        filtrado_label = ttk.Label(self, text="Filtrado de datos:")
        filtrado_label.grid(row=9, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.checkbox_var3 = tk.BooleanVar()
        self.filtrado_checkbox = ttk.Checkbutton(self, text="", variable=self.checkbox_var3)
        self.filtrado_checkbox.grid(row=9, column=1, padx=(0, 20), pady=5, sticky=tk.W)

         # Mantenimiento
        busqueda_label = ttk.Label(self, text="Búsqueda:")
        busqueda_label.grid(row=10, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.checkbox_var4 = tk.BooleanVar()
        self.busqueda_checkbox = ttk.Checkbutton(self, text="", variable=self.checkbox_var4)
        self.busqueda_checkbox.grid(row=10, column=1, padx=(0, 20), pady=5, sticky=tk.W)

         # Mantenimiento
        validaciones_label = ttk.Label(self, text="Validaciones cliente:")
        validaciones_label.grid(row=11, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.checkbox_var5 = tk.BooleanVar()
        self.validaciones_checkbox = ttk.Checkbutton(self, text="", variable=self.checkbox_var5)
        self.validaciones_checkbox.grid(row=11, column=1, padx=(0, 20), pady=5, sticky=tk.W)

         # Mantenimiento
        multiseleccion_label = ttk.Label(self, text="Multiselección:")
        multiseleccion_label.grid(row=12, column=0, sticky=tk.W, padx=(20, 10), pady=5)
        self.checkbox_var6 = tk.BooleanVar()
        self.multiseleccion_checkbox = ttk.Checkbutton(self, text="", variable=self.checkbox_var6)
        self.multiseleccion_checkbox.grid(row=12, column=1, padx=(0, 20), pady=5, sticky=tk.W)

        # Contenedor para los botones
        button_container = ttk.Frame(self)
        button_container.grid(row=13, column=0, sticky="ew", padx=10, pady=(0, 10))

        # Crear botones
        ttk.Button(button_container, text="Atras").pack(side="left", padx=10, pady=5)
        ttk.Button(button_container, text="Siguiente", command=lambda: self.master.mostrar_pagina_tres(self.obtener_datos(), tables)).pack(side="left", padx=10, pady=5)

    def obtener_datos(self):

        arrayInfoPag2 = []
        nombre = self.nombre_entry.get()
        titulo = self.titulo_entry.get()
        mantenimiento = self.checkbox_var.get()
        
        if self.tipo_var.get() == " Edición en línea":
            tipo = "DETAIL"
        else:
            tipo = "INLINE"
        
        arrayInfoPag2.append([nombre, titulo, mantenimiento, tipo])


        return arrayInfoPag2


class VentanaPaso3(ttk.Frame):
    def __init__(self, master, tables, data_mantenimiento, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
    
        print("Esto es el data man", data_mantenimiento)
       # Contenedor izquierdo con scrollbar
        left_container = ttk.Frame(self)
        left_container.pack(side="left", fill="y")

        canvas = tk.Canvas(left_container, borderwidth=0)
        scrollbar = ttk.Scrollbar(left_container, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        self.tabla_seleccionada = tk.StringVar()
        self.tabla_seleccionada_index = -1

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(
                scrollregion=canvas.bbox("all")
            )
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")

        canvas.configure(yscrollcommand=scrollbar.set)

        # Lista para almacenar los radio buttons
        self.radio_buttons = []

        for i, table in enumerate(tables):
            radio_btn = ttk.Radiobutton(scrollable_frame, text=table.name, value=table.name, variable=self.tabla_seleccionada,
                                         command=lambda i=i: self.actualizar_indice(i))  # Asignar el índice al botón de radio
            radio_btn.pack(anchor=tk.W)
            self.radio_buttons.append(radio_btn)

        # Empacar el canvas y el scrollbar
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Contenedor derecho con etiquetas y contenedores de texto
        right_container = ttk.Frame(self)
        right_container.pack(side="right", fill="y")

        url_label = ttk.Label(right_container, text="URL(*):")
        url_label.grid(row=0, column=0, sticky="w")
        url_entry = ttk.Entry(right_container)
        url_entry.grid(row=0, column=1, sticky="we")

        alias_label = ttk.Label(right_container, text="Alias(*):")
        alias_label.grid(row=1, column=0, sticky="w")
        alias_entry = ttk.Entry(right_container)
        alias_entry.grid(row=1, column=1, sticky="we")

        cargar_check = ttk.Checkbutton(right_container, text="Cargar al inicio de la ventana")
        cargar_check.grid(row=2, column=0, columnspan=2, sticky="w")

        orden_label = ttk.Label(right_container, text="Ordenación:")
        orden_label.grid(row=3, column=0, sticky="w")
        orden_combobox = ttk.Combobox(right_container, values=["asc", "desc"])
        orden_combobox.grid(row=3, column=1, sticky="we")
        orden_combobox.set("asc")

        orden_nombre_label = ttk.Label(right_container, text="Ordenación por nombre:")
        orden_nombre_label.grid(row=4, column=0, sticky="w")
        orden_nombre_combobox = ttk.Combobox(right_container, values=["Nombre A", "Nombre B"])
        orden_nombre_combobox.grid(row=4, column=1, sticky="we")
        orden_nombre_combobox.set("Nombre A")

        # Contenedor para los botones
        button_container = ttk.Frame(self)
        button_container.pack(side="bottom", fill="x", padx=10, pady=(0, 10))

        # Crear botones
        ttk.Button(button_container, text="Atras").pack(side="left", padx=10, pady=5)
        ttk.Button(button_container, text="Siguiente", command=lambda: self.abrir_ventana_columnas(tables)).pack(side="left", padx=10, pady=5)

        # Etiqueta para mostrar la tabla seleccionada
        self.tabla_seleccionada_label = ttk.Label(self, textvariable=self.tabla_seleccionada)
        self.tabla_seleccionada_label.pack(side="top")

    def actualizar_indice(self, index):
        """Actualizar el índice de la tabla seleccionada."""
        self.tabla_seleccionada_index = index

    def abrir_ventana_columnas(self,tables):
        tabla_seleccionada = self.tabla_seleccionada.get()
        index_seleccionado = self.tabla_seleccionada_index
        print("Tabla seleccionada:", tabla_seleccionada)
        print("Índice seleccionado:", index_seleccionado)
        if tabla_seleccionada != "" and index_seleccionado != -1:
            ventana_columnas = VentanaColumnas(self, tables, index_seleccionado)
            ventana_columnas.grab_set()
            self.wait_window(ventana_columnas)


class VentanaColumnas(tk.Toplevel):
    def __init__(self, master, tables, index_seleccionado, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
       # self.tabla = tabla
        self.index_seleccionado = index_seleccionado

       # self.title(f"Columnas de la tabla {self.tabla}")

        # Obtener las columnas de la tabla seleccionada
        columnas = tables[self.index_seleccionado].columns
        text = ""
        # Crear Checkbuttons para cada columna
        self.column_checkboxes = []
        for columna in columnas:

            if columna.nullable is not None:
                text += " " + columna.nullable

            if columna.primaryKey is not None:
                text += " - " + columna.primaryKey
            checkbox = ttk.Checkbutton(self, text=columna.name + ':' + columna.type + text , variable=tk.BooleanVar())
            checkbox.pack(anchor=tk.W)
            self.column_checkboxes.append(checkbox)

class VentanaPrincipal(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Generar código para una aplicación UDA")
        self.geometry("600x600")  # Ajusta las dimensiones de la ventana según tus necesidades
        self.resizable(width=True, height=True)  # Permitir redimensionar la ventana

        self.grid_rowconfigure(0, weight=1)  # Ajusta el peso de la primera fila
        self.grid_columnconfigure(0, weight=1)  # Ajusta el peso de la primera columna

        self.pagina_actual = None
        self.mostrar_pagina(PaginaUno, tables=None, data_mantenimineto=None)

    def mostrar_pagina(self, pagina, tables, data_mantenimineto):
        nueva_pagina = pagina(self, tables, data_mantenimineto)
        if self.pagina_actual:
            self.pagina_actual.destroy()
        nueva_pagina.grid(row=0, column=0, sticky="nsew")
        self.pagina_actual = nueva_pagina

    def mostrar_pagina_siguiente(self, tables, data_mantenimiento=None):
        self.mostrar_pagina(ventanaPaso2, tables, data_mantenimiento)

    def mostrar_pagina_tres(self, data_mantenimiento, tables):
        self.mostrar_pagina(VentanaPaso3, tables, data_mantenimiento)

    def mostrar_pagina_cuatro(self, tables):
        self.mostrar_pagina(VentanaColumnas, tables)   

    def mostrar_pagina_anterior(self):
        self.mostrar_pagina(PaginaUno)

    


if __name__ == "__main__":
    app = VentanaPrincipal()
    app.mainloop()