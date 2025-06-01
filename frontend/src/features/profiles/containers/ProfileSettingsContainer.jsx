import { useProfileForm }  from '../hooks/useProfileForm'
import { usePasswordForm } from '../hooks/usePasswordForm'
import { ProfileFormUI }   from '../components/ProfileFormUI'
import { PasswordFormUI }  from '../components/PasswordFormUI'

export function ProfileSettingsContainer() {
  const profileHook  = useProfileForm()
  const passwordHook = usePasswordForm()

  return (
    <div className="container mt-4">
      <div className="row gx-0">
        <aside className="col-md-3">
          {/* you can optionally keep a Sidebar here */}
        </aside>
        <section className="col-md-9">
          <ProfileFormUI {...profileHook} className="mb-4"/>
          <PasswordFormUI {...passwordHook}/>
        </section>
      </div>
    </div>
  )
}
