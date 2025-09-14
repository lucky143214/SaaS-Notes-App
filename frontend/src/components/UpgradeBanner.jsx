import { useState } from 'react';
import { Crown } from 'lucide-react';
import { tenantService } from '../services/tenant';
import { useAuthContext } from '../context/AuthContext';

const UpgradeBanner = ({ stats, onUpgrade }) => {
  const { user } = useAuthContext();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await tenantService.upgrade(user.tenant.slug);
      onUpgrade();
      alert('Tenant upgraded to Pro plan successfully!');
    } catch (error) {
      console.error('Upgrade error:', error);
      alert(error.response?.data?.error || 'Failed to upgrade tenant');
    } finally {
      setIsUpgrading(false);
    }
  };

  if (stats.plan === 'pro') {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Crown size={24} className="mr-2" />
          <h3 className="font-semibold">Pro Plan Active</h3>
        </div>
        <p className="text-sm opacity-90 mt-1">Enjoy unlimited notes!</p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-yellow-800">Free Plan Limit</h3>
          <p className="text-sm text-yellow-700">
            {stats.noteCount} of 3 notes used. Upgrade to Pro for unlimited notes.
          </p>
        </div>
        {user.role === 'admin' && (
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
          >
            {isUpgrading ? 'Upgrading...' : 'Upgrade to Pro'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UpgradeBanner;