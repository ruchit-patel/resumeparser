import frappe



@frappe.whitelist(allow_guest=True)
def seach_keywords(q:str):
    job_keywords = [
            "Software Developer", "Software Engineer", "Full Stack Developer", 
            "Frontend Developer", "Backend Developer", "Web Developer", 
            "Mobile Developer", "Data Scientist", "Data Analyst", "Machine Learning Engineer", 
            "DevOps Engineer", "Cloud Engineer", "System Administrator", 
            "Network Engineer", "Database Administrator", "QA Engineer", 
            "Test Engineer", "Automation Tester", "Business Analyst", 
            "Project Manager", "Product Manager", "Technical Lead", 
            "Engineering Manager", "IT Support", "IT Consultant", 
            "UI/UX Designer", "Graphic Designer", "Frontend Engineer", 
            "Backend Engineer", "Cybersecurity Analyst", "Penetration Tester", 
            "Data Engineer", "Big Data Engineer", "Solutions Architect", 
            "Technical Writer", "Game Developer", "Embedded Systems Engineer", 
            "Blockchain Developer", "AI Engineer", "NLP Engineer", 
            "Security Analyst", "IT Administrator", "Site Reliability Engineer (SRE)", 
            "API Developer", "CRM Developer", "ERP Consultant", 
            "Network Administrator", "Cloud Architect", "Mobile App Developer", 
            "Android Developer", "iOS Developer", "Quality Assurance Specialist", 
            "Release Manager", "Build Engineer", "Software Tester", 
            "Help Desk Support", "IT Technician", "Infrastructure Engineer", 
            "IT Operations Manager", "Tech Support Executive", 
            "Technical Recruiter", "Technical Support Engineer"
        ]
    filter_data = list(filter(lambda a: q in a, job_keywords))
    return filter_data

@frappe.whitelist(allow_guest=True)
def seach_skills(q:str):
    skills = [
        "Python", "Java", "JavaScript", "C#", "C++", "Ruby", "PHP", "Go", "Swift", "Kotlin", 
        "SQL", "HTML/CSS", "React", "Angular", "Node.js", "Django", "Flask", "Spring Boot", 
        "ASP.NET", "Docker", "Kubernetes", "Git/GitHub", "CI/CD", "REST APIs", "GraphQL", 
        "Microservices", "Cloud Computing (AWS, Azure, GCP)",
        "Manual Testing", "Automated Testing", "Selenium", "JUnit", "TestNG", "PyTest", 
        "Postman", "JMeter", "LoadRunner", "Cucumber", "Test Cases and Test Plans", 
        "Bug Tracking", "Performance Testing", "API Testing", "Regression Testing", 
        "Integration Testing", "Unit Testing", "End-to-End Testing",
        "Data Analysis", "Data Cleaning", "Data Visualization", "Pandas", "NumPy", "SQL", "R", 
        "Excel", "Tableau", "Power BI", "Machine Learning", "Deep Learning", "TensorFlow", 
        "PyTorch", "Data Mining", "Data Wrangling", "Statistical Analysis", 
        "Predictive Modeling", "Data Warehousing",
        "CI/CD", "Jenkins", "Docker", "Kubernetes", "Ansible", "Terraform", "AWS", "Azure", 
        "GCP", "Bash/Shell Scripting", "Infrastructure as Code (IaC)", 
        "Monitoring and Logging (Prometheus, Grafana)", "Configuration Management", 
        "Version Control (Git)", "Container Orchestration",
        "Linux Administration", "Windows Server", "Bash/Shell Scripting", "Powershell", 
        "Network Configuration", "System Monitoring", "Security Management", 
        "User and Permission Management", "Virtualization (VMware, Hyper-V)", 
        "Backup and Recovery", "Firewall Configuration", "Active Directory", 
        "DNS/DHCP Configuration", "IT Support"
    ]
    filter_data = list(filter(lambda a: q in a, skills))
    return filter_data


