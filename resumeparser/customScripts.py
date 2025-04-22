import frappe

@frappe.whitelist(allow=True)
def redirect_share_user():
    return {
	"value": 100,
	"fieldtype": "Currency",
	"route_options": {"from_date": "2023-05-23"},
	"route": ["query-report", "Permitted Documents For User"]
}