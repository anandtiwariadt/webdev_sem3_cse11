import { useState } from 'react'
import axios from 'axios'
import './signup.css'

const API_URL = '/api'

function Signup({ onSignupSuccess }) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    try {

      if (password.length < 6) {
        alert('Password must be at least 6 characters')
        return
      }

      await axios.post(`${API_URL}/create`, {
        name: name,
        email: email,
        password: password
      })

      alert('Signup successful')

      setName('')
      setEmail('')
      setPassword('')

      onSignupSuccess()

    } catch (error) {

      console.log(error)
      alert(error.response?.data?.error || 'Unable to connect to the backend server')

    }
  }

  return (
    <main className="signup-page">

      <section className="signup-card">
        <div className="signup-intro">
          <h1>Create your account</h1>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>

          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter at least 6 characters"
            minLength="6"
            required
          />

          <button type="submit">
            Sign Up
          </button>

        </form>

      </section>
    </main>
  )
}

export default Signup