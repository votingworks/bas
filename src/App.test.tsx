import React from 'react'
import fetchMock from 'fetch-mock'
// import { advanceBy } from 'jest-date-mock'

import { electionSample as election } from '@votingworks/ballot-encoder'

import {
  fireEvent,
  render,
  wait,
  // within,
} from '@testing-library/react'
// import fetchMock from 'fetch-mock'

import App from './App'

import withMarkup from '../test/helpers/withMarkup'

import {
  adminCard,
  advanceTimers,
  // advanceTimersAndPromises,
  blankCard,
  // getAlternateNewVoterCard,
  // getNewVoterCard,
  // getUsedVoterCard,
  noCard,
  pollWorkerCard,
} from '../test/helpers/smartcards'
import { CARD_SHORT_VALUE_WRITE_DELAY } from './config/globals'

let currentCard = noCard
fetchMock.get('/card/read', () => JSON.stringify(currentCard))

fetchMock.post('/card/write', (url, options) => {
  // console.log('options.body', options.body)
  currentCard = {
    present: true,
    shortValue: options.body as string,
  }
  return { success: true }
})

fetchMock.get('/card/read_long', () =>
  JSON.stringify({ longValue: JSON.stringify(election) })
)

fetchMock.post('/card/write_long_b64', () => JSON.stringify({ status: 'ok' }))

beforeEach(() => {
  window.localStorage.clear()
  window.location.href = '/'
})

it('VxEncode End-to-End flow', async () => {
  jest.useFakeTimers()

  const {
    // debug,
    getByText,
  } = render(<App />)
  const getByTextWithMarkup = withMarkup(getByText)

  currentCard = noCard
  advanceTimers()

  // Default Unconfigured
  getByText('Not Configured')
  getByText('Insert Election Clerk card.')

  // ---------------

  // Configure with Admin Card - all precincts
  currentCard = adminCard
  advanceTimers()
  await wait()

  fireEvent.click(getByText('Load Election Definition'))
  getByText('Loading Election Definition from Clerk Card…')

  await wait(() => getByText('Election definition is loaded.'))

  currentCard = noCard
  advanceTimers()
  await wait()

  getByText('Screen Locked')
  getByText('Insert Poll Worker card.')

  // ---------------

  // Open Polls with Poll Worker Card
  currentCard = pollWorkerCard
  advanceTimers()
  await wait()

  getByText('Screen Unlocked')
  getByText('Remove Poll Worker card to continue.')
  getByText('Lock')

  currentCard = noCard
  advanceTimers()
  await wait()

  getByText('Insert Voter Card')

  // ---------------

  // Insert Blank Voter Card to see all precincts
  currentCard = blankCard
  advanceTimers()
  await wait()
  getByTextWithMarkup('Precincts for Franklin County')

  // View a precinct
  fireEvent.click(getByText('Center Springfield'))
  getByText('12')

  // Return to All Precincts
  fireEvent.click(getByText('All Precincts'))
  getByTextWithMarkup('Precincts for Franklin County')

  // View another precinct
  fireEvent.click(getByText('North Springfield'))
  getByTextWithMarkup('Ballot Styles for North Springfield')
  getByText('5')

  // Select ballot style
  fireEvent.click(getByText('12'))

  // View programming card… screen
  getByText('Programming card…')
  getByText('North Springfield / 12')

  // View remove card screen
  advanceTimers(CARD_SHORT_VALUE_WRITE_DELAY / 1000)
  await wait()
  // TODO: determine why there is an additional render here.
  advanceTimers(CARD_SHORT_VALUE_WRITE_DELAY / 1000)
  await wait()
  getByText('Hand Card to Voter')
  getByText('North Springfield / 12')

  // Remove card
  currentCard = noCard
  advanceTimers()
  await wait()
  getByText('Insert Voter Card')

  // debug()
})
