class Column:
    # Constructor
        def __init__(self, tableName,name,type,nullable,primaryKey):
                self.tableName = tableName
                self.name = name
                self.type = type
                self.nullable = nullable
                self.primaryKey = primaryKey

        def get(self):
            return self;        