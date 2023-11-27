import base64
import requests
import json

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
        return encoded_string.decode('utf-8')

def send_image_to_server(image_base64, url):
    payload = json.dumps({"image": image_base64})
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=payload, headers=headers)
    print(response.text)

# Utilisation du script
image_path = '/home/evignal/Downloads/Purpfle.png'  # Remplacez par le chemin de votre image
encoded_image = encode_image_to_base64(image_path)

# URL de votre API
api_url = 'http://localhost:8080/api/v1/images/upload'

send_image_to_server(encoded_image, api_url)