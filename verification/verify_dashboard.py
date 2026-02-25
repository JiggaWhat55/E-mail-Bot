from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Go to Dashboard
    page.goto("http://localhost:5173")
    page.wait_for_selector('h1:has-text("SkyTycoon")')
    page.screenshot(path="verification/dashboard.png")

    # Go to Fleet
    page.click('button:has-text("Fleet")')
    page.wait_for_selector('h2:has-text("Fleet")')
    page.screenshot(path="verification/fleet.png")

    # Go to Routes
    page.click('button:has-text("Routes")')
    page.wait_for_selector('h2:has-text("Routes")')
    page.screenshot(path="verification/routes.png")

    # Go to Airports
    page.click('button:has-text("Airports")')
    page.wait_for_selector('h2:has-text("Airports")')
    page.screenshot(path="verification/airports.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
