from app.agents.mail_agent import MailAgent
from app.tests.mails_test import TEST_EMAILS

agent = MailAgent()

def run_tests():

    success = 0

    print("\n==============================")
    print("🚀 STARTING EMAIL AGENT TESTS")
    print("==============================\n")

    for test in TEST_EMAILS:

        print(f"\n📩 TEST: {test['name']}")
        print("-" * 40)

        result = agent.extract(test["mail"])

        print("INPUT MAIL:")
        print(test["mail"])

        print("\nOUTPUT:")
        print(result)

        if result.get("action") == test["expected_action"]:
            print("✅ PASS")
            success += 1
        else:
            print("❌ FAIL")
            print(f"Expected: {test['expected_action']}")

        print("\n")

    print("==============================")
    print(f"RESULT: {success}/{len(TEST_EMAILS)} passed")
    print("==============================")

if __name__ == "__main__":
    run_tests()