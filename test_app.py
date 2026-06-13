from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})

    console_logs = []
    page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    page_errors = []
    page.on("pageerror", lambda err: page_errors.append(str(err)))

    # 1. Navigate
    print("1. Loading app...")
    page.goto("http://localhost:8081", timeout=60000)
    page.wait_for_load_state("networkidle", timeout=30000)
    time.sleep(3)
    page.screenshot(path="/tmp/test_01_home.png", full_page=True)
    print("   Screenshot saved: /tmp/test_01_home.png")

    # 2. Check errors
    print(f"\n2. Console errors: {len([l for l in console_logs if '[error]' in l])}")
    print(f"   Page errors: {len(page_errors)}")
    if page_errors:
        for err in page_errors[:5]:
            print(f"   ERROR: {err[:200]}")

    # 3. Page title
    title = page.title()
    print(f"\n3. Page title: {title}")

    # 4. Discover UI elements
    print("\n4. UI Element Discovery:")
    inputs = page.locator("input, textarea").all()
    print(f"   Text inputs/textareas: {len(inputs)}")
    buttons = page.locator("button, [role='button']").all()
    print(f"   Buttons: {len(buttons)}")
    images = page.locator("img").all()
    print(f"   Images: {len(images)}")

    # 5. Content structure
    print("\n5. Content structure check:")
    model_elements = page.locator("text=模型").all()
    print(f"   Model-related text: {len(model_elements)}")
    api_key_elements = page.locator("text=API").all()
    print(f"   API-related text: {len(api_key_elements)}")
    prompt_area = page.locator("textarea").all()
    print(f"   Textarea elements: {len(prompt_area)}")

    # 6. Tab navigation
    print("\n6. Testing tab navigation...")
    for tab_name in ["历史", "History", "WebApp"]:
        tab_el = page.locator(f"text={tab_name}").first
        if tab_el.is_visible(timeout=2000):
            print(f"   Found tab: {tab_name}")
            try:
                tab_el.click(timeout=3000)
                time.sleep(2)
                page.screenshot(path=f"/tmp/test_tab_{tab_name}.png", full_page=True)
                print(f"   Screenshot saved: /tmp/test_tab_{tab_name}.png")
            except Exception as e:
                print(f"   Click failed: {str(e)[:100]}")

    # 7. Error boundary check
    print("\n7. Error boundary check:")
    error_elements = page.locator("text=Error, text=错误, text=Something went wrong").all()
    visible_errors = [e for e in error_elements if e.is_visible()] if error_elements else []
    if visible_errors:
        for el in visible_errors:
            print(f"   VISIBLE ERROR: {el.text_content()[:200]}")
    else:
        print("   No visible error messages")

    # 8. Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    print(f"Page loaded: {'YES' if title else 'NO'}")
    print(f"Page errors: {len(page_errors)}")
    print(f"Console errors: {len([l for l in console_logs if '[error]' in l])}")
    print(f"Visible errors: {len(visible_errors)}")
    print(f"UI elements: {len(inputs)} inputs, {len(buttons)} buttons, {len(images)} images")

    if console_logs:
        print("\nFirst 10 console logs:")
        for log in console_logs[:10]:
            print(f"  {log[:150]}")

    browser.close()
