import jwt from 'jsonwebtoken';
import { supabase } from '../config/db.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, profile_picture, status, is_admin')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (user.status !== 'approved') {
        return res.status(403).json({
          message: 'Your account is not approved. Please wait for admin approval.'
        });
      }

      // Map to match controller expectations
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture,
        status: user.status,
        isAdmin: user.is_admin
      };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

export { protect, adminOnly };
