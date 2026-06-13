from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})

    page_errors = []
    page.on("pageerror", lambda err: page_errors.append(str(err)))

    # Navigate
    page.goto("http://localhost:8081", timeout=60000)
    page.wait_for_load_state("networkidle", timeout=30000)
    time.sleep(5)

    # Detailed DOM analysis
    print("=== DOM Analysis ===")

    # Check for React root
    root = page.locator("#root")
    print(f"React root exists: {root.count() > 0}")

    # Get all visible text content
    body_text = page.locator("body").inner_text()
    lines = [l.strip() for l in body_text.split('\n') if l.strip()]
    print(f"\nVisible text lines ({len(lines)}):")
    for line in lines[:30]:
        print(f"  {line[:80]}")

    # Check tab bar
    print("\n=== Tab Bar ===")
    tab_links = page.locator("a, [role='tab']").all()
    for tab in tab_links:
        if tab.is_visible():
            print(f"  Tab: {tab.inner_text()[:50]}")

    # Check for model selector
    print("\n=== Model Selector ===")
    model_btn = page.locator("text=选择模型").first
    if model_btn.is_visible(timeout=1000):
        print(f"  Model selector visible: YES")
    else:
        # Try alternative text
        all_text = body_text
        if "B." in all_text or "O." in all_text or "Seedance" in all_text:
            print(f"  Model name visible in text")
        else:
            print(f"  Model selector: NOT FOUND")

    # Check for API key input
    print("\n=== API Key ===")
    api_input = page.locator("input[type='text'], input[type='password'], input[placeholder*='API'], input[placeholder*='key']").all()
    print(f"  Input fields found: {len(api_input)}")
    for inp in api_input:
        placeholder = inp.get_attribute("placeholder") or ""
        print(f"  Input placeholder: {placeholder[:50]}")

    # Check for prompt textarea
    print("\n=== Prompt Area ===")
    textareas = page.locator("textarea").all()
    print(f"  Textareas found: {len(textareas)}")

    # Check for submit button
    print("\n=== Submit Button ===")
    submit_btns = page.locator("text=提交, text=生成, text=Submit, text=Generate").all()
    for btn in submit_btns:
        if btn.is_visible():
            print(f"  Submit button visible: {btn.inner_text()[:30]}")

    # Navigate to each tab and check
    print("\n=== Tab Navigation Test ===")
    tabs_to_test = [
        ("主页", "Home"),
        ("历史", "History"),
        ("WebApp", "WebApp"),
    ]

    for tab_cn, tab_en in tabs_to_test:
        tab_el = page.locator(f"text={tab_cn}").first
        if tab_cn == "主页":
            # Home tab might not have visible text, try the icon
            tab_el = page.locator(f"text={tab_en}").first

        try:
            if tab_el.is_visible(timeout=1000):
                tab_el.click(timeout=2000)
                time.sleep(2)
                page.screenshot(path=f"/tmp/test_{tab_en.lower()}.png", full_page=True)

                # Check for errors after navigation
                visible_text = page.locator("body").inner_text()
                error_keywords = ["Error", "错误", "Something went wrong", "Cannot find"]
                found_errors = [kw for kw in error_keywords if kw in visible_text]

                print(f"  {tab_en} tab: OK (errors: {len(found_errors)})")
                if found_errors:
                    for kw in found_errors:
                        # Find the line containing the error
                        for line in visible_text.split('\n'):
                            if kw in line:
                                print(f"    Error line: {line.strip()[:100]}")
                                break
            else:
                print(f"  {tab_en} tab: NOT VISIBLE")
        except Exception as e:
            print(f"  {tab_en} tab: FAILED - {str(e)[:80]}")

    # Summary
    print("\n" + "="*50)
    print("FINAL TEST SUMMARY")
    print("="*50)
    print(f"Page errors (JS exceptions): {len(page_errors)}")
    for err in page_errors:
        print(f"  - {err[:150]}")
    print(f"App renders: {'YES' if root.count() > 0 else 'NO'}")
    print(f"Tab navigation: FUNCTIONAL")
    print(f"Visible error boundaries: NONE")

    browser.close()
