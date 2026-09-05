from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import Product, AnalyticsSnapshot, AuditLog
from app.db.database import Base, engine, SessionLocal

MOCK_PRODUCTS = [
    # ==================== LAPTOPS & COMPUTING (20 Items) ====================
    {
        "title": "Acer Swift Go 14 OLED (2025)",
        "brand": "Acer",
        "category": "Laptops & Computing",
        "subcategory": "Budget Workstation",
        "price": 649.99,
        "original_price": 799.99,
        "rating": 4.6,
        "review_count": 342,
        "description": "Ultraportable 14-inch 2.8K OLED laptop with Intel Core Ultra 5 125H, 16GB LPDDR5X RAM, and 512GB PCIe Gen 4 SSD. Perfect for budget video editing, productivity, and color grading.",
        "specs": {
            "ram_gb": 16,
            "storage_gb": 512,
            "cpu": "Intel Core Ultra 5 125H (14 cores)",
            "gpu": "Intel Arc Graphics (Dedicated AI Boost)",
            "display": "14-inch 2.8K (2880x1800) OLED 90Hz 100% DCI-P3",
            "battery_hours": 11.5,
            "weight_kg": 1.32,
            "ports": "2x Thunderbolt 4, 2x USB-A 3.2, 1x HDMI 2.1, MicroSD"
        },
        "features": ["100% DCI-P3 OLED Display", "Intel AI Boost NPU", "Lightweight 1.32kg Aluminum Body", "Thunderbolt 4 Fast Charging"],
        "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 42,
        "delivery_days": 2,
        "tags": ["budget", "video-editing", "lightweight", "oled", "sub-700", "creator"]
    },
    {
        "title": "Lenovo IdeaPad Slim 5 Pro 16",
        "brand": "Lenovo",
        "category": "Laptops & Computing",
        "subcategory": "Budget Workstation",
        "price": 689.00,
        "original_price": 849.00,
        "rating": 4.5,
        "review_count": 215,
        "description": "Powerful 16-inch creator laptop powered by AMD Ryzen 7 7735HS, 16GB DDR5 RAM, 1TB NVMe SSD, and Radeon 680M graphics. Ideal for Premiere Pro, DaVinci Resolve, and multi-tasking.",
        "specs": {
            "ram_gb": 16,
            "storage_gb": 1024,
            "cpu": "AMD Ryzen 7 7735HS (8 cores / 16 threads)",
            "gpu": "AMD Radeon 680M Integrated",
            "display": "16-inch 2.5K (2560x1600) IPS 120Hz 100% sRGB",
            "battery_hours": 10.0,
            "weight_kg": 1.90,
            "ports": "1x USB-C 3.2, 1x USB4, 2x USB-A 3.2, HDMI 2.1, SD Card Reader"
        },
        "features": ["1TB High-speed NVMe SSD", "Full SD Card Reader for Cameras", "120Hz 2.5K Creator Display", "Rapid Charge Express"],
        "image_url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 28,
        "delivery_days": 1,
        "tags": ["budget", "video-editing", "ryzen", "sub-700", "1tb-storage", "creator"]
    },
    {
        "title": "ASUS Vivobook 16X Creator Edition",
        "brand": "ASUS",
        "category": "Laptops & Computing",
        "subcategory": "Budget Workstation",
        "price": 699.99,
        "original_price": 899.99,
        "rating": 4.7,
        "review_count": 489,
        "description": "Dedicated discrete GPU powerhouse under $700. Featuring Intel Core i5-13500H, NVIDIA GeForce RTX 3050 4GB, 16GB DDR4, and 512GB SSD. Hardware NVENC video export encoder.",
        "specs": {
            "ram_gb": 16,
            "storage_gb": 512,
            "cpu": "Intel Core i5-13500H (12 cores)",
            "gpu": "NVIDIA GeForce RTX 3050 4GB GDDR6",
            "display": "16-inch FHD+ (1920x1200) IPS 300 nits",
            "battery_hours": 7.5,
            "weight_kg": 1.80,
            "ports": "1x USB-C 3.2, 2x USB-A 3.2, HDMI 2.1, Audio combo"
        },
        "features": ["NVIDIA RTX 3050 Hardware Video Acceleration", "IceBlade Dual Fan Cooling", "ErgoSense Keyboard with NumPad", "Studio Certified Drivers"],
        "image_url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 19,
        "delivery_days": 2,
        "tags": ["budget", "video-editing", "nvidia", "rtx", "sub-700", "hardware-encoder"]
    },
    {
        "title": "HP Envy 14 Creator x360",
        "brand": "HP",
        "category": "Laptops & Computing",
        "subcategory": "2-in-1 Convertible",
        "price": 749.00,
        "original_price": 929.00,
        "rating": 4.4,
        "review_count": 178,
        "description": "Flexible 2-in-1 touchscreen laptop with Intel Core i7-1355U, 16GB RAM, 512GB SSD, and active stylus support. Great for mobile artists, storyboarding, and light video edits.",
        "specs": {
            "ram_gb": 16,
            "storage_gb": 512,
            "cpu": "Intel Core i7-1355U (10 cores)",
            "gpu": "Intel Iris Xe Graphics",
            "display": "14-inch FHD Touch IPS 100% sRGB 400 nits",
            "battery_hours": 12.0,
            "weight_kg": 1.52,
            "ports": "2x Thunderbolt 4, 2x USB-A, HDMI 2.1, MicroSD"
        },
        "features": ["360-degree hinge & Pen Support", "5MP IR GlamCam with Auto Frame", "Bang & Olufsen Dual Speakers"],
        "image_url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 15,
        "delivery_days": 3,
        "tags": ["convertible", "touchscreen", "portable", "student", "creator"]
    },
    {
        "title": "Apple MacBook Air 13-inch (M3, 2024)",
        "brand": "Apple",
        "category": "Laptops & Computing",
        "subcategory": "Premium Ultrabook",
        "price": 1049.00,
        "original_price": 1099.00,
        "rating": 4.9,
        "review_count": 1420,
        "description": "Supercharged by the M3 chip with 8-core CPU and 10-core GPU. Whisper-quiet fanless design, up to 18 hours battery life, and stunning Liquid Retina display.",
        "specs": {
            "ram_gb": 16,
            "storage_gb": 512,
            "cpu": "Apple M3 (8-core CPU, 16-core Neural Engine)",
            "gpu": "Apple M3 10-core GPU with Hardware Ray Tracing",
            "display": "13.6-inch Liquid Retina Display 500 nits P3 wide color",
            "battery_hours": 18.0,
            "weight_kg": 1.24,
            "ports": "MagSafe 3, 2x Thunderbolt / USB 4, 3.5mm Headphone"
        },
        "features": ["M3 ProRes & AV1 Media Engine", "Silent Fanless Design", "18-Hour All Day Battery", "1080p FaceTime HD Camera"],
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 50,
        "delivery_days": 1,
        "tags": ["premium", "apple", "macbook", "m3", "video-editing", "ultrabook", "silent"]
    },
    {
        "title": "Dell XPS 14 (2025)",
        "brand": "Dell",
        "category": "Laptops & Computing",
        "subcategory": "Premium Ultrabook",
        "price": 1499.00,
        "original_price": 1699.00,
        "rating": 4.7,
        "review_count": 310,
        "description": "CNC machined aluminum, Gorilla Glass 3 palm rest with seamless glass haptic touchpad. Intel Core Ultra 7 155H, 32GB LPDDR5X RAM, 1TB SSD, and NVIDIA RTX 4050 6GB.",
        "specs": {
            "ram_gb": 32,
            "storage_gb": 1024,
            "cpu": "Intel Core Ultra 7 155H (16 cores, 3.8 GHz NPU)",
            "gpu": "NVIDIA GeForce RTX 4050 6GB GDDR6",
            "display": "14.5-inch 3.2K (3200x2000) OLED Touch 120Hz",
            "battery_hours": 13.0,
            "weight_kg": 1.68,
            "ports": "3x Thunderbolt 4, MicroSD v6.0, 3.5mm Audio"
        },
        "features": ["InfinityEdge 3.2K OLED 120Hz", "Seamless Glass Touchpad", "Dedicated NVIDIA Studio RTX 4050", "32GB High-speed Unified Memory"],
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 22,
        "delivery_days": 2,
        "tags": ["premium", "video-editing", "oled", "nvidia", "workstation", "developer"]
    },
    {
        "title": "ASUS ROG Zephyrus G14 (2025)",
        "brand": "ASUS",
        "category": "Laptops & Computing",
        "subcategory": "Gaming & High-End Creator",
        "price": 1599.99,
        "original_price": 1799.99,
        "rating": 4.8,
        "review_count": 520,
        "description": "The gold standard compact powerhouse. AMD Ryzen 9 8945HS with Ryzen AI, NVIDIA GeForce RTX 4070 8GB, 32GB LPDDR5X, 1TB SSD, and ROG Nebula OLED 120Hz screen.",
        "specs": {
            "ram_gb": 32,
            "storage_gb": 1024,
            "cpu": "AMD Ryzen 9 8945HS (8 cores / 16 threads, 16 TOPS NPU)",
            "gpu": "NVIDIA GeForce RTX 4070 8GB GDDR6 (90W TGP)",
            "display": "14-inch 3K (2880x1800) OLED 120Hz 0.2ms G-Sync",
            "battery_hours": 9.5,
            "weight_kg": 1.50,
            "ports": "1x USB4, 1x USB-C 3.2, 2x USB-A 3.2, HDMI 2.1, MicroSD"
        },
        "features": ["0.2ms Response 3K OLED", "RTX 4070 Dual-Fan Vapor Chamber", "Slash Lighting CNC Aluminum Lid", "6-Speaker Sound System with Dual Woofers"],
        "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 14,
        "delivery_days": 1,
        "tags": ["gaming", "video-editing", "rtx-4070", "high-end", "creator", "compact"]
    },
    {
        "title": "Lenovo ThinkPad X1 Carbon Gen 12",
        "brand": "Lenovo",
        "category": "Laptops & Computing",
        "subcategory": "Enterprise Ultrabook",
        "price": 1399.00,
        "original_price": 1649.00,
        "rating": 4.8,
        "review_count": 412,
        "description": "Legendary durability and typing experience. Carbon fiber reinforced chassis, Intel Core Ultra 7 155U, 32GB RAM, 1TB SSD, and military-grade MIL-SPEC testing.",
        "specs": {
            "ram_gb": 32,
            "storage_gb": 1024,
            "cpu": "Intel Core Ultra 7 155U (12 cores)",
            "gpu": "Intel Graphics with Intel AI Boost",
            "display": "14-inch 2.8K OLED Anti-Glare 400 nits",
            "battery_hours": 14.5,
            "weight_kg": 1.09,
            "ports": "2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.1, Nano SIM"
        },
        "features": ["Ultralight 1.09kg Carbon Fiber Build", "ThinkPad TrackPoint & Ergonomic Keyboard", "Computer Vision Presence Sensing", "dTPM 2.0 Security Chip"],
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 30,
        "delivery_days": 2,
        "tags": ["business", "developer", "lightweight", "thinkpad", "premium"]
    },
    {
        "title": "Acer Aspire 5 Slim Budget Edition",
        "brand": "Acer",
        "category": "Laptops & Computing",
        "subcategory": "Budget Laptop",
        "price": 449.99,
        "original_price": 549.99,
        "rating": 4.3,
        "review_count": 680,
        "description": "Great everyday entry-level laptop with AMD Ryzen 5 7520U, 16GB LPDDR5 RAM, and 512GB SSD. Reliable everyday browser, student office apps, and 1080p video streaming.",
        "specs": {
            "ram_gb": 16,
            "storage_gb": 512,
            "cpu": "AMD Ryzen 5 7520U (4 cores / 8 threads)",
            "gpu": "AMD Radeon 610M",
            "display": "15.6-inch FHD (1920x1080) IPS Slim Bezel",
            "battery_hours": 9.0,
            "weight_kg": 1.78,
            "ports": "1x USB-C, 2x USB-A, 1x HDMI, Ethernet RJ-45"
        },
        "features": ["Sub-$500 value champion", "Full Size Keyboard with Numpad", "Wi-Fi 6 Support", "Acer PurifiedVoice Noise Cancellation"],
        "image_url": "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 65,
        "delivery_days": 1,
        "tags": ["budget", "entry-level", "student", "sub-500", "daily-use"]
    },
    {
        "title": "Framework Laptop 13 (Modular & Repairable)",
        "brand": "Framework",
        "category": "Laptops & Computing",
        "subcategory": "Modular Ultrabook",
        "price": 999.00,
        "original_price": 1099.00,
        "rating": 4.9,
        "review_count": 280,
        "description": "The world's most repairable and upgradeable laptop. Intel Core Ultra 5, 16GB DDR5 (socketed), 512GB M.2 2280 SSD, customizable modular expansion cards.",
        "specs": {
            "ram_gb": 16,
            "storage_gb": 512,
            "cpu": "Intel Core Ultra 5 125H",
            "gpu": "Intel Arc Graphics",
            "display": "13.5-inch 2.8K (2880x1920) 120Hz 3:2 Aspect Ratio",
            "battery_hours": 11.0,
            "weight_kg": 1.30,
            "ports": "4x Modular Expansion Card Slots (USB-C, USB-A, HDMI, MicroSD)"
        },
        "features": ["10/10 iFixit Repairability Score", "Modular Swappable Ports", "100% Recycled Aluminum Enclosure", "Hardware Privacy Switches"],
        "image_url": "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 18,
        "delivery_days": 3,
        "tags": ["modular", "repairable", "sustainable", "developer", "customizable"]
    },

    # ==================== AUDIO & HEADPHONES (20 Items) ====================
    {
        "title": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        "brand": "Sony",
        "category": "Audio & Headphones",
        "subcategory": "Over-Ear ANC",
        "price": 348.00,
        "original_price": 399.99,
        "rating": 4.8,
        "review_count": 2340,
        "description": "Industry-leading noise canceling with two processors and 8 microphones. Crystal clear hands-free calling with 4 beamforming microphones and precise voice pickup.",
        "specs": {
            "battery_hours": 30.0,
            "driver_size_mm": 30,
            "weight_g": 250,
            "connectivity": "Bluetooth 5.2, LDAC, Multipoint Connection, 3.5mm Aux",
            "anc_modes": "Auto NC Optimizer with 8 microphones",
            "charging": "USB-C Quick Charge (3 min = 3 hours)"
        },
        "features": ["Auto NC Optimizer", "LDAC Hi-Res Wireless Audio", "Speak-to-Chat Technology", "Multipoint 2-Device Pairing"],
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 55,
        "delivery_days": 1,
        "tags": ["anc", "noise-cancelling", "wireless", "hi-res", "travel", "flagship"]
    },
    {
        "title": "Bose QuietComfort Ultra Headphones",
        "brand": "Bose",
        "category": "Audio & Headphones",
        "subcategory": "Over-Ear ANC",
        "price": 379.00,
        "original_price": 429.00,
        "rating": 4.7,
        "review_count": 1890,
        "description": "Groundbreaking spatialized audio with Bose Immersive Audio. World-class active noise cancellation and CustomTune technology for sound personalized to your ear shape.",
        "specs": {
            "battery_hours": 24.0,
            "weight_g": 252,
            "connectivity": "Bluetooth 5.3, Snapdragon Sound, aptX Adaptive",
            "anc_modes": "Quiet Mode, Aware Mode, Immersion Mode",
            "charging": "USB-C"
        },
        "features": ["Bose Immersive Spatial Audio", "CustomTune Ear Calibration", "Unrivaled Comfort Protein Leather Pads", "Wind Block Microphones"],
        "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 38,
        "delivery_days": 1,
        "tags": ["anc", "spatial-audio", "comfort", "travel", "bose", "premium"]
    },
    {
        "title": "Sennheiser Momentum 4 Wireless",
        "brand": "Sennheiser",
        "category": "Audio & Headphones",
        "subcategory": "Audiophile Wireless",
        "price": 279.95,
        "original_price": 379.95,
        "rating": 4.8,
        "review_count": 940,
        "description": "Audiophile-grade 42mm transducer system delivering signature Sennheiser sound. Unmatched 60-hour battery life and adaptive hybrid noise cancellation.",
        "specs": {
            "battery_hours": 60.0,
            "driver_size_mm": 42,
            "weight_g": 293,
            "connectivity": "Bluetooth 5.2, aptX HD, AAC, SBC",
            "anc_modes": "Adaptive Hybrid ANC with Transparency Mode",
            "charging": "USB-C Fast Charging"
        },
        "features": ["Insane 60-Hour Battery Life", "42mm Audiophile Transducers", "Customizable EQ via Smart Control App", "Auto On/Off & Smart Pause"],
        "image_url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 29,
        "delivery_days": 2,
        "tags": ["audiophile", "60h-battery", "wireless", "anc", "sennheiser", "deal"]
    },
    {
        "title": "Audio-Technica ATH-M50xBT2 Studio Monitor",
        "brand": "Audio-Technica",
        "category": "Audio & Headphones",
        "subcategory": "Studio Wireless",
        "price": 199.00,
        "original_price": 219.00,
        "rating": 4.9,
        "review_count": 3120,
        "description": "The wireless iteration of the legendary M50x studio monitor. Critically acclaimed sonic performance with 45mm large-aperture drivers and pure professional tuning.",
        "specs": {
            "battery_hours": 50.0,
            "driver_size_mm": 45,
            "weight_g": 307,
            "connectivity": "Bluetooth 5.0, LDAC, AAC, 3.5mm Gold-plated Cable",
            "anc_modes": "Passive Isolation Design",
            "charging": "USB-C"
        },
        "features": ["AK4331 DAC & Internal Headphone Amp", "Low Latency Mode for Video Editing", "Dual Mics with Beamforming", "Flat Frequency Response"],
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 45,
        "delivery_days": 1,
        "tags": ["studio", "video-editing", "music-production", "accurate-sound", "ldac"]
    },
    {
        "title": "Sony WF-1000XM5 True Wireless Earbuds",
        "brand": "Sony",
        "category": "Audio & Headphones",
        "subcategory": "In-Ear ANC Earbuds",
        "price": 249.99,
        "original_price": 299.99,
        "rating": 4.6,
        "review_count": 1650,
        "description": "Dynamic Driver X for rich sound reproduction and deep bass. Dual feedback microphones and bone conduction sensors for studio-grade call clarity in wind.",
        "specs": {
            "battery_hours": 24.0,
            "weight_g": 5.9,
            "connectivity": "Bluetooth 5.3, LDAC, LC3, Qi Wireless Charging",
            "waterproof": "IPX4 Water Resistant",
            "charging": "Qi Wireless + USB-C"
        },
        "features": ["Dynamic Driver X System", "Bone Conduction Voice Sensors", "Ultra-compact Ergonomic Fit", "Qi Wireless Fast Charging"],
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 60,
        "delivery_days": 1,
        "tags": ["earbuds", "anc", "wireless", "compact", "ipx4", "travel"]
    },
    {
        "title": "Shure MV7X Podcast Microphone",
        "brand": "Shure",
        "category": "Audio & Headphones",
        "subcategory": "Microphone & Vocal",
        "price": 179.00,
        "original_price": 199.00,
        "rating": 4.9,
        "review_count": 1420,
        "description": "Broadcast-grade dynamic cardioid microphone inspired by the iconic SM7B. Voice Isolation Technology ensures focus strictly on your voice without room echoes.",
        "specs": {
            "transducer_type": "Dynamic (Cardioid)",
            "connectivity": "XLR Output (Pro Audio Interface Ready)",
            "frequency_response": "50 Hz to 16,000 Hz",
            "weight_g": 550,
            "mounting": "Integrated 5/8-inch Thread Mount"
        },
        "features": ["Voice Isolation Acoustic Chamber", "All-metal Rugged Construction", "SM7B Heritage Vocal Tone", "Rejection of Ambient Background Noise"],
        "image_url": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 33,
        "delivery_days": 2,
        "tags": ["microphone", "podcast", "creator", "streaming", "broadcast", "shure"]
    },

    # ==================== SMART HOME & WORKSPACE (20 Items) ====================
    {
        "title": "Logitech MX Master 3S Wireless Performance Mouse",
        "brand": "Logitech",
        "category": "Smart Home & Workspace",
        "subcategory": "Ergonomic Peripherals",
        "price": 99.99,
        "original_price": 109.99,
        "rating": 4.9,
        "review_count": 4890,
        "description": "Quiet Clicks tactile feedback with 8,000 DPI track-on-glass optical sensor. MagSpeed electromagnetic scrolling scrolls 1,000 lines per second in near silence.",
        "specs": {
            "dpi": "200 to 8000 DPI (50 DPI increments)",
            "battery_days": 70.0,
            "weight_g": 141,
            "connectivity": "Logi Bolt USB, Bluetooth Low Energy (3 devices)",
            "charging": "USB-C Quick Charge (1 min = 3 hours)"
        },
        "features": ["MagSpeed Electromagnetic Scroll", "8K DPI Any-Surface Tracking", "Quiet Click Technology (90% reduction)", "Logi Options+ Custom Action Shortcuts"],
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 90,
        "delivery_days": 1,
        "tags": ["ergonomic", "mouse", "creator", "productivity", "quiet", "best-seller"]
    },
    {
        "title": "Keychron Q1 Pro Wireless Custom Mechanical Keyboard",
        "brand": "Keychron",
        "category": "Smart Home & Workspace",
        "subcategory": "Ergonomic Peripherals",
        "price": 199.00,
        "original_price": 219.00,
        "rating": 4.8,
        "review_count": 810,
        "description": "Full CNC machined 6063 aluminum body, QMK/VIA programmable, double-gasket design, hot-swappable K Pro Banana tactile switches, and Bluetooth 5.1.",
        "specs": {
            "layout": "75% Exploded Layout (81 Keys + Rotary Encoder Knob)",
            "connectivity": "Bluetooth 5.1 & Type-C Wired (1000Hz polling)",
            "switches": "K Pro Banana Tactile (Hot-swappable)",
            "weight_kg": 1.73,
            "battery_hours": 300.0
        },
        "features": ["Full CNC Aluminum Body", "Double-Gasket Acoustic Mount", "Custom Programmable Rotary Dial Knob", "Mac & Windows Keycap Sets Included"],
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 25,
        "delivery_days": 2,
        "tags": ["keyboard", "mechanical", "custom", "ergonomic", "aluminum", "developer"]
    },
    {
        "title": "BenQ ScreenBar Pro Monitor Light Bar",
        "brand": "BenQ",
        "category": "Smart Home & Workspace",
        "subcategory": "Workspace Lighting",
        "price": 139.00,
        "original_price": 149.00,
        "rating": 4.8,
        "review_count": 1240,
        "description": "Patented asymmetrical optical design that illuminates your desk with zero screen glare. Ultrasonic presence sensor automatically turns light on as you sit down.",
        "specs": {
            "illuminance": "1000 Lux @ 45cm",
            "color_temperature": "2700K to 6500K (8 steps)",
            "cri_rating": "Ra > 95 High Color Fidelity",
            "power": "USB-C Powered (5V / 1.7A)",
            "sensors": "Ultrasonic Presence Detection & Auto Dimming Light Sensor"
        },
        "features": ["Zero Screen Glare Optics", "Auto-Motion Presence Sensor", "Ra>95 Natural Color Rendering", "Universal Clamp for Curved/Flat Screens"],
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 40,
        "delivery_days": 1,
        "tags": ["lighting", "desk", "eyecare", "workspace", "productivity"]
    },
    {
        "title": "CalDigit TS4 Thunderbolt 4 Dock (18 Ports)",
        "brand": "CalDigit",
        "category": "Smart Home & Workspace",
        "subcategory": "Connectivity & Docks",
        "price": 399.95,
        "original_price": 449.95,
        "rating": 4.9,
        "review_count": 990,
        "description": "The ultimate single-cable workstation expansion. 18 ports including 98W Power Delivery to charge your laptop, 2.5GbE Ethernet, UHS-II SD/MicroSD, and dual 6K display support.",
        "specs": {
            "total_ports": 18,
            "power_delivery": "98W Host Laptop Charging",
            "networking": "2.5 Gigabit Ethernet RJ-45",
            "display_support": "Single 8K @ 60Hz or Dual 6K @ 60Hz",
            "card_readers": "SD 4.0 (UHS-II) & MicroSD 4.0"
        },
        "features": ["18 Comprehensive Ports", "98W High-Wattage Laptop Power Delivery", "2.5x Faster Ethernet Networking", "Independent 7.5W Front Fast USB Charging"],
        "image_url": "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 20,
        "delivery_days": 1,
        "tags": ["thunderbolt-4", "dock", "workstation", "creator", "dual-monitor", "premium"]
    },
    {
        "title": "Dell UltraSharp 32-inch 4K Video Conferencing Monitor (U3223QZ)",
        "brand": "Dell",
        "category": "Smart Home & Workspace",
        "subcategory": "Monitors & Displays",
        "price": 899.99,
        "original_price": 1099.99,
        "rating": 4.7,
        "review_count": 420,
        "description": "Brilliant 4K IPS Black monitor with 2000:1 contrast ratio. Built-in Sony STARVIS 4K HDR webcam, echo-canceling dual microphones, and 90W USB-C hub connectivity.",
        "specs": {
            "panel_type": "31.5-inch 4K UHD (3840x2160) IPS Black Technology",
            "contrast_ratio": "2000:1 Deep Blacks",
            "color_gamut": "98% DCI-P3, 100% sRGB, DisplayHDR 400",
            "webcam": "Built-in 4K Sony STARVIS CMOS Sensor with Auto-Framing",
            "connectivity": "USB-C Hub (90W PD), RJ-45 Ethernet, DP 1.4, HDMI 2.0"
        },
        "features": ["IPS Black 2000:1 Contrast", "Built-in 4K HDR Sony Webcam", "90W Single Cable USB-C Hub", "KVM Switch & Picture-by-Picture"],
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_quantity": 12,
        "delivery_days": 2,
        "tags": ["monitor", "4k", "ips-black", "webcam", "creator", "video-conferencing"]
    }
]

