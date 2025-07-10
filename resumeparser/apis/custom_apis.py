import frappe

@frappe.whitelist(allow_guest=True)
def all_users():
    users = frappe.get_all('User', fields=["name", "email"])
    return users

import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def save_resume(resume):
    try:
        # Check if a resume already exists for the user
        existing_resume = frappe.get_all(
            "Save Resume",
            filters={"resume": resume, "user": frappe.session.user},
            pluck="name"
        )

        if existing_resume:
            doc = frappe.get_doc("Save Resume", existing_resume[0])
            doc.delete()
            frappe.db.commit()
            return {
                "status": "unsaved",
                "message": _("Resume unsaved successfully")
            }
        else:
            # Create a new resume
            doc = frappe.new_doc("Save Resume")
            doc.user = frappe.session.user
            doc.name = resume  # Only if 'name' is allowed to be set manually
            doc.resume = resume
            doc.save()
            frappe.db.commit()
            return {
                "status": "saved",
                "message": _("Resume saved successfully")
            }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in save_resume")
        return {
            "status": "error",
            "message": _("Something went wrong: ") + str(e)
        }


@frappe.whitelist(allow_guest=True)
def save_resume_status(resume=None):
    try:
        # Check if the resume exists
        resume_doc = frappe.get_all("Save Resume", filters={"resume": resume, "user": frappe.session.user})
            
        # Check if the resume has any user associated with it
        if resume_doc:
            return {"message": True, "status": "saved"}
        
        # If resume doesn't exist or doesn't have a user
        return {"message": False, "status": "not_saved"}
    except Exception as e:
        frappe.log_error(f"Error in save_resume_status: {str(e)}")
        return {"message": False, "status": "error", "error": str(e)}


@frappe.whitelist(allow_guest=True)
def redirect_to_docshare():
    return {
        "value": 100,  # This is a placeholder value - replace with your actual value
        "fieldtype": "Currency",
        "route_options": {"docshare_type": "Read"},
        "route": ["List", "DocShare"]
    }

# NUMBER CARD SHARE WITH ME 
@frappe.whitelist(allow_guest=True)
def redirect_to_resume_with_filter():
    """Redirect to the Resume list filtered by Resumes shared with current user"""
    # Get the currently logged in user
    current_user = frappe.session.user
    
    # Get all Resume documents shared with the current user
    shared_resumes = frappe.get_all('DocShare', 
                                  filters={'user': current_user, 'share_doctype': 'Resume'},
                                  fields=['share_name'])
    
    # Extract just the Resume IDs
    resume_ids = [d.share_name for d in shared_resumes] if shared_resumes else []
    
    # Count of shared resumes
    approved_count = len(resume_ids)
    
    return {
        "value": approved_count,  # Count of resumes shared with current user
        "fieldtype": "Int",
        # Filter to show only the specific Resume IDs that are shared with the user
        "route_options": {
            "name": ["in", resume_ids] if resume_ids else ["=", "none_found_placeholder"]
        },
        "route": ["List", "Resume"]
    }

# NUMBER CARD SAVED RESUMES
@frappe.whitelist()
def get_saved_resumes_by_user():
    """
    Return count and route to Resume list, based on resumes saved by the current user
    through Save Resume doctype.
    """
    current_user = frappe.session.user

    # Get all 'resume' IDs from Save Resume where user is current user
    saved_resumes = frappe.get_all(
        "Save Resume",
        filters={"user": current_user},
        fields=["resume"]
    )

    # Extract just the Resume IDs
    resume_ids = [r.resume for r in saved_resumes if r.resume]

    return {
        "value": len(resume_ids),  # Total resumes saved by user
        "fieldtype": "Int",
        "route": ["List", "Resume"],
        "route_options": {
            "name": ["in", resume_ids] if resume_ids else ["=", "none_found"]
        }
    }