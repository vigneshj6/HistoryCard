SELECT "BATCH" as "name","CURRENT" as "old_batch","SEMESTER" as "sem" FROM "batch"
WHERE "BATCH" LIKE $1
order by "BATCH";