from flask import Flask, request, render_template, jsonify, redirect, url_for, session
import sqlite3
import re

app = Flask(__name__)
app.secret_key = '46101dae9c9e70143a0514ea62ad945e06b7960a45847ede'

HERB_DB = 'herb.db'
WILDLIFE_DB = 'wildlife.db'
EXAMPLE_DB = 'example1.db'

def get_db_connection(database):
    conn = sqlite3.connect(database)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/popup')
def popup():
    return render_template('popup.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    if not is_valid_email_format(email):
        return jsonify({'status': 'error', 'error': 'Invalid email address.'}), 400

    if not validate_password(password):
        return jsonify({'status': 'error', 'error': 'Password is not strong enough.'}), 400

    conn = get_db_connection(EXAMPLE_DB)
    cur = conn.cursor()
    cur.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cur.fetchone()

    if user is None:
        conn.close()
        return jsonify({'status': 'error', 'error': 'You have not yet signed up.'}), 400

    cur.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
    user = cur.fetchone()
    conn.close()

    if user:
        session['logged_in'] = True
        session['email'] = email
        return jsonify({'status': 'success', 'message': 'Logged in successfully.'})
    else:
        return jsonify({'status': 'error', 'error': 'Invalid email or password.'}), 400
    

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('logged_in', None)
    session.pop('email', None)
    return jsonify({'status': 'success', 'message': 'Logged out successfully.'})



@app.route('/signup', methods=['POST'])
def signup():
    email = request.form['email']
    password = request.form['password']
    terms_accepted = request.form.get('policy', 'off') == 'on'

    if not is_valid_email_format(email):
        return jsonify({'status': 'error', 'error': 'Invalid email address.'}), 400

    if not email.endswith('@hmz.in'):
        return jsonify({'status': 'error', 'error': 'Public cannot sign up. Access restricted to users with the domain "hmz.in".'}), 400

    if not validate_password(password):
        return jsonify({'status': 'error', 'error': 'Password is not strong enough.'}), 400

    conn = get_db_connection(EXAMPLE_DB)
    cur = conn.cursor()
    try:
        cur.execute('INSERT INTO users (email, password, terms_accepted) VALUES (?, ?, ?)',
                    (email, password, int(terms_accepted)))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'status': 'error', 'error': 'Email already exists.'}), 400

    conn.close()
    return jsonify({'status': 'success', 'message': 'Signed up successfully.'})


