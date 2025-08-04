// GitHub Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initNavigation();
    initProjectFilters();
    initContactForm();
    initScrollAnimations();
    initStatsCounters();

    // Load GitHub data
    loadGitHubStats();
    loadGitHubProjects();

    // Initialize articles
    initArticles();

    // Initialize scroll effects
    window.addEventListener('scroll', updateScrollProgress);
    initBackToTop();

    // Initialize theme detection
    initThemeDetection();
});

// Simplified Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced scroll effects
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class for navbar styling
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update navigation progress
        updateNavigationProgress();

        // Update active nav link
        updateActiveNavLink();
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function updateNavigationProgress() {
    const progressBar = document.querySelector('.nav-progress');
    if (!progressBar) return;

    const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollCurrent = window.pageYOffset;
    const progress = Math.min((scrollCurrent / scrollTotal) * 100, 100);

    progressBar.style.width = progress + '%';
}

// Enhanced Stats Counter Animation
function initStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number[data-target]');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber);
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe each stat item
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        observer.observe(item);
    });

    // Add hover effects for stat items
    statItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px) scale(1.02)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Project filtering functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Create mailto link
            const subject = encodeURIComponent(`Message from ${name} - Portfolio Contact`);
            const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:dulthiwanka2015@gmail.com?subject=${subject}&body=${body}`;

            // Open email client
            window.location.href = mailtoLink;

            // Show success message
            showNotification('Email client opened! Thank you for your message.', 'success');

            // Reset form
            contactForm.reset();
        });
    }
}

// Load real GitHub stats for Quick Stats section
async function loadGitHubStats() {
    const username = 'Dthiwanka'; // GitHub username

    try {
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await reposResponse.json();

        // Fetch events for activity calculation
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        const events = await eventsResponse.json();

        // Calculate real statistics
        const stats = calculateGitHubStats(userData, repos, events);

        // Update the stats in the UI
        updateQuickStats(stats);

    } catch (error) {
        console.error('Error loading GitHub stats:', error);
        // Fall back to default values if API fails
        const fallbackStats = {
            experience: 3,
            projects: 50,
            contributions: 100,
            totalCommits: 500
        };
        updateQuickStats(fallbackStats);
    }
}

function calculateGitHubStats(userData, repos, events) {
    // Calculate years of experience based on account creation
    const accountCreated = new Date(userData.created_at);
    const now = new Date();
    const yearsOfExperience = Math.max(1, Math.floor((now - accountCreated) / (1000 * 60 * 60 * 24 * 365)));

    // Filter out forks to get original projects
    const originalRepos = repos.filter(repo => !repo.fork);

    // Count different types of contributions from events
    let totalContributions = 0;
    const pushEvents = events.filter(event => event.type === 'PushEvent');

    // Estimate total commits from push events
    pushEvents.forEach(event => {
        if (event.payload && event.payload.commits) {
            totalContributions += event.payload.commits.length;
        }
    });

    // Add other contribution types
    const issueEvents = events.filter(event =>
        event.type === 'IssuesEvent' ||
        event.type === 'PullRequestEvent' ||
        event.type === 'CreateEvent'
    );
    totalContributions += issueEvents.length;

    // Use public repos count and add some buffer for private work
    const totalProjects = Math.max(originalRepos.length, userData.public_repos + 10);

    // Estimate total contributions (this is an approximation since GitHub doesn't provide full commit count via API)
    const estimatedContributions = Math.max(totalContributions, userData.public_repos * 10);

    return {
        experience: yearsOfExperience,
        projects: totalProjects,
        contributions: estimatedContributions,
        followers: userData.followers,
        following: userData.following,
        totalRepos: userData.public_repos,
        accountAge: yearsOfExperience
    };
}

function updateQuickStats(stats) {
    // Update experience
    const experienceElement = document.querySelector('[data-target="3"]');
    if (experienceElement) {
        experienceElement.setAttribute('data-target', stats.experience);
        experienceElement.textContent = '0'; // Reset for animation
    }

    // Update projects
    const projectsElement = document.querySelector('[data-target="50"]');
    if (projectsElement) {
        projectsElement.setAttribute('data-target', stats.projects);
        projectsElement.textContent = '0'; // Reset for animation
    }

    // Update contributions
    const contributionsElement = document.querySelector('[data-target="100"]');
    if (contributionsElement) {
        contributionsElement.setAttribute('data-target', stats.contributions);
        contributionsElement.textContent = '0'; // Reset for animation
    }

    // Update achievement badges with real data
    updateAchievementBadges(stats);

    // Re-trigger the counter animations with new values
    setTimeout(() => {
        initStatsCounters();
    }, 100);
}

function updateAchievementBadges(stats) {
    const badges = document.querySelectorAll('.badge');

    if (badges.length >= 3) {
        // Update badge content with real achievements
        const achievements = [];

        if (stats.experience >= 3) {
            achievements.push({ icon: 'fas fa-star', text: 'Experienced Developer' });
        } else {
            achievements.push({ icon: 'fas fa-rocket', text: 'Rising Star' });
        }

        if (stats.projects >= 20) {
            achievements.push({ icon: 'fas fa-trophy', text: 'Project Master' });
        } else {
            achievements.push({ icon: 'fas fa-rocket', text: 'Fast Learner' });
        }

        if (stats.followers >= 10) {
            achievements.push({ icon: 'fas fa-users', text: 'Community Builder' });
        } else {
            achievements.push({ icon: 'fas fa-users', text: 'Team Player' });
        }

        // Update badges
        badges.forEach((badge, index) => {
            if (achievements[index]) {
                const icon = badge.querySelector('i');
                const text = badge.querySelector('span');

                if (icon) icon.className = achievements[index].icon;
                if (text) text.textContent = achievements[index].text;
            }
        });
    }
}

// Load GitHub projects dynamically with enhanced features
async function loadGitHubProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const username = 'Dthiwanka'; // GitHub username

    try {
        // Remove loading placeholder
        const loadingPlaceholder = document.querySelector('.loading-placeholder');
        if (loadingPlaceholder) {
            loadingPlaceholder.remove();
        }

        // Fetch repositories from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);

        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();

        // Fetch user info for additional stats
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userInfo = await userResponse.json();

        // Filter out forked repositories and add featured projects
        const featuredRepos = repos.filter(repo => !repo.fork && !repo.name.includes('.github.io'));

        // Update project statistics
        updateProjectStats(repos, userInfo);

        // Store all projects globally for filtering and sorting
        window.allProjects = featuredRepos;
        window.displayedProjects = featuredRepos.slice(0, 12); // Show first 12

        // Display initial projects
        displayProjects(window.displayedProjects);

        // Show load more section if there are more projects
        const loadMoreSection = document.getElementById('load-more-section');
        if (featuredRepos.length > 12) {
            loadMoreSection.style.display = 'block';
            updateShowingCount();
        }

        // Initialize enhanced filtering and search
        initProjectSearch();
        initProjectSorting();
        initLoadMore();

    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        projectsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to load projects</h3>
                <p>There was an issue fetching repositories from GitHub.</p>
                <a href="https://github.com/${username}" target="_blank" class="btn btn-outline">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
        `;
    }
}

