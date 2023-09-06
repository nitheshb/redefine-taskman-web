import { render } from '@redwoodjs/testing/web'

import AdministrationTeamPage from './AdministrationTeamPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdministrationTeamPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdministrationTeamPage />)
    }).not.toThrow()
  })
})
