// main.js - Handles website interactivity

document.addEventListener('DOMContentLoaded', () => {
  console.log('Website loaded successfully');
  
  
  // Function to fetch and display GitHub activities
  function fetchGitHubActivities() {
    const username = 'nandubit';
    const activitiesSection = document.getElementById('activities-content');
    
    if (!activitiesSection) return;
    
    // Show loading spinner initially
    activitiesSection.innerHTML = `
      <li class="activity-item loading-spinner">
        <div class="activity-icon">
          <div class="spinner" style="height: 14px; width: 14px;"></div>
        </div>
        <div class="activity-content">
          <div class="activity-details">
            <p class="activity-title">Loading...</p>
            <p class="activity-description">Fetching GitHub activities</p>
          </div>
        </div>
      </li>
    `;
    
    // Fetch GitHub activities using the GitHub Events API
    fetch(`https://api.github.com/users/${username}/events?per_page=10`)
      .then(response => {
        if (!response.ok) {
          throw new Error('GitHub API request failed');
        }
        return response.json();
      })
      .then(data => {
        displayGitHubActivities(data, activitiesSection);
      })
      .catch(error => {
        console.error('Error fetching GitHub activities:', error);
        activitiesSection.innerHTML = `
          <li class="activity-item">
            <div class="activity-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="activity-content">
              <div class="activity-details">
                <p class="activity-title">Error</p>
                <p class="activity-description">Could not load GitHub activities</p>
              </div>
            </div>
          </li>
        `;
      });
  }
  
  // Function to display GitHub activities
  function displayGitHubActivities(activities, container) {
    if (!activities || activities.length === 0) {
      container.innerHTML = `
        <li class="activity-item">
          <div class="activity-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-details">
              <p class="activity-title">No Activity</p>
              <p class="activity-description">No recent GitHub activity</p>
            </div>
          </div>
        </li>
      `;
      return;
    }
    
    // Clear the container
    container.innerHTML = '';
    
    // Process and display each activity
    activities.forEach(activity => {
      const activityElement = createActivityElement(activity);
      if (activityElement) {
        container.appendChild(activityElement);
      }
    });
  }
  
  // Function to create an activity element
  function createActivityElement(activity) {
    const activityItem = document.createElement('li');
    activityItem.className = 'activity-item';
    
    // Format date
    const date = new Date(activity.created_at);
    const formattedDate = formatDate(date);
    
    // Get activity details based on type
    const { icon, title, description } = getActivityDetails(activity);
    
    activityItem.innerHTML = `
      <div class="activity-icon">
        ${icon}
      </div>
      <div class="activity-content">
        <div class="activity-details">
          <p class="activity-title">${title}</p>
          <p class="activity-description">${description}</p>
          <time class="activity-time">${formattedDate}</time>
        </div>
      </div>
      <hr class="activity-divider" />
    `;
    
    return activityItem;
  }
  
  // Function to get activity details based on type
  function getActivityDetails(activity) {
    const repoName = activity.repo ? activity.repo.name.split('/')[1] : '';
    
    switch (activity.type) {
      case 'PushEvent':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-commit">
                  <circle cx="12" cy="12" r="3"></circle>
                  <line x1="12" y1="3" x2="12" y2="9"></line>
                  <line x1="12" y1="15" x2="12" y2="21"></line>
                </svg>`,
          title: 'Pushed commits',
          description: repoName
        };
      
      case 'CreateEvent':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-branch-plus">
                  <path d="M6 3v12"></path>
                  <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                  <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                  <path d="M15 6a9 9 0 0 0-9 9"></path>
                  <path d="M18 15v6"></path>
                  <path d="M21 18h-6"></path>
                </svg>`,
          title: 'Created repository',
          description: repoName
        };
      
      case 'PullRequestEvent':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-pull-request">
                  <circle cx="18" cy="18" r="3"></circle>
                  <circle cx="6" cy="6" r="3"></circle>
                  <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                  <line x1="6" y1="9" x2="6" y2="21"></line>
                </svg>`,
          title: 'Pull request',
          description: repoName
        };
      
      case 'IssuesEvent':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>`,
          title: 'Issue',
          description: repoName
        };
      
      case 'WatchEvent':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>`,
          title: 'Starred',
          description: repoName
        };
        
      case 'ForkEvent':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-fork">
                  <circle cx="12" cy="18" r="3"></circle>
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="18" cy="6" r="3"></circle>
                  <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                  <path d="M12 12v3"></path>
                </svg>`,
          title: 'Forked',
          description: repoName
        };
      
      default:
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>`,
          title: 'GitHub activity',
          description: repoName
        };
    }
  }
  
  // Format date to DD-MM-YYYY
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  }
  
  // Run the function to fetch GitHub activities
  fetchGitHubActivities();
});
