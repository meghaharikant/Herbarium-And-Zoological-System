import sqlite3
import logging

# Set up logging
logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

def connect_db():
    """Connect to the SQLite database and create a cursor."""
    try:
        conn = sqlite3.connect("example1.db")
        cur = conn.cursor()
        return conn, cur, ""
    except sqlite3.Error as e:
        logging.error("Error connecting to DB or creating cursor: %s", e)
        return None, None, str(e)

def create_user_table(cur, conn):
    """Create the users table if it does not already exist."""
    try:
        sql = """CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            terms_accepted INTEGER
        )"""
        cur.execute(sql)
        conn.commit()
        return ""
    except sqlite3.Error as e:
        logging.error("Error creating table: %s", e)
        return str(e)

def main():
    """Main function to connect to the database and create the users table."""
    conn, cur, err = connect_db()
    if err == "":
        err = create_user_table(cur, conn)
        conn.close()  # Close the database connection
    if err:
        print("Error:", err)

if __name__ == "__main__":
    main()