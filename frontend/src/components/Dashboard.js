import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, LogOut, Activity, Droplet, Wind, Trash2, 
  Bell, TrendingUp, Users, AlertTriangle, CheckCircle,
  Calendar, BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vendingService, washroomService, analyticsService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [vendingMachines, setVendingMachines] = useState([]);
  const [washrooms, setWashrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, vendingRes, washroomRes] = await Promise.all([
        analyticsService.getDashboard(),
        vendingService.getAll(),
        washroomService.getAll(),
      ]);

      setDashboardData(analyticsRes.data);
      setVendingMachines(vendingRes.data);
      setWashrooms(washroomRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Droplet className="text-pink-500" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {dashboardData?.totalMachines || 0}
          </h3>
          <p className="text-gray-600 text-sm">Vending Machines</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Wind className="text-blue-500" size={24} />
            </div>
            <Activity className="text-blue-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {dashboardData?.totalWashrooms || 0}
          </h3>
          <p className="text-gray-600 text-sm">Washroom Monitors</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Trash2 className="text-orange-500" size={24} />
            </div>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {dashboardData?.totalIncinerators || 0}
          </h3>
          <p className="text-gray-600 text-sm">Incinerators</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Bell className="text-red-500" size={24} />
            </div>
            <AlertTriangle className="text-yellow-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {dashboardData?.activeAlerts || 0}
          </h3>
          <p className="text-gray-600 text-sm">Active Alerts</p>
        </div>
      </div>

      {/* Issues Requiring Attention */}
      {(dashboardData?.lowStockMachines > 0 || dashboardData?.washroomsNeedingCleaning > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="text-yellow-600" size={24} />
            <h3 className="text-lg font-bold text-yellow-900">Attention Required</h3>
          </div>
          <div className="space-y-2">
            {dashboardData.lowStockMachines > 0 && (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                <span className="text-gray-700">Low Stock Vending Machines</span>
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {dashboardData.lowStockMachines}
                </span>
              </div>
            )}
            {dashboardData.washroomsNeedingCleaning > 0 && (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                <span className="text-gray-700">Washrooms Needing Cleaning</span>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {dashboardData.washroomsNeedingCleaning}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('vending')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition text-left"
          >
            <Droplet className="text-pink-500 mb-2" size={24} />
            <p className="font-semibold text-gray-800">Manage Vending</p>
            <p className="text-sm text-gray-600">View and refill machines</p>
          </button>
          <button
            onClick={() => setActiveTab('washrooms')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
          >
            <Wind className="text-blue-500 mb-2" size={24} />
            <p className="font-semibold text-gray-800">Washroom Status</p>
            <p className="text-sm text-gray-600">Check hygiene levels</p>
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left"
          >
            <Heart className="text-purple-500 mb-2" size={24} />
            <p className="font-semibold text-gray-800">Health Resources</p>
            <p className="text-sm text-gray-600">Access awareness content</p>
          </button>
        </div>
      </div>
    </div>
  );

  const VendingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Vending Machines</h3>
        <button
          onClick={() => setActiveTab('overview')}
          className="text-sm text-blue-500 hover:underline"
        >
          Back to Overview
        </button>
      </div>

      {vendingMachines.length === 0 ? (
        <p className="text-gray-600">No vending machines available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendingMachines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white p-6 rounded-xl shadow border border-gray-200"
            >
              <h4 className="text-lg font-semibold text-gray-800">{machine.name}</h4>
              <p className="text-sm text-gray-600">Location: {machine.location}</p>
              <p className="text-sm text-gray-600">Stock: {machine.stock}</p>
              <p className="text-sm text-gray-600">
                Last Refilled: {new Date(machine.lastRefilled).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const WashroomsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Washrooms</h3>
        <button
          onClick={() => setActiveTab('overview')}
          className="text-sm text-blue-500 hover:underline"
        >
          Back to Overview
        </button>
      </div>

      {washrooms.length === 0 ? (
        <p className="text-gray-600">No washrooms monitored.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {washrooms.map((washroom) => (
            <div
              key={washroom.id}
              className="bg-white p-6 rounded-xl shadow border border-gray-200"
            >
              <h4 className="text-lg font-semibold text-gray-800">{washroom.name}</h4>
              <p className="text-sm text-gray-600">Location: {washroom.location}</p>
              <p className="text-sm text-gray-600">Hygiene Level: {washroom.hygieneLevel}</p>
              <p className="text-sm text-gray-600">
                Last Cleaned: {new Date(washroom.lastCleaned).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <p className="text-gray-600 text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-500 hover:underline"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'vending' && <VendingTab />}
      {activeTab === 'washrooms' && <WashroomsTab />}
    </div>
  );
};

export default Dashboard;

        