const pool = require('../config/db');

// @desc    Get student dashboard analytics
// @route   GET /api/dashboard/student
// @access  Private/Student
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student details
    const [students] = await pool.execute('SELECT id, department, semester FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) return res.status(404).json({ message: 'Student not found' });
    const student = students[0];
    const studentId = student.id;

    // Calculate attendance percentage
    const [attendance] = await pool.execute('SELECT attendance_status FROM attendance WHERE student_id = ?', [studentId]);
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.attendance_status === 'Present').length;
    const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) + '%' : 'N/A';
    
    // Today's status
    const today = new Date().toISOString().split('T')[0];
    const [todayAtt] = await pool.execute('SELECT attendance_status FROM attendance WHERE student_id = ? AND attendance_date = ?', [studentId, today]);
    const todayStatus = todayAtt.length > 0 ? todayAtt[0].attendance_status : 'Not Marked';

    // Upcoming assignments (mock for now, or fetch from DB if assignments exist)
    const [assignments] = await pool.execute('SELECT a.*, s.subject_name FROM assignments a JOIN subjects s ON a.subject_id = s.id WHERE a.department = ? AND a.semester = ? AND a.due_date >= CURDATE() ORDER BY a.due_date ASC LIMIT 5', [student.department, student.semester]);

    // Recent marks
    const [marks] = await pool.execute('SELECT m.marks_obtained, m.total_marks, s.subject_name FROM marks m JOIN subjects s ON m.subject_id = s.id WHERE m.student_id = ? ORDER BY m.created_at DESC LIMIT 5', [studentId]);

    // CGPA/Overall Grade Mock (Requires complex calculation over all semesters, simplified here)
    const cgpa = 'N/A'; // Compute later if needed
    const rank = 'N/A'; // Compute later if needed

    res.json({
      attendancePercent,
      todayStatus,
      cgpa,
      rank,
      upcomingAssignments: assignments,
      recentMarks: marks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching student dashboard' });
  }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    // Total Students
    const [studentCount] = await pool.execute('SELECT COUNT(*) as count FROM students WHERE status = "Active"');
    
    // Total Subjects
    const [subjectCount] = await pool.execute('SELECT COUNT(*) as count FROM subjects WHERE status = "Active"');
    
    // Today's Attendance
    const today = new Date().toISOString().split('T')[0];
    const [todayAtt] = await pool.execute('SELECT attendance_status FROM attendance WHERE attendance_date = ?', [today]);
    
    const totalToday = todayAtt.length;
    const presentToday = todayAtt.filter(a => a.attendance_status === 'Present').length;
    const absentToday = totalToday - presentToday;
    const todayAttendancePercent = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) + '%' : '0%';
    
    // Average overall attendance
    const [allAtt] = await pool.execute('SELECT attendance_status FROM attendance');
    const totalAll = allAtt.length;
    const presentAll = allAtt.filter(a => a.attendance_status === 'Present').length;
    const avgAttendancePercent = totalAll > 0 ? Math.round((presentAll / totalAll) * 100) + '%' : '0%';

    // Recent activities (from activity_logs if we had it, or mock it)
    const [activities] = await pool.execute('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5');

    res.json({
      totalStudents: studentCount[0].count,
      totalSubjects: subjectCount[0].count,
      todayAttendance: todayAttendancePercent,
      presentStudents: presentToday,
      absentStudents: absentToday,
      averageAttendance: avgAttendancePercent,
      averageMarks: 'N/A',
      passPercentage: 'N/A',
      topPerformer: 'N/A',
      recentActivities: activities.length > 0 ? activities : [
        { id: 1, action: 'System started', created_at: new Date().toISOString() }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching admin dashboard' });
  }
};

module.exports = {
  getStudentDashboard,
  getAdminDashboard
};
