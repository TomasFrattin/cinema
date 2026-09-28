import { useEffect, useRef } from 'react'

function Modal({ title, onClose, children, className = '' }) {
  const closeButtonRef = useRef(null)
  const titleId = 'site-modal-title'

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={`modal ${className}`.trim()} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            ref={closeButtonRef}
            className="modal-close"
            type="button"
            aria-label="Cerrar ventana"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
