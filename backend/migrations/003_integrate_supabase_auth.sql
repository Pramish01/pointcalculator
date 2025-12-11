-- Migration: Integrate with Supabase Auth
-- This migration updates the users table to work with Supabase's built-in authentication

-- Add auth_user_id to link with Supabase Auth users
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remove custom email verification columns (Supabase Auth handles this)
ALTER TABLE users DROP COLUMN IF EXISTS email_verified;
ALTER TABLE users DROP COLUMN IF EXISTS verification_token;
ALTER TABLE users DROP COLUMN IF EXISTS verification_token_expires;

-- Drop the verification token index if it exists
DROP INDEX IF EXISTS idx_users_verification_token;

-- Update the users table structure:
-- - auth_user_id: Links to Supabase Auth user (handles email verification)
-- - status: 'pending', 'approved', 'rejected' (for admin approval)
-- - is_admin: Boolean flag for admin users

-- Create index on auth_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Add comment explaining the new structure
COMMENT ON COLUMN users.auth_user_id IS 'Reference to Supabase Auth user - handles email verification';
COMMENT ON COLUMN users.status IS 'Admin approval status: pending, approved, rejected';
COMMENT ON COLUMN users.is_admin IS 'Flag indicating if user has admin privileges';

-- Note: After running this migration:
-- 1. Enable email verification in Supabase Dashboard > Authentication > Settings
-- 2. Configure email templates in Supabase Dashboard
-- 3. Update your application code to use Supabase Auth for signup/login
