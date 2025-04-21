# ScreenTop - Movie Recommendation System

ScreenTop is an innovative movie recommendation system that combines the power of AI and movie databases to provide personalized movie suggestions based on user prompts.

## 🎯 Features

- **AI-Powered Analysis**: Utilizes Google's Gemini AI to analyze user prompts and understand movie preferences
- **Movie Database Integration**: Connects with OMDB API to fetch detailed movie information
- **Smart Recommendations**: Provides relevant movie suggestions based on user input
- **Interactive Interface**: User-friendly design for seamless interaction

## 🚀 How It Works

1. **User Input**: Users enter a prompt describing their movie preferences (e.g., "interstellar but funny")
2. **AI Analysis**: The prompt is processed by Gemini AI to understand the user's preferences
3. **Movie Search**: The system queries the OMDB API to find matching movies
4. **Results Display**: Relevant movie recommendations are displayed to the user

## 🛠️ Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn-ui

- **APIs**:
  - Google Gemini AI
  - OMDB API

## 🏃‍♂️ Getting Started

1. Clone the repository:
```bash
git clone https://github.com/shubh-aarambh/ScreenTop.git
```

2. Navigate to the project directory:
```bash
cd ScreenTop
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OMDB_API_KEY=your_omdb_api_key
```

5. Start the development server:
```bash
npm run dev
```

## 📝 API Keys Required

To use this application, you'll need:
1. A Google Gemini AI API key
2. An OMDB API key

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
