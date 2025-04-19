import frappe

from datetime import datetime, date
from .open_seach_querys import keyword_search_query,skill_search_query,location_search_query,companies_search_query,designation_search_query,education_institute_search_query,final_search_query,certificates_search_query
import json

def read_courses_from_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            courses = json.load(file)
            return courses
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error: The file {file_path} contains invalid JSON.")
        return []
    

def human_readable_date_diff(target_date_str):
    delta = (target_date_str.date() - date.today()).days

    # Human-readable output
    if delta == 0:
        return "Today"
    elif delta > 0:
        return f"{delta} day{'s' if delta > 1 else ''} to go"
    else:
        return f"{abs(delta)} day{'s' if abs(delta) > 1 else ''} ago"


        # OpenSearch query for skills, designations, and companies with prefix matching
        
def open_search_query_executor(query):
    try:
        # Get OpenSearch client
        client = frappe.new_doc("Resume").get_opensearch_client()
        index_name = "resumes"
        # Execute the query against OpenSearch
        response = client.search(index=index_name, body=query)
        
        return response

    except Exception as e:
        frappe.log_error(f"Error in seach_keywords: {str(e)}")
        return {}


@frappe.whitelist(allow_guest=True)
# tuple in list
def seach_keywords(q: str):
    query = keyword_search_query(q)
    response= open_search_query_executor(query)
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
    
    return None

@frappe.whitelist(allow_guest=True)
# tuple in list
def seach_skills(q:str):
    query = skill_search_query(q)
    response = open_search_query_executor(query)
    suggestions = {"skills": []}
    if 'aggregations' in response:
        # Extract skills
        skill_buckets = response['aggregations']['skill_suggestions']['matching_skills']['skills']['buckets']
        suggestions['skills'] = [bucket['key'] for bucket in skill_buckets]
    
    return [(item, key) for key, values in suggestions.items() for item in values]


@frappe.whitelist(allow_guest=True)
# list view
def seach_candidate_location(q:str):
    data = frappe.get_all("Locations", filters={"name": ["like", f"%{q}%"]}, fields=["name","parent_locations"])
    if data:
        return [f"{item["name"]}, {item["parent_locations"]}" for item in data]
    else:
        return ["No data found"] 

@frappe.whitelist(allow_guest=True)
def candidate_departments():
    file_path = frappe.get_app_path('resumeparser', 'apis', 'education_departments.json')
    course_data = read_courses_from_json(file_path)
    return course_data


@frappe.whitelist(allow_guest=True)
def seach_candidate_industry(q:str):
    industries = [
    "Information Technology (IT)",
    "Finance & Banking",
    "Healthcare & Pharmaceuticals",
    "Manufacturing & Industrial Production",
    "Retail & E-commerce",
    "Education & E-Learning",
    "Telecommunications & Media",
    "Hospitality & Tourism",
    "Energy & Utilities",
    "Transportation & Logistics",
    "Real Estate & Construction",
    "Agriculture & Agribusiness",
    "Automotive & Aerospace",
    "Consumer Goods & Services",
    "Entertainment & Leisure",
    "Legal & Compliance",
    "Insurance & Risk Management",
    "Mining & Natural Resources",
    "Professional Services",
    "Public Sector & Government",
    "Technology Hardware & Equipment",
    "Semiconductors & Electronics",
    "Renewable Energy & Sustainability",
    "Cybersecurity & Data Privacy",
    "Artificial Intelligence & Machine Learning",
    "Blockchain & Fintech",
    "Sports & Recreation",
    "Art & Culture",
    "Nonprofit & Social Impact"
    ]
    filter_data = list(filter(lambda a: q in a, industries))
    return filter_data


@frappe.whitelist(allow_guest=True)
def seach_candidate_role(q:str):
    file_path = frappe.get_app_path('resumeparser', 'apis', 'education_departments.json')
    role_data = read_courses_from_json(file_path)
    all_roles = [role for dept in role_data for role in dept["roles"]]
    filter_data = list(filter(lambda a: q in a, all_roles))
    return filter_data



@frappe.whitelist(allow_guest=True)
def seach_candidate_company(q:str):
    query = companies_search_query(q)
    response = open_search_query_executor(query)
    suggestions = []
    if 'aggregations' in response:
        # Extract companies
        company_buckets = response['aggregations']['company_suggestions']['matching_companies']['companies']['buckets']
        suggestions = [bucket['key'] for bucket in company_buckets]

    return suggestions


@frappe.whitelist(allow_guest=True)
# tuple in list
def seach_candidate_company_exclude(q:str):
    query = companies_search_query(q)
    response = open_search_query_executor(query)
    suggestions = {"companies": []}
    if 'aggregations' in response:
        # Extract companies
        company_buckets = response['aggregations']['company_suggestions']['matching_companies']['companies']['buckets']
        suggestions["companies"] = [bucket['key'] for bucket in company_buckets]

    return [(item, key) for key, values in suggestions.items() for item in values]


@frappe.whitelist(allow_guest=True)
# list view
def seach_candidate_designation(q:str):
    query = designation_search_query(q)
    response = open_search_query_executor(query)
    suggestions = []
    if 'aggregations' in response:
        # Extract designations
        designation_buckets = response['aggregations']['designation_suggestions']['matching_designations']['designations']['buckets']
        suggestions = [bucket['key'] for bucket in designation_buckets]

    return suggestions


@frappe.whitelist(allow_guest=True)
def candidate_courses():
    file_path = frappe.get_app_path('resumeparser', 'apis', 'education_courses.json')
    course_data = read_courses_from_json(file_path)
    return course_data

