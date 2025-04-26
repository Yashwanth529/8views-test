// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../auth/firebase';
// import Home from '../components/home/Home';

// const HomePage = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         router.replace('/signup');
//       } else {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <Home />
//     </div>
//   );
// };

// export default HomePage;


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import Home from '../components/home/Home';

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        router.replace('/signup');
      }
    });

    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return <Home />;
};

export default HomePage;
