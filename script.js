class Survey {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.questions = [
            {
                id: 1,
                type: 'multiple-choice',
                question: 'How did you hear about us?',
                options: ['Social Media', 'Friend Recommendation', 'Online Advertisement', 'Search Engine', 'Other'],
                required: true
            },
            {
                id: 2,
                type: 'rating',
                question: 'How would you rate your overall experience?',
                min: 1,
                max: 10,
                labels: ['Poor', 'Excellent'],
                required: true
            },
            {
                id: 3,
                type: 'checkbox',
                question: 'Which features do you find most valuable? (Select all that apply)',
                options: ['User Interface', 'Performance', 'Customer Support', 'Documentation', 'Pricing', 'Integration Options'],
                required: true
            },
            {
                id: 4,
                type: 'text',
                question: 'What improvements would you like to see?',
                placeholder: 'Please share your suggestions...',
                required: false
            },
            {
                id: 5,
                type: 'multiple-choice',
                question: 'How likely are you to recommend us to others?',
                options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'],
                required: true
            },
            {
                id: 6,
                type: 'rating',
                question: 'Rate the quality of our customer service',
                min: 1,
                max: 5,
                labels: ['Poor', 'Excellent'],
                required: true
            },
            {
                id: 7,
                type: 'text',
                question: 'Any additional comments or feedback?',
                placeholder: 'Your feedback helps us improve...',
                required: false
            }
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcomeScreen();
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
        document.getElementById('welcome-screen').classList.remove('hidden');
        document.getElementById('survey-form').classList.add('hidden');
        document.getElementById('results-screen').classList.add('hidden');
    }

    startSurvey() {
        document.getElementById('welcome-screen').classList.add('hidden');
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
                const currentValue = this.responses[question.id] || question.min;
                html += `
                    <div class="option">
                        <input type="range" min="${question.min}" max="${question.max}" 
                               value="${currentValue}" class="rating-slider" 
                               data-question="${question.id}">
                        <div class="range-labels">
                            <span>${question.labels[0]}</span>
                            <span>${question.labels[1]}</span>
                        </div>
                        <div style="text-align: center; margin-top: 10px; font-weight: 600; color: #667eea;">
                            ${currentValue}
                        </div>
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
                    });
                });
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
                const slider = document.querySelector('.rating-slider');
                if (slider) {
                    slider.addEventListener('input', (e) => {
                        const value = e.target.value;
                        this.responses[question.id] = parseInt(value);
                        e.target.nextElementSibling.nextElementSibling.textContent = value;
                    });
                }
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
        document.getElementById('survey-form').classList.add('hidden');
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