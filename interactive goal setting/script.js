// Quiz State Management
let currentQuestion = 0;
let userAnswers = {};
const totalQuestions = 8;

// Question configurations
const questions = [
    {
        id: 'fitness_level',
        title: 'Current Fitness Level',
        options: {
            'beginner': 'Beginner',
            'intermediate': 'Intermediate', 
            'advanced': 'Advanced'
        }
    },
    {
        id: 'primary_goal',
        title: 'Primary Goal',
        options: {
            'weight_loss': 'Weight Loss',
            'muscle_gain': 'Muscle Building',
            'endurance': 'Endurance & Stamina',
            'flexibility': 'Flexibility & Mobility',
            'general_health': 'General Health'
        }
    },
    {
        id: 'time_availability',
        title: 'Time Availability',
        options: {
            '2-3': '2-3 hours',
            '4-5': '4-5 hours',
            '6-8': '6-8 hours',
            '8+': '8+ hours'
        }
    },
    {
        id: 'training_style',
        title: 'Training Style',
        options: {
            'coach_led': 'Coach-led Group Classes',
            'gym_alone': 'Gym on My Own',
            'mix_both': 'A Mix of Both'
        }
    },
    {
        id: 'days_per_week',
        title: 'Days Per Week',
        options: {
            '1-2': '1-2 Days',
            '3-4': '3-4 Days',
            '5+': '5+ Days'
        }
    },
    {
        id: 'activity_level',
        title: 'Current Activity Level',
        options: {
            'sedentary': 'Mostly Sedentary',
            'lightly_active': 'Lightly Active',
            'moderately_active': 'Moderately Active',
            'very_active': 'Very Active'
        }
    },
    {
        id: 'motivation',
        title: 'Motivation Style',
        options: {
            'health': 'Health & Longevity',
            'appearance': 'Physical Appearance',
            'performance': 'Performance & Competition',
            'stress_relief': 'Stress Relief & Mental Health'
        }
    },
    {
        id: 'timeline',
        title: 'Timeline',
        options: {
            '1_month': '1 Month',
            '3_months': '3 Months',
            '6_months': '6 Months',
            '1_year': '1 Year+'
        }
    }
];

// Initialize quiz
function initQuiz() {
    updateProgress();
    setupOptionHandlers();
}

// Setup option button handlers using event delegation
function setupOptionHandlers() {
    // Remove any existing listeners first
    document.removeEventListener('click', handleOptionClick);
    
    // Add new event listener
    document.addEventListener('click', handleOptionClick);
}

// Handle option button clicks
function handleOptionClick(event) {
    if (event.target.closest('.option-btn')) {
        const button = event.target.closest('.option-btn');
        
        // Remove selected class from siblings
        const siblings = button.parentElement.querySelectorAll('.option-btn');
        siblings.forEach(sibling => sibling.classList.remove('selected'));
        
        // Add selected class to clicked button
        button.classList.add('selected');
        
        // Store answer
        const questionId = questions[currentQuestion].id;
        userAnswers[questionId] = button.dataset.value;
        
        // Auto-advance after a short delay
        setTimeout(() => {
            nextQuestion();
        }, 800);
    }
}

// Start quiz
function startQuiz() {
    currentQuestion = 0;
    userAnswers = {};
    showQuestion(0);
    updateProgress();
}

// Show specific question
function showQuestion(questionIndex) {
    // Hide all sections
    document.querySelectorAll('.quiz-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show welcome screen
    if (questionIndex === -1) {
        document.getElementById('welcome').classList.add('active');
        return;
    }
    
    // Show question
    const questionElement = document.getElementById(`question${questionIndex + 1}`);
    if (questionElement) {
        questionElement.classList.add('active');
    }
}

// Next question
function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
        updateProgress();
    } else {
        showResults();
    }
}

// Update progress bar
function updateProgress() {
    const progress = currentQuestion === -1 ? 0 : ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = 
        currentQuestion === -1 ? 'Ready to start!' : `Question ${currentQuestion + 1} of ${totalQuestions}`;
}

