drop table EXPENSE_TYPES CASCADE CONSTRAINTS;
drop table EXPENSES CASCADE CONSTRAINTS;
drop table EXPENSE_REPORTS CASCADE CONSTRAINTS;
drop table EXPENSE_REPORT_ITEMS CASCADE CONSTRAINTS;
drop view EXPENSE_REPORT_ITEMS_V;

CREATE TABLE EXPENSE_TYPES 
( 
type_id        number(3)  NOT NULL,
type_name	   VARCHAR2(50) NOT NULL,
CONSTRAINT EXPENSE_TYPES_pk PRIMARY KEY ( type_id )
);

insert into EXPENSE_TYPES values(1, 'Accomodation');
insert into EXPENSE_TYPES values(2, 'Airfare');
insert into EXPENSE_TYPES values(3, 'Car Rental');
insert into EXPENSE_TYPES values(4, 'Conference/Seminar/Training');
insert into EXPENSE_TYPES values(5, 'Employee Recognition Award');
insert into EXPENSE_TYPES values(6, 'Entertainment-Employee(s) Only');
insert into EXPENSE_TYPES values(7, 'Entertainment-Private Sector'); 
insert into EXPENSE_TYPES values(8, 'Entertainment-Public Sector'); 
insert into EXPENSE_TYPES values(9, 'Fuel-Gas/Petrol/Diesel');
insert into EXPENSE_TYPES values(10, 'Gif to Non-Oracle Infividual');
insert into EXPENSE_TYPES values(11, 'Home Office Furniture'); 
insert into EXPENSE_TYPES values(12, 'Internet Charges'); 
insert into EXPENSE_TYPES values(13, 'Marketing');
insert into EXPENSE_TYPES values(14, 'Meals - Employees only'); 
insert into EXPENSE_TYPES values(15, 'Meals - Private Sector');
insert into EXPENSE_TYPES values(16, 'Meals - Public Sector');
insert into EXPENSE_TYPES values(17, 'Membership/Books/Subscription');
insert into EXPENSE_TYPES values(18, 'Mileage');
insert into EXPENSE_TYPES values(19, 'Misc.Expense'); 
insert into EXPENSE_TYPES values(20, 'Misc.Expense - Public Sector');
insert into EXPENSE_TYPES values(21, 'Parking/Tolls');
insert into EXPENSE_TYPES values(22, 'Shipping/Courier/Printing');
insert into EXPENSE_TYPES values(23, 'Small Office/Compute Supplies'); 
insert into EXPENSE_TYPES values(24, 'Software and Cloud'); 
insert into EXPENSE_TYPES values(25, 'Taxi and Other Transportation');
insert into EXPENSE_TYPES values(26, 'Telephone Charges'); 


CREATE TABLE EXPENSES
( 
expense_id 		number(9) not null,
employee_id 	VARCHAR2(50) not null,
type_id 		number(3),
payment_amount 	number(8),
title           VARCHAR2(200),
description 	VARCHAR2(1024),
receipt_status	VARCHAR2(2), --missing/keeping
card_type		VARCHAR2(2), --추가 할것 (개인카드/법인카드)
receipt_pic	    BLOB,
use_date		DATE,
cre_date    	DATE,
CONSTRAINT expenses_pk PRIMARY KEY (expense_id),
CONSTRAINT expenses_employee_id_fk FOREIGN KEY (employee_id) references EMPLOYEES,
CONSTRAINT expenses_type_id_fk FOREIGN KEY (type_id) references EXPENSE_TYPES
);

CREATE TABLE EXPENSE_REPORTS
( 
expense_report_id number(9) not null,
employee_id     VARCHAR2(50) not null,
report_title	VARCHAR2(50) not null,
company_card_receipt_num number(3),
private_card_receiept_num number(3),
company_card_amount number(9),
private_card_amount number(9),
cre_date    	DATE,
CONSTRAINT expense_reports_pk PRIMARY KEY (expense_report_id),
CONSTRAINT expense_reports_employee_id_fk FOREIGN KEY (employee_id) references EMPLOYEES
);

CREATE TABLE EXPENSE_REPORT_ITEMS
( 
report_id 		number(9) not null,
expense_id 		number(9) not null,
CONSTRAINT expense_report_items_pk PRIMARY KEY (report_id, expense_id),
CONSTRAINT expense_report_items_report_id_fk FOREIGN KEY (report_id) references EXPENSE_REPORTS,
CONSTRAINT expense_report_items_expense_id_fk FOREIGN KEY (expense_id) references EXPENSES
);


-- 카드 여부 추가해야 함
CREATE OR REPLACE VIEW EXPENSE_REPORT_ITEMS_V AS 
select i.REPORT_ID, i.EXPENSE_ID, 
	e.EMPLOYEE_ID, e.TYPE_ID, e.PAYMENT_AMOUNT, 
	e.title, e.DESCRIPTION, e.USE_DATE, e.cre_date
from EXPENSE_REPORT_ITEMS i, EXPENSES e 
where i.EXPENSE_ID=e.EXPENSE_ID 










