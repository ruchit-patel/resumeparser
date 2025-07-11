import frappe


@frappe.whitelist(allow_guest=True)
def add_closet_match_department_vector(department=None):
    """
    Add department vector only if not already present.
    """
    client = frappe.new_doc("Resume").get_opensearch_client()

    title_text = "Test By Jay Patel"

    # Step 1: Search for existing document with same title
    search_query = {
        "query": {
            "match": {
                "title": title_text
            }
        }
    }

    search_response = client.search(index="my-vector-index", body=search_query)
    hits = search_response.get("hits", {}).get("hits", [])

    if hits:
        # Document with same title already exists
        return "already_exists"

    # Step 2: If not exists, insert using pipeline
    doc = {"title": title_text}
    response = client.index(
        index="my-vector-index",
        body=doc,
        params={"pipeline": "text-embedding-pipeline"}
    )

    return response.get("result", None)

   

@frappe.whitelist(allow_guest=True)
def get_closest_match_department_vector(department):
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
        client = frappe.new_doc("Resume").get_opensearch_client()
        search_response = client.search(index="my-vector-index", body=search_query)
        hits = search_response.get("hits", {}).get("hits", [])
        return hits