function updateProjectStats(repos, userInfo) {
    const totalRepos = repos.length;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
    const totalWatchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0);

    // Animate counters
    animateCounter('total-repos', totalRepos);
    animateCounter('total-stars', totalStars);
    animateCounter('total-languages', languages.length);
    animateCounter('total-watchers', totalWatchers);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let currentValue = 0;
    const increment = targetValue / 30;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, 50);
}

function displayProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';

    if (projects.length === 0) {
        document.getElementById('no-results').style.display = 'block';
        return;
    } else {
        document.getElementById('no-results').style.display = 'none';
    }

    projects.forEach((repo, index) => {
        const projectCard = createEnhancedProjectCard(repo);
        projectsContainer.appendChild(projectCard);

        // Add staggered animation
        setTimeout(() => {
            projectCard.classList.add('fade-in-up');
        }, index * 100);
    });
}

function createEnhancedProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Determine language class for filtering
    const language = repo.language ? repo.language.toLowerCase() : 'other';
    card.classList.add(language);

    // Get language color
    const languageColor = getLanguageColor(repo.language);

    // Create topics badges
    const topicsBadges = repo.topics ? repo.topics.slice(0, 3).map(topic =>
        `<span class="topic-badge">${topic}</span>`
    ).join('') : '';

    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </h3>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" title="View Repository">
                    <i class="fab fa-github"></i>
                </a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
            </div>
        </div>
        
        <p class="project-description">${repo.description || 'No description available'}</p>
        
        ${topicsBadges ? `<div class="project-topics">${topicsBadges}</div>` : ''}
        
        <div class="project-stats">
            <span class="stat-item">
                <i class="fas fa-star"></i>
                ${repo.stargazers_count}
            </span>
            <span class="stat-item">
                <i class="fas fa-code-branch"></i>
                ${repo.forks_count}
            </span>
            <span class="stat-item">
                <i class="fas fa-eye"></i>
                ${repo.watchers_count}
            </span>
            ${repo.language ? `
                <span class="stat-item">
                    <span class="language-dot" style="background-color: ${languageColor}"></span>
                    ${repo.language}
                </span>
            ` : ''}
        </div>
        
        <div class="project-footer">
            <div class="project-meta">
                <small class="updated-date">Updated ${formatDate(repo.updated_at)}</small>
                <small class="repo-size">${formatFileSize(repo.size)}</small>
            </div>
        </div>
    `;

    return card;
}

function initProjectSearch() {
    const searchInput = document.getElementById('project-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

        let filteredProjects = window.allProjects;

        // Apply language filter
        if (activeFilter !== 'all') {
            filteredProjects = filteredProjects.filter(repo => {
                const language = repo.language ? repo.language.toLowerCase() : 'other';
                return language === activeFilter || activeFilter === 'other' && !repo.language;
            });
        }

        // Apply search filter
        if (searchTerm) {
            filteredProjects = filteredProjects.filter(repo =>
                repo.name.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
                (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(searchTerm)))
            );
        }

        window.displayedProjects = filteredProjects;
        displayProjects(window.displayedProjects);
        updateShowingCount();
    });
}

function initProjectSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        let sortedProjects = [...window.displayedProjects];

        switch (sortBy) {
            case 'stars':
                sortedProjects.sort((a, b) => b.stargazers_count - a.stargazers_count);
                break;
            case 'forks':
                sortedProjects.sort((a, b) => b.forks_count - a.forks_count);
                break;
            case 'name':
                sortedProjects.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'created':
                sortedProjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'updated':
            default:
                sortedProjects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                break;
        }

        window.displayedProjects = sortedProjects;
        displayProjects(window.displayedProjects);
    });
}

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
        const currentCount = window.displayedProjects.length;
        const newProjects = window.allProjects.slice(currentCount, currentCount + 6);

        window.displayedProjects = [...window.displayedProjects, ...newProjects];
        displayProjects(window.displayedProjects);
        updateShowingCount();

        // Hide load more button if all projects are shown
        if (window.displayedProjects.length >= window.allProjects.length) {
            document.getElementById('load-more-section').style.display = 'none';
        }
    });
}

function updateShowingCount() {
    const showingElement = document.getElementById('showing-count');
    const totalElement = document.getElementById('total-count');

    if (showingElement && totalElement) {
        showingElement.textContent = window.displayedProjects.length;
        totalElement.textContent = window.allProjects.length;
    }
}

// Enhanced project filtering functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            const filterValue = button.getAttribute('data-filter');
            const searchTerm = document.getElementById('project-search').value.toLowerCase();

            let filteredProjects = window.allProjects;

            // Apply language filter
            if (filterValue !== 'all') {
                filteredProjects = filteredProjects.filter(repo => {
                    const language = repo.language ? repo.language.toLowerCase() : 'other';
                    return language === filterValue || filterValue === 'other' && !repo.language;
                });
            }

            // Apply search filter
            if (searchTerm) {
                filteredProjects = filteredProjects.filter(repo =>
                    repo.name.toLowerCase().includes(searchTerm) ||
                    (repo.description && repo.description.toLowerCase().includes(searchTerm))
                );
            }

            window.displayedProjects = filteredProjects.slice(0, 12);
            displayProjects(window.displayedProjects);
            updateShowingCount();

            // Show/hide load more section
            const loadMoreSection = document.getElementById('load-more-section');
            loadMoreSection.style.display = filteredProjects.length > 12 ? 'block' : 'none';
        });
    });
}

function formatFileSize(sizeInKB) {
    if (sizeInKB < 1024) {
        return `${sizeInKB} KB`;
    } else if (sizeInKB < 1024 * 1024) {
        return `${(sizeInKB / 1024).toFixed(1)} MB`;
    } else {
        return `${(sizeInKB / (1024 * 1024)).toFixed(1)} GB`;
    }
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f7df1e',
        'TypeScript': '#3178c6',
        'Python': '#3776ab',
        'Java': '#ed8b00',
        'C++': '#00599c',
        'C': '#a8b9cc',
        'HTML': '#e34f26',
        'CSS': '#1572b6',
        'PHP': '#777bb4',
        'C#': '#239120',
        'React': '#61dafb'
    };
    return colors[language] || '#8b949e';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-category, .timeline-item, .stats-card, .expertise-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#238636' : '#58a6ff',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add mobile menu styles dynamically
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: rgba(13, 17, 23, 0.95);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            backdrop-filter: blur(10px);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;

// Add the mobile menu styles to the document
const style = document.createElement('style');
style.textContent = mobileMenuStyles;
document.head.appendChild(style);

// Typing effect for hero section (optional enhancement)
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Initialize typing effect if you want to use it
// initTypingEffect();

// Dev.to Articles functionality
async function loadDevToArticles() {
    const articlesContainer = document.getElementById('articles-container');
    const loadingState = document.getElementById('articles-loading');
    const noArticlesState = document.getElementById('no-articles');
    const devtoUsername = 'dthiwanka'; // Replace with your Dev.to username

    try {
        // Show loading state
        if (loadingState) loadingState.style.display = 'block';
        if (noArticlesState) noArticlesState.style.display = 'none';
        if (articlesContainer) articlesContainer.style.display = 'none';

        // Fetch articles from Dev.to API
        const response = await fetch(`https://dev.to/api/articles?username=${devtoUsername}&per_page=20`);

        let articles = [];

        if (response.ok) {
            articles = await response.json();
        }

        // Hide loading state
        if (loadingState) loadingState.style.display = 'none';

        // If no articles found, create demo data
        if (articles.length === 0) {
            articles = createDemoArticles();
        }

        // Load article stats
        await loadArticleStats(devtoUsername, articles);

        // Store articles globally for load more functionality
        window.allArticles = articles;
        window.displayedArticles = articles.slice(0, 6); // Show first 6 articles

        // Display articles
        displayArticles(window.displayedArticles);

        // Show load more button if there are more articles
        const loadMoreSection = document.getElementById('load-more-articles');
        if (articles.length > 6) {
            loadMoreSection.style.display = 'block';
            updateArticleCount();
        }

        // Initialize load more functionality
        initArticleLoadMore();

    } catch (error) {
        console.error('Error loading Dev.to articles:', error);

        // Hide loading state
        if (loadingState) loadingState.style.display = 'none';

        // Use demo articles as fallback
        const demoArticles = createDemoArticles();
        window.allArticles = demoArticles;
        window.displayedArticles = demoArticles.slice(0, 6);

        // Load demo stats
        await loadArticleStats(devtoUsername, demoArticles);

        // Display demo articles
        displayArticles(window.displayedArticles);
    }
}

