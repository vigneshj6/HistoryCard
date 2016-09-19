class Cat:
   def __init__(self,rrn,sub_code,cat_mark,cat_att,sem):
      self.rrn=rrn
      self.sub_code=sub_code
      self.cat_mark=cat_mark
      self.cat_att=cat_att
      self.sem=sem
   
   def __init__(self,rrn,sub_code):
      self.rrn=rrn
      self.sub_code=sub_code
      self.cat_mark=None
      self.cat_att=None
      self.sem=None
   def setCatAtt(self,cat_att):
      self.cat_att=cat_att
   def setCatMark(self,cat_mark):
      self.cat_mark=cat_mark
   def setSem(self,sem):
      self.sem=sem
      
