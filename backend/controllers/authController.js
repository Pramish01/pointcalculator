import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
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

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          status: 'pending',
          email_verified: false,
          verification_token: verificationToken,
          verification_token_expires: tokenExpires.toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (user) {
      // In production, send verification email here
      // For now, return the verification link
      const verificationLink = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        emailVerified: user.email_verified,
        message: 'Registration successful. Please verify your email and wait for admin approval.',
        verificationLink: verificationLink // Remove this in production
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with this verification token
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Check if token has expired
    if (new Date(user.verification_token_expires) < new Date()) {
      return res.status(400).json({ message: 'Verification token has expired. Please request a new one.' });
    }

    // Verify the email
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expires: null
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    res.json({
      message: 'Email verified successfully! Your account is now pending admin approval.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email_verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_token: verificationToken,
        verification_token_expires: tokenExpires.toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // In production, send verification email here
    const verificationLink = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

    res.json({
      message: 'Verification email sent successfully',
      verificationLink: verificationLink // Remove this in production
    });
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
      // Check email verification
      if (!user.email_verified) {
        return res.status(403).json({
          message: 'Please verify your email address before logging in.',
          requiresEmailVerification: true
        });
      }

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
        emailVerified: user.email_verified,
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
      .select('id, name, email, profile_picture, email_verified')
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
      emailVerified: user.email_verified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
