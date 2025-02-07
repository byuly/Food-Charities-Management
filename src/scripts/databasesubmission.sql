DROP TABLE Donate;
DROP TABLE Staff;
DROP TABLE Volunteers;
DROP TABLE CharityWorkerDetails;
DROP TABLE WorkerInfo;
DROP TABLE DonorDate;
DROP TABLE DonationReceipt;
DROP TABLE FoodDonors;
DROP TABLE StatusQuantity;
DROP TABLE FoodItem;
DROP TABLE Inventory;
DROP TABLE FoodReceived;
DROP TABLE FoodNameType;
DROP TABLE Food;
DROP TABLE ContactAddress;
DROP TABLE Recipients;
DROP TABLE DonationEvent;
DROP TABLE Charities;

-- Charities table
CREATE TABLE Charities (
    CharityID INT PRIMARY KEY,
    Address VARCHAR2(255) NOT NULL,
    Name VARCHAR2(100) NOT NULL,
    UNIQUE (Address)
);

-- DonationEvent table
CREATE TABLE DonationEvent (
    EventID INT PRIMARY KEY,
    CharityID INT NOT NULL,
    Address VARCHAR2(255) NOT NULL,
    EventName VARCHAR2(100) NOT NULL,
    EventDate DATE NOT NULL,
    FOREIGN KEY (CharityID)
    REFERENCES Charities(CharityID)
    ON DELETE CASCADE
);

-- Recipients table
CREATE TABLE Recipients (
    SinNum CHAR(9) PRIMARY KEY,
    EventID INT NOT NULL,
    Age INT NOT NULL,
    ContactNum VARCHAR2(15) NOT NULL,
    Gender VARCHAR2(10),
    FOREIGN KEY (EventID)
    REFERENCES DonationEvent(EventID)
    ON DELETE CASCADE
);

-- ContactAddress table
CREATE TABLE ContactAddress (
    ContactNum VARCHAR2(15) PRIMARY KEY,
    Address VARCHAR2(255) NOT NULL
);

-- Food table
CREATE TABLE Food (
    FoodID INT PRIMARY KEY,
    FoodName VARCHAR2(100) NOT NULL,
    FoodDescription VARCHAR2(255),
    UNIQUE (FoodName)
);

-- FoodNameType table
CREATE TABLE FoodNameType (
    FoodName VARCHAR2(100) PRIMARY KEY,
    FoodType VARCHAR2(50) NOT NULL
);

-- FoodReceived table
CREATE TABLE FoodReceived (
    FoodID INT NOT NULL,
    SinNum CHAR(9) NOT NULL,
    Quantity INT NOT NULL,
    InventoryQuantity INT NOT NULL,
    PRIMARY KEY (FoodID, SinNum),
    FOREIGN KEY (FoodID)
    REFERENCES Food(FoodID)
    ON DELETE CASCADE,
    FOREIGN KEY (SinNum)
    REFERENCES Recipients(SinNum)
    ON DELETE CASCADE
);

-- Inventory table
CREATE TABLE Inventory (
    InventoryID INT,
    CharityID INT,
    Status VARCHAR2(50),
    FoodID INT NOT NULL,
    Location VARCHAR2(255) NOT NULL,
    PRIMARY KEY (InventoryID, CharityID),
    FOREIGN KEY (CharityID)
    REFERENCES Charities(CharityID)
    ON DELETE CASCADE,
    FOREIGN KEY (FoodID)
    REFERENCES Food(FoodID)
    ON DELETE CASCADE
);

CREATE TABLE FoodItem (
 ReceiptNum INT NOT NULL,
 FoodID INT NOT NULL,
 InventoryID INT NOT NULL,
 CharityID INT NOT NULL,
 ExpirationDate DATE NOT NULL,
 Quantity INT NOT NULL,
 Name VARCHAR(100) NOT NULL,
 PRIMARY KEY (ReceiptNum, FoodID),
 FOREIGN KEY (InventoryID, CharityID) REFERENCES Inventory(InventoryID, CharityID)
 ON DELETE CASCADE,
 FOREIGN KEY (CharityID) REFERENCES Charities(CharityID)
 ON DELETE CASCADE,
 FOREIGN KEY (FoodID) REFERENCES Food(FoodID)
 ON DELETE CASCADE
 );

-- FoodDonors table
CREATE TABLE FoodDonors (
    DonorID INT PRIMARY KEY,
    Name VARCHAR2(100) NOT NULL,
    Type VARCHAR2(50),
    ReceiptNum INT NOT NULL
);

-- StatusQuantity table
CREATE TABLE StatusQuantity (
    Status VARCHAR2(50) PRIMARY KEY,
    Quantity INT NOT NULL
);

