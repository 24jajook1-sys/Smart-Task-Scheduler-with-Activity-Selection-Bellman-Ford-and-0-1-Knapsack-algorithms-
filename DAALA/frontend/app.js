// ===== Global State =====
let currentStep = 1;
let tasksData = [];
let workCapacity = 40;
let optimizationResults = null;
let charts = {
    line: null,
    bar: null,
    pie: null
};

// ===== Utility Functions =====
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function updateProgressBar(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((stepEl, index) => {
        const stepNum = index + 1;
        stepEl.classList.remove('active', 'completed');
        
        if (stepNum < step) {
            stepEl.classList.add('completed');
        } else if (stepNum === step) {
            stepEl.classList.add('active');
        }
    });
}

// ===== Navigation Functions =====
function goToStep(step) {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`step${step}`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentStep = step;
        updateProgressBar(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goToStep1() {
    goToStep(1);
}

function goToStep2() {
    const taskCount = parseInt(document.getElementById('taskCount').value);
    
    if (!taskCount || taskCount < 1 || taskCount > 100) {
        showToast('Please enter a valid number of tasks (1-100)', 'error');
        return;
    }
    
    generateTaskForms(taskCount);
    goToStep(2);
}

function goToStep3() {
    if (!validateTaskInputs()) {
        return;
    }
    
    collectTaskData();
    goToStep(3);
}

function goToStep4() {
    workCapacity = parseFloat(document.getElementById('workCapacity').value);
    
    if (!workCapacity || workCapacity <= 0) {
        showToast('Please enter a valid work capacity', 'error');
        return;
    }
    
    updateReviewSection();
    renderGanttChart();
    goToStep(4);
}

// ===== Task Form Generation =====
function generateTaskForms(count) {
    const container = document.getElementById('taskFormsContainer');
    container.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const taskForm = createTaskFormElement(i);
        container.appendChild(taskForm);
    }
}

function createTaskFormElement(taskId) {
    const div = document.createElement('div');
    div.className = 'task-form-item';
    div.innerHTML = `
        <div class="task-form-header">
            <h3 class="task-form-title">Task ${taskId}</h3>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label for="taskName${taskId}">Task Name</label>
                <input type="text" id="taskName${taskId}" class="input-field" 
                       value="Task ${taskId}" placeholder="Enter task name">
            </div>
            <div class="form-group">
                <label for="startTime${taskId}">Start Time (hours)</label>
                <input type="number" id="startTime${taskId}" class="input-field" 
                       value="${(taskId - 1) * 2}" min="0" step="0.5" placeholder="0">
            </div>
            <div class="form-group">
                <label for="finishTime${taskId}">Finish Time (hours)</label>
                <input type="number" id="finishTime${taskId}" class="input-field" 
                       value="${(taskId - 1) * 2 + 3}" min="0" step="0.5" placeholder="3">
            </div>
            <div class="form-group">
                <label for="profit${taskId}">Profit/Weight</label>
                <input type="number" id="profit${taskId}" class="input-field" 
                       value="${50 + (taskId - 1) * 10}" min="0" step="1" placeholder="50">
            </div>
            <div class="form-group">
                <label for="priority${taskId}">Priority Level</label>
                <select id="priority${taskId}" class="select-field">
                    <option value="High">High</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div class="form-group">
                <label for="dependencies${taskId}">Dependencies (Task IDs)</label>
                <input type="text" id="dependencies${taskId}" class="input-field" 
                       placeholder="e.g., 1,2,3" 
                       title="Enter comma-separated task IDs that must be completed before this task">
                <small class="help-text">Enter task IDs separated by commas</small>
            </div>
        </div>
    `;
    return div;
}

// ===== Validation Functions =====
function validateTaskInputs() {
    const taskCount = document.querySelectorAll('.task-form-item').length;
    
    for (let i = 1; i <= taskCount; i++) {
        const name = document.getElementById(`taskName${i}`).value.trim();
        const start = parseFloat(document.getElementById(`startTime${i}`).value);
        const finish = parseFloat(document.getElementById(`finishTime${i}`).value);
        const profit = parseFloat(document.getElementById(`profit${i}`).value);
        
        if (!name) {
            showToast(`Task ${i}: Please enter a task name`, 'error');
            return false;
        }
        
        if (isNaN(start) || start < 0) {
            showToast(`Task ${i}: Invalid start time`, 'error');
            return false;
        }
        
        if (isNaN(finish) || finish < 0) {
            showToast(`Task ${i}: Invalid finish time`, 'error');
            return false;
        }
        
        if (start >= finish) {
            showToast(`Task ${i}: Start time must be less than finish time`, 'error');
            return false;
        }
        
        if (isNaN(profit) || profit < 0) {
            showToast(`Task ${i}: Invalid profit value`, 'error');
            return false;
        }
    }
    
    return true;
}

function detectCircularDependencies(tasks) {
    const graph = {};
    tasks.forEach(task => {
        graph[task.id] = task.dependencies;
    });
    
    const visiting = new Set();
    const visited = new Set();
    
    function hasCycle(taskId, path = []) {
        if (visiting.has(taskId)) {
            const cycleStart = path.indexOf(taskId);
            const cycle = path.slice(cycleStart).concat(taskId);
            return { hasCycle: true, cycle };
        }
        
        if (visited.has(taskId)) {
            return { hasCycle: false };
        }
        
        visiting.add(taskId);
        path.push(taskId);
        
        const deps = graph[taskId] || [];
        for (const dep of deps) {
            if (graph[dep] !== undefined) {
                const result = hasCycle(dep, [...path]);
                if (result.hasCycle) {
                    return result;
                }
            }
        }
        
        visiting.delete(taskId);
        visited.add(taskId);
        return { hasCycle: false };
    }
    
    for (const taskId of Object.keys(graph)) {
        const result = hasCycle(parseInt(taskId));
        if (result.hasCycle) {
            return result;
        }
    }
    
    return { hasCycle: false };
}

// ===== Data Collection =====
function collectTaskData() {
    const taskCount = document.querySelectorAll('.task-form-item').length;
    tasksData = [];
    
    for (let i = 1; i <= taskCount; i++) {
        const name = document.getElementById(`taskName${i}`).value.trim();
        const start = parseFloat(document.getElementById(`startTime${i}`).value);
        const finish = parseFloat(document.getElementById(`finishTime${i}`).value);
        const profit = parseFloat(document.getElementById(`profit${i}`).value);
        const priority = document.getElementById(`priority${i}`).value;
        const depsStr = document.getElementById(`dependencies${i}`).value.trim();
        
        const dependencies = depsStr 
            ? depsStr.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d))
            : [];
        
        tasksData.push({
            id: i,
            name,
            startTime: start,
            finishTime: finish,
            duration: finish - start,
            profit,
            priority,
            dependencies
        });
    }
}