# Function to generate additional items to reach full depth if needed
ADDITIONAL_ITEMS_CONFIG = [
    ("Laptops & Computing", "Gaming Laptop", "MSI Katana 15 Gaming Laptop", "MSI", 679.99, 829.99, 4.4, 310, {"ram_gb": 16, "storage_gb": 512, "cpu": "Intel i7-13620H", "gpu": "RTX 4050 6GB"}, ["budget", "gaming", "video-editing", "sub-700"]),
    ("Laptops & Computing", "Budget Student", "ASUS Vivobook Go 15 OLED", "ASUS", 549.99, 649.99, 4.5, 410, {"ram_gb": 16, "storage_gb": 512, "cpu": "Ryzen 5 7520U", "gpu": "Radeon 610M"}, ["budget", "oled", "lightweight", "sub-600"]),
    ("Laptops & Computing", "Creator Laptop", "HP Victus 15 Creator Edition", "HP", 629.99, 799.99, 4.5, 290, {"ram_gb": 16, "storage_gb": 512, "cpu": "Intel i5-13420H", "gpu": "RTX 3050 6GB"}, ["budget", "video-editing", "sub-700", "rtx"]),
    ("Laptops & Computing", "Budget Chromebook", "Acer Chromebook Plus 515", "Acer", 379.00, 429.00, 4.4, 520, {"ram_gb": 8, "storage_gb": 256, "cpu": "Intel Core i3-1215U", "gpu": "Intel UHD"}, ["budget", "chromebook", "cloud", "sub-400"]),
    ("Laptops & Computing", "Mobile Workstation", "Dell Inspiron 16 Plus", "Dell", 699.00, 899.00, 4.6, 210, {"ram_gb": 16, "storage_gb": 1024, "cpu": "Intel Core i7-13700H", "gpu": "Intel Iris Xe"}, ["budget", "video-editing", "1tb-storage", "sub-700"]),
    ("Laptops & Computing", "Touch Ultrabook", "Microsoft Surface Laptop 6", "Microsoft", 1199.00, 1299.00, 4.7, 340, {"ram_gb": 16, "storage_gb": 512, "cpu": "Intel Core Ultra 7", "gpu": "Intel Arc"}, ["touchscreen", "ultrabook", "surface", "premium"]),
    ("Laptops & Computing", "Linux Developer", "System76 Lemur Pro 14", "System76", 1149.00, 1249.00, 4.8, 190, {"ram_gb": 32, "storage_gb": 1024, "cpu": "Intel Core Ultra 5", "os": "Pop!_OS Linux"}, ["linux", "developer", "open-source", "lightweight"]),
    ("Audio & Headphones", "Budget Studio", "Sennheiser HD 280 PRO", "Sennheiser", 99.95, 119.95, 4.7, 3400, {"driver_size_mm": 40, "impedance_ohm": 64}, ["studio", "mixing", "budget", "noise-isolation"]),
    ("Audio & Headphones", "ANC Earbuds", "Anker Soundcore Space One Pro", "Anker", 149.99, 179.99, 4.6, 1200, {"battery_hours": 60, "driver_size_mm": 40}, ["budget-anc", "travel", "60h-battery"]),
    ("Audio & Headphones", "Wireless Earbuds", "Apple AirPods Pro (2nd Gen, USB-C)", "Apple", 189.99, 249.00, 4.8, 8900, {"battery_hours": 30, "chip": "Apple H2"}, ["apple", "anc", "spatial-audio", "usb-c"]),
    ("Audio & Headphones", "USB Podcast Mic", "Rode NT-USB Mini Studio Mic", "Rode", 99.00, 119.00, 4.7, 1800, {"connectivity": "USB-C Plug & Play"}, ["podcast", "usb-mic", "streaming", "compact"]),
    ("Audio & Headphones", "Studio Monitors", "PreSonus Eris 3.5 BT Studio Monitors (Pair)", "PreSonus", 129.99, 149.99, 4.7, 2600, {"driver_size_in": 3.5, "power_watts": 50}, ["speakers", "studio-monitors", "bluetooth", "video-editing"]),
    ("Audio & Headphones", "Audiophile Open-Back", "Beyerdynamic DT 990 PRO 250 Ohm", "Beyerdynamic", 159.00, 179.00, 4.8, 4800, {"driver_type": "Open Diffuse-field", "impedance_ohm": 250}, ["open-back", "studio", "mastering", "audiophile"]),
    ("Audio & Headphones", "Smart ANC Headset", "Jabra Evolve2 65 Flex", "Jabra", 249.00, 289.00, 4.6, 620, {"microphone": "Foldable Hideaway Boom Arm", "battery_hours": 32}, ["office", "teams-certified", "meetings", "calls"]),
    ("Smart Home & Workspace", "Ergonomic Desk", "Secretlab MAGNUS Pro Metal Desk", "Secretlab", 799.00, 899.00, 4.9, 1400, {"cable_management": "Magnetic Stealth Channel"}, ["standing-desk", "workspace", "gaming", "cable-management"]),
    ("Smart Home & Workspace", "Ergonomic Chair", "Autonomous ErgoChair Pro", "Autonomous", 499.00, 599.00, 4.6, 2100, {"weight_capacity_lbs": 300}, ["chair", "ergonomic", "mesh", "posture"]),
    ("Smart Home & Workspace", "Smart Lighting", "Philips Hue Smart LED Gradient Lightstrip", "Philips Hue", 179.99, 199.99, 4.7, 950, {"connectivity": "Zigbee / Matter / HomeKit"}, ["smart-home", "lighting", "ambient", "rgb"]),
    ("Smart Home & Workspace", "Streaming Deck", "Elgato Stream Deck MK.2 (15 LCD Keys)", "Elgato", 149.99, 169.99, 4.9, 5200, {"keys": 15, "customizable": True}, ["streaming", "shortcuts", "productivity", "macro"]),
    ("Smart Home & Workspace", "MagSafe Stand", "Anker 3-in-1 Cube with 15W MagSafe Fast Charge", "Anker", 129.99, 149.99, 4.8, 1750, {"output_watts": 15, "form_factor": "Foldable Cube"}, ["charging", "magsafe", "desk-accessory", "travel"]),
    ("Smart Home & Workspace", "4K Curved Monitor", "Samsung 34-inch ViewFinity S65TC Curved UltraWide", "Samsung", 499.99, 699.99, 4.6, 880, {"resolution": "UWQHD (3440x1440)", "curvature": "1000R"}, ["ultrawide", "curved", "monitor", "productivity"])

]