-- DonationReceipt table
CREATE TABLE DonationReceipt (
    ReceiptNum INT PRIMARY KEY,
    DonorID INT NOT NULL,
    Amount INT NOT NULL,
    FOREIGN KEY (DonorID)
    REFERENCES FoodDonors(DonorID)
    ON DELETE CASCADE
);

-- DonorDate table
CREATE TABLE DonorDate (
    DonorID INT PRIMARY KEY,
    DonationDate DATE NOT NULL
);

-- WorkerInfo table
CREATE TABLE WorkerInfo (
    PhoneNumber VARCHAR2(15) NOT NULL,
    Name VARCHAR2(100) NOT NULL,
    PRIMARY KEY (PhoneNumber)
);

-- CharityWorkerDetails table
CREATE TABLE CharityWorkerDetails (
    PhoneNumber VARCHAR2(15) NOT NULL,
    CharityID INT NOT NULL,
    Status VARCHAR2(50),
    StartDate DATE NOT NULL,
    PRIMARY KEY (PhoneNumber, CharityID),
    FOREIGN KEY (PhoneNumber)
    REFERENCES WorkerInfo(PhoneNumber)
    ON DELETE CASCADE,
    FOREIGN KEY (CharityID)
    REFERENCES Charities(CharityID)
    ON DELETE CASCADE
);

-- Staff table
CREATE TABLE Staff (
    PhoneNumber VARCHAR2(15) PRIMARY KEY,
    AdminCode VARCHAR2(10),
    Salary NUMBER(10, 2),
    FOREIGN KEY (PhoneNumber)
    REFERENCES WorkerInfo(PhoneNumber)
    ON DELETE CASCADE
);

-- Volunteers table
CREATE TABLE Volunteers (
    PhoneNumber VARCHAR2(15) PRIMARY KEY,
    VolunteerHours INT NOT NULL,
    FOREIGN KEY (PhoneNumber)
    REFERENCES WorkerInfo(PhoneNumber)
    ON DELETE CASCADE
);

-- Donate table
CREATE TABLE Donate (
    CharityID INT NOT NULL,
    DonorID INT NOT NULL,
    PRIMARY KEY (CharityID, DonorID),
    FOREIGN KEY (CharityID)
    REFERENCES Charities(CharityID)
    ON DELETE CASCADE,
    FOREIGN KEY (DonorID)
    REFERENCES FoodDonors(DonorID)
    ON DELETE CASCADE
);


INSERT INTO Charities (CharityID, Address, Name) VALUES (1, '123 Charity St', 'Helping Hands');
INSERT INTO Charities (CharityID, Address, Name) VALUES (2, '456 Kindness Ave', 'Food for All');
INSERT INTO Charities (CharityID, Address, Name) VALUES (3, '789 Giving Rd', 'Care and Share');
INSERT INTO Charities (CharityID, Address, Name) VALUES (4, '101 Hope Blvd', 'Charity for Change');
INSERT INTO Charities (CharityID, Address, Name) VALUES (5, '202 Compassion Ln', 'Goodwill');
INSERT INTO Charities (CharityID, Address, Name) VALUES (6, '202 Poop Ln', 'Goodwill');

INSERT INTO DonationEvent (EventID, CharityID, Address, EventName, EventDate) VALUES (1, 1, '123 Charity St', 'Holiday Food Drive', TO_DATE('2024-12-01', 'YYYY-MM-DD'));
INSERT INTO DonationEvent (EventID, CharityID, Address, EventName, EventDate) VALUES (2, 2, '456 Kindness Ave', 'Summer BBQ', TO_DATE('2024-06-15', 'YYYY-MM-DD'));
INSERT INTO DonationEvent (EventID, CharityID, Address, EventName, EventDate) VALUES (3, 3, '789 Giving Rd', 'Thanksgiving Feast', TO_DATE('2024-10-10', 'YYYY-MM-DD'));
INSERT INTO DonationEvent (EventID, CharityID, Address, EventName, EventDate) VALUES (4, 4, '101 Hope Blvd', 'Winter Clothes Distribution', TO_DATE('2024-12-15', 'YYYY-MM-DD'));
INSERT INTO DonationEvent (EventID, CharityID, Address, EventName, EventDate) VALUES (5, 5, '202 Compassion Ln', 'Community Gathering', TO_DATE('2024-05-01', 'YYYY-MM-DD'));
INSERT INTO DonationEvent (EventID, CharityID, Address, EventName, EventDate) VALUES (6, 6, '202 Poop Ln', 'Community L', TO_DATE('2024-05-02', 'YYYY-MM-DD'));

