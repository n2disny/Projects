# 📊 Interactive Survey Application

A modern, responsive web-based survey application built with HTML, CSS, and JavaScript. This application provides a beautiful user interface for creating and conducting surveys with multiple question types.

## ✨ Features

- **Multiple Question Types**: Support for multiple-choice, checkbox, rating scales, and text input questions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Progress Tracking**: Visual progress bar showing survey completion
- **Navigation**: Easy navigation between questions with Previous/Next buttons
- **Validation**: Required field validation to ensure complete responses
- **Results Summary**: Complete summary of all responses at the end
- **Modern UI**: Beautiful gradient design with smooth animations and hover effects
- **Accessibility**: Proper form labels and keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Download or clone this repository
2. Open `index.html` in your web browser
3. The survey will load automatically

### Alternative: Local Server
For the best experience, you can run it on a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have it installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📝 Survey Structure

The current survey includes 7 questions covering:

1. **How did you hear about us?** (Multiple choice)
2. **Overall experience rating** (1-10 scale)
3. **Most valuable features** (Checkbox selection)
4. **Improvement suggestions** (Text input)
5. **Recommendation likelihood** (Multiple choice)
6. **Customer service rating** (1-5 scale)
7. **Additional comments** (Text input)

## 🎨 Customization

### Adding New Questions
To add new questions, modify the `questions` array in `script.js`:

```javascript
{
    id: 8,
    type: 'multiple-choice', // or 'checkbox', 'rating', 'text'
    question: 'Your question here?',
    options: ['Option 1', 'Option 2', 'Option 3'], // for multiple-choice/checkbox
    min: 1, // for rating questions
    max: 5, // for rating questions
    labels: ['Poor', 'Excellent'], // for rating questions
    placeholder: 'Your placeholder text', // for text questions
    required: true // or false
}
```

### Question Types

- **`multiple-choice`**: Single selection from multiple options
- **`checkbox`**: Multiple selection from options
- **`rating`**: Numeric rating with customizable range and labels
- **`text`**: Free-form text input with optional placeholder

### Styling
Modify `styles.css` to customize colors, fonts, and layout. The application uses CSS custom properties and modern CSS features for easy theming.

## 🔧 Technical Details

- **HTML5**: Semantic markup with proper form structure
- **CSS3**: Modern styling with Flexbox, Grid, and CSS animations
- **Vanilla JavaScript**: No external dependencies, pure ES6+ JavaScript
- **Responsive Design**: Mobile-first approach with CSS media queries
- **Progressive Enhancement**: Works without JavaScript (basic form functionality)

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🚀 Future Enhancements

Potential improvements that could be added:

- **Data Export**: Export responses to CSV/JSON
- **Question Logic**: Conditional questions based on previous answers
- **Multiple Surveys**: Support for different survey templates
- **Data Persistence**: Save responses to localStorage or backend
- **Analytics**: Response analytics and charts
- **Multi-language**: Internationalization support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for bugs and feature requests.

## 📞 Support

If you have any questions or need help customizing the survey, please open an issue in the repository.

---

**Enjoy building amazing surveys! 🎉** 