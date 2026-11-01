# Battery-WingMates 

**Battery-WingMates** is a lightweight Node.js background service built for shared living environments — colleges, PGs, hostels, or any dorm where a laptop gets left charging.

It watches your laptop's battery and automatically pings your roommates via **Pushbullet** the moment your laptop hits full charge **while still plugged in** — so someone can unplug it before overcharging degrades the battery.

## How It Works

1. **Startup** — loads environment variables from a `.env` file (`ACCESS_TOKEN`, `me`, `roommate`).
2. **Infinite monitor loop** — calls `si.battery()` from the [`systeminformation`](https://systeminformation.io) library to read:
   - `percent` — current charge percentage
   - `isCharging` — whether the laptop is plugged in
   - `hasBattery` — whether a battery exists
3. **Smart polling** — calculates how long to wait before the next check:
   - **Charging & below 95%** → check again in **1 minute**
   - **Not charging & battery ≤ 20%** → check again in **10 minutes** (low-battery reminder zone)
   - **Not charging & battery > 60% & ≤ 90%** → check again in **45 minutes** (user's safe range)
   - **Not charging & otherwise** → check again in **30 minutes** (default)
4. **Alert** — if the battery is `hasBattery && percent >= 95 && isCharging`, it sends a Pushbullet notification to every "wingmate" (you + your roommate).
5. **Cooldown** — after a successful alert, the next check is delayed by **1 hour** to avoid spam.

## Features

- **Hardware-aware monitoring** via system-level battery APIs.
- **Intelligent alerting** — only notifies when plugged in *and* above 95%.
- **Social integration** — Pushbullet pushes to multiple recipients.
- **Spam protection** — 1-hour cooldown after a successful notification.
- **Smart polling** — sleeps longer when the battery is healthy, shorter when action is needed.

## Tech Stack

- **Runtime:** Node.js 18+ (ES Modules)
- **Hardware API:** [systeminformation](https://systeminformation.io)
- **Notifications:** [Pushbullet API](https://docs.pushbullet.com)
- **Process Manager:** PM2 (optional, for running 24/7)

## Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Sivasindhuja/Battery-WingMates.git
   cd Battery-WingMates
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables** — create a `.env` file in the root:
   ```env
   ACCESS_TOKEN=your_pushbullet_token
   me=your_email@gmail.com
   roommate=roommate_email@gmail.com
   ```

4. **Run the service:**
   ```bash
   npm start
   ```
   Or with PM2 (recommended for background/daemon use):
   ```bash
   pm2 start app.js --name "battery-wingmates"
   pm2 save
   ```

## Important Configuration (2026 Modern Standby)

To ensure the script monitors your battery while the lid is closed, set your OS power setting **"When I close the lid"** to **"Do Nothing"** while plugged in — this keeps the CPU awake so the polling loop keeps running with the screen off.

## License

ISC
