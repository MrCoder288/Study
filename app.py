from flask import Flask, request, render_template, session, redirect, url_for
import PyPDF2

app = Flask(__name__)
app.secret_key = 'your_secret_key'

@app.route('/', methods=['GET', 'POST'])
def upload_pdf():
    if request.method == 'POST':
        file = request.files['file']
        if file and file.filename.endswith('.pdf'):
            reader = PyPDF2.PdfReader(file)
            full_text = []
            for page in reader.pages:
                full_text.append(page.extract_text())
            session['text'] = ' '.join(full_text)
            session['speed'] = request.form['speed']
            return redirect(url_for('edit_text'))
    return render_template('upload.html')

@app.route('/edit', methods=['GET', 'POST'])
def edit_text():
    if request.method == 'POST':
        session['text'] = request.form['edited_text']
        return redirect(url_for('display_text'))
    return render_template('edit.html', text=session.get('text', ''))

@app.route('/display')
def display_text():
    return render_template('display.html', text=session.get('text', []).split(), speed=session.get('speed', 1))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)