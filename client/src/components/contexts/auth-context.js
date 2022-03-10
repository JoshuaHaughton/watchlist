import axios from 'axios'
import React, { createContext, useState, useContext } from 'react'

//Create context
const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const signup = async (username, email, password, setError, resetEmailInput) => {
    setAuthLoading(true)
    const response = await axios
    .post("https://watchlist-server1.herokuapp.com/signup", {
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
    .post("https://watchlist-server1.herokuapp.com/login", {
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
  
    const response = await axios.get('https://watchlist-server1.herokuapp.com/logout', { withCredentials: true });
    console.log(response);

    setIsLoggedIn(false);

    return response;
  }

  const checkServerIfLogged = async () => {
    const response = await axios.get('https://watchlist-server1.herokuapp.com/logged', { withCredentials: true })
    .catch(err => {
      console.log(err.message)
      setIsLoggedIn(false)
    });

    console.log(response)
    if(response.status === 201 || response.status === 200) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
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
