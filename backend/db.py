"""
mysql workbench

DROP DATABASE IF EXISTS (name);
CREATE DATABASE (name);
"""

import sqlite3 as sql3
import pandas as pd
import numpy as np
# for isnan checking

def splitjoin(string, spl_list, change):
    for spl in spl_list:
        string = change.join(string.split(spl))
    return string

class db:
    def __init__(self, dbname:str):
        self.dbname = dbname
        self.conn = sql3.connect(dbname+".db")
        self.cur = self.conn.cursor()
        self.attr = {}
    def __del__(self):
        self.exit()
    def exit(self):
        self.conn.close()
    def exec(self, cmd:str):
        try:
            self.cur.execute(cmd)
        except:
            print(cmd + "exec func error")
            raise Exception("exec error")
    def fetch(self) -> list:
        try:
            return self.cur.fetchall()
        except:
            print("fetch func error")
            raise Exception("fetch error")
    def make_table(self, table_name:str, prop:dict) -> bool:
        #CREATE TABLE IF NOT EXISTS {table name} ({property} {type(len)}, {property} {type(len)})
        cmd = "create table if not exists " + table_name + " "
        if len(prop) != 0:
            cmd_list = []
            for _prop, _type_option in prop.items():
                cmd_list.append(_prop + " " + _type_option)
            cmd += "(" + ", ".join(cmd_list) + ")"
        try:
            self.exec(cmd)
            return True
        except:
            print("mk table exec error")
            return False
    def insert_table(self, table_name:str, val:list) -> bool:
        #INSERT INTO {table name} VALUES({value1}, {value2})
        if len(val) == 0:
            return False
        cmd = "insert into " + table_name + " values ("
        cmd_list = []
        for v in val:
            cmd_list.append(str(v))
        cmd += ", ".join(cmd_list) + ")"
        try:
            self.exec(cmd)
            self.conn.commit()
            return True
        except:
            print("insert table exec error")
            return False
    def select_where_table(self, table_name:str, where:dict):
        #SELECT * FROM {table name} where {prop} {operator} {condition} and {prop} {operator} {condition};
        cmd = "select * from " + table_name
        if len(where) != 0:
            cmd_list = []
            for _prop, _option_value in where.items():
                _option = _option_value[0]
                _value = _option_value[1]
                cst = _prop + " "
                if _option == "same":       cst += "= " + _value
                elif _option == "under":    cst += "< " + _value
                elif _option == "over":     cst += "> " + _value
                elif _option == "undersame":cst += "<= " + _value
                elif _option == "oversame": cst += ">= " + _value
                elif _option == "notsame":  cst += "!= " + _value
                elif _option == "is":       cst += "is " + _value #null/tf/unk
                elif _option == "isnot":    cst += "is not " + _value #null/tf/unk
                elif _option == "bw":       cst += "between " + _value.split(' ')[0] + " and " + _value.split(' ')[1]
                elif _option == "notbw":    cst += "not between " + _value.split(' ')[0] + " and " + _value.split(' ')[1]
                elif _option == "in":       cst += "in(" + ", ".join(_value) + ")"
                elif _option == "notin":    cst += "not in(" + ", ".join(_value) + ")"
                else:
                    cst += "is " + _value
                cmd_list.append(cst)
            cmd += " where " + " and ".join(cmd_list)
        try:
            self.exec(cmd)
            self.conn.commit()
            self.data = "\n".join(self.fetch())
            return self.data
        except:
            print("select where exec/fetch error")
            return ""

class user(db):
    def __init__(self, dbname:str):
        super().__init__(dbname)
        self.table_name = "user"
        self.make_table(self.table_name, {"id" : "text", "pw" : "text", "username" : "text"})
    def login(self, id:str, pw:str) -> bool:
        cmd = "select * from " + self.table_name + " where user = \"" + user + "\" and pw = \"" + pw + "\""
        try:
            self.exec(cmd)
            if len(self.fetch()) == 0:
                return False
            else:
                return True
        except:
            return False
    def signup_id(self, id:str) -> bool:
        # True : id available
        # False : id not available
        cmd = "select * from " + self.table_name + " where id = \"" + id + "\""
        try:
            self.exec(cmd)
            if len(self.fetch()) != 0:
                return False
            else:
                return True
        except:
            return False
    def signup(self, id:str, pw:str, username:str) -> bool:
        # True : signup success
        # False : signup failed
        try:
            self.insert_table(self.table_name, [id, pw, username])
            return True
        except:
            return False

class news(db):
    def __init__(self, dbname:str):
        super().__init__(dbname)
        self.table_name = "news"
        self.make_table(self.table_name, {"title" : "text", "content" : "text", "brief" : "text", "URL" : "text", "imageURL" : "text", "id" : "text", "category" : "text", "month" : "int", "date" : "int", "stringdate" : "text"})
        # title (text) / content (text) / brief (text) / URL (text) / imageURL (text) / id (text) / category (text) / month (int) / date (int) / stringdate (text)
    def insert_news(self, title:str, content:str, brief:str, URL:str, imageURL:str, id:str, category:str, month:int, date:int, stringdate:str) -> bool:
        return self.insert_table(self.table_name, [title, content, brief, URL, imageURL, id, category, month, date, stringdate])
    def get_news(self, id:str) -> str:
        cmd = "select * from " + self.table_name + " where id = \"" + id + "\""
        try:
            self.exec(cmd)
            return self.fetch()
        except:
            print("get news error")
            return ""


if __name__ == '__main__':
    db_name = input("give db name without .db : ")
    wp = db(db_name)
