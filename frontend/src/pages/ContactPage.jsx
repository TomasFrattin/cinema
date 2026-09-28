import { useState } from 'react'

function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setFormSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <main className="contact-page" id="contacto">
      <p className="eyebrow">CONTACTO</p>
      <h1>Queremos escucharte</h1>
      <p className="contact-intro">
        Nos gustaría conocer tu experiencia. Cualquier consulta o duda que tengas, podés escribirnos.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-fields">
          <label className="contact-field">
            Nombre
            <input type="text" name="name" autoComplete="name" required />
          </label>
          <label className="contact-field">
            Email
            <input type="email" name="email" autoComplete="email" required />
          </label>
        </div>
        <label className="contact-field">
          Mensaje
          <textarea name="message" rows="6" required />
        </label>
        <button className="contact-submit" type="submit">Enviar mensaje</button>
        {formSubmitted && (
          <p className="contact-success" role="status">
            Gracias por escribirnos. Recibimos tu mensaje.
          </p>
        )}
      </form>

      <section className="contact-location" aria-labelledby="location-title">
        <p className="eyebrow">DÓNDE ENCONTRARNOS</p>
        <h2 id="location-title">Nuestra ubicación</h2>
        <p className="contact-address">Libertador · Buenos Aires 2431 · Casilda · Santa Fe</p>
        <div className="map-frame">
          <iframe
            title="Mapa de la ubicación del cine Libertador"
            src="https://www.google.com/maps?q=Buenos+Aires+2431,+Casilda,+Santa+Fe,+Argentina&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  )
}

export default ContactPage