@app.route('/add-plant', methods=['POST'])
def add_plant():
    try:
        # Retrieve data from the form
        scientific_name = request.form['S_name']
        common_name = request.form['C_name']
        genus = request.form['genus']
        family = request.form['family']
        description = request.form['description']
        habitat = request.form['habitat']
        lifespan = request.form['lifespan']
        varieties = request.form['varieties']
        uses = request.form['uses']
        availability = request.form['availability']
        image = request.form['image']

        # Connect to the database
        conn = get_db_connection(HERB_DB)
        cur = conn.cursor()

        cur.execute('INSERT INTO Users (Scientific_Name, Common_Name, Genus, Family, Description, Habitat, Lifespan, Varieties, Uses, Availability, Image_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    (scientific_name, common_name, genus, family, description, habitat, lifespan, varieties, uses, availability, image))
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Plant added successfully.'})
    except Exception as e:
        print(f"An error occurred: {e}")
        conn.close()
        return jsonify({'status': 'error', 'error': 'Unsuccessful plant addition.'}), 400
    

@app.route('/delete-plant', methods=['POST'])
def delete_plant():
    try:
        scientific_name = request.form['p_name']

        conn = get_db_connection(HERB_DB)
        cur = conn.cursor()

        cur.execute('DELETE FROM Users WHERE Scientific_Name = ?',(scientific_name,))
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Plant deleted successfully.'})
    except Exception as e:
        print(f"An error occurred: {e}")
        conn.close()
        return jsonify({'status': 'error', 'error': 'Unsuccessful plant deletion.'}), 400
    

@app.route('/update-plant', methods=['POST'])
def update_plant():
    try:
        # Get the current scientific name
        current_scientific_name = request.form['old_s_name']
        
        # Collect new values from the form
        new_scientific_name = request.form['new_s_name']
        common_name = request.form['C_name']
        genus = request.form['genus']
        family = request.form['family']
        description = request.form['description']
        habitat = request.form['habitat']
        lifespan = request.form['lifespan']
        varieties = request.form['varieties']
        uses = request.form['uses']
        availability = request.form['availability']
        image = request.form['image']

        # Connect to the database
        conn = get_db_connection(HERB_DB)
        cur = conn.cursor()

        # Prepare the update query dynamically based on provided fields
        update_fields = []
        update_values = []

        if new_scientific_name:
            update_fields.append("Scientific_Name = ?")
            update_values.append(new_scientific_name)
        if common_name:
            update_fields.append("Common_Name = ?")
            update_values.append(common_name)
        if genus:
            update_fields.append("Genus = ?")
            update_values.append(genus)
        if family:
            update_fields.append("Family = ?")
            update_values.append(family)
        if description:
            update_fields.append("Description = ?")
            update_values.append(description)
        if habitat:
            update_fields.append("Habitat = ?")
            update_values.append(habitat)
        if lifespan:
            update_fields.append("Lifespan = ?")
            update_values.append(lifespan)
        if varieties:
            update_fields.append("Varieties = ?")
            update_values.append(varieties)
        if uses:
            update_fields.append("Uses = ?")
            update_values.append(uses)
        if availability:
            update_fields.append("Availability = ?")
            update_values.append(availability)
        if image:
            update_fields.append("Image_link = ?")
            update_values.append(image)

        # Add the current scientific name for the WHERE clause
        update_values.append(current_scientific_name)

        # Construct the SQL query
        sql_query = f"UPDATE Users SET {', '.join(update_fields)} WHERE Scientific_Name = ?"
        cur.execute(sql_query, update_values)
        conn.commit()
        conn.close()

        return jsonify({'status': 'success', 'message': 'Plant updated successfully.'})
    except Exception as e:
        print(f"An error occurred: {e}")
        conn.close()
        return jsonify({'status': 'error', 'error': 'Update failed.'}), 400

@app.route('/add-animal', methods=['POST'])
def add_animal():
    conn = None
    try:

        S_name = request.form['s_name']
        Class = request.form['class']
        order = request.form['order']
        family = request.form['family']
        description = request.form['description']
        diet = request.form['diet']
        conserve_status = request.form['conser_status']
        lifespan = request.form['lifespan']
        habitat = request.form['habitat']
        img1_link = request.form['image1']
        img1_des = request.form['image1_des']
        img2_link = request.form['image2']
        img2_des = request.form['image2_des']

        conn = get_db_connection(WILDLIFE_DB)
        cur = conn.cursor()

        cur.execute('INSERT INTO wildlife (name, class, "order", family, description, diet, conservation_status, lifespan, habitat, image1, image1_des, image2, image2_des) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                    (S_name, Class, order, family, description, diet, conserve_status, lifespan, habitat, img1_link, img1_des, img2_link, img2_des))
        
        conn.commit()
        return jsonify({'status': 'success', 'message': 'Animal added successfully.' })
    
    except Exception as e:
        print(f"An error occurred: {e}")  
        return jsonify({'status': 'error', 'error': 'Unsuccessful animal addition.'}), 400  
    
    finally:
        if conn:
            conn.close()  # Ensure connection is closed in all cases


@app.route('/delete-animal', methods=['POST'])
def delete_animal():
    try:
        Scientific_Name = request.form['a_name']

        conn = get_db_connection(WILDLIFE_DB)
        cur = conn.cursor()

        cur.execute('DELETE FROM wildlife WHERE name = ?', (Scientific_Name,))
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Animal deleted successfully.'})
    
    except Exception as e:
        print(f"An error occurred: {e}")
        conn.close()
        return jsonify({'status': 'error', 'error': 'Unsuccessful animal deletion.'})
    

@app.route('/update-animal', methods=['POST'])
def update_animal():
    conn = None
    try:
        Current_name = request.form['cur_name']
        New_name = request.form.get('new_name')
        Class = request.form.get('class')
        order = request.form.get('order')
        family = request.form.get('family')
        description = request.form.get('description')
        diet = request.form.get('diet')
        conserve_status = request.form.get('conser_status')
        lifespan = request.form.get('lifespan')
        habitat = request.form.get('habitat')
        img1_link = request.form.get('image1')
        img1_des = request.form.get('image1_des')
        img2_link = request.form.get('image2')
        img2_des = request.form.get('image2_des')

        conn = get_db_connection(WILDLIFE_DB)
        cur = conn.cursor()

        update_fields = []
        update_values = []

        if New_name:
            update_fields.append("name = ?")
            update_values.append(New_name)

        if Class:
            update_fields.append("class = ?")
            update_values.append(Class)

        if order:
            update_fields.append("'order' = ?")
            update_values.append(order)

        if family:
            update_fields.append("family = ?")
            update_values.append(family)

        if description:
            update_fields.append("description = ?")
            update_values.append(description)

        if diet:
            update_fields.append("diet = ?")
            update_values.append(diet)

        if conserve_status:
            update_fields.append("conservation_status = ?")
            update_values.append(conserve_status)

        if lifespan:
            update_fields.append("lifespan = ?")
            update_values.append(lifespan)

        if habitat:
            update_fields.append("habitat = ?")
            update_values.append(habitat)

        if img1_link:
            update_fields.append("image1 = ?")
            update_values.append(img1_link)

        if img1_des:
            update_fields.append("image1_des = ?")
            update_values.append(img1_des)

        if img2_link:
            update_fields.append("image2 = ?")
            update_values.append(img2_link)

        if img2_des:
            update_fields.append("image2_des = ?")
            update_values.append(img2_des)

        # Append the current name at the end of the values
        update_values.append(Current_name)
        sql_query = f"UPDATE wildlife SET {', '.join(update_fields)} WHERE name = ?"
        cur.execute(sql_query, update_values)
        conn.commit()
        return jsonify({'status': 'success', 'message': 'Animal updated successfully.'})
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'status': 'error', 'error': str(e)}), 400
    
    finally:
        if conn:
            conn.close()

        



