from db import *
from poco_data import *

class DBservice():
    def __init__(self):
        self.newsDB = NewsDB()

    def get_all(self):
        return self.newsDB.get_all()

    def get_by_id(self, id):
        return self.newsDB.get_by_id(id)

    def add(self, data):
        return self.newsDB.add(data)

    def update(self, id, data):
        return self.newsDB.update(id, data)

    def delete(self, id):
        return self.newsDB.delete(id)