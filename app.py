from flask import Flask, request, jsonify, render_template, send_file
import json
import os

app = Flask(__name__)
entries_file = 'entries.json'

def load_entries():
    if os.path.exists(entries_file):
        with open(entries_file, 'r', encoding='utf-8') as file:
            return json.load(file)
    return []

def save_entries(entries):
    with open(entries_file, 'w', encoding='utf-8') as file:
        json.dump(entries, file, ensure_ascii=False, indent=4)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/entries', methods=['GET'])
def get_entries():
    entries = load_entries()
    return jsonify(entries)

@app.route('/entries', methods=['POST'])
def add_entry():
    entries = load_entries()
    entry = request.json
    entries.append(entry)
    save_entries(entries)
    return jsonify({'message': 'Entry added successfully'})

@app.route('/entries/<int:index>', methods=['PUT'])
def edit_entry(index):
    entries = load_entries()
    if 0 <= index < len(entries):
        entries[index] = request.json
        save_entries(entries)
        return jsonify({'message': 'Entry updated successfully'})
    return jsonify({'error': 'Invalid index'}), 404

@app.route('/entries/<int:index>', methods=['DELETE'])
def delete_entry(index):
    entries = load_entries()
    if 0 <= index < len(entries):
        entries.pop(index)
        save_entries(entries)
        return jsonify({'message': 'Entry deleted successfully'})
    return jsonify({'error': 'Invalid index'}), 404

@app.route('/export', methods=['GET'])
def export_entries():
    return send_file(entries_file, as_attachment=True, download_name='diary_entries.json')

@app.route('/import', methods=['POST'])
def import_entries():
    file = request.files['file']
    if file:
        entries = json.load(file)
        save_entries(entries)
        return jsonify({'message': 'Entries imported successfully'})
    return jsonify({'error': 'Failed to import entries'}), 400

@app.route('/clear', methods=['DELETE'])
def clear_entries():
    save_entries([])
    return jsonify({'message': 'All entries cleared successfully'})

if __name__ == '__main__':
    app.run(debug=True)
