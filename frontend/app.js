let myChart = null;

document.getElementById('search-btn').addEventListener('click', async () => {
    const username = document.getElementById('username-input').value.trim();
    const errorDiv = document.getElementById('error-message');
    const resultsCard = document.getElementById('results-card');

    if (!username) {
        showError('Please enter a username.');
        return;
    }

    try {
        errorDiv.classList.add('hidden');
        
        // Use 5001 or 5000 depending on which port your backend server started on
        const response = await fetch(`https://leetcode-profile-analyzer.onrender.com/api/v1/leetcode/${username}`);
        if (!response.ok) throw new Error('User not found or API failure.');

        const data = await response.json();
        const submissionStats = data.submitStats.acSubmissionNum;
        
        const easy = parseInt(submissionStats.find(s => s.difficulty === 'Easy').count);
        const medium = parseInt(submissionStats.find(s => s.difficulty === 'Medium').count);
        const hard = parseInt(submissionStats.find(s => s.difficulty === 'Hard').count);

        // Update Text Elements
        document.getElementById('display-username').textContent = data.username;
        document.getElementById('easy-count').textContent = easy;
        document.getElementById('medium-count').textContent = medium;
        document.getElementById('hard-count').textContent = hard;

        // Run the custom analysis engine
        generatePerformanceInsights(easy, medium, hard);

        // Render the Chart
        renderChart(easy, medium, hard);

        resultsCard.classList.remove('hidden');
    } catch (err) {
        resultsCard.classList.add('hidden');
        showError(err.message);
    }
});

// The Heuristic Evaluation Engine for Resume Polish
function generatePerformanceInsights(easy, medium, hard) {
    const total = easy + medium + hard;
    const excellenceEl = document.getElementById('excellence-text');
    const improvementEl = document.getElementById('improvement-text');

    // Edge Case: Brand new or mostly inactive account
    if (total < 20) {
        excellenceEl.textContent = "Beginning the Climb: Great work initializing your LeetCode profile! Taking the first step to establish a routine is often the hardest engineering challenge.";
        improvementEl.textContent = "Build Algorithmic Momentum: Focus completely on data consistency right now. Try to solve 1-2 basic Easy tracking problems a day to build standard array/string syntax familiarity before jumping into complex data structures.";
        return;
    }

    const easyRatio = (easy / total) * 100;
    const mediumRatio = (medium / total) * 100;
    const hardRatio = (hard / total) * 100;

    let excellenceMessage = "";
    let improvementMessage = "";

    // Evaluation Logic Tree based on core industry interview standards
    if (mediumRatio >= 45) {
        excellenceMessage = "Interview-Ready Core: An outstanding profile structure! Having over 45% of your overall solved questions sitting inside the Medium tier perfectly matches the precise SWE baseline technical screens target.";
        improvementMessage = "Speed Optimization & Edge Cases: Shift your training focus from raw completion to velocity. Try treating Mediums like timed 20-minute mock trials without code hints, and start exploring advanced dynamic programming tracks.";
    } else if (easyRatio > 60) {
        excellenceMessage = "Rock-Solid Fundamentals: You have built a massive foundational base. You thoroughly understand structural loops, base logic, and clean standard operations across a massive breadth of problems.";
        improvementMessage = "The 'Medium' Leap: You are spending too much time within your comfort baseline. Break the safety net and pivot completely to Medium problems (Trees, Graphs, Two Pointers) where the vast majority of true technical interview pipelines operate.";
    } else if (hardRatio > 15) {
        excellenceMessage = "Advanced Problem Solver: Exceptional logical parsing capacity. Breaking past a 15% Hard problem solving threshold highlights robust mastery over advanced data structures like Segment Trees, Tries, or complex recursion.";
        improvementMessage = "Contextual Velocity Safeguard: Ensure you aren't over-engineering simple scenarios. Balance your schedule by running fast sprints through basic data patterns to keep your fundamental code delivery fast, straightforward, and readable.";
    } else {
        excellenceMessage = "Well-Rounded Generalist: You maintain a highly balanced tracking layout across varying problem categories, helping you build well-distributed cognitive endurance across multiple patterns.";
        improvementMessage = "Targeted Blind-75 Execution: Instead of navigating arbitrary coding pools, pivot directly toward high-yield pattern curations (like the Blind 75 or Top Interview 150). This streamlines conceptual retention and boosts interview conversion.";
    }

    excellenceEl.textContent = excellenceMessage;
    improvementEl.textContent = improvementMessage;
}

function renderChart(easy, medium, hard) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                data: [easy, medium, hard],
                backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

function showError(msg) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
}