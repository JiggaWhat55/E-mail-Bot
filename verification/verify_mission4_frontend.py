import time
from playwright.sync_api import sync_playwright

def verify_frontend_mission4():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5175")
        page.set_viewport_size({"width": 1280, "height": 720})

        # Helper to enter command
        def command(cmd):
            page.fill("input[type='text']", cmd)
            page.press("input[type='text']", "Enter")
            page.wait_for_timeout(200)

        # Helper to get last log
        def get_last_log():
            logs = page.locator(".font-mono p").all_inner_texts()
            return logs[-1] if logs else ""

        print("Creating Character...")
        page.click("button:has-text('Human')")
        page.click("button:has-text('PROCEED')")
        page.wait_for_timeout(200)
        page.click("button:has-text('Command')")
        page.click("button:has-text('PROCEED')")
        page.wait_for_timeout(200)

        # Boost Presence (6th attribute) for Diplomacy
        plus_buttons = page.locator("button:has-text('+')").all()
        if len(plus_buttons) >= 6:
            for i in range(5):
                plus_buttons[5].click()
                page.wait_for_timeout(100)

        page.click("button:has-text('PROCEED')")
        page.wait_for_timeout(200)
        page.fill("input[type='text']", "Riker")
        page.click("button:has-text('ENGAGE')")
        page.wait_for_timeout(1000)

        print("Running Tutorial...")
        command("MOVE TURBOLIFT")
        command("MOVE ENGINEERING")

        # Scan loop
        for i in range(5):
             command("SCAN")
             page.wait_for_timeout(300)
             last_log = get_last_log()
             if "SCAN COMPLETE" in last_log.upper() or "SENSORS REPORT" in last_log.upper():
                  break

        command("MOVE TURBOLIFT")
        command("MOVE SICKBAY")
        command("MOVE TURBOLIFT")
        command("MOVE BRIDGE")
        page.wait_for_timeout(500)

        print("Mission 1 Complete. Starting Mission 2...")
        command("TALK WORF")
        page.wait_for_timeout(500)
        if page.locator("button:has-text('1.')").is_visible():
             page.click("button:has-text('1.')")
             page.wait_for_timeout(500)
        if page.locator("button:has-text('(End Conversation)')").is_visible():
             page.click("button:has-text('(End Conversation)')")

        command("WARP NEUTRAL ZONE")
        page.wait_for_timeout(1500)

        # Scan Derelict
        for i in range(5):
             command("SCAN")
             page.wait_for_timeout(300)
             last_log = get_last_log()
             if "SCAN COMPLETE" in last_log.upper() or "SENSORS REPORT" in last_log.upper():
                  break
        page.wait_for_timeout(1500)

        print("Combat Started...")
        command("POWER WEAPONS 80")
        page.wait_for_timeout(500)

        weapon = "FIRE TORPEDOES"
        for i in range(30):
            if page.locator("text=RED ALERT").is_visible():
                command(weapon)
                page.wait_for_timeout(1500)

                last_logs = page.locator(".font-mono p").all_inner_texts()[-3:]
                if any("OUT OF TORPEDOES" in l.upper() for l in last_logs):
                    weapon = "FIRE PHASERS"
            else:
                break

        print("Mission 2 Complete. Checking Mission 3...")
        # Check mission 3 start
        for i in range(10):
             logs = page.locator(".font-mono p").all_inner_texts()
             if any("THE PARALLAX ACCORD" in log.upper() for log in logs[-20:]):
                  break
             page.wait_for_timeout(500)

        command("WARP BRIDGE")
        page.wait_for_timeout(1500)
        command("MOVE OBSERVATION LOUNGE")
        page.wait_for_timeout(500)

        # Talk to Macet
        print("Negotiating with Gul Macet...")
        command("TALK MACET")
        page.wait_for_timeout(500)

        if page.locator("button:has-text('1.')").is_visible():
             page.click("button:has-text('1.')")
             page.wait_for_timeout(1000)
             if page.locator("button:has-text('1.')").is_visible():
                 page.click("button:has-text('1.')")
                 page.wait_for_timeout(500)
                 if page.locator("button:has-text('1.')").is_visible():
                     page.click("button:has-text('1.')")

             if page.locator("button:has-text('(End Conversation)')").is_visible():
                 page.click("button:has-text('(End Conversation)')")

        command("MOVE BRIDGE")
        page.wait_for_timeout(500)
        command("TALK PICARD")
        page.wait_for_timeout(500)
        if page.locator("button:has-text('1.')").is_visible():
             page.click("button:has-text('1.')")
             page.wait_for_timeout(500)
        if page.locator("button:has-text('(End Conversation)')").is_visible():
             page.click("button:has-text('(End Conversation)')")
        page.wait_for_timeout(500)

        # Mission 4 Check
        print("Mission 4 Started. Upgrading Ship...")
        command("MOVE TURBOLIFT")
        command("MOVE ENGINEERING")
        page.wait_for_timeout(500)
        command("UPGRADE PHASERS")
        page.wait_for_timeout(500)

        # Screenshot of Engineering Upgrade
        page.screenshot(path="verification/mission4_engineering.png")
        print("Screenshot 1 taken.")

        # Intercept Borg
        print("Warping to Wolf 359...")
        command("WARP BRIDGE")
        page.wait_for_timeout(500)
        command("WARP WOLF 359")
        page.wait_for_timeout(2000)

        # Combat with Borg
        print("Fighting Borg...")
        command("POWER WEAPONS 80")

        # Screenshot of Borg Combat
        if page.locator("text=RED ALERT").is_visible():
             page.screenshot(path="verification/mission4_borg.png")
             print("Screenshot 2 taken.")

        browser.close()

if __name__ == "__main__":
    verify_frontend_mission4()
