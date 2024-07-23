import GraphVisualization from './GraphVisualization.vue'

describe('<GraphVisualization />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(GraphVisualization)
  })
})