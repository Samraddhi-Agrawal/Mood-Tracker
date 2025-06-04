# Mood Tracker Game Ideas - HTML, CSS & JavaScript

## Core Game Mechanics

### 1. Basic Mood Selection Interface
```javascript
// Simple mood tracking with emoji selection
const moods = [
    { id: 'happy', emoji: '😄', label: 'Happy', points: 5, color: '#4CAF50' },
    { id: 'good', emoji: '😊', label: 'Good', points: 4, color: '#8BC34A' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', points: 3, color: '#9E9E9E' },
    { id: 'sad', emoji: '😟', label: 'Sad', points: 2, color: '#FF9800' },
    { id: 'angry', emoji: '😢', label: 'Very Sad', points: 1, color: '#F44336' }
];

function createMoodSelector() {
    const container = document.createElement('div');
    container.className = 'mood-selector';
    
    moods.forEach(mood => {
        const button = document.createElement('button');
        button.className = 'mood-btn';
        button.innerHTML = `<span class="emoji">${mood.emoji}</span><span class="label">${mood.label}</span>`;
        button.style.setProperty('--mood-color', mood.color);
        button.addEventListener('click', () => selectMood(mood));
        container.appendChild(button);
    });
    
    return container;
}
```

### 2. Point System & Leveling
```javascript
class MoodGameProgress {
    constructor() {
        this.totalPoints = 0;
        this.currentLevel = 1;
        this.streakDays = 0;
        this.achievements = new Set();
    }
    
    addMoodEntry(moodPoints) {
        this.totalPoints += moodPoints;
        this.updateStreak();
        this.checkLevelUp();
        this.checkAchievements();
        this.saveProgress();
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastEntry = this.getLastEntryDate();
        
        if (this.isConsecutiveDay(lastEntry, today)) {
            this.streakDays++;
        } else if (lastEntry !== today) {
            this.streakDays = 1; // Reset streak
        }
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.totalPoints / 100) + 1;
        if (newLevel > this.currentLevel) {
            this.currentLevel = newLevel;
            this.showLevelUpAnimation();
        }
    }
}
```

### 3. Achievement System
```javascript
const achievements = [
    {
        id: 'first_checkin',
        name: 'First Steps',
        description: 'Complete your first mood check-in',
        icon: '🎯',
        condition: (data) => data.totalCheckins >= 1
    },
    {
        id: 'streak_week',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        condition: (data) => data.streakDays >= 7
    },
    {
        id: 'positive_month',
        name: 'Sunshine Seeker',
        description: 'Log 20 happy moods in a month',
        icon: '☀️',
        condition: (data) => data.monthlyHappyCount >= 20
    }
];

function checkUnlockedAchievements(gameData) {
    achievements.forEach(achievement => {
        if (!gameData.unlockedAchievements.includes(achievement.id) && 
            achievement.condition(gameData)) {
            unlockAchievement(achievement);
        }
    });
}
```

## Interactive UI Components

### 4. Animated Mood Calendar
```css
.mood-calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    padding: 20px;
}

.calendar-day {
    aspect-ratio: 1;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.calendar-day.has-mood {
    border-color: var(--mood-color);
    background: linear-gradient(135deg, var(--mood-color)20, transparent);
    transform: scale(1.05);
}

.calendar-day:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.calendar-day.today {
    animation: pulse 2s infinite;
}
```

### 5. Progress Visualization
```javascript
class ProgressVisualizer {
    static createStreakMeter(currentStreak, maxStreak = 30) {
        const container = document.createElement('div');
        container.className = 'streak-meter';
        
        const progress = Math.min(currentStreak / maxStreak, 1) * 100;
        
        container.innerHTML = `
            <div class="streak-label">🔥 ${currentStreak} Day Streak</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="streak-milestones">
                <span class="milestone ${currentStreak >= 7 ? 'reached' : ''}">7</span>
                <span class="milestone ${currentStreak >= 14 ? 'reached' : ''}">14</span>
                <span class="milestone ${currentStreak >= 30 ? 'reached' : ''}">30</span>
            </div>
        `;
        
        return container;
    }
    
    static createMoodTrendChart(moodHistory) {
        // Simple canvas-based mood trend visualization
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        
        // Draw trend line based on recent mood data
        const gradient = ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
        gradient.addColorStop(1, 'rgba(76, 175, 80, 0.1)');
        
        // Implementation of mood trend visualization...
        return canvas;
    }
}
```

## Game Mechanics Ideas

### 6. Mood Garden Growth System
```javascript
class MoodGarden {
    constructor() {
        this.plants = [];
        this.gardenLevel = 1;
        this.happiness = 0;
    }
    
    updateGarden(moodEntry) {
        // Plants grow based on positive moods
        if (moodEntry.points >= 4) {
            this.happiness += moodEntry.points;
            this.growPlants();
        }
        
        // Add new plants at milestones
        if (this.happiness >= this.getNextPlantThreshold()) {
            this.addNewPlant();
        }
    }
    
    growPlants() {
        this.plants.forEach(plant => {
            if (plant.stage < 3) {
                plant.stage++;
                this.animatePlantGrowth(plant);
            }
        });
    }
    
    addNewPlant() {
        const plantTypes = ['🌱', '🌿', '🌸', '🌻', '🌳'];
        const newPlant = {
            id: Date.now(),
            type: plantTypes[Math.floor(Math.random() * plantTypes.length)],
            stage: 1,
            position: this.getRandomPosition()
        };
        this.plants.push(newPlant);
        this.renderGarden();
    }
}
```

