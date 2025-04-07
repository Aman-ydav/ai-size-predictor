document.addEventListener('DOMContentLoaded', function() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please include the Chart.js library in your HTML file.');
        return;
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Size Prediction Form
    const sizeForm = document.getElementById('size-form');
    if (sizeForm) {
        sizeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate form inputs
            const formInputs = {
                height: document.getElementById('height'),
                weight: document.getElementById('weight'),
                chest: document.getElementById('chest'),
                waist: document.getElementById('waist'),
                hips: document.getElementById('hips'),
                gender: document.getElementById('gender')
            };
            
            // Check if all inputs exist
            for (const [key, input] of Object.entries(formInputs)) {
                if (!input) {
                    console.error(`Input element with id '${key}' not found`);
                    return;
                }
            }
            
            const formData = {
                height: parseFloat(formInputs.height.value),
                weight: parseFloat(formInputs.weight.value),
                chest: parseFloat(formInputs.chest.value),
                waist: parseFloat(formInputs.waist.value),
                hips: parseFloat(formInputs.hips.value),
                gender: formInputs.gender.value
            };

            try {
                const response = await fetch('http://localhost:3000/api/predict-size', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                
                if (response.ok) {
                    displayResults(data, formData);
                } else {
                    alert(data.error || 'An error occurred while predicting your size.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to connect to the server. Please try again later.');
            }
        });
    }

    // Display Results
    function displayResults(data, measurements) {
        const resultsSection = document.getElementById('results-section');
        const predictedSize = document.getElementById('predicted-size');
        const confidenceScore = document.getElementById('confidence-score');
        
        if (!resultsSection || !predictedSize || !confidenceScore) {
            console.error('Required result elements not found');
            return;
        }
        
        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Update size and confidence
        predictedSize.textContent = data.predicted_size;
        confidenceScore.textContent = `${(data.confidence * 100).toFixed(1)}%`;
        
        // Create measurements chart
        createMeasurementsChart(measurements);
        
        // Update size comparison table
        updateSizeComparison(data.size_comparison);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Create Measurements Chart
    function createMeasurementsChart(measurements) {
        const chartCanvas = document.getElementById('measurementsChart');
        if (!chartCanvas) {
            console.error('Chart canvas element not found');
            return;
        }
        
        const ctx = chartCanvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.measurementsChart && typeof window.measurementsChart.destroy === 'function') {
            window.measurementsChart.destroy();
        }
        
        // Create new chart
        window.measurementsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Height', 'Weight', 'Chest', 'Waist', 'Hips'],
                datasets: [{
                    label: 'Your Measurements',
                    data: [
                        measurements.height,
                        measurements.weight,
                        measurements.chest,
                        measurements.waist,
                        measurements.hips
                    ],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Update Size Comparison Table
    function updateSizeComparison(comparisonData) {
        const tbody = document.getElementById('size-comparison-body');
        if (!tbody) {
            console.error('Size comparison table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        comparisonData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.brand}</td>
                <td>${item.size}</td>
                <td>${item.fit}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Create Accuracy Chart on How It Works page
    const accuracyChart = document.getElementById('accuracyChart');
    if (accuracyChart) {
        const ctx = accuracyChart.getContext('2d');
        
        // Check if there's an existing chart and destroy it
        if (window.accuracyChart && typeof window.accuracyChart.destroy === 'function') {
            window.accuracyChart.destroy();
        }
        
        // Create new chart
        window.accuracyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['XS', 'S', 'M', 'L', 'XL'],
                datasets: [{
                    label: 'Prediction Accuracy by Size',
                    data: [92, 95, 98, 94, 91],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(52, 152, 219, 0.7)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(52, 152, 219, 1)',
                        'rgba(52, 152, 219, 1)',
                        'rgba(52, 152, 219, 1)',
                        'rgba(52, 152, 219, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Accuracy: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Form Validation
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            
            if (value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    });
}); 