WITH Upd1 as (UPDATE "FACULTY" SET "CLASS_ADVISOR_BATCH"=$2 WHERE "FACULTY_ID"=$1)--ASSIGNING IN FACULTY TABLE $1-id $2-batch
UPDATE "STUDENT" SET "CLASS_ADVISOR"=$1 WHERE "DEPARTMENT"=$3 AND "SECTION"=$4 AND "Batch" = $2;--ASSIGNING IN STUDENT TABLE
--CHANGE IT TO VARIABLE NAME FOR CLASS ADVISOR,FACULTY_ID,DEPARTMENT,SECTION AND BATCH