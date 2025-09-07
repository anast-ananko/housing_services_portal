CREATE INDEX idx_requests_resident_id ON Requests(resident_id);
CREATE INDEX idx_requests_service_id ON Requests(service_id);
CREATE INDEX idx_requests_manager_id ON Requests(manager_id);
CREATE INDEX idx_payments_request_id ON Payments(request_id);
CREATE INDEX idx_users_resident_id ON Users(resident_id);
CREATE INDEX idx_users_manager_id ON Users(manager_id);