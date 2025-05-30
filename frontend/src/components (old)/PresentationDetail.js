import React, { useState, useEffect } from 'react'
import { useParams }                       from 'react-router-dom'
import { fetchPresentationById }           from '../api/presentations'

import { Worker, Viewer }                  from '@react-pdf-viewer/core'
import { defaultLayoutPlugin }             from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

import '../pages/PDFViewer.css'

export default function PresentationDetail() {
  const { id }                = useParams()
  const [item, setItem]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // only need one plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  useEffect(() => {
    setLoading(true)
    fetchPresentationById(id)
      .then(p => setItem(p))
      .catch(err => setError(err.response?.data || 'Load failed'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading…</p>
  if (error)   return <div className="alert alert-danger">{JSON.stringify(error)}</div>

  return (
    <div className="container mt-4">
      <h2>{item.title}</h2>
      {item.description && <p>{item.description}</p>}

      <div className="pdf-container">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={item.file}
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  )
}