@frappe.whitelist(allow_guest=True)
def seach_candidate_location(q:str):
    locations = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", 
    "Kolkata", "Pune", "Jaipur", "Surat", "Lucknow", "Kanpur", 
    "Nagpur", "Patna", "Indore", "Bhopal", "Ludhiana", "Agra", 
    "Nashik", "Vadodara", "Faridabad", "Ghaziabad", "Rajkot", 
    "Meerut", "Kochi", "Coimbatore", "Mysore", "Guwahati", 
    "Dehradun", "Ranchi", "Jodhpur", "Gwalior", "Thane", 
    "Visakhapatnam", "Madurai", "Vijayawada", "Chandigarh", 
    "Hubli-Dharwad", "Amritsar", "Raipur", "Bhubaneswar", 
    "Jabalpur", "Guntur", "Noida", "Gurugram", "Aurangabad", 
    "Solapur", "Rajahmundry", "Tirupati", "Mangalore", 
    "Navi Mumbai", "Udaipur", "Vellore", "Jalandhar", 
    "Kota", "Varanasi", "Allahabad", "Bareilly", 
    "Salem", "Tiruchirappalli", "Gaya", "Dhanbad", 
    "Bikaner", "Jammu", "Shimla", "Itanagar", 
    "Shillong", "Aizawl", "Gangtok", "Kohima", 
    "Imphal", "Agartala", "Panaji", "Port Blair", 
    "Daman", "Silvassa", "Kavaratti", "Puducherry"
    ]

    filter_data = list(filter(lambda a: q in a, locations))
    return filter_data




@frappe.whitelist(allow_guest=True)
def seach_candidate_industry(q:str):
    industries = [
    "Information Technology (IT)", "Finance", "Healthcare", 
    "Manufacturing", "Retail", "Education", 
    "Telecommunication", "Hospitality", "Energy", 
    "Transportation and Logistics"
    ]
    filter_data = list(filter(lambda a: q in a, industries))
    return filter_data





@frappe.whitelist(allow_guest=True)
def seach_candidate_company(q:str):
    companies = [
    "Google", "Apple", "Microsoft", 
    "Amazon", "Facebook (Meta)", "Tesla", 
    "IBM", "Intel", "Samsung", 
    "Netflix"
    ]

    filter_data = list(filter(lambda a: q in a, companies))
    return filter_data

@frappe.whitelist(allow_guest=True)
def seach_candidate_designation(q:str):
    designations = [
    "Software Engineer", "Senior Software Engineer", "Lead Developer", 
    "Principal Engineer", "Software Architect", "Technical Lead", 
    "Engineering Manager", "Product Manager", "Project Manager", 
    "Team Lead", "DevOps Engineer", "QA Engineer", 
    "Test Engineer", "Automation Tester", "Data Analyst", 
    "Data Scientist", "Data Engineer", "Machine Learning Engineer", 
    "Business Analyst", "Network Engineer", "System Administrator", 
    "Database Administrator", "UI/UX Designer", "Frontend Developer", 
    "Backend Developer", "Full Stack Developer", "Mobile Developer", 
    "IT Support Specialist", "Technical Support Engineer", "Technical Writer", 
    "Security Analyst", "Penetration Tester", "Cybersecurity Specialist", 
    "IT Consultant", "Solutions Architect", "Cloud Architect", 
    "IT Operations Manager", "Release Manager", "Site Reliability Engineer (SRE)", 
    "Infrastructure Engineer", "Help Desk Technician", "IT Technician"
    ]

    filter_data = list(filter(lambda a: q in a, designations))
    return filter_data



@frappe.whitelist(allow_guest=True)
def seach_candidate_edu_institute(q:str):
    education_institutions = [
    "Massachusetts Institute of Technology (MIT)", "Stanford University", 
    "Harvard University", "California Institute of Technology (Caltech)", 
    "University of Oxford", "University of Cambridge", 
    "University of Chicago", "Princeton University", 
    "Imperial College London", "University College London (UCL)"
    ]
    filter_data = list(filter(lambda a: q in a, education_institutions))
    return filter_data


@frappe.whitelist(allow_guest=True)
def seach_candidate_category(q:str):
    candidate_categories = [
    "Fresher", "Experienced", "Intern", 
    "Junior Developer", "Mid-Level Developer", "Senior Developer", 
    "Team Lead", "Manager", "Executive", 
    "Consultant", "Contractor", "Freelancer", 
    "Part-Time", "Full-Time", "Remote Worker", 
    "On-Site Worker", "Temporary", "Permanent", 
    "Entry-Level", "Mid-Level", "Senior-Level", 
    "Technical", "Non-Technical", "Skilled Worker", 
    "Unskilled Worker", "Supervisor", "Administrator"
]

    filter_data = list(filter(lambda a: q in a, candidate_categories))
    return filter_data




    