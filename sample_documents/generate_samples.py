import os
from docx import Document
from fpdf import FPDF

# Ensure output directory exists
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def create_docx(filename, title, content):
    doc = Document()
    doc.add_heading(title, 0)
    for section_title, paragraphs in content.items():
        doc.add_heading(section_title, level=1)
        for p in paragraphs:
            doc.add_paragraph(p)
    doc.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Created {filename}")

def create_pdf(filename, title, content):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(0, 10, title, ln=True, align='C')
    pdf.ln(10)
    
    for section_title, paragraphs in content.items():
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(0, 10, section_title, ln=True)
        pdf.set_font("Arial", '', 11)
        for p in paragraphs:
            pdf.multi_cell(0, 8, p)
            pdf.ln(2)
        pdf.ln(5)
    
    pdf.output(os.path.join(OUTPUT_DIR, filename))
    print(f"Created {filename}")

def generate_handbook():
    content = {
        "1. Welcome to the Company": [
            "Welcome to our organization! We are thrilled to have you join our team. This handbook is designed to provide you with a comprehensive overview of our company policies, procedures, and expectations.",
            "Our mission is to innovate and deliver outstanding value to our customers while fostering a supportive and inclusive environment for all employees."
        ],
        "2. Core Work Hours and Attendance": [
            "Our standard core working hours are from 10:00 AM to 3:00 PM in your local time zone. During these hours, employees are expected to be available for meetings and collaborative work.",
            "Outside of core hours, we offer flexible scheduling to accommodate personal needs and promote work-life balance. Please coordinate your exact schedule with your manager."
        ],
        "3. Leave Policies": [
            "We offer a generous Paid Time Off (PTO) policy. Employees accrue 20 days of PTO per year. In addition, we observe 10 paid public holidays.",
            "Sick leave is provided separately. Employees are entitled to up to 10 days of paid sick leave per year. For extended medical absences, please refer to the short-term disability policy."
        ],
        "4. Code of Conduct": [
            "We expect all employees to conduct themselves with professionalism, integrity, and respect for others. Discrimination, harassment, and retaliation will not be tolerated.",
            "If you witness or experience any behavior that violates this code, please report it immediately to HR or through our anonymous ethics hotline."
        ]
    }
    create_pdf("company_handbook.pdf", "Company Employee Handbook", content)

def generate_engineering_standards():
    content = {
        "1. Introduction": [
            "This document outlines the coding standards, code review processes, and Git workflows for the engineering team. Adhering to these standards ensures code quality, maintainability, and consistency across all projects."
        ],
        "2. Coding Standards": [
            "Python: We follow PEP 8 standards. Use Black for automated formatting and Flake8 for linting. Type hints must be used for all function signatures.",
            "JavaScript/TypeScript: We use ESLint with the Airbnb configuration. Prettier should be configured in your editor for auto-formatting. TypeScript is required for all new front-end features."
        ],
        "3. Code Review Process": [
            "All code must go through a peer review process before being merged into the main branch. A pull request (PR) requires at least one approval from a senior engineer or code owner.",
            "Reviewers should check for logical errors, adherence to standards, proper test coverage, and clear documentation. Be constructive and respectful in your feedback."
        ],
        "4. Git Workflow": [
            "We utilize a feature-branch workflow. Branch names should follow the pattern: feature/TICKET-ID-short-description or bugfix/TICKET-ID-short-description.",
            "Commit messages must be descriptive and follow conventional commits format (e.g., feat:, fix:, docs:). Squash commits before merging to keep the history clean."
        ]
    }
    create_pdf("engineering_standards.pdf", "Engineering Standards & Workflows", content)

def generate_security_policy():
    content = {
        "1. Information Security Overview": [
            "This policy establishes the framework for protecting the organization's information assets. It applies to all employees, contractors, and third-party vendors who have access to our systems."
        ],
        "2. Data Classification": [
            "All data must be classified into one of four categories: Public, Internal, Confidential, or Restricted.",
            "Restricted data includes PII, financial records, and intellectual property. It requires the highest level of encryption and strict access controls."
        ],
        "3. Access Control": [
            "Access to company resources is granted based on the principle of least privilege (PoLP). Multi-Factor Authentication (MFA) is mandatory for all system access.",
            "Access rights must be reviewed quarterly. Upon termination or role change, access must be revoked or modified within 24 hours."
        ],
        "4. Password Policy": [
            "Passwords must be at least 14 characters long, containing a mix of upper and lower case letters, numbers, and special characters. Passwords must be rotated every 90 days."
        ]
    }
    create_docx("security_policy.docx", "Information Security Policy", content)

