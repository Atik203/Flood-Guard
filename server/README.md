# Flood-Guard Python Backend 🌊

This is the backend server for the **Flood-Guard** system. It is built using **Python 3.12**, **FastAPI**, **SQLite**, and **scikit-learn**. It acts as an MQTT client to receive hardware data, uses an ML Decision Tree to predict flood risk, and provides dynamic data to the Next.js frontend!

---

## 🚀 How to Run Locally

### 1. Ensure you are in the `server` directory
Before running any commands, make sure your terminal is inside the `server` folder:
```powershell
cd e:\PROJECT\Flood-Guard\server
```

### 2. Start the Backend Server & MQTT Listener
Use your Python Virtual Environment (`venv`) to run `uvicorn`, which will start the FastAPI HTTP server and silently spin up the MQTT broker listener in the background:
```powershell
.\venv\Scripts\uvicorn.exe main:app --reload
```
*The server will now be accessible at `http://localhost:8000` (and `http://localhost:8000/docs` for the interactive API testing page).*

### 3. Run the Hardware Simulator
Since you might not have the physical **ESP32** connected right now, open a **separate, new terminal window**, ensure you are in the `server` folder again, and run the simulator script. This will push fake hardware numbers to your server so your frontend has data to graph:
```powershell
cd e:\PROJECT\Flood-Guard\server
.\venv\Scripts\python.exe simulator.py
```

*(Note: If you need to re-train the Machine Learning model based on our mock data, you can run `.\venv\Scripts\python.exe train_mock_model.py` anytime).*

---

## 🌍 Where to deploy for free? (Vercel Alternatives for Python)

Next.js is fantastic on **Vercel**, but Vercel is highly optimized for Serverless Node.js/Edge rather than heavy Machine-Learning Python servers relying on persistent long-running background tasks (like our MQTT listener).

For this Python backend, here are the absolute best **free** places to deploy:

### 1. Render (Highly Recommended) ⭐
- **Why:** Render is incredibly easy to use. You link your GitHub repository, tell it your framework is Python + FastAPI, and it deploys automatically.
- **Cost:** Free tier includes a Web Service (spins down after 15 mins of inactivity, spins back up on request). Perfect for academic/portfolio projects.
- **Deploy Command Used:** `uvicorn main:app --host 0.0.0.0 --port 10000`

### 2. Railway
- **Why:** Similar to Render, Railway builds and deploys Python code flawlessly directly from GitHub. It has an excellent dashboard (similar vibe to Vercel).
- **Cost:** Offers a $5 free monthly credit limit, which easily covers a 24/7 hobby project running for a month.

### 3. PythonAnywhere
- **Why:** Specifically tailored for Python projects.
- **Cost:** Free, but slightly harder to configure for modern async frameworks like FastAPI compared to Render.

### 4. Backblaze B2 / Supabase (For external database)
Since you are using `SQLite` (which saves to a local `.db` file), if you host on Render/Railway, your database might get wiped when the server restarts. If you want persistent database storage across deployments without paying, look into migrating the database URL string in `database.py` to use a free **Supabase (PostgreSQL)** database instead! 
