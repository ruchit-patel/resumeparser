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
        
        return suggestions

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




    