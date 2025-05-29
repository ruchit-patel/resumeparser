import frappe
from frappe import _

from .open_seach_querys import get_resume_from_id
from .search_apis import open_search_query_executor
@frappe.whitelist(allow_guest=True)
def candidate_update():
    try:
        path = frappe.request.path
        candidate_id = path.strip("/").split("/")[-1]
        if not candidate_id:
            return {"error": "candidate id is required"}

        new_data = frappe.form_dict
        
        if not candidate_id or not new_data:
            return {"error": "candidate_id and new_data are required"}

        client = frappe.new_doc("Resume").get_opensearch_client()

        index_name = "resumes"
        response = client.update(
            index=index_name,
            id=candidate_id,
            body={"doc": frappe.parse_json(new_data)}
        )

        return {"status": "success", "response": response}

    except Exception as e:
        frappe.log_error(f"Error in update_profile: {str(e)}")
        return {"error": str(e)}



@frappe.whitelist(allow_guest=True)
def candidate_get():
    try:
        path = frappe.request.path
        candidate_id = path.strip("/").split("/")[-1]

        doc_data = frappe.get_doc("Resume", candidate_id)
        if not candidate_id:
            return {"error": "candidate id is required"}

        client = frappe.new_doc("Resume").get_opensearch_client()
        index_name = "resumes"
        response = client.get(index=index_name, id=candidate_id)
        source = response['_source']
        source["resume_url"] = doc_data.get("resume_file")
        return source

    except Exception as e:
        frappe.log_error(f"Error in update_profile: {str(e)}")
        return {"error": str(e)}


@frappe.whitelist(allow_guest=True)
def approve_resume():
    try:
        path = frappe.request.path
        candidate_id = path.strip("/").split("/")[-1]
        status = path.strip("/").split("/")[-2]
        if status == "true":
            status = True
        else:
            status = False
        print("------------------STATUS-----------------",status)
        doc_data = frappe.get_doc("Resume", candidate_id)
        if not candidate_id:
            return {"error": "candidate id is required"}

        doc_data.approved_by = frappe.session.user
        doc_data.approve_status = status
        doc_data.save()
        frappe.db.commit()
        return {"status": status, "approved_by": frappe.session.user}

    except Exception as e:
        frappe.log_error(f"Error in update_profile: {str(e)}")
        return {"error": str(e),"status": False}


@frappe.whitelist(allow_guest=True)
def saved_resumes():
    try:  
        resumes = frappe.get_all("Save Resume", filters={"user": frappe.session.user}, fields=["resume"])
        row_query =   get_resume_from_id([r["resume"] for r in resumes])
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
        frappe.log_error(f"Error in saved_resumes: {str(e)}")
        return str(e)