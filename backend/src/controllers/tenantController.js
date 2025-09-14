import { Tenant, Note } from '../config/database.js';

export const upgradeTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ slug: req.params.slug });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Verify the user belongs to this tenant and is admin
    if (req.user.tenant_slug !== req.params.slug) {
      return res.status(403).json({ error: 'Access denied' });
    }

    tenant.plan = 'pro';
    await tenant.save();

    res.json({ message: 'Tenant upgraded to Pro plan successfully' });
  } catch (error) {
    console.error('Upgrade tenant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTenantStats = async (req, res) => {
  try {
    const noteCount = await Note.countDocuments({ tenantId: req.user.tenant_id });

    res.json({
      plan: req.user.tenant_plan,
      noteCount: noteCount,
      noteLimit: req.user.tenant_plan === 'free' ? 3 : null
    });
  } catch (error) {
    console.error('Get tenant stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};