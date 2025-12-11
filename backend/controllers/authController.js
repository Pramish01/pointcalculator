import jwt from 'jsonwebtoken';
import { supabase } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists in our custom users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with Supabase Auth (handles email verification)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: false, // User must verify email
      user_metadata: {
        name: name
      }
    });

    if (authError) {
      throw authError;
    }

    if (authData?.user) {
      // Create entry in our custom users table with admin approval status
      const { data: user, error: dbError } = await supabase
        .from('users')
        .insert([
          {
            auth_user_id: authData.user.id,
            name,
            email: email.toLowerCase(),
            status: 'pending', // Admin approval required
            is_admin: false
          }
        ])
        .select()
        .single();

      if (dbError) {
        // If custom table insert fails, delete the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw dbError;
      }

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        message: 'Registration successful! Please check your email to verify your account, then wait for admin approval.'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password
    });

    if (authError) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!authData.user.email_confirmed_at) {
      return res.status(403).json({
        message: 'Please verify your email address before logging in.',
        requiresEmailVerification: true
      });
    }

    // Get user from our custom users table
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single();

    if (dbError || !user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Check admin approval status
    if (user.status === 'pending') {
      return res.status(403).json({
        message: 'Your account is pending admin approval. Please wait for approval.'
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        message: 'Your account has been rejected. Please contact support.'
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profile_picture,
      isAdmin: user.is_admin,
      emailVerified: true,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user in our custom table
    const { data: user, error } = await supabase
      .from('users')
      .select('auth_user_id')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Resend verification email using Supabase Auth
    const { error: resendError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email.toLowerCase()
    });

    if (resendError) {
      throw resendError;
    }

    res.json({
      message: 'Verification email sent successfully. Please check your inbox.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, profile_picture')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profile_picture,
      emailVerified: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
