import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

interface AuthContextData {
  user: User | null;
  singInUrl: string;
  signOut: ()=> void;
}

type AuthResponse = {
  token: string;
  user: {
    id: string,
    avatar_url: string
    name: string,
    login: string
  }
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<User | null>(null)

  const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=8d172e4040af51906ede`;

  function signOut(){
    setUser(null);
    localStorage.removeItem('@dowhile:token')
  }

  async function singIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })
    const { token, user } = response.data

    localStorage.setItem('@dowhile:token', token)
    api.defaults.headers.common.authorization = `Bearer ${token}`

    setUser(user)
  }

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=')

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')
      window.history.pushState({}, '', urlWithoutCode)
      singIn(githubCode)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')

    if(token){
      api.defaults.headers.common.authorization = `Bearer ${token}`
      api.get<User>('profile').then(response => {
        setUser(response.data)
      })
    }
  }, [])
  return (
    <AuthContext.Provider value={{ singInUrl, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

