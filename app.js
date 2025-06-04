// MoodTracker Game - JavaScript Implementation

class MoodTracker {
    constructor() {
        // Application data (using in-memory storage instead of localStorage)
        this.data = {
            user: {
                totalPoints: 0,
                currentLevel: 1,
                currentStreak: 0,
                totalCheckins: 0,
                unlockedAchievements: [],
                lastCheckinDate: null
            },
            entries: [],
            achievements: [
                {"id": "first_checkin", "name": "First Steps", "description": "Complete your first mood check-in", "icon": "🎯", "points": 10},
                {"id": "streak_7", "name": "Week Warrior", "description": "Maintain a 7-day streak", "icon": "🔥", "points": 50},
                {"id": "streak_30", "name": "Monthly Master", "description": "Maintain a 30-day streak", "icon": "👑", "points": 200},
                {"id": "level_5", "name": "Rising Star", "description": "Reach level 5", "icon": "⭐", "points": 100},
                {"id": "mood_master", "name": "Mood Master", "description": "Complete 100 check-ins", "icon": "🧘", "points": 500}
            ],
            moods: [
                {"id": "very_happy", "emoji": "😄", "label": "Very Happy", "points": 5, "color": "#4CAF50"},
                {"id": "happy", "emoji": "😊", "label": "Happy", "points": 4, "color": "#8BC34A"},
                {"id": "neutral", "emoji": "😐", "label": "Neutral", "points": 3, "color": "#9E9E9E"},
                {"id": "sad", "emoji": "😟", "label": "Sad", "points": 2, "color": "#FF9800"},
                {"id": "very_sad", "emoji": "😢", "label": "Very Sad", "points": 1, "color": "#F44336"}
            ],
            challenges: [
                {"id": "positive_week", "name": "Positive Week", "description": "Log happy moods for 3 days this week", "reward": 30},
                {"id": "consistency", "name": "Consistency Champion", "description": "Check in every day this week", "reward": 50},
                {"id": "reflection", "name": "Reflective Soul", "description": "Add notes to 5 mood entries", "reward": 25}
            ],
            tips: [
                "Remember that all emotions are valid and temporary",
                "Try deep breathing when feeling overwhelmed",
                "Celebrate small wins and progress",
                "Consider what activities make you feel better",
                "Tracking patterns can help identify triggers"
            ],
            levels: [
                {"level": 1, "pointsRequired": 0, "title": "Beginner", "color": "#E3F2FD"},
                {"level": 2, "pointsRequired": 50, "title": "Explorer", "color": "#BBDEFB"},
                {"level": 3, "pointsRequired": 150, "title": "Tracker", "color": "#90CAF9"},
                {"level": 4, "pointsRequired": 300, "title": "Analyst", "color": "#64B5F6"},
                {"level": 5, "pointsRequired": 500, "title": "Master", "color": "#42A5F5"}
            ]
        };

        this.currentDate = new Date();
        this.selectedMood = null;
        this.currentTab = 'dashboard';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.generateMoodSelection();
        this.updateCalendar();
        this.updateAchievements();
        this.updateStats();
        this.showDailyTip();
        this.initMoodGarden();
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('start-tracking').addEventListener('click', () => {
            this.showScreen('main-app');
        });

        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Quick check-in button
        document.getElementById('quick-checkin').addEventListener('click', () => {
            this.switchTab('checkin');
        });

        // Mood selection
        document.getElementById('mood-selection').addEventListener('click', (e) => {
            const moodButton = e.target.closest('.mood-button');
            if (moodButton) {
                this.selectMood(moodButton.dataset.moodId);
            }
        });

        // Submit check-in
        document.getElementById('submit-checkin').addEventListener('click', () => {
            this.submitCheckin();
        });

        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.changeMonth(-1);
        });
        document.getElementById('next-month').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Achievement modal
        document.getElementById('close-achievement').addEventListener('click', () => {
            this.closeAchievementModal();
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    switchTab(tabId) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');

        this.currentTab = tabId;

        // Update content based on tab
        if (tabId === 'dashboard') this.updateDashboard();
        if (tabId === 'calendar') this.updateCalendar();
        if (tabId === 'achievements') this.updateAchievements();
        if (tabId === 'stats') this.updateStats();
    }

    generateMoodSelection() {
        const container = document.getElementById('mood-selection');
        container.innerHTML = '';

        this.data.moods.forEach(mood => {
            const button = document.createElement('button');
            button.className = 'mood-button';
            button.dataset.moodId = mood.id;
            button.style.borderColor = mood.color;
            
            button.innerHTML = `
                <span class="mood-emoji-large">${mood.emoji}</span>
                <span class="mood-label">${mood.label}</span>
            `;
            
            container.appendChild(button);
        });
    }

    selectMood(moodId) {
        this.selectedMood = moodId;
        
        document.querySelectorAll('.mood-button').forEach(button => {
            button.classList.remove('selected');
        });
        
        const selectedButton = document.querySelector(`[data-mood-id="${moodId}"]`);
        selectedButton.classList.add('selected');
        
        const mood = this.data.moods.find(m => m.id === moodId);
        selectedButton.style.borderColor = mood.color;
        selectedButton.style.backgroundColor = mood.color + '20';
        
        document.getElementById('submit-checkin').disabled = false;
    }

    submitCheckin() {
        if (!this.selectedMood) return;

        const mood = this.data.moods.find(m => m.id === this.selectedMood);
        const notes = document.getElementById('mood-notes').value;
        const today = new Date().toDateString();

        // Create entry
        const entry = {
            date: today,
            moodId: this.selectedMood,
            mood: mood,
            notes: notes,
            points: mood.points,
            timestamp: new Date()
        };

        // Check if already checked in today
        const existingEntry = this.data.entries.find(e => e.date === today);
        if (existingEntry) {
            // Update existing entry
            Object.assign(existingEntry, entry);
            this.showNotification('Mood updated for today!', 'success');
        } else {
            // Add new entry
            this.data.entries.push(entry);
            this.data.user.totalCheckins++;
            this.updateStreak();
            this.showNotification('Mood checked in successfully!', 'success');
        }

        // Update points and level
        this.data.user.totalPoints += mood.points;
        this.updateLevel();
        this.data.user.lastCheckinDate = today;

        // Check achievements
        this.checkAchievements();

        // Reset form
        this.selectedMood = null;
        document.querySelectorAll('.mood-button').forEach(button => {
            button.classList.remove('selected');
            button.style.backgroundColor = '';
        });
        document.getElementById('mood-notes').value = '';
        document.getElementById('submit-checkin').disabled = true;

        // Update UI
        this.updateDashboard();
        this.updateMoodGarden();
        this.switchTab('dashboard');
    }

    updateStreak() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayEntry = this.data.entries.find(e => e.date === today.toDateString());
        const yesterdayEntry = this.data.entries.find(e => e.date === yesterday.toDateString());

        if (todayEntry && yesterdayEntry) {
            this.data.user.currentStreak++;
        } else if (todayEntry && !yesterdayEntry) {
            this.data.user.currentStreak = 1;
        }
    }

    updateLevel() {
        const currentPoints = this.data.user.totalPoints;
        let newLevel = 1;

        for (let i = this.data.levels.length - 1; i >= 0; i--) {
            if (currentPoints >= this.data.levels[i].pointsRequired) {
                newLevel = this.data.levels[i].level;
                break;
            }
        }

        if (newLevel > this.data.user.currentLevel) {
            this.data.user.currentLevel = newLevel;
            this.showNotification(`Level up! You're now a ${this.data.levels[newLevel - 1].title}!`, 'success');
        }
    }

    checkAchievements() {
        const newAchievements = [];

        this.data.achievements.forEach(achievement => {
            if (this.data.user.unlockedAchievements.includes(achievement.id)) return;

            let unlocked = false;

            switch (achievement.id) {
                case 'first_checkin':
                    unlocked = this.data.user.totalCheckins >= 1;
                    break;
                case 'streak_7':
                    unlocked = this.data.user.currentStreak >= 7;
                    break;
                case 'streak_30':
                    unlocked = this.data.user.currentStreak >= 30;
                    break;
                case 'level_5':
                    unlocked = this.data.user.currentLevel >= 5;
                    break;
                case 'mood_master':
                    unlocked = this.data.user.totalCheckins >= 100;
                    break;
            }

            if (unlocked) {
                this.data.user.unlockedAchievements.push(achievement.id);
                this.data.user.totalPoints += achievement.points;
                newAchievements.push(achievement);
            }
        });

        // Show achievement modals
        newAchievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showAchievementModal(achievement);
            }, index * 1000);
        });
    }

    showAchievementModal(achievement) {
        document.getElementById('modal-achievement-icon').textContent = achievement.icon;
        document.getElementById('modal-achievement-name').textContent = achievement.name;
        document.getElementById('modal-achievement-description').textContent = achievement.description;
        document.getElementById('modal-achievement-points').textContent = achievement.points;
        document.getElementById('achievement-modal').classList.add('active');
    }

    closeAchievementModal() {
        document.getElementById('achievement-modal').classList.remove('active');
    }

    updateDashboard() {
        // Update stats
        document.getElementById('current-level').textContent = this.data.user.currentLevel;
        document.getElementById('total-points').textContent = this.data.user.totalPoints;
        document.getElementById('current-streak').textContent = this.data.user.currentStreak;
        document.getElementById('total-checkins').textContent = this.data.user.totalCheckins;

        // Update level progress
        const currentLevelData = this.data.levels[this.data.user.currentLevel - 1];
        const nextLevelData = this.data.levels[this.data.user.currentLevel];
        
        if (nextLevelData) {
            const progress = ((this.data.user.totalPoints - currentLevelData.pointsRequired) / 
                             (nextLevelData.pointsRequired - currentLevelData.pointsRequired)) * 100;
            document.getElementById('level-progress').style.width = `${Math.min(progress, 100)}%`;
            document.getElementById('level-progress-text').textContent = 
                `${this.data.user.totalPoints}/${nextLevelData.pointsRequired} points to next level`;
        } else {
            document.getElementById('level-progress').style.width = '100%';
            document.getElementById('level-progress-text').textContent = 'Max level reached!';
        }

        // Update today's mood
        this.updateTodayMood();

        // Update recent achievements
        this.updateRecentAchievements();
    }

    updateTodayMood() {
        const today = new Date().toDateString();
        const todayEntry = this.data.entries.find(e => e.date === today);
        const container = document.getElementById('today-mood');

        if (todayEntry) {
            container.innerHTML = `
                <span class="mood-emoji">${todayEntry.mood.emoji}</span>
                <p>Feeling ${todayEntry.mood.label}</p>
                <p class="progress-text">+${todayEntry.mood.points} points earned</p>
            `;
        } else {
            container.innerHTML = `
                <span class="mood-emoji">🤔</span>
                <p>Haven't checked in today</p>
                <button class="btn btn--primary" id="quick-checkin">Check In Now</button>
            `;
            // Re-add event listener
            document.getElementById('quick-checkin').addEventListener('click', () => {
                this.switchTab('checkin');
            });
        }
    }

    updateRecentAchievements() {
        const container = document.getElementById('recent-achievements');
        const unlockedAchievements = this.data.achievements.filter(a => 
            this.data.user.unlockedAchievements.includes(a.id)
        );

        if (unlockedAchievements.length === 0) {
            container.innerHTML = '<p class="empty-state">Complete your first check-in to start earning achievements!</p>';
            return;
        }

        container.innerHTML = unlockedAchievements.slice(-3).map(achievement => `
            <div class="achievement-list-item">
                <span class="achievement-list-icon">${achievement.icon}</span>
                <div>
                    <strong>${achievement.name}</strong>
                    <p class="progress-text">${achievement.description}</p>
                </div>
            </div>
        `).join('');
    }

    updateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        document.getElementById('current-month-year').textContent = 
            this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const container = document.getElementById('calendar-grid');
        container.innerHTML = '';

        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            container.appendChild(header);
        });

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day inactive';
            container.appendChild(emptyDay);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const date = new Date(year, month, day).toDateString();
            const entry = this.data.entries.find(e => e.date === date);
            
            dayElement.innerHTML = `
                <span class="calendar-day-number">${day}</span>
                ${entry ? `<span class="calendar-day-emoji">${entry.mood.emoji}</span>` : ''}
            `;
            
            container.appendChild(dayElement);
        }

        // Update legend
        this.updateCalendarLegend();
    }

    updateCalendarLegend() {
        const container = document.getElementById('mood-legend');
        container.innerHTML = this.data.moods.map(mood => `
            <div class="legend-item">
                <span>${mood.emoji}</span>
                <span>${mood.label}</span>
            </div>
        `).join('');
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.updateCalendar();
    }

    updateAchievements() {
        const container = document.getElementById('achievements-grid');
        container.innerHTML = this.data.achievements.map(achievement => {
            const unlocked = this.data.user.unlockedAchievements.includes(achievement.id);
            return `
                <div class="achievement-item ${unlocked ? '' : 'locked'}">
                    <span class="achievement-points">+${achievement.points}</span>
                    <span class="achievement-icon">${achievement.icon}</span>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    ${unlocked ? '<span class="status status--success">Unlocked</span>' : 
                                '<span class="status status--info">Locked</span>'}
                </div>
            `;
        }).join('');

        // Update challenges
        const challengesContainer = document.getElementById('challenges-list');
        challengesContainer.innerHTML = this.data.challenges.map(challenge => `
            <div class="challenge-item">
                <span class="challenge-reward">+${challenge.reward} pts</span>
                <h4>${challenge.name}</h4>
                <p>${challenge.description}</p>
            </div>
        `).join('');
    }

    updateStats() {
        this.drawMoodChart();
        this.drawTrendChart();
        this.updateInsights();
    }

    drawMoodChart() {
        const canvas = document.getElementById('mood-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate mood distribution
        const moodCounts = {};
        this.data.moods.forEach(mood => {
            moodCounts[mood.id] = this.data.entries.filter(e => e.moodId === mood.id).length;
        });

        const total = Object.values(moodCounts).reduce((a, b) => a + b, 0);
        if (total === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.fillText('No data yet', canvas.width / 2 - 40, canvas.height / 2);
            return;
        }

        // Draw pie chart
        let currentAngle = 0;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;

        this.data.moods.forEach((mood, index) => {
            const count = moodCounts[mood.id];
            const percentage = count / total;
            const angle = percentage * 2 * Math.PI;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = mood.color;
            ctx.fill();

            // Draw label
            if (percentage > 0.05) {
                const labelAngle = currentAngle + angle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius / 1.5);
                const labelY = centerY + Math.sin(labelAngle) * (radius / 1.5);
                
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(mood.emoji, labelX, labelY);
            }

            currentAngle += angle;
        });
    }

    drawTrendChart() {
        const canvas = document.getElementById('trend-chart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.data.entries.length < 2) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.fillText('Need more data', canvas.width / 2 - 60, canvas.height / 2);
            return;
        }

        // Get last 7 days of data
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const entry = this.data.entries.find(e => e.date === dateStr);
            last7Days.push({
                date: dateStr,
                points: entry ? entry.mood.points : 0
            });
        }

        // Draw line chart
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const stepX = chartWidth / 6;
        const maxPoints = 5;

        ctx.beginPath();
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 3;

        last7Days.forEach((day, index) => {
            const x = padding + index * stepX;
            const y = padding + chartHeight - (day.points / maxPoints) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            // Draw point
            ctx.fillStyle = '#2196F3';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        ctx.stroke();

        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
    }

    updateInsights() {
        const container = document.getElementById('mood-insights');
        
        if (this.data.entries.length < 3) {
            container.innerHTML = '<p class="empty-state">Track more moods to see insights!</p>';
            return;
        }

        const insights = [];

        // Most common mood
        const moodCounts = {};
        this.data.entries.forEach(entry => {
            moodCounts[entry.moodId] = (moodCounts[entry.moodId] || 0) + 1;
        });

        const mostCommonMoodId = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );
        const mostCommonMood = this.data.moods.find(m => m.id === mostCommonMoodId);

        insights.push(`Your most common mood is ${mostCommonMood.emoji} ${mostCommonMood.label}`);

        // Average mood score
        const averageScore = this.data.entries.reduce((sum, entry) => sum + entry.mood.points, 0) / this.data.entries.length;
        insights.push(`Your average mood score is ${averageScore.toFixed(1)}/5.0`);

        // Streak insight
        if (this.data.user.currentStreak > 0) {
            insights.push(`You're on a ${this.data.user.currentStreak}-day tracking streak! 🔥`);
        }

        container.innerHTML = insights.map(insight => `
            <div class="insight-item">${insight}</div>
        `).join('');
    }

    showDailyTip() {
        const tip = this.data.tips[Math.floor(Math.random() * this.data.tips.length)];
        document.getElementById('daily-tip').textContent = tip;
    }

    initMoodGarden() {
        this.gardenCanvas = document.getElementById('garden-canvas');
        this.gardenCtx = this.gardenCanvas.getContext('2d');
        this.updateMoodGarden();
    }

    updateMoodGarden() {
        const ctx = this.gardenCtx;
        const canvas = this.gardenCanvas;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
        
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

        // Count positive moods (4+ points)
        const positiveMoods = this.data.entries.filter(e => e.mood.points >= 4).length;
        
        // Draw flowers based on positive moods
        for (let i = 0; i < Math.min(positiveMoods, 10); i++) {
            this.drawFlower(ctx, 30 + i * 25, canvas.height - 30);
        }

        // Draw sun if streak > 3
        if (this.data.user.currentStreak > 3) {
            this.drawSun(ctx, canvas.width - 50, 50);
        }
    }

    drawFlower(ctx, x, y) {
        // Stem
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 20);
        ctx.stroke();

        // Petals
        ctx.fillStyle = '#FF69B4';
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5;
            const petalX = x + Math.cos(angle) * 8;
            const petalY = y - 20 + Math.sin(angle) * 8;
            ctx.beginPath();
            ctx.arc(petalX, petalY, 4, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Center
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y - 20, 3, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawSun(ctx, x, y) {
        // Sun body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();

        // Sun rays
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i * 2 * Math.PI) / 8;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * 25, y + Math.sin(angle) * 25);
            ctx.lineTo(x + Math.cos(angle) * 35, y + Math.sin(angle) * 35);
            ctx.stroke();
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodTracker = new MoodTracker();
});