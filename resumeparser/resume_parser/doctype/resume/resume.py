# Copyright (c) 2025, Sayaji Infotech and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import os
import time
import google.genai as genai
import google.genai.types as types
import pathlib
import json
from opensearchpy import OpenSearch
from pathlib import Path

class Resume(Document):

	def validate(self):
		# Any validation logic if needed
		pass

	def get_opensearch_credentials(self):
		"""Get OpenSearch credentials from site config or environment variables"""
		return {
			'host': frappe.conf.get('opensearch_host') or os.environ.get('OPENSEARCH_HOST'),
			'port': frappe.conf.get('opensearch_port') or os.environ.get('OPENSEARCH_PORT') or 443,
			'username': frappe.conf.get('opensearch_username') or os.environ.get('OPENSEARCH_USERNAME'),
			'password': frappe.conf.get('opensearch_password') or os.environ.get('OPENSEARCH_PASSWORD')
		}

	def get_gemini_api_key(self):
		"""Get Gemini API key from site config or environment variables"""
		return frappe.conf.get('gemini_api_key') or os.environ.get('GEMINI_API_KEY')

	def before_insert(self):
		"""Extract resume data using Gemini API before inserting the document"""
		# Check if the file is public or private
		if self.resume_file.startswith("/private/"):
			# Handle private file (read directly from filesystem)
			file_path = frappe.get_site_path(self.resume_file.lstrip("/"))  # Full system path
		elif self.resume_file.startswith("/files/"):
			# Public file (can be accessed directly)
			file_path = frappe.get_site_path("public", self.resume_file.lstrip("/public/"))
		
		filepath = pathlib.Path(file_path)

		# Initialize Gemini client with API key from config
		api_key = self.get_gemini_api_key()
		if not api_key:
			frappe.throw('Gemini API key not configured. Please set it in site_config.json or environment variables.')
		client = genai.Client(api_key=api_key)

		prompt = """
			You are an AI assistant specializing in structured data extraction. Given a PDF resume, extract relevant information and return it as a structured JSON object. Follow the exact schema provided below. If certain details are missing, leave them as null or empty arrays but do not infer information. Ensure the extracted text retains proper formatting for addresses, descriptions, and long text fields.

			Extraction Guidelines
			Names & Contact Info: Extract names exactly as written. Validate email and phone numbers if possible.
			Gender: For gender, if not specified try to guess it from the name, or pronounces used in the resume. If you can't infer, set it to null.
			Education & Experience: Extract date ranges and convert them to the format YYYY-MM-DD. If the dates are incomplete and only month and year provided, round off the day to first day of that month. If only year is provided round of month and day to 1st Jan of that year. If you cant parse a date, then return null. If the candidate is still working at a company, set "current_position": true and "to": null. If "current_position" is false, extract the "to" date.
			Projects, Skills & Certifications: Ensure the skills are categorized correctly, and certifications include issue dates if available. Extract relevant projects, ensure descriptions are clean, and list all associated skills.
			Skills: Categorize them as Technical or Soft. and make sure they are unique.
			Accomplishments: If URLs are mentioned, include them; otherwise, leave them empty.
			Formatting: Maintain proper text case and avoid unwanted line breaks.

			{
				"candidate_name": "string",
				"date_of_birth": "YYYY-MM-DD",
				"address": "string",
				"gender": "Male | Female | Others",
				"mobile_number": "string",
				"email": "string",
				"city": "string",
				"education": [
					{
						"school_college_name": "string",
						"school_college_city": "string",
						"course_name": "string",
						"specialization": "string",
						"from": "YYYY-MM-DD",
						"to": "YYYY-MM-DD",
						"evaluation_score": "string"
					}
				],
				"experience": [
					{
						"company_name": "string",
						"role_position": "string",
						"from": "YYYY-MM-DD",
						"to": "YYYY-MM-DD | null",
						"current_position": true | false,
						"location": "string",
						"job_description": "string",
						"url": "string",
						"project_department": "string"
					}
				],
				"projects": [
					{
						"project_name": "string",
						"description": "string",
						"url": "string"
					}
				],
				"skills": [
					{
						"skill_name": "string",
						"skill_type": "Technical | Soft"
					}
				],
				"certificates": [
					{
						"certificate_name": "string",
						"provider": "string",
						"issue_date": "YYYY-MM-DD",
						"url": "string",
						"description": "string"
					}
				],
				"accomplishments": [
					{
						"accomplishment": "string",
						"when": "YYYY-MM-DD",
						"url": "string",
						"description": "string"
					}
				]
			}
			If you dont find any of the above fields in the resume, then return null or empty array for that field, even for the dates. Do not include any other information or explanation in the response. Just return the JSON object as per the schema provided above. Do not include any additional text or comments. The JSON should be valid and well-structured. If you encounter any errors while processing the resume, return an error message in the following format:
			{
				"error": "Error message here"
			}
			Extract and return the JSON in this exact format. Do not include additional information beyond what is specified.
		"""
		response = client.models.generate_content(
		model="gemini-1.5-flash-8b",
		contents=[
			types.Part.from_bytes(
				data=filepath.read_bytes(),
				mime_type='application/pdf',
			),
			prompt])
		print(response.text)
		# Remove unwanted characters from the response
		response_text = response.text.strip()

		# If it starts with "json\n", remove it
		if response_text.startswith("```json"):
			response_text = response_text[7:].strip()

		# If it ends with an extra bracket pattern, ensure it's cleaned up
		if response_text.endswith("```"):
			response_text = response_text[:-4].strip()

		try:
			data = json.loads(response_text)  # Convert to dictionary
			print("-------------------------------------------------")
			print(data)
			print("-------------------------------------------------")
			self.extracted_json = json.dumps(data, indent=4)  # Store as formatted JSON string
			self.candidate_name = data.get("candidate_name")
		except json.JSONDecodeError:
			frappe.throw("Invalid JSON response from Gemini API.")


	def after_insert(self):
		"""Update the resume fields in OpenSearch"""
		# Parse the JSON string back to dictionary
		data_dict = json.loads(self.extracted_json)
		result = self.update_resume_fields(data=data_dict, id=self.name)
		
		# If a duplicate was found, store the info for the frontend
		if result and result.get('status') == 'duplicate_found':
			self.duplicate_info = json.dumps(result, indent=4)
			self.save(ignore_permissions=True)

	def update_resume_fields(self, data, id):
		"""Update fields based on extracted LLM data after checking for duplicates"""
		client = self.get_opensearch_client()
		index_name = "resumes"

		# Normalize data before checking duplicates and indexing
		if data.get("email"):
			data["email"] = self.normalize_email(data["email"])
		if data.get("mobile_number"):
			data["mobile_number"] = self.normalize_mobile_number(data["mobile_number"])

		# Check for potential duplicates
		duplicate = self.check_duplicate_resume(client, data)
		if duplicate:
			# Instead of throwing error, return the duplicate info
			return {
				"status": "duplicate_found",
				"duplicate_id": duplicate,
				"data": data
			}

		# If no duplicate found, proceed with indexing
		response = client.index(index=index_name, body=data, id=id)
		frappe.logger().info(f"Stored in OpenSearch: {response}")
		return {"status": "success"}

	def normalize_mobile_number(self, number):
		"""Normalize mobile number by handling international formats and removing country codes"""
		if not number:
			return number

		# Remove all non-digit characters (spaces, dashes, plus, etc)
		number = ''.join(filter(str.isdigit, str(number)))

		# Common country code lengths are 1-3 digits
		# When prefixed with '00' or '0', they can be 2-5 digits
		# Examples:
		# USA: 1 or 001
		# UK: 44 or 0044
		# India: 91 or 0091
		# China: 86 or 0086
		# Australia: 61 or 0061
		
		# If number starts with '00', remove it
		if number.startswith('00'):
			number = number[2:]

		# If length > 10 and starts with common international prefix lengths
		if len(number) > 10:
			# Try removing 1-digit country code
			if len(number) == 11 and number.startswith(('1', '7')):
				number = number[1:]
			# Try removing 2-digit country code
			elif len(number) == 12 and number.startswith(('33', '44', '46', '61', '86', '91')):
				number = number[2:]
			# Try removing 3-digit country code
			elif len(number) == 13 and number.startswith(('852', '855', '880', '971')):
				number = number[3:]
			# If still longer than 10 digits, take last 10
			if len(number) > 10:
				number = number[-10:]

		return number

	def normalize_email(self, email):
		"""Normalize email by converting to lowercase and removing whitespace"""
		if not email:
			return email
		return email.lower().strip()

	def check_duplicate_resume(self, client, data):
		"""Check if a similar resume already exists in OpenSearch"""
		index_name = "resumes"
		
		# Build the search query for each field separately
		queries = []
		matching_fields = []

		# Check by name (using fuzzy match with keyword)
		if data.get("candidate_name"):
			queries.append({
				"query": {
					"fuzzy": {
						"candidate_name.keyword": {
							"value": data["candidate_name"],
							"fuzziness": "AUTO",
							"max_expansions": 50
						}
					}
				}
			})
			matching_fields.append("candidate_name")

		# Check by email (exact match using normalized value)
		if data.get("email"):
			normalized_email = self.normalize_email(data["email"])
			queries.append({
				"query": {
					"term": {
						"email.keyword": normalized_email
					}
				}
			})
			matching_fields.append("email")

		# Check by mobile number (exact match using normalized value)
		if data.get("mobile_number"):
			normalized_mobile = self.normalize_mobile_number(data["mobile_number"])
			queries.append({
				"query": {
					"term": {
						"mobile_number.keyword": normalized_mobile
					}
				}
			})
			matching_fields.append("mobile_number")

		# Check by date of birth (exact match)
		if data.get("date_of_birth"):
			queries.append({
				"query": {
					"term": {
						"date_of_birth": data["date_of_birth"]
					}
				}
			})
			matching_fields.append("date_of_birth")

		if not queries:
			return None

		try:
			# Check each field individually and count matches
			potential_duplicates = {}

			for query, field in zip(queries, matching_fields):
				response = client.search(index=index_name, body=query)
				hits = response.get("hits", {}).get("hits", [])

				for hit in hits:
					doc_id = hit["_id"]
					if doc_id not in potential_duplicates:
						potential_duplicates[doc_id] = {
							"count": 0,
							"fields": []
						}
					potential_duplicates[doc_id]["count"] += 1
					potential_duplicates[doc_id]["fields"].append(field)

			# Check for documents with at least 2 matching fields
			for doc_id, info in potential_duplicates.items():
				if info["count"] >= 2:
					matched_fields = ", ".join(info["fields"])
					# frappe.msgprint(
					# 	f"Duplicate detected! Matching fields: {matched_fields}",
					# 	indicator="red"
					# )
					return doc_id

			return None

		except Exception as e:
			frappe.log_error(f"Error checking for duplicate resume: {str(e)}")
			return None
	
	def get_opensearch_client(self):
		# Get credentials from config or environment
		creds = self.get_opensearch_credentials()

		client = OpenSearch(
			hosts=[{"host": creds['host'], "port": creds['port']}],
			http_auth=(creds['username'], creds['password']),  # Auth credentials
			use_ssl=True,  # Set to True if using HTTPS
			verify_certs=True,  # Set to False if using self-signed certs
			http_compress=True
		)
		return client

