import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { dataProvider } from './utils/data-atual.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body 

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: dataProvider(),
        update_at: null
      }

      database.insert('tasks', task)
      return res.writeHead(201).end(JSON.stringify({ message: 'Registro criado com sucesso' }))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(404).end()
      }

      const update = database.update('tasks', id, {
        title,
        description,
        update_at: dataProvider()
      })
      if (update) {
        return res.writeHead(204).end(JSON.stringify({ message: 'Registro atualizado com sucesso' }))
      } else {
        return res.writeHead(404).end(JSON.stringify({ message: 'Não há registro com esse ID' }))
      }

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const update = database.update('tasks', id, {
        completed_at: dataProvider()
      })
      if (update) {
        return res.writeHead(204).end(JSON.stringify({ message: 'Registro atualizado com sucesso' }))
      } else {
        return res.writeHead(404).end(JSON.stringify({ message: 'Não há registro com esse ID' }))
      }

    }
  }

]
