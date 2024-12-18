from flask import Flask, request, render_template, jsonify, redirect, url_for, session
import sqlite3
import re

HERB_DB = 'herb.db'

def get_db_connection(database):
    conn = sqlite3.connect(database)
    conn.row_factory = sqlite3.Row
    return conn


conn = get_db_connection(HERB_DB)
cur = conn.cursor()

cur.execute('''UPDATE Users SET Scientific_Name = 'Oryza ', Common_Name = 'mh', Genus = 'Ora', Family = 'Poaceae', Description = 'O. sativa has an erect stalk stem that grows 80-120 cm (30-45 in) tall, with a smooth surface.', Habitat = 'Asia', Lifespan = 'many years', Varieties = 'abc', Uses = 'Main part of the food humans eat.', Availability = 'India', Image_link = 'https://en.wikipedia.org/wiki/Rice#/media/File:Rice_grains_(IRRI).jpg' WHERE Scientific_Name = 'Oryza sativa';''')