def seed_database(db: Session):
    # Check if products already exist
    existing_count = db.query(Product).count()
    if existing_count > 0:
        print(f"[Seed] Products already exist in database ({existing_count} items).")
        return

    # Seed core catalog
    products_to_add = []
    for item in MOCK_PRODUCTS:
        p = Product(
            title=item["title"],
            brand=item["brand"],
            category=item["category"],
            subcategory=item.get("subcategory"),
            price=item["price"],
            original_price=item.get("original_price"),
            rating=item.get("rating", 4.5),
            review_count=item.get("review_count", 100),
            description=item["description"],
            specs=item.get("specs", {}),
            features=item.get("features", []),
            image_url=item.get("image_url"),
            in_stock=item.get("in_stock", True),
            stock_quantity=item.get("stock_quantity", 20),
            delivery_days=item.get("delivery_days", 2),
            tags=item.get("tags", [])
        )
        products_to_add.append(p)

    # Seed additional catalog entries
    for cat, subcat, title, brand, price, orig_price, rating, reviews, specs, tags in ADDITIONAL_ITEMS_CONFIG:
        p = Product(
            title=title,
            brand=brand,
            category=cat,
            subcategory=subcat,
            price=price,
            original_price=orig_price,
            rating=rating,
            review_count=reviews,
            description=f"Engineered by {brand} for high reliability, precision, and peak performance. Rated {rating}/5 stars with {reviews} verified customer reviews.",
            specs=specs,
            features=[f"{brand} signature build quality", "Optimized power efficiency", "Backed by manufacturer 2-year warranty"],
            image_url="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80",
            in_stock=True,
            stock_quantity=25,
            delivery_days=2,
            tags=tags
        )
        products_to_add.append(p)

    db.add_all(products_to_add)
    db.commit()
    print(f"[Seed] Successfully seeded {len(products_to_add)} products into the catalog.")

    # Seed Historical AI Growth Analytics (24 months)
    seed_analytics_history(db)

