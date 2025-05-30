import { useState } from 'react'

/**
 * Tracks field‐level errors and runs arbitrary validation rules.
 *
 * Returns:
 * - errors: { [field: string]: string }
 * - validate(formValues, rules): boolean
 *   • rules: Array<{ field, test: (value,all) => boolean, message }>
 *   • Sets errors[field] = message when test() fails.
 *   • Returns true if all tests pass.
 * - setErrors: directly override the errors object
 */
export function useFormValidation() {
  const [errors, setErrors] = useState({})

  function validate(formValues, rules) {
    const newErrors = {}
    rules.forEach(({ field, test, message }) => {
      if (!test(formValues[field], formValues)) {
        newErrors[field] = message
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { errors, validate, setErrors }
}
