// components/admin_notifications.js
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
});
import 'react-quill/dist/quill.snow.css';

function Anotifications() {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [audience, setAudience] = useState({
        teachers: false,
        students: false,
    });
    const [selectedClasses, setSelectedClasses] = useState({
        all: false,
        classes: [],
    });
    const [selectedSections, setSelectedSections] = useState({
        all: false,
        sections: [],
    });
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [attachmentName, setAttachmentName] = useState('');
    const [schedule, setSchedule] = useState(null);
    const [history, setHistory] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const classesList = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const sectionsList = ['A', 'B', 'C', 'D'];

    const handleAudienceChange = (e) => {
        const { name, checked } = e.target;
        setAudience((prev) => ({
            ...prev,
            [name]: checked,
        }));

        // Reset class and section selections if 'students' is unchecked
        if (name === 'students' && !checked) {
            setSelectedClasses({ all: false, classes: [] });
            setSelectedSections({ all: false, sections: [] });
        }
    };
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notifications');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setHistory(data); // Set the fetched notifications in the state
                } else {
                    console.error('Unexpected response:', data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);



    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notifications');
                const data = await response.json();
                console.log('Fetched notifications:', data); // Debugging line
                if (Array.isArray(data)) {
                    setHistory(data);
                } else {
                    console.error('Unexpected response:', data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleClassChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'all') {
            setSelectedClasses({
                all: checked,
                classes: checked ? [...classesList] : [],
            });
        } else {
            setSelectedClasses((prev) => ({
                ...prev,
                classes: checked
                    ? [...prev.classes, name]
                    : prev.classes.filter((cls) => cls !== name),
            }));
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit.');
                return;
            }
            // Check file type (e.g., only allow pdf, doc, docx, jpg, png)
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.');
                return;
            }
            setAttachment(file);
            setAttachmentName(file.name);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
        if (confirmDelete) {
            try {
                const response = await fetch(`/api/notifications/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                console.log('Delete response:', result); // Debugging line
                if (response.ok) {
                    setHistory(history.filter(notification => notification._id !== id));
                    alert("Notification deleted successfully.");
                } else {
                    console.error('Error deleting notification:', result);
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        }
    };


    const handleSectionChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'all') {
            setSelectedSections({
                all: checked,
                sections: checked ? [...sectionsList] : [],
            });
        } else {
            setSelectedSections((prev) => ({
                ...prev,
                sections: checked
                    ? [...prev.sections, name]
                    : prev.sections.filter((sec) => sec !== name),
            }));
        }
    };
    const formatDate = (date) => {
        if (!date || !date.$date) return "Invalid Date"; // Check if date exists
        const parsedDate = new Date(date.$date);
        return isNaN(parsedDate.getTime()) ? "Invalid Date" : parsedDate.toLocaleString();
    };


    const handleEdit = (notification) => {
        setTitle(notification.title);
        setType(notification.type);
        setMessage(notification.message);
        setAttachment(notification.attachment);
        setSchedule(notification.schedule ? new Date(notification.schedule) : null); // Handle undefined schedule

        setAudience({
            teachers: notification.audience.teachers,
            students: !!notification.audience.students,
        });

        if (notification.audience.students) {
            setSelectedClasses({
                all: notification.audience.students.allClasses,
                classes: notification.audience.students.classes || [],
            });
            setSelectedSections({
                all: notification.audience.students.allSections,
                sections: notification.audience.students.sections || [],
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('audience', JSON.stringify({
            teachers: audience.teachers,
            students: audience.students ? {
                allClasses: selectedClasses.all,
                classes: selectedClasses.all ? classesList : selectedClasses.classes,
                allSections: selectedSections.all,
                sections: selectedSections.all ? sectionsList : selectedSections.sections,
            } : undefined,
        }));
        formData.append('message', message);
        if (attachment) {
            formData.append('attachment', attachment);
        }
        if (schedule) {
            formData.append('schedule', schedule.toISOString());
        }

        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert("Notification created successfully!");
                setHistory([...history, data]);
                // Reset form fields
                setTitle('');
                setType('');
                setMessage('');
                setAttachment(null);
                setAttachmentName('');
                setSchedule(null);
                setAudience({ teachers: false, students: false });
                setSelectedClasses({ all: false, classes: [] });
                setSelectedSections({ all: false, sections: [] });
            } else {
                console.error('Error creating notification:', data);
                alert(`Error: ${data.message || 'Unknown error occurred'}`);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // In the render method
    <DatePicker
        selected={schedule || null} // Safeguard against undefined schedule
        onChange={(date) => setSchedule(date)}
        className="block w-full p-2 border border-gray-300 rounded"
        placeholderText="Select date"
    />


    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Notification Title */}
                <div>
                    <label className="block text-sm font-medium">Notification Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter notification title"
                        required
                    />
                </div>

                {/* Notification Type */}
                <div>
                    <label className="block text-sm font-medium">Notification Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="General">General</option>
                        <option value="Academic">Academic</option>
                        <option value="Exam">Exam</option>
                        <option value="Fee">Fee</option>
                        <option value="Event">Event</option>
                    </select>
                </div>

                {/* Target Audience */}
                <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            name="teachers"
                            checked={audience.teachers}
                            onChange={handleAudienceChange}
                            className="mr-2"
                        />
                        <span>Teachers</span>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="students"
                            checked={audience.students}
                            onChange={handleAudienceChange}
                            className="mr-2"
                        />
                        <span>Students</span>
                    </div>

                    {/* Conditional Rendering for Students */}
                    {audience.students && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-300">
                            {/* Classes Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Select Classes</label>
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name="all"
                                        checked={selectedClasses.all}
                                        onChange={handleClassChange}
                                        className="mr-2"
                                    />
                                    <span>All Classes</span>
                                </div>
                                <div className="flex flex-wrap">
                                    {classesList.map((cls) => (
                                        <div key={cls} className="mr-4 mb-2">
                                            <input
                                                type="checkbox"
                                                name={cls}
                                                checked={selectedClasses.all || selectedClasses.classes.includes(cls)}
                                                onChange={handleClassChange}
                                                disabled={selectedClasses.all}
                                                className="mr-1"
                                            />
                                            <span>{cls}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sections Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Sections</label>
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name="all"
                                        checked={selectedSections.all}
                                        onChange={handleSectionChange}
                                        className="mr-2"
                                    />
                                    <span>All Sections</span>
                                </div>
                                <div className="flex flex-wrap">
                                    {sectionsList.map((sec) => (
                                        <div key={sec} className="mr-4 mb-2">
                                            <input
                                                type="checkbox"
                                                name={sec}
                                                checked={selectedSections.all || selectedSections.sections.includes(sec)}
                                                onChange={handleSectionChange}
                                                disabled={selectedSections.all}
                                                className="mr-1"
                                            />
                                            <span>{sec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Content */}
                <div>
                    <label className="block text-sm font-medium">Message Content</label>
                    <ReactQuill
                        value={message}
                        onChange={setMessage}
                        className="bg-white"
                        placeholder="Write your message here"
                    />
                </div>

                {/* Attachment */}
                <div>
                <label className="block text-sm font-medium">Attachment (Optional)</label>
                <input
                    type="file"
                    onChange={handleFileUpload}
                    className="block w-full text-sm"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {attachmentName && (
                    <p className="mt-1 text-sm text-gray-500">
                        Selected file: {attachmentName}
                    </p>
                )}
            </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isUploading}
                >
                    {isUploading ? 'Creating Notification...' : 'Create Notification'}
                </button>
            </form>
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Notification History</h3>
                <div className="space-y-4">
                    {history.length > 0 ? (
                        history.map((notification) => (
                            <div key={notification._id} className="p-4 border rounded bg-gray-50 shadow-md">
                                <h4 className="font-medium text-lg">{notification.title}</h4>
                                <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: notification.message }} />
                                <p className="text-xs text-gray-500">{formatDate(notification.date)}</p>
                                <p className="text-sm text-gray-600">Type: {notification.type}</p>
                                {/* Action Buttons */}
                                <div className="mt-2">
                                    <button className="mr-2 text-blue-600 hover:underline" onClick={() => handleEdit(notification)}>
                                        Edit
                                    </button>
                                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(notification._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No notifications available.</p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Anotifications;
