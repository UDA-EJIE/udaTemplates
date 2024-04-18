import json
from copier import Worker
import os
from utils import getColumnsDates
from datetime import datetime
from utils import snakeToCamel
from utils import toCamelCase
import operator

#INICIO función principal
def initPaso2(tables,yaml_data):
    # work only controller
    proyectName = yaml_data["project_name"]
    proyectWar = yaml_data["war_project_name"]
    directorio_actual = yaml_data["directorio_actual"] 
    dirController = directorio_actual+"controller/" 
    rutaWar = "src/com/ejie/"+proyectName+"/control" 
    war = proyectName+proyectWar+"War";
    destinoWar = yaml_data["destinoApp"]+war+"/" 
    destinoWarControl = destinoWar+rutaWar
    dirService = directorio_actual+"service/" 
    destinoEarService = yaml_data["destinoApp"]+proyectName+"EARClasses/src/com/ejie/"+proyectName+"/service"
    dirDao = directorio_actual+"dao/" 
    destinoEarDao = yaml_data["destinoApp"]+proyectName+"EARClasses/src/com/ejie/"+proyectName+"/dao"
    dirModel = directorio_actual+"model/" 
    destinoEarModel = yaml_data["destinoApp"]+proyectName+"EARClasses/src/com/ejie/"+proyectName+"/model"


    # si no existe crear la carpeta, raiz control - config java
    if os.path.isdir(destinoWarControl) == False:
        os.mkdir(destinoWarControl)
    data["packageName"] = "com.ejie."+proyectName  
    for table in tables:
        #añadir funciones
        columnsDates = getColumnsDates(table["columns"]) 
        data["listPks"] = columnsDates[1]  
        columnas = columnsDates[0]
        allColumns = columnsDates[1] + [x for x in columnas if x['primaryKey'] != 'P']
        data["columnsDates"] = columnsDates[0]
        data["allColumns"] = allColumns
        tNameOriginal = table["name"]
        tName = snakeToCamel(tNameOriginal) 
        data["tableNameOriginal"] = tNameOriginal
        data["tableName"] = tName[0].capitalize() + tName[1:] 
        data["tableNameDecapitalize"] = tName    
        #Fecha creación controllers
        now = datetime.now()        
        data["date"] = now.strftime('%d-%b-%Y %H:%M:%S')    

        #controller java 
    #    with Worker(src_path=dirController, dst_path=destinoWarControl, data=yaml_data, exclude=["Mvc*","*RelationsImpl"],overwrite=True) as worker:
     #    worker.run_copy() 

        #Fecha creación services
        now = datetime.now()        
        data["date"] = now.strftime('%d-%b-%Y %H:%M:%S') 
        data["project_name"] = proyectName 
        #service java 
     #   with Worker(src_path=dirService, dst_path=destinoEarService, data=yaml_data, exclude=["*Rel*"],overwrite=True) as worker:
     #     worker.run_copy()   

        #Fecha creación Daos
        now = datetime.now()        
        data["date"] = now.strftime('%d-%b-%Y %H:%M:%S')  
        #Daos java 
      #  with Worker(src_path=dirDao, dst_path=destinoEarDao, data=yaml_data, exclude=["*Rel*"],overwrite=True) as worker:
      #   worker.jinja_env.filters["toCamelCase"] = toCamelCase
      #   worker.run_copy()  
        
        #Fecha creación Models
        now = datetime.now()        
        data["date"] = now.strftime('%d-%b-%Y %H:%M:%S')  
        #Models java 
        with Worker(src_path=dirModel, dst_path=destinoEarModel, data=yaml_data, exclude=["*model*"],overwrite=True) as worker:
            worker.jinja_env.filters["toCamelCase"] = toCamelCase
            worker.jinja_env.filters["snakeToCamel"] = snakeToCamel
            worker.run_copy()       
        
#FIN función principal
                  
#variables
directorioRespuestas = "C:/aplic/x21aVersiones/4.x.x/udaTemplates/udaTemplates/templates/plugin/"
file = open(directorioRespuestas+"respuestasTablasSeleccionadas.json")
#vendrá directamente del formulario tkinter
tables = json.load(file)
data = { "project_name": "ppp",
        "security_app": "",
        "war_project_name": "Www",
        "PACKAGE_NAME": "com.ejie."+"ppp"+".control",
        "directorio_actual" : "C:/aplic/x21aVersiones/4.x.x/udaTemplates/udaTemplates/templates/generateCode/",
        "destinoApp" : "C:/entorno/eclipseEsperanzaW11/eclipse202003EsperanzaW11/runtime-EclipseApplication/"
       }
initPaso2(tables,data)  

