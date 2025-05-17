SEPERATOR = "|||SEP|||"
overSEPERATOR = "|||OVERSEP|||"

class Commentdata():
    def __init__(self, id:str, content:str):
        self.id = id
        self.content = content
        self.posneg = 0
        self.like = 0
        self.dislike = 0
        # 0 : neutral, 1 : pos, -1 : neg
        self.additional_comment = []
    def insert_additional_comment(self, id:str, content:str) -> bool:
        # True : insert success
        # False : insert failed
        try:
            self.additional_comment.append([id, content])
            return True
        except:
            print("insert comment error")
            return False
    def get_string(self) -> str:
        # return comment string
        ret = self.id + SEPERATOR + self.content + SEPERATOR + str(self.posneg) + SEPERATOR + str(self.like) + SEPERATOR + str(self.dislike) + SEPERATOR
        for c in self.additional_comment:
            ret += c[0] + SEPERATOR + c[1] + SEPERATOR
        return ret
    def reset_using_string(self, string:str) -> bool:
        # reset comment using string
        try:
            lines = string.split(SEPERATOR)
            self.id = lines[0]
            self.content = lines[1]
            self.posneg = int(lines[2])
            self.like = int(lines[3])
            self.dislike = int(lines[4])
            self.additional_comment = []
            for i in range(5, len(lines), 2):
                if i + 1 < len(lines):
                    self.additional_comment.append([lines[i], lines[i + 1]])
            return True
        except:
            print("reset comment error")
            return False