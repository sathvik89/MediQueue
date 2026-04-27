from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfbase.pdfmetrics import stringWidth


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "reports" / "MediQueue_Project_Report.pdf"


def make_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=36,
            textColor=colors.HexColor("#143d59"),
            alignment=TA_CENTER,
            spaceAfter=18,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverSub",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=13,
            leading=18,
            textColor=colors.HexColor("#3d4f5c"),
            alignment=TA_CENTER,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=17,
            leading=22,
            textColor=colors.HexColor("#143d59"),
            spaceBefore=14,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubTitle",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            textColor=colors.HexColor("#1f5f7a"),
            spaceBefore=10,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=13.2,
            textColor=colors.HexColor("#20262e"),
            alignment=TA_LEFT,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Small",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=11.2,
            textColor=colors.HexColor("#20262e"),
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Caption",
            parent=styles["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=8.4,
            leading=11,
            textColor=colors.HexColor("#5c6670"),
            alignment=TA_CENTER,
            spaceBefore=5,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableHead",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.4,
            leading=10.5,
            textColor=colors.white,
            alignment=TA_LEFT,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableCell",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.7,
            leading=10.2,
            textColor=colors.HexColor("#20262e"),
            alignment=TA_LEFT,
        )
    )
    return styles


styles = make_styles()


def p(text, style="Body"):
    return Paragraph(text, styles[style])


def bullets(items):
    return ListFlowable(
        [ListItem(p(item, "Body"), leftIndent=12) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=18,
        bulletFontSize=7,
    )


def table(rows, widths=None, font_size=7.7):
    body_style = ParagraphStyle(
        name=f"Cell{font_size}",
        parent=styles["TableCell"],
        fontSize=font_size,
        leading=font_size + 2.3,
    )
    data = []
    for r, row in enumerate(rows):
        style = styles["TableHead"] if r == 0 else body_style
        data.append([Paragraph(str(cell), style) for cell in row])
    tbl = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f5f7a")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#c9d4dc")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f4f8fb")]),
            ]
        )
    )
    return tbl


def diagram(path, caption, max_w=7.2 * inch, max_h=8.5 * inch):
    img = Image(str(ROOT / path))
    scale = min(max_w / img.imageWidth, max_h / img.imageHeight)
    img.drawWidth = img.imageWidth * scale
    img.drawHeight = img.imageHeight * scale
    return KeepTogether([img, p(caption, "Caption")])


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6d7780"))
    page = canvas.getPageNumber()
    canvas.drawString(doc.leftMargin, 0.42 * inch, "MediQueue Project Report")
    canvas.drawRightString(A4[0] - doc.rightMargin, 0.42 * inch, f"Page {page}")
    canvas.restoreState()


def add_cover(story):
    story += [
        Spacer(1, 1.25 * inch),
        p("MediQueue", "CoverTitle"),
        p("Project Report", "CoverSub"),
        p("Hospital Queue and Appointment Management System", "CoverSub"),
        Spacer(1, 0.35 * inch),
        table(
            [
                ["Item", "Details"],
                ["Frontend", "https://medi-queue-indol.vercel.app/"],
                ["Backend API", "https://mediqueue-8ofq.onrender.com"],
                ["Stack", "React, TypeScript, Vite, Node.js, Express, MongoDB, Mongoose"],
                ["Testing Status", "15 automated backend tests passing"],
            ],
            widths=[1.6 * inch, 4.8 * inch],
            font_size=8.3,
        ),
        Spacer(1, 0.45 * inch),
        p(
            "This report documents the problem statement, solution approach, system design choices, object-oriented design, design patterns, SOLID principles, UML artifacts, database design, and verified test results for MediQueue.",
            "Body",
        ),
        PageBreak(),
    ]


