import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiLogOut, FiMenu, FiX, FiCheckSquare, FiBarChart2, FiBook, FiFileText, FiBell, FiSettings } from 'react-icons/fi';

const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Dashboard', path: '/admin', icon: FiHome },
        { name: 'Students', path: '/admin/students', icon: FiUser },
        { name: 'Subjects', path: '/admin/subjects', icon: FiBook },
        { name: 'Attendance', path: '/admin/attendance', icon: FiCheckSquare },
        { name: 'Assignments', path: '/admin/assignments', icon: FiFileText },
        { name: 'Marks', path: '/admin/marks', icon: FiBarChart2 },
        { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
        { name: 'Reports', path: '/admin/reports', icon: FiFileText },
        { name: 'Notifications', path: '/admin/notifications', icon: FiBell },
        { name: 'Profile', path: '/admin/profile', icon: FiUser },
        { name: 'Settings', path: '/admin/settings', icon: FiSettings },
      ]
    : [
        { name: 'Dashboard', path: '/student', icon: FiHome },
        { name: 'Attendance', path: '/student/attendance', icon: FiCheckSquare },
        { name: 'Marks', path: '/student/marks', icon: FiBarChart2 },
        { name: 'Assignments', path: '/student/assignments', icon: FiFileText },
        { name: 'Analytics', path: '/student/analytics', icon: FiBarChart2 },
        { name: 'Notifications', path: '/student/notifications', icon: FiBell },
        { name: 'Profile', path: '/student/profile', icon: FiUser },
        { name: 'Settings', path: '/student/settings', icon: FiSettings },
      ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">EduTrack</span>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
            >
              <item.icon className="mr-3" size={20} />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-8"
          >
            <FiLogOut className="mr-3" size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-20">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none lg:hidden mr-4"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                  {user?.name || user?.username}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
