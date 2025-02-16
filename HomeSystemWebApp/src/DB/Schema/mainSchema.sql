-- User Details Table
CREATE TABLE `userdetails` (
	`UserID` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
	`Password` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`Username` VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8mb4_unicode_ci',
	`Email` VARCHAR(50) CHECK (Email LIKE '%@%.%') NOT NULL DEFAULT '' COLLATE 'utf8mb4_unicode_ci',
	`HomeID` INT(3) UNSIGNED NOT NULL,
	`Admin` ENUM('Y','N') NOT NULL DEFAULT 'N' COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`UserID`) USING BTREE,
	UNIQUE INDEX `UNIQUE FIELD` (`Email`, `Username`) USING BTREE,
	INDEX `FK_userdetails_homedetails` (`HomeID`) USING BTREE,
	CONSTRAINT `FK_userdetails_homedetails` FOREIGN KEY (`HomeID`) REFERENCES `homedetails` (`HomeID`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

-- Universal Devices Table
CREATE TABLE `alldevices` (
	`DeviceID` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
	`DeviceName` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`DeviceType` ENUM('Robot','EnergyGeneration','EnergyUsage') NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`Status` ENUM('On','Off') NOT NULL DEFAULT 'Off' COLLATE 'utf8mb4_unicode_ci',
	`Location/Room` VARCHAR(25) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`HomeID` INT(3) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`DeviceID`) USING BTREE,
	INDEX `FK_alldevices_homedetails` (`HomeID`) USING BTREE,
	CONSTRAINT `FK_alldevices_homedetails` FOREIGN KEY (`HomeID`) REFERENCES `homedetails` (`HomeID`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

-- Home Details Table
CREATE TABLE `homedetails` (
	`HomeID` INT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
	`NoOfResidents` INT(3) UNSIGNED NOT NULL,
	`HomeManager` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`HomeID`) USING BTREE
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

-- Energy Generation Tables
CREATE TABLE `energygeneration_daily` (
	`RecordNum` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`DeviceID` INT(5) UNSIGNED NOT NULL,
	`EnergyGen` FLOAT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`RecordNum`) USING BTREE,
	INDEX `FK_energygeneration_daily_alldevices` (`DeviceID`) USING BTREE,
	CONSTRAINT `FK_energygeneration_daily_alldevices` FOREIGN KEY (`DeviceID`) REFERENCES `alldevices` (`DeviceID`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

CREATE TABLE `energygeneration_weekly` (
	`RecordNum` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`DeviceID` INT(5) UNSIGNED NOT NULL,
	`EnergyGen` FLOAT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`RecordNum`) USING BTREE,
	INDEX `FK_energygeneration_weekly_alldevices` (`DeviceID`) USING BTREE,
	CONSTRAINT `FK_energygeneration_weekly_alldevices` FOREIGN KEY (`DeviceID`) REFERENCES `alldevices` (`DeviceID`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

CREATE TABLE `energygeneration_monthly` (
	`RecordNum` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`DeviceID` INT(5) UNSIGNED NOT NULL,
	`EnergyGen` FLOAT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`RecordNum`) USING BTREE,
	INDEX `FK_energygeneration_monthly_alldevices` (`DeviceID`) USING BTREE,
	CONSTRAINT `FK_energygeneration_monthly_alldevices` FOREIGN KEY (`DeviceID`) REFERENCES `alldevices` (`DeviceID`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

-- Energy Usage Tables
CREATE TABLE `energyusage_daily` (
	`RecordNum` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`DeviceID` INT(5) UNSIGNED NOT NULL,
	`EnergyUsage` FLOAT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`RecordNum`) USING BTREE,
	INDEX `FK_energyusage_daily_alldevices` (`DeviceID`) USING BTREE,
	CONSTRAINT `FK_energyusage_daily_alldevices` FOREIGN KEY (`DeviceID`) REFERENCES `alldevices` (`DeviceID`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

CREATE TABLE `energyusage_weekly` (
	`RecordNum` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`DeviceID` INT(5) UNSIGNED NOT NULL,
	`EnergyUsage` FLOAT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`RecordNum`) USING BTREE,
	INDEX `FK_energyusage_weekly_alldevices` (`DeviceID`) USING BTREE,
	CONSTRAINT `FK_energyusage_weekly_alldevices` FOREIGN KEY (`DeviceID`) REFERENCES `alldevices` (`DeviceID`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

CREATE TABLE `energyusage_monthly` (
	`RecordNum` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`DeviceID` INT(5) UNSIGNED NOT NULL,
	`EnergyUsage` FLOAT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`RecordNum`) USING BTREE,
	INDEX `FK_energyusage_monthly_alldevices` (`DeviceID`) USING BTREE,
	CONSTRAINT `FK_energyusage_monthly_alldevices` FOREIGN KEY (`DeviceID`) REFERENCES `alldevices` (`DeviceID`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;