def getColumnsDates(columns):
    newColumns = []
    for columnOld in columns:   
        newColumn = columnOld
        type = columnOld["type"] 
        
        if type == "FLOAT":
               newColumn["DATO_TYPE"] = "BigDecimal"
               newColumn["DATA_IMPORT"] = "java.math.BigDecimal"
        if type == "NUMBER":
               if columnOld["dataPrecision"] != None and columnOld["dataPrecision"] > 1 and columnOld["dataPrecision"] < 5:
                newColumn["DATO_TYPE"] = "Long"
                newColumn["DATA_IMPORT"] = ""
               elif columnOld["dataPrecision"] != None and columnOld["dataPrecision"] >= 5:
                newColumn["DATO_TYPE"] = "BigDecimal"
                newColumn["DATA_IMPORT"] = "java.math.BigDecimal"
               else :
                newColumn["DATO_TYPE"] = "Integer"
                newColumn["DATA_IMPORT"] = ""
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
              newColumn["DATA_IMPORT"] = "java.util.Date"
        else :
              newColumn["DATO_TYPE"] = "String"
              newColumn["DATA_IMPORT"] = ""
        #si el import ya esta, no repetimos
        if contains(newColumns, lambda x: x["DATA_IMPORT"] == newColumn["DATA_IMPORT"]): 
             newColumn["DATA_IMPORT"] = ""          
        newColumns.append(newColumn)        
    return newColumns

def to_camel_case(text):
    s = text.replace("-", " ").replace("_", " ")
    s = s.split()
    if len(text) == 0:
        return text
    return s[0] + ''.join(i.capitalize() for i in s[1:]) 

def contains(list, filter):
    for x in list:
        if filter(x):
            return True
    return False