def generate_api_docs():
    content = {
        "1. Overview": [
            "This document provides reference for the RESTful API endpoints available in the core platform. The API uses JSON for requests and responses."
        ],
        "2. Authentication": [
            "All API requests require a Bearer token in the Authorization header: 'Authorization: Bearer <your_token>'. Tokens expire after 1 hour."
        ],
        "3. Users Endpoint": [
            "GET /api/v1/users - Retrieves a list of users. Supports pagination via ?page and ?limit parameters.",
            "POST /api/v1/users - Creates a new user profile. Requires 'email', 'first_name', and 'last_name' in the JSON body."
        ],
        "4. Error Handling": [
            "The API returns standard HTTP status codes. 400 for bad requests, 401 for unauthorized, 403 for forbidden, and 500 for internal server errors. Error responses include a 'message' field with details."
        ]
    }
    create_pdf("api_documentation.pdf", "REST API Reference Guide", content)

def generate_onboarding_guide():
    content = {
        "1. First Day Checklist": [
            "1. Collect your laptop and ID badge from IT and Security.",
            "2. Log in to your email and set up your initial passwords.",
            "3. Complete the mandatory HR paperwork in the portal.",
            "4. Meet with your manager for an introductory 1:1."
        ],
        "2. First Week Goals": [
            "1. Complete the IT security and compliance training modules.",
            "2. Set up your local development environment (if applicable).",
            "3. Introduce yourself on the #general Slack channel.",
            "4. Review the company handbook and relevant department wikis."
        ],
        "3. Tools Setup": [
            "Ensure you have access to Slack, Jira, Confluence, and GitHub. If you are missing permissions to any specific repositories or boards, please open an IT helpdesk ticket."
        ]
    }
    create_docx("onboarding_guide.docx", "New Employee Onboarding Guide", content)

def generate_product_roadmap():
    content = {
        "1. Vision for H2 2024": [
            "Our focus for the second half of 2024 is expanding our enterprise offerings and improving user retention through enhanced analytics and integrations."
        ],
        "2. Q3 Milestones": [
            "July: Launch the new reporting dashboard with customizable widgets.",
            "August: Beta release of the Salesforce integration.",
            "September: Roll out SSO support for all enterprise tier customers."
        ],
        "3. Q4 Milestones": [
            "October: General availability of the Salesforce integration.",
            "November: Introduce AI-driven insights for user activity data.",
            "December: Performance overhaul of the core rendering engine to reduce load times by 30%."
        ]
    }
    create_pdf("product_roadmap.pdf", "Product Roadmap Q3-Q4 2024", content)

def generate_financial_report():
    content = {
        "1. Executive Summary": [
            "Q2 2024 was a strong quarter with revenue exceeding expectations by 15%. However, operating expenses also increased due to aggressive hiring in the engineering department."
        ],
        "2. Revenue Summary": [
            "Total revenue for Q2 was $14.2 million. Subscription revenue accounted for $12 million, while professional services contributed $2.2 million.",
            "Year-over-year growth stands at 24%, driven primarily by expansion in the European market."
        ],
        "3. Expenses and P&L": [
            "Operating expenses totaled $9.8 million. Sales and Marketing was the largest expense category at $4.1 million, followed by R&D at $3.5 million.",
            "Net profit for the quarter was $2.8 million. We are maintaining a healthy cash reserve of $18 million."
        ]
    }
    create_pdf("financial_report_q2.pdf", "Q2 2024 Financial Report", content)

def generate_meeting_minutes():
    content = {
        "1. Meeting Details": [
            "Date: July 15, 2024",
            "Attendees: Jane Doe (CEO), John Smith (CFO), Alice Johnson (CTO), Bob Brown (Board Member).",
            "Absent: None"
        ],
        "2. Key Decisions": [
            "Approved the budget increase of $500k for the Q4 marketing campaign.",
            "Decided to delay the opening of the APAC office until Q1 2025 due to regulatory complexities.",
            "Approved the promotion of Sarah Lee to VP of Engineering."
        ],
        "3. Action Items": [
            "John Smith to finalize the Q3 revised budget by next Friday.",
            "Alice Johnson to present a vendor evaluation for the new cloud infrastructure by end of month.",
            "Jane Doe to draft the company-wide announcement regarding the structural changes."
        ]
    }
    create_docx("meeting_minutes.docx", "Board Meeting Minutes - July 2024", content)

