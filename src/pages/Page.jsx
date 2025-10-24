import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

function Page() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function getTodos() {
      const { data: todos, error } = await supabase.from('todos').select()

      if (error) {
        console.error('Error al obtener todos:', error)
        return
      }

      if (todos && todos.length > 0) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default Page
