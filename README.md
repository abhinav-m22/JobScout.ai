# JobScout.ai: Revolutionizing Job Hunting with AI and Bright Data

## Overview
In today’s fast-paced job market, staying ahead requires access to real-time, accurate, and comprehensive data. Traditional job boards often fall short, leaving job seekers frustrated with endless scrolling and filters. 

**Current Problem:** Imagine logging into 10 different websites daily, typing job roles repeatedly, applying countless filters, and still feeling overwhelmed by irrelevant results.

**Solution:** With JobScout.ai, job hunting is seamless. Simply log in, upload your resume, and let our platform do the rest. Receive personalized job recommendations, tailored insights, and daily updates on fresh opportunities—all in one place.

---

## Features

### 1. AI-Powered Job Recommendations
- Matches users to roles based on resumes, profiles, and preferences.
- Highlights skill gaps and provides learning resources.

### 2. Conversational Job Search
- Intuitive chatbot supports natural language queries, e.g., "Find remote Python developer jobs paying ₹80,000+."
- Generates tailored resumes, cover letters, and job comparisons.

### 3. Personalized Dashboard
- Tracks saved jobs and applications.

### 4. Interview Preparation
- AI-generated interview questions specific to roles.
- Offers feedback and suggested responses.

---

## Architecture

The system combines Bright Data’s Web Scraper API with cutting-edge AI to deliver a seamless user experience.

```mermaid
flowchart TD
    subgraph Frontend
        UI["User Interface"] --> Dash[Personalized Dashboard]
        UI --> Chatbot[Conversational Chatbot]
    end

    subgraph Backend
        AI[AI Job Matching Engine] --> Alerts[Alerts and Notifications]
        Chatbot --> AI
    end

    subgraph DataCollection
        BDA[Bright Data API] --> Jobs["Job Data (Titles, Descriptions, Skills, Salaries, etc.)"]
    end

    subgraph DataStorage
        S3["AWS S3 (Raw JSON Storage)"] --> DB["Database (Processed Job Data, Profiles, Recommendations)"]
    end

    subgraph BackgroundTasks
        Scheduler[Task Scheduler] --> Snapshot[Snapshot Creation and Polling]
        Snapshot --> BDA
    end

    subgraph AIProcessing
        AIModels[AI Models for Recommendations, Skill Gaps, and Interview Prep] --> AI
    end

    User -->|Login & Resume Upload| UI
    Jobs --> S3
    S3 --> DB
    DB --> AIModels
    DB --> AI
    DB --> Dash
    DB --> Chatbot
    Scheduler --> BDA
```

---

## Screenshots

### Platform
![Screenshot from 2024-12-25 12-42-25](https://github.com/user-attachments/assets/92930142-d02f-49b6-8511-bb7c6f4cb7bc)

### Dashboard
![Screenshot from 2024-12-29 17-40-43](https://github.com/user-attachments/assets/6c639964-5fb2-4812-acb6-f255c5a6959f)

### AI Assistant
![Screenshot from 2024-12-29 20-10-53](https://github.com/user-attachments/assets/7d437ac8-a0e8-40f6-a08b-0a57a136d4d4)

---

## Demo Video

https://github.com/user-attachments/assets/d6809e5e-e688-498a-a996-35fc0565ae4c

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Gen AI:** OpenAI
- **Data Collection:** Bright Data Web Scraper API
- **Cloud Storage:** AWS S3

---

## How I Used Bright Data

1. **Scraping Job Data:**
   - Scrapes listings from LinkedIn, Glassdoor, and Indeed.
   - Captures job titles, descriptions, skills, salaries, benefits, locations, and trends.
   - Updates data in real-time.

2. **Snapshot Creation:**
   - Periodic API requests fetch jobs based on AI-determined roles, locations, and filters.
   - Responses are stored as JSON in AWS S3 for efficient processing.

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m 'Add feature description'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any queries or feedback, please contact: [email@example.com](mailto:email@example.com)

---

**Transform your job search with JobScout.ai!**
