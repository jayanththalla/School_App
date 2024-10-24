import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const TAttendance = () => {
    const { handleSubmit, register } = useForm();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [classSelected, setClassSelected] = useState('');
    const [sectionSelected, setSectionSelected] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            if (classSelected && sectionSelected) {
                setLoading(true);
                try {
                    const response = await fetch(`/api/students?class=${classSelected}&section=${sectionSelected}`);
                    const data = await response.json();
                    setStudents(data);
                    initializeAttendanceData(data);
                } catch (error) {
                    console.error('Error fetching students:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStudents();
    }, [classSelected, sectionSelected]);

    const initializeAttendanceData = (studentList) => {
        setAttendanceData(studentList.map((student) => ({ id: student.id, status: '' })));
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceData((prevData) => prevData.map((item) => item.id === studentId ? { ...item, status } : item));
    };

    const onSubmit = async () => {
        setLoading(true);
        await Promise.all(attendanceData.map(async ({ id, status }) => {
            if (status) { // Check if status is not empty
                const response = await fetch('/api/attendance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentId: id, date, status })
                });
                if (!response.ok) {
                    console.error(`Failed to submit attendance for student ${id}`);
                }
            }
        }));
        alert('Attendance submitted successfully!');
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 shadow-md rounded-lg max-w-3xl">
            <h2 className="text-3xl font-semibold text-center text-[#003b6d] mb-6">Mark Attendance</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Date and Class selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            {...register("date")} // Using react-hook-form
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="class">Class:</label>
                        <select
                            id="class"
                            value={classSelected}
                            onChange={(e) => setClassSelected(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Class</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="section">Section:</label>
                        <select
                            id="section"
                            value={sectionSelected}
                            onChange={(e) => setSectionSelected(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Section</option>
                            {['A', 'B', 'C', 'D'].map((section) => (
                                <option key={section} value={section}>{section}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {classSelected && sectionSelected && (
                    <>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-[#003b6d] mb-2">Students:</h3>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                students.map((student) => (
                                    <div key={student.id} className="flex items-center justify-between mb-2 p-2 border border-gray-300 rounded-md">
                                        <span className="text-gray-700 font-medium">{student.name}</span>
                                        <div className="flex items-center space-x-4">
                                            {['present', 'absent', 'holiday'].map((status) => (
                                                <label className="flex items-center" key={status}>
                                                    <input
                                                        type="radio"
                                                        name={`attendance-${student.id}`}
                                                        value={status}
                                                        checked={attendanceData.find((item) => item.id === student.id)?.status === status}
                                                        onChange={() => handleAttendanceChange(student.id, status)}
                                                        className="mr-1"
                                                    />
                                                    <span className={status === 'present' ? 'text-green-500' : status === 'absent' ? 'text-red-500' : 'text-gray-500'}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex justify-between mb-6">
                            <button type="button" onClick={() => handleMarkAll('present')} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600">Mark All as Present</button>
                            <button type="button" onClick={() => handleMarkAll('absent')} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600">Mark All as Absent</button>
                            <button type="button" onClick={() => handleMarkAll('holiday')} className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600">Public Holiday</button>
                        </div>
                    </>
                )}

                <div className="text-center">
                    <button type="submit" className="bg-[#003b6d] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#255986]">Submit Attendance</button>
                </div>
            </form>
        </div>
    );
};

export default TAttendance;
