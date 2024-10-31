-- Add new columns to predictions table
ALTER TABLE predictions
ADD COLUMN IF NOT EXISTS league_id INTEGER,
ADD COLUMN IF NOT EXISTS analysis TEXT,
ADD COLUMN IF NOT EXISTS home_stats JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS away_stats JSONB DEFAULT '{}'::jsonb;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_predictions_event_date ON predictions(event_date);
CREATE INDEX IF NOT EXISTS idx_predictions_league_id ON predictions(league_id);

-- Create a function to clean up old predictions
CREATE OR REPLACE FUNCTION cleanup_old_predictions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM predictions
  WHERE event_date < NOW() - INTERVAL '30 days'
  AND status != 'pending';
END;
$$;