import frappe



@frappe.whitelist(allow_guest=True)
def seach_keywords(q: str):
    try:
        # Get OpenSearch client
        client = frappe.new_doc("Resume").get_opensearch_client()
        index_name = "resumes"

        # OpenSearch query for skills, designations, and companies with prefix matching
        query = {
            "size": 0,
            "_source": False,
            "query": {
                "bool": {
                    "should": [
                        {
                            "nested": {
                                "path": "skills",
                                "query": {
                                    "match_phrase_prefix": {
                                        "skills.skill_name": {
                                            "query": q,
                                            "max_expansions": 50
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "nested": {
                                "path": "experience",
                                "query": {
                                    "match_phrase_prefix": {
                                        "experience.role_position": {
                                            "query": q,
                                            "max_expansions": 50
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "nested": {
                                "path": "experience",
                                "query": {
                                    "match_phrase_prefix": {
                                        "experience.company_name": {
                                            "query": q,
                                            "max_expansions": 50
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    "minimum_should_match": 1
                }
            },
            "aggs": {
                "skill_suggestions": {
                    "nested": {
                        "path": "skills"
                    },
                    "aggs": {
                        "matching_skills": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "skills.skill_name": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "skills": {
                                    "terms": {
                                        "field": "skills.skill_name.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                },
                "designation_suggestions": {
                    "nested": {
                        "path": "experience"
                    },
                    "aggs": {
                        "matching_designations": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "experience.role_position": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "designations": {
                                    "terms": {
                                        "field": "experience.role_position.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                },
                "company_suggestions": {
                    "nested": {
                        "path": "experience"
                    },
                    "aggs": {
                        "matching_companies": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "experience.company_name": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "companies": {
                                    "terms": {
                                        "field": "experience.company_name.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        # Execute the query against OpenSearch
        response = client.search(index=index_name, body=query)
        
        # Extract suggestions from all three categories
        suggestions = {
            "skills": [],
            "designations": [],
            "companies": []
        }
        if 'aggregations' in response:
            # Extract skills
            skill_buckets = response['aggregations']['skill_suggestions']['matching_skills']['skills']['buckets']
            suggestions['skills'] = [bucket['key'] for bucket in skill_buckets]
            
            # Extract designations
            designation_buckets = response['aggregations']['designation_suggestions']['matching_designations']['designations']['buckets']
            suggestions['designations'] = [bucket['key'] for bucket in designation_buckets]
            
            # Extract companies
            company_buckets = response['aggregations']['company_suggestions']['matching_companies']['companies']['buckets']
            suggestions['companies'] = [bucket['key'] for bucket in company_buckets]
        
        print([(item, key) for key, values in suggestions.items() for item in values])
        return [(item, key) for key, values in suggestions.items() for item in values]

    except Exception as e:
        frappe.log_error(f"Error in seach_keywords: {str(e)}")
        return {"skills": [], "designations": [], "companies": []}

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


@frappe.whitelist(allow_guest=True)
def seach_results():
    return [
        {'id': 1,
  'name': 'Anay Raja',
  'experience': '2y 10m',
  'salary': '₹ 7 Lacs',
  'location': 'Shivpuri',
  'currentJob': 'Ambulance person',
  'company': 'Sandhu, Verma and Bakshi',
  'education': 'B.Tech NIT Trichy, Tiruvottiyur 2020',
  'preferredLocations': ['Chennai', 'Ahmedabad', 'Remote'],
  'keySkills': ['Database Design', 'Mobile App', 'Backend', 'DevOps'],
  'additionalSkills': ['Angular',
   'Docker',
   'Javascript',
   'SQL Server',
   'Java',
   'Python',
   'Software Development'],
  'profileSummary': 'Earum nulla non iure officia repudiandae accusantium. Vel nobis a quia vitae eius.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 0,
  'downloads': 8,
  'hasCV': True,
  'lastModified': 'last 2 months',
  'activeStatus': 'Active today',
  'similarProfiles': 173,
  'experienceYears': 2,
  'salaryLacs': 7,
  'designation': 'Dramatherapist',
  'department': 'HR',
  'industry': 'IT Services',
  'isNewProfile': True,
  'isPremiumInstitute': True,
  'hasVerifiedSkills': True},
 {'id': 2,
  'name': 'Lakshit Kapadia',
  'experience': '4y 10m',
  'salary': '₹ 38 Lacs',
  'location': 'Tiruppur',
  'currentJob': 'Clinical molecular geneticist',
  'company': 'Gopal and Sons',
  'education': 'M.Tech NIT Trichy, Khora  2023',
  'preferredLocations': ['Chennai', 'Bangalore', 'Remote'],
  'keySkills': ['Database Design',
   'DevOps',
   'API Integration',
   'Frontend Development'],
  'additionalSkills': ['CSS',
   'Software Development',
   'Angular',
   'Javascript',
   'Kubernetes',
   'Java',
   'React'],
  'profileSummary': 'Quibusdam qui alias unde est excepturi. Pariatur voluptas non. Iure reprehenderit dolores.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 0,
  'downloads': 14,
  'hasCV': True,
  'lastModified': 'last week',
  'activeStatus': 'Active this week',
  'similarProfiles': 198,
  'experienceYears': 4,
  'salaryLacs': 38,
  'designation': 'Engineer, automotive',
  'department': 'Sales',
  'industry': 'E-commerce',
  'isNewProfile': True,
  'isPremiumInstitute': True,
  'hasVerifiedSkills': True},
 {'id': 3,
  'name': 'Netra Thaker',
  'experience': '10y 2m',
  'salary': '₹ 11 Lacs',
  'location': 'Ratlam',
  'currentJob': 'Meteorologist',
  'company': 'Vig, Amble and Barad',
  'education': 'B.E. MIT Pune, Anand 2018',
  'preferredLocations': ['Chennai', 'Ahmedabad', 'Delhi'],
  'keySkills': ['DevOps',
   'Web Development',
   'Frontend Development',
   'Database Design'],
  'additionalSkills': ['Python',
   'Javascript',
   'Java',
   'Software Development',
   'Net Core',
   'SQL Server',
   'CSS'],
  'profileSummary': 'Iure earum sunt minima. In eum ab occaecati alias quasi qui.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 9,
  'downloads': 17,
  'hasCV': True,
  'lastModified': 'last 2 months',
  'activeStatus': 'Active today',
  'similarProfiles': 81,
  'experienceYears': 10,
  'salaryLacs': 11,
  'designation': 'Further education lecturer',
  'department': 'Engineering',
  'industry': 'Healthcare',
  'isNewProfile': False,
  'isPremiumInstitute': False,
  'hasVerifiedSkills': False},
 {'id': 4,
  'name': 'Ekapad Balakrishnan',
  'experience': '0y 5m',
  'salary': '₹ 28 Lacs',
  'location': 'Sultan Pur Majra',
  'currentJob': 'Conservator, museum/gallery',
  'company': 'Zachariah, Konda and Manda',
  'education': 'B.E. NIT Trichy, Hosur 2021',
  'preferredLocations': ['Remote', 'Tirunelveli', 'Ahmedabad'],
  'keySkills': ['DevOps',
   'Web Development',
   'Frontend Development',
   'Mobile App'],
  'additionalSkills': ['Node.js',
   'HTML',
   'Kubernetes',
   'Angular',
   'Software Development',
   'Net Core',
   'SQL Server'],
  'profileSummary': 'Sint cupiditate unde voluptatem tenetur. Eius blanditiis corporis hic laboriosam assumenda eius.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 3,
  'downloads': 19,
  'hasCV': False,
  'lastModified': 'last 2 months',
  'activeStatus': 'Active today',
  'similarProfiles': 74,
  'experienceYears': 0,
  'salaryLacs': 28,
  'designation': 'Chief of Staff',
  'department': 'Engineering',
  'industry': 'IT Services',
  'isNewProfile': True,
  'isPremiumInstitute': True,
  'hasVerifiedSkills': True},
 {'id': 5,
  'name': 'Udarsh Atwal',
  'experience': '2y 6m',
  'salary': '₹ 25 Lacs',
  'location': 'Meerut',
  'currentJob': 'Cartographer',
  'company': 'Dara, Dhar and Ram',
  'education': 'B.E. MIT Pune, Bhiwandi 2020',
  'preferredLocations': ['Chennai', 'Pune', 'Mumbai'],
  'keySkills': ['Database Design', 'Backend', 'Web Development', 'UI/UX'],
  'additionalSkills': ['HTML',
   'Docker',
   'Java',
   'Python',
   'React',
   'Node.js',
   'SQL Server'],
  'profileSummary': 'Nam et sed architecto est. Veritatis recusandae tempora nam ea impedit itaque.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 1,
  'downloads': 13,
  'hasCV': True,
  'lastModified': 'last 2 months',
  'activeStatus': 'Active today',
  'similarProfiles': 188,
  'experienceYears': 2,
  'salaryLacs': 25,
  'designation': 'Higher education careers adviser',
  'department': 'Engineering',
  'industry': 'IT Services',
  'isNewProfile': True,
  'isPremiumInstitute': False,
  'hasVerifiedSkills': True},
 {'id': 6,
  'name': 'Balvan Chada',
  'experience': '2y 9m',
  'salary': '₹ 12 Lacs',
  'location': 'Malegaon',
  'currentJob': 'Product designer',
  'company': 'Narayanan-Bedi',
  'education': 'B.E. IIT Bombay, Buxar 2018',
  'preferredLocations': ['Pune', 'Bangalore', 'Chennai'],
  'keySkills': ['Frontend Development',
   'API Integration',
   'Mobile App',
   'UI/UX'],
  'additionalSkills': ['Software Development',
   'HTML',
   'Net Core',
   'Python',
   'React',
   'Javascript',
   'Angular'],
  'profileSummary': 'Similique possimus cupiditate nobis. Aliquid officiis dolores a non minus.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 3,
  'downloads': 12,
  'hasCV': False,
  'lastModified': 'last 2 months',
  'activeStatus': 'Active this week',
  'similarProfiles': 35,
  'experienceYears': 2,
  'salaryLacs': 12,
  'designation': 'Public librarian',
  'department': 'Sales',
  'industry': 'E-commerce',
  'isNewProfile': False,
  'isPremiumInstitute': False,
  'hasVerifiedSkills': False},
 {'id': 7,
  'name': 'Anjali Oak',
  'experience': '0y 9m',
  'salary': '₹ 18 Lacs',
  'location': 'Asansol',
  'currentJob': 'Public relations officer',
  'company': 'Munshi-Sha',
  'education': 'B.Tech NIT Trichy, Dharmavaram 2019',
  'preferredLocations': ['Chennai', 'Remote', 'Pune'],
  'keySkills': ['Mobile App', 'Backend', 'Database Design', 'Server Side'],
  'additionalSkills': ['React',
   'Node.js',
   'Javascript',
   'Kubernetes',
   'CSS',
   'Docker',
   'Python'],
  'profileSummary': 'Labore occaecati vero vitae laudantium perspiciatis. Amet corporis explicabo rem.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 17,
  'downloads': 6,
  'hasCV': True,
  'lastModified': 'last 2 months',
  'activeStatus': 'Active this week',
  'similarProfiles': 140,
  'experienceYears': 0,
  'salaryLacs': 18,
  'designation': 'Senior tax professional/tax inspector',
  'department': 'Marketing',
  'industry': 'IT Services',
  'isNewProfile': False,
  'isPremiumInstitute': True,
  'hasVerifiedSkills': True},
 {'id': 8,
  'name': 'Irya Mutti',
  'experience': '2y 2m',
  'salary': '₹ 13 Lacs',
  'location': 'Pondicherry',
  'currentJob': 'Location manager',
  'company': 'Solanki-Mani',
  'education': 'M.Tech NIT Trichy, Mathura 2022',
  'preferredLocations': ['Ahmedabad', 'Chennai', 'Tirunelveli'],
  'keySkills': ['UI/UX', 'DevOps', 'Database Design', 'Web Development'],
  'additionalSkills': ['MongoDB',
   'React',
   'Java',
   'Kubernetes',
   'Angular',
   'Javascript',
   'Net Core'],
  'profileSummary': 'Dolor eaque sint sequi error quibusdam.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 11,
  'downloads': 16,
  'hasCV': False,
  'lastModified': 'last week',
  'activeStatus': 'Active today',
  'similarProfiles': 86,
  'experienceYears': 2,
  'salaryLacs': 13,
  'designation': 'English as a second language teacher',
  'department': 'HR',
  'industry': 'IT Services',
  'isNewProfile': False,
  'isPremiumInstitute': False,
  'hasVerifiedSkills': False},
 {'id': 9,
  'name': 'Fariq Dasgupta',
  'experience': '5y 4m',
  'salary': '₹ 27 Lacs',
  'location': 'Patiala',
  'currentJob': 'Electronics engineer',
  'company': 'Gala PLC',
  'education': 'B.Tech IIT Bombay, Rajkot 2023',
  'preferredLocations': ['Remote', 'Delhi', 'Pune'],
  'keySkills': ['API Integration',
   'Backend',
   'Database Design',
   'Frontend Development'],
  'additionalSkills': ['CSS',
   'HTML',
   'Javascript',
   'Python',
   'Angular',
   'Docker',
   'Software Development'],
  'profileSummary': 'Optio occaecati doloribus earum quas. Fuga eaque accusantium.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 1,
  'downloads': 18,
  'hasCV': False,
  'lastModified': 'last week',
  'activeStatus': 'Active this week',
  'similarProfiles': 142,
  'experienceYears': 5,
  'salaryLacs': 27,
  'designation': 'Civil engineer, consulting',
  'department': 'Engineering',
  'industry': 'Healthcare',
  'isNewProfile': False,
  'isPremiumInstitute': True,
  'hasVerifiedSkills': False},
 {'id': 10,
  'name': 'Saumya De',
  'experience': '7y 7m',
  'salary': '₹ 27 Lacs',
  'location': 'Chennai',
  'currentJob': 'Psychologist, clinical',
  'company': 'Pall, Bhatia and Pall',
  'education': 'B.E. IIT Bombay, Jaunpur 2020',
  'preferredLocations': ['Delhi', 'Chennai', 'Tirunelveli'],
  'keySkills': ['Database Design', 'Web Development', 'UI/UX', 'DevOps'],
  'additionalSkills': ['HTML',
   'Node.js',
   'Javascript',
   'Kubernetes',
   'Docker',
   'MongoDB',
   'SQL Server'],
  'profileSummary': 'Laborum non maiores occaecati dolor. Hic autem cumque eligendi.',
  'photo': '/placeholder.svg?height=80&width=80',
  'views': 7,
  'downloads': 11,
  'hasCV': True,
  'lastModified': 'last week',
  'activeStatus': 'Active this week',
  'similarProfiles': 20,
  'experienceYears': 7,
  'salaryLacs': 27,
  'designation': 'Data processing manager',
  'department': 'HR',
  'industry': 'Healthcare',
  'isNewProfile': True,
  'isPremiumInstitute': False,
  'hasVerifiedSkills': False},
    ]



@frappe.whitelist(allow_guest=True)
def candidate_detail():
    path = frappe.request.path
    candidate_id = path.strip("/").split("/")[-1]
    return {    
        "id": candidate_id,
        "basicInfo": {
            "name": "Jay Patel",
            "photo": "https://example.com/photo.jpg",
            "isNewProfile": True,
            "isPremiumInstitute": True,
            "hasVerifiedSkills": True,
            "lastModified": "2 days ago",
            "experience": "5 years",
            "salary": "27 Lacs",
            "location": "Dubai"
        },
        "summary": {
            "years": 5,
            "description": "Expert in React and Full Stack Development"
        },
        "skills": {
            "keySkills": ["React", "Node.js", "Python"],
            "additionalSkills": ["SQL", "Git", "Agile"]
        },
        "workSummary": {
            "industry": "IT",
            "department": "Engineering",
            "role": "Software Engineer",
            "currentCompany": "Sayaji Infotech",
            "experience": "1 years",
            "salary": "5-7 LPA",
            "location": "Dubai",
            "preferredLocations": ["Valsad", "Vadodra", "Ahmedabad"],
            "similarProfiles": 12
        },
        "education": {
            "degree": "B.Tech in Computer Science",
            "university": "Parul University",
            "location": "Vadodara",
            "year": 2022,
            "type": "UG"
        },
        "certification": {
            "name": "Frappe Framework V15",
            "provider": "Frappe"
        },
        "languages": [
            {"name": "English", "level": "Beginner", "abilities": ["Read", "Write", "Speak"]},
            {"name": "Hindi", "level": "Proficient", "abilities": ["Read", "Write", "Speak"]},
            {"name": "Gujarati", "level": "Beginner", "abilities": ["Read", "Write", "Speak"]},
            {"name": "Tamil", "level": "Beginner", "abilities": ["Speak"]}
        ],
        "personalDetails": {
            "dateOfBirth": "30 Apr 1999",
            "gender": "Male",
            "maritalStatus": "Unmarried",
            "castCategory": "General",
            "physicallyChallenged": "No"
        },
        "desiredJob": {
            "employmentType": "Permanent",
            "employmentStatus": "Full time"
        },
        "resume": {
            "link": "/assets/resumeparser/resume_search/Dhruv_Resume.pdf",
            "lastUpdate": "2 days ago"
        }
        }