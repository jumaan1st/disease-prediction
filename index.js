import express from 'express';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import run from './run.js';
import fs from 'fs';
import PDFDocument from 'pdfkit';
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Define your symptoms list (should match columns in Training.csv)
const symptomsList = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain',
    'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition',
    'spotting_urination', 'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss',
    'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes',
    'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea',
    'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever',
    'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes',
    'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose',
    'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region',
    'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs',
    'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremities', 'excessive_hunger',
    'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness',
    'stiff_neck', 'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
    'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of_urine', 'continuous_feel_of_urine',
    'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain',
    'altered_sensorium', 'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic_patches',
    'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum',
    'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections',
    'coma', 'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload', 'blood_in_sputum',
    'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring',
    'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose',
    'yellow_crust_ooze'
];

// Templates
const templete = `<section class="results-section">
    <h1>Top 6 Hospitals for (Specialist) in (location)</h1>
    <div class="cards-container">
        <div class="hospital-card">
            <h2>( Hospital name )</h2>
            <p>Contact:(contact)</p>
            <p>Address: (Address)</p>
            <p>Website: <a href="(link)">(link)/</a></p>
            <p>Specialist (Specialist): (specialist name)</p>
        </div>
        <div class="hospital-card">
            <h2>( Hospital name )</h2>
            <p>Contact:(contact)</p>
            <p>Address: (Address)</p>
            <p>Website: <a href="(link)">(link)/</a></p>
            <p>Specialist (Specialist): (specialist name)</p>
        </div>
        <div class="hospital-card">
            <h2>( Hospital name )</h2>
            <p>Contact:(contact)</p>
            <p>Address: (Address)</p>
            <p>Website: <a href="(link)">(link)/</a></p>
            <p>Specialist (Specialist): (specialist name)</p>
        </div>
        <div class="hospital-card">
            <h2>( Hospital name )</h2>
            <p>Contact:(contact)</p>
            <p>Address: (Address)</p>
            <p>Website: <a href="(link)">(link)/</a></p>
            <p>Specialist (Specialist): (specialist name)</p>
        </div>
        <div class="hospital-card">
            <h2>( Hospital name )</h2>
            <p>Contact:(contact)</p>
            <p>Address: (Address)</p>
            <p>Website: <a href="(link)">(link)/</a></p>
            <p>Specialist (Specialist): (specialist name)</p>
        </div>
        <div class="hospital-card">
            <h2>( Hospital name )</h2>
            <p>Contact:(contact)</p>
            <p>Address: (Address)</p>
            <p>Website: <a href="(link)">(link)/</a></p>
            <p>Specialist (Specialist): (specialist name)</p>
        </div>
    </div>
</section>`;

const template1 = `<section class="detailedresult-section">
    <div class="card">
        <h1>Disease Prediction</h1>
        <p>Disease Name: (disease name)</p>
        <p>Accuracy: (accuracy)</p>
        <p>Information about disease: (information about disease)</p>
        <p>Doctor to consult: (doctor to consult)</p>
    </div>
    <a href="/detailed" class="goback-button">Go Back</a>
</section>`;

// Routes
app.get('/index', (req, res) => {
    res.render('index'); 
});

app.get('/predict', (req, res) => {
    res.render('input', { symptoms: symptomsList });
});

app.get('/detailed', async (req, res) => {
    res.render('detailed.ejs');
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/location', async (req, res) => {
    res.render('location');
});

// Handlers
app.post('/predict', async (req, res) => {
    // Extract symptoms from form data
    const userInputs = [];
    for (let symptom of symptomsList) {
        userInputs.push(parseInt(req.body[symptom] || 0));  // Ensure input is numeric (0 or 1)
    }

    let result = await runPythonScript(userInputs);
    let prompt = `Patient diagnosed with ${result}. Suggest the appropriate specialist in one line.`;

    let result2 = await run(prompt);

    res.render('result', { predictedDisease: result, predictedDoctor: result2 });
});

app.post('/detailed', async (req, res) => {
    // Extract the symptoms from the request body
    let symptoms = req.body;
    symptoms = JSON.stringify(symptoms);

    // Construct the string to be passed to the run function
    const inputString = `
    You are a medical diagnostic AI assistant. Based on the patient's age, gender, medical history, duration of symptoms, and symptoms (which may include pain categories), perform the following:

1. Predict the most likely disease or condition.
2. Provide the prediction accuracy as a percentage and a confidence level (Low, Medium, High).
3. Describe the disease in detail, including:
   - Name
   - Description
   - Common symptoms
   - Risk factors
   - Possible complications
4. Recommend the appropriate medical specialist to consult, with a reason.
5. Provide a diet and lifestyle recommendation that helps manage or prevent the disease. Include:
   - Goal
   - Recommended foods
   - Foods to avoid
   - Lifestyle tips

⚠️ The response must be strictly in valid **JSON format** and include no extra explanatory text.

📥Input (can vary in format):

${symptoms}


📤 Expected Output (Strict JSON Format):

json
Copy
Edit
{
  "prediction": {
    "disease": "Predicted Disease Name",
    "accuracy_percentage": 85,
    "confidence_level": "High"
  },
  "disease_information": {
    "name": "Disease Name",
    "description": "Brief description of the disease...",
    "common_symptoms": ["symptom1", "symptom2", "..."],
    "risk_factors": ["factor1", "factor2", "..."],
    "complications": ["complication1", "complication2", "..."]
  },
  "recommended_doctor": {
    "specialist": "Doctor Type",
    "reason": "Why this specialist is suitable"
  },
  "diet_recommendation": {
    "goal": "Health objective for managing this disease",
    "recommended_foods": ["food1", "food2", "..."],
    "foods_to_limit_or_avoid": ["foodX", "foodY", "..."],
    "lifestyle_tips": ["tip1", "tip2", "..."]
  }
}

    `;

    // console.log(inputString);
    // Run the prediction
    let result =  JSON.parse(await run(inputString));
    console.log(result);

    // Assuming 'detailedresult.ejs' is your template for displaying detailed results

    // Render the result
    res.render('completediscreption', { diagnosis: result });
});


