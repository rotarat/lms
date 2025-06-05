import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

export function PopupWindow({ show, children }) {
  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
      size="xl"
      contentClassName="overflow-hidden"
      dialogClassName="blur-backdrop"
    >
      <div className="modal-body" style={{ padding: '33px' }}>
        {children}
      </div>
    </Modal>
  )
}

PopupWindow.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.node
}
