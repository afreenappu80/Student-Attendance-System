import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiBook, FiCheckSquare, FiUserCheck, FiUserX, 
  FiPercent, FiBarChart2, FiAward, FiStar, FiClock,
  FiPlus, FiEdit, FiTrash2, FiSearch, FiFileText
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 1245,
    totalSubjects: 48,
    todayAttendance: '85%',
    presentStudents: 1058,
    absentStudents: 187,
    averageAttendance: '82%',
    averageMarks: '76%',
    passPercentage: '92%',
    topPerformer: 'Sarah Jenkins (98%)'
  });

  const [activities, setActivities] = useState([
    { id: 1, action: 'System started', created_at: new Date().toISOString() }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/dashboard/admin', { withCredentials: true });
        setStats({
          totalStudents: data.totalStudents,
          totalSubjects: data.totalSubjects,
          todayAttendance: data.todayAttendance,
          presentStudents: data.presentStudents,
          absentStudents: data.absentStudents,
          averageAttendance: data.averageAttendance,
          averageMarks: data.averageMarks,
          passPercentage: data.passPercentage,
          topPerformer: data.topPerformer
        });
        if (data.recentActivities) {
          setActivities(data.recentActivities);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow group flex items-center space-x-4 relative overflow-hidden">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${color}`} />
      <div className={`p-4 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="z-10">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, title, path, color }) => (
    <Link to={path} className={`flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-${color}-500 transition-colors group`}>
      <div className={`p-3 rounded-full bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 mb-3 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{title}</span>
    </Link>
  );

  return (
    <DashboardLayout title="Overview Dashboard">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FiUsers} title="Total Students" value={stats.totalStudents} color="bg-blue-500 text-blue-600" />
        <StatCard icon={FiBook} title="Total Subjects" value={stats.totalSubjects} color="bg-purple-500 text-purple-600" />
        <StatCard icon={FiCheckSquare} title="Today's Attendance" value={stats.todayAttendance} color="bg-indigo-500 text-indigo-600" />
        <StatCard icon={FiUserCheck} title="Present Students" value={stats.presentStudents} color="bg-green-500 text-green-600" />
        <StatCard icon={FiUserX} title="Absent Students" value={stats.absentStudents} color="bg-red-500 text-red-600" />
        <StatCard icon={FiPercent} title="Average Attendance" value={stats.averageAttendance} color="bg-teal-500 text-teal-600" />
        <StatCard icon={FiBarChart2} title="Average Marks" value={stats.averageMarks} color="bg-orange-500 text-orange-600" />
        <StatCard icon={FiAward} title="Pass Percentage" value={stats.passPercentage} color="bg-emerald-500 text-emerald-600" />
        <StatCard icon={FiStar} title="Top Performer" value={stats.topPerformer} color="bg-yellow-500 text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiPlus className="mr-2" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <QuickAction icon={FiPlus} title="Add Student" path="/admin/students" color="blue" />
            <QuickAction icon={FiEdit} title="Edit Student" path="/admin/students" color="green" />
            <QuickAction icon={FiTrash2} title="Delete Student" path="/admin/students" color="red" />
            <QuickAction icon={FiSearch} title="Search Student" path="/admin/students" color="purple" />
            <QuickAction icon={FiCheckSquare} title="Take Attendance" path="/admin/attendance" color="indigo" />
            <QuickAction icon={FiBarChart2} title="Add Marks" path="/admin/marks" color="orange" />
            <QuickAction icon={FiFileText} title="Add Assignment" path="/admin/assignments" color="pink" />
            <QuickAction icon={FiFileText} title="Generate Reports" path="/admin/reports" color="teal" />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <FiClock className="mr-2" /> Recent Activities
            </h3>
            <div className="space-y-6">
              {activities.map(activity => (
                <div key={activity.id} className="flex relative">
                  <div className="absolute top-0 left-3 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></div>
                  <div className="relative flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full ring-4 ring-white dark:ring-gray-800 z-10">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(activity.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
