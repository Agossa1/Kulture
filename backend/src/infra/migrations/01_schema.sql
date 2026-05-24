
-- =====================================================
-- EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "postgis";


-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE user_role AS ENUM (
    'user',
    'artist',
    'organizer',
    'delivery_person',
    'admin',
    'super_admin'
);

CREATE TYPE account_status AS ENUM (
    'pending',
    'active',
    'suspended',
    'banned'
);

CREATE TYPE verification_status AS ENUM (
    'unverified',
    'pending',
    'verified',
    'rejected'
);

CREATE TYPE event_status AS ENUM (
    'draft',
    'published',
    'cancelled',
    'completed'
);

CREATE TYPE ticket_status AS ENUM (
    'available',
    'reserved',
    'sold',
    'cancelled',
    'used'
);

CREATE TYPE campaign_status AS ENUM (
    'draft',
    'active',
    'successful',
    'failed',
    'cancelled'
);

CREATE TYPE artwork_type AS ENUM (
    'music',
    'video',
    'photo',
    'ebook',
    'visual_art',
    'other'
);

CREATE TYPE artwork_status AS ENUM (
    'draft',
    'published',
    'unlisted',
    'removed'
);

CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'delivered',
    'cancelled',
    'refunded'
);

CREATE TYPE payment_status AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);

CREATE TYPE payment_method AS ENUM (
    'mobile_money',
    'card',
    'bank_transfer',
    'cash'
);

CREATE TYPE notification_type AS ENUM (
    'system',
    'payment',
    'event',
    'delivery',
    'marketing'
);


