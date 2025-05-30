import { Button } from './Button'

/**
 * Button that shows a Bootstrap spinner and label when loading.
 *
 * Props:
 * - loading: boolean
 * - loadingLabel: string
 * - children: ReactNode (button text when not loading)
 * - ...props: passed to Button
 */
export function LoadingButton({
  loading,
  loadingLabel = 'Loading...',
  children,
  onClick,
  ...props
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          {loadingLabel}
        </>
      ) : children}
    </Button>
  )
}