--TO EDIT BATCH
UPDATE "batch" SET "CURRENT" = $1 ,"SEMESTER"= $2
WHERE "BATCH" = $3;
--CHANGE IT TO VARIABLE NAMES