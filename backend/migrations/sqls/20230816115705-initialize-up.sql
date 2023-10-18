CREATE SEQUENCE users_id_seq;
CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying COLLATE pg_catalog."default" NOT NULL,
    useremail character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    createdat timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdby character varying COLLATE pg_catalog."default" NOT NULL,
    updatedat timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedby character varying COLLATE pg_catalog."default" NOT NULL,
    role text COLLATE pg_catalog."default" NOT NULL,
    state character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_useremail_key UNIQUE (useremail)
);

-- Table: public."Forms"
-- DROP TABLE IF EXISTS public.forms;
CREATE SEQUENCE forms_id_seq;
CREATE TABLE IF NOT EXISTS public.forms
(
    id bigint NOT NULL DEFAULT nextval('forms_id_seq'::regclass),
    originalid integer, 
    title character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    createdat timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdby character varying COLLATE pg_catalog."default" NOT NULL,
    updatedat timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedby character varying COLLATE pg_catalog."default" NOT NULL,
    version integer NOT NULL,
    state text COLLATE pg_catalog."default" NOT NULL,
    formfields jsonb,
    dateprovided boolean,
    CONSTRAINT forms_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.submittedform
(
    id uuid NOT NULL,
    formdata json,
    submittedat timestamp without time zone,
    formid integer,
    submittedby integer,
    CONSTRAINT submittedform_pkey PRIMARY KEY (id)
);

-- ALTER TABLE IF EXISTS public.submittedform
--     OWNER to postgres;

