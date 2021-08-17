
drop table USER_TYPES CASCADE CONSTRAINTS;
drop table TEAMS CASCADE CONSTRAINTS;
drop table LOB_TYPES CASCADE CONSTRAINTS;
drop table EMPLOYEES CASCADE CONSTRAINTS;


CREATE TABLE LOB_TYPES 
( 
lob_id	       number(2)  NOT NULL,
lob_name	   VARCHAR2(20) NOT NULL,
CONSTRAINT lob_type_pk PRIMARY KEY ( lob_id )
);

insert into LOB_TYPES values(1, 'Cloud');
insert into LOB_TYPES values(2, 'License');

CREATE TABLE TEAMS 
( 
team_id	       number(3)  NOT NULL,
team_name	   VARCHAR2(20) NOT NULL,
team_full_name VARCHAR2(100) NOT NULL,
lob_type_id  	   number(2)  NOT NULL,                           	   
CONSTRAINT teams_pk PRIMARY KEY ( team_id ),
CONSTRAINT teams_lob_type_id_fk FOREIGN KEY (lob_type_id) references LOB_TYPES);

insert into TEAMS values(1, 'CE1', 'Cloud Engineer 1 Team', 1);
insert into TEAMS values(2, 'CE2', 'Cloud Engineer 2 Team', 1);
insert into TEAMS values(3, 'CE3', 'Cloud Engineer 3 Team', 1);
insert into TEAMS values(4, 'CS', 'Cloud Spectialist Team', 1);
insert into TEAMS values(5, 'TSE1', 'Cloud Spectialist Team', 2);
insert into TEAMS values(6, 'TSE2', 'Cloud Spectialist Team', 2);
insert into TEAMS values(7, 'TSE3', 'Cloud Spectialist Team', 2);




CREATE TABLE USER_TYPES 
( 
type_id	       number(3)  NOT NULL,
type_name	   VARCHAR2(20) NOT NULL,
type_full_name VARCHAR2(20) NOT NULL,
CONSTRAINT USER_TYPES_pk PRIMARY KEY ( type_id )
);

insert into USER_TYPES values(1, 'M', 'Manager');
insert into USER_TYPES values(2, 'CE', 'Cloud Engineer');
insert into USER_TYPES values(3, 'CA', 'Cloud Architect');
insert into USER_TYPES values(4, 'CS', 'Cloud Specialist');
insert into USER_TYPES values(5, 'SE', 'Solution Engineer');

CREATE TABLE EMPLOYEES 
(
employee_id    VARCHAR2(50) NOT NULL, 
email	       VARCHAR2(50) NOT NULL,
emp_name	   VARCHAR2(20) NOT NULL,
emp_pw		   VARCHAR2(200),
cell_phone	   VARCHAR2(13) NOT NULL,
lob_id	       number(2)  NOT NULL,		   
type_id	       number(3) NOT NULL,
team_id	       number(3) NOT NULL,
gender         VARCHAR2(2) Not Null,
birth_day	   DATE,
emp_pic	       BLOB,
cre_user	   VARCHAR2(50),
cre_date       DATE,
temp_pw        VARCHAR2(200),
init_pw        VARCHAR2(2),
pw_retry_cnt   NUMBER(2),
CONSTRAINT employees_pk PRIMARY KEY (employee_id),
CONSTRAINT employees_lob_id_fk FOREIGN KEY (lob_id) references LOB_TYPES,
CONSTRAINT employees_type_id_fk FOREIGN KEY (type_id) references USER_TYPES,
CONSTRAINT employees_team_id_fk FOREIGN KEY (team_id) references TEAMS
);


