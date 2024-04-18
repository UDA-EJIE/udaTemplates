import json
from copier import Worker
import os
from utils import getColumnsDates
from datetime import datetime
from utils import snakeToCamel
from utils import toCamelCase
import operator

#INICIO función principal
def initPaso3(tables,yaml_data):
    # work only controller
    proyectName = yaml_data["project_name"]
    proyectWar = yaml_data["war_project_name"]
    directorio_actual = yaml_data["directorio_actual"] 
    dirController = directorio_actual+"controller/" 
    rutaWar = "src/com/ejie/"+proyectName+"/control" 
    war = proyectName+proyectWar+"War";
    destinoWar = yaml_data["destinoApp"]+war+"/" 
    destinoWarViews = destinoWar+"WebContent/WEB-INF/views/"
    dirMaintJsp = directorio_actual+"maint/"
    data["proyectName"] = proyectName
    data["proyectWar"] = proyectWar
    dirMaintJspIncludes = dirMaintJsp + "includes/"
    data["maint"] = {"detailSaveButton":True, "filterMaint":True}
    destinoStaticsJs = yaml_data["destinoApp"]+proyectName+"Statics/WebContent/"+proyectName+"/scripts/"+proyectName+proyectWar+"/" 

   # with Worker(src_path=dirController, dst_path=destinoWarControl, data=yaml_data, exclude=["controller*"],overwrite=True) as worker:
   #     worker.run_copy()
    data["packageName"] = "com.ejie."+proyectName  
    for table in tables:
        #añadir funciones
        columnsDates = getColumnsDates(table["columns"]) 
        data["listPks"] = columnsDates[1]  
        columnas = columnsDates[0]
        allColumnsNoPk = [x for x in columnas if x['primaryKey'] != 'P']
        allColumns = columnsDates[1] + allColumnsNoPk
        data["columnsDates"] = columnsDates[0]
        data["allColumns"] = allColumns
        data["allColumnsNoPk"] = allColumnsNoPk
        tNameOriginal = table["name"]
        tName = snakeToCamel(tNameOriginal) 
        data["tableNameOriginal"] = tNameOriginal
        data["tableName"] = tName[0].capitalize() + tName[1:] 
        data["tableNameDecapitalize"] = tName  
        data["titleMaint"]  = table["name"] + " MAINT"
        data["nameMaint"]  = table["name"] 
        data["urlBase"]  = "../"+table["name"]
        data["filterMaint"]  = True
        data["typeMaint"] = "DETAIL"
        data["urlStatics"]  = "../"+table["name"]
        destinoWarViewsFinal = destinoWarViews + tName.lower() +"/"
        destinoWarViewsFinalIncludes = destinoWarViewsFinal +"includes/"  
        data["maint"]["primaryKey"] = data["listPks"][0]      

        #Generando jsp MAINT 
        with Worker(src_path=dirMaintJsp, dst_path=destinoWarViewsFinal, data=yaml_data, exclude=["*.js"],overwrite=True) as worker:
         worker.jinja_env.filters["toCamelCase"] = toCamelCase
         worker.run_copy() 
        #Generando jsp Includes MAINT 
        with Worker(src_path=dirMaintJspIncludes, dst_path=destinoWarViewsFinalIncludes, data=yaml_data,overwrite=True) as worker:
         worker.jinja_env.filters["toCamelCase"] = toCamelCase
         worker.run_copy()
        #Generando js MAINT 
        with Worker(src_path=dirMaintJsp, dst_path=destinoStaticsJs, data=yaml_data, exclude=["*.jsp"],overwrite=True) as worker:
         worker.jinja_env.filters["toCamelCase"] = toCamelCase
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
initPaso3(tables,data)  

