import json
from copier import Worker
import os
from utils import hello_world


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


    # si no existe crear la carpeta, raiz control - config java
    if os.path.isdir(destinoWarControl) == False:
        os.mkdir(destinoWarControl)
   # with Worker(src_path=dirController, dst_path=destinoWarControl, data=yaml_data, exclude=["controller*"],overwrite=True) as worker:
   #     worker.run_copy()
    for table in tables:
        #añadir funciones
        data["hello_world"] = hello_world();   
        data["tableName"] = table["name"].capitalize();  

        #controller java 
        with Worker(src_path=dirController, dst_path=destinoWarControl, data=yaml_data, exclude=["Mvc*","*RelationsImpl"],overwrite=True) as worker:
         worker.run_copy() 
        #controller relational java 
        #with Worker(src_path=dirController, dst_path=destinoWarControl, data=yaml_data, exclude=["Mvc*"],overwrite=True) as worker:
            # worker.run_copy()   
        
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

