# JobFinder Application

**JobFinder** is a Software Engineering project that helps job seekers find employment opportunities and offers an AI-powered chatbot for assistance.

## Features

* User Registration and Login
* Browse and Post Job Listings
* Search Jobs by Keyword
* AI Chatbot for Help and Guidance (powered by OpenAI API)

## Technology Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** PHP
* **Database:** MySQL
* **AI Integration:** OpenAI API (via `ai-proxy.php`)

## Prerequisites

* PHP 7.4 or higher
* MySQL 5.7 or higher
* A web server (e.g., Apache, Nginx)
* Composer (optional, if using additional PHP packages)
* An OpenAI API key (to enable the AI chatbot)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CactusJem/Software-Engineering.git
   cd Software-Engineering
   ```

2. **Configure the web server**

   * Place the project folder in your web server's root directory (e.g., `htdocs` for XAMPP).
   * Ensure Apache (or your chosen server) is running.

3. **Database Setup**

   1. Create a new database, e.g., `jobfinder`:

      ```sql
      CREATE DATABASE jobfinder;
      ```
   2. Import the following schema (you can execute in phpMyAdmin or MySQL CLI):

      ```sql
      USE jobfinder;
      
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(50),
        lastname VARCHAR(50),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255)
      );


      CREATE TABLE jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE jobs
      ADD COLUMN salary VARCHAR(255),
      ADD COLUMN company VARCHAR(255),
      ADD COLUMN contactNumber VARCHAR(50),
      ADD COLUMN contactEmail VARCHAR(255);
      ```

4. **Configure Database Connection**

   * Open `db.php` (or `database.php`) and update the credentials:

     ```php
     $host = 'localhost';
     $db   = 'jobfinder';
     $user = 'your_db_user';
     $pass = 'your_db_password';
     ```

5. **Configure AI Chatbot**

   * Open `ai-proxy.php` and set your OpenAI API key:

     ```php
     define('OPENAI_API_KEY', 'your_openai_api_key');
     ```

## Running the Application

1. Start your web server and navigate to:

   ```
   http://localhost/Software-Engineering/index.html
   ```
2. **Register** a new account or **Login** with existing credentials.
3. Browse available jobs, **Search** by keyword, or **Post** a new job listing.
4. Click on the **Chatbot** icon (in the navigation) to launch the AI assistant.

## Output Examples

### 1. Job Search Results

When searching for "Developer":

```html
<div class="job">
  <h3>Frontend Developer</h3>
  <p>Looking for a skilled React developer to build user interfaces.</p>
</div>
```

### 2. AI Chatbot Response (JSON)

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you with your job search today?"
      }
    }
  ]
}
```

## Troubleshooting

* **Database Connection Errors**: Verify credentials in `db.php` and ensure MySQL is running.
* **API Errors**: Check that `OPENAI_API_KEY` is valid and that your server can make HTTPS requests.
* **JavaScript Console Issues**: Open browser dev tools (F12) to view errors in `index.js`, `page.js`, or `script.js`.
