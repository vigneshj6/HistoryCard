WITH Upd1 as (UPDATE "FACULTY" SET "CLASS_ADVISOR_BATCH"=NULL WHERE "FACULTY_ID"=$1)-- DEASSIGNING IN FACULTY TABLE. CHANGE IT TO VARIABLE NAME FOR FACULTY_ID
UPDATE "STUDENT" SET "CLASS_ADVISOR"=NULL WHERE "CLASS_ADVISOR"=$1;--DEASSIGNING IN STUDENT TABLE
--CHANGE IT TO VARIABLE NAMES