// ===== Review Section =====
function updateReviewSection() {
    const totalTasks = tasksData.length;
    const totalDuration = tasksData.reduce((sum, task) => sum + task.duration, 0);
    const totalProfit = tasksData.reduce((sum, task) => sum + task.profit, 0);
    
    document.getElementById('reviewTotalTasks').textContent = totalTasks;
    document.getElementById('reviewTotalDuration').textContent = totalDuration.toFixed(1) + 'h';
    document.getElementById('reviewTotalProfit').textContent = totalProfit.toFixed(0);
    document.getElementById('reviewCapacity').textContent = workCapacity.toFixed(1) + 'h';
}

// ===== Gantt Chart Rendering =====
function renderGanttChart() {
    const container = document.getElementById('ganttChart');
    container.innerHTML = '';
    
    if (tasksData.length === 0) return;
    
    // Find max time
    const maxTime = Math.max(...tasksData.map(t => t.finishTime));
    const hours = Math.ceil(maxTime);
    
    // Create timeline
    const timeline = document.createElement('div');
    timeline.className = 'gantt-timeline';
    for (let i = 0; i <= hours; i++) {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'gantt-hour';
        hourDiv.textContent = `${i}h`;
        timeline.appendChild(hourDiv);
    }
    container.appendChild(timeline);
    
    // Create task rows
    tasksData.forEach(task => {
        const row = document.createElement('div');
        row.className = 'gantt-row';
        
        const label = document.createElement('div');
        label.className = 'gantt-label';
        label.textContent = task.name;
        
        const bars = document.createElement('div');
        bars.className = 'gantt-bars';
        
        const bar = document.createElement('div');
        bar.className = `gantt-bar priority-${task.priority.toLowerCase()}`;
        
        const leftPercent = (task.startTime / maxTime) * 100;
        const widthPercent = (task.duration / maxTime) * 100;
        
        bar.style.left = `${leftPercent}%`;
        bar.style.width = `${widthPercent}%`;
        bar.textContent = `${task.name} (${task.profit})`;
        
        bar.addEventListener('mouseenter', (e) => {
            showGanttTooltip(e, task);
        });
        
        bar.addEventListener('mouseleave', () => {
            hideGanttTooltip();
        });
        
        bars.appendChild(bar);
        row.appendChild(label);
        row.appendChild(bars);
        container.appendChild(row);
    });
}

