// /pages/profile/[id].js
import ProfileDashboard from '../../components/ProfileDashboard';
import axios from 'axios';

const ProfilePage = ({ studentProfile }) => {
  if (!studentProfile) {
    return <div>Loading...</div>;
  }

  return <ProfileDashboard studentProfile={studentProfile} />;
};

// Server-side rendering (SSR) to fetch the student profile data
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await axios.get(`http://localhost:3000/api/student/${id}`);
    const studentProfile = res.data;

    return {
      props: { studentProfile }, // Pass studentProfile as prop to the component
    };
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return {
      props: { studentProfile: null },
    };
  }
}

export default ProfilePage;
