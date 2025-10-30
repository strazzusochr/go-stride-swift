-- Make exercise_id nullable in set_entries (since we now use zone_id primarily)
ALTER TABLE set_entries ALTER COLUMN exercise_id DROP NOT NULL;

-- Create index for better query performance on zone_id
CREATE INDEX IF NOT EXISTS idx_set_entries_zone_id_session ON set_entries(zone_id, session_id);