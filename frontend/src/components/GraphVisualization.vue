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
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = 600;
  const height = 400;

  const svg = d3.select("#graph").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMinYMin meet");

  const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const root = d3.stratify<NodeData>()
    .id((d: NodeData) => d.name)
    .parentId((d: NodeData) => d.parent || null)(data);

  const treeLayout = d3.tree<NodeData>().size([width, height]);
  treeLayout(root);

  g.selectAll('line')
    .data(root.links())
    .enter()
    .append('line')
    .attr('x1', d => String(d.source.x))
    .attr('y1', d => String(d.source.y))
    .attr('x2', d => String(d.target.x))
    .attr('y2', d => String(d.target.y))
    .attr('stroke', 'black');

  const squareSize = 100;
  g.selectAll('rect')
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

  g.selectAll('text')
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
        <button class="btn-deselect" @click="deselectNode">Deselect</button>
    </div>
  </main>
</template>

<style>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 200px;
  background: #e57d7d;
  padding: 10px;
}
.btn-deselect {
  margin-top: 10px;
  padding: 5px 10px;
  background: #7d84e5;
  border-radius: 5px;
  cursor: pointer;
}
</style>