app.post('/download-report', (req, res) => {
    const data = JSON.parse(req.body.reportData);

    const doc = new PDFDocument();
    res.setHeader('Content-disposition', 'attachment; filename="disease_report.pdf"');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text("Medical Diagnosis Report", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Disease: ${data.prediction.disease}`);
    doc.text(`Accuracy: ${data.prediction.accuracy_percentage}%`);
    doc.text(`Confidence: ${data.prediction.confidence_level}`);
    doc.moveDown();

    doc.fontSize(16).text("Disease Information", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Name: ${data.disease_information.name}`);
    doc.text(`Description: ${data.disease_information.description}`);
    doc.moveDown();

    doc.text("Common Symptoms:");
    data.disease_information.common_symptoms.forEach(symptom => doc.text(`- ${symptom}`));
    doc.moveDown();

    doc.text("Risk Factors:");
    data.disease_information.risk_factors.forEach(risk => doc.text(`- ${risk}`));
    doc.moveDown();

    doc.text("Possible Complications:");
    data.disease_information.complications.forEach(comp => doc.text(`- ${comp}`));
    doc.moveDown();

    doc.fontSize(16).text("Recommended Doctor", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Specialist: ${data.recommended_doctor.specialist}`);
    doc.text(`Reason: ${data.recommended_doctor.reason}`);
    doc.moveDown();

    doc.fontSize(16).text("Diet & Lifestyle Recommendations", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Goal: ${data.diet_recommendation.goal}`);
    doc.moveDown();

    doc.text("Recommended Foods:");
    data.diet_recommendation.recommended_foods.forEach(food => doc.text(`- ${food}`));
    doc.moveDown();

    doc.text("Foods to Avoid:");
    data.diet_recommendation.foods_to_limit_or_avoid.forEach(food => doc.text(`- ${food}`));
    doc.moveDown();

    doc.text("Lifestyle Tips:");
    data.diet_recommendation.lifestyle_tips.forEach(tip => doc.text(`- ${tip}`));

    doc.end();
});

app.post('/location', async (req, res) => {
    let result = await run(`find the list of top six  hospital for ${req.body.specialist} at ${req.body.location} with each hospital details individually in order of the hospital ranking by medical councils and add the results for ejs partial in the templete ${templete}`);
    const templatePath = './views/hospital.ejs';
    const templateContent = fs.writeFileSync(templatePath, result);
    res.render('location', { location: req.body.location, specialist: req.body.specialist });
});

// Python Script
async function runPythonScript(userInputs) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['predict.py', ...userInputs]);
        let output = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(`Python process exited with code ${code}`);
            }
        });

        pythonProcess.on('error', (err) => {
            reject(err);
        });
    });
}

app.post('/save-location', async(req, res) => {
    const { location} = req.body;
    console.log(req.body);
    let result = JSON.parse(await run(`
        Retrieve a list of the top six hospitals specializing in ${req.body.specialist} located in ${JSON.stringify(location)}. The list should be ranked **strictly in descending order of accreditation or quality scores provided by relevant national or regional medical councils or authoritative bodies.

For each hospital, include comprehensive details in the following JSON format, ensuring that all fields are populated accurately and relevant to the specified specialty:

json
Copy
Edit
[
  {
    "rank": 1,
    "name": "<Hospital Name>",
    "location": "<Full Area and City>",
    "type": "<Private/Government/Trust>",
    "specialties": [
      "<List of relevant medical specialties specific to ${req.body.specialist}>"
    ],
    "facilities": [
      "<List of top-tier medical or diagnostic facilities related to the specialty>"
    ],
    "website": "<Official hospital website>"
  },
  ...
]
Important Guidelines:

All hospital details must be accurate and specialty-specific.

Rankings should only be based on recognized medical council standards, not user reviews or advertisements.

Avoid duplicate or generic facility entries across hospitals unless they are genuinely present.

Output must be well-formatted valid JSON — ensure no trailing commas or syntax errors.

Prioritize hospitals that have centers of excellence or certified programs in the requested specialty.
        `));
    console.log(result);
    res.json(result);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
