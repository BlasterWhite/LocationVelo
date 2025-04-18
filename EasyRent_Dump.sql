DROP TABLE IF EXISTS replacement;
DROP TABLE IF EXISTS maintenance;
DROP TABLE IF EXISTS rental_association;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS rental;
DROP TABLE IF EXISTS bicycle;
DROP TABLE IF EXISTS account;
CREATE TABLE bicycle(
	bicycle_id SERIAL,
	bicycle_type VARCHAR NOT NULL,
	brand VARCHAR NOT NULL,
	model VARCHAR NOT NULL,
	image VARCHAR DEFAULT 'https://placehold.co/600x400',
	lifetime DATE NOT NULL,
	price_per_day FLOAT NOT NULL DEFAULT 20.0,
	revision_cycle INTEGER NOT NULL,
	last_km_service INTEGER NOT NULL DEFAULT 0,
	counter_km INTEGER NOT NULL DEFAULT 0,
	status VARCHAR NOT NULL DEFAULT 'Disponible',
	electric_assistance BOOLEAN NOT NULL DEFAULT false,
	CONSTRAINT pk_bicycle PRIMARY KEY (bicycle_id)
);
CREATE TABLE account(
	account_id SERIAL,
	first_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	hashed_password VARCHAR NOT NULL,
	email VARCHAR NOT NULL UNIQUE,
	phone VARCHAR NOT NULL,
	address VARCHAR NOT NULL,
	account_role VARCHAR NOT NULL DEFAULT 'client',
	subscribe BOOLEAN NOT NULL DEFAULT false,
	CONSTRAINT pk_account PRIMARY KEY (account_id)
);
CREATE TABLE maintenance(
	maintenance_id SERIAL,
	bicycle_id INTEGER,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	CONSTRAINT pk_maintenance PRIMARY KEY (maintenance_id),
	CONSTRAINT fk_bicycle_id FOREIGN KEY (bicycle_id) REFERENCES bicycle(bicycle_id) ON DELETE CASCADE
);
CREATE TABLE replacement(
	replacement_id SERIAL,
	maintenance_id INTEGER,
	part_ref VARCHAR NOT NULL,
	part_name VARCHAR NOT NULL,
	CONSTRAINT pk_replacement PRIMARY KEY (replacement_id),
	CONSTRAINT fk_maintenance FOREIGN KEY (maintenance_id) REFERENCES maintenance(maintenance_id) ON DELETE CASCADE
);
CREATE TABLE rental(
	rental_id SERIAL,
	account_id INTEGER,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	payment_status VARCHAR NOT NULL,
	rental_status VARCHAR NOT NULL,
	CONSTRAINT pk_rental PRIMARY KEY (rental_id),
	CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE
);
CREATE TABLE review(
	review_id SERIAL,
	rental_id INTEGER,
	rate FLOAT NOT NULL,
	description VARCHAR NOT NULL DEFAULT '',
	date_review DATE NOT NULL,
	CONSTRAINT pk_review PRIMARY KEY (review_id),
	CONSTRAINT fk_review FOREIGN KEY (rental_id) REFERENCES rental(rental_id) ON DELETE CASCADE
);
CREATE TABLE rental_association (
	rental_id INTEGER,
	bicycle_id INTEGER,
	CONSTRAINT pk_rental_association PRIMARY KEY (rental_id, bicycle_id),
	CONSTRAINT fk_rental FOREIGN KEY (rental_id) REFERENCES rental(rental_id) ON DELETE CASCADE,
	CONSTRAINT fk_bicycle FOREIGN KEY (bicycle_id) REFERENCES bicycle(bicycle_id) ON DELETE CASCADE
);
-- Insertion dans la table bicycle
INSERT INTO bicycle (
		bicycle_type,
		brand,
		model,
		lifetime,
		price_per_day,
		image,
		revision_cycle,
		last_km_service,
		counter_km,
		status,
		electric_assistance
	)
