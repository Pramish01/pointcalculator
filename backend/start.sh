#!/bin/bash

# Load environment variables and start the server
export PORT=5000
export SUPABASE_URL=https://yqanykbcxjcszdubrgfq.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=sb_secret_-5wDrTA2WQmL5WHG-9QPsQ_6A6cHp0d
export JWT_SECRET=pointcalculator_jwt_secret_change_in_production_2024

echo "Starting backend server on port 5000..."
npm run dev
