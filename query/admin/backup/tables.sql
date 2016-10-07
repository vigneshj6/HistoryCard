--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; : 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: postgres_fdw; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgres_fdw WITH SCHEMA public;


--
-- Name: EXTENSION postgres_fdw; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgres_fdw IS 'foreign-data wrapper for remote PostgreSQL servers';


SET search_path = public, pg_catalog;

--
-- Name: db_to_csv(text); Type: FUNCTION; Schema: public;  
--


CREATE SERVER app_db FOREIGN DATA WRAPPER postgres_fdw OPTIONS (
    dbname 'history',
    host 'localhost'
);
CREATE USER MAPPING FOR postgres SERVER app_db OPTIONS (
    password 'enter',
    "user" 'postgres'
);


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: CAT1_TABLE; Type: TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE TABLE "CAT1_TABLE" (
    "RRN" character varying NOT NULL,
    "SUBJECT_CODE" character varying NOT NULL,
    "CAT1_MARK" numeric,
    "CAT1_ATTENDANCE" numeric,
    "SEM_TAKEN" integer
);


--
-- Name: CAT2_TABLE; Type: TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE TABLE "CAT2_TABLE" (
    "RRN" character varying NOT NULL,
    "SUBJECT_CODE" character varying NOT NULL,
    "CAT2_MARK" numeric,
    "CAT2_ATTENDANCE" numeric,
    "SEM_TAKEN" integer
);


--
-- Name: CAT3_TABLE; Type: TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE TABLE "CAT3_TABLE" (
    "RRN" character varying NOT NULL,
    "SUBJECT_CODE" character varying NOT NULL,
    "CAT3_MARK" numeric,
    "CAT3_ATTENDANCE" numeric,
    "SEM_TAKEN" integer
);


--
-- Name: COURSE; Type: TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE TABLE "COURSE" (
    "RRN" character varying NOT NULL,
    "SUBJECT_CODE" character varying NOT NULL,
    "SEM_TAKEN" integer,
    "GRADE" character(1),
    "DATE_PASSING" date,
    "ATTEMPT_ARREAR" integer,
    "ATTEMPT_REDO" integer
);


--
-- Name: INTERNALS; Type: TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE TABLE "INTERNALS" (
    "RRN" character varying NOT NULL,
    "SUBJECT_CODE" character varying NOT NULL,
    "INTERNALS" numeric,
    "CUMULATIVE_ATTENDANCE" numeric,
    "SEM_TAKEN" integer
);


--
-- Name: MARK_SCHEME; Type: TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE TABLE "MARK_SCHEME" (
    "GRADE" character varying(1) NOT NULL,
    "POINTS" numeric
);


--
-- Name: STUDENT; Type: FOREIGN TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE FOREIGN TABLE "STUDENT" (
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
)
SERVER app_db
OPTIONS (
    table_name 'STUDENT'
);


--
-- Name: SUBJECT; Type: TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE TABLE "SUBJECT" (
    "SUBJECT_CODE" character varying NOT NULL,
    "SUBJECT_NAME" character varying,
    "CREDITS" numeric
);


--
-- Name: TEACHING; Type: TABLE; Schema: public; Owner: norm; Tablespace: 
--

CREATE TABLE "TEACHING" (
    "RRN" character varying NOT NULL,
    "SUBJECT_CODE" character varying NOT NULL,
    "FACULTY_ID" character varying NOT NULL
);


--
-- Name: CAT1_TABLE_pkey; Type: CONSTRAINT; Schema: public; Owner: norm; Tablespace: 
--

ALTER TABLE ONLY "CAT1_TABLE"
    ADD CONSTRAINT "CAT1_TABLE_pkey" PRIMARY KEY ("RRN", "SUBJECT_CODE");


--
-- Name: CAT2_TABLE_pkey; Type: CONSTRAINT; Schema: public; Owner: norm; Tablespace: 
--

ALTER TABLE ONLY "CAT2_TABLE"
    ADD CONSTRAINT "CAT2_TABLE_pkey" PRIMARY KEY ("RRN", "SUBJECT_CODE");


--
-- Name: CAT3_TABLE_pkey; Type: CONSTRAINT; Schema: public; Owner: norm; Tablespace: 
--

ALTER TABLE ONLY "CAT3_TABLE"
    ADD CONSTRAINT "CAT3_TABLE_pkey" PRIMARY KEY ("RRN", "SUBJECT_CODE");


--
-- Name: COURSE_pkey; Type: CONSTRAINT; Schema: public; Owner: norm; Tablespace: 
--

ALTER TABLE ONLY "COURSE"
    ADD CONSTRAINT "COURSE_pkey" PRIMARY KEY ("RRN", "SUBJECT_CODE");


--
-- Name: INTERNALS_pkey; Type: CONSTRAINT; Schema: public; Owner: norm; Tablespace: 
--

ALTER TABLE ONLY "INTERNALS"
    ADD CONSTRAINT "INTERNALS_pkey" PRIMARY KEY ("RRN", "SUBJECT_CODE");


--
-- Name: MARK_SCHEME_pkey; Type: CONSTRAINT; Schema: public; Owner: norm; Tablespace: 
--

ALTER TABLE ONLY "MARK_SCHEME"
    ADD CONSTRAINT "MARK_SCHEME_pkey" PRIMARY KEY ("GRADE");


--
-- Name: SUBJECT_pkey; Type: CONSTRAINT; Schema: public; Owner: norm; Tablespace: 
--

ALTER TABLE ONLY "SUBJECT"
    ADD CONSTRAINT "SUBJECT_pkey" PRIMARY KEY ("SUBJECT_CODE");


--
-- Name: TEACHING_pkey; Type: CONSTRAINT; Schema: public; Owner: norm; Tablespace: 
--

ALTER TABLE ONLY "TEACHING"
    ADD CONSTRAINT "TEACHING_pkey" PRIMARY KEY ("RRN", "SUBJECT_CODE", "FACULTY_ID");


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--
CREATE TABLE "CAT1_TEMP_TABLE"(LIKE "CAT1_TABLE" INCLUDING ALL);
CREATE TABLE "CAT2_TEMP_TABLE"(LIKE "CAT2_TABLE" INCLUDING ALL);
CREATE TABLE "CAT3_TEMP_TABLE"(LIKE "CAT3_TABLE" INCLUDING ALL);
CREATE TABLE "INTERNALS_TEMP_TABLE"(LIKE "INTERNALS" INCLUDING ALL);
CREATE TABLE "COURSE_TEMP_TABLE"(LIKE "COURSE" INCLUDING ALL);

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--