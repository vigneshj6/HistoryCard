class Internals:
   def __init__(self,rrn,sub_code,int_mark,int_att,sem):
      self.rrn=rrn
      self.sub_code=sub_code
      self.int_mark=cat_mark
      self.int_att=cat_att
      self.sem=sem

   def __init__(self,rrn,sub_code):
      self.rrn=rrn
      self.sub_code=sub_code
      self.int_mark=None
      self.int_att=None
      self.sem=None
   def setIntAtt(self,int_att):
      self.int_att=int_att
   def setIntMark(self,int_mark):
      self.int_mark=int_mark
   def setSem(self,sem):
      self.sem=sem