@app.route('/search_plants/<query>', methods=['GET'])
def search_plants(query):
    conn = get_db_connection('herb.db')
    cur = conn.cursor()
    cur.execute("SELECT * FROM Users WHERE Scientific_Name LIKE ? OR Common_Name LIKE ? OR Description LIKE ? OR Varieties LIKE ?", ('%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%'))
    results = cur.fetchall()
    conn.close()
    return jsonify([dict(row) for row in results])

@app.route('/search_animals/<query>', methods=['GET'])
def search_animals(query):
    conn = get_db_connection('wildlife.db')
    cur = conn.cursor()
    cur.execute("SELECT * FROM wildlife WHERE name LIKE ? OR description LIKE ?", ('%' + query + '%', '%' + query + '%'))
    results = cur.fetchall()
    conn.close()
    return jsonify([dict(row) for row in results])

def is_valid_email_format(email):
    email_regex = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', re.IGNORECASE)
    return email_regex.match(email)

def validate_password(password):
    min_length = 8
    has_uppercase = re.search(r'[A-Z]', password)
    has_lowercase = re.search(r'[a-z]', password)
    has_digit = re.search(r'\d', password)
    has_special = re.search(r'\W', password)
    return len(password) >= min_length and has_uppercase and has_lowercase and has_digit and has_special

if __name__ == '__main__':
    app.run(debug=True)