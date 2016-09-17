--
-- PostgreSQL database dump
--
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--
-- Name: db_to_csv(text); Type: FUNCTION; Schema: public; Owner: ramki
--

CREATE FUNCTION db_to_csv(path text) RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
   tables RECORD;
   statement TEXT;
begin
FOR tables IN 
   SELECT (table_schema || '.' || table_name) AS schema_table
   FROM information_schema.tables t INNER JOIN information_schema.schemata s 
   ON s.schema_name = t.table_schema 
   WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema', 'configuration')
   AND t.table_type NOT IN ('VIEW')
   ORDER BY schema_table
LOOP
   statement := 'COPY ' || tables.schema_table || ' TO ''' || path || '/' || tables.schema_table || '.csv' ||''' DELIMITER '';'' CSV HEADER';
   EXECUTE statement;
END LOOP;
return;  
end;
$$;


ALTER FUNCTION public.db_to_csv(path text) OWNER TO ramki;

SET default_tablespace = '';

SET default_with_oids = true;

--
-- Name: DEPARTMENT; Type: TABLE; Schema: public; Owner: ramki; Tablespace: 
--

CREATE TABLE "DEPARTMENT" (
    "DEPARTMENT_ID" character varying NOT NULL,
    "DEPARTMENT_NAME" character varying,
    "HOD" character varying
);


ALTER TABLE public."DEPARTMENT" OWNER TO ramki;

SET default_with_oids = false;

--
-- Name: FACULTY; Type: TABLE; Schema: public; Owner: ramki; Tablespace: 
--

CREATE TABLE "FACULTY" (
    "FACULTY_ID" character varying NOT NULL,
    "FACULTY_NAME" character varying,
    "DATE_HIRED" date,
    "DEPARTMENT" character varying,
    "POSITION" character varying,
    "TEACHER" boolean,
    "CLASS_ADVISOR_BATCH" character varying,
    "FACULTY_ADVISOR_BATCH" character varying
);


ALTER TABLE public."FACULTY" OWNER TO ramki;

--
-- Name: STUDENT; Type: TABLE; Schema: public; Owner: ramki; Tablespace: 
--

CREATE TABLE "STUDENT" (
    "RRN" character varying NOT NULL,
    "STUDENT_NAME" character varying,
    "DATE_OF_ADMISSION" date,
    "DOB" date,
    "ADDRESS" character varying(100),
    "PHONE_NUMBER" character varying(15),
    "EMAIL" character varying(40),
    "CLASS_ADVISOR" character varying,
    "FACULTY_ADVISOR" character varying,
    "Batch" character varying NOT NULL,
    "SECTION" character varying(1),
    "DEPARTMENT" character varying
);


ALTER TABLE public."STUDENT" OWNER TO ramki;

--
-- Name: STUDENT_DEPARTMENT_seq; Type: SEQUENCE; Schema: public; Owner: ramki
--

CREATE SEQUENCE "STUDENT_DEPARTMENT_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."STUDENT_DEPARTMENT_seq" OWNER TO ramki;

--
-- Name: STUDENT_DEPARTMENT_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramki
--

ALTER SEQUENCE "STUDENT_DEPARTMENT_seq" OWNED BY "STUDENT"."DEPARTMENT";


--
-- Name: TEACH_SUBJECT; Type: TABLE; Schema: public; Owner: ramki; Tablespace: 
--

CREATE TABLE "TEACH_SUBJECT" (
    "FACULTY_ID" character varying NOT NULL,
    "SUBJECT_CODE" character varying NOT NULL,
    "Batch" character varying NOT NULL,
    "DEPARTMENT" character varying,
    "SECTION" character varying(1),
    "SEMESTER" integer
);


ALTER TABLE public."TEACH_SUBJECT" OWNER TO ramki;

--
-- Name: TEACH_SUBJECT_SECTION_seq; Type: SEQUENCE; Schema: public; Owner: ramki
--

CREATE SEQUENCE "TEACH_SUBJECT_SECTION_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TEACH_SUBJECT_SECTION_seq" OWNER TO ramki;

--
-- Name: TEACH_SUBJECT_SECTION_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramki
--

ALTER SEQUENCE "TEACH_SUBJECT_SECTION_seq" OWNED BY "TEACH_SUBJECT"."SECTION";


--
-- Name: batch; Type: TABLE; Schema: public; Owner: ramki; Tablespace: 
--

CREATE TABLE batch (
    "BATCH" character varying NOT NULL,
    "BATCH_DESCRIPTION" character varying,
    "BATCH_SYLLABUS" character varying,
    "CURRENT" boolean DEFAULT true,
    "SEMESTER" integer DEFAULT 1
);


ALTER TABLE public.batch OWNER TO ramki;

--
-- Name: login; Type: TABLE; Schema: public; Owner: ramki; Tablespace: 
--

CREATE TABLE login (
    userid character varying(40) NOT NULL,
    passwd character varying(44) NOT NULL,
    type integer NOT NULL,
    "DB" character varying(16) NOT NULL
);


ALTER TABLE public.login OWNER TO ramki;

--
-- Name: DEPARTMENT_pkey; Type: CONSTRAINT; Schema: public; Owner: ramki; Tablespace: 
--

ALTER TABLE ONLY "DEPARTMENT"
    ADD CONSTRAINT "DEPARTMENT_pkey" PRIMARY KEY ("DEPARTMENT_ID");


--
-- Name: FACULTY_pkey; Type: CONSTRAINT; Schema: public; Owner: ramki; Tablespace: 
--

ALTER TABLE ONLY "FACULTY"
    ADD CONSTRAINT "FACULTY_pkey" PRIMARY KEY ("FACULTY_ID");


--
-- Name: STUDENT_pkey; Type: CONSTRAINT; Schema: public; Owner: ramki; Tablespace: 
--

ALTER TABLE ONLY "STUDENT"
    ADD CONSTRAINT "STUDENT_pkey" PRIMARY KEY ("RRN");


--
-- Name: TEACH_SUBJECT_pkey; Type: CONSTRAINT; Schema: public; Owner: ramki; Tablespace: 
--

ALTER TABLE ONLY "TEACH_SUBJECT"
    ADD CONSTRAINT "TEACH_SUBJECT_pkey" PRIMARY KEY ("FACULTY_ID", "SUBJECT_CODE", "Batch");


--
-- Name: batch_pkey; Type: CONSTRAINT; Schema: public; Owner: ramki; Tablespace: 
--

ALTER TABLE ONLY batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY ("BATCH");


--
-- Name: login_pkey; Type: CONSTRAINT; Schema: public; Owner: ramki; Tablespace: 
--

ALTER TABLE ONLY login
    ADD CONSTRAINT login_pkey PRIMARY KEY (userid);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--
