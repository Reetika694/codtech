// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const bars = mobileMenu.querySelectorAll('.bar');
        bars[0].style.transform = navMenu.classList.contains('active') 
            ? 'rotate(-45deg) translate(-5px, 6px)' : '';
        bars[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        bars[2].style.transform = navMenu.classList.contains('active') 
            ? 'rotate(45deg) translate(-5px, -6px)' : '';
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
        }
    });
});

// Course Data
const courseData = {
    1: {
        title: "Web Development Fundamentals",
        description: "Learn HTML, CSS, and JavaScript from scratch",
        videoId: "pQN-pnXPaVg",
        progress: 10,
        currentLesson: 1,
        totalLessons: 10
    },
    2: {
        title: "Python Programming Mastery",
        description: "Master Python programming with hands-on projects",
        videoId: "kqtD5dpn9C8",
        progress: 25,
        currentLesson: 3,
        totalLessons: 12
    },
    3: {
        title: "Data Science & Machine Learning",
        description: "Dive into data science and machine learning",
        videoId: "7eh4d6sabA0",
        progress: 0,
        currentLesson: 1,
        totalLessons: 15
    },
    4: {
        title: "UI/UX Design Principles",
        description: "Create stunning user interfaces and experiences",
        videoId: "c9Wg6Cb_YlU",
        progress: 60,
        currentLesson: 7,
        totalLessons: 12
    }
};

// Load Course Data on Course Page
if (window.location.pathname.includes('course.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id') || 1;
    const course = courseData[courseId];
    
    if (course) {
        // Update course information
        document.getElementById('course-name').textContent = course.title;
        document.getElementById('course-title').textContent = course.title;
        document.getElementById('course-description').textContent = course.description;
        
        // Update video
        const videoFrame = document.getElementById('course-video');
        videoFrame.src = `https://www.youtube.com/embed/${course.videoId}`;
        
        // Update progress
        document.getElementById('course-progress').style.width = course.progress + '%';
        document.getElementById('progress-percentage').textContent = course.progress + '% Complete';
        
        // Update lesson info
        const progressInfo = document.querySelector('.progress-info span');
        progressInfo.textContent = `Lesson ${course.currentLesson} of ${course.totalLessons}`;
    }
}

// Mark Lesson as Complete
function markComplete() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id') || 0;
    const course = courseData[courseId];
    
    if (course && course.progress < 100) {
        // Increment progress
        const progressIncrement = Math.floor(100 / course.totalLessons);
        course.progress = Math.min(course.progress + progressIncrement, 100);
        
        // Update progress bar
        const progressBar = document.getElementById('course-progress');
        progressBar.style.width = course.progress + '%';
        document.getElementById('progress-percentage').textContent = course.progress + '% Complete';
        
        // Save to localStorage
        saveCourseProgress(courseId, course.progress);
        
        // Show success message
        showNotification('Lesson marked as complete!', 'success');
        
        // Update current lesson
        if (course.currentLesson < course.totalLessons) {
            course.currentLesson++;
            updateModuleStatus(course.currentLesson);
        }
        
        // Enable next button if not last lesson
        const nextBtn = document.querySelector('.course-navigation .btn-primary');
        if (course.currentLesson === course.totalLessons) {
            nextBtn.textContent = 'Complete Course';
            nextBtn.onclick = () => completeCourse(courseId);
        }
    }
}

// Update Module Status
function updateModuleStatus(currentLesson) {
    const modules = document.querySelectorAll('.module-item');
    modules.forEach((module, index) => {
        if (index < currentLesson - 1) {
            module.classList.add('completed');
            module.classList.remove('active');
            module.querySelector('i').className = 'fas fa-check-circle';
        } else if (index === currentLesson - 1) {
            module.classList.add('active');
            module.classList.remove('completed');
            module.querySelector('i').className = 'fas fa-play-circle';
        } else {
            module.classList.remove('active', 'completed');
            module.querySelector('i').className = 'far fa-circle';
        }
    });
}

// Save Progress to LocalStorage
function saveCourseProgress(courseId, progress) {
    let courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    courseProgress[courseId] = progress;
    localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
}

// Load Progress from LocalStorage
function loadCourseProgress() {
    const savedProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    
    // Update progress on homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        Object.keys(savedProgress).forEach(courseId => {
            const progressBar = document.querySelector(`a[href="course.html?id=${courseId}"]`)
                ?.closest('.course-card')
                ?.querySelector('.progress-bar');
            
            if (progressBar) {
                progressBar.style.width = savedProgress[courseId] + '%';
                const progressText = progressBar.parentElement.nextElementSibling;
                progressText.textContent = savedProgress[courseId] + '% Complete';
                
                // Update button text
                const btn = progressBar.closest('.course-card').querySelector('.btn-course');
                if (savedProgress[courseId] > 0) {
                    btn.textContent = 'Continue Course';
                }
            }
        });
    }
}

// Complete Course
function completeCourse(courseId) {
    showNotification('Congratulations! You\'ve completed the course!', 'success');
    
    // Add certificate animation
    showCertificate(courseData[courseId].title);
    
    // Save completion
    let completedCourses = JSON.parse(localStorage.getItem('completedCourses') || '[]');
    if (!completedCourses.includes(courseId)) {
        completedCourses.push(courseId);
        localStorage.setItem('completedCourses', JSON.stringify(completedCourses));
    }
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show Certificate Modal
function showCertificate(courseName) {
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
        <div class="certificate">
            <h2>Certificate of Completion</h2>
            <p>This certifies that</p>
            <h3>${getUserName()}</h3>
            <p>has successfully completed</p>
            <h4>${courseName}</h4>
            <p>on ${new Date().toLocaleDateString()}</p>
            <div class="certificate-footer">
                <div>
                    <img src="https://via.placeholder.com/100x50/4F46E5/ffffff?text=Signature" alt="Signature">
                    <p>Instructor</p>
                </div>
                <div>
                    <i class="fas fa-award" style="font-size: 3rem; color: #F59E0B;"></i>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Get User Name (for demo purposes)
function getUserName() {
    return localStorage.getItem('userName') || 'Student';
}

// Handle Module Clicks
document.addEventListener('DOMContentLoaded', () => {
    // Load saved progress
    loadCourseProgress();
    
    // Add click handlers to modules
    const modules = document.querySelectorAll('.module-item');
    modules.forEach((module, index) => {
        module.style.cursor = 'pointer';
        module.addEventListener('click', () => {
            if (!module.classList.contains('active')) {
                showNotification('Complete the current lesson first!', 'warning');
            }
        });
    });
    
    // Add navigation functionality
    const prevBtn = document.querySelector('.course-navigation .btn-secondary');
    const nextBtn = document.querySelector('.course-navigation .btn-primary');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get('id') || 1;
            const course = courseData[courseId];
            
            if (course.currentLesson > 1) {
                course.currentLesson--;
                updateModuleStatus(course.currentLesson);
                showNotification('Previous lesson loaded', 'info');
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get('id') || 1;
            const course = courseData[courseId];
            
            if (course.currentLesson < course.totalLessons) {
                course.currentLesson++;
                updateModuleStatus(course.currentLesson);
                showNotification('Next lesson loaded', 'info');
                
                // Update button states
                prevBtn.disabled = false;
                if (course.currentLesson === course.totalLessons) {
                    nextBtn.textContent = 'Complete Course';
                    nextBtn.onclick = () => completeCourse(courseId);
                }
            }
        });
    }
});

// Add Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe course cards
document.querySelectorAll('.course-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});