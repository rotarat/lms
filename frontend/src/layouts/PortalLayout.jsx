import { Logo } from '../shared/components/Logo'
import Menu from '../shared/components/Menu'
import Navbar from '../shared/components/NavbarPortal'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../shared/hooks/useAuth'
import { ChatContainer } from '../features/ai/containers/ChatContainer'


export default function PortalLayout() {
  const { profile } = useAuth()

  return (
    <div className="container-fluid vh-100 px-0">
      <div className="row gx-0 h-100">

       {/* SIDEBAR */}
       <aside
          className="
            col-sm-auto
            col-md-3 col-lg-2
            bg-gradient
            d-none d-sm-flex flex-column
            align-items-start
            p-3
          "
        >
          <Logo to="/portal/home">
            <span className="d-none d-md-inline">LMS Portal</span>
          </Logo>
          <Menu className="mt-4" />
        </aside>

        {/* MAIN CONTENT */}
        <main className="col-12 col-sm flex-grow-1 d-flex flex-column">
          <header className="navbar navbar-light border-bottom px-3">
            <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
              {/* Search & User */}
              <Navbar />
            </div>
          </header>

          {/* scrollable page */}
          <div className="flex-grow-1 overflow-auto p-3">
            {profile?.role === 'student' && <ChatContainer />}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
