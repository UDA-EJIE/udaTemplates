import tkinter as tk
from tkinter import ttk
import yaml
import oracledb
from Column import Column
from Table import Table
import os
from tkinter import filedialog
import json
from customtkinter import *
import plugin.paso3 as p3




class PaginaUno(CTkFrame):
    def __init__(self, master, tables=None, data_mantenimiento=None, indexSeleccionado=None, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.configure(corner_radius=10, fg_color="#E0E0E0", border_color="#69a3d6", border_width=4)
         # Configura el contenedor principal para que las columnas se expandan
        self.grid_columnconfigure(0, weight=1)  # Esto hace que la columna se expanda

        configuration_frame = CTkFrame(self)
        configuration_frame.grid(row=0, column=0, columnspan=3, sticky="ew")
        configuration_frame.grid_columnconfigure(0, weight=1) 


        configuration_label = CTkLabel(configuration_frame,  text="Crear nueva aplicación", font=("Arial", 14, "bold"))
        configuration_label.grid(row=0, column=0, columnspan=3, pady=(5, 5), padx=20, sticky="w")

        description_label = CTkLabel(configuration_frame, text="Este Wizard genera la estructura necesaria para desarrollar una aplicación estándar")
        description_label.grid(row=1, column=0, columnspan=3, pady=(5, 5), padx=20, sticky="w")

        desc_label = CTkLabel(configuration_frame, text="Seleccione el WAR al que se quiere añadir el mantenimiento y configure una conexión a la base de datos")
        desc_label.grid(row=2, column=0, columnspan=3, pady=(5, 5), padx=20, sticky="w")

        war_frame = CTkFrame(configuration_frame, fg_color="#E0E0E0", border_color="#707070", border_width=3, height=2.5, width=500)
        war_frame.grid(row=3, column=0, sticky="ew")
        war_frame.grid_columnconfigure(0, weight=1)
        war_frame.grid_rowconfigure(0, weight=1, minsize=100)

        # Crear un widget Label encima del borde del marco
        labelSecurityFrame = CTkLabel(self, text="Selección del proyecto WAR", bg_color="#E0E0E0", fg_color="#E0E0E0", text_color="black", font=("Arial", 12, "bold"))
        labelSecurityFrame.place(in_=war_frame, anchor="sw", x=10, y=35 )

        war_entry = CTkEntry(war_frame, fg_color='#69a3d6', border_color='#69a3d6', height=2.5, width=500, text_color="black")
        war_entry.grid(row=0, column=1 , padx=(0, 20), pady=(30, 2), sticky="ew")
        

         # Botones
        buscar_button = CTkButton(war_frame, text="Buscar...", command=self.probar_conexion, fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        buscar_button.grid(row=0, column=2, columnspan=2, pady=(30, 2), padx=20, sticky="ew")
      

        # Formulario
        labels = ["Service name:", "SID:", "Host:", "Puerto:", "Usuario:", "Contraseña:", "Esquema Catálogo:", "URL:"]
        self.entries = []
        
        for i, label_text in enumerate(labels):
            label = CTkLabel(self, text=label_text, fg_color="#E0E0E0", text_color="black", font=("Arial", 12, "bold"))
            label.grid(row=i+1, column=0, sticky="w", padx=(20, 10), pady=(15, 2))
            entry = CTkEntry(self, fg_color='#69a3d6', border_color='#69a3d6', height=2.5, width=500, text_color="black", show='*' if label_text == 'Contraseña:' else None)
            entry.grid(row=i+1, column=1, padx=(0, 200), pady=(15, 2), sticky="ew")
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
        d = "C:\oracle\instantclient_21_12"
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


class ventanaPaso2(CTkFrame):
    def __init__(self, master, tables, data_mantenimiento=None, indexSeleccionado=None, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.configure(corner_radius=10, fg_color="#E0E0E0", border_color="#69a3d6", border_width=2)
        self.grid_columnconfigure(1, weight=1)

        # Cabecera
        cabecera = CTkLabel(self, text="Generar nuevo mantenimiento para una aplicación", font=("Arial", 14, "bold"), text_color="black")
        cabecera.grid(row=0, column=0, columnspan=2, pady=20, padx=20, sticky="w")

        # Texto descriptivo
        texto = CTkLabel(self, text="Este Wizard genera un nuevo mantenimiento para una aplicación UDA", text_color="black")
        texto.grid(row=1, column=0, columnspan=2, padx=20, sticky="w")

        # Nombre del mantenimiento
        nombre_label = CTkLabel(self, text="Nombre del mantenimiento:", text_color="black")
        nombre_label.grid(row=2, column=0, sticky="w", padx=20)
        self.nombre_entry = CTkEntry(self)
        self.nombre_entry.grid(row=2, column=1, padx=20, pady=5, sticky="ew")

        # Título del mantenimiento
        titulo_label = CTkLabel(self, text="Título del mantenimiento:", text_color="black")
        titulo_label.grid(row=3, column=0, sticky="w", padx=20)
        self.titulo_entry = CTkEntry(self)
        self.titulo_entry.grid(row=3, column=1, padx=20, pady=5, sticky="ew")

        # Checkbox para estado de mantenimiento
        mantenimiento_checkbox = CTkCheckBox(self, text="Mantenimiento", text_color="black")
        mantenimiento_checkbox.grid(row=4, column=0, padx=20, pady=5, sticky="w")

        # Radiobuttons para tipo de mantenimiento
        tipo_label = CTkLabel(self, text="Tipo de Mantenimiento:", text_color="black")
        tipo_label.grid(row=5, column=0, sticky="w", padx=20)
        tipo_var = tk.StringVar(value="Edición en línea")
        tipo_radio1 = CTkRadioButton(self, text="Edición en línea", variable=tipo_var, value="Edición en línea", text_color="black")
        tipo_radio1.grid(row=5, column=1, sticky="w", padx=20)
        tipo_radio2 = CTkRadioButton(self, text="Formulario de detalle", variable=tipo_var, value="Formulario de detalle", text_color="black")
        tipo_radio2.grid(row=6, column=1, sticky="w", padx=20)

        # Opciones adicionales
        botonera_checkbox = CTkCheckBox(self, text="Botonera", text_color="black")
        botonera_checkbox.grid(row=7, column=0, padx=20, pady=5, sticky="w")

        menu_contextual_checkbox = CTkCheckBox(self, text="Menú contextual", text_color="black")
        menu_contextual_checkbox.grid(row=8, column=0, padx=20, pady=5, sticky="w")

        filtrado_datos_checkbox = CTkCheckBox(self, text="Filtrado de datos", text_color="black")
        filtrado_datos_checkbox.grid(row=9, column=0, padx=20, pady=5, sticky="w")

        busqueda_checkbox = CTkCheckBox(self, text="Búsqueda", text_color="black")
        busqueda_checkbox.grid(row=10, column=0, padx=20, pady=5, sticky="w")

        validaciones_cliente_checkbox = CTkCheckBox(self, text="Validaciones cliente", text_color="black")
        validaciones_cliente_checkbox.grid(row=11, column=0, padx=20, pady=5, sticky="w")

        multiseleccion_checkbox = CTkCheckBox(self, text="Multiselección", text_color="black")
        multiseleccion_checkbox.grid(row=12, column=0, padx=20, pady=5, sticky="w")

        # Footer con botones de navegación
        footer_frame = CTkFrame(self)
        footer_frame.grid(row=13, column=0, columnspan=2, pady=20, padx=20, sticky="se")
        btn_back = CTkButton(footer_frame, text="Back")
        btn_back.pack(side="left", padx=10, pady=5)
        btn_next = CTkButton(footer_frame, text="Next", command=lambda: master.mostrar_pagina_tres(data_mantenimiento, tables))
        btn_next.pack(side="left", padx=10, pady=5)
        btn_finish = CTkButton(footer_frame, text="Finish")
        btn_finish.pack(side="left", padx=10, pady=5)
        btn_cancel = CTkButton(footer_frame, text="Cancel")
        btn_cancel.pack(side="left", padx=10, pady=5)

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



class VentanaPaso3(CTkFrame):
    def __init__(self, master, tables, data_mantenimiento, indexSeleccionado=None, *args, **kwargs):
        super().__init__(master, *args, **kwargs)

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)
        self.configure(corner_radius=10, fg_color="#E0E0E0", border_color="#69a3d6", border_width=2)

        # Izquierda: Contenedor para la lista de entidades con radio buttons
        left_container = CTkFrame(self, corner_radius=5, bg_color="#E0E0E0", border_color="#69a3d6")
        left_container.grid(row=0, column=0, sticky="nswe", padx=10, pady=10)
        left_container.grid_rowconfigure(0, weight=1)
        left_container.grid_columnconfigure(0, weight=1)

        # Scrollbar para los radio buttons
        scrollbar = CTkScrollableFrame(left_container, fg_color="#E0E0E0")
        scrollbar.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.radio_var = tk.StringVar(value=tables[0].name if tables else None)  # Valor predeterminado
        
        # Creamos los radio buttons dentro del scrollbar
        for i, table in enumerate(tables):
            radio_button = CTkRadioButton(scrollbar, text=table.name, variable=self.radio_var, value=table.name, text_color="black")
            radio_button.grid(row=i, column=0, sticky="w", padx=10, pady=2)

        # Derecha: Contenedor para los campos de entrada y opciones
        right_container = CTkFrame(self, corner_radius=5, fg_color="#E0E0E0", border_color="#69a3d6")
        right_container.grid(row=0, column=1, sticky="nswe", padx=10, pady=10)
        right_container.grid_columnconfigure(1, weight=1)

        # Campos de entrada y otros widgets en el contenedor derecho
        url_label = CTkLabel(right_container, text="URL(*):", text_color="black")
        url_label.grid(row=0, column=0, sticky="w", padx=10, pady=10)
        url_entry = CTkEntry(right_container, fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        url_entry.grid(row=0, column=1, sticky="we", padx=10, pady=10)

        alias_label = CTkLabel(right_container, text="Alias(*):", text_color="black")
        alias_label.grid(row=1, column=0, sticky="w", padx=10, pady=10)
        alias_entry = CTkEntry(right_container, fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        alias_entry.grid(row=1, column=1, sticky="we", padx=10, pady=10)

        cargar_check = CTkCheckBox(right_container, text="Cargar al inicio de la ventana", text_color="black")
        cargar_check.grid(row=2, column=0, columnspan=2, sticky="w", padx=10, pady=10)

        orden_label = CTkLabel(right_container, text="Ordenación:", text_color="black")
        orden_label.grid(row=3, column=0, sticky="w", padx=10, pady=10)
        orden_combobox = CTkComboBox(right_container, values=["asc", "desc"], fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        orden_combobox.grid(row=3, column=1, sticky="we", padx=10, pady=10)

        orden_nombre_label = CTkLabel(right_container, text="Ordenación por:", text_color="black")
        orden_nombre_label.grid(row=4, column=0, sticky="w", padx=10, pady=10)
        orden_nombre_combobox = CTkComboBox(right_container, values=["cdescripcion"], fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        orden_nombre_combobox.grid(row=4, column=1, sticky="we", padx=10, pady=10)

        # Footer con botones
        footer_frame = CTkFrame(self, fg_color="#E0E0E0")
        footer_frame.grid(row=1, column=0, columnspan=2, sticky="se", padx=10, pady=10)
        
        btn_back = CTkButton(footer_frame, text="Back", fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        btn_back.pack(side="left", padx=10, pady=5)
        btn_next = CTkButton(footer_frame, text="Next", fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        btn_next.pack(side="left", padx=10, pady=5)
        btn_finish = CTkButton(footer_frame, text="Finish", fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        btn_finish.pack(side="left", padx=10, pady=5)
        btn_cancel = CTkButton(footer_frame, text="Cancel" ,fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        btn_cancel.pack(side="left", padx=10, pady=5)


    def actualizar_indice(self, index):
        """Actualizar el índice de la tabla seleccionada."""
        self.tabla_seleccionada_index = index

    def abrir_ventana_columnas(self):
        tabla_seleccionada = self.tabla_seleccionada.get()
        index_seleccionado = self.tabla_seleccionada_index
        print("Tabla seleccionada:", tabla_seleccionada)
        print("Índice seleccionado:", index_seleccionado)
        if tabla_seleccionada != "" and index_seleccionado != -1:
            return index_seleccionado
           

class VentanaColumnas(tk.Frame):
    def __init__(self, master, tables, data_mantenimineto, index_seleccionado, *args, **kwargs):
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

        # Contenedor principal con color de fondo azul oscuro
        contenedor_principal = tk.Frame(self, bg=color_principal, padx=10, pady=10)
        contenedor_principal.pack(fill=tk.BOTH, expand=True)

        # Contenedor para la cabecera
        contenedor_cabecera = tk.Frame(contenedor_principal, bg=color_principal, padx=10, pady=10)
        contenedor_cabecera.pack(fill=tk.X)

        # Cabecera con el título
        titulo_label = tk.Label(contenedor_cabecera, text="Generar nuevo mantenimiento para una aplicación", font=fuente_titulo, fg=color_secundario, bg=color_principal)
        titulo_label.pack(anchor=tk.W)

        # Descripción debajo del título
        descripcion_label = tk.Label(contenedor_cabecera, text="Este wizard genera un nuevo mantenimiento para una aplicación UDA", font=fuente_descripcion, fg=color_secundario, bg=color_principal)
        descripcion_label.pack(anchor=tk.W)

        # Texto adicional entre la cabecera y las columnas
        texto_adicional = tk.Label(contenedor_principal, text="Configure las propiedades de las columnas que aparecerán en el mantenimiento.\nNota: Solo se generarán las columnas que estén checkeadas.\nPropiedades:", font=fuente_texto_adicional, padx=10, pady=20, fg=color_secundario, bg=color_principal, justify=tk.LEFT)
        texto_adicional.pack(anchor=tk.W)

        # Canvas para contener los Checkbuttons con scrollbar
        canvas = tk.Canvas(contenedor_principal, bg=color_secundario, highlightthickness=0)
        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Contenedor para los Checkbuttons dentro del Canvas
        contenedor_checkbuttons = ttk.Frame(canvas, style="Custom.TFrame")
        canvas.create_window((0, 0), window=contenedor_checkbuttons, anchor=tk.NW)

        # Scrollbar
        scrollbar = ttk.Scrollbar(contenedor_principal, orient=tk.VERTICAL, command=canvas.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Configurar el canvas y el scrollbar
        canvas.configure(yscrollcommand=scrollbar.set)

        self.index_seleccionado = index_seleccionado
        
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

            # Marcar el Checkbutton por defecto
            var = tk.BooleanVar()
            var.set(True)

            checkbox = ttk.Checkbutton(contenedor_checkbuttons, text=columna.name + ':' + columna.type + text , variable=var, style="Custom.TCheckbutton")
            checkbox.pack(anchor=tk.W)
            self.column_checkboxes.append(checkbox)

        # Pie de página con botones
        contenedor_botones = tk.Frame(self, bg=color_principal, padx=10, pady=10)
        contenedor_botones.pack(side=tk.BOTTOM, fill=tk.X)
        

        directorioRespuestas = "C:/Users/mllorente/Desktop/Entornos_UDA/workspaces/workspace_2020_v5/udaTemplates/templates/plugin/"
        file = open(directorioRespuestas+"respuestasTablasSeleccionadas.json")
        #vendrá directamente del formulario tkinter
        tables = json.load(file)
        data = { "project_name": "aaa",
                "security_app": "",
                "war_project_name": "bbb",
                "PACKAGE_NAME": "com.ejie."+"aaa"+".control",
                "directorio_actual" : "C:/Users/mllorente/Desktop/Entornos_UDA/workspaces/workspace_2020_v5/udaTemplates/templates/generateCode/",
                "destinoApp" : "C:/pruebacopier/"
       }
        # Botones
        estilo_boton = ttk.Style()
        estilo_boton.configure("Custom.TButton", font=fuente_botones, foreground=color_principal, background=color_boton)
        back_button = ttk.Button(contenedor_botones, text="Back", style="Custom.TButton")
        back_button.pack(side=tk.RIGHT, padx=5)

        finish_button = ttk.Button(contenedor_botones, text="Finish", style="Custom.TButton",command=lambda: p3.initPaso3(tables=tables , yaml_data=data))
        finish_button.pack(side=tk.RIGHT, padx=5)

        cancel_button = ttk.Button(contenedor_botones, text="Cancel", style="Custom.TButton")
        cancel_button.pack(side=tk.RIGHT, padx=5)

        # Aplicar estilo a los Checkbuttons
        estilo_checkbutton = ttk.Style()
        estilo_checkbutton.configure("Custom.TCheckbutton", foreground=color_principal, background=color_secundario, font=fuente_texto_adicional)

        # Aplicar estilo al contenedor de los Checkbuttons
        estilo_frame = ttk.Style()
        estilo_frame.configure("Custom.TFrame", background=color_secundario, borderwidth=1, relief="solid", padding=(10, 10))


class VentanaPrincipal(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Generar código para una aplicación UDA")
        self.geometry("900x700") # Puedes ajustar las dimensiones según tus necesidades
        self.resizable(width=True, height=True)

        self.grid_rowconfigure(0, weight=1)
        self.columnconfigure(0, weight=1)

        self.pagina_actual = None

        self.mostrar_pagina(PaginaUno, tables=None, data_mantenimineto=None, indexSeleccionado=None)

    def mostrar_pagina(self, pagina, tables, data_mantenimineto, indexSeleccionado):
        nueva_pagina = pagina(self, tables, data_mantenimineto, indexSeleccionado)
        if self.pagina_actual:
            self.pagina_actual.destroy()
        nueva_pagina.grid(row=0, column=0, sticky="nsew")
        self.pagina_actual = nueva_pagina

    def mostrar_pagina_siguiente(self, tables, data_mantenimiento=None , indexSeleccionado=None):
        self.mostrar_pagina(ventanaPaso2, tables, data_mantenimiento, indexSeleccionado), 

    def mostrar_pagina_tres(self, data_mantenimiento, tables, indexSeleccionado=None):
        self.mostrar_pagina(VentanaPaso3, tables, data_mantenimiento, indexSeleccionado)

    def mostrar_pagina_cuatro(self, tables, data_mantenimineto, indexSeleccionado):
        self.mostrar_pagina(VentanaColumnas, tables, data_mantenimineto, indexSeleccionado)   

    def mostrar_pagina_anterior(self):
        self.mostrar_pagina(PaginaUno)

if __name__ == "__main__":
    app = VentanaPrincipal()
    app.mainloop()