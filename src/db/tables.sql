CREATE TABLE Residents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Managers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role manager_role NOT NULL
);

CREATE TABLE Requests (
  id SERIAL PRIMARY KEY,
  resident_id INT NOT NULL REFERENCES Residents(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES Services(id) ON DELETE CASCADE,
  manager_id INT REFERENCES Managers(id) ON DELETE SET NULL,
  status request_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Payments (
  id SERIAL PRIMARY KEY,
  request_id INT NOT NULL REFERENCES Requests(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  paid_at TIMESTAMP
);

CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'resident',
  resident_id INT REFERENCES Residents(id) ON DELETE CASCADE,
  manager_id INT REFERENCES Managers(id) ON DELETE CASCADE
);
