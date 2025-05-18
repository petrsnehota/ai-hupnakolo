# app.py
from flask import Flask, request, jsonify
import openai
import json
import os
from feed_parser import load_products

app = Flask(__name__)

# Načti produkty z JSON souboru
products = load_products()

# Vlož sem svůj API klíč (nebo ho nastav jako proměnnou prostředí OPENAI_API_KEY)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    user_input = data.get("message", "")

    prompt = f"""
    Máš produktová data a zákazník napsal: '{user_input}'.
    Na základě toho doporuč 1–2 konkrétní produkty z tohoto výběru:

    {json.dumps(products[:20], indent=2, ensure_ascii=False)}

    Vrať název produktu, cenu a krátké vysvětlení proč je vhodný.
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Jsi odborný poradce pro cyklistické vybavení."},
                {"role": "user", "content": prompt}
            ]
        )
        answer = response.choices[0].message["content"]
        return jsonify({"reply": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
