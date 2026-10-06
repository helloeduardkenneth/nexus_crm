import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUiPreferences } from '../state/uiPreferences'

type PreviewForm = { previewLabel: string }

export default function FoundationPage() {
  const compactSpacing = useUiPreferences((state) => state.compactSpacing)
  const setCompactSpacing = useUiPreferences((state) => state.setCompactSpacing)
  const [preview, setPreview] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<PreviewForm>({
    defaultValues: { previewLabel: '' },
  })

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-red-500">Frontend foundation</h1>
        <p>Technical integration verification only. No CRM operations or backend requests.</p>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={compactSpacing} onChange={(event) => setCompactSpacing(event.target.checked)} className="size-4 focus-visible:outline-2 focus-visible:outline-offset-4" />
        Compact spacing
      </label>
      <form noValidate onSubmit={handleSubmit(
        (values) => setPreview(values.previewLabel),
        () => setPreview(null),
      )} className="space-y-3">
        <label htmlFor="preview-label" className="block font-medium">Preview label.</label>
        <input id="preview-label" type="text" aria-invalid={Boolean(errors.previewLabel)} aria-describedby={errors.previewLabel ? 'preview-label-error' : undefined}
          {...register('previewLabel', {
            required: 'Enter a preview label.',
            maxLength: { value: 40, message: 'Use 40 characters or fewer.' },
          })}
          className="block w-full rounded border border-slate-500 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
        {errors.previewLabel && <p id="preview-label-error" role="alert" className="text-red-700">{errors.previewLabel.message}</p>}
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-4">Preview</button>
      </form>
      {preview !== null && <output className="block">Submitted preview: {preview}</output>}
    </div>
  )
}
