from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    try:
        # 1. Start App
        print("Navigating to app...")
        # Check if server is up first? We assume it is running in background.
        page.goto("http://localhost:5173")

        # Wait for something to load
        page.wait_for_selector("text=PERSONNEL FILE INITIALIZATION", timeout=10000)

        # 2. Character Creation - Step 1: Species
        print("Selecting Species...")
        page.locator("button:has-text('Human')").click()
        page.screenshot(path="verification/step1_species.png")
        page.locator("button:has-text('PROCEED')").click()

        # 3. Step 2: Role
        print("Selecting Role...")
        page.wait_for_selector("text=SELECT ASSIGNMENT", timeout=5000)
        page.locator("button:has-text('Command')").click()
        page.screenshot(path="verification/step2_role.png")
        page.locator("button:has-text('PROCEED')").click()

        # 4. Step 3: Stats
        print("Allocating Stats...")
        page.wait_for_selector("text=ATTRIBUTE CALIBRATION", timeout=5000)

        # Find + buttons. They are just text "+" inside button.
        # Use simple text locator for + button
        plus_buttons = page.locator("button:has-text('+')")

        # Click the first one 5 times
        for i in range(5):
            plus_buttons.first.click()
            time.sleep(0.1)

        page.screenshot(path="verification/step3_stats.png")
        page.locator("button:has-text('PROCEED')").click()

        # 5. Step 4: Name
        print("Entering Name...")
        page.wait_for_selector("text=IDENTITY CONFIRMATION", timeout=5000)
        page.fill("input", "Jean-Luc")
        page.screenshot(path="verification/step4_name.png")
        page.locator("button:has-text('ENGAGE')").click()

        # 6. Main Game
        print("Checking Main Game...")
        # Wait for log
        try:
            page.wait_for_selector("text=System initialized", timeout=5000)
        except:
            print("Error: Main game didn't load or log missing")
            page.screenshot(path="verification/error_maingame.png")
            return

        # Type a command
        page.fill("input[type='text']", "STATUS")
        page.locator("button:has-text('ENGAGE')").click() # Main game engage button

        page.wait_for_timeout(1000) # Wait for response

        page.screenshot(path="verification/step5_maingame.png")
        print("Verification successful!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="verification/error_exception.png")
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        run(p)
