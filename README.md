# Disease Prediction and Medical Advisory System

This project is a web application designed to predict potential diseases based on user-provided symptoms. It further leverages Generative AI to offer detailed medical information, specialist recommendations, diet and lifestyle advice, and hospital suggestions.

## Features

- **Symptom-based Disease Prediction:** Utilizes a machine learning model to predict diseases.
- **Detailed Disease Information:** Provides comprehensive details about the predicted disease, including description, common symptoms, risk factors, and potential complications.
- **Specialist Recommendation:** Suggests the type of medical specialist to consult for the predicted condition.
- **Diet and Lifestyle Advice:** Offers tailored diet and lifestyle recommendations.
- **Hospital Finder:** Recommends top hospitals based on the required specialist and user's location.
- **PDF Report Generation:** Allows users to download a detailed medical diagnosis report in PDF format.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS (Embedded JavaScript templates)
- **Machine Learning:** Python, Scikit-learn (DecisionTreeClassifier)
- **Generative AI:** Google Gemini API (`@google/genai`)
- **Data Storage:** CSV file (`Training.csv`) for ML model training data.
- **PDF Generation:** `pdfkit`
- **Environment Management:** `dotenv`

## Project Structure

```
mini-project/
├── .env                # Environment variables (user needs to create this)
├── .git/
├── .gitignore
├── README.md
├── Training.csv        # Dataset for ML model
├── filter.js           # Utility functions to clean AI output
├── index.js            # Main Express application, routing, and core logic
├── node_modules/
├── package-lock.json
├── package.json
├── predict.py          # Python script for ML disease prediction
├── public/             # Static assets (CSS, images, client-side JS)
│   └── css/
│       └── style.css
│   └── images/
│   └── js/
├── run.js              # Handles interaction with Google Gemini API
└── views/              # EJS templates for UI
    ├── completediscreption.ejs
    ├── detailed.ejs
    ├── hospital.ejs
    ├── index.ejs
    ├── input.ejs
    ├── location.ejs
    ├── result.ejs
    └── partials/
        └── hospital_cards.ejs # (Example, based on template usage)
```

## Setup and Installation

### Prerequisites

- Node.js and npm (Node Package Manager)
- Python 3.x
- Pip (Python package installer)

### Steps

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd mini-project
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Install Python dependencies:**
    The project uses `pandas` and `scikit-learn`. Install them if you haven't already:
    ```bash
    pip install pandas scikit-learn
    ```

4.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project directory and add your Google Gemini API key:
    ```env
    gemini_api=YOUR_GEMINI_API_KEY
    PORT=3000 # Optional: specify a port, defaults to 3000
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual API key.

## How to Run

1.  **Start the application:**
    ```bash
    node index.js
    ```

2.  Open your web browser and navigate to `http://localhost:3000` (or the port you specified in the `.env` file).

## Usage

-   Navigate to the prediction page to input symptoms.
-   View the predicted disease and specialist recommendation.
-   Access detailed information, including diet and lifestyle advice.
-   Use the hospital finder to get recommendations based on location.
-   Download the diagnosis report as a PDF.

## License

This project is licensed under the ISC License. See the `LICENSE` file (or `package.json`) for details.