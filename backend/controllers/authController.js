import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        message: 'Registration successful. Your account is pending admin approval.'
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

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
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
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
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
      profilePicture: user.profile_picture
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
