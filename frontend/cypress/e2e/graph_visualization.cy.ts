describe('Graph Visualization Component', () => {
    it('loads and displays the graph', () => {
      cy.visit('http://localhost:4173');
  
      cy.intercept('GET', 'http://localhost:3000/api/data', { fixture: 'graphData.json' }).as('loadGraphData');
  
      // Wait for the API request to complete
      cy.wait('@loadGraphData');
  
      // Check if the graph container is present
      cy.get('#graph').should('exist');
    });
  });