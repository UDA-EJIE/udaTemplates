class Table:
    # Constructor
        def __init__(self, name,columns):
           self.name = name
           self.columns = columns

        def add_column(self, tableName,name,type,nullable,primaryKey):
            self.columns.append(tableName,name,type,nullable,primaryKey)        