"""
mysql workbench

DROP DATABASE IF EXISTS (name);
CREATE DATABASE (name);
"""

import sqlite3 as sql3
import pandas as pd
import numpy as np
import datetime
from poco_data import *
# for isnan checking

def splitjoin(string, spl_list, change):
    for spl in spl_list:
        string = change.join(string.split(spl))
    return string

def nowtime():
    # return current time in yyyymmddhhmmss
    now = datetime.datetime.now()
    return int(now.strftime("%Y%m%d%H%M%S"))

def timesubdate(time:int, subdate:int) -> int:
    # return time - subdate in yyyymmddhhmmss
    date = datetime.datetime.strptime(str(time), "%Y%m%d%H%M%S")
    date = date - datetime.timedelta(days=subdate)
    return int(date.strftime("%Y%m%d%H%M%S"))

class DB:
    def __init__(self, dbname:str):
        self.dbname = dbname
        self.conn = sql3.connect(dbname+".db")
        self.cur = self.conn.cursor()
        self.attr = []
    def __del__(self):
        self._exit()
    def _exit(self):
        self.conn.close()
    def _exec(self, cmd:str):
        try:
            self.cur.execute(cmd)
            self.conn.commit()
        except:
            print(cmd + "exec func error")
            raise Exception("exec error")
    def _fetch(self) -> list:
        # list of dictioinaries
        # [{prop1 : value1, prop2 : value2}, {prop1 : value1, prop2 : value2}]
        try:
            ret = self.cur.fetchall()
            if len(ret) == 0:
                return []
            else:
                ret_list = []
                for r in ret:
                    ret_dict = {}
                    for i, v in enumerate(r):
                        ret_dict[self.attr[i]] = v
                    ret_list.append(ret_dict)
                return ret_list
        except:
            print("fetch func error")
            raise Exception("fetch error")
    def _make_table(self, table_name:str, prop:dict) -> bool:
        #CREATE TABLE IF NOT EXISTS {table name} ({property} {type(len)}, {property} {type(len)})
        cmd = "create table if not exists " + table_name + " "
        if len(prop) != 0:
            cmd_list = []
            for _prop, _type_option in prop.items():
                cmd_list.append(_prop + " " + _type_option)
                self.attr.append(_prop)
            cmd += "(" + ", ".join(cmd_list) + ")"
        try:
            self._exec(cmd)
            return True
        except:
            print("mk table exec error")
            return False
    def _insert_table(self, table_name:str, val:list) -> bool:
        #INSERT INTO {table name} VALUES({value1}, {value2})
        if len(val) == 0:
            return False
        cmd = "insert into " + table_name + " values ("
        cmd_list = []
        for v in val:
            cmd_list.append(str(v))
        cmd += ", ".join(cmd_list) + ")"
        try:
            self._exec(cmd)
            return True
        except:
            print("insert table exec error")
            return False
    def _find_table(self, table_name:str, where:dict, orderbydict:dict, limit = 0) -> list:
        #SELECT * FROM {table name} where {prop} {operator} {condition} and {prop} {operator} {condition} order by {prop} asc/desc {prop} asc/desc limit {num};
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
        if len(orderbydict) != 0:
            cmd_list = []
            for _prop, _option in orderbydict.items():
                cmd_list.append(_prop + " " + _option)
            cmd += " order by " + ", ".join(cmd_list)
        if limit != 0:
            cmd += " limit " + str(limit)
        try:
            self._exec(cmd)
            return self._fetch()
        except:
            print("select where exec/fetch error")
            return []
    def _update_table(self, table_name:str, where:dict, content:dict) -> bool:
        #UPDATE {table name} set {prop} {value}, {prop} {value} where {prop} {operator} {condition} and {prop} {operator} {condition};
        cmd = "update " + table_name
        if len(content) != 0:
            cmd_list = []
            for _prop, _option in content.items():
                cmd_list.append(_prop + "=" + _option)
            cmd += " set " + ", ".join(cmd_list)
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
            self._exec(cmd)
            return True
        except:
            print("update where exec error")
            return False

