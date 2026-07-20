from app.graph.workflow import graph
from app.graph.memory.redis_memory import RedisMemory


memory = RedisMemory()

# Pour repartir d'une mémoire vide à chaque test
memory.clear_all()


def separator():
    print("\n" + "=" * 80 + "\n")


# --------------------------------------------------
# TEST 1
# CREATE APPLICATION
# --------------------------------------------------

create_mail = """
Subject: Application Received

Hello Mohamed,

Thank you for applying.

Your application for the position:

AI Platform Engineer

has been successfully received.

Company:
QuantumLeaf AI

We will review your profile soon.

Recruiting Team
"""

print("TEST 1 -> CREATE APPLICATION")

result = graph.invoke({
    "email": create_mail,
    "extraction": None,
    "company": None,
    "application": None,
    "result": None,
    "error": None
})

print(result)

separator()

# --------------------------------------------------
# TEST 2
# SAME EMAIL
# SHOULD BE BLOCKED
# --------------------------------------------------

print("TEST 2 -> DUPLICATE EMAIL")

result = graph.invoke({
    "email": create_mail,
    "extraction": None,
    "company": None,
    "application": None,
    "result": None,
    "error": None
})

print(result)

separator()

# --------------------------------------------------
# TEST 3
# UPDATE STATUS
# --------------------------------------------------

update_mail = """
Subject: Interview Invitation

Hello Mohamed,

We reviewed your application.

We would like to invite you to the technical interview.

Company:
QuantumLeaf AI

Position:
AI Platform Engineer

Regards
"""

print("TEST 3 -> UPDATE STATUS")

result = graph.invoke({
    "email": update_mail,
    "extraction": None,
    "company": None,
    "application": None,
    "result": None,
    "error": None
})

print(result)

separator()

print("END TEST")