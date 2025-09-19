# BlueFire Website

A modern, responsive website template built with HTML5, CSS3, and JavaScript. This template features a clean design, smooth animations, and a dark/light theme toggle.

## Features

- **Fully Responsive** - Works on all devices (desktop, tablet, mobile)
- **Dark/Light Mode** - Toggle between light and dark themes
- **Modern Design** - Clean and professional UI/UX
- **Smooth Animations** - Subtle animations for better user experience
- **Contact Form** - Ready-to-use contact form (requires backend integration)
- **Portfolio Section** - Showcase your work with a beautiful grid layout
- **SEO Optimized** - Built with best practices for search engines

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code, Sublime Text, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bluefire-website.git
   ```

2. Navigate to the project directory:
   ```bash
   cd bluefire-website
   ```

3. Open `index.html` in your browser to view the website locally.

## Project Structure

```
bluefire-website/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── main.js         # Main JavaScript file
├── assets/
│   ├── images/         # Store all images here
│   └── fonts/          # Custom fonts (if any)
└── README.md           # This file
```

## Customization

### Changing Colors

You can easily change the color scheme by modifying the CSS variables in the `:root` selector in `css/styles.css`:

```css
:root {
    --primary-color: #4361ee;
    --secondary-color: #3f37c9;
    --accent-color: #4cc9f0;
    /* ... other variables ... */
}
```

### Adding Portfolio Items

To add or modify portfolio items, edit the `portfolioItems` array in `js/main.js`:

```javascript
const portfolioItems = [
    {
        title: 'Project Title',
        category: 'Category',
        image: 'path/to/image.jpg',
        demo: '#',  // Link to live demo
        code: '#'   // Link to source code
    },
    // Add more items as needed
];
```

### Updating Content

1. **Homepage**: Edit `index.html`
2. **Styling**: Edit `css/styles.css`
3. **Functionality**: Edit `js/main.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (latest versions)

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography
- [Unsplash](https://unsplash.com/) for placeholder images

---

Created with ❤️ by [Your Name]
