from flask import Flask, request, render_template
import numpy as np
import pickle

dtr = pickle.load(open('dtr.pkl', 'rb'))
preprocessor = pickle.load(open('preprocessor.pkl', 'rb'))

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            Year = int(request.form['Year'])
            average_rain_fall_mm_per_year = float(request.form['average_rain_fall_mm_per_year'])
            pesticides_tonnes = float(request.form['pesticides_tonnes'])
            avg_temp = float(request.form['avg_temp'])
            Area = request.form['Area']
            Item = request.form['Item']

            features = np.array([[Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item]])
            transformed_features = preprocessor.transform(features)
            predicted_value = dtr.predict(transformed_features)[0]

            return render_template('index.html', predicted_value=predicted_value)
        except Exception as e:
            return render_template('index.html', error=str(e))

if __name__ == '__main__':
    app.run(debug=True)
