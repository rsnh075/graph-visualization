<script lang="ts">
    export default {
        inheritAttrs: false,
        customOptions: {
            name: "GraphVisualization",
        }
    }
</script>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import * as d3 from 'd3';

  interface NodeData {
    name: string;
    description: string;
    parent?: string;
  }

  const graphData = ref<NodeData[] | null>(null);
  const selectedNode = ref<NodeData | null>(null);

  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/data');
      graphData.value = response.data.data;
      console.log('graphData.value', graphData.value);
      createGraph();
    } catch (error) {
      console.error(error);
    }
  });

  const createGraph = () => {
    if (!graphData.value) return;
    
    const data = graphData.value;
    const margin = { top: 50, right: 0, bottom: 0, left: 50 };
    const svgWidth = 600 + margin.left + margin.right;
    const svgHeight = 600 + margin.top + margin.bottom;

    const svg = d3.select("#graph").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.stratify<NodeData>()
      .id((d: NodeData) => d.name)
      .parentId((d: NodeData) => d.parent || null)(data);

    const treeLayout = d3.tree<NodeData>().size([600, 400]);
    treeLayout(root);

    svg.selectAll('line')
      .data(root.links())
      .enter()
      .append('line')
      .attr('x1', d => String(d.source.x))
      .attr('y1', d => String(d.source.y))
      .attr('x2', d => String(d.target.x))
      .attr('y2', d => String(d.target.y))
      .attr('stroke', 'black');

    const squareSize = 100;
    svg.selectAll('rect')
      .data(root.descendants())
      .enter()
      .append('rect')
      .attr('x', d => d.x ? d.x - squareSize / 2 : 0)
      .attr('y', d => (d.y ?? 0) - squareSize / 2)
      .attr('width', squareSize)
      .attr('height', squareSize)
      .attr('fill', 'aquamarine')
      .on('click', (event, d) => {
        selectedNode.value = d.data;
      })
      .on('mouseover', (event) => {
        d3.select(event.target).attr('fill', 'lightblue');
        d3.select(event.target).style('cursor', 'pointer');
      })
      .on('mouseout', (event) => {
        d3.select(event.target).attr('fill', 'aquamarine');
        d3.select(event.target).style('cursor', 'default');
      });

    svg.selectAll('text')
      .data(root.descendants())
      .enter()
      .append('text')
      .attr('x', d => String(d.x))
      .attr('y', d => (d.y ?? 0) + 5)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => d.data.name);
  };

  const deselectNode = () => {
    selectedNode.value = null;
  };
</script>

<template>
  <main>
    <div id="graph"></div>
    <div v-if="selectedNode" class="sidebar">
        <h2>{{ selectedNode.name }}</h2>
        <p>{{ selectedNode.description }}</p>
        <button @click="deselectNode">Deselect</button>
    </div>
  </main>
</template>

<style>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 200px;
  background: #f4f4f4;
  padding: 10px;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
</style>
