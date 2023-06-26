import fs from 'node:fs/promises'
const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key]?.toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    let verificarDados = true

    if (rowIndex > -1) {
      const {title, description, update_at, completed_at} = data;
      if (this.#database[table][rowIndex]['completed_at'] === null && typeof completed_at !== 'undefined') {
        this.#database[table][rowIndex]['completed_at'] = completed_at;
        this.#persist()
        return verificarDados
      } else if (this.#database[table][rowIndex]['completed_at'] !== null && typeof completed_at !== 'undefined') {
        this.#database[table][rowIndex]['completed_at'] = null;
        this.#persist()
        return verificarDados
      } else {
        if (typeof title !== 'undefined') {
          this.#database[table][rowIndex]['title'] = title;
        }
    
        if (typeof description !== 'undefined') {
          this.#database[table][rowIndex]['description'] = description;
        }
        this.#database[table][rowIndex]['update_at'] = update_at;
    
        this.#persist()
        return verificarDados
      }
    } else {
      verificarDados = false;
      return verificarDados
    }

}

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}
