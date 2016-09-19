#!/usr/bin/env python3
import sys
import csv
import Internals
def genInternalsCsv(markAttType,sem,inputfile,outputfile):
    with open(inputfile,newline='')as csvfile:
           reader=csv.DictReader(csvfile)
           my_obj=list(reader)
           newlist = sorted(my_obj, key=lambda k: k['RRN'])
           #print(newlist)--Debugging Purpose
           size_list=len(newlist)
           myTotalKeys=list(newlist[0].keys());#Getting the subject codes from header

           myTotalKeys.remove('RRN');#RRN Key is removed since it is not needed in DB.
           size_keys=len(myTotalKeys)
           myAttKeys=[]
           for i in range(size_keys):
               if '-Att' in myTotalKeys[i]:
                   myAttKeys.append(myTotalKeys[i])
           size_att_keys=len(myAttKeys)
           myMarkKeys=list(set(myTotalKeys)-set(myAttKeys))
           size_mark_keys=len(myMarkKeys)
           internal_list= []
           count=0
           if markAttType=='mark':
                      for i in range(size_list):
                          for j in range(size_mark_keys):
                              internal_list.append(Internals.Internals(newlist[i]['RRN'],myMarkKeys[j]))
                              count=count+1
                              internal_list[count-1].setIntMark(newlist[i][str(myMarkKeys[j])])
                              internal_list[count-1].setSem(sem)
           elif markAttType=='att':
                       for i in range(size_list):
                           for j in range(size_att_keys):
                               internal_list.append(Internals.Internals(newlist[i]['RRN'],myAttKeys[j].rstrip('-Att')))
                               count=count+1
                               internal_list[count-1].setIntAtt(newlist[i][str(myAttKeys[j])])
                               internal_list[count-1].setSem(sem)
           elif markAttType=='markAtt':
               for i in range(size_list):
                   for j in range(size_mark_keys):
                       internal_list.append(Internals.Internals(newlist[i]['RRN'],myMarkKeys[j]))
                       count=count+1
                       internal_list[count-1].setIntMark(newlist[i][str(myMarkKeys[j])])
                       internal_list[count-1].setIntAtt(newlist[i][str(myMarkKeys[j])+'-Att'])
                       internal_list[count-1].setSem(sem)
    with open(outputfile,'w')as writefile:
        fieldnames=['RRN','SUBJECT_CODE','INTERNALS','CUMULATIVE_ATTENDANCE','SEM_TAKEN']
        writer=csv.DictWriter(writefile,fieldnames=fieldnames)
        writer.writeheader()
        for k in range(count):
           writer.writerow({fieldnames[0]:internal_list[k].rrn,fieldnames[1]:internal_list[k].sub_code,fieldnames[2]:internal_list[k].int_mark,fieldnames[3]:internal_list[k].int_att,fieldnames[4]:internal_list[k].sem})
if(len(sys.argv)!=5):
    print('Usage: python3.x internalsHandler.py mark/att/markAtt sem inputfile.csv outputfile.csv')
else:
    genInternalsCsv(sys.argv[1],int(sys.argv[2]),sys.argv[3],sys.argv[4])
