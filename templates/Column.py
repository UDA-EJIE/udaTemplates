class Column:
    # Constructor
        def __init__(self, tableName,name,type,nullable,primaryKey,datoType,datoImport):
                self.tableName = tableName
                self.name = name
                self.type = type
                self.nullable = nullable
                self.primaryKey = primaryKey
                self.datoType = datoType
                self.datoImport = datoImport

        def get(self):
            return self;        