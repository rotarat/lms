/**
 * LogoutSignal
 *
 * Shows a full-screen spinner and message while logging out.
 */
export function LogoutSignal() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Logging out…</span>
        </div>
        <div className="mt-2">Logging out…</div>
      </div>
    </div>
  )
}
