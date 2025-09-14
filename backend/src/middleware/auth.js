import jwt from 'jsonwebtoken';
import { User, Tenant } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('tenantId');
    
    if (!user) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenantId._id,
      tenant_slug: user.tenantId.slug,
      tenant_plan: user.tenantId.plan
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};