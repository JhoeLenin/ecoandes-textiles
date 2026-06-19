import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { STORE } from '../data/products';
import toast from 'react-hot-toast';

export default function Contact() {
  const [msgLen, setMsgLen] = useState(0);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.reportValidity()) return;
    setSending(true);
    const form = e.target;
    try {
      await addDoc(collection(db, 'messages'), {
        name: form.nombre.value.trim(),
        email: form.email.value.trim(),
        subject: form.asunto.value.trim(),
        message: form.mensaje.value.trim(),
        createdAt: new Date().toISOString(),
      });
    } catch {
      // silent
    }
    form.reset();
    setMsgLen(0);
    setSending(false);
    toast.success('¡Mensaje enviado! Te responderemos pronto.');
  };

  return (
    <>
      <section className="page-hero">
        <h1>Contáctanos</h1>
        <p>Estamos para ayudarte</p>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <label>Nombre
              <input type="text" name="nombre" required maxLength={100} placeholder="Tu nombre" />
            </label>
            <label>Email
              <input type="email" name="email" required maxLength={120} placeholder="correo@ejemplo.com" />
            </label>
            <label>Asunto
              <input type="text" name="asunto" required maxLength={120} placeholder="¿Sobre qué nos escribes?" />
            </label>
            <label>Mensaje
              <textarea
                name="mensaje"
                rows="5"
                required
                maxLength={1000}
                placeholder="Escribe tu mensaje..."
                onChange={(e) => setMsgLen(e.target.value.length)}
              />
              <span className="char-count">{msgLen}/1000</span>
            </label>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>

          <div>
            <div className="contact-info-card">
              <h3>Datos de Contacto</h3>
              <ul>
                <li><i className="fa-solid fa-location-dot" /> Arequipa, Perú</li>
                <li><i className="fa-solid fa-phone" /> {STORE.phone}</li>
                <li><i className="fa-solid fa-envelope" /> {STORE.email}</li>
                <li><i className="fa-solid fa-clock" /> Lun - Sáb: 9:00 am - 6:00 pm</li>
              </ul>
              <a
                className="btn btn-whatsapp btn-block"
                href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent('Hola EcoAndes Textiles, quisiera información sobre sus productos')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-whatsapp" /> Escríbenos por WhatsApp
              </a>
            </div>

            <div className="map-placeholder">
              <i className="fa-solid fa-map-location-dot" />
              <span>Mapa — Arequipa, Perú</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
