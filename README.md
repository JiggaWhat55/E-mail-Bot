# Star Trek: The Next Generation - Role Playing Game

Welcome to the **Star Trek: The Next Generation RPG**. This is a text-based adventure with a rich tactical interface designed to simulate the experience of being a Starfleet officer.

## getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Game:**
    ```bash
    npm run dev
    ```
3.  Open your browser to the URL shown (usually `http://localhost:5173`).

## How to Play

### Character Creation
- **Species:** Choose from Human, Vulcan, Klingon, or Betazoid. Each has unique attribute bonuses.
- **Role:** Select your career path (Command, Operations, Sciences). This determines your starting skills and equipment.
- **Attributes:** Distribute points into Strength, Agility, Intellect, Willpower, Perception, and Presence.
- **Skills:** Focus on specific areas like Diplomacy, Engineering, or Phasers.

### Interface (LCARS)
The game uses a simulated LCARS interface.
- **Main Display:** Shows the current location description, mission logs, and dialogue.
- **Command Line:** Type commands here to interact with the world.
- **Status Panel:** Displays your character stats (Health, Stress, XP) and ship status.
- **Control Buttons:** Context-sensitive buttons (e.g., "Fire Phasers", "Warp") appear for common actions, but typing commands offers more flexibility.

### Core Commands

**Navigation:**
- `MOVE [LOCATION]`: Move to a specific room (e.g., `MOVE BRIDGE`, `MOVE ENGINEERING`).
- `WARP [SYSTEM]`: Travel to a different star system (e.g., `WARP WOLF 359`).
- `LOOK`: Re-examine the current location.

**Interaction:**
- `TALK [NAME]`: Start a conversation with an NPC (e.g., `TALK PICARD`, `TALK WORF`).
- `SCAN`: Use your tricorder or ship sensors to analyze the area.
- `GET [ITEM]`: Pick up an item.
- `USE [ITEM]`: Use an item in your inventory.

**Ship Management:**
- `STATUS`: Display detailed ship status.
- `POWER [SYSTEM] [AMOUNT]`: Adjust power distribution (e.g., `POWER SHIELDS 100`, `POWER WEAPONS 50`).
- `UPGRADE [SYSTEM]`: (Engineering Only) Improve ship systems using XP (e.g., `UPGRADE PHASERS`).

**Combat:**
- `RED ALERT`: Raise shields and arm weapons.
- `FIRE PHASERS`: Attack with phasers (requires energy).
- `FIRE TORPEDOES`: Attack with photon torpedoes (requires ammo).
- `EVASIVE`: Perform evasive maneuvers to increase dodge chance.
- `REPAIR`: Attempt emergency repairs on the hull (requires Engineering skill).
- `SHIELDS UP` / `SHIELDS DOWN`: Toggle shields.

### Missions
Follow the mission log in the main display. Objectives will guide you through the story, from routine patrols to major conflicts like the Battle of Wolf 359.

**Tips:**
- **Save Often:** The game autosaves your progress.
- **Watch Your Energy:** Combat drains ship energy. Balance power between Shields, Weapons, and Engines.
- **Skill Checks:** Dialogue and actions often require specific skills (e.g., Diplomacy to negotiate, Science to scan anomalies).
