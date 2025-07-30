import frappe
from frappe.model.document import Document
import json
import traceback
from datetime import datetime

class Assessement(Document):
    def before_insert(self):
        """
        Main method called before inserting assessment document
        """
        try:
            self.log_info("Starting assessment processing...")
            
            # Validate required fields
            if not self.candidate:
                raise ValueError("Candidate field is required")
            
            # Process the assessment data
            self.process_assessment_data()
            
            self.log_success("Assessment processing completed successfully")
            
        except Exception as e:
            self.handle_error("before_insert", e)
            # Don't prevent assessment from being saved
            pass

    def process_assessment_data(self):
        """
        Main processing method for assessment data
        """
        try:
            candidate = self.candidate
            
            # Extract and clean data
            relevant_exp_dicts = self.extract_relevant_experience()
            awards_certs_dicts = self.extract_awards_certifications()
            
            self.log_info(f"Processing candidate: {candidate}")
            self.log_info(f"Relevant Experience entries: {len(relevant_exp_dicts)}")
            self.log_info(f"Awards & Certifications entries: {len(awards_certs_dicts)}")
            
            # Print to console for debugging
            print("=" * 50)
            print(f"ASSESSMENT PROCESSING - {datetime.now()}")
            print(f"Candidate: {candidate}")
            print(f"Relevant Experience: {relevant_exp_dicts}")
            print(f"Awards & Certifications: {awards_certs_dicts}")
            print("=" * 50)
            
            # Update OpenSearch if there's data to update
            if awards_certs_dicts or relevant_exp_dicts:
                self.update_opensearch_data(candidate, relevant_exp_dicts, awards_certs_dicts)
            else:
                self.log_info("No awards/certifications or relevant experience to update")
                
        except Exception as e:
            self.handle_error("process_assessment_data", e)
            raise

    def extract_relevant_experience(self):
        """
        Extract and clean relevant experience data
        """
        try:
            if not self.relevant_experience:
                return []
                
            relevant_exp_dicts = []
            for row in self.relevant_experience:
                cleaned_data = self.clean_child_table_data(row.as_dict())
                if cleaned_data.get('title') or cleaned_data.get('experience') or cleaned_data.get('note'):
                    relevant_exp_dicts.append(cleaned_data)
                    
            self.log_info(f"Extracted {len(relevant_exp_dicts)} relevant experience entries")
            return relevant_exp_dicts
            
        except Exception as e:
            self.handle_error("extract_relevant_experience", e)
            return []

    def extract_awards_certifications(self):
        """
        Extract and clean awards and certifications data
        """
        try:
            if not self.awards_recognitions_and_certifications:
                return []
                
            awards_certs_dicts = []
            for row in self.awards_recognitions_and_certifications:
                cleaned_data = self.clean_child_table_data(row.as_dict())
                if cleaned_data.get('notes') or cleaned_data.get('type'):
                    awards_certs_dicts.append(cleaned_data)
                    
            self.log_info(f"Extracted {len(awards_certs_dicts)} awards/certifications entries")
            return awards_certs_dicts
            
        except Exception as e:
            self.handle_error("extract_awards_certifications", e)
            return []

    def clean_child_table_data(self, data_dict):
        """
        Clean child table data by removing Frappe-specific fields
        """
        try:
            fields_to_remove = [
                'name', 'owner', 'creation', 'modified', 'modified_by', 
                'docstatus', 'idx', 'parent', 'parentfield', 'parenttype', 
                'doctype', '__islocal', '__unsaved'
            ]
            
            cleaned_dict = {}
            for key, value in data_dict.items():
                if key not in fields_to_remove and value is not None:
                    cleaned_dict[key] = value
                    
            return cleaned_dict
            
        except Exception as e:
            self.handle_error("clean_child_table_data", e)
            return data_dict

    def update_opensearch_data(self, candidate, relevant_exp_dicts, awards_certs_dicts):
        """
        Update OpenSearch with assessment data
        """
        client = None
        try:
            self.log_info("Connecting to OpenSearch...")
            
            # Get OpenSearch client
            client = frappe.new_doc("Resume").get_opensearch_client()
            if not client:
                raise Exception("Failed to get OpenSearch client")
                
            self.log_info("Successfully connected to OpenSearch")
            
            # Fetch existing candidate data
            existing_data = self.fetch_existing_candidate_data(client, candidate)
            if not existing_data:
                raise Exception(f"Could not fetch existing data for candidate: {candidate}")
            
            # Process and merge data
            updated_data = self.merge_assessment_data(existing_data, relevant_exp_dicts, awards_certs_dicts)
            
            # Update OpenSearch
            response = client.update(
                index="resumes",
                id=candidate,
                body={"doc": updated_data}
            )
            
            self.log_success(f"OpenSearch updated successfully for candidate: {candidate}")
            self.log_info(f"OpenSearch response: {response}")
            
            # Print success to console
            print(f"✅ SUCCESS: OpenSearch updated for candidate {candidate}")
            
            return response
            
        except Exception as e:
            self.handle_error("update_opensearch_data", e, f"Candidate: {candidate}")
            raise

    def fetch_existing_candidate_data(self, client, candidate):
        """
        Fetch existing candidate data from OpenSearch
        """
        try:
            self.log_info(f"Fetching existing data for candidate: {candidate}")
            
            existing_response = client.get(index="resumes", id=candidate)
            candidate_data = existing_response.get('_source', {})
            
            if not candidate_data:
                raise Exception("No existing candidate data found")
                
            self.log_info("Successfully fetched existing candidate data")
            return candidate_data
            
        except Exception as e:
            error_msg = f"Failed to fetch existing data for candidate {candidate}: {str(e)}"
            self.handle_error("fetch_existing_candidate_data", e, error_msg)
            return None

    def merge_assessment_data(self, candidate_data, relevant_exp_dicts, awards_certs_dicts):
        """
        Merge assessment data with existing candidate data
        """
        try:
            self.log_info("Starting data merge process...")
            
            # Initialize arrays if they don't exist
            if 'certificates' not in candidate_data:
                candidate_data['certificates'] = []
            if 'accomplishments' not in candidate_data:
                candidate_data['accomplishments'] = []
            if 'assessment_data' not in candidate_data:
                candidate_data['assessment_data'] = {}
            
            # Process awards and certifications
            certificates_added, accomplishments_added = self.process_awards_and_certifications(
                candidate_data, awards_certs_dicts
            )
            
            # Process relevant experience
            exp_added = self.process_relevant_experience(candidate_data, relevant_exp_dicts)
            
            # Add assessment metadata
            self.add_assessment_metadata(candidate_data)
            
            self.log_info(f"Data merge completed - Certificates added: {certificates_added}, "
                         f"Accomplishments added: {accomplishments_added}, "
                         f"Relevant experience added: {exp_added}")
            
            return candidate_data
            
        except Exception as e:
            self.handle_error("merge_assessment_data", e)
            raise

    def process_awards_and_certifications(self, candidate_data, awards_certs_dicts):
        """
        Process and append awards and certifications
        """
        certificates_added = 0
        accomplishments_added = 0
        
        try:
            for item in awards_certs_dicts:
                item_type = (item.get('type') or '').lower()
                notes = item.get('notes', '').strip()
                issue_date = item.get('issue')
                
                if not notes:
                    continue
                    
                if 'certificate' in item_type or 'certification' in item_type:
                    # Add to certificates
                    certificate = {
                        "certificate_name": notes,
                        "provider": "Assessment Entry",
                        "issue_date": str(issue_date) if issue_date else None,
                        "description": f"Added via Assessment - Type: {item.get('type', '')}",
                        "url": None
                    }
                    candidate_data['certificates'].append(certificate)
                    certificates_added += 1
                    
                else:
                    # Add to accomplishments (awards, recognition, etc.)
                    accomplishment = {
                        "accomplishment": f"{item.get('type', 'Achievement')}: {notes}",
                        "description": "Added via Assessment",
                        "when": str(issue_date) if issue_date else None,
                        "url": None
                    }
                    candidate_data['accomplishments'].append(accomplishment)
                    accomplishments_added += 1
                    
            self.log_info(f"Processed awards/certifications - Certificates: {certificates_added}, "
                         f"Accomplishments: {accomplishments_added}")
            
            return certificates_added, accomplishments_added
            
        except Exception as e:
            self.handle_error("process_awards_and_certifications", e)
            return 0, 0

    def process_relevant_experience(self, candidate_data, relevant_exp_dicts):
        """
        Process and add relevant experience
        """
        exp_added = 0
        
        try:
            candidate_data['assessment_data']['relevant_experience'] = []
            
            for exp in relevant_exp_dicts:
                if exp.get('title') or exp.get('experience') or exp.get('note'):
                    relevant_exp = {
                        "title": exp.get('title'),
                        "experience_years": exp.get('experience', 0),
                        "notes": exp.get('note'),
                        "added_via": "Assessment",
                        "added_on": str(datetime.now())
                    }
                    candidate_data['assessment_data']['relevant_experience'].append(relevant_exp)
                    exp_added += 1
                    
            self.log_info(f"Processed relevant experience - Entries added: {exp_added}")
            return exp_added
            
        except Exception as e:
            self.handle_error("process_relevant_experience", e)
            return 0

    def add_assessment_metadata(self, candidate_data):
        """
        Add assessment metadata to candidate data
        """
        try:
            assessment_mapping = {
                'assessment_date': str(datetime.now()),
                'assessed_by': self.updated_by or frappe.session.user,
                'total_experience': self.total_experience,
                'current_organization': self.current_organization,
                'gender': self.gender,
                'diversity_flag': self.diversity_flag,
                'any_disabilities': self.any_disabilities,
                'reporting_to': self.reporting_to,
                'team_size_managed': self.team_size_managed,
                'reason_for_change': self.reason_for_change,
                'notice_period': self.notice_period,
                'current_compensation': self.current_compensation,
                'expected_compensation': self.expected_compensation,
                'fitment_to_the_role': self.fitment_to_the_role,
                'confirmation_docs': self.confirmation,
                'location': self.location,
                'willingness_to_relocate': self.willingness_to_relocate
            }
            
            # Only add non-empty values
            fields_added = 0
            for key, value in assessment_mapping.items():
                if value is not None and value != '' and value != 0:
                    candidate_data['assessment_data'][key] = value
                    fields_added += 1
                    
            self.log_info(f"Added assessment metadata - Fields added: {fields_added}")
            
        except Exception as e:
            self.handle_error("add_assessment_metadata", e)

    def log_info(self, message):
        """
        Log info message to both console and Frappe logs
        """
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            console_msg = f"[{timestamp}] INFO: {message}"
            print(console_msg)
            frappe.log_error(message, "Assessment Info")
        except:
            pass

    def log_success(self, message):
        """
        Log success message to both console and Frappe logs
        """
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            console_msg = f"[{timestamp}] ✅ SUCCESS: {message}"
            print(console_msg)
            frappe.log_error(f"SUCCESS: {message}", "Assessment Success")
        except:
            pass

    def handle_error(self, method_name, error, additional_info=""):
        """
        Comprehensive error handling with logging to both console and Frappe logs
        """
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            error_message = str(error)
            stack_trace = traceback.format_exc()
            
            # Create detailed error message
            detailed_error = f"""
Assessment Error in {method_name}:
Candidate: {getattr(self, 'candidate', 'Unknown')}
Error: {error_message}
Additional Info: {additional_info}
Stack Trace: {stack_trace}
Timestamp: {timestamp}
            """.strip()
            
            # Log to console with color coding
            console_error = f"""
{'='*60}
[{timestamp}] ❌ ERROR in {method_name}
Candidate: {getattr(self, 'candidate', 'Unknown')}
Error: {error_message}
{additional_info if additional_info else ''}
{'='*60}
Stack Trace:
{stack_trace}
{'='*60}
            """
            
            print(console_error)
            
            # Log to Frappe error log
            frappe.log_error(detailed_error, f"Assessment Error - {method_name}")
            
            # Also log to a specific assessment error log
            frappe.log_error(detailed_error, "Assessment Processing Error")
            
        except Exception as logging_error:
            # Fallback error logging
            print(f"CRITICAL: Error in error handling: {str(logging_error)}")
            print(f"Original error: {str(error)}")
            try:
                frappe.log_error(f"Error in error handling: {str(logging_error)}\nOriginal error: {str(error)}", "Assessment Critical Error")
            except:
                pass