class UserDB(DB):
    def __init__(self, dbname:str):
        super().__init__(dbname)
        self.table_name = "user"
        self._make_table(self.table_name, {"id" : "text", "pw" : "text", "username" : "text"})
    def login(self, id:str, pw:str) -> bool:
        try:
            if len(self._find_table(self.table_name, {"id" : ["same", id], "pw" : ["same", pw]}, {})) == 0:
                return False
            else:
                return True
        except:
            return False
    def signup_id(self, id:str) -> bool:
        # True : id available
        # False : id not available
        try:
            if len(self._find_table(self.table_name, {"id" : ["same", id]}, {})) != 0:
                print("id already exists")
                return False
            else:
                return True
        except:
            return False
    def signup(self, id:str, pw:str, username:str) -> bool:
        # True : signup success
        # False : signup failed
        try:
            self._insert_table(self.table_name, [id, pw, username])
            return True
        except:
            return False
    def get_user(self, id:str) -> dict:
        # find user in user database
        try:
            return self._find_table(self.table_name, {"id" : ["same", id]}, {})[0]
        except:
            print("find user error")
            return {}
    def get_username(self, id:str) -> str:
        # find user in user database
        try:
            return self._find_table(self.table_name, {"id" : ["same", id]}, {})[0]["username"]
        except:
            print("find user error")
            return ""

class NewsDB(DB):
    def __init__(self, dbname:str):
        super().__init__(dbname)
        self.table_name = "news"
        self.news_id = 0
        self._make_table(self.table_name, {"news_id" : "int", "title" : "text", "content" : "text", "brief" : "text", "URL" : "text", "imageURL" : "text", "date" : "int", "good" : "int", "bad" : "int", "opinion" : "int", "category" : "text", "id" : "text", "comment" : "text"})
        # title (text) / content (text) / brief (text) / URL (text) / imageURL (text) / date (int, yyyymmddhhmmss) / good (int) / bad (int) / opinion (int) / category (text) / id (text) / comment (text)

    def insert_news(self, title:str, content:str, brief:str, URL:str, imageURL:str, category:str, id:str) -> bool:
        # True : insert success
        # False : insert failed
        try:
            if self.title_news(title) != {}:
                print("title already exists")
                return False
            news_id = self.news_id + 1
            date = nowtime()
            good = 0
            bad = 0
            opinion = 0
            comment = ""
            self._insert_table(self.table_name, [news_id, title, content, brief, URL, imageURL, date, good, bad, opinion, category, id, comment])
            self.news_id = news_id
            return True
        except:
            print("insert news error")
            return False
        
    def update_news(self, news_id:int, good=None, bad=None, opinion=None, commentlist:list=None) -> bool:
        # True : update success
        # False : update failed
        # comment : list of comment
        # comment = Commentdata()
        try:
            if self.get_news(news_id) == {}:
                print("news not found")
                return False
            for attr in ["good", "bad", "opinion", "comment"]:
                if eval(attr) != None:
                    if attr == "comment":
                        comment = overSEPERATOR.join(list(map(lambda x : x.get_string(), commentlist)))
                        self._update_table(self.table_name, {"news_id" : ["same", news_id]}, {attr : comment})
                    else:
                        self._update_table(self.table_name, {"news_id" : ["same", news_id]}, {attr : str(eval(attr))})
            return True
        except:
            print("update news error")
            return False

    def get_news(self, news_id:int) -> dict:
        # find news in news database
        try:
            return self._find_table(self.table_name, {"news_id" : ["same", news_id]}, {})[0]
        except:
            print("find news error")
            return {}

    def title_news(self, title:str) -> dict:
        # find title in news database
        try:
            return self._find_table(self.table_name, {"title" : ["same", title]}, {})[0]
        except:
            print("find title error")
            return {}

    def recent_news(self, num:int) -> list:
        try:
            return self._find_table(self.table_name, {}, {"date" : "desc"}, num)
        except:
            print("recent news error")
            return []

    def hot_news(self, num:int, subdate = 14) -> list:
        # subdate : recent days (default 14)
        # num : number of news
        try:
            return self._find_table(self.table_name, {"date" : ["over", timesubdate(nowtime, subdate)]}, {"opinion" : "desc"}, num)
        except:
            print("hot news error")
            return ""

    def category_news(self, category:str, num:int) -> list:
        try:
            return self._find_table(self.table_name, {"category" : ["same", category]}, {"date" : "desc"}, num)
        except:
            print("category news error")
            return ""

if __name__ == '__main__':
    db_name = "temp.db" # database name
    wp = db(db_name)