function showGanttTooltip(event, task) {
    let tooltip = document.querySelector('.gantt-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'gantt-tooltip';
        document.body.appendChild(tooltip);
    }
    
    const depsText = task.dependencies.length > 0 
        ? `Dependencies: ${task.dependencies.join(', ')}`
        : 'No dependencies';
    
    tooltip.innerHTML = `
        <strong>${task.name}</strong><br>
        Time: ${task.startTime}h - ${task.finishTime}h<br>
        Duration: ${task.duration}h<br>
        Profit: ${task.profit}<br>
        Priority: ${task.priority}<br>
        ${depsText}
    `;
    
    tooltip.style.display = 'block';
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY + 10 + 'px';
}

function hideGanttTooltip() {
    const tooltip = document.querySelector('.gantt-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// ===== Algorithm Implementation =====
function activitySelection(tasks) {
    // Sort by finish time
    const sorted = [...tasks].sort((a, b) => a.finishTime - b.finishTime);
    
    const selected = [sorted[0]];
    let lastFinish = sorted[0].finishTime;
    
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].startTime >= lastFinish) {
            selected.push(sorted[i]);
            lastFinish = sorted[i].finishTime;
        }
    }
    
    return selected;
}

function knapsackOptimization(tasks, capacity) {
    const n = tasks.length;
    const capacityInt = Math.floor(capacity * 10);
    const dp = Array(n + 1).fill(null).map(() => Array(capacityInt + 1).fill(0));
    
    const weights = tasks.map(t => Math.floor(t.duration * 10));
    const profits = tasks.map(t => t.profit);
    
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacityInt; w++) {
            dp[i][w] = dp[i-1][w];
            
            if (weights[i-1] <= w) {
                const includeProfit = dp[i-1][w - weights[i-1]] + profits[i-1];
                dp[i][w] = Math.max(dp[i][w], includeProfit);
            }
        }
    }
    
    // Backtrack to find selected tasks
    const selected = [];
    let w = capacityInt;
    
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i-1][w]) {
            selected.push(tasks[i-1]);
            w -= weights[i-1];
        }
    }
    
    return selected.reverse();
}

