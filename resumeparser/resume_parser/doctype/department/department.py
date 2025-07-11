import frappe
from frappe.model.document import Document

class Department(Document):
    def before_insert(self):
        if not self.title and not self.category:
            frappe.throw("Title cannot be empty")
            
        if frappe.db.exists("Department", {"title": self.title},{"category": self.category}):
            frappe.throw(f"Department with title '{self.title}' already exists")

        client = frappe.new_doc("Resume").get_opensearch_client()

        doc = {"title": self.title,"content": self.category}
        response = client.index(
            index="my-vector-index",
            body=doc,
            params={"pipeline": "text-embedding-pipeline"}
        )

        # Show success message but allow insert to continue
        frappe.msgprint("Title added to vector index successfully")
