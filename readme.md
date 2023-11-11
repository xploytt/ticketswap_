# Event Ticketing Web App

![App Logo](/static/assets/ticketswap.png)

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Features](#features)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Description

The Event Ticketing Web App is a Flask-based web server designed to facilitate the creation and management of private event listings. This application allows users to log in, create event listings with details such as event name, price, venue, and date, and share private links for ticket purchases.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up configuration:

   -No `.env` file needed as it is a simple application

4. Run the application:

   ```bash
   python app.py
   ```

5. Access the app at [http://localhost:5000](http://localhost:5000) make sure to configure the appropriate port. I'm using port 5000.

## Usage

- Visit [http://localhost:5000](http://localhost:5000) in your web browser.
- Log in using the provided credentials('girnd').
- Create event listings with detailed information.
  -Event links to purchase the ticket will be sent to the buyer email, or:
- Share private links generated for each event for ticket purchases.
