import { useState, useEffect } from 'react';
import axios from 'axios';
import { BiLoaderCircle } from 'react-icons/bi';
import background from '../../assets/admin.jpg';
import { FaDiscord, FaUserClock } from "react-icons/fa";
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';
import DatabaseManager from './components/DatabaseManager';
import { User } from '../../types/adminTypes';
import DefaultLayout from '../../layouts/DefaultLayout';

const Admin: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [, setOtherRoles] = useState<User[]>([]);
  const [, setAllActiveUsers] = useState<User[]>([]);
  const [, setUsers] = useState<User[]>([]);
  const [, setAdmins] = useState<User[]>([]);
  const [, setClipTeam] = useState<User[]>([]);
  const [, setEditors] = useState<User[]>([]);
  const [, setUploader] = useState<User[]>([]);
  const [disabledUsers, setDisabledUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const AVAILABLE_ROLES = ['user', 'admin', 'clipteam', 'editor', 'uploader'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async (): Promise<void> => {
    try {
      await fetchUsers();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchUsers = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<User[]>(`/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const everyUser = response.data;
      setAllUsers(everyUser);

      // Filter active users from the fetched data
      const activeUsers = everyUser.filter(user => user.status === 'active');
      setAllActiveUsers(activeUsers);

      // Further filter users based on roles array
      setUsers(activeUsers.filter(user => user.roles.includes('user')));
      setOtherRoles(activeUsers.filter(user => !user.roles.includes('user')));
      setAdmins(activeUsers.filter(user => user.roles.includes('admin')));
      setClipTeam(activeUsers.filter(user => user.roles.includes('clipteam')));
      setEditors(activeUsers.filter(user => user.roles.includes('editor')));
      setUploader(activeUsers.filter(user => user.roles.includes('uploader')));
      setDisabledUsers(everyUser.filter(user => user.status === 'disabled'));
    } catch (error) {
      console.error('Error fetching users:', error);
      if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
        window.location.href = '/clips';
        alert('You do not have permission to view this page.');
      }
    }
  };

  const handleApproveUser = async (userId: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/approve`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisabledUsers(disabledUsers.filter(user => user._id !== userId));
      fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(allUsers.filter(user => user._id !== id));
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  return (
    <DefaultLayout
      title="Admin Dashboard"
      subtitle="Manage the unmanaged..."
      backgroundImage={background}
      metaDescription="Admin dashboard for Spoekle.com - manage users and system configuration."
    >
      {/* Loading state */}
      {loading ? (
        <div className="container max-w-7xl px-4 py-12 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-8 text-center">Loading Dashboard</h1>
          <BiLoaderCircle className="animate-spin text-7xl" />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-10">
            {/* User List */}
            <UserList
              fetchUsers={fetchUsers}
              disabledUsers={disabledUsers}
              setDisabledUsers={setDisabledUsers}
              AVAILABLE_ROLES={AVAILABLE_ROLES}
            />

            {/* Create User and Disabled Users Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <CreateUser
                fetchUsers={fetchUsers}
                AVAILABLE_ROLES={AVAILABLE_ROLES}
              />

              <div className="w-full bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white transition duration-200 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl">
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
                    {disabledUsers.map(user => (
                      <div
                        key={user._id}
                        className="bg-neutral-200 dark:bg-neutral-700 p-4 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-neutral-300 dark:bg-neutral-600">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{user.username}</p>
                            <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                              <FaDiscord
                                className="mr-1"
                                style={{ color: user.discordId ? '#7289da' : 'currentColor' }}
                              />
                              <span>{user.discordUsername || 'Not connected'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveUser(user._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Enable
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Database Manager */}
            <DatabaseManager
              token={localStorage.getItem('token')}
            />
          </div>
        </div>
      )}
    </DefaultLayout >
  );
}

export default Admin;
