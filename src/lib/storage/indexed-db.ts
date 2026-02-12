// IndexedDB wrapper for offline storage

const DB_NAME = 'StudyHubDB'
const DB_VERSION = 1

export interface StudySession {
  id: string
  startTime: Date
  endTime: Date
  duration: number
  type: 'pomodoro' | 'custom'
  xpEarned: number
}

export interface Document {
  id: string
  name: string
  content: string
  uploadDate: Date
  summary?: string
}

class IndexedDBStore {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (typeof window === 'undefined') return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('recordings')) {
          db.createObjectStore('recordings', { keyPath: 'id' })
        }
      }
    })
  }

  async saveSession(session: StudySession): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessions'], 'readwrite')
      const store = transaction.objectStore('sessions')
      const request = store.add(session)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSessions(): Promise<StudySession[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessions'], 'readonly')
      const store = transaction.objectStore('sessions')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveDocument(document: Document): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['documents'], 'readwrite')
      const store = transaction.objectStore('documents')
      const request = store.add(document)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getDocuments(): Promise<Document[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['documents'], 'readonly')
      const store = transaction.objectStore('documents')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveRecording(id: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['recordings'], 'readwrite')
      const store = transaction.objectStore('recordings')
      const request = store.add({ id, blob, date: new Date() })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const dbStore = new IndexedDBStore()
