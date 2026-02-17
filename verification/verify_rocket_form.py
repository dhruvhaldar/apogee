from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")

            # Wait for the page to load
            expect(page.get_by_role("heading", name="Rocket Equation")).to_be_visible()

            # Check for helper text presence
            expect(page.locator("#rocket-m0-hint")).to_have_text("e.g., Falcon 9: ~549,000 kg, Saturn V: ~2,970,000 kg")
            expect(page.locator("#rocket-mf-hint")).to_have_text("Dry mass + payload (typically 10-20% of m0)")

            # Check for aria-describedby association
            m0_input = page.locator("#rocket-m0")
            expect(m0_input).to_have_attribute("aria-describedby", "rocket-m0-hint")
            mf_input = page.locator("#rocket-mf")
            expect(mf_input).to_have_attribute("aria-describedby", "rocket-mf-hint")

            # Fill inputs
            page.fill("#rocket-isp", "300")
            page.fill("#rocket-m0", "1000")
            page.fill("#rocket-mf", "100")

            # Submit by pressing Enter in the last input
            page.press("#rocket-mf", "Enter")

            # Verify result appears (ΔV should be calculated)
            # 300 * 9.81 * ln(1000/100) = 300 * 9.81 * 2.302 = ~6774 m/s
            expect(page.get_by_text("ΔV =")).to_be_visible()

            # Take screenshot
            page.screenshot(path="verification/verification.png")
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
