import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'

export function PresentationList({ presentations }) {
  if (presentations.length === 0) return null

  return (
    <>
      <h4 className="mt-5">Course Presentations</h4>
      <ListGroup className="mb-5">
        {presentations.map(p => (
          <ListGroup.Item
            key={p.id}
            className="d-flex justify-content-between align-items-center"
          >
            <a href={p.file} target="_blank" rel="noopener noreferrer">
              {p.title}
            </a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}

PresentationList.propTypes = {
  presentations: PropTypes.arrayOf(PropTypes.shape({
    id:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    file:  PropTypes.string.isRequired,
  })).isRequired,
}
