--
-- Name: DEPARTMENT; Type: TABLE; Schema: public; Tablespace: 
--

CREATE TABLE "DEPARTMENT" (
    "DEPARTMENT_ID" character varying NOT NULL,
    "DEPARTMENT_NAME" character varying,
    "HOD" character varying
);

SET default_with_oids = false;

INSERT INTO "DEPARTMENT" VALUES ('CSE', 'Computer Science and Engineering', '2002_F');
INSERT INTO "DEPARTMENT" VALUES ('ECE', 'Electronics and Communications Engineering', '2003_F');
INSERT INTO "DEPARTMENT" VALUES ('MECH', 'Mechanical Engineering', '2004_F');
INSERT INTO "DEPARTMENT" VALUES ('EEE', 'Electrical and Electronics Engineering', '2005_F');
INSERT INTO "DEPARTMENT" VALUES ('AERO', 'Aeronautical Engineering', '2006_F');
INSERT INTO "DEPARTMENT" VALUES ('POLY', 'Polymer Engineering', '2007_F');


--
-- Name: FACULTY; Type: TABLE; Schema: public;  ; Tablespace: 
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

--
-- Name: STUDENT; Type: TABLE; Schema: public;  ; Tablespace: 
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

--
-- Name: STUDENT_DEPARTMENT_seq; Type: SEQUENCE; Schema: public;  
--

CREATE SEQUENCE "STUDENT_DEPARTMENT_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: STUDENT_DEPARTMENT_seq; Type: SEQUENCE OWNED BY; Schema: public;  
--

ALTER SEQUENCE "STUDENT_DEPARTMENT_seq" OWNED BY "STUDENT"."DEPARTMENT";


--
-- Name: TEACH_SUBJECT; Type: TABLE; Schema: public;  ; Tablespace: 
--

CREATE TABLE "TEACH_SUBJECT" (
    "FACULTY_ID" character varying NOT NULL,
    "SUBJECT_CODE" character varying NOT NULL,
    "Batch" character varying NOT NULL,
    "DEPARTMENT" character varying,
    "SECTION" character varying(1),
    "SEMESTER" integer
);

--
-- Name: TEACH_SUBJECT_SECTION_seq; Type: SEQUENCE; Schema: public;  
--

CREATE SEQUENCE "TEACH_SUBJECT_SECTION_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: TEACH_SUBJECT_SECTION_seq; Type: SEQUENCE OWNED BY; Schema: public;  
--

ALTER SEQUENCE "TEACH_SUBJECT_SECTION_seq" OWNED BY "TEACH_SUBJECT"."SECTION";


--
-- Name: batch; Type: TABLE; Schema: public;  ; Tablespace: 
--

CREATE TABLE batch (
    "BATCH" character varying NOT NULL,
    "BATCH_DESCRIPTION" character varying,
    "BATCH_SYLLABUS" character varying,
    "CURRENT" boolean DEFAULT true,
    "SEMESTER" integer DEFAULT 1
);


--
-- Name: login; Type: TABLE; Schema: public;  ; Tablespace: 
--

CREATE TABLE login (
    userid character varying(40) NOT NULL,
    passwd character varying(44) NOT NULL,
    type integer NOT NULL,
    "DB" character varying(16) NOT NULL
);

--
-- Name: DEPARTMENT_pkey; Type: CONSTRAINT; Schema: public;  ; Tablespace: 
--

ALTER TABLE ONLY "DEPARTMENT"
    ADD CONSTRAINT "DEPARTMENT_pkey" PRIMARY KEY ("DEPARTMENT_ID");


--
-- Name: FACULTY_pkey; Type: CONSTRAINT; Schema: public;  ; Tablespace: 
--

ALTER TABLE ONLY "FACULTY"
    ADD CONSTRAINT "FACULTY_pkey" PRIMARY KEY ("FACULTY_ID");


--
-- Name: STUDENT_pkey; Type: CONSTRAINT; Schema: public;  ; Tablespace: 
--

ALTER TABLE ONLY "STUDENT"
    ADD CONSTRAINT "STUDENT_pkey" PRIMARY KEY ("RRN");


--
-- Name: TEACH_SUBJECT_pkey; Type: CONSTRAINT; Schema: public;  ; Tablespace: 
--

ALTER TABLE ONLY "TEACH_SUBJECT"
    ADD CONSTRAINT "TEACH_SUBJECT_pkey" PRIMARY KEY ("FACULTY_ID", "SUBJECT_CODE", "Batch");


--
-- Name: batch_pkey; Type: CONSTRAINT; Schema: public;  ; Tablespace: 
--

ALTER TABLE ONLY batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY ("BATCH");


--
-- Name: login_pkey; Type: CONSTRAINT; Schema: public;  ; Tablespace: 
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
INSERT INTO "login" VALUES('Admin1','enter',3,'history');