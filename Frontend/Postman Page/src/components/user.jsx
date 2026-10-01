import { useEffect, useState } from 'react'
import axios from 'axios'
import './user.css'

const API_URL = '/api'

function User({ onSignOut }) {

  const [users, setUsers] = useState([])

  // get users
  async function getUsers() {

    try {

      const response = await axios.get(
        `${API_URL}/user`
      )

      setUsers(response.data.data)

    } catch (error) {

      console.log(error)

    }
  }

  // delete user
  async function deleteUser(id) {

    try {

      await axios.delete(
        `${API_URL}/user/${id}`
      )

      getUsers()

    } catch (error) {

      console.log(error)

    }
  }

  // update user
  async function updateUser(id) {

    const newName = prompt('Enter new name')
    const newEmail = prompt('Enter new email')

    if (!newName || !newEmail) {
      return
    }

    try {

      await axios.put(
        `${API_URL}/user/${id}`,
        {
          name: newName,
          email: newEmail
        }
      )

      getUsers()

    } catch (error) {

      console.log(error)

    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getUsers()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="dashboard-page">
      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Users</h1>
          </div>
          <button type="button" className="signout-button" onClick={onSignOut}>
            Sign out
          </button>
        </header>

      <div className="users-table-wrapper">
        <table className="users-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user.id}>

              <td>{user.id}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>
                <button className="update-button" onClick={() => updateUser(user.id)}>
                  Update
                </button>
              </td>

              <td>
                <button className="delete-button" onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

        </table>
      </div>

      </section>
    </main>
  )
}

export default User