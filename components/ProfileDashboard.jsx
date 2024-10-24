// /components/ProfileDashboard.jsx
import React from 'react';

const ProfileDashboard = ({ studentProfile }) => {
  if (!studentProfile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center mb-6">
          <img
            src={studentProfile.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
          <div className="ml-6">
            <h2 className="text-3xl font-bold">{studentProfile.name}</h2>
            <p className="text-gray-700">{studentProfile.class}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Personal Information</h3>
            <p><strong>Admission Date:</strong> {studentProfile.admissionDate}</p>
            <p><strong>Admission Number:</strong> {studentProfile.admissionNumber}</p>
            <p><strong>Roll Number:</strong> {studentProfile.rollNumber}</p>
            <p><strong>Date of Birth:</strong> {studentProfile.dob}</p>
          </div>
          
          {/* Address */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Address</h3>
            <p>{studentProfile.address}</p>
          </div>
        </div>

        {/* Parent and Guardian Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father's Details */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Father's Information</h3>
            <p><strong>Name:</strong> {studentProfile.fatherDetails.name}</p>
            <p><strong>Mobile:</strong> {studentProfile.fatherDetails.mobile}</p>
            <p><strong>Email:</strong> {studentProfile.fatherDetails.email}</p>
          </div>

          {/* Mother's Details */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Mother's Information</h3>
            <p><strong>Name:</strong> {studentProfile.motherDetails.name}</p>
            <p><strong>Mobile:</strong> {studentProfile.motherDetails.mobile}</p>
            <p><strong>Email:</strong> {studentProfile.motherDetails.email}</p>
          </div>

          {/* Guardian's Details */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Guardian's Information</h3>
            <p><strong>Name:</strong> {studentProfile.guardianDetails.name}</p>
            <p><strong>Mobile:</strong> {studentProfile.guardianDetails.mobile}</p>
            <p><strong>Email:</strong> {studentProfile.guardianDetails.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
