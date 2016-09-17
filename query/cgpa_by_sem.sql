--This query is for CGPA Graph. Not for CGPA
--For CGPA, look at cgpa.sql

SELECT ROUND(SUM("CREDITS"*"POINTS")/SUM("CREDITS"),1) AS "CGPA"
FROM "COURSE" INNER JOIN "INTERNALS" USING("RRN","SUBJECT_CODE","SEM_TAKEN")
INNER JOIN "SUBJECT" USING ("SUBJECT_CODE")
INNER JOIN "MARK_SCHEME" USING("GRADE")
WHERE "RRN"=$1 AND "SEM_TAKEN"<=$2;

--TO-DO
--We need to store this data on the CGPA Table, then we can
--retrieve this by a simple select.

--Also,We don't need a GPA Table anymore since I have updated the GPA Query to
-- get it directly from the marks.

--Therefore, we can change the GPA Table for CGPA Table and have some sort of
--trigger which will insert/populate the CGPA tables by using the above query