// Show results
function showResults() {
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    
    // Generate personalized recommendations
    const recommendations = generateRecommendations();
    
    // Update result elements
    document.getElementById('primaryGoal').textContent = recommendations.primaryGoal;
    document.getElementById('recommendedSchedule').textContent = recommendations.schedule;
    document.getElementById('workoutTypes').textContent = recommendations.workoutTypes;
    document.getElementById('sessionDuration').textContent = recommendations.duration;
    
    // Update recommended classes
    const classesGrid = document.getElementById('classesGrid');
    classesGrid.innerHTML = '';
    recommendations.recommendedClasses.forEach(classInfo => {
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        classCard.innerHTML = `
            <div class="class-name">${classInfo.name}</div>
            <div class="class-description">${classInfo.description}</div>
        `;
        classesGrid.appendChild(classCard);
    });
    
    // Update recommendations list
    const recommendationsList = document.getElementById('keyRecommendations');
    recommendationsList.innerHTML = '';
    recommendations.keyRecommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Generate personalized recommendations
function generateRecommendations() {
    const fitnessLevel = userAnswers.fitness_level;
    const primaryGoal = userAnswers.primary_goal;
    const timeAvailability = userAnswers.time_availability;
    const trainingStyle = userAnswers.training_style;
    const daysPerWeek = userAnswers.days_per_week;
    const activityLevel = userAnswers.activity_level;
    const motivation = userAnswers.motivation;
    const timeline = userAnswers.timeline;
    
    const recommendations = {
        primaryGoal: '',
        schedule: '',
        workoutTypes: '',
        duration: '',
        keyRecommendations: []
    };
    
    // Primary Goal Description
    const goalDescriptions = {
        'weight_loss': 'Create a sustainable calorie deficit through cardio and strength training while maintaining muscle mass.',
        'muscle_gain': 'Focus on progressive overload with compound movements and adequate protein intake for muscle growth.',
        'endurance': 'Build cardiovascular fitness through consistent aerobic training and interval work.',
        'flexibility': 'Improve mobility and prevent injury through regular stretching, yoga, and movement practice.',
        'general_health': 'Maintain overall wellness through balanced exercise, stress management, and healthy habits.'
    };
    recommendations.primaryGoal = goalDescriptions[primaryGoal] || goalDescriptions['general_health'];
    
    // Schedule Recommendation - Now based on days per week commitment
    const scheduleRecommendations = {
        '1-2': '1-2 sessions per week, focusing on full-body workouts and efficient training',
        '3-4': '3-4 sessions per week with balanced strength and cardio training',
        '5+': '5-6 sessions per week with dedicated recovery and variety'
    };
    recommendations.schedule = scheduleRecommendations[daysPerWeek] || scheduleRecommendations['3-4'];
    
    // Workout Types - Based on training style preference
    const workoutTypeRecommendations = {
        'coach_led': 'Group fitness classes, yoga, Pilates, HIIT classes, and instructor-led sessions',
        'gym_alone': 'Weight training, cardio equipment, and independent workout routines',
        'mix_both': 'Combination of group classes and solo training for variety and flexibility'
    };
    recommendations.workoutTypes = workoutTypeRecommendations[trainingStyle] || workoutTypeRecommendations['mix_both'];
    
    // Generate recommended classes based on user preferences
    recommendations.recommendedClasses = generateRecommendedClasses(fitnessLevel, primaryGoal, trainingStyle, daysPerWeek, motivation, activityLevel);
    
    // Session Duration
    const durationRecommendations = {
        '2-3': '30-45 minutes per session',
        '4-5': '45-60 minutes per session',
        '6-8': '60-75 minutes per session',
        '8+': '60-90 minutes per session'
    };
    recommendations.duration = durationRecommendations[timeAvailability] || durationRecommendations['4-5'];
    
    // Key Recommendations based on combinations
    const keyRecs = [];
    
    // Fitness level specific recommendations
    if (fitnessLevel === 'beginner') {
        keyRecs.push('Start with 2-3 workouts per week and gradually increase frequency');
        keyRecs.push('Focus on proper form over intensity to prevent injury');
        keyRecs.push('Include rest days for recovery and adaptation');
    } else if (fitnessLevel === 'intermediate') {
        keyRecs.push('Incorporate progressive overload to continue making gains');
        keyRecs.push('Add variety to prevent plateaus and maintain motivation');
        keyRecs.push('Track your workouts to monitor progress');
    } else if (fitnessLevel === 'advanced') {
        keyRecs.push('Implement periodization for long-term progression');
        keyRecs.push('Focus on recovery and nutrition optimization');
        keyRecs.push('Consider working with a trainer for advanced programming');
    }
    
    // Goal specific recommendations
    if (primaryGoal === 'weight_loss') {
        keyRecs.push('Combine cardio and strength training for optimal fat loss');
        keyRecs.push('Focus on creating a sustainable calorie deficit');
        keyRecs.push('Track your nutrition and stay consistent');
    } else if (primaryGoal === 'muscle_gain') {
        keyRecs.push('Prioritize compound movements for maximum muscle recruitment');
        keyRecs.push('Ensure adequate protein intake (1.6-2.2g per kg bodyweight)');
        keyRecs.push('Allow 48-72 hours between training the same muscle groups');
    } else if (primaryGoal === 'endurance') {
        keyRecs.push('Include both steady-state and interval training');
        keyRecs.push('Gradually increase duration and intensity over time');
        keyRecs.push('Focus on proper breathing and pacing strategies');
    } else if (primaryGoal === 'flexibility') {
        keyRecs.push('Practice daily stretching, even for just 10-15 minutes');
        keyRecs.push('Include dynamic warm-ups before workouts');
        keyRecs.push('Consider yoga or Pilates classes for structured practice');
    }
    
    // Training style recommendations
    if (trainingStyle === 'coach_led') {
        keyRecs.push('Book classes in advance to secure your spot');
        keyRecs.push('Try different instructors to find your preferred teaching style');
        keyRecs.push('Arrive early to set up and introduce yourself to the instructor');
    } else if (trainingStyle === 'gym_alone') {
        keyRecs.push('Create a structured workout plan to maximize your time');
        keyRecs.push('Learn proper form for exercises to prevent injury');
        keyRecs.push('Consider working with a trainer occasionally for technique check-ins');
    } else if (trainingStyle === 'mix_both') {
        keyRecs.push('Use classes for motivation and solo training for specific goals');
        keyRecs.push('Schedule classes for days when you need extra motivation');
        keyRecs.push('Balance structured classes with flexible solo sessions');
    }
    
    // Days per week recommendations
    if (daysPerWeek === '1-2') {
        keyRecs.push('Focus on full-body workouts that target multiple muscle groups');
        keyRecs.push('Make each session count with compound movements');
        keyRecs.push('Consider longer sessions (60-90 minutes) since you have fewer days');
    } else if (daysPerWeek === '3-4') {
        keyRecs.push('Create a balanced weekly schedule with rest days between sessions');
        keyRecs.push('Alternate between upper body, lower body, and full-body workouts');
        keyRecs.push('Include at least one cardio-focused session per week');
    } else if (daysPerWeek === '5+') {
        keyRecs.push('Plan recovery days and avoid training the same muscle groups consecutively');
        keyRecs.push('Include variety to prevent burnout and overuse injuries');
        keyRecs.push('Consider active recovery activities on lighter training days');
    }
    
    // Motivation specific recommendations
    if (motivation === 'health') {
        keyRecs.push('Focus on how exercise makes you feel, not just appearance');
        keyRecs.push('Track health metrics like energy levels and sleep quality');
        keyRecs.push('Include stress-reducing activities like yoga or meditation');
    } else if (motivation === 'appearance') {
        keyRecs.push('Take progress photos and measurements regularly');
        keyRecs.push('Focus on both strength training and cardio for body composition');
        keyRecs.push('Be patient - visible changes take 4-8 weeks');
    } else if (motivation === 'performance') {
        keyRecs.push('Set specific, measurable goals and track progress');
        keyRecs.push('Include sport-specific training if applicable');
        keyRecs.push('Focus on progressive overload and skill development');
    } else if (motivation === 'stress_relief') {
        keyRecs.push('Choose activities you genuinely enjoy');
        keyRecs.push('Include mindful movement practices like yoga or tai chi');
        keyRecs.push('Use exercise as a form of active meditation');
    }
    
    
    // Timeline recommendations
    if (timeline === '1_month') {
        keyRecs.push('Focus on building consistent habits and proper form');
        keyRecs.push('Expect initial improvements in energy and mood');
        keyRecs.push('Don\'t get discouraged - visible changes take longer');
    } else if (timeline === '1_year') {
        keyRecs.push('Develop a sustainable long-term approach');
        keyRecs.push('Plan for different phases of training throughout the year');
        keyRecs.push('Focus on lifestyle integration, not just short-term goals');
    }
    
    // Limit to most important recommendations (max 4)
    const maxRecommendations = 4;
    recommendations.keyRecommendations = keyRecs.slice(0, maxRecommendations);
    
    return recommendations;
}

// Generate recommended classes based on user preferences
function generateRecommendedClasses(fitnessLevel, primaryGoal, trainingStyle, daysPerWeek, motivation, activityLevel) {
    const allClasses = {
        'align_flow_yoga': {
            name: 'ALIGN & FLOW YOGA',
            description: 'This peaceful yoga practice will help you unlock new levels of flexibility, coordination, balance, and strength. Ideal for active recovery from stress and muscle soreness. All levels welcome.',
            categories: ['flexibility', 'recovery', 'mindfulness', 'beginner_friendly']
        },
        'body_sculpt': {
            name: 'BODY SCULPT',
            description: 'Get a total body workout using your body weight, dumbbells, and bands to tone from head to toe.',
            categories: ['strength', 'toning', 'full_body', 'beginner_friendly']
        },
        'belly_dance': {
            name: 'BELLY DANCE',
            description: 'Learn the basic movements of Belly Dance (hip isolations, lifts, drops, and circles). Suitable for all levels! Beginners welcome!',
            categories: ['fun', 'coordination', 'beginner_friendly', 'low_impact']
        },
        'cardio_crush': {
            name: 'CARDIO CRUSH',
            description: 'A mixed-impact, pure cardio workout combining different types of cardio (Circuit Training, Hip Hop Step, Kickbox, Latin Dance, and more).',
            categories: ['cardio', 'high_energy', 'variety', 'weight_loss']
        },
        'core_n_more': {
            name: 'CORE N\' MORE',
            description: 'Strengthen stability muscles and improve definition for the superficial core muscles.',
            categories: ['core', 'strength', 'stability', 'beginner_friendly']
        },
        'cycling_plus': {
            name: 'CYCLING PLUS',
            description: 'An intense full-body workout combining cycling revolutions and weight repetitions.',
            categories: ['cardio', 'strength', 'high_intensity', 'full_body']
        },
        'dynamic_pilates': {
            name: 'DYNAMIC PILATES',
            description: 'Address the body\'s natural balance through controlled movements, focusing on core muscles in the waist and lower back area.',
            categories: ['flexibility', 'core', 'balance', 'mindfulness', 'beginner_friendly']
        },
        'hiit_cycle': {
            name: 'H.I.I.T. CYCLE',
            description: 'Indoor cycling class with short bursts of maximum intensity effort, interspersed with short rest periods.',
            categories: ['cardio', 'high_intensity', 'weight_loss', 'advanced']
        },
        'hirt': {
            name: 'H.I.R.T.',
            description: 'High-Intensity Resistance Training involves performing strength exercises at all-out effort, with short rest periods.',
            categories: ['strength', 'high_intensity', 'muscle_gain', 'advanced']
        },
        'lunchtime_yoga': {
            name: 'LUNCHTIME YOGA',
            description: 'Join us for lunch! A one-hour vinyasa yoga class for those with limited time. Leave refreshed, renewed and ready to take on the rest of your day.',
            categories: ['flexibility', 'time_efficient', 'stress_relief', 'beginner_friendly']
        },
        'mat_pilates': {
            name: 'MAT PILATES',
            description: 'A cross-conditioning system designed to strengthen your abdominals and back while shaping your legs, hips, back, chest, and arms.',
            categories: ['flexibility', 'strength', 'toning', 'beginner_friendly']
        },
        'power_up': {
            name: 'POWER UP',
            description: 'Combines strength training and core conditioning for a full body workout.',
            categories: ['strength', 'core', 'full_body', 'intermediate']
        },
        'power_yoga': {
            name: 'POWER YOGA',
            description: 'Take yoga to the next level in this intense workout which combines popular yoga disciplines. Recommended for yoga practitioners who are ready for a new challenge.',
            categories: ['flexibility', 'strength', 'advanced', 'challenging']
        },
        'reformer_pilates': {
            name: 'REFORMER PILATES',
            description: 'A Pilates session using an apparatus with springs for assistance and resistance to achieve proper muscle length and strength. Beginners welcome. *Additional charge required.',
            categories: ['flexibility', 'strength', 'beginner_friendly', 'premium']
        },
        'ride_sculpt': {
            name: 'RIDE & SCULPT',
            description: 'A low-impact class combining calorie-torching cycling drills with strength exercises focusing on the upper body, lower body, and core.',
            categories: ['cardio', 'strength', 'low_impact', 'full_body']
        },
        'strong_start': {
            name: 'STRONG START',
            description: 'A strength training class using body weight, dumbbells and resistance bands. Start the day strong with this workout.',
            categories: ['strength', 'morning', 'beginner_friendly', 'full_body']
        },
        'step_it_up': {
            name: 'STEP IT UP',
            description: 'A cardio fusion workout with step platform (Dance, Kickbox, Core and more).',
            categories: ['cardio', 'coordination', 'variety', 'intermediate']
        },
        'sunrise_yoga': {
            name: 'SUNRISE YOGA',
            description: 'A flowing series of dynamic postures designed to physically and mentally awaken your body and mind at the start of the day.',
            categories: ['flexibility', 'morning', 'mindfulness', 'beginner_friendly']
        },
        'total_body': {
            name: 'TOTAL BODY',
            description: 'A complete workout alternating muscle-toning movements with intervals of fat-blasting cardio techniques using equipment like steps, medicine balls, and bands.',
            categories: ['strength', 'cardio', 'full_body', 'weight_loss', 'intermediate']
        },
        'wake_up_yoga': {
            name: 'WAKE UP YOGA',
            description: 'A Vinyasa session to energize your mornings, invigorating your body, mind, and spirit. Suitable for all levels.',
            categories: ['flexibility', 'morning', 'energy', 'beginner_friendly']
        },
        'wind_down_yoga': {
            name: 'WIND DOWN YOGA',
            description: 'Unwind from your day with easy yet challenging sequences that prepare you for ultimate relaxation.',
            categories: ['flexibility', 'stress_relief', 'recovery', 'beginner_friendly']
        },
        'xtreme_bootcamp': {
            name: 'X-TREME BOOT CAMP',
            description: 'Stacks exercises one after another for the ultimate fitness challenge.',
            categories: ['high_intensity', 'challenging', 'advanced', 'full_body']
        }
    };
    
    let recommendedClasses = [];
    let scores = {};
    
    // Calculate scores for each class based on user preferences
    Object.keys(allClasses).forEach(classKey => {
        const classInfo = allClasses[classKey];
        let score = 0;
        
        // Fitness level matching
        if (fitnessLevel === 'beginner') {
            if (classInfo.categories.includes('beginner_friendly')) score += 3;
            if (classInfo.categories.includes('advanced')) score -= 2;
            if (classInfo.categories.includes('challenging')) score -= 1;
        } else if (fitnessLevel === 'intermediate') {
            if (classInfo.categories.includes('intermediate')) score += 3;
            if (classInfo.categories.includes('beginner_friendly')) score += 1;
            if (classInfo.categories.includes('advanced')) score += 1;
        } else if (fitnessLevel === 'advanced') {
            if (classInfo.categories.includes('advanced')) score += 3;
            if (classInfo.categories.includes('challenging')) score += 2;
            if (classInfo.categories.includes('high_intensity')) score += 2;
        }
        
        // Primary goal matching
        if (primaryGoal === 'weight_loss') {
            if (classInfo.categories.includes('cardio')) score += 3;
            if (classInfo.categories.includes('weight_loss')) score += 3;
            if (classInfo.categories.includes('high_intensity')) score += 2;
        } else if (primaryGoal === 'muscle_gain') {
            if (classInfo.categories.includes('strength')) score += 3;
            if (classInfo.categories.includes('muscle_gain')) score += 3;
            if (classInfo.categories.includes('toning')) score += 2;
        } else if (primaryGoal === 'endurance') {
            if (classInfo.categories.includes('cardio')) score += 3;
            if (classInfo.categories.includes('high_intensity')) score += 2;
        } else if (primaryGoal === 'flexibility') {
            if (classInfo.categories.includes('flexibility')) score += 3;
            if (classInfo.categories.includes('yoga')) score += 2;
        } else if (primaryGoal === 'general_health') {
            if (classInfo.categories.includes('full_body')) score += 2;
            if (classInfo.categories.includes('beginner_friendly')) score += 1;
        }
        
        // Training style matching
        if (trainingStyle === 'coach_led') {
            score += 2; // All classes are coach-led, so bonus for all
        } else if (trainingStyle === 'gym_alone') {
            score -= 1; // Penalty for group classes
        } else if (trainingStyle === 'mix_both') {
            score += 1; // Slight bonus for variety
        }
        
        // Days per week matching
        if (daysPerWeek === '1-2') {
            if (classInfo.categories.includes('time_efficient')) score += 2;
            if (classInfo.categories.includes('full_body')) score += 1;
        } else if (daysPerWeek === '3-4') {
            if (classInfo.categories.includes('variety')) score += 1;
        } else if (daysPerWeek === '5+') {
            if (classInfo.categories.includes('specialized')) score += 1;
        }
        
        // Motivation matching
        if (motivation === 'health') {
            if (classInfo.categories.includes('mindfulness')) score += 2;
            if (classInfo.categories.includes('recovery')) score += 1;
        } else if (motivation === 'appearance') {
            if (classInfo.categories.includes('toning')) score += 2;
            if (classInfo.categories.includes('strength')) score += 1;
        } else if (motivation === 'performance') {
            if (classInfo.categories.includes('high_intensity')) score += 2;
            if (classInfo.categories.includes('challenging')) score += 2;
        } else if (motivation === 'stress_relief') {
            if (classInfo.categories.includes('stress_relief')) score += 3;
            if (classInfo.categories.includes('flexibility')) score += 1;
            if (classInfo.categories.includes('mindfulness')) score += 1;
        }
        
        // Activity level matching
        if (activityLevel === 'sedentary' || activityLevel === 'lightly_active') {
            if (classInfo.categories.includes('low_impact')) score += 2;
            if (classInfo.categories.includes('beginner_friendly')) score += 1;
        } else if (activityLevel === 'very_active') {
            if (classInfo.categories.includes('high_intensity')) score += 1;
        }
        
        scores[classKey] = score;
    });
    
    // Sort classes by score and get top recommendations
    const sortedClasses = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    
    // Get top 6 classes based on score
    const topClasses = sortedClasses.slice(0, 6).filter(classKey => scores[classKey] > 0);
    
    return topClasses.map(classKey => allClasses[classKey]);
}

// Restart quiz
function restartQuiz() {
    currentQuestion = -1;
    userAnswers = {};
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    showQuestion(-1);
    updateProgress();
}

// Download plan (placeholder functionality)
function downloadPlan() {
    const planContent = generatePlanContent();
    const blob = new Blob([planContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-fitness-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Generate downloadable plan content
function generatePlanContent() {
    const recommendations = generateRecommendations();
    const plan = `
MY PERSONALIZED FITNESS PLAN
Generated on: ${new Date().toLocaleDateString()}

PRIMARY GOAL: ${recommendations.primaryGoal}

RECOMMENDED SCHEDULE: ${recommendations.schedule}

WORKOUT TYPES: ${recommendations.workoutTypes}

SESSION DURATION: ${recommendations.duration}

RECOMMENDED CLASSES FOR YOU:
${recommendations.recommendedClasses.map(cls => `• ${cls.name}: ${cls.description}`).join('\n')}

KEY RECOMMENDATIONS:
${recommendations.keyRecommendations.map(rec => `• ${rec}`).join('\n')}

YOUR ANSWERS:
• Current Fitness Level: ${userAnswers.fitness_level}
• Primary Goal: ${userAnswers.primary_goal}
• Time Availability: ${userAnswers.time_availability} hours/week
• Training Style: ${userAnswers.training_style}
• Days Per Week: ${userAnswers.days_per_week}
• Current Activity Level: ${userAnswers.activity_level}
• Motivation: ${userAnswers.motivation}
• Timeline: ${userAnswers.timeline}

Remember: Consistency is key! Start where you are, use what you have, do what you can.
Good luck on your fitness journey!
    `;
    return plan;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initQuiz();
    
    // Add some interactive effects
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (currentQuestion >= 0 && currentQuestion < totalQuestions) {
            const optionButtons = document.querySelectorAll('.option-btn');
            if (e.key >= '1' && e.key <= '9' && optionButtons[parseInt(e.key) - 1]) {
                optionButtons[parseInt(e.key) - 1].click();
            }
        }
    });
});

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
