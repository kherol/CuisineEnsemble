import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function Chat() {
  const { mealId } = useParams()
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try { setMessages(await apiFetch(`/chat/meals/${mealId}`)) } catch (err) { setError(err.message) }
  }
  useEffect(() => { load() }, [mealId])

  async function send(e) {
    e.preventDefault()
    await apiFetch(`/chat/meals/${mealId}`, { method: 'POST', body: JSON.stringify({ content }) })
    setContent('')
    load()
  }

  return (
    <div>
      <h1 className="h3 mb-3">Chat du repas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="chat-box mb-3">
        {messages.map(m => <div key={m.id} className="mb-2"><strong>{m.sender?.name || 'Utilisateur'} :</strong> {m.content}<br /><small className="text-muted">{new Date(m.created_at).toLocaleString()}</small></div>)}
      </div>
      <form className="d-flex gap-2" onSubmit={send}>
        <input className="form-control" value={content} onChange={e => setContent(e.target.value)} placeholder="Écrire un message..." required />
        <button className="btn btn-success">Envoyer</button>
      </form>
    </div>
  )
}
