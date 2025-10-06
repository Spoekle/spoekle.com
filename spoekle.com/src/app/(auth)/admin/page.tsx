'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUsers, FaTrash, FaEdit, FaCheck, FaTimes, FaUserClock, FaDiscord, FaUserPlus, FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import DefaultLayout from '@/components/DefaultLayout';

interface User {
  _id: string;
  username: string;
  email: string;
  roles: string[];
  isApproved?: boolean;
  status: string;
  createdAt: string;
  profilePicture?: string;
  discordId?: string;
  discordUsername?: string;
}

interface FeaturedItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: string;
  order: number;
  active: boolean;
}

type TabType = 'users' | 'featured';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [disabledUsers, setDisabledUsers] = useState<User[]>([]);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInactiveFeatured, setShowInactiveFeatured] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    username: '',
    email: '',
    password: '',
    roles: ['user'] as string[],
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [createUserErrors, setCreateUserErrors] = useState<Record<string, string>>({});
  const AVAILABLE_ROLES = ['user', 'admin', 'clipteam', 'editor', 'uploader'];

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || !user.roles.includes('admin')) {
        router.push('/');
        return;
      }
      fetchUsers();
      fetchFeaturedItems();
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (activeTab === 'featured') {
      fetchFeaturedItems();
    }
  }, [showInactiveFeatured, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const everyUser = response.data;
      setAllUsers(everyUser);
      
      // Filter active and disabled users
      const activeUsers = everyUser.filter((u: User) => u.status === 'active');
      const disabled = everyUser.filter((u: User) => u.status === 'disabled');
      
      setUsers(activeUsers);
      setDisabledUsers(disabled);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to fetch users');
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = `/api/featured${showInactiveFeatured ? '?includeInactive=true' : ''}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = response.data.data || response.data;
      setFeaturedItems(data);
    } catch (error) {
      console.error('Error fetching featured items:', error);
      showError('Failed to fetch featured items');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/users/approve', { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess('User approved successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      showError('Failed to approve user');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Failed to delete user');
    }
  };

  const handleUpdateRoles = async (userId: string, roles: string[]) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/admin/users/${userId}`, 
        { roles },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      showSuccess('User roles updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating roles:', error);
      showError('Failed to update roles');
    }
  };

  const toggleRole = (userId: string, role: string, currentRoles: string[]) => {
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    handleUpdateRoles(userId, newRoles);
  };

  const checkPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    return strength;
  };

  const handleCreateUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateUserForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    if (createUserErrors[name]) {
      setCreateUserErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleCreateUserRole = (role: string) => {
    setCreateUserForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role).length > 0 
          ? prev.roles.filter(r => r !== role) 
          : prev.roles
        : [...prev.roles, role]
    }));
  };

  const handleCreateUser = async () => {
    const errors: Record<string, string> = {};
    
    if (!createUserForm.username.trim() || createUserForm.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!createUserForm.password || passwordStrength < 2) {
      errors.password = 'Password is too weak';
    }
    if (createUserForm.email && !/\S+@\S+\.\S+/.test(createUserForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (Object.keys(errors).length > 0) {
      setCreateUserErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/create-user',
        { ...createUserForm, status: 'active' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showSuccess('User created successfully!');
      setCreateUserForm({ username: '', email: '', password: '', roles: ['user'] });
      setPasswordStrength(0);
      setCreateUserErrors({});
      setShowCreateUser(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      showError(error.response?.data?.message || 'Failed to create user');
    }
  };

  // Featured Items Functions
  const handleDeleteFeaturedItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this featured item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/featured/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      showSuccess('Featured item deleted successfully');
      fetchFeaturedItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      showError('Failed to delete item');
    }
  };

  const toggleFeaturedActive = async (item: FeaturedItem) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/featured/${item._id}`,
        { ...item, active: !item.active },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      showSuccess(`Featured item ${!item.active ? 'activated' : 'deactivated'}`);
      fetchFeaturedItems();
    } catch (error) {
      console.error('Error toggling active status:', error);
      showError('Failed to update item');
    }
  };

  if (isAuthLoading || loading) {
    return (
      <DefaultLayout
        title="Admin Dashboard"
        subtitle="Manage the unmanaged..."
        backgroundImage="/assets/admin.jpg"
      >
        <div className="container max-w-7xl px-4 py-12 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-8 text-center">Loading Dashboard</h1>
          <BiLoaderCircle className="animate-spin text-7xl" />
        </div>
      </DefaultLayout>
    );
  }

  if (!user || !user.roles.includes('admin')) {
    return null;
  }

  return (
    <DefaultLayout
      title="Admin Dashboard"
      subtitle="Manage the unmanaged..."
      backgroundImage="/assets/admin.jpg"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-2 bg-neutral-200 dark:bg-neutral-800 p-2 rounded-xl"
        >
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FaUsers />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'featured'
                ? 'bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FaStar />
            <span>Featured Items</span>
          </button>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <>
            {/* User List Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white transition duration-200 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b pb-3 border-neutral-400 dark:border-neutral-700 flex items-center">
                <FaUsers className="mr-3 text-indigo-500" />
                User Management ({users.length} active users)
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-200 dark:bg-neutral-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Roles
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-300 dark:divide-neutral-700">
                    {users.map((userItem) => (
                      <tr key={userItem._id} className="hover:bg-neutral-200 dark:hover:bg-neutral-700/50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-neutral-300 dark:bg-neutral-600">
                              {userItem.profilePicture ? (
                                <img
                                  src={userItem.profilePicture}
                                  alt={userItem.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                                  {userItem.username.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{userItem.username}</div>
                              {userItem.discordUsername && (
                                <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                                  <FaDiscord className="mr-1" style={{ color: '#7289da' }} />
                                  <span>{userItem.discordUsername}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">{userItem.email}</div>
                        </td>
                        <td className="px-4 py-4">
                          {editingUser?._id === userItem._id ? (
                            <div className="flex flex-wrap gap-2">
                              {AVAILABLE_ROLES.map((role) => (
                                <button
                                  key={role}
                                  onClick={() => toggleRole(userItem._id, role, editingUser.roles)}
                                  className={`px-2 py-1 rounded text-xs transition-colors ${
                                    editingUser.roles.includes(role)
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                                  }`}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {userItem.roles.map((role) => (
                                <span
                                  key={role}
                                  className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded text-xs"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingUser(editingUser?._id === userItem._id ? null : userItem)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                              title="Edit roles"
                            >
                              {editingUser?._id === userItem._id ? <FaTimes /> : <FaEdit />}
                            </button>
                            <button
                              onClick={() => handleDelete(userItem._id)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                              title="Delete user"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Create User and Disabled Users Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Create User Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white transition duration-200 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b pb-3 border-neutral-400 dark:border-neutral-700 flex items-center">
              <FaUserPlus className="mr-3 text-blue-500" />
              Create User
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={createUserForm.username}
                  onChange={handleCreateUserChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    createUserErrors.username ? 'border-red-500' : 'border-neutral-400 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
                  placeholder="Enter username"
                />
                {createUserErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{createUserErrors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-neutral-500">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={createUserForm.email}
                  onChange={handleCreateUserChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    createUserErrors.email ? 'border-red-500' : 'border-neutral-400 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
                  placeholder="Enter email (optional)"
                />
                {createUserErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{createUserErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={createUserForm.password}
                  onChange={handleCreateUserChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    createUserErrors.password ? 'border-red-500' : 'border-neutral-400 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
                  placeholder="Enter a strong password"
                />
                {createUserErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{createUserErrors.password}</p>
                )}
                {createUserForm.password && (
                  <div className="mt-2">
                    <div className="text-sm mb-1">
                      Strength: <span className={passwordStrength <= 1 ? 'text-red-500' : passwordStrength === 2 ? 'text-yellow-500' : 'text-green-500'}>
                        {['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'][passwordStrength]}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === 0 ? 'bg-red-500' :
                          passwordStrength === 1 ? 'bg-orange-500' :
                          passwordStrength === 2 ? 'bg-yellow-500' :
                          passwordStrength === 3 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength * 25}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Roles</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_ROLES.map((role) => (
                    <label key={role} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createUserForm.roles.includes(role)}
                        onChange={() => toggleCreateUserRole(role)}
                        className="rounded"
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateUser}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaUserPlus />
                Create User
              </button>
            </div>
          </motion.div>

          {/* Disabled Users Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white transition duration-200 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b pb-3 border-neutral-400 dark:border-neutral-700 flex items-center">
              <FaUserClock className="mr-3 text-yellow-500" />
              Disabled Users
            </h2>

            {!disabledUsers.length ? (
              <div className="flex flex-col items-center justify-center p-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
                <p className="text-lg text-neutral-600 dark:text-neutral-300">
                  No disabled users at this time
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {disabledUsers.map(userItem => (
                  <div
                    key={userItem._id}
                    className="bg-neutral-200 dark:bg-neutral-700 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-neutral-300 dark:bg-neutral-600">
                        {userItem.profilePicture ? (
                          <img
                            src={userItem.profilePicture}
                            alt={userItem.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                            {userItem.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{userItem.username}</p>
                        <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                          <FaDiscord
                            className="mr-1"
                            style={{ color: userItem.discordId ? '#7289da' : 'currentColor' }}
                          />
                          <span>{userItem.discordUsername || 'Not connected'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(userItem._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Enable
                      </button>
                      <button
                        onClick={() => handleDelete(userItem._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
          </>
        )}

        {/* Featured Items Tab */}
        {activeTab === 'featured' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-300 dark:bg-neutral-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <FaStar className="text-4xl text-yellow-500 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                    Featured Items
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Manage homepage featured section
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInactiveFeatured(!showInactiveFeatured)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showInactiveFeatured
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {showInactiveFeatured ? 'Show Active Only' : 'Show All'}
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/admin/featured/new')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <FaEdit />
                  <span>Add Featured Item</span>
                </motion.button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
              </div>
            ) : featuredItems.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  No featured items found
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Create your first featured item to display on the homepage
                </p>
                <button
                  onClick={() => router.push('/admin/featured/new')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Featured Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {featuredItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white dark:bg-neutral-700 rounded-lg p-4 shadow-md border ${
                      item.active
                        ? 'border-green-300 dark:border-green-700'
                        : 'border-neutral-300 dark:border-neutral-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
                            {item.title}
                          </h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300">
                            {item.type}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            Order: {item.order}
                          </span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                          {item.description}
                        </p>
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {item.linkUrl}
                        </a>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleFeaturedActive(item)}
                          className={`p-2 rounded-lg transition-colors ${
                            item.active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-neutral-100 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300'
                          }`}
                          title={item.active ? 'Active' : 'Inactive'}
                        >
                          {item.active ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        
                        <button
                          onClick={() => router.push(`/admin/featured/edit/${item._id}`)}
                          className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteFeaturedItem(item._id)}
                          className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </DefaultLayout>
  );
}
