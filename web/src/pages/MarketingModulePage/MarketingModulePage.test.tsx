import { render } from '@redwoodjs/testing/web'

import MarketingModulePage from './MarketingModulePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MarketingModulePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MarketingModulePage />)
    }).not.toThrow()
  })
})
