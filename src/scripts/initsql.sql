DROP TABLE Donate CASCADE CONSTRAINTS;
DROP TABLE Volunteers CASCADE CONSTRAINTS;
DROP TABLE Staff CASCADE CONSTRAINTS;
DROP TABLE WorkerInfo CASCADE CONSTRAINTS;
DROP TABLE CharityWorkerDetails CASCADE CONSTRAINTS;
DROP TABLE FoodDonors CASCADE CONSTRAINTS;
DROP TABLE DonorDate CASCADE CONSTRAINTS;
DROP TABLE DonationReceipt CASCADE CONSTRAINTS;
DROP TABLE StatusQuantity CASCADE CONSTRAINTS;
DROP TABLE Inventory CASCADE CONSTRAINTS;
DROP TABLE FoodReceived CASCADE CONSTRAINTS;
DROP TABLE FoodItem CASCADE CONSTRAINTS;
DROP TABLE FoodNameType CASCADE CONSTRAINTS;
DROP TABLE Food CASCADE CONSTRAINTS;
DROP TABLE ContactAddress CASCADE CONSTRAINTS;
DROP TABLE Recipients CASCADE CONSTRAINTS;
DROP TABLE EventNameDate CASCADE CONSTRAINTS;
DROP TABLE DonationEvent CASCADE CONSTRAINTS;
DROP TABLE AddressProvince CASCADE CONSTRAINTS;
DROP TABLE Charities CASCADE CONSTRAINTS;

-- Creating tables
CREATE TABLE Charities (
    CharityID INT PRIMARY KEY,
    Address VARCHAR(255) NOT NULL UNIQUE,
    Name VARCHAR(100) NOT NULL
);

CREATE TABLE AddressProvince (
    Address VARCHAR(255) PRIMARY KEY,
    Province VARCHAR(50) NOT NULL
);

CREATE TABLE DonationEvent (
    EventID INT PRIMARY KEY,
    CharityID INT NOT NULL,
    Address VARCHAR(255) NOT NULL,
    EventName VARCHAR(100) NOT NULL,
    FOREIGN KEY (CharityID) REFERENCES Charities(CharityID),
    FOREIGN KEY (Address) REFERENCES AddressProvince(Address)
);

CREATE TABLE EventNameDate (
    EventName VARCHAR(100) PRIMARY KEY,
    EventDate DATE NOT NULL
);

CREATE TABLE Recipients (
    SinNum CHAR(9) PRIMARY KEY,
    EventID INT NOT NULL,
    Age INT NOT NULL,
    ContactNum VARCHAR(15) NOT NULL,
    Gender VARCHAR(10),
    FOREIGN KEY (EventID) REFERENCES DonationEvent(EventID)
);

CREATE TABLE ContactAddress (
    ContactNum VARCHAR(15) PRIMARY KEY,
    Address VARCHAR(255) NOT NULL,
    FOREIGN KEY (Address) REFERENCES AddressProvince(Address)
);

CREATE TABLE Food (
    FoodID INT PRIMARY KEY,
    FoodName VARCHAR(100) NOT NULL UNIQUE,
    FoodDescription VARCHAR(255)
);

CREATE TABLE FoodNameType (
    FoodName VARCHAR(100) PRIMARY KEY,
    FoodType VARCHAR(50) NOT NULL
);

CREATE TABLE Inventory (
    InventoryID INT PRIMARY KEY,
    CharityID INT NOT NULL,
    Status VARCHAR(50),
    FoodID INT NOT NULL,
    Location VARCHAR(255) NOT NULL,
    FOREIGN KEY (CharityID) REFERENCES Charities(CharityID),
    FOREIGN KEY (FoodID) REFERENCES Food(FoodID)
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
    FOREIGN KEY (InventoryID) REFERENCES Inventory(InventoryID),
    FOREIGN KEY (CharityID) REFERENCES Charities(CharityID),
    FOREIGN KEY (FoodID) REFERENCES Food(FoodID)
);

CREATE TABLE FoodReceived (
    FoodID INT NOT NULL,
    SinNum CHAR(9) NOT NULL,
    Quantity INT NOT NULL,
    InventoryQuantity INT NOT NULL,
    PRIMARY KEY (FoodID, SinNum),
    FOREIGN KEY (FoodID) REFERENCES Food(FoodID),
    FOREIGN KEY (SinNum) REFERENCES Recipients(SinNum)
);

CREATE TABLE StatusQuantity (
    Status VARCHAR(50) PRIMARY KEY,
    Quantity INT NOT NULL
);

CREATE TABLE DonationReceipt (
    ReceiptNum INT PRIMARY KEY,
    DonorID INT NOT NULL,
    FOREIGN KEY (DonorID) REFERENCES FoodDonors(DonorID)
);

CREATE TABLE DonorDate (
    DonorID INT PRIMARY KEY,
    Date DATE NOT NULL
);

CREATE TABLE FoodDonors (
    DonorID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Type VARCHAR(50),
    ReceiptNum INT NOT NULL,
    FOREIGN KEY (ReceiptNum) REFERENCES DonationReceipt(ReceiptNum)
);

CREATE TABLE CharityWorkerDetails (
    PhoneNumber VARCHAR(15) NOT NULL,
    CharityID INT NOT NULL,
    Status VARCHAR(50),
    StartDate DATE NOT NULL,
    PRIMARY KEY (PhoneNumber, CharityID),
    FOREIGN KEY (CharityID) REFERENCES Charities(CharityID)
);

CREATE TABLE WorkerInfo (
    PhoneNumber VARCHAR(15) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

CREATE TABLE Staff (
    PhoneNumber VARCHAR(15) PRIMARY KEY,
    AdminCode VARCHAR(10),
    Salary DECIMAL(10, 2),
    FOREIGN KEY (PhoneNumber) REFERENCES WorkerInfo(PhoneNumber),
    CHECK (PhoneNumber NOT IN (SELECT PhoneNumber FROM Volunteers))
);

CREATE TABLE Volunteers (
    PhoneNumber VARCHAR(15) PRIMARY KEY,
    VolunteerHours INT NOT NULL,
    FOREIGN KEY (PhoneNumber) REFERENCES WorkerInfo(PhoneNumber),
    CHECK (PhoneNumber NOT IN (SELECT PhoneNumber FROM Staff))
);

CREATE TABLE Donate (
    CharityID INT NOT NULL,
    DonorID INT NOT NULL,
    PRIMARY KEY (CharityID, DonorID),
    FOREIGN KEY (CharityID) REFERENCES Charities(CharityID),
    FOREIGN KEY (DonorID) REFERENCES FoodDonors(DonorID)
);
