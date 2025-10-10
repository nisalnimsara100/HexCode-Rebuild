/**
 * Comprehensive Graph Data Structure Implementation in TypeScript
 * Supports both directed and undirected graphs with advanced algorithms
 */

export interface Edge<T> {
  from: T;
  to: T;
  weight?: number;
  type?: string;
}

export interface GraphNode<T> {
  id: T;
  data?: any;
  visited?: boolean;
  distance?: number;
  parent?: T | null;
}

export class Graph<T> {
  private adjacencyList: Map<T, Set<T>> = new Map();
  private nodes: Map<T, GraphNode<T>> = new Map();
  private edges: Edge<T>[] = [];
  private directed: boolean;
  private weighted: boolean;

  constructor(directed = true, weighted = false) {
    this.directed = directed;
    this.weighted = weighted;
  }

  /**
   * Add a node to the graph
   */
  addNode(id: T, data?: any): void {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, data, visited: false });
      this.adjacencyList.set(id, new Set());
    }
  }

  /**
   * Add an edge between two nodes
   */
  addEdge(from: T, to: T, weight = 1, type = 'default'): void {
    // Ensure both nodes exist
    this.addNode(from);
    this.addNode(to);

    // Add to adjacency list
    this.adjacencyList.get(from)?.add(to);
    
    // For undirected graphs, add reverse edge
    if (!this.directed) {
      this.adjacencyList.get(to)?.add(from);
    }

    // Store edge information
    this.edges.push({ from, to, weight, type });
  }

  /**
   * Remove a node and all its edges
   */
  removeNode(id: T): void {
    if (!this.nodes.has(id)) return;

    // Remove all edges connected to this node
    this.edges = this.edges.filter(edge => edge.from !== id && edge.to !== id);

    // Remove from adjacency list
    this.adjacencyList.delete(id);
    
    // Remove references from other nodes
    for (const neighbors of this.adjacencyList.values()) {
      neighbors.delete(id);
    }

    // Remove the node
    this.nodes.delete(id);
  }

  /**
   * Remove an edge between two nodes
   */
  removeEdge(from: T, to: T): void {
    this.adjacencyList.get(from)?.delete(to);
    if (!this.directed) {
      this.adjacencyList.get(to)?.delete(from);
    }
    this.edges = this.edges.filter(edge => 
      !(edge.from === from && edge.to === to) &&
      (!this.directed ? !(edge.from === to && edge.to === from) : true)
    );
  }

  /**
   * Get all neighbors of a node
   */
  getNeighbors(id: T): T[] {
    return Array.from(this.adjacencyList.get(id) || []);
  }

  /**
   * Get all nodes in the graph
   */
  getNodes(): GraphNode<T>[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get all edges in the graph
   */
  getEdges(): Edge<T>[] {
    return [...this.edges];
  }

  /**
   * Get a specific node
   */
  getNode(id: T): GraphNode<T> | undefined {
    return this.nodes.get(id);
  }

  /**
   * Check if an edge exists between two nodes
   */
  hasEdge(from: T, to: T): boolean {
    return this.adjacencyList.get(from)?.has(to) || false;
  }

  /**
   * Get the in-degree of a node (number of incoming edges)
   */
  getInDegree(id: T): number {
    return this.edges.filter(edge => edge.to === id).length;
  }

  /**
   * Get the out-degree of a node (number of outgoing edges)
   */
  getOutDegree(id: T): number {
    return this.adjacencyList.get(id)?.size || 0;
  }

  /**
   * Reset all node states (visited, distance, parent)
   */
  resetNodes(): void {
    for (const node of this.nodes.values()) {
      node.visited = false;
      node.distance = Infinity;
      node.parent = null;
    }
  }

  /**
   * Depth-First Search (DFS) traversal
   */
  dfs(startId: T, callback?: (node: GraphNode<T>) => void): T[] {
    this.resetNodes();
    const result: T[] = [];
    const stack: T[] = [startId];
    const visited = new Set<T>();

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      
      if (!visited.has(currentId)) {
        visited.add(currentId);
        const node = this.nodes.get(currentId);
        
        if (node) {
          node.visited = true;
          result.push(currentId);
          if (callback) callback(node);
        }

        // Add neighbors to stack (in reverse order for consistent ordering)
        const neighbors = this.getNeighbors(currentId);
        for (let i = neighbors.length - 1; i >= 0; i--) {
          if (!visited.has(neighbors[i])) {
            stack.push(neighbors[i]);
          }
        }
      }
    }

    return result;
  }

  /**
   * Breadth-First Search (BFS) traversal
   */
  bfs(startId: T, callback?: (node: GraphNode<T>) => void): T[] {
    this.resetNodes();
    const result: T[] = [];
    const queue: T[] = [startId];
    const visited = new Set<T>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      if (!visited.has(currentId)) {
        visited.add(currentId);
        const node = this.nodes.get(currentId);
        
        if (node) {
          node.visited = true;
          result.push(currentId);
          if (callback) callback(node);
        }

        // Add neighbors to queue
        const neighbors = this.getNeighbors(currentId);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
    }

    return result;
  }

  /**
   * Topological Sort using Kahn's Algorithm (for DAGs only)
   */
  topologicalSort(): T[] | null {
    if (!this.directed) {
      throw new Error("Topological sort is only applicable to directed graphs");
    }

    const inDegree = new Map<T, number>();
    const result: T[] = [];
    const queue: T[] = [];

    // Initialize in-degrees
    for (const nodeId of this.nodes.keys()) {
      inDegree.set(nodeId, this.getInDegree(nodeId));
    }

    // Find nodes with no incoming edges
    for (const [nodeId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    // Process nodes
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      // Reduce in-degree of neighbors
      for (const neighbor of this.getNeighbors(current)) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    // Check if all nodes are included (no cycles)
    return result.length === this.nodes.size ? result : null;
  }

  /**
   * Find shortest path using Dijkstra's algorithm
   */
  dijkstra(startId: T, endId: T): { path: T[], distance: number } | null {
    if (!this.weighted) {
      console.warn("Dijkstra's algorithm is designed for weighted graphs");
    }

    this.resetNodes();
    const distances = new Map<T, number>();
    const previous = new Map<T, T | null>();
    const unvisited = new Set<T>();

    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, nodeId === startId ? 0 : Infinity);
      previous.set(nodeId, null);
      unvisited.add(nodeId);
    }

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current: T | null = null;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        const distance = distances.get(nodeId) || Infinity;
        if (distance < minDistance) {
          minDistance = distance;
          current = nodeId;
        }
      }

      if (current === null || minDistance === Infinity) break;

      unvisited.delete(current);

      if (current === endId) break;

      // Update distances to neighbors
      for (const neighbor of this.getNeighbors(current)) {
        if (unvisited.has(neighbor)) {
          const edge = this.edges.find(e => e.from === current && e.to === neighbor);
          const weight = edge?.weight || 1;
          const newDistance = minDistance + weight;
          
          if (newDistance < (distances.get(neighbor) || Infinity)) {
            distances.set(neighbor, newDistance);
            previous.set(neighbor, current);
          }
        }
      }
    }

    // Reconstruct path
    const path: T[] = [];
    let current: T | null = endId;
    
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }

    const distance = distances.get(endId) || Infinity;
    return distance !== Infinity ? { path, distance } : null;
  }

  /**
   * Detect cycles in the graph
   */
  hasCycle(): boolean {
    if (this.directed) {
      return this.topologicalSort() === null;
    } else {
      // For undirected graphs, use DFS
      this.resetNodes();
      const visited = new Set<T>();
      
      for (const nodeId of this.nodes.keys()) {
        if (!visited.has(nodeId)) {
          if (this.dfsHasCycle(nodeId, null, visited)) {
            return true;
          }
        }
      }
      return false;
    }
  }

  private dfsHasCycle(nodeId: T, parent: T | null, visited: Set<T>): boolean {
    visited.add(nodeId);
    
    for (const neighbor of this.getNeighbors(nodeId)) {
      if (!visited.has(neighbor)) {
        if (this.dfsHasCycle(neighbor, nodeId, visited)) {
          return true;
        }
      } else if (neighbor !== parent) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Find strongly connected components (for directed graphs)
   */
  stronglyConnectedComponents(): T[][] {
    if (!this.directed) {
      throw new Error("SCC is only applicable to directed graphs");
    }

    const visited = new Set<T>();
    const stack: T[] = [];
    
    // First DFS to fill stack
    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        this.fillOrder(nodeId, visited, stack);
      }
    }

    // Create transpose graph
    const transpose = this.transpose();
    visited.clear();
    const components: T[][] = [];

    // Process nodes in reverse topological order
    while (stack.length > 0) {
      const nodeId = stack.pop()!;
      if (!visited.has(nodeId)) {
        const component: T[] = [];
        transpose.dfsCollect(nodeId, visited, component);
        components.push(component);
      }
    }

    return components;
  }

  private fillOrder(nodeId: T, visited: Set<T>, stack: T[]): void {
    visited.add(nodeId);
    for (const neighbor of this.getNeighbors(nodeId)) {
      if (!visited.has(neighbor)) {
        this.fillOrder(neighbor, visited, stack);
      }
    }
    stack.push(nodeId);
  }

  private transpose(): Graph<T> {
    const transposed = new Graph<T>(true, this.weighted);
    
    // Add all nodes
    for (const [nodeId, node] of this.nodes.entries()) {
      transposed.addNode(nodeId, node.data);
    }
    
    // Add reversed edges
    for (const edge of this.edges) {
      transposed.addEdge(edge.to, edge.from, edge.weight, edge.type);
    }
    
    return transposed;
  }

  private dfsCollect(nodeId: T, visited: Set<T>, component: T[]): void {
    visited.add(nodeId);
    component.push(nodeId);
    
    for (const neighbor of this.getNeighbors(nodeId)) {
      if (!visited.has(neighbor)) {
        this.dfsCollect(neighbor, visited, component);
      }
    }
  }

  /**
   * Get graph statistics
   */
  getStats(): {
    nodeCount: number;
    edgeCount: number;
    directed: boolean;
    weighted: boolean;
    density: number;
    hasCycles: boolean;
  } {
    const nodeCount = this.nodes.size;
    const edgeCount = this.edges.length;
    const maxEdges = this.directed ? nodeCount * (nodeCount - 1) : (nodeCount * (nodeCount - 1)) / 2;
    const density = maxEdges > 0 ? edgeCount / maxEdges : 0;

    return {
      nodeCount,
      edgeCount,
      directed: this.directed,
      weighted: this.weighted,
      density,
      hasCycles: this.hasCycle()
    };
  }

  /**
   * Convert graph to JSON representation
   */
  toJSON(): {
    nodes: { id: T; data?: any }[];
    edges: Edge<T>[];
    directed: boolean;
    weighted: boolean;
  } {
    return {
      nodes: Array.from(this.nodes.entries()).map(([id, node]) => ({
        id,
        data: node.data
      })),
      edges: this.edges,
      directed: this.directed,
      weighted: this.weighted
    };
  }

  /**
   * Load graph from JSON representation
   */
  static fromJSON<T>(json: {
    nodes: { id: T; data?: any }[];
    edges: Edge<T>[];
    directed: boolean;
    weighted: boolean;
  }): Graph<T> {
    const graph = new Graph<T>(json.directed, json.weighted);
    
    // Add nodes
    for (const node of json.nodes) {
      graph.addNode(node.id, node.data);
    }
    
    // Add edges
    for (const edge of json.edges) {
      graph.addEdge(edge.from, edge.to, edge.weight, edge.type);
    }
    
    return graph;
  }
}