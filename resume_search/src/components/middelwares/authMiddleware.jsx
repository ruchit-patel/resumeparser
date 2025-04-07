import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthMiddleware = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const system_user = Cookies.get('system_user');
    console.log("system_user :",system_user)
    if (system_user === 'yes') {
      setAuth(true);
    } else {
      window.location.href = `/login?redirect-to=${window.location.pathname}`;
    }
  }, []);

  if (auth === null) return (
    <div>Checking authentication...
    </div>
  );

  return <>{children}</>;
};

export default AuthMiddleware;