### 7. Daily Challenges System
```javascript
const dailyChallenges = [
    {
        id: 'gratitude',
        title: 'Gratitude Practice',
        description: 'List 3 things you\'re grateful for today',
        points: 10,
        type: 'reflection'
    },
    {
        id: 'mood_consistency',
        title: 'Steady Mood',
        description: 'Maintain the same mood rating for 3 consecutive hours',
        points: 15,
        type: 'tracking'
    },
    {
        id: 'positive_action',
        title: 'Mood Booster',
        description: 'Do one activity that makes you happy',
        points: 20,
        type: 'action'
    }
];

class ChallengeManager {
    static getDailyChallenge() {
        const today = new Date().toDateString();
        const challengeIndex = this.hashDate(today) % dailyChallenges.length;
        return dailyChallenges[challengeIndex];
    }
    
    static completeChallenge(challengeId, userResponse) {
        const challenge = dailyChallenges.find(c => c.id === challengeId);
        if (challenge) {
            // Award points and show completion animation
            this.awardChallengePoints(challenge.points);
            this.showCompletionCelebration();
        }
    }
}
```

## Technical Implementation Tips

### 8. Data Persistence (Local Storage)
```javascript
class DataManager {
    static saveGameData(data) {
        try {
            localStorage.setItem('moodTracker', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }
    
    static loadGameData() {
        try {
            const saved = localStorage.getItem('moodTracker');
            return saved ? JSON.parse(saved) : this.getDefaultData();
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
            return this.getDefaultData();
        }
    }
    
    static exportData() {
        const data = this.loadGameData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
}
```

### 9. Animation & Feedback
```css
/* Smooth animations for interactions */
@keyframes celebrationPulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes slideInUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: slideInUp 0.5s ease-out;
    z-index: 1000;
}

.mood-btn:active {
    animation: celebrationPulse 0.3s ease-in-out;
}
```

### 10. Responsive Design
```css
/* Mobile-first responsive design */
.mood-tracker {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

@media (min-width: 768px) {
    .mood-tracker {
        max-width: 800px;
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 30px;
    }
    
    .main-content {
        grid-column: 1;
    }
    
    .sidebar {
        grid-column: 2;
    }
}

@media (min-width: 1024px) {
    .mood-tracker {
        max-width: 1200px;
        grid-template-columns: 300px 1fr 300px;
    }
    
    .sidebar {
        grid-column: 3;
    }
    
    .navigation {
        grid-column: 1;
    }
}
```

## Advanced Features

### 11. Mood Pattern Recognition
```javascript
class MoodAnalytics {
    static analyzeMoodPatterns(entries) {
        const patterns = {
            weeklyTrends: this.getWeeklyTrends(entries),
            timeOfDayPatterns: this.getTimePatterns(entries),
            streakAnalysis: this.getStreakData(entries),
            moodDistribution: this.getMoodDistribution(entries)
        };
        
        return {
            ...patterns,
            insights: this.generateInsights(patterns)
        };
    }
    
    static generateInsights(patterns) {
        const insights = [];
        
        // Example insight generation
        if (patterns.timeOfDayPatterns.morning > patterns.timeOfDayPatterns.evening) {
            insights.push({
                type: 'positive',
                message: 'You tend to feel better in the mornings. Consider scheduling important tasks then!'
            });
        }
        
        return insights;
    }
}
```

### 12. Gamification Rewards
```javascript
const rewardSystem = {
    dailyBonus: 5,
    streakMultiplier: 1.2,
    levelUpBonus: 50,
    
    calculateReward(basePoints, streak, level) {
        let reward = basePoints + this.dailyBonus;
        
        if (streak > 3) {
            reward *= Math.pow(this.streakMultiplier, Math.min(streak, 30));
        }
        
        return Math.floor(reward);
    },
    
    getRandomEncouragement() {
        const messages = [
            "Great job tracking your mood! 🌟",
            "You're building a healthy habit! 💪",
            "Every feeling is valid and temporary ❤️",
            "You're taking care of your mental health! 🧠",
            "Keep up the amazing work! 🎉"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
};
```

## Implementation Checklist

### Essential Features
- [ ] Daily mood selection interface
- [ ] Basic point system
- [ ] Local storage for data persistence
- [ ] Simple progress visualization
- [ ] Responsive design

### Intermediate Features  
- [ ] Streak tracking
- [ ] Achievement system
- [ ] Calendar view with mood history
- [ ] Basic analytics and insights
- [ ] Daily challenges

### Advanced Features
- [ ] Social sharing capabilities
- [ ] Advanced mood pattern analysis
- [ ] Customizable themes and moods
- [ ] Data export functionality
- [ ] Integration with external APIs
- [ ] Push notifications for reminders

Remember to focus on user experience, accessibility, and mental health best practices when implementing your mood tracker game!