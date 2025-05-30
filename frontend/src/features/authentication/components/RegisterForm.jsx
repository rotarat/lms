import { FormCard }      from '../../../shared/components/FormCard'
import { Input }         from '../../../shared/components/Input'
import { RadioGroup }    from '../../../shared/components/RadioGroup'
import { LoadingButton } from '../../../shared/components/LoadingButton'

/**
 * Props:
 * - form: { username, email, password1, password2 }
 * - formErrors: { username?, email?, password1?, password2? }
 * - error: string|null          // server or container‐level error
 * - loading: boolean
 * - onChange: (e) => void
 * - onSubmit: (e) => void
 */
export function RegisterForm({
  form,
  formErrors = {},
  error,
  loading,
  onChange,
  onSubmit
}) {
  return (
    <FormCard
      title="Welcome aboard!"
      error={error}
      footer={true}
      footerText="Already have an account?"
      footerLinkText="Sign in"
      to="/login"
    >
      <form id="registerForm" onSubmit={onSubmit} noValidate>
        <fieldset>
          <Input
            label="Username"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={onChange}
            error={formErrors.username}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            error={formErrors.email}
            required
          />
          <Input
            label="Password"
            name="password1"
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            value={form.password1}
            onChange={onChange}
            error={formErrors.password1}
            required
          />
          <Input
            label="Confirm Password"
            name="password2"
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            value={form.password2}
            onChange={onChange}
            error={formErrors.password2}
            required
          />
          <RadioGroup
            name="role"
            options={[
              { label: 'Student', value: 'student' },
              { label: 'Teacher', value: 'teacher' }
            ]}
            selected={form.role}
            onChange={onChange}
            error={formErrors.role}
            inline
            className="mt-2"
          />
        </fieldset>
        <div className="text-center mt-2">
          <LoadingButton
          type="submit"
          form="registerForm"
          variant="primary"
          loading={loading}
          loadingLabel="Signing up…"
          >
            Sign up
          </LoadingButton>
        </div>
      </form>
    </FormCard>
  )
}