function resolveDependencies(tasks) {
    const taskMap = {};
    tasks.forEach(task => taskMap[task.id] = { ...task });
    
    function getEarliestStart(taskId, visited = new Set()) {
        if (visited.has(taskId)) return 0;
        visited.add(taskId);
        
        const task = taskMap[taskId];
        if (!task) return 0;
        
        let earliestStart = task.startTime;
        
        for (const depId of task.dependencies) {
            if (taskMap[depId]) {
                const depFinish = getEarliestStart(depId, visited) + taskMap[depId].duration;
                earliestStart = Math.max(earliestStart, depFinish);
            }
        }
        
        return earliestStart;
    }
    
    const resolved = tasks.map(task => {
        const optimalStart = getEarliestStart(task.id);
        return {
            ...task,
            optimalStart,
            optimalFinish: optimalStart + task.duration
        };
    });
    
    return resolved.sort((a, b) => a.optimalStart - b.optimalStart);
}

function optimizeSchedule() {
    showLoading();
    
    setTimeout(() => {
        try {
            // Check for circular dependencies
            const cycleResult = detectCircularDependencies(tasksData);
            if (cycleResult.hasCycle) {
                hideLoading();
                showToast(`Circular dependency detected: ${cycleResult.cycle.join(' → ')}`, 'error');
                return;
            }
            
            // Step 1: Resolve dependencies
            let scheduledTasks = resolveDependencies(tasksData);
            
            // Step 2: Apply activity selection on resolved tasks
            let selectedTasks = activitySelection(scheduledTasks);
            
            // Step 3: Apply knapsack for profit maximization within capacity
            selectedTasks = knapsackOptimization(selectedTasks, workCapacity);
            
            // Calculate metrics
            const totalDuration = selectedTasks.reduce((sum, t) => sum + t.duration, 0);
            const totalProfit = selectedTasks.reduce((sum, t) => sum + t.profit, 0);
            const efficiency = totalDuration > 0 ? totalProfit / totalDuration : 0;
            
            // Mark selected tasks
            const selectedIds = new Set(selectedTasks.map(t => t.id));
            const allTasksWithStatus = tasksData.map(task => ({
                ...task,
                selected: selectedIds.has(task.id)
            }));
            
            optimizationResults = {
                selectedTasks,
                allTasks: allTasksWithStatus,
                totalDuration,
                totalProfit,
                efficiency,
                capacity: workCapacity
            };
            
            displayResults();
            hideLoading();
            showToast('Optimization completed successfully!', 'success');
            
        } catch (error) {
            hideLoading();
            showToast('Error during optimization: ' + error.message, 'error');
            console.error(error);
        }
    }, 1000);
}

