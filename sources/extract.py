import os
import re
import json
import random
import string
import wordninja
from bs4 import BeautifulSoup

# Lista de stop words (artículos, preposiciones, etc.) en inglés
stop_words = {
    'a', 'an', 'the', 'of', 'in', 'and', 'or', 'to', 'with', 'for', 'on', 'at',
    'by', 'from', 'is', 'are', 'was', 'were', 'that', 'this', 'it', 'as', 'but', 'if', 'then'
}

def clean_text(text):
    """
    Corrige espacios extra, elimina saltos de línea y ajusta la separación entre minúsculas y mayúsculas.
    """
    text = re.sub(r'\s+', ' ', text)  # elimina espacios y saltos de línea extra
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)  # inserta espacio entre minúscula y mayúscula
    text = re.sub(r'([0-9])([A-Za-z])', r'\1 \2', text)  # dígitos y letras
    text = re.sub(r'([A-Za-z])([0-9])', r'\1 \2', text)
    return text.strip()

def segment_token(token):
    """
    Si el token (sin prefijos/sufijos de puntuación) es largo, intenta segmentarlo usando wordninja.
    Se re-capitaliza la primera parte si el token original empieza con mayúscula.
    """
    # Separar prefijo y sufijo de puntuación
    prefix = ''
    suffix = ''
    core = token
    while core and core[0] in string.punctuation:
        prefix += core[0]
        core = core[1:]
    while core and core[-1] in string.punctuation:
        suffix = core[-1] + suffix
        core = core[:-1]

    # Si el token "central" es largo (por ejemplo, más de 8 caracteres) y es alfabético, se intenta segmentar
    if len(core) > 8 and core.isalpha():
        # Usamos la versión en minúsculas para segmentar
        seg = wordninja.split(core.lower())
        if len(seg) > 1:
            # Si el token original comenzaba con mayúscula, se capitaliza la primera palabra segmentada
            if token[0].isupper():
                seg[0] = seg[0].capitalize()
            core = ' '.join(seg)
    return prefix + core + suffix

def segment_tokens(text):
    """
    Recorre cada token y aplica segmentación.
    """
    tokens = text.split()
    new_tokens = [segment_token(token) for token in tokens]
    return ' '.join(new_tokens)

def process_text(text):
    """
    Aplica limpieza y segmentación al texto.
    """
    cleaned = clean_text(text)
    segmented = segment_tokens(cleaned)
    return segmented

def extract_phrases_from_html(file_path):
    """
    Extrae párrafos de un archivo HTML, limpia y segmenta el texto.
    Solo se consideran párrafos con al menos 6 palabras.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        paragraphs = soup.find_all('p')
        phrases = []
        for p in paragraphs:
            txt = p.get_text(strip=True)
            txt = process_text(txt)
            words = txt.split()
            if len(words) >= 6:
                phrases.append(txt)
        return phrases

def pick_random_word(words):
    """
    Selecciona aleatoriamente (evitando la primera y última palabra) una palabra
    que no contenga espacios (es decir, sea una sola palabra) y que no sea una stop word.
    Se realizan hasta 10 intentos.
    """
    attempts = 0
    max_attempts = 10
    while attempts < max_attempts:
        idx = random.randint(1, len(words) - 2)
        word = words[idx]
        cleaned = word.strip(string.punctuation).lower()
        if ' ' in word:
            attempts += 1
            continue
        if cleaned and cleaned not in stop_words:
            return idx, word
        attempts += 1
    return None, None

def process_file(file_path):
    """
    Procesa un archivo HTML: extrae frases, selecciona una palabra válida para ocultar
    y crea la versión enmascarada de la frase.
    """
    phrases = extract_phrases_from_html(file_path)
    processed = []
    for phrase in phrases:
        words = phrase.split()
        if len(words) < 6:
            continue
        idx, chosen_word = pick_random_word(words)
        if idx is None:
            continue  # omitir si no se encuentra una palabra válida
        new_words = words.copy()
        new_words[idx] = "_____"
        masked_phrase = " ".join(new_words)
        processed.append({
            "masked": masked_phrase,
            "answer": chosen_word.strip(string.punctuation).lower(),
            "source": os.path.basename(file_path)
        })
    return processed

def main():
    base_dir = './'  # Directorio actual (ajusta si es necesario)
    all_processed = []
    for file in os.listdir(base_dir):
        if file.endswith('.html'):
            file_path = os.path.join(base_dir, file)
            processed = process_file(file_path)
            all_processed.extend(processed)
    # Guardar el resultado en un archivo JSON
    with open('math_phrases.json', 'w', encoding='utf-8') as f:
        json.dump(all_processed, f, ensure_ascii=False, indent=2)
    print(f"{len(all_processed)} frases procesadas y guardadas en math_phrases.json")

if __name__ == '__main__':
    main()

