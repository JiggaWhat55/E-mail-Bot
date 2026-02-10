from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    try:
        # 1. Start App
        print("Navigating to app...")
        page.goto("http://localhost:5173")
        page.wait_for_selector("text=PERSONNEL FILE INITIALIZATION", timeout=10000)

        # 2. Character Creation (Quick)
        page.locator("button:has-text('Human')").click()
        page.locator("button:has-text('PROCEED')").click()
        page.locator("button:has-text('Command')").click()
        page.locator("button:has-text('PROCEED')").click()
        plus_buttons = page.locator("button:has-text('+')")
        for i in range(5):
            plus_buttons.first.click()
            time.sleep(0.1)
        page.locator("button:has-text('PROCEED')").click()
        page.fill("input", "Riker")
        page.locator("button:has-text('ENGAGE')").click()

        page.wait_for_selector("text=Welcome aboard", timeout=5000)
        print("Character created.")

        # 3. Test Navigation
        print("Testing Navigation...")
        page.locator("button:has-text('Look Around')").click()
        page.wait_for_selector("text=Main Bridge", timeout=5000)

        # Move to Turbolift (Since we are on bridge, Turbolift should be an option)
        # Check if button exists
        if page.locator("button:has-text('Turbolift')").count() > 0:
             page.locator("button:has-text('Turbolift')").click()
             page.wait_for_selector("text=Turbolift", timeout=5000)
             page.screenshot(path="verification/nav_turbolift.png")
             print("Moved to Turbolift.")
        else:
             print("Error: Turbolift button not found")
             page.screenshot(path="verification/error_nobutton.png")

        # Move back to Bridge
        if page.locator("button:has-text('Main Bridge')").count() > 0:
             page.locator("button:has-text('Main Bridge')").click()
        else:
             print("Error: Bridge button not found")

        # 4. Test Mission
        print("Testing Mission...")
        page.locator("button:has-text('Mission')").click()
        page.wait_for_selector("text=CURRENT MISSION:", timeout=5000)
        page.screenshot(path="verification/mission_log.png")

        # 5. Test Combat
        print("Testing Combat...")
        page.locator("button:has-text('Simulate Combat')").click()
        page.wait_for_selector("text=RED ALERT", timeout=5000)
        page.screenshot(path="verification/combat_start.png")

        # Fire Phasers
        page.locator("button:has-text('FIRE PHASERS')").click()
        time.sleep(1) # Wait for animation/log update
        page.screenshot(path="verification/combat_action.png")

        print("Verification successful!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="verification/error_v2.png")
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        run(p)