def add_sections(story):
    story += [
        p("1. Problem Statement", "SectionTitle"),
        p(
            "Hospitals often depend on manual appointment registers, walk-in queues, verbal status updates, and disconnected patient records. This causes long waiting times, unclear queue positions, scheduling conflicts, limited visibility for doctors, and operational overhead for administrators.",
            "Body",
        ),
        p(
            "The problem addressed by MediQueue is to digitize and coordinate appointment booking, queue management, doctor consultation flow, and role-based hospital operations in a maintainable full-stack system.",
            "Body",
        ),
        p("2. Solution Approach", "SectionTitle"),
        bullets(
            [
                "Provide a React frontend with separate patient, doctor, and admin experiences.",
                "Use an Express and TypeScript backend to expose role-specific API routes.",
                "Use JWT authentication and role authorization to protect patient and doctor workflows.",
                "Persist hospital data in MongoDB through Mongoose models for users, appointments, queues, notifications, medical records, and settings.",
                "Represent core business rules with entities, interfaces, and design patterns so appointment creation, queue ordering, and notifications remain extensible.",
            ]
        ),
        p("3. Technology Stack", "SectionTitle"),
        table(
            [
                ["Layer", "Technologies"],
                ["Frontend", "React 19, TypeScript, Vite, React Router, Axios, Framer Motion, Lucide React, React Hot Toast"],
                ["Backend", "Node.js, Express 5, TypeScript, tsx, nodemon"],
                ["Database", "MongoDB and Mongoose"],
                ["Authentication", "JWT and bcrypt"],
                ["Development and Testing", "npm, ESLint, TypeScript compiler, Node test runner, tsx"],
                ["Deployment", "Vercel frontend and Render backend"],
            ],
            widths=[1.7 * inch, 5.2 * inch],
        ),
        p("4. System Design Optimization", "SectionTitle"),
        p(
            "MediQueue applies system design principles by separating presentation, API routing, domain logic, persistence, and reusable behavioral modules. This separation improves scalability because each layer can evolve independently. The frontend can be deployed and cached separately from the backend, while the backend can be scaled as an API service behind Render.",
            "Body",
        ),
        table(
            [
                ["Principle", "How It Improves the System"],
                ["Layered architecture", "React handles UI, Express handles API orchestration, controllers handle use cases, models handle persistence, and patterns handle reusable domain behavior."],
                ["Role-based routing", "Patient and doctor routes are protected by middleware, reducing accidental access and keeping authorization logic centralized."],
                ["Stateless API authentication", "JWT-based requests avoid server-side session storage, making backend scaling easier."],
                ["Queue-specific data model", "Daily queue documents group queue entries per doctor, making queue lookup and updates more focused than scanning all appointments."],
                ["Indexes in models", "Appointment, queue, user, and medical record schemas define indexes for common lookup paths such as doctor/date, patient history, role/isActive, and queue entries."],
                ["Strategy-based queue ordering", "Queue ordering can switch between FIFO, priority, and round-robin without rewriting queue manager logic."],
                ["Frontend API service layer", "Axios services centralize HTTP calls and token injection, improving maintainability and reducing duplicated request code."],
            ],
            widths=[1.75 * inch, 5.15 * inch],
        ),
        p("5. Architecture Explanation", "SectionTitle"),
        p(
            "The system follows a client-server architecture. The React frontend contains route-based pages and role dashboards. The Axios API layer sends requests to the Express backend. The backend validates users through authentication middleware, enforces role authorization, delegates business workflows to controllers, and stores persistent state through Mongoose models.",
            "Body",
        ),
        diagram("diagrams/architecture/system_architecture.png", "Figure 1. MediQueue system architecture."),
        p("6. OOP Concepts Used", "SectionTitle"),
        table(
            [
                ["OOP Concept", "Where It Appears", "Explanation"],
                ["Encapsulation", "Entities such as User, Patient, Doctor, Admin, and Appointment", "State and behavior are grouped inside classes. Appointment methods such as confirm, cancel, and reschedule update internal appointment status consistently."],
                ["Inheritance", "Patient, Doctor, and Admin extend User; appointment variants extend Appointment", "Shared attributes are inherited from base classes, while specialized classes represent role-specific or appointment-type-specific behavior."],
                ["Polymorphism", "Appointment factories and queue strategies", "Different appointment factory classes expose the same create method; different queue strategies expose the same sort method but implement different ordering rules."],
                ["Abstraction", "Interfaces in server/src/interfaces", "Interfaces define contracts for users, doctors, patients, appointments, queue observers, queue subjects, queue strategies, and notification channels."],
            ],
            widths=[1.2 * inch, 2.0 * inch, 3.7 * inch],
            font_size=7.3,
        ),
        p("7. Design Patterns Implemented", "SectionTitle"),
        table(
            [
                ["Pattern", "Implementation", "Why It Was Used"],
                ["Factory", "appointment_factory.ts", "Creates walk-in, scheduled, and emergency appointments without spreading type-checking logic across controllers or services."],
                ["Strategy", "queue_strategy.ts", "Allows queue ordering policies such as FIFO, priority, and round-robin to be changed independently from queue management logic."],
                ["Observer", "queue_manager.ts and queue_observer.ts", "Models notification of interested users when queue state changes."],
                ["Singleton", "queue_registry.ts", "Maintains one shared queue registry for doctor queues during application runtime."],
                ["Adapter", "notification_adapter.ts", "Normalizes email, SMS, and push notification providers behind one interface."],
                ["Composite", "notification_composite.ts", "Groups multiple notification channels so one notification event can fan out through several providers."],
            ],
            widths=[1.0 * inch, 2.0 * inch, 3.9 * inch],
            font_size=7.2,
        ),
        p("8. SOLID Principles", "SectionTitle"),
        table(
            [
                ["Principle", "Reflection in Codebase"],
                ["Single Responsibility", "Controllers handle request workflows, models handle persistence schemas, middleware handles authentication and authorization, entities model domain behavior, and pattern files handle reusable algorithms."],
                ["Open/Closed", "New appointment types can be added through a new factory; new queue ordering rules can be added by implementing the queue strategy interface without changing existing strategies."],
                ["Liskov Substitution", "WalkInAppointment, ScheduledAppointment, and EmergencyAppointment can be used wherever Appointment is expected because they preserve the base appointment behavior."],
                ["Interface Segregation", "Separate interfaces exist for user, patient, doctor, admin, appointment, queue strategy, queue observer, queue subject, and notification contracts."],
                ["Dependency Inversion", "Queue behavior and notification behavior depend on interfaces/contracts rather than hard-coded concrete implementations, making strategies and adapters replaceable."],
            ],
            widths=[1.45 * inch, 5.45 * inch],
        ),
        p("9. Major Workflow: Patient Appointment Booking", "SectionTitle"),
        bullets(
            [
                "Patient logs in and receives a JWT.",
                "Frontend stores the token and sends it with appointment booking requests.",
                "Authentication middleware verifies the token and role middleware confirms patient access.",
                "Patient controller creates an appointment with doctor, date, time, reason, type, and priority.",
                "If the appointment is for the current date, the controller creates or updates the doctor's queue and assigns a token number.",
                "MongoDB stores the appointment and queue entry, and the frontend displays updated appointment/queue information.",
            ]
        ),
        p("10. Database Design", "SectionTitle"),
        table(
            [
                ["Model", "Purpose"],
                ["UserModel", "Stores patients, doctors, and admins with role-specific fields such as specialization, availability, managed doctors, and active status."],
                ["AppointmentModel", "Stores appointment lifecycle, type, status, priority, time slot, cancellation, completion, and critical-case information."],
                ["QueueModel", "Stores per-doctor daily queue state, queue entries, token number, current token, and queue-entry status."],
                ["NotificationModel", "Stores user notification events and read/unread status."],
                ["MedicalRecordModel", "Stores consultation outcome, diagnosis, notes, prescription, follow-up plan, and critical markers."],
                ["SystemSettingModel", "Stores operational rules such as consultation duration, working hours, queue defaults, and appointment settings."],
            ],
            widths=[1.6 * inch, 5.3 * inch],
        ),
    ]


