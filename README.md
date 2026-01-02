#  Battery-WingMates

**Battery-WingMates** is a lightweight Node.js background service designed for shared living environments (Colleges, PG Hostels). It monitors your laptop's battery hardware and automatically alerts your "wingmates" via Pushbullet when your device is fully charged, ensuring battery health and energy efficiency.

##  The Problem
In shared dorms or hostels, you might leave your laptop charging while away from your desk. Overcharging can degrade battery health over time. **Battery-WingMates** bridges this gap by turning your roommates into a "distributed support team" who get a notification the moment your laptop needs to be unplugged.

## Features
*   **Hardware-Aware Monitoring:** Polling system-level battery status every 60 seconds.
*   **Intelligent Alerting:** Only notifies when the device is `plugged in` and above `95%`.
*   **Social Integration:** Uses Pushbullet API to send instant push notifications to multiple recipients.
*   **Spam Protection:** Built-in 1-hour cooldown period after a successful notification.
*   **Daemonized Execution:** Configured to run 24/7 in the background using PM2.
*   **Secure:** Sensitive API tokens and emails are managed via environment variables (`.env`).

##  Tech Stack
*   **Runtime:** Node.js (ES Modules)
*   **Hardware API:** [systeminformation](systeminformation.io)
*   **Process Manager:** [PM2](pm2.keymetrics.io)
*   **Notifications:** [Pushbullet API](docs.pushbullet.com)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone github.com
   cd Battery-WingMates

 2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    ACCESS_TOKEN=your_pushbullet_token
    me=your_email@gmail.com
    roommate=roommate_email@gmail.com
    ```

4.  **Run the Service:**
    To keep the script running in the background:
    ```bash
    pm2 start app.js --name "battery-wingmates"
    pm2 save
    ```

## 📋 Important Configuration (2026 Modern Standby)
To ensure the script monitors your battery while the lid is closed, navigate to your **OS Power Settings** and set **"When I close the lid"** to **"Do Nothing"** while plugged in. This allows the CPU to remain active and the script to continue polling while the screen is off.