VALUES (
		'VTT',
		'Cannondale',
		'Trail 7',
		'2030-12-31',
		24.99,
		'https://reidbikes.com/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1730605841',
		500,
		100,
		250,
		'Réservé',
		false
	),
	(
		'Route',
		'Trek',
		'Domane SL',
		'2032-06-30',
		30.00,
		'https://bike-mailorder.imgbo.lt/media/image/29/b1/61/MadoneSL6Gen8-MatteDarkWeb-1.png',
		1000,
		200,
		600,
		'Réservé',
		DEFAULT
	),
	(
		'Ville',
		'Gazelle',
		'Orange C8',
		'2031-03-15',
		15.50,
		'https://hepha.com/cdn/shop/files/HEPHA_MY24_Trekking7_Performance_StepThrough_1_736929d3-5980-4b92-90f4-b3a5938884f5.png?v=1711108614',
		750,
		0,
		DEFAULT,
		DEFAULT,
		false
	),
	(
		'Gravel',
		'Specialized',
		'S-Works',
		'2033-08-20',
		35.00,
		'https://media1.velobecane.com/1572-large_default/velo-electrique-vtt-fabike-electrique-velobecane.jpg',
		600,
		DEFAULT,
		0,
		'Maintenance',
		true
	),
	(
		'BMX',
		'Haro',
		'Street',
		'2030-11-05',
		12.00,
		'https://www.mongoose.com/cdn/shop/files/M41700U10_18U_LegionL18-SIL_PDP_ATF01_41a66bf4-01e6-4843-8ee6-cc8a5cd06d9a_1200x.png?v=1728859903',
		450,
		80,
		400,
		'Maintenance',
		false
	);
-- Insertion dans la table account
INSERT INTO account (
		first_name,
		last_name,
		hashed_password,
		email,
		phone,
		address,
		account_role,
		subscribe
	)
VALUES (
		'Alice',
		'Dupont',
		'hashed_pwd1',
		'alice.dupont@example.com',
		'0123456789',
		'1 Rue de Paris',
		'client',
		DEFAULT
	),
	(
		'Bob',
		'Martin',
		'hashed_pwd2',
		'bob.martin@example.com',
		'0987654321',
		'2 Avenue de Lyon',
		'client',
		true
	),
	(
		'Claire',
		'Bernard',
		'hashed_pwd3',
		'claire.bernard@example.com',
		'0246813579',
		'3 Boulevard de Nice',
		DEFAULT,
		false
	),
	(
		'David',
		'Durand',
		'hashed_pwd4',
		'david.durand@example.com',
		'0369247518',
		'4 Place de Bordeaux',
		'admin',
		true
	),
	(
		'Emma',
		'Lefevre',
		'hashed_pwd5',
		'emma.lefevre@example.com',
		'0147258369',
		'5 Route de Marseille',
		'client',
		false
	);
-- Insertion dans la table maintenance (attention : bicycle_id doit être une valeur existante dans bicycle)
INSERT INTO maintenance (bicycle_id, start_date, end_date)
VALUES (1, '2024-01-01', '2024-01-05'),
	(2, '2024-06-10', '2024-06-15'),
	(3, '2025-04-10', '2025-04-12'),
	(4, '2025-04-14', '2025-04-20'),
	(5, '2025-04-13', '2025-05-10');
-- Insertion dans la table replacement (maintenance_id doit référencer maintenance)
INSERT INTO replacement (maintenance_id, part_ref, part_name)
VALUES (1, 'REF12345', 'Chaîne'),
	(2, 'REF23456', 'Pignon'),
	(3, 'REF34567', 'Freins'),
	(4, 'REF45678', 'Roue'),
	(5, 'REF56789', 'Vélo complet');
-- Insertion dans la table rental (account_id doit référencer account)
INSERT INTO rental (
		account_id,
		start_date,
		end_date,
		payment_status,
		rental_status
	)
VALUES (1, '2024-07-01', '2024-06-05', 'Payé', 'Terminé'),
	(
		1,
		'2024-06-01',
		'2025-06-05',
		'Payé',
		'En cours'
	),
	(
		2,
		'2024-06-10',
		'2025-06-15',
		'Non payé',
		'En cours'
	),
	(3, '2024-07-01', '2025-04-05', 'Payé', 'Terminé'),
	(4, '2025-07-10', '2025-07-15', 'Payé', 'Annulé'),
	(
		5,
		'2025-04-15',
		'2025-08-05',
		'Non payé',
		'Annulé'
	);
-- Insertion dans la table review (rental_id doit référencer rental)
INSERT INTO review (rental_id, rate, description, date_review)
VALUES (1, 4.5, 'Très bon service', '2024-06-06'),
	(4, 5.0, 'Excellent', '2025-04-06');
-- Insertion dans la table rental_association 
-- (les couples (rental_id, bicycle_id) doivent correspondre à des valeurs existantes dans rental et bicycle)
INSERT INTO rental_association (rental_id, bicycle_id)
VALUES (1, 2),
	(2, 1),
	(3, 2),
	(4, 3),
	(5, 4),
	(6, 5);
CREATE VIEW newsletter_subscribers AS
SELECT *
FROM account
where subscribe = true;