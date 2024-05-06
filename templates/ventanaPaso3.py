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
import customtkinter as ctk




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
        buscar_button = CTkButton(war_frame, text="Buscar...", command=self.buscar_archivos, fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
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
    
    
    def buscar_archivos(self):
        """Busca archivos con terminación 'Classes' en la misma ruta del script Python."""
        folder_path = os.path.dirname(__file__)
        files = [file for file in os.listdir(folder_path) if file.endswith("War")]
        self.mostrar_resultados(files, folder_path)

    def mostrar_resultados(self, files, folder_path):
        """Muestra los archivos encontrados en una nueva ventana con radiobuttons."""
        if files:
            resultados_window = ctk.CTkToplevel(self)
            resultados_window.title("Resultados de Búsqueda")
            resultados_window.geometry("300x200")
            resultados_window.attributes('-topmost', True)  # Asegura que la ventana emergente se muestre al frente

            # Variable para almacenar el archivo seleccionado
            selected_file = tk.StringVar(value=None)

            # Frame para contener los radiobuttons
            file_frame = ctk.CTkFrame(resultados_window)
            file_frame.pack(fill="both", expand=True)

            # Añadir radiobuttons para cada archivo
            for index, file in enumerate(files):
                radiobutton = ctk.CTkRadioButton(file_frame, text=file, variable=selected_file, value=file)
                radiobutton.grid(row=index, column=0, sticky="w", padx=20, pady=2)

            # Botones de acción en el pie de página
            button_frame = ctk.CTkFrame(resultados_window)
            button_frame.pack(fill="x", pady=20)
            
            accept_button = ctk.CTkButton(button_frame, text="Aceptar", command=lambda: self.aceptar(selected_file.get()))
            accept_button.pack(side="left", padx=10, expand=True)
            cancel_button = ctk.CTkButton(button_frame, text="Cancelar", command=resultados_window.destroy)
            cancel_button.pack(side="right", padx=10, expand=True)
        else:
            ctk.CTkMessageBox.show_info("No se encontraron archivos", "No se encontraron archivos con terminación 'Classes' en la ruta actual.")

    def aceptar(self, selected_file):
        if selected_file:
            print(f"Archivo seleccionado: {selected_file}")
        else:
            print("No se seleccionó ningún archivo.")

class ventanaPaso2(CTkFrame):
    def __init__(self, master, tables, data_mantenimiento=None, indexSeleccionado=None, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.configure(corner_radius=10, fg_color="#E0E0E0", border_color="#69a3d6", border_width=2)
        self.grid_columnconfigure(1, weight=1)

        configuration_frame = CTkFrame(self)
        configuration_frame.grid(row=0, column=0, columnspan=3, sticky="ew")
        configuration_frame.grid_columnconfigure(0, weight=1) 


        configuration_label = CTkLabel(configuration_frame,  text="Crear nueva aplicación", font=("Arial", 14, "bold"))
        configuration_label.grid(row=0, column=0, columnspan=3, pady=(5, 5), padx=20, sticky="w")

        description_label = CTkLabel(configuration_frame, text="Este Wizard genera la estructura necesaria para desarrollar una aplicación estándar")
        description_label.grid(row=1, column=0, columnspan=3, pady=(5, 5), padx=20, sticky="w")

        desc_label = CTkLabel(configuration_frame, text="Seleccione el WAR al que se quiere añadir el mantenimiento y configure una conexión a la base de datos")
        desc_label.grid(row=2, column=0, columnspan=3, pady=(5, 5), padx=20, sticky="w")

        contenedor_opciones = CTkFrame(self, corner_radius=10, fg_color="#E0E0E0", border_color="#69a3d6", border_width=4)
        contenedor_opciones.grid(row=1, column=0, columnspan= 2,  sticky="nswe", padx=10, pady=10)
        contenedor_opciones.grid_columnconfigure(0, weight=1)
        contenedor_opciones.grid_rowconfigure(1, weight=1)

        # Nombre del mantenimiento
        nombre_label = CTkLabel(contenedor_opciones, text="Nombre del mantenimiento:", text_color="black")
        nombre_label.grid(row=0, column=0, sticky="w", padx=10, pady=(10,10))
        self.nombre_entry = CTkEntry(contenedor_opciones, width=400)
        self.nombre_entry.grid(row=0, column=1, padx=(10, 100),  pady=(10,10), sticky="ew")

        # Título del mantenimiento
        titulo_label = CTkLabel(contenedor_opciones, text="Título del mantenimiento:", text_color="black")
        titulo_label.grid(row=1, column=0, sticky="w", padx=10, pady=(10,10))
        self.titulo_entry = CTkEntry(contenedor_opciones, width=400)
        self.titulo_entry.grid(row=1, column=1, padx=(10, 100),  pady=(10,10), sticky="ew")

        # Checkbox para estado de mantenimiento
        mantenimiento_checkbox = CTkCheckBox(contenedor_opciones, text="Mantenimiento", text_color="black")
        mantenimiento_checkbox.grid(row=2, column=0, padx=20, pady=5, sticky="w")

        # Radiobuttons para tipo de mantenimiento
        tipo_label = CTkLabel(contenedor_opciones, text="Tipo de Mantenimiento:", text_color="black")
        tipo_label.grid(row=3, column=0, sticky="w", padx=20)
        tipo_var = tk.StringVar(value="Edición en línea")
        tipo_radio1 = CTkRadioButton(contenedor_opciones, text="Edición en línea", variable=tipo_var, value="Edición en línea", text_color="black")
        tipo_radio1.grid(row=3, column=1, sticky="w", padx=20)
        tipo_radio2 = CTkRadioButton(contenedor_opciones, text="Formulario de detalle", variable=tipo_var, value="Formulario de detalle", text_color="black")
        tipo_radio2.grid(row=4, column=1, sticky="w", padx=20)

        # Checkbox para estado de mantenimiento
        detalle_servidor_checkbox = CTkCheckBox(contenedor_opciones, text="Mantenimiento", text_color="black")
        detalle_servidor_checkbox.grid(row=5, column=1, padx=20, pady=5, sticky="w")

        # Radiobuttons para tipo de mantenimiento
        tipologia_label = CTkLabel(contenedor_opciones, text="Recuperar datos de detalle desde servidor", text_color="black")
        tipologia_label.grid(row=6, column=1, sticky="w", padx=20)

        tipologia_label_combobox = CTkComboBox(contenedor_opciones, values=["SAVE", "SAVE_REPEAT"], fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        tipologia_label_combobox.grid(row=6, column=1, sticky="w", padx=(200, 20), pady=10)

        # Opciones adicionales
        botonera_checkbox = CTkCheckBox(contenedor_opciones, text="Botonera", text_color="black")
        botonera_checkbox.grid(row=7, column=0, padx=20, pady=5, sticky="w")

        menu_contextual_checkbox = CTkCheckBox(contenedor_opciones, text="Menú contextual", text_color="black")
        menu_contextual_checkbox.grid(row=8, column=0, padx=20, pady=5, sticky="w")

        filtrado_datos_checkbox = CTkCheckBox(contenedor_opciones, text="Filtrado de datos", text_color="black")
        filtrado_datos_checkbox.grid(row=9, column=0, padx=20, pady=5, sticky="w")

        busqueda_checkbox = CTkCheckBox(contenedor_opciones, text="Búsqueda", text_color="black")
        busqueda_checkbox.grid(row=10, column=0, padx=20, pady=5, sticky="w")

        validaciones_cliente_checkbox = CTkCheckBox(contenedor_opciones, text="Validaciones cliente", text_color="black")
        validaciones_cliente_checkbox.grid(row=11, column=0, padx=20, pady=5, sticky="w")

        multiseleccion_checkbox = CTkCheckBox(contenedor_opciones, text="Multiselección", text_color="black")
        multiseleccion_checkbox.grid(row=12, column=0, padx=20, pady=5, sticky="w")

        # Footer con botones de navegación
        footer_frame = CTkFrame(self)
        footer_frame.grid(row=3, column=0, columnspan=2, pady=20, padx=20, sticky="se")
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
            radio_button = CTkRadioButton(scrollbar, text=table.name, variable=self.radio_var, value=table.name, text_color="black", command=lambda i=i: self.actualizar_indice(i))
            radio_button.grid(row=i, column=0, sticky="w", padx=10, pady=2)

        # Si no se proporciona un índice seleccionado, usamos 0 por defecto
        if indexSeleccionado is None:
            indexSeleccionado = 0
        self.tabla_seleccionada_index = indexSeleccionado

        # Asegurarse de que el índice predeterminado se maneja desde el inicio
        self.actualizar_indice(indexSeleccionado)

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
        btn_next = CTkButton(footer_frame, text="Next", fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"), command=lambda : master.mostrar_pagina_cuatro(tables, data_mantenimiento, self.abrir_ventana_columnas()))
        btn_next.pack(side="left", padx=10, pady=5)
        btn_finish = CTkButton(footer_frame, text="Finish", fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        btn_finish.pack(side="left", padx=10, pady=5)
        btn_cancel = CTkButton(footer_frame, text="Cancel" ,fg_color='#69a3d6', text_color="black", font=("Arial", 12, "bold"))
        btn_cancel.pack(side="left", padx=10, pady=5)


    def actualizar_indice(self, index):
        """Actualizar el índice de la tabla seleccionada."""
        self.tabla_seleccionada_index = index
        print("Índice seleccionado:", index)

    def abrir_ventana_columnas(self):
        """Usar el índice seleccionado para abrir otra ventana o realizar alguna acción."""
        index_seleccionado = self.tabla_seleccionada_index
        print("Índice seleccionado:", index_seleccionado)
        return index_seleccionado
           
class VentanaColumnas(CTkFrame):
    def __init__(self, master, tables, data_mantenimiento, index_seleccionado, *args, **kwargs):
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
        # Contenedor principal
        contenedor_principal = ctk.CTkFrame(self)
        contenedor_principal.grid(row=3, column=0, sticky="nsew", padx=10, pady=10)
        contenedor_principal.grid_columnconfigure(0, weight=1)
        contenedor_principal.grid_rowconfigure(0, weight=1)
        # # Configuración del grid para que el contenedor principal expanda correctamente
        # self.grid_rowconfigure(0, weight=1)
        # self.grid_columnconfigure(0, weight=1)
        # contenedor_principal.grid_columnconfigure(0, weight=1)

        # # Cabecera con el título
        # titulo_label = ctk.CTkLabel(contenedor_principal, text="Generar nuevo mantenimiento para una aplicación", text_color="black")
        # titulo_label.grid(row=0, column=0, sticky="w")

        # # Descripción debajo del título
        # descripcion_label = ctk.CTkLabel(contenedor_principal, text="Este wizard genera un nuevo mantenimiento para una aplicación UDA", fg_color="#E0E0E0", text_color="black")
        # descripcion_label.grid(row=1, column=0, sticky="w")

        # # Texto adicional
        # texto_adicional = ctk.CTkLabel(contenedor_principal, text="Configure las propiedades de las columnas que aparecerán en el mantenimiento.\nNota: Solo se generarán las columnas que estén checkeadas.\nPropiedades:", text_color="black", justify="left")
        # texto_adicional.grid(row=2, column=0, sticky="w", padx=10, pady=20)

        # Contenedor Scrollable para los Checkbuttons
        scrollable_container = ctk.CTkScrollableFrame(contenedor_principal, fg_color="#E0E0E0", width=400, height=300)
        scrollable_container.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)


        # Checkbuttons para cada columna
        self.column_checkboxes = []
        for i, columna in enumerate(tables[index_seleccionado].columns):
            text = ""
            if columna.nullable:
                text += " Nullable"
            if columna.primaryKey:
                text += " PK"
            var = ctk.BooleanVar(value=True)
            checkbox = ctk.CTkCheckBox(scrollable_container, text=f"{columna.name}: {columna.type}{text}", variable=var, text_color="black", font=("Arial", 12, "bold"))
            checkbox.grid(row=i, column=0, sticky="w")

        # Botones
        contenedor_botones = ctk.CTkFrame(self, fg_color="#E0E0E0")
        contenedor_botones.grid(row=4, column=0, sticky="se", padx=10, pady=10)

        back_button = ctk.CTkButton(contenedor_botones, text="Back")
        back_button.grid(row=0, column=0, padx=5, sticky="e")

        finish_button = ctk.CTkButton(contenedor_botones, text="Finish", command=lambda: self.finish_action(tables, data_mantenimiento))
        finish_button.grid(row=0, column=1, padx=5, sticky="e")

        cancel_button = ctk.CTkButton(contenedor_botones, text="Cancel")
        cancel_button.grid(row=0, column=2, padx=5, sticky="e")



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