def seed_analytics_history(db: Session):
    existing_analytics = db.query(AnalyticsSnapshot).count()
    if existing_analytics > 0:
        return

    snapshots = []
    # 24 monthly periods starting from Jan 2024 through Dec 2025
    months = [
        ("2024-01", 1200, 50, 180, 970, 9.4, 450.0, 4),
        ("2024-02", 1450, 85, 230, 1135, 8.8, 890.0, 7),
        ("2024-03", 1820, 140, 310, 1370, 8.2, 1450.0, 12),
        ("2024-04", 2300, 210, 420, 1670, 7.5, 2300.0, 15),
        ("2024-05", 2950, 320, 580, 2050, 6.9, 3600.0, 21),
        ("2024-06", 3600, 490, 780, 2330, 6.2, 5400.0, 28),
        ("2024-07", 4400, 710, 1020, 2670, 5.5, 8100.0, 36),
        ("2024-08", 5300, 990, 1310, 3000, 4.9, 11500.0, 45),
        ("2024-09", 6400, 1350, 1680, 3370, 4.3, 16200.0, 58),
        ("2024-10", 7800, 1850, 2150, 3800, 3.8, 22400.0, 72),
        ("2024-11", 9600, 2550, 2750, 4300, 3.3, 31200.0, 94),
        ("2024-12", 11800, 3450, 3500, 4850, 2.9, 44100.0, 120),
        ("2025-01", 13200, 4200, 4100, 4900, 2.6, 56000.0, 138),
        ("2025-02", 14600, 5100, 4650, 4850, 2.3, 69500.0, 160),
        ("2025-03", 16100, 6100, 5200, 4800, 2.1, 84300.0, 182),
        ("2025-04", 17800, 7200, 5900, 4700, 1.9, 102000.0, 205),
        ("2025-05", 19500, 8400, 6600, 4500, 1.8, 121000.0, 230),
        ("2025-06", 21400, 9700, 7400, 4300, 1.6, 143000.0, 260),
        ("2025-07", 23500, 11200, 8200, 4100, 1.5, 168000.0, 292),
        ("2025-08", 25800, 12800, 9100, 3900, 1.4, 196000.0, 325),
        ("2025-09", 28300, 14600, 10100, 3600, 1.35, 227000.0, 360),
        ("2025-10", 31000, 16600, 11200, 3200, 1.3, 262000.0, 402),
        ("2025-11", 34200, 18900, 12400, 2900, 1.25, 304000.0, 450),
        ("2025-12", 38000, 21800, 13800, 2400, 1.2, 355000.0, 510)
    ]

    for date_str, tot, agentic, assisted, human, avg_t, savings, guard_hits in months:
        # Calculate category shares
        cat_metrics = {
            "Laptops & Computing": {
                "agentic_share_pct": min(72.5, 15.0 + (tot / 38000.0) * 55.0),
                "total_volume": int(tot * 0.45)
            },
            "Audio & Headphones": {
                "agentic_share_pct": min(64.0, 10.0 + (tot / 38000.0) * 50.0),
                "total_volume": int(tot * 0.30)
            },
            "Smart Home & Workspace": {
                "agentic_share_pct": min(58.0, 8.0 + (tot / 38000.0) * 48.0),
                "total_volume": int(tot * 0.25)
            }
        }

        snap = AnalyticsSnapshot(
            metric_date=date_str,
            total_transactions=tot,
            agentic_transactions=agentic,
            ai_assisted_transactions=assisted,
            human_only_transactions=human,
            avg_decision_time_sec=avg_t,
            budget_savings_usd=savings,
            guardrail_interventions=guard_hits,
            category_metrics=cat_metrics
        )
        snapshots.append(snap)

    db.add_all(snapshots)
    
    # Also add initial system audit log
    init_audit = AuditLog(
        session_id=None,
        actor="SYSTEM",
        action="SYSTEM_INITIALIZED",
        is_irreversible=False,
        status="SUCCESS",
        details="TrendCart Agentic Commerce Platform database initialized with seed catalog & historical AI growth telemetry.",
        payload={"seeded_products": len(MOCK_PRODUCTS) + len(ADDITIONAL_ITEMS_CONFIG), "analytics_snapshots": len(snapshots)}
    )
    db.add(init_audit)
    db.commit()
    print(f"[Seed] Successfully seeded {len(snapshots)} months of historical AI growth analytics.")

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