INSERT INTO Recipients (SinNum, EventID, Age, ContactNum, Gender) VALUES ('123456789', 1, 34, '555-1234', 'Male');
INSERT INTO Recipients (SinNum, EventID, Age, ContactNum, Gender) VALUES ('987654321', 2, 45, '555-9876', 'Female');
INSERT INTO Recipients (SinNum, EventID, Age, ContactNum, Gender) VALUES ('112233445', 3, 29, '555-1122', 'Male');
INSERT INTO Recipients (SinNum, EventID, Age, ContactNum, Gender) VALUES ('223344556', 4, 60, '555-2233', 'Female');
INSERT INTO Recipients (SinNum, EventID, Age, ContactNum, Gender) VALUES ('334455667', 5, 18, '555-3344', 'Female');
INSERT INTO Recipients (SinNum, EventID, Age, ContactNum, Gender) VALUES ('887654321', 5, 18, '111-2222', 'other');


INSERT INTO ContactAddress (ContactNum, Address) VALUES ('555-1234', '123 Charity St');
INSERT INTO ContactAddress (ContactNum, Address) VALUES ('555-9876', '456 Kindness Ave');
INSERT INTO ContactAddress (ContactNum, Address) VALUES ('555-1122', '789 Giving Rd');
INSERT INTO ContactAddress (ContactNum, Address) VALUES ('555-2233', '101 Hope Blvd');
INSERT INTO ContactAddress (ContactNum, Address) VALUES ('555-3344', '202 Compassion Ln');

INSERT INTO Food (FoodID, FoodName, FoodDescription) VALUES (1, 'Apple', 'A fresh red apple');
INSERT INTO Food (FoodID, FoodName, FoodDescription) VALUES (2, 'Canned Beans', 'Canned black beans');
INSERT INTO Food (FoodID, FoodName, FoodDescription) VALUES (3, 'Bread', 'Whole wheat bread');
INSERT INTO Food (FoodID, FoodName, FoodDescription) VALUES (4, 'Rice', 'Long grain white rice');
INSERT INTO Food (FoodID, FoodName, FoodDescription) VALUES (5, 'Milk', '1% milk');

INSERT INTO FoodNameType (FoodName, FoodType) VALUES ('Apple', 'Fruit');
INSERT INTO FoodNameType (FoodName, FoodType) VALUES ('Canned Beans', 'Legume');
INSERT INTO FoodNameType (FoodName, FoodType) VALUES ('Bread', 'Grain');
INSERT INTO FoodNameType (FoodName, FoodType) VALUES ('Rice', 'Grain');
INSERT INTO FoodNameType (FoodName, FoodType) VALUES ('Milk', 'Dairy');

INSERT INTO FoodReceived (FoodID, SinNum, Quantity, InventoryQuantity) VALUES (1, '123456789', 10, 90);
INSERT INTO FoodReceived (FoodID, SinNum, Quantity, InventoryQuantity) VALUES (2, '987654321', 5, 45);
INSERT INTO FoodReceived (FoodID, SinNum, Quantity, InventoryQuantity) VALUES (3, '112233445', 20, 180);
INSERT INTO FoodReceived (FoodID, SinNum, Quantity, InventoryQuantity) VALUES (3, '887654321', 12, 40);
INSERT INTO FoodReceived (FoodID, SinNum, Quantity, InventoryQuantity) VALUES (4, '223344556', 30, 470);
INSERT INTO FoodReceived (FoodID, SinNum, Quantity, InventoryQuantity) VALUES (5, '334455667', 15, 285);

INSERT INTO Inventory (InventoryID, CharityID, Status, FoodID, Location) VALUES (1, 1, 'Available', 1, 'Warehouse 1');
INSERT INTO Inventory (InventoryID, CharityID, Status, FoodID, Location) VALUES (2, 2, 'Surplus', 2, 'Storage Room A');
INSERT INTO Inventory (InventoryID, CharityID, Status, FoodID, Location) VALUES (3, 3, 'Available', 3, 'Pantry B');
INSERT INTO Inventory (InventoryID, CharityID, Status, FoodID, Location) VALUES (4, 4, 'Reserved', 4, 'Fridge 1');
INSERT INTO Inventory (InventoryID, CharityID, Status, FoodID, Location) VALUES (5, 5, 'Low Stock', 5, 'Storage Room C');

INSERT INTO StatusQuantity (Status, Quantity) VALUES ('Available', 100);
INSERT INTO StatusQuantity (Status, Quantity) VALUES ('Low Stock', 50);
INSERT INTO StatusQuantity (Status, Quantity) VALUES ('Out of Stock', 0);
INSERT INTO StatusQuantity (Status, Quantity) VALUES ('Surplus', 500);
INSERT INTO StatusQuantity (Status, Quantity) VALUES ('Reserved', 200);

