---
title: Dijkstra's Algorithm
---

- Solves the shortest path to X in a weighted graph
    - Think fastest path if each edge has a distance
    - Steps:
        1. Find the “cheapest” node. (The node you can get to in the least
        amount of time from the start)
        2. Update the costs of the neighbors of this node.
        3. Repeat for every node.
        4. Calculate the final path.

- A graph has a cycle if you can start at a node and end up back at it
    - Dijkstra's algorithm only works with directed, acyclic graphs
- Dijkstra's algorithm doesn't work with negative weight edges (look into [Bellman-Ford](https://web.stanford.edu/class/archive/cs/cs161/cs161.1168/lecture14.pdf))

## Implementation[^1]

- A graph can be implemented with a dictionary
- This requires three hash tables/dictionaries:
    - The graph (there will be a nested hash table that has the weights of the nodes)
    - Costs
    - Parents

### Algorithm

- Find the node with the lowest costs
- Get the costs and neighbors of that node
- Iterate through the neighbors and compare the costs
    - Mark the neighbor as processed at the end of the loop

[^1]: Bhargava, Aditya Y. Grokking Algorithms. Manning Publications, 2016.
