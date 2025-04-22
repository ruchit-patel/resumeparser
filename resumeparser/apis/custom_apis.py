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