def add_test_section(story):
    story += [
        p("11. Test Cases and Results", "SectionTitle"),
        p(
            "The backend test suite uses Node's built-in test runner through tsx. The tests mock Mongoose model calls so controller, middleware, factory, and strategy behavior can be verified without starting Express or connecting to MongoDB.",
            "Body",
        ),
        table(
            [
                ["Metric", "Result"],
                ["Command", "cd server && npm test"],
                ["Total tests", "15"],
                ["Passed", "15"],
                ["Failed", "0"],
            ],
            widths=[1.7 * inch, 5.2 * inch],
        ),
        Spacer(1, 0.1 * inch),
        table(
            [
                ["Area", "Tested Behavior", "Result"],
                ["Appointment Factory", "Correct factory selection and default priorities for scheduled/emergency appointments.", "Pass"],
                ["Authentication", "Missing bearer tokens are rejected; valid JWTs attach authenticated users.", "Pass"],
                ["Authorization", "Allowed roles continue; incorrect roles receive 403 forbidden response.", "Pass"],
                ["Patient Controller", "Booking today's appointment, queue token assignment, cancellation, queue removal, and queue status calculation.", "Pass"],
                ["Doctor Controller", "Doctor queue formatting and consultation completion with appointment, queue, and medical record updates.", "Pass"],
                ["Queue Strategies", "FIFO, priority ordering, priority tie-breaking, and round-robin rotation.", "Pass"],
            ],
            widths=[1.4 * inch, 4.45 * inch, 1.05 * inch],
            font_size=7.1,
        ),
        p("12. Deployment and Runtime", "SectionTitle"),
        table(
            [
                ["Service", "URL"],
                ["Frontend", "https://medi-queue-indol.vercel.app/"],
                ["Backend API", "https://mediqueue-8ofq.onrender.com"],
                ["Local frontend", "http://localhost:5173"],
                ["Local backend", "http://localhost:5000"],
            ],
            widths=[1.5 * inch, 5.4 * inch],
        ),
        p("13. Conclusion", "SectionTitle"),
        p(
            "MediQueue demonstrates a structured full-stack solution for hospital appointment and queue management. The project applies layered system design, object-oriented modeling, multiple design patterns, SOLID principles, MongoDB persistence, JWT-secured APIs, and automated backend tests. The architecture is prepared for further extension through additional admin APIs, integration tests, real notification providers, and more complete analytics dashboards.",
            "Body",
        ),
    ]


