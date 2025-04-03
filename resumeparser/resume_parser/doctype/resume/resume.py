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

class Resume(Document):

	def validate(self):
		client = genai.Client(api_key='AIzaSyDqcrnNO8isKSPEAQxfGvDKqPeGzEonB-4')
		    # Check if the file is public or private
		if self.resume_file.startswith("/private/"):
            # Handle private file (read directly from filesystem)
			file_path = frappe.get_site_path(self.resume_file.lstrip("/"))  # Full system path
		elif self.resume_file.startswith("/files/"):
            # Public file (can be accessed directly)
			file_path = frappe.get_site_path("public", self.resume_file.lstrip("/public/"))
		
		filepath = pathlib.Path(file_path)

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
			self.extracted_json = data  # Store as JSON string
		except json.JSONDecodeError:
			frappe.throw("Invalid JSON response from Gemini API.")

		#self.update_resume_fields(data)
		#self.save()

	def after_insert(self):
		"""Update the resume fields in OpenSearch"""
		self.update_resume_fields(data=self.extracted_json, id=self.name)

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
			frappe.throw(f"Potential duplicate resume found with ID: {duplicate}. Resume not indexed.")

		response = client.index(index=index_name, body=data, id=id)
		frappe.logger().info(f"Stored in OpenSearch: {response}")

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
					frappe.msgprint(
						f"Duplicate detected! Matching fields: {matched_fields}",
						indicator="red"
					)
					return doc_id

			return None

		except Exception as e:
			frappe.log_error(f"Error checking for duplicate resume: {str(e)}")
			return None
	
	def get_opensearch_client(self):
		host = "search-sayajicluster-pnjcmwlww5nb327dwfbmebdtze.ap-south-1.es.amazonaws.com"  # or Docker container IP
		port = 443
		username = "admin"  # Replace with your username
		password = "Lolpass@123"  # Replace with your password

		client = OpenSearch(
			hosts=[{"host": host, "port": port}],
			http_auth=(username, password),  # Auth credentials
			use_ssl=True,  # Set to True if using HTTPS
			verify_certs=True,  # Set to False if using self-signed certs
			http_compress=True
		)
		return client