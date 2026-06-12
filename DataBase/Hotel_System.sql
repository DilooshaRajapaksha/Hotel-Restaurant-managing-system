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
    description TEXT NULL,
    FOREIGN KEY (room_type_id) REFERENCES ROOM_TYPES(room_type_id)
);

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
    is_360 BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES ROOM(room_id) ON DELETE CASCADE
);

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
    latitude DOUBLE NULL,
    longitude DOUBLE NULL,
    formatted_address TEXT NULL,
    house_no VARCHAR(100) NULL,
    area VARCHAR(150) NULL,
    notes TEXT NULL,
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

-- ====================== INSERT EXISTING DATA ======================

INSERT INTO `ROLE` (name) VALUES ('CUSTOMER'),('ADMIN'),('DELIVERY_STAFF');

-- ====================== CREATE ADMIN ACCOUNT ======================
-- Email    : admin@hotel.com
-- Password : password
INSERT INTO `USER` (first_name, last_name, email, password_hash, phone_number, role)
VALUES ('Admin', 'User', 'admin@hotel.com', 
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
        '0771234567', 'ADMIN');
        