@frappe.whitelist()
def update_existing_resume(duplicate_id, new_data, name=None):
	"""Update an existing resume with new data and remove the duplicate entry"""
	try:
		# Convert new_data to dict if it's a string
		if isinstance(new_data, str):
			new_data = json.loads(new_data)

		# Get the existing resume
		existing_resume = frappe.get_doc("Resume", duplicate_id)
		
		# Update the Frappe document
		existing_resume.extracted_json = json.dumps(new_data, indent=4)
		existing_resume.save()
		
		# Update OpenSearch index
		client = existing_resume.get_opensearch_client()
		index_name = "resumes"
		
		# Update the document in OpenSearch
		response = client.index(index=index_name, body=new_data, id=duplicate_id)
		frappe.logger().info(f"Updated existing resume in OpenSearch: {response}")
		
		# Delete the duplicate document using the provided name
		if name:
			frappe.delete_doc("Resume", name, force=1)
		
		return {"status": "success", "message": "Resume updated and duplicate removed"}
		
	except Exception as e:
		frappe.log_error(f"Error updating existing resume: {str(e)}")
		frappe.throw("Failed to update existing resume")

@frappe.whitelist()
def suggest_keywords(search_text):
    """Suggest keywords based on user input by searching through resumes.
    Returns suggestions for skills, designations, and companies."""
    try:
        # Initialize OpenSearch client
        resume = frappe.new_doc("Resume")
        client = resume.get_opensearch_client()
        index_name = "resumes"

        # First, let's check what's in the index
        debug_query = {
            "size": 1,
            "query": {
                "match_all": {}
            }
        }
        debug_response = client.search(index=index_name, body=debug_query)
        frappe.logger().debug(f"Sample document from index: {debug_response}")

        # Build the search query
        query = {
            "size": 0,
            "query": {
                "bool": {
                    "should": [
                        {
                            "match_phrase_prefix": {
                                "skills.skill_name": {
                                    "query": search_text,
                                    "boost": 3
                                }
                            }
                        },
                        {
                            "match": {
                                "skills.skill_name": {
                                    "query": search_text,
                                    "fuzziness": "AUTO",
                                    "boost": 2
                                }
                            }
                        },
                        {
                            "nested": {
                                "path": "experience",
                                "query": {
                                    "match_phrase_prefix": {
                                        "experience.role_position": {
                                            "query": search_text,
                                            "boost": 2
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
                                            "query": search_text,
                                            "boost": 2
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "skills": {
                    "terms": {
                        "field": "skills.skill_name.keyword",
                        "size": 5,
                        "min_doc_count": 1
                    }
                },
                "designations": {
                    "nested": {
                        "path": "experience"
                    },
                    "aggs": {
                        "position_names": {
                            "terms": {
                                "field": "experience.role_position.keyword",
                                "size": 5,
                                "min_doc_count": 1
                            }
                        }
                    }
                },
                "companies": {
                    "nested": {
                        "path": "experience"
                    },
                    "aggs": {
                        "company_names": {
                            "terms": {
                                "field": "experience.company_name.keyword",
                                "size": 5,
                                "min_doc_count": 1
                            }
                        }
                    }
                }
            }
        }

        # Execute the search
        response = client.search(index=index_name, body=query)

        # Extract suggestions from aggregations
        suggestions = {
            "skills": [bucket["key"] for bucket in response["aggregations"]["skills"]["buckets"]],
            "designations": [bucket["key"] for bucket in response["aggregations"]["designations"]["position_names"]["buckets"]],
            "companies": [bucket["key"] for bucket in response["aggregations"]["companies"]["company_names"]["buckets"]]
        }

        return {"status": "success", "suggestions": suggestions}

    except Exception as e:
        frappe.log_error(f"Error suggesting keywords: {str(e)}")
        return {"status": "error", "message": str(e)}
