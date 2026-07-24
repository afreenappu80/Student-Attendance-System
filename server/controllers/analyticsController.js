const pool = require('../config/db');

// @desc    Get admin analytics charts data
// @route   GET /api/analytics/admin
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    // In a real app, this would be complex SQL aggregations. 
    // Here we generate realistic dynamic data based on current DB state.
    
    // 1. Attendance Trend
    const areaData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [78, 85, 82, 90, 88, 92]
    };

    // 2. Department-wise Performance
    const [departments] = await pool.execute('SELECT department_name FROM departments LIMIT 5');
    const deptLabels = departments.length > 0 ? departments.map(d => d.department_name) : ['CS', 'IT', 'ECE', 'Mech', 'Civil'];
    
    const barData = {
      labels: deptLabels,
      data: deptLabels.map(() => (Math.random() * (9 - 7) + 7).toFixed(1)) // Random CGPA between 7 and 9
    };

    // 3. Doughnut (Pass vs Fail)
    const doughnutData = {
      labels: ['Passed', 'Failed', 'Withheld'],
      data: [85, 12, 3] // Realistic static ratio
    };

    // 4. Radar (Skill Assessment)
    const radarData = {
      labels: ['Assignments', 'Mid-Terms', 'Finals', 'Practicals', 'Attendance'],
      datasets: [
        { label: deptLabels[0] || 'CS', data: [90, 85, 88, 92, 85] },
        { label: deptLabels[1] || 'IT', data: [85, 82, 80, 88, 89] }
      ]
    };

    // 5. Polar Area (Subject Popularity)
    const [subjects] = await pool.execute('SELECT subject_name FROM subjects LIMIT 5');
    const subjLabels = subjects.length > 0 ? subjects.map(s => s.subject_name) : ['Data Structures', 'OS', 'Networks', 'AI', 'Web Dev'];
    const polarData = {
      labels: subjLabels,
      data: subjLabels.map(() => Math.floor(Math.random() * 100) + 50)
    };

    // 6. Line Chart (Marks Trend)
    const lineData = {
      labels: ['Test 1', 'Test 2', 'Mid-Term', 'Test 3', 'Final'],
      data: [65, 68, 75, 72, 82]
    };

    res.json({ areaData, barData, doughnutData, radarData, polarData, lineData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching admin analytics' });
  }
};

// @desc    Get student analytics charts data
// @route   GET /api/analytics/student
// @access  Private/Student
const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const areaData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      data: [100, 95, 88, 92, 100, 88]
    };

    const radarData = {
      labels: ['Programming', 'Mathematics', 'Hardware', 'Soft Skills', 'Theory'],
      mySkills: [95, 80, 75, 88, 90],
      classAverage: [78, 82, 70, 75, 80]
    };

    // Fetch actual subjects for this student
    const [students] = await pool.execute('SELECT department, semester FROM students WHERE user_id = ?', [studentId]);
    let subjLabels = ['OS', 'DBMS', 'Networks', 'Web Dev'];
    if (students.length > 0) {
      const [subjects] = await pool.execute('SELECT subject_name FROM subjects WHERE department = ? AND semester = ? LIMIT 4', [students[0].department, students[0].semester]);
      if (subjects.length > 0) subjLabels = subjects.map(s => s.subject_name);
    }
    
    const barData = {
      labels: subjLabels,
      myMarks: subjLabels.map(() => Math.floor(Math.random() * 30) + 70),
      classAverage: subjLabels.map(() => Math.floor(Math.random() * 30) + 60)
    };

    const doughnutData = {
      labels: ['Completed', 'Pending', 'Overdue'],
      data: [12, 3, 0]
    };

    res.json({ areaData, radarData, barData, doughnutData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching student analytics' });
  }
};

module.exports = {
  getAdminAnalytics,
  getStudentAnalytics
};
