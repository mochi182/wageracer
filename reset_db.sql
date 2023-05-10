TRUNCATE TABLE application;
TRUNCATE TABLE application_vs_status;
TRUNCATE TABLE company;
TRUNCATE TABLE company_review;
TRUNCATE TABLE contact;
TRUNCATE TABLE country;
TRUNCATE TABLE domain;
TRUNCATE TABLE job_position;
TRUNCATE TABLE project;
TRUNCATE TABLE project_vs_company;
TRUNCATE TABLE status;
TRUNCATE TABLE telephone;

INSERT INTO status (name)
VALUES ('Applied');
INSERT INTO status (name)
VALUES ('Rejected');
INSERT INTO status (name)
VALUES ('Interview');
INSERT INTO status (name)
VALUES ('Accepted');