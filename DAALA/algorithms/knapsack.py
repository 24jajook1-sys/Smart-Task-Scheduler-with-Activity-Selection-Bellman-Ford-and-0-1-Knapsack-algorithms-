"""
0/1 Knapsack Algorithm for Task Scheduling
Maximizes total profit within work capacity constraints
Each task is either selected or not selected (binary choice)
Time Complexity: O(n * capacity)
"""

from typing import List, Tuple

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
        
    def __repr__(self):
        return f"Task({self.id}, {self.name}, Profit={self.profit}, Duration={self.duration})"


class KnapsackScheduler:
    def __init__(self, tasks: List[Task], capacity: float):
        self.tasks = tasks
        self.capacity = int(capacity * 10)  # Convert to integer for DP (multiply by 10 for decimal precision)
        self.n = len(tasks)
        
    def solve_knapsack(self) -> Tuple[List[Task], float, float]:
        """
        Solve 0/1 knapsack problem using dynamic programming
        Returns: (selected_tasks, total_profit, total_duration)
        """
        # Convert task durations to integers (multiply by 10)
        weights = [int(task.duration * 10) for task in self.tasks]
        profits = [task.profit for task in self.tasks]
        
        # Create DP table
        dp = [[0.0 for _ in range(self.capacity + 1)] for _ in range(self.n + 1)]
        
        # Fill DP table
        for i in range(1, self.n + 1):
            for w in range(self.capacity + 1):
                # Don't include current task
                dp[i][w] = dp[i-1][w]
                
                # Include current task if it fits
                if weights[i-1] <= w:
                    include_profit = dp[i-1][w - weights[i-1]] + profits[i-1]
                    dp[i][w] = max(dp[i][w], include_profit)
        
        # Backtrack to find selected tasks
        selected_tasks = []
        w = self.capacity
        total_profit = dp[self.n][w]
        
        for i in range(self.n, 0, -1):
            if dp[i][w] != dp[i-1][w]:
                selected_tasks.append(self.tasks[i-1])
                w -= weights[i-1]
        
        selected_tasks.reverse()
        total_duration = sum(task.duration for task in selected_tasks)
        
        return selected_tasks, total_profit, total_duration
    
    def solve_with_dependencies(self) -> Tuple[List[Task], float, float]:
        """
        Solve knapsack with task dependencies
        Ensures that if a task is selected, all its dependencies are also selected
        """
        task_dict = {task.id: task for task in self.tasks}
        
        # Function to get all dependencies recursively
        def get_all_dependencies(task_id: int, visited=None) -> set:
            if visited is None:
                visited = set()
            
            if task_id in visited:
                return visited
            
            visited.add(task_id)
            task = task_dict[task_id]
            
            for dep_id in task.dependencies:
                if dep_id in task_dict:
                    get_all_dependencies(dep_id, visited)
            
            return visited
        
        # Try all possible combinations considering dependencies
        best_profit = 0
        best_tasks = []
        best_duration = 0
        
        # Generate all possible subsets
        for mask in range(1 << self.n):
            selected = []
            total_duration = 0
            total_profit = 0
            valid = True
            
            # Check each task in current subset
            for i in range(self.n):
                if mask & (1 << i):
                    task = self.tasks[i]
                    
                    # Check if all dependencies are included
                    for dep_id in task.dependencies:
                        dep_index = next((j for j, t in enumerate(self.tasks) if t.id == dep_id), -1)
                        if dep_index != -1 and not (mask & (1 << dep_index)):
                            valid = False
                            break
                    
                    if not valid:
                        break
                    
                    selected.append(task)
                    total_duration += task.duration
                    total_profit += task.profit
            
            # Check if valid and within capacity
            if valid and total_duration <= self.capacity / 10 and total_profit > best_profit:
                best_profit = total_profit
                best_tasks = selected
                best_duration = total_duration
        
        return best_tasks, best_profit, best_duration
    
    def print_results(self, selected_tasks: List[Task], total_profit: float, total_duration: float):
        """Print knapsack results"""
        print("\n=== 0/1 Knapsack Results ===")
        print(f"Work Capacity: {self.capacity / 10:.2f} hours")
        print(f"Total Selected Tasks: {len(selected_tasks)}")
        print(f"Total Duration: {total_duration:.2f} hours")
        print(f"Total Profit: {total_profit:.2f}")
        print(f"Efficiency: {total_profit / total_duration:.2f} profit/hour" if total_duration > 0 else "Efficiency: N/A")
        print(f"Capacity Utilization: {(total_duration / (self.capacity / 10)) * 100:.2f}%\n")
        
        print(f"{'ID':<5} {'Name':<20} {'Start':<10} {'Finish':<10} {'Duration':<10} {'Profit':<10} {'Priority':<10}")
        print("-" * 90)
        
        for task in selected_tasks:
            print(f"{task.id:<5} {task.name:<20} {task.start_time:<10.2f} "
                  f"{task.finish_time:<10.2f} {task.duration:<10.2f} "
                  f"{task.profit:<10.2f} {task.priority:<10}")


# Example usage
if __name__ == "__main__":
    # Create sample tasks
    tasks = [
        Task(1, "Task A", 0, 3, 50, "High", []),
        Task(2, "Task B", 1, 4, 60, "Medium", []),
        Task(3, "Task C", 3, 6, 70, "High", []),
        Task(4, "Task D", 5, 8, 80, "Low", []),
        Task(5, "Task E", 6, 9, 90, "Medium", []),
        Task(6, "Task F", 8, 11, 100, "High", [])
    ]
    
    capacity = 15.0  # Maximum hours available
    
    scheduler = KnapsackScheduler(tasks, capacity)
    
    print("=== Smart Task Scheduler - 0/1 Knapsack ===")
    print(f"Total Tasks: {len(tasks)}")
    print(f"Available Capacity: {capacity} hours\n")
    
    # Solve without dependencies
    selected, profit, duration = scheduler.solve_knapsack()
    scheduler.print_results(selected, profit, duration)
    
    # Example with dependencies
    print("\n\n=== With Dependencies ===")
    tasks_with_deps = [
        Task(1, "Task A", 0, 3, 50, "High", []),
        Task(2, "Task B", 1, 4, 60, "Medium", [1]),
        Task(3, "Task C", 3, 6, 70, "High", [1]),
        Task(4, "Task D", 5, 8, 80, "Low", [2]),
    ]
    
    scheduler2 = KnapsackScheduler(tasks_with_deps, capacity)
    selected2, profit2, duration2 = scheduler2.solve_with_dependencies()
    scheduler2.print_results(selected2, profit2, duration2)
