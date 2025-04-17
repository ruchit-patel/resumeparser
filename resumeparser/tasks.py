
import os
import frappe
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import json

PDF_DIRECTORY_PATH = frappe.get_doc("All Resume Location").folder_location

def logging(title,error):
    log = frappe.get_doc({
        "doctype": "Error Log",
        "method": title,
        "error":error
    })
    log.insert(ignore_permissions=True)
    frappe.db.commit()


def convert_docx_to_pdf(input_path, output_path):
    command = [
        "libreoffice", "--headless", "--convert-to", "pdf",
        input_path, "--outdir", os.path.dirname(output_path)
    ]
    
    try:
        subprocess.run(command, check=True)
        print(f"✅ Conversion completed. PDF saved at: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during conversion: {e}")
        raise  # Re-raise exception for further handling if necessary


def resume_scanner():
    processed_count = 0
    skipped_count = 0
    error_files = []

    # Step 1: Convert all .docx and .doc files to .pdf
    for filename in os.listdir(PDF_DIRECTORY_PATH):
        if filename.lower().endswith((".docx", ".doc")):  # Check for both .docx and .doc
            input_path = os.path.join(PDF_DIRECTORY_PATH, filename)
            output_pdf_path = os.path.join(PDF_DIRECTORY_PATH, filename.rsplit(".", 1)[0] + ".pdf")
            try:
                convert_docx_to_pdf(input_path, output_pdf_path)
            except Exception as e:
                print(f"❌ Error converting {filename} to PDF: {e}")
                logging("RESUME SCANNING  : Error converting file",str(e))
                error_files.append({"file": filename, "error": f"Conversion failed: {str(e)}","type":"convertion"})

    # Step 2: Process .pdf files and delete originals after processing
    for filename in os.listdir(PDF_DIRECTORY_PATH):
        if not filename.lower().endswith(".pdf"):
            continue

        if filename.startswith("processed_"):
            skipped_count += 1
            continue

        full_path = os.path.join(PDF_DIRECTORY_PATH, filename)

        try:
            with open(full_path, "rb") as f:
                filedata = f.read()

            uploaded_file = frappe.get_doc({
                "doctype": "File",
                "file_name": filename,
                "is_private": 1,
                "content": filedata
            })
            uploaded_file.save(ignore_permissions=True)

            resume_doc = frappe.get_doc({
                "doctype": "Resume",
                "resume_file": uploaded_file.file_url
            })
            resume_doc.insert(ignore_permissions=True)

            # Step 3: Rename and then delete .docx, .doc and unprocessed .pdf
            new_name = "processed_" + filename
            new_path = os.path.join(PDF_DIRECTORY_PATH, new_name)
            os.rename(full_path, new_path)
            print(f"✅ Processed: {filename}")
            processed_count += 1

            # Identify original .docx/.doc and delete
            original_filename = filename.rsplit(".", 1)[0]  # Get name without extension
            original_docx_path = os.path.join(PDF_DIRECTORY_PATH, original_filename + ".docx")
            original_doc_path = os.path.join(PDF_DIRECTORY_PATH, original_filename + ".doc")

            if os.path.exists(original_docx_path):
                os.remove(original_docx_path)
            elif os.path.exists(original_doc_path):  # If it's a .doc file
                os.remove(original_doc_path)
            # Delete the processed PDF as well
            if os.path.exists(full_path):
                os.remove(full_path)
        except Exception as e:
            logging(f"RESUME SCANNING  : Error in Scanning resume for {filename}",str(e))
            error_files.append({"file": filename, "error": str(e),"type":"scanning"})

    frappe.db.commit()

    data =  {
        "status": "completed",
        "processed": processed_count,
        "skipped": skipped_count,
        "errors": error_files,
        "total_files": processed_count + skipped_count + len(error_files)
    }
    logging(f"RESUME SCANNING  : Summy for batch scanning",str(json.dumps(data, indent=2)))
    return data



