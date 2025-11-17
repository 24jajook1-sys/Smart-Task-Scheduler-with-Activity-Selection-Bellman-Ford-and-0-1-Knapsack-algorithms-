# 📊 Smart Task Scheduler

A web-based task scheduling application that uses advanced algorithms to optimize task allocation based on priorities, deadlines, and dependencies.

## 🚀 Features

- **Multiple Scheduling Algorithms**
  - 0/1 Knapsack (Dynamic Programming)
  - Bellman-Ford Algorithm (for dependency resolution)
  - Activity Selection (Greedy Algorithm)

- **Interactive Web Interface**
  - Step-by-step task input wizard
  - Real-time task validation
  - Visual progress tracking
  - Drag-and-drop file upload support

- **Rich Visualizations**
  - Timeline chart showing task schedules
  - Bar chart for task priorities
  - Pie chart for capacity utilization
  - Detailed metrics and statistics

- **Task Management**
  - Add tasks with custom properties (priority, deadline, duration, value)
  - Define task dependencies
  - Import/export task data (JSON format)
  - Sample datasets included

## 📁 Project Structure

```
DAA2/
├── WELCOME.html              # Landing page
├── frontend/
│   ├── index.html           # Main application interface
│   ├── app.js               # Frontend logic and API calls
│   └── styles.css           # Application styling
├── algorithms/
│   ├── knapsack.py          # 0/1 Knapsack implementation
│   ├── bellman_ford.py      # Bellman-Ford algorithm
│   └── activity_selection.c # Activity selection (C implementation)
├── assets/
│   ├── test_data_knapsack.json      # Sample data for knapsack
│   ├── test_data_dependencies.json  # Sample data with dependencies
│   └── test_data_simple.json        # Simple test dataset
└── README.md                # This file
```

## 🛠️ Requirements

- **Python 3.7+** (for running the backend algorithms and web server)
- **Modern web browser** (Chrome, Firefox, Edge, Safari)
- **Optional**: GCC compiler (if you want to compile and run the C code)

### Python Dependencies

The project uses only Python standard library modules:
- `json` - JSON parsing
- `sys` - System-specific parameters
- `http.server` - Built-in web server

No external packages required! 🎉

## 🚀 Quick Start

### 1. Clone or Download the Project

```powershell
cd e:\DAA2
```

### 2. Start the Web Server

```powershell
python -m http.server 8000
```

### 3. Open in Browser

Navigate to:
- **Welcome Page**: http://localhost:8000/WELCOME.html
- **Main App**: http://localhost:8000/frontend/index.html

### 4. Use the Application

1. **Welcome Page**: Click "Get Started" to go to the main interface
2. **Step 1**: Enter the number of tasks you want to schedule
3. **Step 2**: Fill in task details (name, priority, deadline, duration, value, dependencies)
4. **Step 3**: Set your work capacity (hours per week)
5. **Step 4**: Review and submit for optimization
6. **Results**: View the optimized schedule with charts and metrics

## 📊 How It Works

### Knapsack Algorithm (Primary)
Uses dynamic programming to maximize task value within capacity constraints:
- **Input**: Tasks with value, duration, priority, deadline
- **Output**: Optimal task selection maximizing total value
- **Time Complexity**: O(n × capacity)

### Bellman-Ford Algorithm
Handles task dependencies and finds the longest path:
- **Input**: Tasks with dependencies (directed graph)
- **Output**: Valid task ordering respecting dependencies
- **Time Complexity**: O(V × E) where V = tasks, E = dependencies

### Activity Selection
Greedy algorithm for non-overlapping task scheduling:
- **Input**: Tasks with start/end times
- **Output**: Maximum number of non-conflicting tasks
- **Time Complexity**: O(n log n)

## 🧪 Testing with Sample Data

The `assets/` folder contains three test datasets:

### 1. Simple Test (`test_data_simple.json`)
```powershell
# Load this file in the app to test basic functionality
```

### 2. Knapsack Test (`test_data_knapsack.json`)
```powershell
# Optimized for value-based task selection
```

### 3. Dependencies Test (`test_data_dependencies.json`)
```powershell
# Tests dependency resolution and task ordering
```

To use: Click "Load Sample Data" in the app or drag-drop the JSON file.

## 🔧 Running Algorithms Standalone

### Python Scripts

**Knapsack:**
```powershell
cd algorithms
python knapsack.py
# Outputs: Selected tasks and total value
```

**Bellman-Ford:**
```powershell
cd algorithms
python bellman_ford.py
# Outputs: Task order respecting dependencies
```

### C Program (Activity Selection)

**Compile:**
```powershell
gcc algorithms/activity_selection.c -o activity_selection.exe
```

**Run:**
```powershell
./activity_selection.exe
```

## 🎨 Customization

### Modify Styling
Edit `frontend/styles.css` to change colors, fonts, or layout.

### Add New Algorithms
1. Create a new Python file in `algorithms/`
2. Accept JSON input via stdin
3. Output JSON results to stdout
4. Update `app.js` to call your new endpoint

### Sample Data
Add more test files to `assets/` following the JSON schema:

```json
{
  "tasks": [
    {
      "id": 1,
      "name": "Task Name",
      "priority": 5,
      "deadline": "2025-11-30",
      "duration": 10,
      "value": 100,
      "dependencies": []
    }
  ],
  "capacity": 40
}
```

## 🐛 Troubleshooting

**Server won't start:**
- Check if port 8000 is already in use
- Try a different port: `python -m http.server 8080`

**Algorithms not running:**
- Ensure Python is in your PATH
- Check that JSON data is properly formatted
- Look for error messages in browser console (F12)

**Page doesn't load:**
- Verify the server is running (check terminal)
- Make sure you're accessing `localhost:8000`, not opening the file directly
- Clear browser cache and reload

## 📝 License

This project is created for educational purposes (Design and Analysis of Algorithms course).

## 👨‍💻 Author

DAA2 Project - Task Scheduling Optimization

## 🙏 Acknowledgments

- Chart.js library for beautiful visualizations
- Modern CSS techniques for responsive design
- Classic algorithms from computer science literature

---

**Enjoy optimizing your tasks! 🎯**

For questions or issues, please check the browser console (F12) for error messages.
