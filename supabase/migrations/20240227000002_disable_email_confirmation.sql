-- Disable email confirmation requirement
ALTER TABLE auth.users ALTER COLUMN confirmed_at SET DEFAULT NOW();
ALTER TABLE auth.users ALTER COLUMN email_confirmed_at SET DEFAULT NOW();

-- Update existing users
UPDATE auth.users 
SET confirmed_at = NOW(), 
    email_confirmed_at = NOW() 
WHERE confirmed_at IS NULL 
   OR email_confirmed_at IS NULL;