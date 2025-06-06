import { useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Form } from 'react-bootstrap'

export function ExamFormUI({ courseId, onSubmit, loading, error, successMessage }) {
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty]   = useState('Medium')
  const [keyConceptsRaw, setKeyConceptsRaw] = useState('')
  const [numQuestions, setNumQuestions]     = useState(10)
  const [duration, setDuration]             = useState(60)
  const [dueDate, setDueDate]               = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const key_concepts = keyConceptsRaw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    onSubmit({
      course: courseId,
      description,
      difficulty,
      key_concepts,
      num_questions: numQuestions,
      duration,
      due_date: dueDate,
    })
  }

  return (
    <div className="container mt-4">
      <h3>Create New Exam</h3>

      {error && (
        <Alert variant="danger">
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      )}

      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="examDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter exam description…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="examDifficulty">
          <Form.Label>Difficulty</Form.Label>
          <Form.Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="examKeyConcepts">
          <Form.Label>Key Concepts (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Loops, Recursion, Arrays"
            value={keyConceptsRaw}
            onChange={(e) => setKeyConceptsRaw(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="row mb-3">
          <div className="col">
            <Form.Label>Number of Questions</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={100}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              required
            />
          </div>
          <div className="col">
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={300}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
            />
          </div>
          <div className="col">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </Form.Group>

        <Button variant="success" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Create Exam'}
        </Button>
      </Form>
    </div>
  )
}

ExamFormUI.propTypes = {
  courseId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  successMessage: PropTypes.string,
}
