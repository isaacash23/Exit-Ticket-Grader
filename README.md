# Exit-Ticket-Grader
This spreadsheet tool automatically grades multiple Google Form exit tickets for completion across an entire class of students

How-To Steps:
1. Create a copy of the spreadsheet by clicking the link [here](https://docs.google.com/spreadsheets/d/1wQ0tCp0jmL19Px1oJ_rImhiagQs5sccZKtMCQrG_OgQ/copy).
2. Fill in the email addresses of students in your class, and the edit links for the google forms that they filled out.
3. If desired, change the late penalty to the desired amount of credit late submissions should receive. (e.g., if late entried get 80% credit, change the cell to 0.8)
4. If you do not see a menu at the top that says "grading", go to Extensions>Apps Script and run the "onOpen" function.
5. Once you have the grading menu, click Grading>Calculate Class Grades to automatically fill in the scores column with each student's total score, giving 1 point for each Google Form.
