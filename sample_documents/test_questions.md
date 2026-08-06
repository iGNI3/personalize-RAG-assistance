# RAG Knowledge Assistant Test Questions

These questions are designed to test the capabilities of the retrieval and generation system, as well as the Role-Based Access Control (RBAC) filtering.

## 1. Single Document Retrieval

1. **Question:** What are the core working hours for the company?
   - **Expected Source:** `company_handbook.pdf`
   - **Role Required:** Viewer (All)

2. **Question:** What is the procedure for handling a Severity 1 incident?
   - **Expected Source:** `incident_response_plan.docx`
   - **Role Required:** Admin

3. **Question:** What is the total revenue reported for Q2?
   - **Expected Source:** `financial_report_q2.pdf`
   - **Role Required:** Admin

4. **Question:** Where can I find the endpoint to create a new user profile?
   - **Expected Source:** `api_documentation.pdf`
   - **Role Required:** Analyst / Admin

5. **Question:** What are our primary marketing channels for Q3?
   - **Expected Source:** `marketing_strategy.pdf`
   - **Role Required:** Analyst / Admin

## 2. Multi-Document Synthesis

6. **Question:** Summarize the new features planned for Q3 and how they will be documented in the release notes.
   - **Expected Sources:** `product_roadmap.pdf`, `release_notes_v2.pdf`
   - **Role Required:** Analyst / Admin

7. **Question:** Based on the user research, which features should we prioritize in the engineering standards?
   - **Expected Sources:** `user_research_findings.docx`, `engineering_standards.pdf`
   - **Role Required:** Analyst / Admin

8. **Question:** How do the Q2 financial constraints impact the vendor evaluation for cloud services?
   - **Expected Sources:** `financial_report_q2.pdf`, `vendor_evaluation.docx`
   - **Role Required:** Admin

9. **Question:** What security protocols must be followed during incident response, and how does that tie into compliance?
   - **Expected Sources:** `security_policy.docx`, `incident_response_plan.docx`, `compliance_guidelines.docx`
   - **Role Required:** Admin

10. **Question:** Compare the onboarding requirements with the company handbook policies regarding time off.
    - **Expected Sources:** `onboarding_guide.docx`, `company_handbook.pdf`
    - **Role Required:** Viewer (All)

## 3. Out of Scope ("Not Enough Info")

11. **Question:** What is the CEO's personal phone number?
    - **Expected Output:** System should state that it does not have this information based on the provided context.

12. **Question:** What were the exact sales figures for 2018?
    - **Expected Output:** System should state that the information is not available (assuming only Q2 2024 is provided).

13. **Question:** How do I configure a Cisco router?
    - **Expected Output:** System should decline to answer as it's outside the scope of company documentation.

14. **Question:** Who won the last Super Bowl?
    - **Expected Output:** System should state that this is outside its knowledge base.

15. **Question:** Detail the marketing strategy for the year 2030.
    - **Expected Output:** System should state that it only has roadmap/marketing information up to the current period.

## 4. Role-Based Testing

*These questions test the system's ability to filter out documents that the user does not have permission to see.*

16. **Question (asked by Viewer):** What is our Q2 net profit?
    - **Expected Output:** System should not be able to answer, as the financial report requires Admin access.

17. **Question (asked by Viewer):** How is our microservices architecture deployed?
    - **Expected Output:** System should not answer, as technical architecture requires Analyst/Admin access.

18. **Question (asked by Analyst):** What decisions were made at the last board meeting?
    - **Expected Output:** System should not answer, as meeting minutes are restricted to Admins.

19. **Question (asked by Analyst):** What is our data classification policy?
    - **Expected Output:** System should not answer, as the security policy requires Admin access.

20. **Question (asked by Admin):** Summarize the financial report and the decisions made at the board meeting.
    - **Expected Output:** System should provide a comprehensive answer citing both documents, as the Admin has full access.
