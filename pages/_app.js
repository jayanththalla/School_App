import '../styles/tailwind.css';  // Import global CSS here
import Header from '../components/Header'; // Import your header component
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Array of paths where the header should be hidden
  const hideHeaderPaths = ["/", "/login", "/signup"];

  // Debugging line to check current path
  console.log("Current path:", router.pathname);

  return (
    <SessionProvider session={pageProps.session}>
      {/* Conditionally render the Header based on the current path */}
      {!hideHeaderPaths.includes(router.pathname) && (
        <Header 
          studentName="John Doe" 
          profilePic="https://www.w3schools.com/howto/img_avatar.png" 
          schoolName="My School" 
          schoolLogo="https://i.pinimg.com/originals/48/a3/54/48a354314bb3517dabc705eb3ee8b968.jpg" 
        />
      )}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
