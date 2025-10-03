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
		# Try to get from site config first
		host = os.environ.get('OPENSEARCH_HOST') or frappe.conf.get('opensearch_host')
		port = os.environ.get('OPENSEARCH_PORT') or frappe.conf.get('opensearch_port')
		password = os.environ.get('OPENSEARCH_PASSWORD') or frappe.conf.get('opensearch_password')

		frappe.logger().debug(f"OpenSearch connection details - Host: {host}, Port: {port}")

		return {
			'host': host,
			'port': port,
			'password': password
		}

	def get_gemini_api_key(self):
		"""Get Gemini API key from site config or environment variables"""
		return frappe.conf.get('gemini_api_key')
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
			You are an AI assistant specialized in extracting structured information from resumes. Given a scanned or digital resume, extract the data into a structured JSON object strictly following the schema below. Use the provided resume content to fill fields with direct information. For missing fields, intelligently infer values using strong contextual clues from the resume content. If inference is not possible with high confidence, leave the field as null or an empty array. Do not include any explanation or additional text.
			Advanced Extraction Rules:
			Name & Contact Information: Extract the full name, email, and mobile number exactly as they appear. Validate formats where possible.
			Gender: Predict the gender as "Male", "Female", or "Other" using the full name and contextual resume content.
			Date of Birth & Age: If the date of birth is available, use it to calculate the age by comparing it with today's date. If only the age is available, extract it directly. If neither is found, set both as null.
			Department : Look into the given resume content carefully and based on the candidate’s role, experience, skills, and context, return one most relevant department. The department must always be provided — it is mandatory. Do not leave it blank, null, or respond with 'unsure'. Even if uncertain, choose the closest reasonable department based on available information.
			Total Experience: Calculate the total experience in years by summing all the durations from the experience entries. If a job is marked as current using keywords like "Present", "Currently Working", "-", "Ongoing", etc., use the current date as the end date to compute the duration.
			Current Position: If the candidate is currently working somewhere, set current_position = true and "to": null in that entry.
			Role: Determine the most recent role or position title from the latest job experience and use it as the candidate's primary role.
			Address & City: If the address is partially mentioned, extract the city from any part of the resume and include it in both the city and address fields where appropriate.
			Current Location: Always fill this field with the candidate’s most recent location from their latest job or address or City.
			Education & Dates: For all date fields (education dates, experience dates, etc):
			- If exact date is known, use YYYY-MM-DD format
			- If only month and year are known, use YYYY-MM-01 format
			- If only year is known, use YYYY-01-01 format
			- If date is uncertain or unknown, use null instead of placeholder dates
			- NEVER use 'X' or other placeholder characters in dates
			Skills: Extract unique skills and categorize them as either "Technical" or "Soft".
			Certificates, Projects, Accomplishments: Clean and extract descriptions, include relevant URLs and issue dates where mentioned.
			Return Format: Return the extracted data strictly in the following JSON format:
			{
				"candidate_name": "string",
				"date_of_birth": "YYYY-MM-DD",
				"address": "string",
				"gender": "Male | Female | Others",
				"mobile_number": "string",
				"email": "string",
				"city": "string",
				"current_location": "string",
				"age": numeric,
				"industry": "Information Technology (IT)" | "Finance & Banking" | "Healthcare & Pharmaceuticals" | "Manufacturing & Industrial Production" | "Retail & E-commerce" | "Education & E-Learning" | "Telecommunications & Media" | "Hospitality & Tourism" | "Energy & Utilities" | "Transportation & Logistics" | "Real Estate & Construction" | "Agriculture & Agribusiness" | "Automotive & Aerospace" | "Consumer Goods & Services" | "Entertainment & Leisure" | "Legal & Compliance" | "Insurance & Risk Management" | "Mining & Natural Resources" | "Professional Services" | "Public Sector & Government" | "Technology Hardware & Equipment" | "Semiconductors & Electronics" | "Renewable Energy & Sustainability" | "Cybersecurity & Data Privacy" | "Artificial Intelligence & Machine Learning" | "Blockchain & Fintech" | "Sports & Recreation" | "Art & Culture" | "Nonprofit & Social Impact"
				"department": "string",
				"total_experience": numeric,
				"role": "string",
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
		If any error occurs during extraction, return the response in the following format:
			{
			"error": "Error message here"
			}
		Important: Do not infer or assume values unless strong textual or contextual evidence is found. Do not include any additional text or explanation outside the JSON response. The output should be a valid JSON object only.
		"""
		max_retries = 3
		attempt = 0
		success = False

		while attempt < max_retries and not success:
			try:
				response = client.models.generate_content(
					model="gemini-2.5-flash",
					contents=[
						types.Part.from_bytes(
							data=filepath.read_bytes(),
							mime_type='application/pdf',
						),
						prompt
					]
				)
				print(response.text)
				success = True  # Exit the loop if successful

			except Exception as e:
				attempt += 1
				if attempt == max_retries:
					log = frappe.get_doc({
						"doctype": "Error Log",
						"method": f"Gemini API call Error Attempt :{attempt}",
						"error": str(e)
					})
					log.insert(ignore_permissions=True)
					frappe.db.commit()
					frappe.throw(f"Error during Gemini API call after {max_retries} attempts: {str(e)}")
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
			self.extracted_json = json.dumps(data, indent=4)
			self.candidate_name = data.get("candidate_name")

		except Exception as e:
			frappe.throw(f"Error parsing Gemini API response: {str(e)}")
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

	def clean_date_field(self, date_str):
		"""Clean and validate date strings before sending to OpenSearch"""
		if not date_str:
			return None
		
		# Remove any 'X' characters and replace with '0'
		if 'X' in date_str:
			return None  # Return None for invalid dates with 'X'
		
		try:
			# Basic date format validation (YYYY-MM-DD)
			parts = date_str.split('-')
			if len(parts) != 3:
				return None
			
			year, month, day = parts
			if not (year.isdigit() and month.isdigit() and day.isdigit()):
				return None
			
			if not (len(year) == 4 and len(month) == 2 and len(day) == 2):
				return None
			
			return date_str
		except:
			return None

	def update_resume_fields(self, data, id):
		"""Update fields based on extracted LLM data after checking for duplicates"""
		client = self.get_opensearch_client()
		index_name = "resumes"

		# Clean and validate date fields
		if "education" in data and isinstance(data["education"], list):
			for edu in data["education"]:
				if "from" in edu:
					edu["from"] = self.clean_date_field(edu["from"])
				if "to" in edu:
					edu["to"] = self.clean_date_field(edu["to"])
				
		if "experience" in data and isinstance(data["experience"], list):
			for exp in data["experience"]:
				if "from" in exp:
					exp["from"] = self.clean_date_field(exp["from"])
				if "to" in exp:
					exp["to"] = self.clean_date_field(exp["to"])
				
		if "certificates" in data and isinstance(data["certificates"], list):
			for cert in data["certificates"]:
				if "issue_date" in cert:
					cert["issue_date"] = self.clean_date_field(cert["issue_date"])
				
		if "accomplishments" in data and isinstance(data["accomplishments"], list):
			for acc in data["accomplishments"]:
				if "when" in acc:
					acc["when"] = self.clean_date_field(acc["when"])

		# Normalize data before checking duplicates and indexing
		if data.get("email"):
			data["email"] = self.normalize_email(data["email"])
		if data.get("mobile_number"):
			data["mobile_number"] = self.normalize_mobile_number(data["mobile_number"])

		# Check for potential duplicates
		# duplicate = self.check_duplicate_resume(client, data)
		# if duplicate:
		# 	# Instead of throwing error, return the duplicate info
		# 	return {
		# 		"status": "duplicate_found",
		# 		"duplicate_id": duplicate,
		# 		"data": data
		# 	}
		
		# Update Department on vector index
		if "department" in data and data["department"]:
			department = data["department"]
			search_query = {
				"size": 1,
				"_source": ["title", "content"],
				"query": {
					"bool": {
						"should": [
							{ "match": { "title": department } },
							{ "match": { "content": department } }
						]
					}
				}
			}

			search_response = client.search(index="my-vector-index", body=search_query)
			hits = search_response.get("hits", {}).get("hits", [])
			vector_department = hits[0]["_source"]["title"] if hits else None
			vector_content = hits[0]["_source"]["content"] if hits else None
			data["department"] = [{"department" :vector_department,"role" :vector_content , "fullString": f"{vector_content} - {vector_department}"}]
			frappe.logger().info(f"Department to be indexed: {department}")

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

		try:
			client = OpenSearch(
				hosts=[{"host": creds.get("host"), "port": int(creds.get("port"))}],
				http_auth=("admin", creds.get("password")),
				use_ssl=True,
				verify_certs=False
			)


			# Test the connection
			client.info()
			return client
			
		except Exception as e:
			frappe.logger().error(f"Failed to connect to OpenSearch: {str(e)}")
			raise

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
