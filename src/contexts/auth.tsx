import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  avatar_url: string;
  nome: string;
  login: string;
}

interface AuthContextData {
  user: User | null;
  singInUrl: string;
}

type AuthResponse = {
  token: string;
  user: {
    id: string,
    avatar_url: string
    nome: string,
    login: string
  }
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<User | null>(null)

  const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=8d172e4040af51906ede`;


  async function singIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })
    const { token, user } = response.data

    localStorage.setItem('@dowhile:token', token)
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

  return (
    <AuthContext.Provider value={{ singInUrl, user }}>
      {children}
    </AuthContext.Provider>
  )
}