// Create demo articles for showcase
function createDemoArticles() {
    return [
        {
            id: 1,
            title: "Getting Started with React Hooks",
            description: "A comprehensive guide to understanding and implementing React Hooks in your applications.",
            url: "https://dev.to/dthiwanka",
            published_at: "2024-12-01T10:00:00Z",
            tag_list: ["react", "javascript", "frontend"],
            public_reactions_count: 25,
            comments_count: 8,
            page_views_count: 1200,
            cover_image: "https://via.placeholder.com/400x200/58a6ff/ffffff?text=React+Hooks"
        },
        {
            id: 2,
            title: "Building RESTful APIs with Node.js",
            description: "Learn how to create robust and scalable APIs using Node.js and Express.js framework.",
            url: "https://dev.to/dthiwanka",
            published_at: "2024-11-15T14:30:00Z",
            tag_list: ["nodejs", "api", "backend"],
            public_reactions_count: 42,
            comments_count: 12,
            page_views_count: 2100,
            cover_image: "https://via.placeholder.com/400x200/339933/ffffff?text=Node.js+API"
        },
        {
            id: 3,
            title: "Modern CSS Grid Layout Techniques",
            description: "Explore advanced CSS Grid features and create responsive layouts that work across all devices.",
            url: "https://dev.to/dthiwanka",
            published_at: "2024-11-08T09:15:00Z",
            tag_list: ["css", "frontend", "responsive"],
            public_reactions_count: 18,
            comments_count: 5,
            page_views_count: 890,
            cover_image: "https://via.placeholder.com/400x200/1572b6/ffffff?text=CSS+Grid"
        },
        {
            id: 4,
            title: "Introduction to Machine Learning with Python",
            description: "Start your journey into AI and ML with Python. Learn the basics and build your first model.",
            url: "https://dev.to/dthiwanka",
            published_at: "2024-10-22T16:45:00Z",
            tag_list: ["python", "machinelearning", "ai"],
            public_reactions_count: 67,
            comments_count: 23,
            page_views_count: 3400,
            cover_image: "https://via.placeholder.com/400x200/3776ab/ffffff?text=ML+Python"
        },
        {
            id: 5,
            title: "Optimizing React Performance",
            description: "Advanced techniques to improve your React application's performance and user experience.",
            url: "https://dev.to/dthiwanka",
            published_at: "2024-10-10T11:20:00Z",
            tag_list: ["react", "performance", "optimization"],
            public_reactions_count: 31,
            comments_count: 9,
            page_views_count: 1650,
            cover_image: "https://via.placeholder.com/400x200/61dafb/ffffff?text=React+Performance"
        },
        {
            id: 6,
            title: "Database Design Best Practices",
            description: "Essential principles for designing efficient and maintainable database schemas.",
            url: "https://dev.to/dthiwanka",
            published_at: "2024-09-28T13:10:00Z",
            tag_list: ["database", "design", "backend"],
            public_reactions_count: 22,
            comments_count: 7,
            page_views_count: 1100,
            cover_image: "https://via.placeholder.com/400x200/336791/ffffff?text=Database+Design"
        }
    ];
} async function loadArticleStats(username, articles = null) {
    try {
        // Calculate stats from articles
        const articlesData = articles || window.allArticles || [];
        const totalViews = articlesData.reduce((sum, article) => sum + (article.page_views_count || 0), 0);
        const totalReactions = articlesData.reduce((sum, article) => sum + (article.public_reactions_count || 0), 0);
        const totalComments = articlesData.reduce((sum, article) => sum + (article.comments_count || 0), 0);

        // Try to get user stats from Dev.to API (optional)
        let followers = 50; // Default value
        try {
            const userResponse = await fetch(`https://dev.to/api/users/by_username?url=${username}`);
            if (userResponse.ok) {
                const userData = await userResponse.json();
                followers = userData.followers_count || 50;
            }
        } catch (e) {
            console.log('Could not fetch user stats, using defaults');
        }

        // Update stats in UI
        updateArticleStats({
            articles: articlesData.length,
            views: totalViews,
            reactions: totalReactions,
            comments: totalComments,
            followers: followers
        });

    } catch (error) {
        console.error('Error loading article stats:', error);
        // Use fallback stats
        updateArticleStats({
            articles: articles ? articles.length : 6,
            views: 8500,
            reactions: 205,
            comments: 64,
            followers: 50
        });
    }
}

