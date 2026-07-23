import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react'

import * as api from './api'
import type {
  AuthRequest,
  RegisterRequest,
  UserResponse,
} from './types'


interface AuthContextType {
  token: string | null
  user: UserResponse | null
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: AuthRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: UserResponse) => void
  logout: () => void
}


const AuthContext =
  createContext<AuthContextType | null>(null)



export function AuthProvider({
  children
}: {
  children: ReactNode
}) {


  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('jf_token')
  )


  const [user, setUser] =
    useState<UserResponse | null>(null)


  const [loading, setLoading] =
    useState(true)



  const logout = useCallback(() => {

    localStorage.removeItem(
      'jf_token'
    )

    setToken(null)
    setUser(null)

  }, [])



  const refreshUser = useCallback(
    async () => {

      const currentUser =
        await api.getCurrentUser()

      setUser(currentUser)

    },
    []
  )



  /*
   * Chargement automatique du profil
   * après un refresh navigateur
   */
  useEffect(() => {

    const loadUser = async () => {

      try {

        if (token) {
          await refreshUser()
        }

      } catch (error) {

        console.error(
          'Failed to load user',
          error
        )

        logout()

      } finally {

        setLoading(false)

      }

    }


    loadUser()

  }, [token, refreshUser, logout])




  const login = useCallback(
    async (credentials: AuthRequest) => {


      const response =
        await api.login(credentials)



      localStorage.setItem(
        'jf_token',
        response.token
      )


      setToken(
        response.token
      )


      /*
       * récupérer le vrai user depuis la DB
       */
      const currentUser =
        await api.getCurrentUser()


      setUser(currentUser)

    },
    []
  )




  const register = useCallback(
    async (data: RegisterRequest) => {

      await api.register(data)

    },
    []
  )





  const value = useMemo(
    () => ({

      token,

      user,

      loading,

      isAuthenticated:
        token !== null &&
        user !== null,


      login,

      register,

      refreshUser,

      setUser,

      logout,

    }),

    [
      token,
      user,
      loading,
      login,
      register,
      refreshUser,
      logout,
    ]
  )




  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  )

}




export function useAuth() {

  const context =
    useContext(AuthContext)


  if (!context) {

    throw new Error(
      'useAuth must be used inside AuthProvider'
    )

  }


  return context

}