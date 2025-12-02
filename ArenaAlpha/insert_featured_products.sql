-- Insert 4 Featured Products
-- These will appear in the "Featured Products" section on index.html

INSERT INTO products (name, category, description, price, original_price, image, stock) VALUES
('Galaxy Headset', 'featured', 'Immersive sound experience for pro gamers.', 29.99, 40.99, 'images/item1.jpg', 10),
('Alpha Mouse', 'featured', 'Precision engineered RGB gaming mouse.', 29.99, 40.99, 'images/item2.jpg', 15),
('Neon Keyboard', 'featured', 'Mechanical keys with adaptive neon lighting.', 30.00, 50.00, 'images/item3.jpg', 12),
('Pro Gaming Chair', 'featured', 'Ergonomic design for extended gaming sessions.', 199.99, 299.99, 'images/item4.jpg', 8),
('Gaming Monitor 27"', 'featured', '4K UHD display with 144Hz refresh rate.', 349.99, 499.99, 'images/monitor.jpg', 6),
('RGB Mouse Pad', 'featured', 'Large gaming mouse pad with customizable RGB lighting.', 24.99, 39.99, 'images/mousepad.jpg', 20),
('Wireless Headset Pro', 'featured', 'Premium wireless gaming headset with noise cancellation.', 89.99, 129.99, 'images/wireless-headset.jpg', 10),
('Mechanical Keyboard RGB', 'featured', 'Full-size mechanical keyboard with per-key RGB lighting.', 79.99, 119.99, 'images/keyboard-rgb.jpg', 14),
('Gaming Webcam HD', 'featured', '1080p HD webcam perfect for streaming and video calls.', 49.99, 79.99, 'images/webcam.jpg', 18),
('USB-C Hub Gaming', 'featured', 'Multi-port USB-C hub for gaming setups.', 34.99, 54.99, 'images/usb-hub.jpg', 25),
('Gaming Desk Mat', 'featured', 'Extra large desk mat with water-resistant surface.', 19.99, 34.99, 'images/desk-mat.jpg', 30),
('RGB Light Strip', 'featured', 'Smart RGB LED strip with app control and music sync.', 29.99, 49.99, 'images/rgb-strip.jpg', 22),
('Gaming Microphone', 'featured', 'Professional USB microphone for streaming and recording.', 59.99, 89.99, 'images/microphone.jpg', 12),
('Monitor Stand Dual', 'featured', 'Dual monitor stand with adjustable height and tilt.', 89.99, 139.99, 'images/monitor-stand.jpg', 8),
('Gaming Controller Pro', 'featured', 'Wireless gaming controller with customizable buttons.', 69.99, 99.99, 'images/controller.jpg', 16),
('Cable Management Kit', 'featured', 'Complete cable management solution for clean setup.', 14.99, 24.99, 'images/cable-kit.jpg', 35);

-- Note: Make sure the section column exists. If not, run:
-- ALTER TABLE products ADD COLUMN section VARCHAR(50) NULL DEFAULT NULL AFTER category;