INSERT INTO FoodDonors (DonorID, Name, Type, ReceiptNum) VALUES (1, 'John Doe', 'Individual', 1);
INSERT INTO FoodDonors (DonorID, Name, Type, ReceiptNum) VALUES (2, 'ACME Corp', 'Corporation', 2);
INSERT INTO FoodDonors (DonorID, Name, Type, ReceiptNum) VALUES (3, 'Jane Smith', 'Individual', 3);
INSERT INTO FoodDonors (DonorID, Name, Type, ReceiptNum) VALUES (4, 'Charity Group A', 'Organization', 4);
INSERT INTO FoodDonors (DonorID, Name, Type, ReceiptNum) VALUES (5, 'Local Market', 'Business', 5);

INSERT INTO DonationReceipt (ReceiptNum, DonorID, Amount) VALUES (1, 1, 400);
INSERT INTO DonationReceipt (ReceiptNum, DonorID, Amount) VALUES (2, 2, 500);
INSERT INTO DonationReceipt (ReceiptNum, DonorID, Amount) VALUES (3, 3, 200);
INSERT INTO DonationReceipt (ReceiptNum, DonorID, Amount) VALUES (4, 4, 300);
INSERT INTO DonationReceipt (ReceiptNum, DonorID, Amount) VALUES (5, 5, 100);

INSERT INTO DonorDate (DonorID, DonationDate) VALUES (1, TO_DATE('2024-10-01', 'YYYY-MM-DD'));
INSERT INTO DonorDate (DonorID, DonationDate) VALUES (2, TO_DATE('2024-11-01', 'YYYY-MM-DD'));
INSERT INTO DonorDate (DonorID, DonationDate) VALUES (3, TO_DATE('2024-12-01', 'YYYY-MM-DD'));
INSERT INTO DonorDate (DonorID, DonationDate) VALUES (4, TO_DATE('2024-08-01', 'YYYY-MM-DD'));
INSERT INTO DonorDate (DonorID, DonationDate) VALUES (5, TO_DATE('2024-07-01', 'YYYY-MM-DD'));

INSERT INTO WorkerInfo (PhoneNumber, Name) VALUES ('555-0001', 'John Doe');
INSERT INTO WorkerInfo (PhoneNumber, Name) VALUES ('555-0002', 'Jane Smith');
INSERT INTO WorkerInfo (PhoneNumber, Name) VALUES ('555-0003', 'Michael Johnson');
INSERT INTO WorkerInfo (PhoneNumber, Name) VALUES ('555-0004', 'Emily Davis');
INSERT INTO WorkerInfo (PhoneNumber, Name) VALUES ('555-0005', 'David Brown');

INSERT INTO CharityWorkerDetails (PhoneNumber, CharityID, Status, StartDate) VALUES ('555-0001', 1, 'Active', TO_DATE('2023-01-15', 'YYYY-MM-DD'));
INSERT INTO CharityWorkerDetails (PhoneNumber, CharityID, Status, StartDate) VALUES ('555-0002', 2, 'Inactive', TO_DATE('2022-06-20', 'YYYY-MM-DD'));
INSERT INTO CharityWorkerDetails (PhoneNumber, CharityID, Status, StartDate) VALUES ('555-0003', 1, 'Active', TO_DATE('2021-11-10', 'YYYY-MM-DD'));
INSERT INTO CharityWorkerDetails (PhoneNumber, CharityID, Status, StartDate) VALUES ('555-0004', 3, 'Active', TO_DATE('2020-09-25', 'YYYY-MM-DD'));
INSERT INTO CharityWorkerDetails (PhoneNumber, CharityID, Status, StartDate) VALUES ('555-0005', 2, 'Inactive', TO_DATE('2019-07-30', 'YYYY-MM-DD'));

INSERT INTO Staff (PhoneNumber, AdminCode, Salary) VALUES ('555-0001', 'A123', 50000.00);
INSERT INTO Staff (PhoneNumber, AdminCode, Salary) VALUES ('555-0002', 'B234', 55000.00);
INSERT INTO Staff (PhoneNumber, AdminCode, Salary) VALUES ('555-0003', 'C345', 60000.00);
INSERT INTO Staff (PhoneNumber, AdminCode, Salary) VALUES ('555-0004', 'D456', 65000.00);
INSERT INTO Staff (PhoneNumber, AdminCode, Salary) VALUES ('555-0005', 'E567', 70000.00);

INSERT INTO Volunteers (PhoneNumber, VolunteerHours) VALUES ('555-0001', 120);
INSERT INTO Volunteers (PhoneNumber, VolunteerHours) VALUES ('555-0002', 100);
INSERT INTO Volunteers (PhoneNumber, VolunteerHours) VALUES ('555-0003', 80);
INSERT INTO Volunteers (PhoneNumber, VolunteerHours) VALUES ('555-0004', 150);
INSERT INTO Volunteers (PhoneNumber, VolunteerHours) VALUES ('555-0005', 90);
