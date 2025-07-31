import frappe
from frappe.model.document import Document

class Assessement(Document):
	def before_insert(self):
		if not self.candidate:
			frappe.logger().info("No candidate ID found.")
			return

		client = frappe.new_doc("Resume").get_opensearch_client()
		try:
			existing_response = client.get(index="resumes", id=self.candidate)
			candidate_data = existing_response['_source']
		except Exception as e:
			frappe.logger().error(f"Could not fetch existing data for candidate {self.candidate}: {str(e)}")
			return

		try:
			# Ensure lists exist
			if 'certificates' not in candidate_data or not isinstance(candidate_data['certificates'], list):
				candidate_data['certificates'] = []
			if 'accomplishments' not in candidate_data or not isinstance(candidate_data['accomplishments'], list):
				candidate_data['accomplishments'] = []

			if self.awards_recognitions_and_certifications:
				for item_row in self.awards_recognitions_and_certifications:
					item_type = (item_row.get('type') or '').lower()
					notes = item_row.get('notes', '').strip()
					issue_date = item_row.get('issue')
					print(item_type,notes,notes)
					if not notes:
						continue  # skip empty notes

					if 'certificates' in item_type or 'certificates' in item_type:
						certificate = {
							"certificate_name": notes,
							"provider": "Assessment Entry",
							"issue_date": str(issue_date) if issue_date else None,
							"description": f"Added via Assessment - Type: {item_row.get('type', '')}",
							"url": None
						}
						candidate_data['certificates'].append(certificate)
					else:
						accomplishment = {
							"accomplishment": f"{item_row.get('type', 'Achievement')}: {notes}",
							"description": "Added via Assessment",
							"when": str(issue_date) if issue_date else None,
							"url": None
						}
						candidate_data['accomplishments'].append(accomplishment)
			print("-----------------------")
			print(self.gender,self.diversity_flag)
			if self.gender:
				candidate_data["gender"] =  self.gender

			if self.gender == "Other" or  self.diversity_flag:
				candidate_data["category"] =  self.diversity_flag

			if self.total_experience:
				candidate_data["total_experience"] =  self.total_experience


			if self.location:
				candidate_data["city"] =  self.location

			if self.notice_period:
				candidate_data["notice_period"] =  self.notice_period
			
			self.updated_by = frappe.session.user
			candidate_data["updated_by"] = frappe.session.user 
			candidate_data["updated_at"] = frappe.utils.now()
			# ✅ Now update OpenSearch
			update_response = client.update(
				index="resumes",
				id=self.candidate,
				body={"doc": candidate_data}
			)
			frappe.logger().info(f"✅ Successfully updated OpenSearch for candidate {self.candidate}")
			return update_response

		except Exception as e:
			frappe.logger().error(f"❌ Error updating OpenSearch: {str(e)}")
			return
