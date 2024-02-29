import json
from copier import Worker
import os
from plugin.utils import getColumnsDates
from datetime import datetime


#INICIO función principal
def initPaso3(columns, yaml_data):
    # work only controller
    proyectName = yaml_data["project_name"]
    proyectWar = yaml_data["war_project_name"]
    directorio_actual = yaml_data["directorio_actual"] 
    dirMaint = directorio_actual+"maa¡intPlugingNuevo/" 
    rutaWar = "src/com/ejie/"+proyectName+"/control" 
    war = proyectName+proyectWar+"War"
    destinoWar = yaml_data["destinoApp"]+war+"/" 
    destinoWarControl = destinoWar+rutaWar
    dirService = directorio_actual+"service/" 
    destinoEarService = yaml_data["destinoApp"]+proyectName+"EARClasses/src/com/ejie/"+proyectName+"/service"
    dirDao = directorio_actual+"dao/" 
    destinoEarDao = yaml_data["destinoApp"]+proyectName+"EARClasses/src/com/ejie/"+proyectName+"/dao"



    #maintSimple.jsp  
    with Worker(src_path=dirMaint, dst_path=destinoWarControl, data=yaml_data, overwrite=True) as worker:
          worker.run_copy() 


    try {
			final String pathTemplates = Activator.getDefault().getPreferenceStore().getString(Constants.PREF_TEMPLATES_UDA_LOCALPATH);
			
			String path = "";
			String pathWar = pathTemplates + Constants.PREF_DEFAULT_TEMPLATES_UDA_LOCALPATH_MAINT;
			
			// Añadir las JSP del mantenimiento
			path = ProjectWorker.createGetFolderPath(projectWar, "WebContent/WEB-INF/views/" + entityName);
			monitor.setTaskName("Generando JSPs...");
			ProjectWorker.createFileTemplate(pathWar, path, "maintSimple-includes.jsp", context, entityName + "-includes.jsp");
			ProjectWorker.createFileTemplate(pathWar, path, "maintSimple.jsp", context, entityName + ".jsp");
			monitor.worked(1);
			
			// Se crean los includes
			String pathInclude = ProjectWorker.createGetFolderPath(projectWar, "WebContent/WEB-INF/views/" + entityName+"/includes");
			
			// Recupera el tiles.xml
			path = ProjectWorker.createGetFolderPath(projectWar, "WebContent/WEB-INF/views/");
			File xmlFile = new File(path + "/tiles.xml");
			
			// Si no quieres mantenimiento, no se crea la JSP.
			if (maint.getIsMaint()) {
				if (maint.getTypeMaint().equals("DETAIL")) {
					ProjectWorker.createFileTemplate(pathWar, pathInclude, "maintEdit.jsp", context, maint.getNameMaint() + "Edit.jsp");
					ProjectWorker.createFileTemplate(pathWar, pathInclude, "maintEditForm.jsp", context, maint.getNameMaint() + "EditForm.jsp");
					editTiles(path, entityName, maint.getNameMaint() + "EditForm", xmlFile, false);
				} else if (maint.getTypeMaint().equals("INLINE")) {
					ProjectWorker.createFileTemplate(pathWar, pathInclude, "maintInlineEditAuxForm.jsp", context, maint.getNameMaint() + "InlineEditAuxForm.jsp");
					editTiles(path, entityName, maint.getNameMaint() + "InlineEditAuxForm", xmlFile, false);
				}
			}
			// Si no quieres filtro, no se crea la JSP.
			if (maint.getFilterMaint()) {
				ProjectWorker.createFileTemplate(pathWar, pathInclude, "maintFilterForm.jsp", context, maint.getNameMaint() + "FilterForm.jsp");
			}
			console.println("JSPs generados en el proyecto WAR: " + (String)context.get(Constants.WAR_NAME_PATTERN), Constants.MSG_INFORMATION);
			console.println("\t" + entityName + "-includes.jsp", Constants.MSG_INFORMATION);
			console.println("\t" + entityName + ".jsp", Constants.MSG_INFORMATION);
	
			monitor.setTaskName("Modificando tiles.xml...");
			console.println("Modificación del fichero tiles.xml", Constants.MSG_INFORMATION);
			
			// Edita el tiles.xml y Añade la referencia del nuevo mantenimiento en el caso que no exista
			editTiles(path, entityName, entityTableName, xmlFile, true);
			
			// Editar MENU
			path = ProjectWorker.createGetFolderPath(projectWar, "WebContent/WEB-INF/layouts/");
			File jspFile = new File(path + "/menuMantenimientos.jsp");
			// Añadir el mantenimiento
			editMenu(path, entityName, entityTableName, jspFile);
			
			monitor.worked(1);
			
			// Recupera el Workspace
			IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();
			// Recupero el proyecto de Statics de UDA
			IProject projectStatics = root.getProject((String)context.get(Constants.STATICS_PATTERN));
			
			if (projectStatics != null){
				monitor.setTaskName("Generando JavaScript...");
				
				// Añadir el JS del mantenimiento al proyecto de estáticos
				path = ProjectWorker.createGetFolderPath(projectStatics, "WebContent/" + appCode + "/scripts/" + warName);
				ProjectWorker.createFileTemplate(pathWar, path, "maintSimple.js", context, entityName + ".js");
				
				monitor.worked(1);
				console.println("JavaScript generado en el proyecto de estáticos: " + (String)context.get(Constants.STATICS_PATTERN), Constants.MSG_INFORMATION);
				console.println("\t" + entityName + ".js", Constants.MSG_INFORMATION);
				// Refresca el proyecto de Statics
				ProjectWorker.refresh(projectStatics);
			}
			
			// Refresca el proyecto WAR
			ProjectWorker.refresh(projectWar);
			
			// Visualiza el sumario de tareas
			this.summary = createSummary(context);
		} catch (Exception e) {
			console.println(e.toString(), Constants.MSG_ERROR);
			throw e;
		}		
		console.println("UDA - END", Constants.MSG_INFORMATION)
	}
	



    # si no existe crear la carpeta, raiz control - config java
    if os.path.isdir(destinoWarControl) == False:
        os.mkdir(destinoWarControl)
   # with Worker(src_path=dirController, dst_path=destinoWarControl, data=yaml_data, exclude=["controller*"],overwrite=True) as worker:
   #     worker.run_copy()
    data["packageName"] = "com.ejie."+proyectName  
    for table in tables:
        #añadir funciones
        columnsDates = getColumnsDates(table["columns"]) 
        yaml_data["listPks"] = columnsDates[1]  
        yaml_data["columnsDates"] = columnsDates[0]
        tName = table["name"]
        yaml_data["tableName"] = tName[0].capitalize() + tName[1:] 
        yaml_data["tableNameDecapitalize"] = tName    
        #Fecha creación controllers
        now = datetime.now()        
        yaml_data["date"] = now.strftime('%d-%b-%Y %H:%M:%S')    

        #controller java 
        with Worker(src_path=dirController, dst_path=destinoWarControl, data=yaml_data, exclude=["Mvc*","*RelationsImpl"],overwrite=True) as worker:
          worker.run_copy() 

        #Fecha creación services
        now = datetime.now()        
        data["date"] = now.strftime('%d-%b-%Y %H:%M:%S') 
        data["project_name"] = proyectName 
        #service java 
        with Worker(src_path=dirService, dst_path=destinoEarService, data=yaml_data, exclude=["*Rel*"],overwrite=True) as worker:
           worker.run_copy()   

        #Fecha creación Daos
        now = datetime.now()        
        data["date"] = now.strftime('%d-%b-%Y %H:%M:%S')  
        #Daos java 
        with Worker(src_path=dirDao, dst_path=destinoEarDao, data=yaml_data, exclude=["*Rel*"],overwrite=True) as worker:
            worker.run_copy()    
        
#FIN función principal
                  
#variables
directorioRespuestas = "C:/Users/mllorente/Desktop/Entornos_UDA/workspaces/workspace_2020_v5/udaTemplates/templates/plugin/"
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
#initPaso2(tables,data)  

