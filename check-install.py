import subprocess
depend = 'h';
p = subprocess.Popen("psql -c \"\du\"", stdout=subprocess.PIPE, shell=True)
(output, err) = p.communicate()
"""print "Today is", err ,p.wait()"""
if err:
    print 'error *** cannot install '+err+'***';
else :
    print str(depend+'\n'+output+'executed!!!');