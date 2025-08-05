// main.js - Handles website interactivity

document.addEventListener('DOMContentLoaded', () => {
  // This could be expanded with additional functionality as needed
  console.log('Website loaded successfully');
  
  // You could add event listeners for interactive elements here
  
  // Example of a function to simulate loading activities
  // In a real implementation, this would fetch data from an API
  function simulateLoadActivities() {
    setTimeout(() => {
      const activitiesSection = document.getElementById('activities-content');
      if (activitiesSection) {
        activitiesSection.innerHTML = `
          <div class="status-item">
            <div class="status-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <div class="status-details">
              <h3 class="status-title">Coding</h3>
              <p class="status-description">Working on a personal project</p>
            </div>
          </div>
        `;
      }
    }, 2000);
  }
  
  // Run the simulation
  simulateLoadActivities();
});
