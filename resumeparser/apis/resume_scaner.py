import os
import frappe
import shutil

PDF_DIRECTORY_PATH = "/home/jay/project/frappe-bench/resume_store"

@frappe.whitelist(allow_guest=True)
def upload_resumes_from_folder():
    processed_count = 0
    skipped_count = 0
    error_files = []

    for filename in os.listdir(PDF_DIRECTORY_PATH):
        if not filename.lower().endswith(".pdf"):
            continue

        if filename.startswith("processed_"):
            skipped_count += 1
            continue

        full_path = os.path.join(PDF_DIRECTORY_PATH, filename)

        try:
            # Read the PDF file
            with open(full_path, "rb") as f:
                filedata = f.read()

            # Save file in Frappe
            uploaded_file = frappe.get_doc({
                "doctype": "File",
                "file_name": filename,
                "is_private": 1,
                "content": filedata
            })
            uploaded_file.save(ignore_permissions=True)

            # Create Resume Doctype entry
            resume_doc = frappe.get_doc({
                "doctype": "Resume",
                "resume_file": uploaded_file.file_url
            })
            resume_doc.insert(ignore_permissions=True)

            # Rename the original file to mark as processed
            new_name = "processed_" + filename
            new_path = os.path.join(PDF_DIRECTORY_PATH, new_name)
            os.rename(full_path, new_path)

            print(f"✅ Processed: {filename}")
            processed_count += 1

        except Exception as e:
            print(f"❌ Error processing {filename}: {e}")
            error_files.append({"file": filename, "error": str(e)})

    frappe.db.commit()

    return {
        "status": "completed",
        "processed": processed_count,
        "skipped": skipped_count,
        "errors": error_files,
        "total_files": processed_count + skipped_count + len(error_files)
    }
