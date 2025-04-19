import frappe
from frappe import _

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


@frappe.whitelist()
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
        return {"error": str(e),"status": False,}