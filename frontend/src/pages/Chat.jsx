import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function Chat() {
  const { mealId } = useParams()
  const [meal, setMeal] = useState(null)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  async function load() {
    setError('')
    try {
      const [mealData, messagesData] = await Promise.all([
        apiFetch(`/meals/${mealId}`),
        apiFetch(`/chat/meals/${mealId}`),
      ])
      setMeal(mealData)
      setMessages(messagesData)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
  }, [mealId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError('')
    try {
      await apiFetch(`/chat/meals/${mealId}`, {
        method: 'POST',
        body: JSON.stringify({ content: content.trim() }),
      })
      setContent('')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <span className="badge rounded-pill badge-soft mb-2">Chat de groupe</span>
          <h1 className="fw-bold mb-1">{meal?.title || 'Chat du repas'}</h1>
          <p className="text-muted mb-0">Coordonne l’organisation avec l’hôte et les participants acceptés.</p>
        </div>
        <Link className="btn btn-outline-success" to={`/repas/${mealId}`}>Retour au repas</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="chat-box connected-chat">
            {messages.length === 0 ? (
              <div className="text-center text-muted py-5">Aucun message pour l’instant.</div>
            ) : (
              messages.map((message) => (
                <div className="chat-message" key={message.id}>
                  <div className="d-flex justify-content-between gap-3">
                    <strong>{message.sender?.name || 'Utilisateur'}</strong>
                    <small className="text-muted">{new Date(message.created_at).toLocaleString('fr-FR')}</small>
                  </div>
                  <p className="mb-0">{message.content}</p>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form className="chat-form" onSubmit={send}>
            <input className="form-control" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Écrire un message..." required />
            <button className="btn btn-success" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