// ===== Results Display =====
function displayResults() {
    const { selectedTasks, allTasks, totalDuration, totalProfit, efficiency, capacity } = optimizationResults;
    
    // Update summary cards
    document.getElementById('resultSelectedTasks').textContent = selectedTasks.length;
    document.getElementById('resultTotalDuration').textContent = totalDuration.toFixed(1) + 'h';
    document.getElementById('resultTotalProfit').textContent = totalProfit.toFixed(0);
    document.getElementById('resultEfficiency').textContent = efficiency.toFixed(2);
    
    // Update performance metrics
    const avgProfit = selectedTasks.length > 0 ? totalProfit / selectedTasks.length : 0;
    const avgDuration = selectedTasks.length > 0 ? totalDuration / selectedTasks.length : 0;
    const capacityUtil = capacity > 0 ? (totalDuration / capacity) * 100 : 0;
    const highPriorityCount = selectedTasks.filter(t => t.priority === 'High').length;
    
    document.getElementById('avgProfit').textContent = avgProfit.toFixed(2);
    document.getElementById('avgDuration').textContent = avgDuration.toFixed(1) + 'h';
    document.getElementById('capacityUtil').textContent = capacityUtil.toFixed(1) + '%';
    document.getElementById('highPriorityCount').textContent = highPriorityCount;
    
    // Render charts
    renderCharts();
    
    // Render results table
    renderResultsTable(allTasks);
    
    // Show results section
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('resultsSection').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Charts Rendering =====
function renderCharts() {
    const { selectedTasks } = optimizationResults;
    
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    // Line Chart - Profit vs Duration
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    charts.line = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: selectedTasks.map(t => t.name),
            datasets: [{
                label: 'Profit',
                data: selectedTasks.map(t => t.profit),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }, {
                label: 'Duration (hours)',
                data: selectedTasks.map(t => t.duration),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#F3F4F6' } }
            },
            scales: {
                y: { ticks: { color: '#F3F4F6' }, grid: { color: '#374151' } },
                x: { ticks: { color: '#F3F4F6' }, grid: { color: '#374151' } }
            }
        }
    });
    
    // Bar Chart - Execution Order
    const barCtx = document.getElementById('barChart').getContext('2d');
    charts.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: selectedTasks.map(t => t.name),
            datasets: [{
                label: 'Profit',
                data: selectedTasks.map(t => t.profit),
                backgroundColor: selectedTasks.map(t => {
                    switch(t.priority) {
                        case 'High': return '#EF4444';
                        case 'Medium': return '#F59E0B';
                        case 'Low': return '#10B981';
                        default: return '#3B82F6';
                    }
                })
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#F3F4F6' } }
            },
            scales: {
                y: { ticks: { color: '#F3F4F6' }, grid: { color: '#374151' } },
                x: { ticks: { color: '#F3F4F6' }, grid: { color: '#374151' } }
            }
        }
    });
    
    // Pie Chart - Priority Distribution
    const highCount = selectedTasks.filter(t => t.priority === 'High').length;
    const mediumCount = selectedTasks.filter(t => t.priority === 'Medium').length;
    const lowCount = selectedTasks.filter(t => t.priority === 'Low').length;
    
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    charts.pie = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['High Priority', 'Medium Priority', 'Low Priority'],
            datasets: [{
                data: [highCount, mediumCount, lowCount],
                backgroundColor: ['#EF4444', '#F59E0B', '#10B981']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#F3F4F6' } }
            }
        }
    });
}

// ===== Results Table =====
function renderResultsTable(tasks) {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.startTime.toFixed(1)}</td>
            <td>${task.finishTime.toFixed(1)}</td>
            <td>${task.duration.toFixed(1)}</td>
            <td>${task.profit.toFixed(0)}</td>
            <td class="priority-${task.priority.toLowerCase()}">${task.priority}</td>
            <td>
                <span class="status-badge ${task.selected ? 'status-selected' : 'status-not-selected'}">
                    ${task.selected ? 'Selected' : 'Not Selected'}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===== Table Sorting =====
let sortDirection = {};

function sortTable(columnIndex) {
    const table = document.getElementById('resultsTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const direction = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';
    sortDirection[columnIndex] = direction;
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        return direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// ===== Export Functions =====
function exportResults() {
    if (!optimizationResults) {
        showToast('No results to export', 'error');
        return;
    }
    
    const exportData = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTasks: tasksData.length,
            selectedTasks: optimizationResults.selectedTasks.length,
            totalDuration: optimizationResults.totalDuration,
            totalProfit: optimizationResults.totalProfit,
            efficiency: optimizationResults.efficiency,
            workCapacity: optimizationResults.capacity
        },
        selectedTasks: optimizationResults.selectedTasks,
        allTasks: optimizationResults.allTasks
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task_schedule_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Results exported successfully!', 'success');
}

// ===== Reset Function =====
function resetAll() {
    if (confirm('Are you sure you want to reset all data and start over?')) {
        currentStep = 1;
        tasksData = [];
        workCapacity = 40;
        optimizationResults = null;
        
        document.getElementById('taskCount').value = 5;
        document.getElementById('workCapacity').value = 40;
        document.getElementById('taskFormsContainer').innerHTML = '';
        
        Object.values(charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        goToStep(1);
        showToast('All data has been reset', 'info');
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    goToStep(1);
    console.log('Smart Task Scheduler initialized');
});
