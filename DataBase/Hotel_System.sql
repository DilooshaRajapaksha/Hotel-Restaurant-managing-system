CREATE DATABASE Hotel_System;
USE Hotel_System;

CREATE TABLE `ROLE`(
    role_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE `USER`(
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    user_image LONGTEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DELIVERY_STAFF(
    staff_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    s_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL,
    join_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ROOM_TYPES(
    room_type_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_type_name VARCHAR(255) NOT NULL,
    room_description TEXT NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE ROOM(
    room_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    room_type_id BIGINT NOT NULL,
    room_price DECIMAL(10,2) NOT NULL CHECK (room_price >= 0),
    room_status ENUM('AVAILABLE','MAINTENANCE') DEFAULT 'AVAILABLE',
    FOREIGN KEY (room_type_id) REFERENCES ROOM_TYPES(room_type_id)
);

ALTER TABLE ROOM 
ADD COLUMN description TEXT NULL 
AFTER room_status;

CREATE TABLE BOOKING(
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guest INT NOT NULL CHECK(number_of_guest > 0),
    special_request TEXT,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    booking_status ENUM('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
    FOREIGN KEY (user_id) REFERENCES `USER`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES ROOM(room_id) ON DELETE CASCADE
);

CREATE TABLE HOTEL_REVIEW(
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment_hotel TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `USER`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES ROOM(room_id) ON DELETE CASCADE
);

CREATE TABLE HOTEL_IMAGE(
    Rimage_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    Rimage_url VARCHAR(500) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES ROOM(room_id) ON DELETE CASCADE
);
ALTER TABLE HOTEL_IMAGE ADD COLUMN is_360 BOOLEAN DEFAULT FALSE;

CREATE TABLE MENU(
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE MENU_ITEMS(
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    half_price DECIMAL(10,2) NULL CHECK(half_price >= 0),
    full_price DECIMAL(10,2) NULL CHECK(full_price >= 0),
    price DECIMAL(10,2) NOT NULL CHECK(price >= 0),
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INT,
    FOREIGN KEY (category_id) REFERENCES MENU(category_id)
);

CREATE TABLE MENU_IMAGE(
    Fimage_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    Fimage_url VARCHAR(500) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES MENU_ITEMS(item_id) ON DELETE CASCADE
);

CREATE TABLE ADDRESS(
    address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(200) NOT NULL,
    district VARCHAR(200) NOT NULL,
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `USER`(user_id) ON DELETE CASCADE
);

CREATE TABLE FOOD_ORDER(
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_id BIGINT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL CHECK(total_amount >= 0),
    staff_id BIGINT NULL,
    order_status ENUM('PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') DEFAULT 'PENDING',
    FOREIGN KEY (user_id) REFERENCES `USER`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES ADDRESS(address_id),
    FOREIGN KEY (staff_id) REFERENCES DELIVERY_STAFF(staff_id) ON DELETE SET NULL
);

CREATE TABLE ORDER_ITEM(
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (order_id) REFERENCES FOOD_ORDER(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES MENU_ITEMS(item_id)
);

CREATE TABLE PAYMENT(
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    booking_id BIGINT NULL,
    order_id BIGINT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK(amount >= 0),
    payment_method ENUM('CARD','CASH','ONLINE') NOT NULL,
    payment_status ENUM('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
    transaction_references VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `USER`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES BOOKING(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES FOOD_ORDER(order_id) ON DELETE CASCADE,
    CHECK (
        (booking_id IS NOT NULL AND order_id IS NULL) OR
        (booking_id IS NULL AND order_id IS NOT NULL)
    )
);

ALTER TABLE address ADD COLUMN latitude DOUBLE NULL;
ALTER TABLE address ADD COLUMN longitude DOUBLE NULL;
ALTER TABLE address ADD COLUMN formatted_address TEXT NULL;
ALTER TABLE address ADD COLUMN house_no VARCHAR(100) NULL;
ALTER TABLE address ADD COLUMN area VARCHAR(150) NULL;
ALTER TABLE address ADD COLUMN notes TEXT NULL;
ALTER TABLE address DROP COLUMN postal_code;
ALTER TABLE address DROP COLUMN district;


DESCRIBE ADDRESS;

SET FOREIGN_KEY_CHECKS = 0;

-- ====================== INSERT EXISTING DATA ======================

INSERT INTO `ROLE` (name) VALUES ('CUSTOMER'),('ADMIN'),('DELIVERY_STAFF');

-- Room types (your existing data)
INSERT INTO ROOM_TYPES (room_type_name, room_description, capacity) 
VALUES 
('Single', '1bed', 1),
('Double', '2bed', 3),
('Family', '4bed', 5);

-- Rooms (your existing data)
INSERT INTO ROOM (room_name, room_type_id, room_price) 
VALUES 
('Room1', 1, 2500),
('Room2', 2, 5500),
('Room3', 2, 10000),
('Room4', 3, 25000);

-- Hotel images (your existing data)
INSERT INTO HOTEL_IMAGE (room_id, Rimage_url, is_main) VALUES
(1, 'https://picsum.photos/id/1015/800/600', TRUE),
(2, 'https://picsum.photos/id/160/800/600', TRUE),
(3, 'https://picsum.photos/id/201/800/600', TRUE),
(4, 'https://picsum.photos/id/251/800/600', TRUE),
(5, 'https://picsum.photos/id/133/800/600', TRUE);

-- ====================== CREATE ADMIN ACCOUNT ======================
-- Email    : admin@hotel.com
-- Password : password
INSERT INTO `USER` (first_name, last_name, email, password_hash, phone_number, role)
VALUES ('Admin', 'User', 'admin@hotel.com', 
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
        '0771234567', 'ADMIN');
        
        
SELECT * FROM ROOM;
-- Change room_id if needed (example: room 5)
INSERT INTO HOTEL_IMAGE 
    (room_id, Rimage_url, is_main, is_360)
VALUES 
    (5, '/uploads/rooms/panorama-test.jpg', TRUE, TRUE);
    
    
    SELECT * FROM HOTEL_IMAGE 
WHERE room_id = 5;

SET SQL_SAFE_UPDATES = 0;

DELETE FROM EXPERIENCES;

SET SQL_SAFE_UPDATES = 1;

-- Insert the 4 real experiences (exactly matching your original design)
INSERT INTO EXPERIENCES 
    (title, description, image_url, location, price, is_active)
VALUES
    ('ECO PARK', 'Explore the lush green Eco Park near Sigiriya with jeep safaris and nature trails.', 'https://picsum.photos/id/1015/800/600', 'Sigiriya', 4500, TRUE),
    ('SIGIRIYA', 'Climb the ancient rock fortress of Sigiriya and see the world-famous frescoes.', 'https://picsum.photos/id/160/800/600', 'Sigiriya', 12500, TRUE),
    ('DAMBULLA', 'Visit the magnificent cave temple complex with ancient Buddha statues.', 'https://picsum.photos/id/201/800/600', 'Dambulla', 3500, TRUE),
    ('ANURADHAPURA', 'Discover the sacred city and the giant stupa of Anuradhapura.', 'https://picsum.photos/id/251/800/600', 'Anuradhapura', 8000, TRUE);
    
    select * FROM experiences;
    
    SELECT * FROM USER;
    SELECT * FROM ROOM;
    

CREATE TABLE EXPERIENCES(
    experience_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    location VARCHAR(100),
    price DOUBLE NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO EXPERIENCES (title, description, image_url, location, price, is_active)
VALUES
('ECO PARK', 'Explore the lush green Eco Park near Sigiriya with jeep safaris and nature trails.', 'https://picsum.photos/id/1015/800/600', 'Sigiriya', 4500, TRUE),
('SIGIRIYA', 'Climb the ancient rock fortress of Sigiriya and see the world-famous frescoes.', 'https://picsum.photos/id/160/800/600', 'Sigiriya', 12500, TRUE),
('DAMBULLA', 'Visit the magnificent cave temple complex with ancient Buddha statues.', 'https://picsum.photos/id/201/800/600', 'Dambulla', 3500, TRUE),
('ANURADHAPURA', 'Discover the sacred city and the giant stupa of Anuradhapura.', 'https://picsum.photos/id/251/800/600', 'Anuradhapura', 8000, TRUE);