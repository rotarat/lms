import PropTypes from 'prop-types'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

export function PresentationDetailUI({ presentation }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div className="container mt-4">
      <h2>{presentation.title}</h2>
      {presentation.description && <p>{presentation.description}</p>}

      <div className="pdf-container mt-4">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={presentation.file}
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  )
}

PresentationDetailUI.propTypes = {
  presentation: PropTypes.shape({
    title:       PropTypes.string.isRequired,
    description: PropTypes.string,
    file:        PropTypes.string.isRequired
  }).isRequired,
}
