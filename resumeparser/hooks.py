app_name = "resumeparser"
app_title = "Resume Parser"
app_publisher = "Sayaji Infotech"
app_description = "Parse and search on resumes"
app_email = "office@sayajiinfotech.com"
app_license = "mit"


fixtures = [
    {"doctype": "Workspace", "filters": [["module", "=", "Resume Parser"]]},
    {"doctype": "Number Card", "filters": [["module", "=", "Resume Parser"]]},
    {"doctype": "Locations"},
    {"doctype":"Custom HTML Block"}
]


# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "resumeparser",
# 		"logo": "/assets/resumeparser/logo.png",
# 		"title": "Resume Parser",
# 		"route": "/resumeparser",
# 		"has_permission": "resumeparser.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/resumeparser/css/resumeparser.css"
# app_include_js = "/assets/resumeparser/js/resumeparser.js"

# include js, css files in header of web template
# web_include_css = "/assets/resumeparser/css/resumeparser.css"
# web_include_js = "/assets/resumeparser/js/resumeparser.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "resumeparser/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
doctype_list_js = {
    "Save Resume": "public/js/save_resume_list.js",
    "Resume": "public/js/resume_list.js",
    "DocShare": "public/js/docshare_list.js",
}

# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "resumeparser/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# automatically load and sync documents of this doctype from downstream apps
# importable_doctypes = [doctype_1]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "resumeparser.utils.jinja_methods",
# 	"filters": "resumeparser.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "resumeparser.install.before_install"
# after_install = "resumeparser.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "resumeparser.uninstall.before_uninstall"
# after_uninstall = "resumeparser.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "resumeparser.utils.before_app_install"
# after_app_install = "resumeparser.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "resumeparser.utils.before_app_uninstall"
# after_app_uninstall = "resumeparser.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "resumeparser.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
	# "all": [
	# 	"resumeparser.tasks.all"
	# ],
	# "daily": [
	# 	"resumeparser.tasks.daily"
	# ],
	# "hourly": [
	# 	"resumeparser.tasks.hourly"
	# ],
	# "weekly": [
	# 	"resumeparser.tasks.weekly"
	# ],
	# "monthly": [
	# 	"resumeparser.tasks.monthly"
	# ],
# }


# scheduler_events = {
#     "cron": {
#         "*/1 * * * *": [
#             "resumeparser.tasks.resume_scanner"
#         ]
#     },
# }


scheduler_events = {
    "cron": {
        "0 0 * * *": [  # Every day at 12:00 AM
            "resumeparser.tasks.resume_scanner"
        ]
    }
}
# scheduler_events = {
#     "cron": {
#         "33 10 * * *": [  # Every day at 10:25 AM
#             "resumeparser.tasks.resume_scanner"
#         ]
#     }
# }
# 25 → minute

# 10 → hour (10 AM)

# * → day of month (every day)

# * → month (every month)

# * → day of week (every day)

# Testing
# -------

# before_tests = "resumeparser.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "resumeparser.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "resumeparser.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["resumeparser.utils.before_request"]
# after_request = ["resumeparser.utils.after_request"]

# Job Events
# ----------
# before_job = ["resumeparser.utils.before_job"]
# after_job = ["resumeparser.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"resumeparser.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }


website_route_rules = [{'from_route': '/resume_search/<path:app_path>', 'to_route': 'resume_search'},]