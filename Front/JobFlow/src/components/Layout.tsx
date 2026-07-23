import { 
  NavLink, 
  Outlet, 
  useNavigate 
} from 'react-router-dom'

import { 
  useEffect, 
  useState 
} from 'react'

import { 
  LayoutDashboard, 
  Briefcase, 
  Building2, 
  FileText, 
  LogOut, 
  Bot, 
  ChevronRight 
} from 'lucide-react'

import { useAuth } from '@/lib/auth'
import { getAgentStatus } from '@/lib/api'


const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/applications', icon: Briefcase, label: 'Applications' },
  { to: '/companies', icon: Building2, label: 'Companies' },
  { to: '/cvs', icon: FileText, label: 'My CVs' },
]


export default function Layout() {

  const { user, logout } = useAuth()

  const navigate = useNavigate()


  const [agentActive, setAgentActive] =
    useState(false)



  /*
    Vérification Agent Python
    toutes les 10 secondes
  */
  useEffect(() => {


    const checkAgent = async () => {

      try {

        const response =
          await getAgentStatus()


        setAgentActive(
          response.active
        )


      } catch (error) {

        setAgentActive(false)

      }

    }



    // premier check immédiat
    checkAgent()



    const interval =
      setInterval(
        checkAgent,
        10000
      )



    return () =>
      clearInterval(interval)



  }, [])



  const handleLogout = () => {

    logout()

    navigate('/login')

  }



  return (

    <div className="flex h-full">


      {/* Sidebar */}
      <aside
        className="flex flex-col w-60 shrink-0 border-r"
        style={{
          backgroundColor:'#080e1c',
          borderColor:'#1a2740'
        }}
      >


        {/* Logo */}
        <div
          className="px-5 py-5 border-b"
          style={{
            borderColor:'#1a2740'
          }}
        >

          <div className="flex items-center gap-2.5">


            <div
              className="size-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{
                background:
                'linear-gradient(135deg,#3b82f6,#818cf8)',
                color:'#fff'
              }}
            >
              JF
            </div>


            <div>

              <p
                className="text-sm font-semibold"
                style={{
                  color:'#e2e8f0'
                }}
              >
                JobFlow
              </p>


              <p
                className="text-[10px] font-mono"
                style={{
                  color:'#3b82f6'
                }}
              >
                AI-powered tracking
              </p>

            </div>


          </div>


        </div>





        {/* Agent status */}
        <div className="px-4 py-3">

          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{

              backgroundColor:
                agentActive
                ? 'rgba(34,197,94,0.08)'
                : 'rgba(239,68,68,0.08)',


              border:
                agentActive
                ? '1px solid rgba(34,197,94,0.2)'
                : '1px solid rgba(239,68,68,0.2)'

            }}
          >


            <Bot
              size={13}
              style={{
                color:
                  agentActive
                  ? '#22c55e'
                  : '#ef4444'
              }}
            />



            <span
              className="text-[11px] font-mono"
              style={{
                color:
                  agentActive
                  ? '#4ade80'
                  : '#f87171'
              }}
            >

              {
                agentActive
                ? 'Agent active'
                : 'Agent offline'
              }

            </span>



            <span
              className={
                `
                ml-auto
                size-1.5
                rounded-full
                ${
                  agentActive
                  ? 'animate-pulse'
                  : ''
                }
                `
              }

              style={{
                backgroundColor:
                  agentActive
                  ? '#22c55e'
                  : '#ef4444'
              }}
            />


          </div>

        </div>






        {/* Navigation */}
        <nav
          className="flex-1 px-3 py-2 space-y-0.5"
        >


          {
            NAV.map(
              ({
                to,
                icon:Icon,
                label
              }) => (

              <NavLink

                key={to}

                to={to}

                className={
                  ({
                    isActive
                  }) =>

                  `
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  group

                  ${
                    isActive
                    ? 'text-white'
                    : 'hover:bg-white/5'
                  }

                  `
                }



                style={
                  ({
                    isActive
                  }) =>

                  isActive

                  ? {
                      backgroundColor:
                      'rgba(59,130,246,0.15)',
                      color:'#60a5fa'
                    }

                  : {
                      color:'#64748b'
                    }

                }

              >


                {
                  ({
                    isActive
                  }) => (

                    <>


                    <Icon
                      size={16}
                      className="shrink-0"
                    />



                    <span
                      className="flex-1"
                    >
                      {label}
                    </span>



                    {
                      isActive &&
                      (
                        <ChevronRight
                          size={12}
                          style={{
                            color:'#3b82f6'
                          }}
                        />
                      )
                    }


                    </>

                  )
                }


              </NavLink>


              )
            )
          }


        </nav>







        {/* User */}
        <div
          className="border-t p-4"
          style={{
            borderColor:'#1a2740'
          }}
        >


          <div

            onClick={() =>
              navigate('/profile')
            }

            className="
            flex
            items-center
            gap-3
            mb-3
            rounded-lg
            p-2
            cursor-pointer
            transition-colors
            hover:bg-white/5
            "

          >


            <div

              className="
              size-8
              rounded-full
              flex
              items-center
              justify-center
              text-xs
              font-bold
              shrink-0
              "

              style={{
                background:
                'linear-gradient(135deg,#1e2d45,#243555)',

                color:'#94a3b8'
              }}

            >

              {
                user?.email
                ?.slice(0,2)
                .toUpperCase()
                ??
                'U'
              }


            </div>




            <div
              className="flex-1 min-w-0"
            >

              <p

                className="text-xs font-medium truncate"

                style={{
                  color:'#e2e8f0'
                }}

              >

                {
                  user?.firstName ||
                  user?.lastName

                  ?

                  `${user?.lastName ?? ''}
                   ${user?.firstName ?? ''}`
                   .trim()

                  :

                  'User'
                }


              </p>



              {
                user?.email &&

                <p

                  className="text-[10px] truncate"

                  style={{
                    color:'#64748b'
                  }}

                >

                  {user.email}

                </p>

              }



            </div>



          </div>






          <button

            onClick={handleLogout}

            className="
            flex
            w-full
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-xs
            transition-colors
            hover:bg-white/5
            "

            style={{
              color:'#64748b'
            }}

          >

            <LogOut size={13}/>

            Sign out


          </button>



        </div>



      </aside>






      {/* Main */}
      <main

        className="flex-1 overflow-auto"

        style={{
          backgroundColor:'#070b12'
        }}

      >

        <Outlet/>

      </main>




    </div>

  )

}