def add_diagrams(story):
    story += [
        PageBreak(),
        p("Appendix A: UML and ER Diagrams", "SectionTitle"),
        p("The following diagrams are included from the project repository.", "Body"),
        diagram("diagrams/class/class_diagram_version2.png", "Figure 2. Class diagram showing the main entities and relationships.", max_w=7.1 * inch, max_h=5.5 * inch),
        PageBreak(),
        diagram("diagrams/usecase/usecase_version2.png", "Figure 3. Use case diagram for patient, doctor, and admin interactions.", max_w=6.8 * inch, max_h=8.3 * inch),
        PageBreak(),
        diagram("diagrams/sequence/sequence.png", "Figure 4. Sequence diagram for a major MediQueue workflow.", max_w=7.2 * inch, max_h=8.5 * inch),
        PageBreak(),
        diagram("diagrams/er_diagram/mediqueue_er_diagram.png", "Figure 5. ER diagram for the MediQueue database design.", max_w=7.0 * inch, max_h=8.2 * inch),
    ]


def build():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        rightMargin=0.62 * inch,
        leftMargin=0.62 * inch,
        topMargin=0.68 * inch,
        bottomMargin=0.68 * inch,
        title="MediQueue Project Report",
        author="MediQueue Team",
    )
    story = []
    add_cover(story)
    add_sections(story)
    add_test_section(story)
    add_diagrams(story)
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


if __name__ == "__main__":
    build()
    print(OUT)
