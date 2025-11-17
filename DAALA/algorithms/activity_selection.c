/*
 * Activity Selection Algorithm (Greedy Approach)
 * Selects maximum number of non-overlapping tasks
 * Time Complexity: O(n log n)
 */

#include <stdio.h>
#include <stdlib.h>

// Structure to represent a task
typedef struct {
    int id;
    char name[100];
    double start_time;
    double finish_time;
    double profit;
    int priority; // 1=High, 2=Medium, 3=Low
} Task;

// Comparison function for qsort (sort by finish time)
int compare_finish_time(const void *a, const void *b) {
    Task *taskA = (Task *)a;
    Task *taskB = (Task *)b;
    
    if (taskA->finish_time < taskB->finish_time) return -1;
    if (taskA->finish_time > taskB->finish_time) return 1;
    return 0;
}

// Activity Selection Algorithm
int activity_selection(Task tasks[], int n, int selected[]) {
    // Sort tasks by finish time
    qsort(tasks, n, sizeof(Task), compare_finish_time);
    
    // First task is always selected
    selected[0] = 0;
    int count = 1;
    int last_finish = 0;
    
    // Select remaining tasks
    for (int i = 1; i < n; i++) {
        // If start time is >= finish time of last selected task
        if (tasks[i].start_time >= tasks[last_finish].finish_time) {
            selected[count] = i;
            count++;
            last_finish = i;
        }
    }
    
    return count;
}

// Print selected tasks
void print_selected_tasks(Task tasks[], int selected[], int count) {
    printf("\n=== Activity Selection Results ===\n");
    printf("Total Selected Tasks: %d\n\n", count);
    printf("%-5s %-20s %-10s %-10s %-10s %-10s\n", 
           "ID", "Name", "Start", "Finish", "Profit", "Priority");
    printf("------------------------------------------------------------------------\n");
    
    double total_profit = 0;
    for (int i = 0; i < count; i++) {
        Task t = tasks[selected[i]];
        printf("%-5d %-20s %-10.2f %-10.2f %-10.2f ", 
               t.id, t.name, t.start_time, t.finish_time, t.profit);
        
        switch(t.priority) {
            case 1: printf("High\n"); break;
            case 2: printf("Medium\n"); break;
            case 3: printf("Low\n"); break;
        }
        total_profit += t.profit;
    }
    
    printf("\nTotal Profit: %.2f\n", total_profit);
}

// Main function for testing
int main() {
    // Example tasks
    Task tasks[] = {
        {1, "Task A", 0, 3, 50, 1},
        {2, "Task B", 1, 4, 60, 2},
        {3, "Task C", 3, 6, 70, 1},
        {4, "Task D", 5, 8, 80, 3},
        {5, "Task E", 6, 9, 90, 2},
        {6, "Task F", 8, 10, 100, 1}
    };
    
    int n = sizeof(tasks) / sizeof(tasks[0]);
    int selected[n];
    
    printf("=== Smart Task Scheduler - Activity Selection ===\n");
    printf("Total Tasks: %d\n", n);
    
    int count = activity_selection(tasks, n, selected);
    print_selected_tasks(tasks, selected, count);
    
    return 0;
}
