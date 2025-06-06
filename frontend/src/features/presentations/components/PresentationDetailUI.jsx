import PropTypes from 'prop-types'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Button } from '../../../shared/components/Button'

export function PresentationDetailUI({ presentation, onClose }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div className="container position-relative" style={{ paddingTop: '5px' }}>
      {/* Top‐right “×” close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          right: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          lineHeight: 1,
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        &times;
      </button>

      {/* Title and optional description */}
      <h2 className="mt-2">{presentation.title}</h2>
      {presentation.description && <p>{presentation.description}</p>}

      {/* PDF viewer (no fixed height / no overflow styling) */}
      <div className="pdf-container mt-4">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={presentation.file}
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>

      {/* Bottom “Close” button */}
      <div className="d-flex justify-content-center mt-3">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

PresentationDetailUI.propTypes = {
  presentation: PropTypes.shape({
    title:       PropTypes.string.isRequired,
    description: PropTypes.string,
    file:        PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}
