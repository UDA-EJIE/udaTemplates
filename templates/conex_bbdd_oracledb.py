import oracledb
from Column import Column
from Table import Table
from datetime import datetime
import json
from plugin.utils import snakeToCamel

tables = [] 
columns = [] 
un = 'x21b'
cs = 'x21d:1530/x21.ejie.eus' 
pw = 'x21b'
d = "C:\python\oracle\instantclient_21_12"
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
print("inicio: " + str(datetime.now())) 
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
            #snakeCamelCase
            tableNameBBDD = snakeToCamel(tableNameBBDD)   
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

print("numero tablas " + str(len(tables)))   

tables.sort(key=lambda x: x.name)
for tb in tables:
    y = json.dumps(tb.__dict__, default=lambda o: o.__dict__)
    tablae = json.loads(y)
    if tb.name == 'MULTI_PK':
        print(y)
print("fin: " + str(datetime.now()))    