def generate_technical_architecture():
    content = {
        "1. System Overview": [
            "The platform is built on a microservices architecture hosted on AWS. It uses an API Gateway to route traffic to specific domain services."
        ],
        "2. Core Services": [
            "User Service: Manages authentication and profiles. Built with Go and backed by PostgreSQL.",
            "Data Processing Service: Handles asynchronous jobs. Built with Python and uses Celery/RabbitMQ.",
            "Reporting Service: Aggregates data for analytics. Built with Node.js and backed by MongoDB."
        ],
        "3. Infrastructure Setup": [
            "We use Terraform for Infrastructure as Code (IaC). Services are deployed in Docker containers managed by Kubernetes (EKS).",
            "CI/CD is handled by GitHub Actions, with automated testing required before deployment to staging."
        ]
    }
    create_pdf("technical_architecture.pdf", "System Architecture & Tech Stack", content)

def generate_user_research():
    content = {
        "1. Methodology": [
            "We conducted 25 user interviews over the month of June. Participants were selected from our active enterprise user base. Sessions lasted 45 minutes each."
        ],
        "2. Key Findings": [
            "Finding 1: Users find the current data export process cumbersome. 80% of participants requested an easier way to schedule automated reports.",
            "Finding 2: The navigation menu is overwhelming. Many users struggle to find the advanced settings panel.",
            "Finding 3: Positive feedback on the new dark mode feature. Users reported less eye strain during long sessions."
        ],
        "3. Recommendations": [
            "Prioritize the development of automated report scheduling for Q4.",
            "Initiate a UX redesign of the primary navigation sidebar to group related items more logically.",
            "Continue refining the dark mode palette based on minor contrast issues reported."
        ]
    }
    create_docx("user_research_findings.docx", "UX Research Findings - June 2024", content)

def generate_marketing_strategy():
    content = {
        "1. Q3 Campaign Goals": [
            "Our primary goal for Q3 is to increase enterprise lead generation by 30%. Secondary goal is to improve brand awareness in the healthcare sector."
        ],
        "2. Target Channels": [
            "LinkedIn Ads: Allocating 40% of the budget here to target C-level executives in tech and healthcare.",
            "Content Marketing: Publishing two whitepapers on data security and hosting a webinar with industry experts.",
            "SEO: Focusing on long-tail keywords related to enterprise compliance software."
        ],
        "3. Budget Allocation": [
            "Total Q3 Marketing Budget: $250,000.",
            "Paid Social: $100,000. Content Creation: $50,000. Events/Webinars: $50,000. Agency Fees: $50,000."
        ]
    }
    create_pdf("marketing_strategy.pdf", "Q3 Marketing Strategy", content)

def generate_incident_response():
    content = {
        "1. Incident Classification": [
            "Severity 1 (Critical): System-wide outage or active data breach. Requires immediate response 24/7.",
            "Severity 2 (High): Major feature degraded affecting multiple customers. Response within 1 hour.",
            "Severity 3 (Medium): Minor bug affecting a small subset of users. Response within next business day."
        ],
        "2. Response Procedures for Sev 1": [
            "1. The on-call engineer must acknowledge the alert within 15 minutes.",
            "2. Open a dedicated incident bridge (Zoom) and Slack channel (#incident-active).",
            "3. Notify the Incident Commander and VP of Engineering.",
            "4. Post initial status page update within 30 minutes."
        ],
        "3. Escalation Matrix": [
            "If the primary on-call does not respond, page the secondary. If neither responds, page the Engineering Manager, followed by the VP of Engineering, and finally the CTO."
        ]
    }
    create_docx("incident_response_plan.docx", "Incident Response & Escalation Plan", content)

def generate_data_governance():
    content = {
        "1. Scope and Purpose": [
            "This policy outlines the rules for managing data lifecycle, ensuring data quality, and maintaining compliance with GDPR and CCPA regulations."
        ],
        "2. Data Retention": [
            "Customer transaction data must be retained for 7 years for tax purposes. After 7 years, data must be securely archived or anonymized.",
            "Application logs containing IP addresses must be deleted or anonymized after 90 days."
        ],
        "3. GDPR Compliance": [
            "All customer data must have a clear legal basis for processing. We must comply with 'Right to be Forgotten' requests within 30 days of receipt.",
            "The Data Protection Officer (DPO) is responsible for overseeing compliance and handling complex data privacy requests."
        ]
    }
    create_pdf("data_governance_policy.pdf", "Data Governance & Retention Policy", content)

def generate_employee_benefits():
    content = {
        "1. Health Insurance": [
            "We offer comprehensive medical, dental, and vision coverage. The company covers 90% of the premium for employees and 75% for dependents.",
            "Open enrollment occurs in November every year. Please review the plan options on the benefits portal."
        ],
        "2. Retirement Plans": [
            "The company provides a 401(k) plan with employer matching. We match 100% of your contributions up to 4% of your salary.",
            "Employees are immediately fully vested in all company matching contributions."
        ],
        "3. Additional Perks": [
            "$100 monthly stipend for wellness or gym memberships.",
            "$500 annual budget for professional development, courses, or conferences.",
            "Free lunch provided in the office on Tuesdays and Thursdays."
        ]
    }
    create_docx("employee_benefits.docx", "Employee Benefits & Perks Overview", content)

