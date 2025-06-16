# Family Football Predictions
**nfl-preds** is a web application for managing NFL game predictions within my family. The project brings an old family tradition—making NFL game predictions on paper—into an online format for easier access, better accuracy, and remote participation.

The site is built with **Angular** and uses **Google Sheets** as a backend for storing predictions and tracking results. A **Google Apps Script** web service handles communication between the site and the spreadsheet.

Game outcomes are automatically updated by scraping the official NFL website every 4 hours, keeping team records accurate and standings up to date. Predictions can be made by week or by team, and standings update dynamically to reflect correct predictions.

## Features:

- Family standings leaderboard
- Predict games by week or by favorite team
- Automatic score tracking from official NFL results
- Predictions editable until the season begins (locking later)
- Built in Angular with a lightweight backend using Google Apps Script + Google Sheets

> [!NOTE]
> This project was made primarily for personal use, but could be forked and adapted by others with some backend customization.
