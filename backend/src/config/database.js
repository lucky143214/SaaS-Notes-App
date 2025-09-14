import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB connection
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes_saas_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Tenant Schema
const tenantSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  }
}, {
  timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  }
}, {
  timestamps: true
});

// Note Schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  content: {
    type: String,
    default: ''
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Models
export const Tenant = mongoose.model('Tenant', tenantSchema);
export const User = mongoose.model('User', userSchema);
export const Note = mongoose.model('Note', noteSchema);

// Initialize database with sample data
export const initDatabase = async () => {
  try {
    // Check if tenants already exist
    const tenantCount = await Tenant.countDocuments();
    
    if (tenantCount === 0) {
      // Create default tenants
      const acmeTenant = await Tenant.create({
        slug: 'acme',
        name: 'Acme Corp',
        plan: 'free'
      });

      const globexTenant = await Tenant.create({
        slug: 'globex',
        name: 'Globex Corp',
        plan: 'free'
      });

      // Create default users
      const password = bcrypt.hashSync('password', 10);
      
      await User.create([
        {
          email: 'admin@acme.test',
          password: password,
          role: 'admin',
          tenantId: acmeTenant._id
        },
        {
          email: 'user@acme.test',
          password: password,
          role: 'member',
          tenantId: acmeTenant._id
        },
        {
          email: 'admin@globex.test',
          password: password,
          role: 'admin',
          tenantId: globexTenant._id
        },
        {
          email: 'user@globex.test',
          password: password,
          role: 'member',
          tenantId: globexTenant._id
        }
      ]);

      console.log('Database initialized with sample data');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

export default mongoose;