def generate_release_notes():
    content = {
        "1. What's New in v2.0": [
            "We are excited to announce the release of platform v2.0! This major release includes a complete overhaul of the user interface and significant performance improvements.",
            "New Feature: Advanced Analytics Dashboard. Users can now build custom charts and export them directly to PDF."
        ],
        "2. Improvements": [
            "Optimized the database queries for the reports page, reducing load times by an average of 45%.",
            "Updated the API rate limits to accommodate higher tier customers.",
            "Enhanced accessibility across the application, achieving WCAG 2.1 AA compliance."
        ],
        "3. Bug Fixes": [
            "Resolved an issue where password reset emails were delayed in the queue.",
            "Fixed a UI glitch that caused dropdown menus to be cut off on smaller screens.",
            "Patched a minor security vulnerability in the file upload component."
        ]
    }
    create_pdf("release_notes_v2.pdf", "Release Notes - Version 2.0", content)

def generate_vendor_evaluation():
    content = {
        "1. Executive Summary": [
            "This document compares AWS, Google Cloud, and Azure to determine the best provider for our new machine learning infrastructure. The evaluation focused on cost, performance, and ease of integration."
        ],
        "2. Technical Comparison": [
            "AWS: Offers the most mature ecosystem (SageMaker). However, costs can be unpredictable.",
            "Google Cloud: Best-in-class TPU performance for ML workloads. BigQuery integration is a significant plus.",
            "Azure: Strong enterprise integration, especially with our existing Active Directory setup, but less flexible networking."
        ],
        "3. Final Recommendation": [
            "Based on the evaluation, we recommend migrating the ML workloads to Google Cloud Platform. The cost-to-performance ratio for training models and the seamless data warehouse integration aligns best with our Q4 goals."
        ]
    }
    create_docx("vendor_evaluation.docx", "Cloud Vendor Evaluation - ML Infrastructure", content)

def generate_training_materials():
    content = {
        "1. Intro to Agile": [
            "Agile is a framework for developing products iteratively. It emphasizes flexibility, continuous improvement, and team collaboration over rigid planning."
        ],
        "2. Scrum Framework": [
            "We operate in 2-week Sprints. Each Sprint begins with Sprint Planning to determine the scope of work.",
            "The team holds a 15-minute Daily Standup to discuss progress and blockers.",
            "At the end of the Sprint, we conduct a Sprint Review to demo work and a Retrospective to discuss process improvements."
        ],
        "3. Roles in Scrum": [
            "Product Owner: Manages the backlog and defines requirements.",
            "Scrum Master: Facilitates the process and removes blockers for the team.",
            "Development Team: Executes the work and delivers the increment."
        ]
    }
    create_pdf("training_materials.pdf", "Internal Training: Agile & Scrum Basics", content)

def generate_compliance_guidelines():
    content = {
        "1. Regulatory Overview": [
            "Our organization operates in highly regulated sectors. It is imperative that all systems comply with SOX for financial reporting and HIPAA for health data."
        ],
        "2. SOX Compliance": [
            "Sarbanes-Oxley (SOX) requires strict access controls and audit trails for financial systems.",
            "All changes to production databases must be logged, reviewed, and approved via the Change Management process."
        ],
        "3. HIPAA Basics": [
            "The Health Insurance Portability and Accountability Act (HIPAA) mandates the protection of Protected Health Information (PHI).",
            "All PHI must be encrypted at rest and in transit. Access to PHI is restricted strictly on a need-to-know basis, and all access logs must be maintained for 6 years."
        ]
    }
    create_docx("compliance_guidelines.docx", "Regulatory Compliance Guidelines", content)

def main():
    print("Generating sample documents...")
    generate_handbook()
    generate_engineering_standards()
    generate_security_policy()
    generate_api_docs()
    generate_onboarding_guide()
    generate_product_roadmap()
    generate_financial_report()
    generate_meeting_minutes()
    generate_technical_architecture()
    generate_user_research()
    generate_marketing_strategy()
    generate_incident_response()
    generate_data_governance()
    generate_employee_benefits()
    generate_release_notes()
    generate_vendor_evaluation()
    generate_training_materials()
    generate_compliance_guidelines()
    print("All documents generated successfully.")

if __name__ == "__main__":
    main()
