## Project Description

**Daily Mood Tracker** is a small educational web project created to practice **HTML**, **CSS**, and **JavaScript**.  
The application allows the user to:

- **Choose today’s mood** (😊 Happy, 😐 Neutral, 😢 Sad, 😡 Angry).
- **See the selected mood** in the **“Today’s Mood”** section.
- **Save the mood in a weekly history** (last 7 days).
- **View the mood history for the past 7 days**, where **the current day is visually highlighted**.
- **Clear the history** using the **Reset History** button.

The history is stored in `localStorage`, so the data remains even after the page is refreshed (unless the user presses Reset).

---

## Project Structure

- **`index.html`** — semantic page structure:
  - `header` — title and subtitle.
  - `main`:
    - mood selection section (mood buttons),
    - **“Today’s Mood”** section,
    - **“Weekly Mood History”** section with a reset button.
  - `footer` — note about the technologies used.

- **`styles.css`** — styling and responsive layout:
  - color variables and background,
  - mood color coding (Yellow / Gray / Blue / Red),
  - styles for buttons, cards, and the history grid,
  - hover effects and small animations,
  - responsive layout using Flexbox/Grid for different screen sizes.

- **`script.js`** — application logic:
  - handling clicks on mood buttons,
  - updating the **“Today’s Mood”** block,
  - generating and displaying the 7-day history,
  - highlighting the current day,
  - saving and reading data from `localStorage`,
  - clearing history with the Reset button.

---

## How to Run

1. Open the project folder **`IT midterm`** on your computer.
2. Double-click the file **`index.html`** to open it in a browser  
   (or run it through any simple HTTP server if you are practicing with dev servers).

The browser does not require building or installing packages — it is pure **HTML/CSS/JS**.

---

## Usage

### 1. Selecting a Mood
- Click one of the mood buttons (**Happy / Neutral / Sad / Angry**).
- The **“Today’s Mood”** section will display the corresponding emoji and label.
- The mood will also be saved in the history for the current day.

### 2. Viewing Weekly History
- The **“Weekly Mood History”** section displays **the last 7 days**.
- Each day shows:
  - the day of the week,
  - the date,
  - the mood emoji and label, or the text **“No entry”**.
- The current day is visually highlighted.

### 3. Resetting History
- Click the **Reset History** button.
- All saved moods are cleared (both from the interface and from `localStorage`).

---

## Technical Details (for learning)

### HTML
- Semantic tags are used: `header`, `main`, `section`, `footer`, `button`.
- Mood selection and history blocks are placed in separate sections.
- A `<meta name="description">` tag is added for page description.

### CSS
- CSS variables are used for colors, including different mood states:
  - Happy → yellow  
  - Neutral → gray  
  - Sad → blue  
  - Angry → red
- Grid and Flexbox are used to build button layouts and the history grid.
- Includes hover effects, subtle shadows, and smooth transitions.
- The layout adapts to **wide and narrow screens** using media queries.

### JavaScript
- Mood mapping with emojis and labels.
- Calculation of the last 7 days relative to the current date.
- Saving and reading data from `localStorage`.
- Re-rendering the **“Today’s Mood”** block and **“Weekly Mood History”** grid whenever changes occur.

---

## Possible Improvements (Optional)

- Add more mood states.
- Display a simple mood chart (for example, bars for each day).
- Allow editing moods for previous days.
- Add language selection for the interface (RU / EN).
