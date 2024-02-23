# Capstone

## Deployment
All deployments are through [Render](https://dashboard.render.com/)
- `capstone-frontend` Deploy: https://capstone-frontend-u9ds.onrender.com
- `capstone-backend` Deploy: https://capstone-backend-zup0.onrender.com

## Local Setup

### Installations
The following applications must be installed locally (if you don't already have it):
- Node: https://nodejs.org/en/download
- Python: https://www.python.org/downloads/

### Cloning the Repo
1. Follow GitHub's instructions [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) to setup an SSH key connecting GitHub to your local laptop (if one doesn't already exist)
2. Copy the SSH command from the repo
3. Locally run: `git clone <copied_key>`

## Getting Started

Setup Backend:
1. Open new terminal
2. Change directory: `cd backend`
3. Create local virtual environment: `python3 -m venv .venv` (or use `python`)
4. Activate virtual environment: `source .venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Install NLTK dependencies: `python3 -m nltk.downloader vader_lexicon` (if you are running into an error, try running `pip install certifi /Applications/Python\ {PYTHON_VERSION}/Install\ Certificates.command` first and then re-installing the NLTK dependencies. Make sure {PYTHON_VERSION} is the same as what exists in your File Explorer!)
7. Request environment variables from team: `.env` file
8. Deactivate local virtual environment (when needed): `deactivate`

Adding Additional Packages:
1. Change directory: `cd backend`
2. Activate your virtual environment: `source .venv/bin/activate`
3. Install packages in terminal: (e.g., `pip install pandas`)
4. Update requirements: `pip freeze > requirements.txt`
5. Commit `requirements.txt`

Setup Frontend:
1. Open new terminal
2. Change directory: `cd frontend`
3. Install dependencies: `npm install`
4. Request environment variables from team: `.env` file

## Starting Application

Backend:
1. Open new terminal
2. Change directory: `cd backend`
3. Activate virtual environment: `source .venv/bin/activate`
4. Start service: `flask --debug run --no-debugger`

Frontend:
1. Open new terminal
2. Change directory: `cd frontend`
3. Start service: `npm start`

## Testing

Backend: In `backend` folder, run `python3 -m unittest discover`
Frontend: In `frontend` folder, run `npm test`
