-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_picture TEXT DEFAULT '',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT DEFAULT '',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  primary_color VARCHAR(50) DEFAULT '#0001',
  secondary_color VARCHAR(50) DEFAULT '#1111',
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  logo_url TEXT DEFAULT '',
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create players table (for team players)
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  player_id VARCHAR(100) NOT NULL,
  photo TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_events_creator ON events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_teams_creator ON teams(creator_id);
CREATE INDEX IF NOT EXISTS idx_teams_tag ON teams(tag);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies (Service role bypasses RLS by default)
-- Users can read all approved users
CREATE POLICY "Users can read approved users" ON users
  FOR SELECT USING (status = 'approved');

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can read all events
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT USING (true);

-- Users can create their own events
CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid()::text = creator_id::text);

-- Users can update their own events
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid()::text = creator_id::text);

-- Users can delete their own events
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid()::text = creator_id::text);

-- Similar policies for teams
CREATE POLICY "Anyone can read teams" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Users can create teams" ON teams
  FOR INSERT WITH CHECK (auth.uid()::text = creator_id::text);

CREATE POLICY "Users can update own teams" ON teams
  FOR UPDATE USING (auth.uid()::text = creator_id::text);

CREATE POLICY "Users can delete own teams" ON teams
  FOR DELETE USING (auth.uid()::text = creator_id::text);

-- Policies for players (tied to team ownership)
CREATE POLICY "Anyone can read players" ON players
  FOR SELECT USING (true);

CREATE POLICY "Team owners can manage players" ON players
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = players.team_id
      AND teams.creator_id::text = auth.uid()::text
    )
  );
