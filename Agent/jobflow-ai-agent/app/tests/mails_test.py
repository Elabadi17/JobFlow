TEST_EMAILS = [

    {
        "name": "CREATE - Google interview",
        "mail": """
Subject: Application

Hello Mohamed,

Thank you for applying to Google for the Backend Engineer position.

We have successfully received your application.

Google Recruiting Team
""",
        "expected_action": "CREATE_JOB_APPLICATION"
    },

    {
        "name": "UPDATE - Amazon interview",
        "mail": """
Subject: Interview Invitation

Hi Mohamed,

We reviewed your profile for the DevOps Engineer role.

We would like to invite you to a technical interview.

Company: Amazon

Best regards
""",
        "expected_action": "UPDATE_STATUS"
    },

    {
        "name": "REJECT - Microsoft",
        "mail": """
Subject: Application Update

Dear Mohamed,

After careful review, Microsoft will not move forward
with your Backend Developer application.

Thank you for your interest.

Microsoft Talent Acquisition
""",
        "expected_action": "UPDATE_STATUS"
    },

    {
        "name": "OFFER - Stripe",
        "mail": """
Subject: Offer Letter

Hello Mohamed,

We are excited to offer you the Software Engineer position
at Stripe.

Congratulations!

Stripe Recruiting Team
""",
        "expected_action": "UPDATE_STATUS"
    },

    {
        "name": "ACCEPTED - Datadog",
        "mail": """
Subject: Welcome!

Hi Mohamed,

Thank you for accepting our offer.

Welcome to Datadog as Platform Engineer.

We are excited to have you onboard.

Datadog HR Team
""",
        "expected_action": "UPDATE_STATUS"
    },

    {
        "name": "FRENCH EMAIL - Doctolib",
        "mail": """
Objet : Entretien technique

Bonjour Mohamed,

Suite à votre candidature chez Doctolib
pour le poste d'Ingénieur Backend,
nous souhaitons vous inviter à un entretien.

Cordialement,
Doctolib
""",
        "expected_action": "UPDATE_STATUS"
    },

    {
        "name": "AMBIGUOUS EMAIL - Uber",
        "mail": """
Subject: Next steps

Hi Mohamed,

We would like to continue the process
for the Data Engineer position.

Uber Team
""",
        "expected_action": "UPDATE_STATUS"
    }

]