"""
Bellman-Ford Algorithm for Task Scheduling
Resolves task dependencies and calculates optimal start times
Detects circular dependencies
Time Complexity: O(V*E) where V = tasks, E = dependencies
"""

import sys
from typing import List, Dict, Tuple

class Task:
    def __init__(self, task_id: int, name: str, start_time: float, 
                 finish_time: float, profit: float, priority: str, dependencies: List[int]):
        self.id = task_id
        self.name = name
        self.start_time = start_time
        self.finish_time = finish_time
        self.duration = finish_time - start_time
        self.profit = profit
        self.priority = priority
        self.dependencies = dependencies
        self.optimal_start = start_time
        
    def __repr__(self):
        return f"Task({self.id}, {self.name}, {self.start_time}-{self.finish_time})"


class TaskScheduler:
    def __init__(self, tasks: List[Task]):
        self.tasks = tasks
        self.n = len(tasks)
        self.graph = self._build_dependency_graph()
        
    def _build_dependency_graph(self) -> Dict[int, List[Tuple[int, float]]]:
        """Build a graph where edges represent dependencies"""
        graph = {task.id: [] for task in self.tasks}
        
        for task in self.tasks:
            for dep_id in task.dependencies:
                # Add edge from dependency to task with weight = task duration
                if dep_id in graph:
                    graph[dep_id].append((task.id, task.duration))
        
        return graph
    
    def detect_circular_dependency(self) -> Tuple[bool, List[int]]:
        """
        Detect if there's a circular dependency using DFS
        Returns: (has_cycle, cycle_path)
        """
        WHITE, GRAY, BLACK = 0, 1, 2
        color = {task.id: WHITE for task in self.tasks}
        parent = {task.id: None for task in self.tasks}
        cycle = []
        
        def dfs(node):
            color[node] = GRAY
            
            for neighbor, _ in self.graph.get(node, []):
                if color[neighbor] == GRAY:
                    # Found a cycle
                    cycle.append(neighbor)
                    current = node
                    while current != neighbor:
                        cycle.append(current)
                        current = parent[current]
                    cycle.append(neighbor)
                    return True
                    
                if color[neighbor] == WHITE:
                    parent[neighbor] = node
                    if dfs(neighbor):
                        return True
            
            color[node] = BLACK
            return False
        
        for task in self.tasks:
            if color[task.id] == WHITE:
                if dfs(task.id):
                    return True, cycle[::-1]
        
        return False, []
    
    def bellman_ford(self, source_id: int = 0) -> Dict[int, float]:
        """
        Apply Bellman-Ford algorithm to find optimal start times
        considering dependencies
        """
        # Initialize distances
        distance = {task.id: float('inf') for task in self.tasks}
        distance[source_id] = 0
        
        # Relax edges V-1 times
        for _ in range(self.n - 1):
            for task_id in self.graph:
                if distance[task_id] != float('inf'):
                    for neighbor, weight in self.graph[task_id]:
                        if distance[task_id] + weight < distance[neighbor]:
                            distance[neighbor] = distance[task_id] + weight
        
        # Check for negative weight cycles (shouldn't happen in task scheduling)
        for task_id in self.graph:
            for neighbor, weight in self.graph[task_id]:
                if distance[task_id] + weight < distance[neighbor]:
                    print("Warning: Negative cycle detected!")
                    return None
        
        return distance
    
    def calculate_optimal_schedule(self) -> List[Task]:
        """
        Calculate optimal start times for all tasks considering dependencies
        """
        # First, check for circular dependencies
        has_cycle, cycle = self.detect_circular_dependency()
        if has_cycle:
            print(f"ERROR: Circular dependency detected: {' -> '.join(map(str, cycle))}")
            return None
        
        # Use topological ordering to schedule tasks
        scheduled = []
        task_dict = {task.id: task for task in self.tasks}
        completion_time = {}
        
        # Calculate earliest start time for each task
        def calculate_earliest_start(task_id):
            if task_id in completion_time:
                return completion_time[task_id]
            
            task = task_dict[task_id]
            
            if not task.dependencies:
                # No dependencies, can start at original time
                earliest_start = task.start_time
            else:
                # Must start after all dependencies finish
                earliest_start = max(
                    calculate_earliest_start(dep_id) 
                    for dep_id in task.dependencies
                )
                # Also consider original start time
                earliest_start = max(earliest_start, task.start_time)
            
            task.optimal_start = earliest_start
            completion_time[task_id] = earliest_start + task.duration
            return completion_time[task_id]
        
        # Calculate for all tasks
        for task in self.tasks:
            calculate_earliest_start(task.id)
        
        # Sort by optimal start time
        self.tasks.sort(key=lambda t: t.optimal_start)
        
        return self.tasks
    
    def print_schedule(self):
        """Print the optimized schedule"""
        print("\n=== Bellman-Ford Schedule Results ===")
        print(f"Total Tasks: {self.n}\n")
        print(f"{'ID':<5} {'Name':<20} {'Original Start':<15} {'Optimal Start':<15} "
              f"{'Duration':<10} {'Profit':<10} {'Priority':<10}")
        print("-" * 100)
        
        total_profit = 0
        for task in self.tasks:
            print(f"{task.id:<5} {task.name:<20} {task.start_time:<15.2f} "
                  f"{task.optimal_start:<15.2f} {task.duration:<10.2f} "
                  f"{task.profit:<10.2f} {task.priority:<10}")
            total_profit += task.profit
        
        print(f"\nTotal Profit: {total_profit:.2f}")
        print(f"Schedule Span: {max(t.optimal_start + t.duration for t in self.tasks):.2f} hours")


# Example usage
if __name__ == "__main__":
    # Create sample tasks with dependencies
    tasks = [
        Task(1, "Task A", 0, 3, 50, "High", []),
        Task(2, "Task B", 1, 4, 60, "Medium", [1]),
        Task(3, "Task C", 2, 6, 70, "High", [1]),
        Task(4, "Task D", 5, 8, 80, "Low", [2, 3]),
        Task(5, "Task E", 6, 9, 90, "Medium", [3]),
    ]
    
    scheduler = TaskScheduler(tasks)
    
    # Check for circular dependencies
    has_cycle, cycle = scheduler.detect_circular_dependency()
    if has_cycle:
        print(f"Error: Circular dependency found: {cycle}")
        sys.exit(1)
    
    # Calculate optimal schedule
    scheduled_tasks = scheduler.calculate_optimal_schedule()
    
    if scheduled_tasks:
        scheduler.print_schedule()
