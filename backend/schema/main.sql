-- Create tables in proper order to resolve dependencies
CREATE TABLE BUSINESS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    city VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    street VARCHAR(255),
    website_url VARCHAR(255),
    industry VARCHAR(255) NOT NULL

    -- Relationships
    --business_manager INT NOT NULL
);

CREATE TABLE EMPLOYEE (
    id SERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL, -- Manager, Deal Executor, Deal Opener
    account_creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hashed_password VARCHAR(255) NOT NULL, -- we forgot to add this field

    -- Relationships
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES BUSINESS(id)
);

-- Add FOREIGN KEY for business_manager after EMPLOYEE is created
--ALTER TABLE BUSINESS ADD CONSTRAINT fk_business_manager FOREIGN KEY (business_manager) REFERENCES EMPLOYEE(id);

CREATE TABLE CUSTOMER (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    type VARCHAR(255) NOT NULL, -- Individual or Company
    lead_source VARCHAR(255),
    preferred_contact_method BOOLEAN, -- 0 for email, 1 for phone

    -- Relationships
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES BUSINESS(id),

    added_by INT NOT NULL,
    FOREIGN KEY (added_by) REFERENCES EMPLOYEE(id)
);

CREATE TABLE DEAL (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL, -- Open, Claimed, Closed Won, Closed Lost
    description TEXT,
    date_opened TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_closed TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    expenses DECIMAL NOT NULL,
    customer_budget DECIMAL NOT NULL,

    -- Relationships
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(id),

    deal_opener INT NOT NULL,
    FOREIGN KEY (deal_opener) REFERENCES EMPLOYEE(id),

    deal_executor INT,
    date_claimed TIMESTAMP,
    FOREIGN KEY (deal_executor) REFERENCES EMPLOYEE(id)
);

CREATE TABLE FINANCIAL_RECORD (
    id SERIAL PRIMARY KEY,
    amount DECIMAL NOT NULL,
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(255) NOT NULL, -- Income or Expense
    description TEXT,
    payment_method VARCHAR(255) NOT NULL, -- Cash, Credit Card, Bank Transfer

    -- Relationships
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES BUSINESS(id),

    deal_id INT NOT NULL,
    FOREIGN KEY (deal_id) REFERENCES DEAL(id)
);

CREATE TABLE ACTIVITY_LOG (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    cause VARCHAR(255) NOT NULL, -- Depends on the event (type of the log)

    -- Relationships
    business_id INT NOT NULL,
    FOREIGN KEY (business_id) REFERENCES BUSINESS(id)
);

CREATE TABLE BADGE (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(255) NOT NULL, -- Depends on the event
    icon_url VARCHAR(255) NOT NULL,
    required_points INT NOT NULL -- Requirement to get the badge
);

CREATE TABLE EMPLOYEE_BADGE (
    date_awarded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    employee_id INT NOT NULL,
    badge_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(id),
    FOREIGN KEY (badge_id) REFERENCES BADGE(id),
    PRIMARY KEY (employee_id, badge_id)
);

CREATE TABLE NOTIFICATION (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priority INT NOT NULL, -- 0 , 1 , 2
    type VARCHAR(255) NOT NULL, -- Depends on the event

    -- Relationships
    recipient INT NOT NULL,
    FOREIGN KEY (recipient) REFERENCES EMPLOYEE(id),

    seen BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE TARGET (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL, -- Depends on the event
    goal INT NOT NULL, -- Requirement to complete the target
    deadline TIMESTAMP NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Relationships
    employee_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(id)
);

CREATE TABLE EMPLOYEE_PROFILE (
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birth_date TIMESTAMP NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    profile_picture_url VARCHAR(255),
    address TEXT,
    hire_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Relationships
    employee_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(id)
);