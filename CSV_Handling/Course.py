class Course:
   def __init__(self,rrn,sub_code,sem,grade,date_passing,numArrear,numRedo):
      self.rrn=rrn
      self.sub_code=sub_code
      self.sem=sem
      self.grade=grade
      self.date_passing
      self.numArrear=numArrear
      self.numRedo=numRedo

   def __init__(self,rrn,sub_code,grade):
      self.rrn=rrn
      self.sub_code=sub_code
      self.grade=grade
      self.date_passing=None
      self.numArrear=None
      self.numRedo=None
      self.sem=None

   def setDatePassing(self,date_passing):
      self.date_passing=date_passing
   def setNumArrear(self,numArrear):
      self.numArrear=numArrear
   def setSem(self,sem):
      self.sem=sem
   def setNumRedo(self,numRedo):
       self.numRedo=numRedo
