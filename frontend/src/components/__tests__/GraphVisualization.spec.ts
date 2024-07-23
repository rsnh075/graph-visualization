import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GraphVisualization from '@/components/GraphVisualization.vue'

describe('GraphVisualization', () => {
  it('renders a div with id="graph"', () => {
    const wrapper = mount(GraphVisualization)
    const graphDiv = wrapper.find('#graph')
    expect(graphDiv.exists()).toBe(true)
  })
})