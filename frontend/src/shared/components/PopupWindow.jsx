// src/shared/components/PopupWindow.jsx
import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

/**
 * A simple wrapper around <Modal> that:
 *  - is non-dismissable by outside click or ESC
 *  - can be fullScreen
 *  - forwards `style` into the .modal-body
 */
export function PopupWindow({
  show,
  children,
  fullScreen = false,
  style = {},
}) {
  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
      fullscreen={fullScreen}
      size="xl"
      contentClassName="overflow-hidden"
      dialogClassName="blur-backdrop"
    >
      <div className="modal-body p-4" style={style}>
        {children}
      </div>
    </Modal>
  )
}

PopupWindow.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.node,
  fullScreen: PropTypes.bool,
  style: PropTypes.object,
}
