#!/usr/bin/env python3
import sys,getopt
import csv
import Cat
def genCatCsv(catType,markAttType,sem,inputfile,outputfile):
    with open(inputfile,newline='')as csvfile:
           reader=csv.DictReader(csvfile)
           my_obj=list(reader)
           newlist = sorted(my_obj, key=lambda k: k['RRN'])
           #print(newlist)--Debugging Purpose
           size_list=len(newlist)
           myTotalKeys=list(newlist[0].keys());#Getting the subject codes from header
           #print(mykeys)--Debugging Purpose
           myTotalKeys.remove('RRN');#RRN Key is removed since it is not needed in DB.
           #print(mykeys)
           size_keys=len(myTotalKeys)
           myAttKeys=[]
           for i in range(size_keys):
               if '-Att' in myTotalKeys[i]:
                   myAttKeys.append(myTotalKeys[i])
           size_att_keys=len(myAttKeys)
           myMarkKeys=list(set(myTotalKeys)-set(myAttKeys))
           size_mark_keys=len(myMarkKeys)
           print('Total',myTotalKeys)
           print('myMarkKeys',myMarkKeys)
           print('AttKeys',myAttKeys)
           cat_list= []
           count=0
           if markAttType=='mark':
                      for i in range(size_list):
                          for j in range(size_mark_keys):
                              cat_list.append(Cat.Cat(newlist[i]['RRN'],myMarkKeys[j]))
                              count=count+1
                              cat_list[count-1].setCatMark(newlist[i][str(myMarkKeys[j])])
                              cat_list[count-1].setSem(sem)
           elif markAttType=='att':
                       for i in range(size_list):
                           for j in range(size_att_keys):
                               cat_list.append(Cat.Cat(newlist[i]['RRN'],myAttKeys[j].rstrip('-Att')))
                               count=count+1
                               cat_list[count-1].setCatAtt(newlist[i][str(myAttKeys[j])])
                               cat_list[count-1].setSem(sem)
           elif markAttType=='markAtt':
               for i in range(size_list):
                   for j in range(size_mark_keys):
                       cat_list.append(Cat.Cat(newlist[i]['RRN'],myMarkKeys[j]))
                       count=count+1
                       cat_list[count-1].setCatMark(newlist[i][str(myMarkKeys[j])])
                       cat_list[count-1].setCatAtt(newlist[i][str(myMarkKeys[j])+'-Att'])
                       cat_list[count-1].setSem(sem)

    with open(outputfile,'w')as writefile:
        if catType=='cat1':
            fieldnames=['RRN','SUBJECT_CODE','CAT1_MARK','CAT1_ATTENDANCE','SEM_TAKEN']
        elif catType=='cat2':
            fieldnames=['RRN','SUBJECT_CODE','CAT2_MARK','CAT2_ATTENDANCE','SEM_TAKEN']
        elif catType=='cat3':
            fieldnames=['RRN','SUBJECT_CODE','CAT3_MARK','CAT3_ATTENDANCE','SEM_TAKEN']
        writer=csv.DictWriter(writefile,fieldnames=fieldnames)
        writer.writeheader()
        for k in range(count):
           writer.writerow({fieldnames[0]:cat_list[k].rrn,fieldnames[1]:cat_list[k].sub_code,fieldnames[2]:cat_list[k].cat_mark,fieldnames[3]:cat_list[k].cat_att,fieldnames[4]:cat_list[k].sem})
if(len(sys.argv)!=6):
    #print(len(sys.argv))
    print('Usage: python3.x cathandler.py cat1/2/3 mark/att/markAtt sem inputfilename.csv outputfilename.csv')
else:
    genCatCsv(sys.argv[1],sys.argv[2],int(sys.argv[3]),sys.argv[4],sys.argv[5])
