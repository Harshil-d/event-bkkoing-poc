┌───────────────────────────┐
│ User │
├───────────────────────────┤
│ id (PK) UUID │
│ email (CITEXT, UNIQUE) │
│ password_hash (TEXT) │
│ full_name (TEXT) │
│ role (ENUM: ADMIN/USER) │
│ is_active (BOOLEAN) │
│ created_at (TIMESTAMPTZ) │
│ updated_at (TIMESTAMPTZ) │
└─────────────┬─────────────┘
│ 1
│
│ creates
│
▼ N
┌───────────────────────────┐
│ Event │
├───────────────────────────┤
│ id (PK) UUID │
│ title (TEXT) │
│ description (TEXT) │
│ event_date (TIMESTAMPTZ) │
│ total_seats (INT) │
│ seats_available (INT) │
│ created_by (FK → User.id) │
│ created_at (TIMESTAMPTZ) │
│ updated_at (TIMESTAMPTZ) │
│ version (INT) │
└─────────────┬─────────────┘
│ 1
│
│ booked
│
▼ N
┌───────────────────────────┐
│ Booking │
├───────────────────────────┤
│ id (PK) UUID │
│ user_id (FK → User.id) │
│ event_id (FK → Event.id) │
│ seats_booked (INT) │
│ status (ENUM) │
│ created_at (TIMESTAMPTZ) │
└─────────────┬─────────────┘
│
│ triggers notification
▼
┌───────────────────────────┐
│ Notification │
├───────────────────────────┤
│ id (PK) UUID │
│ user_id (FK → User.id) │
│ message (TEXT) │
│ is_read (BOOLEAN) │
│ link (TEXT, optional) │
│ created_at (TIMESTAMPTZ) │
└───────────────────────────┘
