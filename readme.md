# Event Ticketing Web App

![App Logo](/static/assets/ticketswap.png)

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Description

The Event Ticketing Web App is a Flask-based web server designed to facilitate the creation and management of private event listings. This application allows users to log in, create event listings with details such as event name, price, venue, and date, and share private links for ticket purchases.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/xploytt/ticketswap_.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up configuration:

   - Create a `.env` file based on the provided `.env.example`.

4. Run the application:

   ```bash
   python app.py
   ```

5. Access the app at [http://localhost:5000](http://localhost:5000).

## Usage

- Visit [http://localhost:5000](http://localhost:5000) in your web browser.
- Log in using the provided credentials('girnd').
- Create event listings with detailed information.
  -Event links to purchase the ticket will be sent to the buyer email, or:
- Share private links generated for each event for ticket purchases.

## Features

- **User Authentication**: Secure login using a passcode.
- **Event Creation**: Create private event listings with details.
- **Ticket Purchase**: Generate private links for ticket purchases.
- **Email Notifications**: Send HTML email notifications for private listings.

## Dependencies

- Flask
- Flask-Login
- Flask-Mail
- Flask-WTF
- pandas
- wtforms
- ...

## Contributing

Thank you. Feel free to make a pull request!

## License

This project is licensed under the [MIT License](LICENSE).

```

```
