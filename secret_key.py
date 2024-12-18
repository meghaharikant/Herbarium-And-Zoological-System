import os


secret_key = os.urandom(24).hex()
print(f"Your generated secret key: {secret_key}")