function updateArticleStats(stats) {
    // Animate counters for article stats
    animateArticleCounter('total-articles', stats.articles);
    animateArticleCounter('total-views', stats.views);
    animateArticleCounter('total-reactions', stats.reactions);
    animateArticleCounter('total-comments', stats.comments);

    // Update Dev.to profile stats
    const followersElement = document.getElementById('devto-followers');
    const articlesElement = document.getElementById('devto-articles');

    if (followersElement) {
        animateArticleCounter('devto-followers', stats.followers);
    }
    if (articlesElement) {
        animateArticleCounter('devto-articles', stats.articles);
    }
}

function animateArticleCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let currentValue = 0;
    const increment = targetValue / 30;
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * targetValue);

        if (targetValue > 1000) {
            // Format large numbers with K suffix
            element.textContent = current > 1000 ? `${(current / 1000).toFixed(1)}K` : current;
        } else {
            element.textContent = current;
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            if (targetValue > 1000) {
                element.textContent = targetValue > 1000 ? `${(targetValue / 1000).toFixed(1)}K` : targetValue;
            } else {
                element.textContent = targetValue;
            }
        }
    };

    requestAnimationFrame(updateCounter);
}

function displayArticles(articles) {
    const articlesContainer = document.getElementById('articles-container');
    if (!articlesContainer) return;

    articlesContainer.innerHTML = '';
    articlesContainer.style.display = 'grid';

    articles.forEach((article, index) => {
        const articleCard = createArticleCard(article);
        articlesContainer.appendChild(articleCard);

        // Add staggered animation
        setTimeout(() => {
            articleCard.classList.add('fade-in-up');
        }, index * 100);
    });
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.setAttribute('data-article-id', article.id);

    // Format date
    const publishedDate = new Date(article.published_at);
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Calculate reading time (estimate based on body length)
    const readingTime = Math.max(1, Math.ceil((article.description || '').length / 1000));

    // Create tags
    const tags = article.tag_list.slice(0, 3).map(tag =>
        `<span class="article-tag">#${tag}</span>`
    ).join('');

    // Get cover image or use placeholder
    const coverImage = article.cover_image || article.social_image || 'https://via.placeholder.com/400x200/21262d/8b949e?text=Article';

    card.innerHTML = `
        <img src="${coverImage}" alt="${article.title}" class="article-image" loading="lazy">
        
        <div class="article-content">
            <div class="article-header">
                <div class="article-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${formattedDate}
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-description">${article.description || 'Exploring new ideas and sharing insights about development, technology, and innovation.'}</p>
            </div>
            
            ${tags ? `<div class="article-tags">${tags}</div>` : ''}
            
            <div class="article-footer">
                <div class="article-stats">
                    <div class="article-stat">
                        <i class="fas fa-heart"></i>
                        <span>${article.public_reactions_count || 0}</span>
                    </div>
                    <div class="article-stat">
                        <i class="fas fa-comment"></i>
                        <span>${article.comments_count || 0}</span>
                    </div>
                    <div class="article-stat">
                        <i class="fas fa-eye"></i>
                        <span>${article.page_views_count || 0}</span>
                    </div>
                </div>
                
                <div class="article-read-time">
                    <i class="fas fa-clock"></i>
                    <span>${readingTime} min read</span>
                </div>
            </div>
        </div>
    `;

    // Add click handler to open article
    card.addEventListener('click', () => {
        window.open(article.url, '_blank');
    });

    // Add hover effects
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });

    return card;
}

function initArticleLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-articles-btn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
        const currentCount = window.displayedArticles.length;
        const newArticles = window.allArticles.slice(currentCount, currentCount + 3);

        window.displayedArticles = [...window.displayedArticles, ...newArticles];

        // Get current articles and add new ones with animation
        const articlesContainer = document.getElementById('articles-container');
        const currentCards = articlesContainer.children.length;

        newArticles.forEach((article, index) => {
            const articleCard = createArticleCard(article);
            articlesContainer.appendChild(articleCard);

            // Add staggered animation for new cards
            setTimeout(() => {
                articleCard.classList.add('fade-in-up');
            }, index * 150);
        });

        updateArticleCount();

        // Hide load more button if all articles are shown
        if (window.displayedArticles.length >= window.allArticles.length) {
            document.getElementById('load-more-articles').style.display = 'none';
        }

        // Update button text with loading state
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;

        setTimeout(() => {
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Articles';
            loadMoreBtn.disabled = false;
        }, 500);
    });
}

function updateArticleCount() {
    const showingElement = document.getElementById('showing-articles');
    const totalElement = document.getElementById('total-articles-count');

    if (showingElement && totalElement && window.allArticles) {
        showingElement.textContent = window.displayedArticles.length;
        totalElement.textContent = window.allArticles.length;
    }
}

