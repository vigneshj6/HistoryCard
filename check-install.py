import subprocess
import json

configure = open('config.json','r');
config = json.loads(configure.read())

"""
step 1 *** check wheather postgres exist --- psql -c \"\du\"
step 2 *** check username and password   --- PGPASSWORD='<password>' psql -U admin -h <host> <db>
psql postgres -tAc \"SELECT * FROM pg_roles WHERE rolname='ramki'\"
"""

def shell_exec(cmd):
    completed = False;
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate()
    status = p.wait();
    if status!=0:
        print '*** error please check ***';
        completed = (False,"error");
    else :
        print str(cmd+'\n'+output+' executed!!!');
        completed = (True,output);
    return completed;

def check_postgresql():
    
    if not shell_exec("psql -c \"\du\"")[0]:
        
        print 'postgresql not installed or not started yet. '
        print 'install postgresql and try'
        print 'command " sudo service postgresql start " to start. '
        exit(1);
        
    else:
        print '# postgresql check done !'
        return True
def check_user():
    username = config['postgres']['user'];
    passwd = config['postgres']['password'];
    db = config['postgres']['db'];
    if not shell_exec(str("PGPASSWORD='"+passwd+"' psql -U "+username+" -h "+config['postgres']['host']+" postgres & exit"))[0]:
        print ' *** create user with super-user permission *** '
        print ' not installed correctly '
        exit(1);
    else:
        print '# username check done !'
        return True;

def check_user_permission():
    permission = shell_exec("psql postgres -tAc \"SELECT * FROM pg_roles WHERE rolname='"+config['postgres']['user']+"'\"")
    if not permission[0]:
        exit(1);
    else:
        count = 0;
        content = permission[1].split("|");
        for i in content:
            if 't' in i:
                count = count + 1;
        if count > 5 :
            print '# permission check done !';
            return True;
        else:
            print ' *** create user with super-user permission *** '
            print ' UPDATE the username and password in config.json !!!'
            print ' not installed correctly '
            exit(1);
if __name__ == "__main__":
    if not check_postgresql() :
        exit(1);
    else :
        if not check_user():
            exit(1);
        else:
            if not check_user_permission() :
                exit(1);
            else :
                print 'success!!!'
                print 'RUN install-db.js file'
                print 'by using following command'
                print 'node install-db '