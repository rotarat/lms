import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

/**
 * A simple wrapper around <Modal> that:
 *  - is non-dismissable by outside click or ESC
 *  - can be fullScreen
 *  - allows overriding centered, size, dialogClassName, contentClassName
 *  - forwards `style` into the .modal-body
 */
export function PopupWindow({
  show,
  children,
  fullScreen = false,
  style = {},
  className = '',
  dialogClassName,
  contentClassName,
  ...modalProps
}) {
  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered={!fullScreen}
      size={fullScreen ? undefined : 'xl'}
      fullscreen={fullScreen}
      className={className}
      dialogClassName={dialogClassName}
      contentClassName={contentClassName}
      {...modalProps}
    >
      <div
        style={style}
      >
        {children}
      </div>
    </Modal>
  )
}

PopupWindow.propTypes = {
  show:            PropTypes.bool.isRequired,
  children:        PropTypes.node,
  fullScreen:      PropTypes.bool,
  style:           PropTypes.object,
  className:       PropTypes.string,
  dialogClassName: PropTypes.string,
  contentClassName:PropTypes.string,
}