// Initialize articles when DOM is loaded
function initArticles() {
    // Add intersection observer for articles section
    const articlesSection = document.getElementById('articles');
    if (!articlesSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load articles when section comes into view
                loadDevToArticles();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px'
    });

    observer.observe(articlesSection);
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll progress functionality
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) {
        // Create scroll progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress-container';
        progressContainer.innerHTML = '<div id="scroll-progress" class="scroll-progress"></div>';
        document.body.appendChild(progressContainer);
    }

    const scrollProgressBar = document.getElementById('scroll-progress');
    const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollCurrent = window.pageYOffset;
    const progress = Math.min((scrollCurrent / scrollTotal) * 100, 100);

    if (scrollProgressBar) {
        scrollProgressBar.style.width = progress + '%';
    }
}

// Theme detection functionality
function initThemeDetection() {
    // Detect system theme preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Apply theme based on system preference
    function applyTheme(isDark) {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    // Initial theme application
    applyTheme(prefersDarkScheme.matches);

    // Listen for theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        applyTheme(e.matches);
    });
}

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Error handling for failed image loads
function initImageErrorHandling() {
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'https://via.placeholder.com/400x200/21262d/8b949e?text=Image+Not+Found';
        }
    }, true);
}

// Initialize additional features
initLazyLoading();
initImageErrorHandling();

// Console welcome message
console.log(`
🚀 Welcome to Dulthiwanka's Portfolio!

Built with:
• HTML5 & CSS3
• Vanilla JavaScript
• GitHub API
• Dev.to API
• Font Awesome Icons
• Google Fonts

Feel free to explore the code and reach out!
GitHub: https://github.com/Dthiwanka
Dev.to: https://dev.to/dthiwanka
`);

