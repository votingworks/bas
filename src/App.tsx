import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

import './App.css'

import electionSample from './data/electionSample.json'

type Election = typeof electionSample | undefined

type ButtonEvent = React.MouseEvent<HTMLButtonElement>

const Body = styled.div`
  background: #ad7af7;
  height: 100%;
  padding: 2rem;
`
const Content = styled.div`
  background: #c8a9f5;
  padding: 2rem;
`

const App: React.FC = () => {
  const [election, setElection] = useState(undefined)
  const [precinct, setPrecinct] = useState('')
  const updatePrecinct = (event: ButtonEvent) => {
    const { id = '' } = (event.target as HTMLElement).dataset
    setPrecinct(id)
  }
  const [ballot, setBallot] = useState('')
  const updateBallot = (event: ButtonEvent) => {
    const { id = '' } = (event.target as HTMLElement).dataset
    setBallot(id)
  }
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = () => {
        setElection(JSON.parse(reader.result as string))
      }
      reader.readAsText(file)
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const reset = () => {
    setPrecinct('')
    setBallot('')
  }
  const programCard = () => {
    fetch('/card/write', {
      method: 'post',
      body: JSON.stringify({ code: `VX.${precinct}.${ballot}` }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          // TODO: better notification of success
          // https://github.com/votingworks/bas/issues/7
          reset()
        }
      })
  }
  if (precinct && ballot) {
    return (
      <Body>
        <Content>
          <h1>Activation Code</h1>
          <p>
            <button onClick={reset} type="button">
              Reset
            </button>
          </p>
          <p>{`{ ballot: ${ballot}, precinct: ${precinct} }`}</p>
          <p>
            <button onClick={programCard} type="button">
              Program Card
            </button>
          </p>
        </Content>
      </Body>
    )
  }
  if (election && precinct) {
    return (
      <Body>
        <Content>
          <h1>Ballot Styles</h1>
          <p>
            <button onClick={reset} type="button">
              Reset
            </button>
          </p>
          {(election as Election)!.ballotStyles
            .filter(b => b.precincts.find(p => p === precinct))
            .map(ballot => (
              <div key={ballot.id}>
                <button
                  data-id={ballot.id}
                  onClick={updateBallot}
                  type="button"
                >
                  {ballot.id}
                </button>
              </div>
            ))}
        </Content>
      </Body>
    )
  }
  if (election) {
    return (
      <Body>
        <Content>
          <h1>Precincts</h1>
          {(election as Election)!.precincts.map(p => (
            <div key={p.id}>
              <button data-id={p.id} onClick={updatePrecinct} type="button">
                {p.name}
              </button>
            </div>
          ))}
        </Content>
      </Body>
    )
  }

  return (
    <Body>
      <Content>
        <h1>Load Election</h1>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag and drop election file here</p>
          )}
        </div>
      </Content>
    </Body>
  )
}

export default App