@frappe.whitelist(allow_guest=True)
def seach_candidate_edu_institute(q:str):
    query = education_institute_search_query(q)
    response = open_search_query_executor(query)
    suggestions = []
    if 'aggregations' in response:
        # Extract designations
        designation_buckets = response['aggregations']['education_institute_suggestions']['matching_institutes']['institutes']['buckets']
        suggestions = [bucket['key'] for bucket in designation_buckets]

    return suggestions


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

import json
@frappe.whitelist(allow_guest=True)
def search_results():
    try:  
        post_form =  frappe.request.get_json()
        row_query = final_search_query(post_form)
        print("-------------------------------------")
        print(row_query)
        print("-------------------------------------")
        response = open_search_query_executor(row_query)
        row_data = response.get('hits', {}).get('hits', [])
        data = []   
        for source_row in row_data:
            source =  source_row.get("_source")
            skills = source.get("skills", [])
            technical_skills = [s.get("skill_name", "") for s in skills if s.get("skill_type") == "Technical"]
            soft_skills = [s.get("skill_name", "") for s in skills if s.get("skill_type") == "Soft"]
            data.append({
                "id": str(source_row.get("_id")),
                "basicInfo": {
                "candidate_name": source.get("candidate_name"),
                "date_of_birth": None,
                "address": None,
                "gender": None,
                "mobile_number": source.get("mobile_number"),
                "email": source.get("email"),
                "city": source.get("city"),
                "maritalStatus": "-",
                "castCategory": "-",
                "physicallyChallenged": "-"
            },
            "workSummary": {
                "industry": None,
                "department": None,
                "role": None
            },
            "education": source.get("education", []),
            "experience": source.get("experience", []),
            "projects": source.get("projects", []),
            "certificates": source.get("certificates", []),
            "accomplishments": [],
            "skills": {
                "TechnicalSkill": technical_skills,
                "Soft": soft_skills,
                "AdditionalSkills": []
            }
            })
        return data
    except Exception as e:
        frappe.log_error(f"Error in seach_results: {str(e)}")
        return str(e)

@frappe.whitelist(allow_guest=True)
def candidate_detail():
    try:
        path = frappe.request.path
        candidate_id = path.strip("/").split("/")[-1]

        # Get OpenSearch client and fetch resume data
        resume_doc = frappe.get_doc("Resume", candidate_id)
        try:
            client = frappe.new_doc("Resume").get_opensearch_client()
            index_name = "resumes"
            response = client.get(index=index_name, id=candidate_id)
            source = response['_source']
            # Categorize skills
            skills = source.get("skills", [])
            technical_skills = [s.get("skill_name") for s in skills if s.get("skill_type") == "Technical"]
            soft_skills = [s.get("skill_name") for s in skills if s.get("skill_type") == "Soft"]

            return {
                "id": str(candidate_id),
                "basicInfo": {
                    "candidate_name": source.get("candidate_name"),
                    "date_of_birth": source.get("date_of_birth"),
                    "address": source.get("address"),
                    "gender": source.get("gender"),
                    "mobile_number": source.get("mobile_number"),
                    "email": source.get("email"),
                    "city": source.get("city"),
                    "maritalStatus": source.get("marital_status", "-"),
                    "castCategory": source.get("cast_category", "-"),
                    "physicallyChallenged": source.get("physically_challenged", "-"),
                    "total_experience": source.get("total_experience"),
                },
                "workSummary": {
                    "industry": source.get("industry"),
                    "department": source.get("department"),
                    "role": source.get("role")
                },
                "education": source.get("education", []),
                "experience": source.get("experience", []),
                "projects": source.get("projects", []),
                "certificates": source.get("certificates", []),
                "accomplishments": source.get("accomplishments", []),
                "skills": {
                    "TechnicalSkill": technical_skills,
                    "Soft": soft_skills,
                    "AdditionalSkills": []  # Add logic here if needed
                },
                "desiredJob": {
                    "employmentType": source.get("employment_type", "Permanent"),
                    "employmentStatus": source.get("employment_status", "Full time")
                },
                "resume": {
                    "link": resume_doc.get("resume_file"),
                    "lastUpdate": human_readable_date_diff(resume_doc.get("modified")),
                    "resume_approval": bool(resume_doc.get("approve_status")),
                }
            }

        except Exception as e:
            frappe.log_error(f"Error fetching from OpenSearch for candidate {candidate_id}: {str(e)}")
            return {
                "status": "error",
                "message": f"Failed to retrieve resume details for candidate {candidate_id} {str(e)}"
            }

    except Exception as e:
        frappe.log_error(f"General error in candidate_detail: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }

@frappe.whitelist(allow_guest=True)
def test(q:str):
    data = frappe.get_all("Locations", filters={"name": ["like", f"%{q}%"]}, fields=["name","parent_locations"])
    if data:
        return [f"{item["name"]},{item["parent_locations"]}" for item in data]
        return data
    else:
        return ["No data found"] 



@frappe.whitelist(allow_guest=True)
# tuple in list
def seach_certificates(q:str):
    query = certificates_search_query(q)
    response = open_search_query_executor(query)
    suggestions = {"certificates": []}
    if 'aggregations' in response:
        # Extract certificates
        certificate_buckets = response['aggregations']['certificate_suggestions']['matching_certificates']['certificates']['buckets']
        suggestions['certificates'] = [bucket['key'] for bucket in certificate_buckets]
    
    return [(item, key) for key, values in suggestions.items() for item in values]




@frappe.whitelist(allow_guest=True)
# for update page
def seach_candidate_skills(q:str):
    query = skill_search_query(q)
    response = open_search_query_executor(query)
    suggestions = {"skills": []}
    if 'aggregations' in response:
        # Extract skills
        skill_buckets = response['aggregations']['skill_suggestions']['matching_skills']['skills']['buckets']
        return [bucket['key'] for bucket in skill_buckets]
    return []





