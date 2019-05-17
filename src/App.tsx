import React, { useState } from 'react'
import styled from 'styled-components'

import { ButtonEvent, OptionalElection } from './config/types'

import useStateAndLocalStorage from './hooks/useStateWithLocalStorage'

import LoadElectionScreen from './screens/LoadElectionScreen'

import './App.css'

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
  const [election, setElection] = useStateAndLocalStorage<OptionalElection>(
    'election',
    undefined
  )
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

  const reset = () => {
    setPrecinct('')
    setBallot('')
  }
  const programCard = () => {
    const code: string = `VX.${precinct}.${ballot}`
    fetch('/card/write', {
      method: 'post',
      body: JSON.stringify({ code }),
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
      .catch(() => {
        // TODO: UI Notification if unable to write to card
        // https://github.com/votingworks/bas/issues/10
        console.log(code) // eslint-disable-line no-console
        reset()
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
          {election.ballotStyles
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
          {election.precincts.map(p => (
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
        <LoadElectionScreen setElection={setElection} />
      </Content>
    </Body>
  )
}

export default App
