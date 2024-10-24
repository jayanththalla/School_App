import { BellIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

const Header = ({ studentName, profilePic, schoolName, schoolLogo, notificationCount = 0 }) => {
  const router = useRouter();

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const navigateToNotifications = () => {
    router.push('/notifications');
  };

  return (
    <header className="bg-blue-800 text-white p-1 shadow-md flex items-center justify-between">
      <div className="flex flex-col items-center cursor-pointer" onClick={navigateToDashboard}>
        <img
          src={schoolLogo}
          alt={`${schoolName} logo`}
          className="h-12 w-12 rounded-full border-2 border-white mb-1"
        />
        <h1 className="text-sm font-medium">{schoolName}</h1>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative cursor-pointer" onClick={navigateToNotifications}>
          <BellIcon className="h-7 w-7 text-yellow-400" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {notificationCount}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <img
            src={profilePic}
            alt={`${studentName}'s profile`}
            className="h-10 w-10 rounded-full border-2 border-white cursor-pointer hover:opacity-75 transition-opacity"
            onClick={navigateToDashboard}
          />
          <span className="text-sm font-medium mt-1">{studentName}</span>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  studentName: PropTypes.string.isRequired,
  profilePic: PropTypes.string.isRequired,
  schoolName: PropTypes.string.isRequired,
  schoolLogo: PropTypes.string.isRequired,
  notificationCount: PropTypes.number
};

export default Header;