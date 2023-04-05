import Head from 'next/head'
import { useState } from 'react'
import styles from './index.module.css'

export default function Home() {
  const [variableInput, setVariableInput] = useState('')
  const [caseInput, setCaseInput] = useState('')
  const [result, setResult] = useState()

  async function onSubmit(event) {
    event.preventDefault()
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ variable: variableInput, case: caseInput })
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }

      setResult(data.result)
      setVariableInput('')
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div>
      <Head>
        <title>Variable namer</title>
        <link rel="icon" href="/code.png" />
      </Head>

      <main className={styles.main}>
        <img src="/code.png" className={styles.icon} />
        <h3>Name my variable</h3>
        <blockquote>
          There are only two hard things in Computer Science: cache invalidation
          and naming things. Phil Karlton
        </blockquote>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="variable"
            placeholder="The result of an API call"
            value={variableInput}
            onChange={(e) => setVariableInput(e.target.value)}
          />
          <select
            name="casing"
            id="case-select"
            value={caseInput}
            onChange={(e) => setCaseInput(e.target.value)}
          >
            <option value="">Select casing</option>
            <option value="pascal">Pascal case</option>
            <option value="camel">Camel case</option>
            <option value="snake">Snake case</option>
            <option value="kebab">Kebab case</option>
          </select>

          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  )
}
