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
    const svg = d3.select("#graph").append("svg")
      .attr("width", 600)
      .attr("height", 600);

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

    svg.selectAll('circle')
      .data(root.descendants())
      .enter()
      .append('circle')
      .attr('cx', d => String(d.x))
      .attr('cy', d => String(d.y))
      .attr('r', 5)
      .attr('fill', 'blue')
      .on('click', (event, d) => {
        selectedNode.value = d.data;
      });

    svg.selectAll('text')
      .data(root.descendants())
      .enter()
      .append('text')
      .attr('x', d => d.x ? d.x + 10 : 0)
      .attr('y', d => String(d.y))
      .text(d => d.data.name);
  };

  const deselectNode = () => {
    selectedNode.value = null;
  };
</script>

<template>
  <div id="app">
    <div id="graph"></div>
    <div v-if="selectedNode" class="sidebar">
      <h2>{{ selectedNode.name }}</h2>
      <p>{{ selectedNode.description }}</p>
      <button @click="deselectNode">Deselect</button>
    </div>
  </div>
</template>

<style>
.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 200px;
  background: #f4f4f4;
  padding: 10px;
  border-left: 1px solid #ccc;
}
</style>
