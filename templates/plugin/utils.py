def getColumnsDates(columns):
    newColumns = []
    for columnOld in columns:   
        newColumn = columnOld
        type = columnOld["type"] 
        
        if type == "NUMBER" or type == "FLOAT":
               newColumn["DATO_TYPE"] = "BigDecimal"
               newColumn["DATA_IMPORT"] = "java.math.BigDecimal"
        elif type == "LONG":
               newColumn["DATO_TYPE"] = "Long"
               newColumn["DATA_IMPORT"] = ""
        elif type == "CLOB":
               newColumn["DATO_TYPE"] = "Clob"
               newColumn["DATA_IMPORT"] = "java.sql.Clob"
        elif type == "BLOB":
              newColumn["DATO_TYPE"] = "Blob"
              newColumn["DATA_IMPORT"] = "java.sql.Clob"
        elif type == "DATE":
              newColumn["DATO_TYPE"] = "Date"
              newColumn["DATA_IMPORT"] = "java.util.Date"
        elif type == "TIMESTAMP":
              newColumn["DATO_TYPE"] = "Date"
              newColumn["column"] = "java.util.Date"
        else :
              newColumn["DATO_TYPE"] = "String"
              newColumn["DATA_IMPORT"] = ""
        newColumns.append(newColumn)        
    return newColumns

def to_camel_case(text):
    s = text.replace("-", " ").replace("_", " ")
    s = s.split()
    if len(text) == 0:
        return text
    return s[0] + ''.join(i.capitalize() for i in s[1:])

def importsFunction(columns):
    cadena = ""
    for column in columns:
        dataImport = column["DATA_IMPORT"]
        if dataImport != "" and cadena.find(dataImport) == -1:
            cadena = cadena + "import "+dataImport+"\n"
    return cadena    