import { FormCard }      from '../../../shared/components/FormCard'
import { Input }         from '../../../shared/components/Input'
import { LoadingButton } from '../../../shared/components/LoadingButton'

/**
 * Props:
 * - form: { username, password }
 * - formErrors: { username?, password? }
 * - error: string|null          // server or container‐level error
 * - loading: boolean
 * - onChange: (e) => void       // input change handler
 * - onSubmit: (e) => void       // form submit handler
 */
export function LoginForm({
  form,
  formErrors = {},
  error,
  loading,
  onChange,
  onSubmit
}) {
  return (
    <FormCard
      title="Welcome back!"
      error={error}
      footer={true}
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      to="/register"
    >
      <form id="loginForm" onSubmit={onSubmit} noValidate>
        <fieldset>
          <Input
            label="Username"
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={onChange}
            error={formErrors.username}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            error={formErrors.password}
            required
          />
          <div className="text-center mt-3">
            <LoadingButton
            type="submit"
            form="loginForm"
            variant="primary"
            loading={loading}
            loadingLabel="Signing in…"
            >
              Sign in
            </LoadingButton>
          </div>
        </fieldset>
      </form>
    </FormCard>
  )
}
