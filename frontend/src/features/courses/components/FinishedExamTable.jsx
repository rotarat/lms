import { Table, Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'

const getVariant = grade => {
  if (grade < 3) return 'danger'
  if (grade < 4) return 'warning'
  if (grade < 5) return 'info'
  return 'success'
}

export function FinishedExamTable({ exams }) {
  return (
    <Table hover>
      <thead>
        <tr>
          <th>Course</th>
          <th className="text-end">Grade</th>
        </tr>
      </thead>
      <tbody>
        {exams.map(at => (
          <tr key={at.id}>
            <td>{at.exam.course.title}</td>
            <td className="text-end">
              <Badge bg={getVariant(at.grade)}>
                { (at.grade / 20 + 2).toFixed(1) }
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

FinishedExamTable.propTypes = {
  exams: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    grade: PropTypes.number.isRequired,
    exam: PropTypes.shape({ course: PropTypes.shape({ title: PropTypes.string }) })
  })).isRequired
}
