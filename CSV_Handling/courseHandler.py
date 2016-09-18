#!/usr/bin/env python3
import sys,getopt
import csv
import Course
def genCourseCsv(sem,date_passing,inputfile,outputfile):
    with open(inputfile,newline='')as csvfile:
        reader=csv.DictReader(csvfile)
        my_obj=list(reader)
        newlist = sorted(my_obj, key=lambda k: k['RRN'])
        #print(newlist)
        size_list=len(newlist)
        mykeys=list(newlist[0].keys());#Getting the subject codes from header
        #print(mykeys)
        mykeys.remove('RRN');#RRN key is removed since it is not needed in DB.
        #print(mykeys)
        size_keys=len(mykeys)
        course_list= []
        count=0
        for i in range(size_list):
            for j in range(size_keys):
                course_list.append(Course.Course(newlist[i]['RRN'],mykeys[j],newlist[i][mykeys[j]]))
                count=count+1
                course_list[count-1].setSem(sem)
                if(course_list[count-1].grade!='I'and course_list[count-1].grade!='U' ):
                    course_list[count-1].setDatePassing(date_passing)


    with open(outputfile,'w')as writefile:
        fieldnames=['RRN','SUBJECT_CODE','SEM_TAKEN','GRADE','DATE_PASSING','ATTEMPT_ARREAR','ATTEMPT_REDO']
        writer=csv.DictWriter(writefile,fieldnames=fieldnames)
        writer.writeheader()
        for k in range(len(course_list)):
           writer.writerow({fieldnames[0]:course_list[k].rrn,fieldnames[1]:course_list[k].sub_code,fieldnames[2]:course_list[k].sem,fieldnames[3]:course_list[k].grade,fieldnames[4]:course_list[k].date_passing,fieldnames[5]:course_list[k].numArrear,fieldnames[6]:course_list[k].numRedo})
if (len(sys.argv)!=5):
    print('Usage: python3.x courseHandler.py sem date_passing(yyyy-mm-dd) inputfile.csv outputfile.csv')
else:
    genCourseCsv(int(sys.argv[1]),sys.argv[2],sys.argv[3],sys.argv[4])
