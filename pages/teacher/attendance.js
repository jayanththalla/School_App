import AttendanceUpload from '../../components/AttendanceUpload';

const AttendancePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Teacher Attendance Dashboard</h1>
      <AttendanceUpload />
    </div>
  );
};

export default AttendancePage;
