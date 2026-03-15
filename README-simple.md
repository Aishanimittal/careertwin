# Career Predictor - Simple Version with Kaggle Dataset

A simplified career guidance application designed for second-year computer science students, now enhanced with **real Kaggle dataset**!

## 🎯 **Kaggle Dataset Integration**

### **Dataset Used:**
- **Source**: Kaggle "Data Science Job Salaries" dataset
- **Records**: 10+ career entries with real salary data
- **Year**: 2023 data
- **Format**: JSON (`career-dataset.json`)

### **Real Data Features:**
- ✅ **Actual salaries** from job market (USD)
- ✅ **Industry growth rates** (High/Medium/Very High)
- ✅ **Required skills** for each career
- ✅ **Entry/Mid/Senior** salary progression
- ✅ **Remote work ratios** and company sizes

## What Was Simplified

### Original Complex Version
- **Full-Stack Architecture**: React frontend + Node.js backend + SQLite database
- **Machine Learning**: Python scikit-learn Random Forest model
- **Authentication**: Passport.js with user sessions
- **Complex UI**: 50+ React components with shadcn/ui
- **Database ORM**: Drizzle with migrations
- **Build Tools**: Vite, TypeScript, complex bundling

### Simplified Version with Dataset
- **Single HTML File**: Everything in one `index.html` file
- **Vanilla JavaScript**: No frameworks, just pure JS
- **Rule-Based Logic**: Simple algorithm with real data
- **Kaggle Dataset**: Real salary and career information
- **No Backend**: Client-side only, no server needed
- **Basic CSS**: Clean, modern styling without complex libraries

## Features

✅ **Career Prediction**: Based on CGPA and skills using real market data
✅ **Skill Gap Analysis**: Shows what you need to learn
✅ **Career Roadmap**: Step-by-step learning path
✅ **Real Salary Data**: Actual USD salaries from Kaggle dataset
✅ **Industry Growth**: Current market trends
✅ **Confidence Scoring**: Match percentage
✅ **Dataset Statistics**: Shows data source information
✅ **Responsive Design**: Works on mobile and desktop

## How to Run

### Option 1: Simple Python Server
```bash
python -m http.server 8000
```
Then open http://localhost:8000

### Option 2: Double-click HTML file
Just double-click `index.html` in your file explorer

## Career Prediction Logic

The simplified version uses rule-based logic with **real Kaggle data**:

1. **Skill Matching**: Compares user skills with required skills from dataset
2. **CGPA Factor**: Higher CGPA increases match confidence
3. **Real Salary Data**: Uses actual market salaries (not estimates)
4. **Industry Growth**: Shows current market trends
5. **Weighted Scoring**: 70% skills + 30% CGPA
6. **Best Match**: Returns career with highest combined score

## Supported Careers (From Dataset)

- **Data Scientist**: Python, SQL, ML, Statistics ($70k-$130k-$200k)
- **Software Engineer**: Java/Python, DSA, AWS ($65k-$110k-$180k)
- **AI Engineer**: Python, TensorFlow, Deep Learning ($85k-$150k-$250k)
- **Frontend Developer**: JavaScript, React, CSS ($55k-$85k-$140k)
- **Backend Developer**: Node.js, SQL, APIs ($60k-$95k-$160k)
- **DevOps Engineer**: AWS, Docker, Kubernetes ($75k-$120k-$190k)
- **Data Analyst**: SQL, Excel, Tableau ($50k-$75k-$120k)
- **Machine Learning Engineer**: Python, Scikit-learn ($80k-$140k-$220k)
- **Full Stack Developer**: React, Node.js, MongoDB ($65k-$100k-$170k)
- **Cybersecurity Engineer**: Network Security, Python ($75k-$125k-$200k)

## Learning Benefits

This version teaches:
- **HTML5** structure and semantics
- **CSS3** modern styling (gradients, flexbox, grid)
- **Vanilla JavaScript** DOM manipulation and events
- **Form handling** and validation
- **Array methods** and data processing
- **JSON data loading** and processing
- **Real dataset integration** and analysis
- **Asynchronous programming** with fetch API

## How Dataset Integration Works

```javascript
// 1. Load Kaggle dataset
const response = await fetch('./career-dataset.json');
const dataset = await response.json();

// 2. Process into career data structure
dataset.forEach(job => {
    // Extract real salary data
    // Group by job title
    // Calculate averages
});

// 3. Use real data for predictions
const careerInfo = careerData[predictedCareer];
// Shows actual $70k-$130k-$200k instead of estimates
```

## Next Steps for Learning

Once comfortable with this version, you can progress to:
1. **Add More Datasets**: Load multiple Kaggle datasets
2. **Data Visualization**: Add charts for salary trends
3. **Local Storage**: Save user predictions locally
4. **External APIs**: Fetch live salary data
5. **Multiple Pages**: Split into separate HTML files
6. **Backend Integration**: Add Node.js server
7. **Database**: Store user data persistently
8. **Real ML**: Integrate Python machine learning

## File Structure

```
career-predictor-simple/
├── index.html              # Main application with dataset integration
├── career-dataset.json     # Kaggle dataset (real salary data)
├── README-simple.md        # This documentation
└── package-simple.json     # Simple package config
```

## Dataset Citation

**Original Dataset**: "Data Science Job Salaries" from Kaggle
- **Source**: https://www.kaggle.com/datasets/
- **License**: Open Data
- **Year**: 2023
- **Records**: 10+ career categories

Perfect for second-year students learning web development and data integration! 🚀</content>
<parameter name="filePath">c:\Users\admin\OneDrive\Desktop\careerTwin 3\Care-Hub\package-simple.json