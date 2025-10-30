-- Create enum for the 30 training zones
CREATE TYPE zone_key AS ENUM (
  'brust_total', 'ruecken_oben', 'ruecken_unten', 'latissimus',
  'delts_vorne', 'delts_seite', 'delts_hinten', 'trapez',
  'bizeps', 'trizeps', 'unterarme',
  'bauch_gerade', 'bauch_schraeg', 'core_tief', 'hueftbeuger',
  'gluteus', 'quadrizeps', 'hamstrings', 'waden', 'addukt_abdukt',
  'brust_oben', 'brust_unten', 'teres_major', 'rhomboiden',
  'rotatorenmanschette', 'trapez_unten', 'serratus',
  'quadratus_lumborum', 'tibialis_anterior', 'hueft_aussenrotatoren'
);

-- Create zones table
CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key zone_key UNIQUE NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert all 30 zones
INSERT INTO zones (key, name) VALUES
  ('brust_total', 'Brust (Pectoralis) – gesamt'),
  ('ruecken_oben', 'Oberer Rücken'),
  ('ruecken_unten', 'Unterer Rücken (LWS/Erektoren)'),
  ('latissimus', 'Latissimus (breiter Rückenmuskel)'),
  ('delts_vorne', 'Schultern – vorderer Deltamuskel'),
  ('delts_seite', 'Schultern – seitlicher Deltamuskel'),
  ('delts_hinten', 'Schultern – hinterer Deltamuskel'),
  ('trapez', 'Nacken / Trapez'),
  ('bizeps', 'Bizeps'),
  ('trizeps', 'Trizeps'),
  ('unterarme', 'Unterarme / Griffkraft'),
  ('bauch_gerade', 'Bauch – gerade (Rectus abdominis)'),
  ('bauch_schraeg', 'Bauch – schräge (Obliques)'),
  ('core_tief', 'Core / tiefe Stabilisatoren (Transversus, Beckenboden)'),
  ('hueftbeuger', 'Hüftbeuger (Iliopsoas)'),
  ('gluteus', 'Gesäß / Gluteus'),
  ('quadrizeps', 'Quadrizeps / Beinstrecker'),
  ('hamstrings', 'Beinbeuger / Hamstrings'),
  ('waden', 'Waden (Gastrocnemius, Soleus)'),
  ('addukt_abdukt', 'Adduktoren / Abduktoren'),
  ('brust_oben', 'Obere Brust (clavicularer Anteil)'),
  ('brust_unten', 'Untere Brust (sternaler Anteil)'),
  ('teres_major', 'Teres major (seitlicher Rücken)'),
  ('rhomboiden', 'Rhomboiden (zwischen den Schulterblättern)'),
  ('rotatorenmanschette', 'Rotatorenmanschette (SITS)'),
  ('trapez_unten', 'Unterer Trapez (Scapula-Depression/Upward Rotation)'),
  ('serratus', 'Serratus anterior (Sägezahnmuskel)'),
  ('quadratus_lumborum', 'Quadratus lumborum (seitliche Rumpfstabilität)'),
  ('tibialis_anterior', 'Tibialis anterior (Schienbeinmuskel)'),
  ('hueft_aussenrotatoren', 'Tiefe Hüftaußenrotatoren (Piriformis, Gemelli, Obturatoren)');

-- Add zone_id to exercises table (map exercises to zones)
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS zone_id UUID REFERENCES zones(id);

-- Add zone_id to set_entries for analytics
ALTER TABLE set_entries ADD COLUMN IF NOT EXISTS zone_id UUID REFERENCES zones(id);

-- Create zone targets table
CREATE TABLE IF NOT EXISTS zone_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID UNIQUE REFERENCES zones(id) ON DELETE CASCADE,
  weekly_sets_low INTEGER NOT NULL DEFAULT 8,
  weekly_sets_high INTEGER NOT NULL DEFAULT 16,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_targets ENABLE ROW LEVEL SECURITY;

-- Public read access to zones (everyone needs to see them)
CREATE POLICY "Zones are viewable by everyone"
  ON zones FOR SELECT
  USING (true);

-- Zone targets viewable by authenticated users
CREATE POLICY "Zone targets viewable by authenticated users"
  ON zone_targets FOR SELECT
  TO authenticated
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_exercises_zone_id ON exercises(zone_id);
CREATE INDEX IF NOT EXISTS idx_set_entries_zone_id ON set_entries(zone_id);