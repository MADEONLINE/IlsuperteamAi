#!/usr/bin/env python3
"""
Vet Evidence — scarica le registrazioni cloud di Zoom senza passare dal browser.

Usa un'app Zoom "Server-to-Server OAuth". Legge le credenziali dall'ambiente,
non le stampa mai. Solo libreria standard: gira ovunque ci sia python3.

    export ZOOM_ACCOUNT_ID=...   ZOOM_CLIENT_ID=...   ZOOM_CLIENT_SECRET=...
    export ZOOM_USER=info@bravemedia.biz        # l'account che ha ospitato la riunione

    python3 zoom-pull.py --from 2026-09-10 --to 2026-09-10            # elenca
    python3 zoom-pull.py --from 2026-09-10 --to 2026-09-10 --download # scarica in ./zoom/

Scarica MP4, audio M4A e trascrizione VTT di ogni riunione nel periodo.
"""
import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

TOKEN_URL = "https://zoom.us/oauth/token"
API = "https://api.zoom.us/v2"


def need(name):
    v = os.environ.get(name)
    if not v:
        sys.exit(f"Manca la variabile d'ambiente {name}")
    return v


def token():
    account, cid, secret = need("ZOOM_ACCOUNT_ID"), need("ZOOM_CLIENT_ID"), need("ZOOM_CLIENT_SECRET")
    basic = base64.b64encode(f"{cid}:{secret}".encode()).decode()
    data = urllib.parse.urlencode({"grant_type": "account_credentials", "account_id": account}).encode()
    req = urllib.request.Request(TOKEN_URL, data=data, headers={"Authorization": f"Basic {basic}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)["access_token"]
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        sys.exit(f"Token rifiutato ({e.code}). Controlla Account ID, Client ID/Secret e che l'app sia attivata.\n{body}")


def get(tok, path, params=None):
    url = f"{API}{path}" + (f"?{urllib.parse.urlencode(params)}" if params else "")
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {tok}"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        sys.exit(f"API {path} → {e.code}. Se è 400/401 mancano gli scope di lettura delle registrazioni.\n{body}")


def list_recordings(tok, user, d_from, d_to):
    meetings, page = [], ""
    while True:
        params = {"from": d_from, "to": d_to, "page_size": 300}
        if page:
            params["next_page_token"] = page
        data = get(tok, f"/users/{urllib.parse.quote(user)}/recordings", params)
        meetings += data.get("meetings", [])
        page = data.get("next_page_token") or ""
        if not page:
            return meetings


def safe(s):
    return re.sub(r"[^A-Za-z0-9._-]+", "_", s).strip("_")[:80]


def download(tok, url, dest):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {tok}"})
    with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
        total, done = int(r.headers.get("Content-Length") or 0), 0
        while True:
            chunk = r.read(1 << 20)
            if not chunk:
                break
            f.write(chunk)
            done += len(chunk)
            if total:
                print(f"\r   {done/1e6:8.1f} / {total/1e6:.1f} MB", end="", flush=True)
    print()


WANTED = {"MP4", "M4A", "TRANSCRIPT"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="d_from", required=True, help="YYYY-MM-DD")
    ap.add_argument("--to", dest="d_to", required=True, help="YYYY-MM-DD")
    ap.add_argument("--download", action="store_true", help="scarica invece di elencare soltanto")
    ap.add_argument("--out", default="./zoom")
    a = ap.parse_args()

    tok = token()
    user = need("ZOOM_USER")
    meetings = list_recordings(tok, user, a.d_from, a.d_to)
    if not meetings:
        sys.exit(f"Nessuna registrazione per {user} tra {a.d_from} e {a.d_to}.")

    for m in meetings:
        print(f"\n{m.get('start_time','?')}  {m.get('topic','(senza titolo)')}  ({m.get('duration','?')} min)")
        files = [f for f in m.get("recording_files", []) if f.get("file_type") in WANTED]
        for f in files:
            size = (f.get("file_size") or 0) / 1e6
            print(f"   {f['file_type']:<10} {f.get('recording_type','-'):<34} {size:8.1f} MB")
        if not a.download:
            continue
        folder = os.path.join(a.out, safe(f"{m.get('start_time','')[:10]}_{m.get('topic','riunione')}"))
        os.makedirs(folder, exist_ok=True)
        for f in files:
            ext = {"MP4": "mp4", "M4A": "m4a", "TRANSCRIPT": "vtt"}[f["file_type"]]
            dest = os.path.join(folder, f"{safe(f.get('recording_type') or f['file_type'])}.{ext}")
            print(f"→ {dest}")
            download(tok, f["download_url"], dest)

    if not a.download:
        print("\nAggiungi --download per scaricare.")


if __name__ == "__main__":
    main()
