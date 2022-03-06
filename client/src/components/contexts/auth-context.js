import axios from 'axios'
import React, { createContext, useEffect, useState, useContext } from 'react'


// const sleep = (ms) => {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const signup = async (username, email, password, setError, resetEmailInput) => {
    setAuthLoading(true)
    const response = await axios
    .post("http://localhost:3001/signup", {
      username,
      email,
      password,
    }, {withCredentials: true})
    .catch((resp) => {

      if(resp.response === undefined && resp.message) {
        setAuthLoading(false)
        setError(resp.message + ", please try again later!")
        return;
      }
      
      console.log('ERROR RES', resp.response);

      setAuthLoading(false)
      //Reset email field and set error to whatever the response error was
      resetEmailInput();
      setError(resp.response.data);
      return;
    });
    setIsLoggedIn(true)
    setAuthLoading(false)

    return response;
  }

  const login = async (email, password, resetEmailInput, resetPasswordInput, setError) => {
    setAuthLoading(true)
    const response = await axios
    .post("http://localhost:3001/login", {
      email,
      password,
    }, {withCredentials: true})
    .catch((res) => {

      if(res.response === undefined && res.message) {
        setAuthLoading(false)
        setError(res.message + ", please try again later!")
        return;
      }


      //Reset input fields and set error to whatever the response error was
      setAuthLoading(false)
        resetEmailInput();
        resetPasswordInput();
        setError(res.response.data);
        return;
    });
    setIsLoggedIn(true)
    setAuthLoading(false)

    return response;
  }

  const logout = async () => {
  
    const response = await axios.get('http://localhost:3001/logout', { withCredentials: true });
    console.log(response);

    setIsLoggedIn(false);

    return response;
  }

  const checkServerIfLogged = async () => {
    const response = await axios.get('http://localhost:3001/logged', { withCredentials: true });
    console.log(response)
    return response;
  }


  const authContextValue = {
    isLoggedIn,
    setIsLoggedIn,
    signup,
    login,
    authLoading,
    logout,
    checkServerIfLogged
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}

//Allows for use of AuthCOntext in components
export const useAuth = () => useContext(AuthContext)
