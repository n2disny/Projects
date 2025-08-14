class Survey {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.questions = [
            {
                id: 1,
                type: 'rating',
                question: 'Overall, how did you and your family enjoy the pool party?',
                min: 1,
                max: 10,
                labels: ['😢', '😊'],
                required: true
            },

            {
                id: 2,
                type: 'multiple-choice',
                question: 'How did you find out about this event?',
                options: ['Word-of-Mouth', 'Slack', 'Email', 'Manager', 'Other'],
                required: true
            },
            {
                id: 3,
                type: 'multiple-choice',
                question: 'Did you feel well-informed before the event?',
                options: ['Yes', 'No'],
                required: true,
                followUp: {
                    'No': 'Please share why.'
                }
            },
            {
                id: 4,
                type: 'multiple-choice',
                question: 'Was the event time convenient for you?',
                options: ['Very convenient', 'Somewhat convenient', 'Neutral', 'Somewhat inconvenient', 'Very inconvenient'],
                required: true
            },
            {
                id: 5,
                type: 'multiple-choice',
                question: 'Would you attend another event like this in the future?',
                options: ['Yes', 'No'],
                required: true,
                followUp: {
                    'No': 'Please share why.'
                }
            },
            {
                id: 6,
                type: 'multiple-choice',
                question: 'Would you recommend this event to others?',
                options: ['Yes', 'No'],
                required: true,
                followUp: {
                    'No': 'Please share why.'
                }
            },
            {
                id: 7,
                type: 'text',
                question: 'Any additional comments or feedback?',
                placeholder: 'Your feedback helps us plan better events...',
                required: false
            }
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcomeScreen();
        // Ensure proper initial state
        this.forceHideAllScreens();
        this.showWelcomeScreen();
    }

    forceHideAllScreens() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('survey-form').classList.add('hidden');
        document.getElementById('results-screen').classList.add('hidden');
    }

    bindEvents() {
        document.getElementById('start-survey').addEventListener('click', () => {
            this.startSurvey();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitSurvey();
        });

        document.getElementById('restart-survey').addEventListener('click', () => {
            this.restartSurvey();
        });
    }

    showWelcomeScreen() {
        this.forceHideAllScreens();
        document.getElementById('welcome-screen').classList.remove('hidden');
    }

    startSurvey() {
        this.forceHideAllScreens();
        document.getElementById('survey-form').classList.remove('hidden');
        this.currentQuestion = 0;
        this.renderQuestion();
        this.updateProgress();
        this.updateNavigationButtons();
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('questions-container');
        
        let html = `
            <div class="question">
                <h3>${question.question}</h3>
                ${question.required ? '<p><em>* Required</em></p>' : ''}
                <div class="options">
        `;

        switch (question.type) {
            case 'multiple-choice':
                question.options.forEach((option, index) => {
                    const isSelected = this.responses[question.id] === option;
                    html += `
                        <label class="option ${isSelected ? 'selected' : ''}">
                            <input type="radio" name="q${question.id}" value="${option}" 
                                   ${isSelected ? 'checked' : ''}>
                            ${option}
                        </label>
                    `;
                });
                
                // Add follow-up question if "No" is selected and follow-up exists
                if (question.followUp && this.responses[question.id] === 'No') {
                    html += `
                        <div class="follow-up-question" style="margin-top: 15px; padding-left: 20px;">
                            <p style="font-weight: 600; color: #4a5568; margin-bottom: 10px;">${question.followUp['No']}</p>
                            <input type="text" class="follow-up-input" placeholder="Please explain..." 
                                   value="${this.responses[`${question.id}_followup`] || ''}" 
                                   data-question="${question.id}">
                        </div>
                    `;
                }
                break;

            case 'checkbox':
                const selectedOptions = this.responses[question.id] || [];
                question.options.forEach((option, index) => {
                    const isSelected = selectedOptions.includes(option);
                    html += `
                        <label class="option ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" name="q${question.id}" value="${option}" 
                                   ${isSelected ? 'checked' : ''}>
                            ${option}
                        </label>
                    `;
                });
                break;

            case 'rating':
                const currentValue = this.responses[question.id] || '';
                html += `
                    <div class="emoji-options">
                        <label class="emoji-option ${currentValue === '😢' ? 'selected' : ''}">
                            <input type="radio" name="q${question.id}" value="😢" ${currentValue === '😢' ? 'checked' : ''}>
                            <span class="emoji-display">😢</span>
                            <span class="emoji-text">Sad</span>
                        </label>
                        <label class="emoji-option ${currentValue === '😐' ? 'selected' : ''}">
                            <input type="radio" name="q${question.id}" value="😐" ${currentValue === '😐' ? 'checked' : ''}>
                            <span class="emoji-display">😐</span>
                            <span class="emoji-text">Neutral</span>
                        </label>
                        <label class="emoji-option ${currentValue === '😊' ? 'selected' : ''}">
                            <input type="radio" name="q${question.id}" value="😊" ${currentValue === '😊' ? 'checked' : ''}>
                            <span class="emoji-display">😊</span>
                            <span class="emoji-text">Happy</span>
                        </label>
                    </div>
                `;
                break;

            case 'text':
                const textValue = this.responses[question.id] || '';
                html += `
                    <div class="option">
                        <input type="text" placeholder="${question.placeholder}" 
                               value="${textValue}" class="text-input" 
                               data-question="${question.id}">
                    </div>
                `;
                break;
        }

        html += '</div></div>';
        container.innerHTML = html;

        // Bind events for the new question
        this.bindQuestionEvents(question);
    }

    bindQuestionEvents(question) {
        switch (question.type) {
            case 'multiple-choice':
                const radioButtons = document.querySelectorAll(`input[name="q${question.id}"]`);
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        this.responses[question.id] = e.target.value;
                        this.updateOptionStyles(question.id, e.target.value);
                        
                        // Re-render question to show/hide follow-up
                        if (question.followUp) {
                            this.renderQuestion();
                        }
                    });
                });
                
                // Bind follow-up input events
                const followUpInput = document.querySelector('.follow-up-input');
                if (followUpInput) {
                    followUpInput.addEventListener('input', (e) => {
                        this.responses[`${question.id}_followup`] = e.target.value;
                    });
                }
                break;

            case 'checkbox':
                const checkboxes = document.querySelectorAll(`input[name="q${question.id}"]`);
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        if (!this.responses[question.id]) {
                            this.responses[question.id] = [];
                        }
                        
                        if (e.target.checked) {
                            this.responses[question.id].push(e.target.value);
                        } else {
                            this.responses[question.id] = this.responses[question.id].filter(
                                item => item !== e.target.value
                            );
                        }
                        this.updateCheckboxStyles(question.id);
                    });
                });
                break;

            case 'rating':
                const emojiOptions = document.querySelectorAll(`input[name="q${question.id}"]`);
                emojiOptions.forEach(option => {
                    option.addEventListener('change', (e) => {
                        this.responses[question.id] = e.target.value;
                        this.updateEmojiOptionStyles(question.id, e.target.value);
                    });
                });
                break;

            case 'text':
                const textInput = document.querySelector('.text-input');
                if (textInput) {
                    textInput.addEventListener('input', (e) => {
                        this.responses[question.id] = e.target.value;
                    });
                }
                break;
        }
    }

    updateOptionStyles(questionId, selectedValue) {
        const options = document.querySelectorAll(`input[name="q${questionId}"]`);
        options.forEach(option => {
            const label = option.closest('.option');
            if (option.value === selectedValue) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }

    updateCheckboxStyles(questionId) {
        const options = document.querySelectorAll(`input[name="q${questionId}"]`);
        options.forEach(option => {
            const label = option.closest('.option');
            if (option.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }

    updateEmojiOptionStyles(questionId, selectedValue) {
        const options = document.querySelectorAll(`input[name="q${questionId}"]`);
        options.forEach(option => {
            const label = option.closest('.emoji-option');
            if (option.value === selectedValue) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }

    nextQuestion() {
        if (this.validateCurrentQuestion()) {
            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.renderQuestion();
                this.updateProgress();
                this.updateNavigationButtons();
            }
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    validateCurrentQuestion() {
        const question = this.questions[this.currentQuestion];
        
        if (!question.required) {
            return true;
        }

        const response = this.responses[question.id];
        
        if (!response) {
            alert('Please answer this question before continuing.');
            return false;
        }

        if (question.type === 'checkbox' && response.length === 0) {
            alert('Please select at least one option.');
            return false;
        }

        return true;
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        prevBtn.classList.toggle('hidden', this.currentQuestion === 0);
        nextBtn.classList.toggle('hidden', this.currentQuestion === this.questions.length - 1);
        submitBtn.classList.toggle('hidden', this.currentQuestion !== this.questions.length - 1);
    }

    submitSurvey() {
        if (this.validateCurrentQuestion()) {
            this.showResults();
        }
    }

    showResults() {
        this.forceHideAllScreens();
        document.getElementById('results-screen').classList.remove('hidden');
        
        const resultsSummary = document.getElementById('results-summary');
        let html = '';
        
        this.questions.forEach(question => {
            const response = this.responses[question.id];
            let answerText = '';
            
            if (response) {
                if (Array.isArray(response)) {
                    answerText = response.join(', ');
                } else {
                    answerText = response.toString();
                }
            } else {
                answerText = 'No answer provided';
            }
            
            html += `
                <div class="result-item">
                    <div class="result-question">${question.question}</div>
                    <div class="result-answer">${answerText}</div>
                </div>
            `;
        });
        
        resultsSummary.innerHTML = html;
    }

    restartSurvey() {
        this.currentQuestion = 0;
        this.responses = {};
        this.showWelcomeScreen();
    }
}

// Initialize the survey when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Survey();
});