-- =====================================================
-- GEO DOMAIN
-- =====================================================
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,       -- Recevra iso2 (ou un vrai nom si vous changez d'avis)
    code VARCHAR(10) NOT NULL UNIQUE,        -- Recevra iso3
    area_sqkm NUMERIC,                       -- NOUVEAU : Pour la superficie
    center_lat NUMERIC,                      -- NOUVEAU : Pour la latitude du centre
    center_long NUMERIC,                     -- NOUVEAU : Pour la longitude du centre
    geometry GEOMETRY(MULTIPOLYGON, 4326),   -- Pour la vraie forme géométrique (si dispo dans ben_admin0)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20),
    geometry GEOMETRY(MULTIPOLYGON, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20),
    area_sqkm NUMERIC,
    center_lat NUMERIC,
    center_long NUMERIC,
    geometry GEOMETRY(MULTIPOLYGON, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20),
    area_sqkm NUMERIC,
    population INTEGER,                     -- NOUVEAU : Pour stocker la population
    center_lat NUMERIC,
    center_long NUMERIC,
    geometry GEOMETRY(MULTIPOLYGON, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE neighborhoods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    geometry GEOMETRY(MULTIPOLYGON, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
    street VARCHAR(255),
    postal_code VARCHAR(20),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOMETRY(POINT, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- USERS DOMAIN
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(120) NOT NULL,
    last_name VARCHAR(120) NOT NULL,
    role: user_role DEFAULT 'users',
    created_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE media_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID UNIQUE NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
    storage_provider VARCHAR(50),
    public_url TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE media_images (
    media_id UUID PRIMARY KEY REFERENCES media_files(id) ON DELETE CASCADE,
    width INTEGER,
    height INTEGER
);

CREATE TABLE media_videos (
    media_id UUID PRIMARY KEY REFERENCES media_files(id) ON DELETE CASCADE,
    duration INTEGER,
    width INTEGER,
    height INTEGER
);

CREATE TABLE media_audio (
    media_id UUID PRIMARY KEY REFERENCES media_files(id) ON DELETE CASCADE,
    duration INTEGER,
    bitrate INTEGER
);

CREATE TABLE user_accounts (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE   role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL UNIQUE,
    permissions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user',
    language VARCHAR(10) DEFAULT 'fr',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_media (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    profile_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    cover_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL
);
CREATE TABLE user_status (
    user_id UUID PRIMARY KEY  REFERENCES users(id) ON DELETE CASCADE,
    status account_status DEFAULT 'pending',
    verification verification_status DEFAULT 'unverified',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    deleted_at TIMESTAMPTZ
);


CREATE TABLE user_activity (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    last_login_at TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ
);

CREATE TABLE user_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE  TABLE user_preferences (
    id UUID PRIMARY KEY  DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE  CASCADE ,
    user_activity_id UUID NOT NULL REFERENCES user_activity(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'fr',
    fcm_token TEXT,
    theme VARCHAR(20) DEFAULT 'light',
    notification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
    label VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- MEDIA DOMAIN
-- =====================================================

CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE media_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID UNIQUE NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
    storage_provider VARCHAR(50),
    public_url TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE media_images (
    media_id UUID PRIMARY KEY REFERENCES media_files(id) ON DELETE CASCADE,
    width INTEGER,
    height INTEGER
);

CREATE TABLE media_videos (
    media_id UUID PRIMARY KEY REFERENCES media_files(id) ON DELETE CASCADE,
    duration INTEGER,
    width INTEGER,
    height INTEGER
);

CREATE TABLE media_audio (
    media_id UUID PRIMARY KEY REFERENCES media_files(id) ON DELETE CASCADE,
    duration INTEGER,
    bitrate INTEGER
);


-- =====================================================
-- ARTISTS DOMAIN
-- =====================================================

CREATE TABLE artist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    website_url TEXT,
    cover_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    platform_share NUMERIC(4,2) DEFAULT 0.15,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE artist_socials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    platform_name VARCHAR(100) NOT NULL,
    profile_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(artist_id, platform_name)
);

CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE artist_genres (
    artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY(artist_id, genre_id)
);

CREATE TABLE artist_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
    media_role VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TAGS DOMAIN
-- =====================================================

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- VENUES DOMAIN
-- =====================================================

CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    capacity INTEGER,
    cover_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- EVENTS DOMAIN
-- =====================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    artist_id UUID REFERENCES artist_profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    status event_status DEFAULT 'draft',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    is_online BOOLEAN DEFAULT FALSE,
    stream_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE event_tags (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY(event_id, tag_id)
);

CREATE TABLE event_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
    is_cover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_type_details (
    ticket_type_id UUID PRIMARY KEY REFERENCES ticket_types(id) ON DELETE CASCADE,
    description TEXT,
    max_per_order INTEGER DEFAULT 10
);

CREATE TABLE ticket_type_pricing (
    ticket_type_id UUID PRIMARY KEY REFERENCES ticket_types(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'XOF'
);

CREATE TABLE ticket_type_inventory (
    ticket_type_id UUID PRIMARY KEY REFERENCES ticket_types(id) ON DELETE CASCADE,
    total_quantity INTEGER NOT NULL,
    status ticket_status DEFAULT 'available'
);

CREATE TABLE ticket_type_sales (
    ticket_type_id UUID PRIMARY KEY REFERENCES ticket_types(id) ON DELETE CASCADE,
    sale_starts TIMESTAMPTZ,
    sale_ends TIMESTAMPTZ
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_type_id UUID NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_owners (
    ticket_id UUID PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    purchased_at TIMESTAMPTZ
);

CREATE TABLE ticket_codes (
    ticket_id UUID PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    qr_code TEXT UNIQUE NOT NULL,
    serial_number VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE ticket_statuses (
    ticket_id UUID PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    status ticket_status DEFAULT 'available',
    used_at TIMESTAMPTZ
);

CREATE TABLE ticket_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    scanned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    scanned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_scan_locations (
    scan_id UUID PRIMARY KEY REFERENCES ticket_scans(id) ON DELETE CASCADE,
    location GEOMETRY(POINT, 4326)
);

-- =====================================================
-- CAMPAIGNS DOMAIN
-- =====================================================

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campaign_details (
    campaign_id UUID PRIMARY KEY REFERENCES campaigns(id) ON DELETE CASCADE,
    description TEXT,
    deadline TIMESTAMPTZ NOT NULL
);

CREATE TABLE campaign_finance (
    campaign_id UUID PRIMARY KEY REFERENCES campaigns(id) ON DELETE CASCADE,
    goal_amount NUMERIC(12,2) NOT NULL,
    currency CHAR(3) DEFAULT 'XOF',
    platform_fee NUMERIC(4,2) DEFAULT 0.03,
    current_amount NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE campaign_states (
    campaign_id UUID PRIMARY KEY REFERENCES campaigns(id) ON DELETE CASCADE,
    status campaign_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campaign_media (
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
    media_role VARCHAR(50),
    PRIMARY KEY (campaign_id, media_id)
);

CREATE TABLE campaign_tags (
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (campaign_id, tag_id)
);

CREATE TABLE campaign_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    min_amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campaign_reward_details (
    reward_id UUID PRIMARY KEY REFERENCES campaign_rewards(id) ON DELETE CASCADE,
    description TEXT,
    max_claims INTEGER
);

CREATE TABLE campaign_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE donation_metadata (
    donation_id UUID PRIMARY KEY REFERENCES campaign_donations(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES campaign_rewards(id) ON DELETE SET NULL,
    currency CHAR(3) DEFAULT 'XOF',
    is_anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    payment_method payment_method NOT NULL,
    payment_reference TEXT
);

CREATE TABLE campaign_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campaign_beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255)
);

-- =====================================================
-- ARTWORKS DOMAIN
-- =====================================================

CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type artwork_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE artwork_details (
    artwork_id UUID PRIMARY KEY REFERENCES artworks(id) ON DELETE CASCADE,
    description TEXT,
    status artwork_status DEFAULT 'draft',
    deleted_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE artwork_pricing (
    artwork_id UUID PRIMARY KEY REFERENCES artworks(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'XOF',
    platform_share NUMERIC(4,2) DEFAULT 0.15
);

CREATE TABLE artwork_inventory (
    artwork_id UUID PRIMARY KEY REFERENCES artworks(id) ON DELETE CASCADE,
    is_limited BOOLEAN DEFAULT FALSE,
    max_copies INTEGER
);

CREATE TABLE artwork_sources (
    artwork_id UUID PRIMARY KEY REFERENCES artworks(id) ON DELETE CASCADE,
    preview_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL,
    source_media_id UUID REFERENCES media_files(id) ON DELETE SET NULL
);

CREATE TABLE artwork_tags (
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (artwork_id, tag_id)
);

CREATE TABLE artwork_media (
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
    media_role VARCHAR(50),
    PRIMARY KEY (artwork_id, media_id)
);

CREATE TABLE artwork_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount_paid NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE artwork_purchase_metadata (
    purchase_id UUID PRIMARY KEY REFERENCES artwork_purchases(id) ON DELETE CASCADE,
    currency CHAR(3) DEFAULT 'XOF',
    platform_fee NUMERIC(10,2) NOT NULL,
    artist_payout NUMERIC(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_reference TEXT,
    download_token TEXT UNIQUE NOT NULL,
    downloaded_at TIMESTAMPTZ
);

-- =====================================================
-- ORDERS DOMAIN
-- =====================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_amounts (
    order_id UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
    subtotal NUMERIC(10,2) NOT NULL,
    service_fee NUMERIC(10,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL
);

CREATE TABLE order_states (
    order_id UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_type VARCHAR(100) NOT NULL,
    item_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_item_prices (
    order_item_id UUID PRIMARY KEY REFERENCES order_items(id) ON DELETE CASCADE,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_amounts (
    payment_id UUID PRIMARY KEY REFERENCES payments(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'XOF'
);

CREATE TABLE payment_providers (
    payment_id UUID PRIMARY KEY REFERENCES payments(id) ON DELETE CASCADE,
    provider VARCHAR(100),
    provider_reference TEXT,
    provider_response JSONB,
    paid_at TIMESTAMPTZ
);

-- =====================================================
-- DELIVERY DOMAIN
-- =====================================================

CREATE TABLE delivery_persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_location GEOMETRY(POINT, 4326),
    vehicle_type VARCHAR(100),
    vehicle_registration VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_person_id UUID REFERENCES delivery_persons(id) ON DELETE SET NULL,
    pickup_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    destination_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    estimated_delivery_time TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_person_id UUID NOT NULL REFERENCES delivery_persons(id) ON DELETE CASCADE,
    location GEOMETRY(POINT, 4326) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- REVIEWS DOMAIN
-- =====================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(100) NOT NULL,
    target_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- NOTIFICATIONS DOMAIN
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- ARTIST SOCIALS & MUSIC DISTRIBUTION DOMAIN
-- =====================================================

CREATE TABLE social_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    base_url TEXT
);

CREATE TABLE artist_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES social_platforms(id) ON DELETE CASCADE,
    username VARCHAR(120),
    profile_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(artist_id, platform_id)
);

CREATE TABLE music_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) UNIQUE NOT NULL,
    base_url TEXT
);

CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE album_details (
    album_id UUID PRIMARY KEY REFERENCES albums(id) ON DELETE CASCADE,
    description TEXT,
    release_date DATE
);

CREATE TABLE album_media (
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
    media_role VARCHAR(50),
    PRIMARY KEY (album_id, media_id)
);

CREATE TABLE album_platform_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES music_platforms(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(album_id, platform_id)
);

CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
    artist_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE track_details (
    track_id UUID PRIMARY KEY REFERENCES tracks(id) ON DELETE CASCADE,
    duration INTEGER
);

CREATE TABLE track_media (
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
    media_role VARCHAR(50),
    PRIMARY KEY (track_id, media_id)
);

CREATE TABLE track_platform_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES music_platforms(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(track_id, platform_id)
);
-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_artist_profiles_slug ON artist_profiles(slug);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_artworks_slug ON artworks(slug);

CREATE INDEX idx_event_schedules_starts_at ON event_schedules(starts_at);
CREATE INDEX idx_campaigns_deadline ON campaigns(deadline);

CREATE INDEX idx_addresses_location ON addresses USING GIST(location);
CREATE INDEX idx_delivery_positions_location ON delivery_positions USING GIST(location);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);

