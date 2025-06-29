# BarberEase Project Setup

Backend => <https://barberease-3kbc.onrender.com>
Frontend =>

Clone the repository and set up the environment:

```bash
git clone https://github.com/Prince-gk/BarberEase.git && cd BarberEase
```

Open 2 terminal tabs and : `cd server` in one and `cd client` in the other.

# Server Setup

Install the required packages and set up the virtual environment:

```bash
virtualenv .venv -p $(which python)
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `server` directory with the following content:

```bash
cp .env.example .env
source .env
```

Run migrations to set up the database:

```bash
flask db init
flask db migrate
flask db upgrade
```

Finally, run the server:

```bash
flask run
# or
gunicorn -w 4 -b 0.0.0.0:5555 app:app
```

Test endpoint with `curl http://127.0.0.1:5555/`
Sanple response:

```bash
HTTP/1.1 200 OK
Server: gunicorn
Date: Sun, 29 Jun 2025 19:05:22 GMT
Connection: close
Content-Type: application/json
Content-Length: 20
Access-Control-Allow-Origin: *

{
    "message": "okay"
}
```

# Client Setup

Install the required packages:
Ensure node version is ==20 or higher.

```bash
npm install
npm run dev
```
