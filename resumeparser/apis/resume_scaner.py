import frappe
from pathlib import Path
import shutil
from datetime import datetime
import os

# ✅ Global variable for the PDF directory path
PDF_DIRECTORY_PATH = "/home/jay/project/frappe-bench/resume_store"  # <-- Replace with your actual path

def create_resume_doctype(pdf_path, processed_name):
    try:
        new_resume = frappe.new_doc("Resume")

        file_content = pdf_path.read_bytes()
        file_url = f"/resume_store/{processed_name}"

        file_doc = frappe.get_doc({
            "doctype": "File",
            "file_name": processed_name,
            "file_url": file_url,
            "attached_to_doctype": "Resume",
            "attached_to_name": new_resume.name,
            "content": file_content,
            "is_private": 0
        })
        file_doc.insert()
        new_resume.resume_file = file_url
        new_resume.insert()
        return True, None
    except Exception as e:
        return False, str(e)

@frappe.whitelist(allow_guest=True)
def scan_resumes_from_directory():
    try:
        # Use global directory path
        directory_path = PDF_DIRECTORY_PATH
        print(f"\nChecking directory: {directory_path}")

        os.makedirs(directory_path, exist_ok=True)
        dir_path = Path(directory_path)

        all_files = list(dir_path.glob("*"))
        print(f"All files in directory: {[f.name for f in all_files]}")

        pdf_files = [f for f in all_files 
                     if f.suffix.lower() == '.pdf' 
                     and not f.name.startswith("processed_")]
        print(f"PDF files found: {[f.name for f in pdf_files]}")

        for file in all_files:
            if not file.name.startswith("processed_"):
                print(f"File: {file.name}, Extension: {file.suffix.lower()}")

        existing_files = frappe.get_all(
            "Resume",
            filters={},
            fields=["resume_file"]
        )
        existing_filenames = {Path(f.resume_file).name.replace("processed_", "") for f in existing_files}

        results = {
            "total_files": len(pdf_files),
            "new_files": 0,
            "skipped_files": 0,
            "errors": [],
            "processed_details": []
        }

        print(f"\nFound {len(pdf_files)} PDF files in {directory_path}\n")

        for pdf_file in pdf_files:
            try:
                if pdf_file.name in existing_filenames:
                    results["skipped_files"] += 1
                    print(f"Skipping {pdf_file.name} - Already processed")
                    continue

                print(f"Processing new file: {pdf_file.name}")

                processed_name = f"processed_{pdf_file.name}"
                processed_path = pdf_file.parent / processed_name

                shutil.move(str(pdf_file), str(processed_path))

                success, error = create_resume_doctype(processed_path, processed_name)

                if success:
                    results["new_files"] += 1
                    results["processed_details"].append({
                        "file": pdf_file.name,
                        "status": "Successfully processed"
                    })
                    print(f"Successfully processed: {pdf_file.name}")
                else:
                    shutil.move(str(processed_path), str(pdf_file))
                    raise Exception(error)

            except Exception as e:
                print(f"Error processing {pdf_file.name}: {str(e)}")
                results["errors"].append({
                    "file": pdf_file.name,
                    "error": str(e)
                })

        print(f"\nProcessing Summary:")
        print(f"Total PDF files found: {results['total_files']}")
        print(f"New files processed: {results['new_files']}")
        print(f"Files skipped: {results['skipped_files']}")
        print(f"Errors encountered: {len(results['errors'])}\n")

        return results

    except Exception as e:
        error_msg = f"Error scanning resumes: {str(e)}"
        print(f"\nError: {error_msg}")
        frappe.log_error(error_msg)
        frappe.throw(error_msg)
