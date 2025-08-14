import frappe

@frappe.whitelist(allow_guest=True)
def all_users():
    users = frappe.get_all('User', fields=["name", "email"])
    return users

import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def save_resume(resume):
    try:
        # Check if a resume already exists for the user
        existing_resume = frappe.get_all(
            "Save Resume",
            filters={"resume": resume, "user": frappe.session.user},
            pluck="name"
        )

        if existing_resume:
            doc = frappe.get_doc("Save Resume", existing_resume[0])
            doc.delete()
            frappe.db.commit()
            return {
                "status": "unsaved",
                "message": _("Resume unsaved successfully")
            }
        else:
            # Create a new resume
            doc = frappe.new_doc("Save Resume")
            doc.user = frappe.session.user
            doc.name = resume  # Only if 'name' is allowed to be set manually
            doc.resume = resume
            doc.save()
            frappe.db.commit()
            return {
                "status": "saved",
                "message": _("Resume saved successfully")
            }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in save_resume")
        return {
            "status": "error",
            "message": _("Something went wrong: ") + str(e)
        }


@frappe.whitelist(allow_guest=True)
def save_resume_status(resume=None):
    try:
        # Check if the resume exists
        resume_doc = frappe.get_all("Save Resume", filters={"resume": resume, "user": frappe.session.user})
            
        # Check if the resume has any user associated with it
        if resume_doc:
            return {"message": True, "status": "saved"}
        
        # If resume doesn't exist or doesn't have a user
        return {"message": False, "status": "not_saved"}
    except Exception as e:
        frappe.log_error(f"Error in save_resume_status: {str(e)}")
        return {"message": False, "status": "error", "error": str(e)}


@frappe.whitelist(allow_guest=True)
def redirect_to_docshare():
    return {
        "value": 100,  # This is a placeholder value - replace with your actual value
        "fieldtype": "Currency",
        "route_options": {"docshare_type": "Read"},
        "route": ["List", "DocShare"]
    }

# NUMBER CARD SHARE WITH ME 
@frappe.whitelist(allow_guest=True)
def redirect_to_resume_with_filter():
    """Redirect to the Resume list filtered by Resumes shared with current user"""
    # Get the currently logged in user
    current_user = frappe.session.user
    
    # Get all Resume documents shared with the current user
    shared_resumes = frappe.get_all('DocShare', 
                                  filters={'user': current_user, 'share_doctype': 'Resume'},
                                  fields=['share_name'])
    
    # Extract just the Resume IDs
    resume_ids = [d.share_name for d in shared_resumes] if shared_resumes else []
    
    # Count of shared resumes
    approved_count = len(resume_ids)
    
    return {
        "value": approved_count,  # Count of resumes shared with current user
        "fieldtype": "Int",
        # Filter to show only the specific Resume IDs that are shared with the user
        "route_options": {
            "name": ["in", resume_ids] if resume_ids else ["=", "none_found_placeholder"]
        },
        "route": ["List", "Resume"]
    }

# NUMBER CARD SAVED RESUMES
@frappe.whitelist()
def get_saved_resumes_by_user():
    """
    Return count and route to Resume list, based on resumes saved by the current user
    through Save Resume doctype.
    """
    current_user = frappe.session.user

    # Get all 'resume' IDs from Save Resume where user is current user
    saved_resumes = frappe.get_all(
        "Save Resume",
        filters={"user": current_user},
        fields=["resume"]
    )

    # Extract just the Resume IDs
    resume_ids = [r.resume for r in saved_resumes if r.resume]

    return {
        "value": len(resume_ids),  # Total resumes saved by user
        "fieldtype": "Int",
        "route": ["List", "Resume"],
        "route_options": {
            "name": ["in", resume_ids] if resume_ids else ["=", "none_found"]
        }
    }


# JOB POSTS API
@frappe.whitelist(allow_guest=True)
def create_job_post(client, job_title, job_description, role=None, industry=None, department=None, employment_type=None, designation=None, key_skill=None):
    """
    Create a new job post with the provided details
    """
    try:
        # Create new Job Posts document
        job_post = frappe.new_doc("Job Posts")
        job_post.client = client
        job_post.job_title = job_title
        job_post.job_description = job_description
        
        # Set optional fields
        if role:
            job_post.role = role
        if industry:
            job_post.industry = industry
        if department:
            job_post.department = department
        if employment_type:
            job_post.employment_type = employment_type
        if designation:
            job_post.designation = designation
        
        # Handle key skills - store as JSON string
        if key_skill:
            job_post.key_skill = key_skill
    
        
        # Save the document
        job_post.insert()
        frappe.db.commit()
        
        return {
            "status": "success",
            "message": "Job post created successfully",
            "job_post_id": job_post.name
        }
        
    except Exception as e:
        frappe.log_error(f"Error creating job post: {str(e)}")
        return {
            "status": "error", 
            "message": f"Failed to create job post: {str(e)}"
        }


@frappe.whitelist(allow_guest=True)
def get_job_posts():
    """
    Get all job posts for display
    """
    try:
        # Fetch all job posts
        job_posts = frappe.get_all(
            "Job Posts",
            fields=[
                "name", 
                "client", 
                "job_title", 
                "job_description", 
                "role", 
                "industry", 
                "department", 
                "employment_type", 
                "designation", 
                "key_skill",
                "creation",
                "modified"
            ],
            order_by="creation desc"
        )
        
        return job_posts
        
    except Exception as e:
        frappe.log_error(f"Error fetching job posts: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to fetch job posts: {str(e)}"
        }


@frappe.whitelist(allow_guest=True)
def get_filtered_job_posts(filters=None, page=1, per_page=10):
    """
    Get filtered job posts based on search criteria with pagination
    """
    try:
        # Parse filters if passed as string
        if isinstance(filters, str):
            filters = frappe.parse_json(filters)
        
        # Convert pagination params
        page = int(page)
        per_page = int(per_page)
        start = (page - 1) * per_page
        
        # Build Frappe filters
        frappe_filters = []
        
        # Add title filter if provided
        if filters and filters.get('title'):
            title_filter = filters['title']
            frappe_filters.append(['job_title', 'like', f'%{title_filter}%'])
        
        # Add client filter if provided  
        if filters and filters.get('client'):
            client_filter = filters['client']
            frappe_filters.append(['client', 'like', f'%{client_filter}%'])
        
        # Fetch job posts with filters and pagination
        job_posts = frappe.get_all(
            "Job Posts",
            fields=[
                "name", 
                "client", 
                "job_title", 
                "job_description", 
                "role", 
                "industry", 
                "department", 
                "employment_type", 
                "designation", 
                "key_skill",
                "creation",
                "modified"
            ],
            filters=frappe_filters,
            order_by="creation desc",
            start=start,
            page_length=per_page
        )
        
        # Get total count for pagination
        total_count = frappe.db.count("Job Posts", filters=frappe_filters)
        
        # Calculate pagination info
        total_pages = (total_count + per_page - 1) // per_page
        has_next = page < total_pages
        has_prev = page > 1
        
        return {
            "data": job_posts,
            "pagination": {
                "current_page": page,
                "per_page": per_page,
                "total_count": total_count,
                "total_pages": total_pages,
                "has_next": has_next,
                "has_prev": has_prev,
                "next_page": page + 1 if has_next else None,
                "prev_page": page - 1 if has_prev else None
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error fetching filtered job posts: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to fetch filtered job posts: {str(e)}"
        }


# ASSESSMENT APIs
@frappe.whitelist(allow_guest=True)
def get_assessments(page=1, per_page=10, search_term=None, job_post_filter=None, candidate_name_filter=None, updated_by_filter=None):
    """
    Get paginated list of assessments with search functionality
    """
    try:
        # Convert page to int and calculate start
        page = int(page)
        per_page = int(per_page)
        start = (page - 1) * per_page
        
        # Build search filters
        filters = []
        
        if search_term:
            # Search in candidate name, job post title, or updated_by name
            search_filter = [
                ["candidate_name", "like", f"%{search_term}%"],
                ["job_post", "like", f"%{search_term}%"],
                ["updated_by", "like", f"%{search_term}%"]
            ]
            filters.append(search_filter)
        
        if job_post_filter:
            filters.append(["job_post", "like", f"%{job_post_filter}%"])
            
        if candidate_name_filter:
            filters.append(["candidate_name", "like", f"%{candidate_name_filter}%"])
            
        if updated_by_filter:
            filters.append(["updated_by", "like", f"%{updated_by_filter}%"])
        
        # Get assessments with pagination
        assessments = frappe.get_all(
            "Assessement",
            fields=[
                "name",
                "job_post", 
                "candidate_name",
                "earlier_interviewed_with_the_client",
                "updated_by",
                "creation",
                "modified"
            ],
            filters=filters,
            order_by="creation desc",
            start=start,
            page_length=per_page
        )
        
        # Get total count for pagination
        total_count = frappe.db.count("Assessement", filters=filters)
        
        # Calculate pagination info
        total_pages = (total_count + per_page - 1) // per_page
        has_next = page < total_pages
        has_prev = page > 1
        
        return {
            "data": assessments,
            "pagination": {
                "current_page": page,
                "per_page": per_page,
                "total_count": total_count,
                "total_pages": total_pages,
                "has_next": has_next,
                "has_prev": has_prev,
                "next_page": page + 1 if has_next else None,
                "prev_page": page - 1 if has_prev else None
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error fetching assessments: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to fetch assessments: {str(e)}"
        }


@frappe.whitelist(allow_guest=True)
def get_assessment_details(assessment_name):
    """
    Get complete details of a single assessment
    """
    try:
        # Get assessment document with all fields
        assessment = frappe.get_doc("Assessement", assessment_name)
        
        # Convert to dict to return all fields
        assessment_data = assessment.as_dict()
        
        return {
            "status": "success",
            "data": assessment_data
        }
        
    except frappe.DoesNotExistError:
        return {
            "status": "error",
            "message": "Assessment not found"
        }
    except Exception as e:
        frappe.log_error(f"Error fetching assessment details: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to fetch assessment details: {str(e)}"
        }


@frappe.whitelist(allow_guest=True)
def generate_assessment_pdf(assessment_name):
    """
    Generate and download PDF for a specific assessment
    """
    try:
        from frappe.utils.pdf import get_pdf
        import frappe.utils.pdf
        
        # Get assessment document with all fields
        assessment = frappe.get_doc("Assessement", assessment_name)
        
        # Generate HTML content for PDF
        html_content = generate_assessment_html(assessment)
        
        # Generate PDF with custom options
        pdf = get_pdf(html_content, {
            "page-size": "A4",
            "margin-top": "10mm",
            "margin-right": "10mm", 
            "margin-bottom": "10mm",
            "margin-left": "10mm",
            "encoding": "UTF-8",
            "no-outline": None
        })
        
        # Set response headers for PDF download
        frappe.local.response.filename = f"Assessment_{assessment.candidate_name}_{assessment_name}.pdf"
        frappe.local.response.filecontent = pdf
        frappe.local.response.type = "download"
        
    except frappe.DoesNotExistError:
        return {
            "status": "error",
            "message": "Assessment not found"
        }
    except Exception as e:
        frappe.log_error(f"Error generating assessment PDF: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to generate PDF: {str(e)}"
        }


def generate_assessment_html(assessment):
    """
    Generate HTML content for assessment PDF with Seachend Search Advisors Private Limited watermark
    """
    # Helper function to display value or "-" if empty
    def display_value(value):
        if value is None or value == "" or value == 0:
            return "-"
        return str(value)
    
    # Format relevant experience
    relevant_exp_html = ""
    if assessment.relevant_experience:
        relevant_exp_html = """
        <tr>
            <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;">Relevant Experience:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">
                <table style="width: 100%; border-collapse: collapse;">"""
        
        for exp in assessment.relevant_experience:
            relevant_exp_html += f"""
                    <tr>
                        <td style="padding: 4px; border: 1px solid #eee;"><strong>{display_value(exp.title)}</strong></td>
                        <td style="padding: 4px; border: 1px solid #eee;">{display_value(exp.experience)} years</td>
                        <td style="padding: 4px; border: 1px solid #eee;">{display_value(exp.note)}</td>
                    </tr>"""
        
        relevant_exp_html += """
                </table>
            </td>
        </tr>"""
    
    # Format awards and certifications
    awards_html = ""
    if assessment.awards_recognitions_and_certifications:
        awards_html = """
        <tr>
            <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;">Awards & Certifications:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">
                <table style="width: 100%; border-collapse: collapse;">"""
        
        for award in assessment.awards_recognitions_and_certifications:
            awards_html += f"""
                    <tr>
                        <td style="padding: 4px; border: 1px solid #eee;">{display_value(award.title if hasattr(award, 'title') else award.name)}</td>
                    </tr>"""
        
        awards_html += """
                </table>
            </td>
        </tr>"""
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Assessment Report - {assessment.candidate_name}</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                position: relative;
            }}
            body::before {{
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><text x="50%" y="50%" font-family="Arial" font-size="14" fill="rgba(100,100,100,0.1)" text-anchor="middle" dominant-baseline="middle" transform="rotate(-45 150 75)">Seachend Search Advisors</text></svg>');
                background-repeat: repeat;
                background-size: 600px 300px;
                opacity: 10;
                pointer-events: none;
                z-index: 100;
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px solid #007bff;
                padding-bottom: 20px;
                background-color: rgba(255, 255, 255, 0.95);
                position: relative;
                z-index: 1;
                padding: 20px;
                border-radius: 5px;
            }}
            .company-name {{
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
                margin-bottom: 10px;
            }}
            .report-title {{
                font-size: 20px;
                color: #333;
                margin-bottom: 10px;
            }}
            .candidate-name {{
                font-size: 18px;
                color: #666;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                background-color: rgba(255, 255, 255, 0.95);
                position: relative;
                z-index: 1;
            }}
            th, td {{
                text-align: left;
                padding: 12px;
                border: 1px solid #ddd;
            }}
            th {{
                background-color: #007bff;
                color: white;
                font-weight: bold;
            }}
            .section-header {{
                background-color: #f8f9fa;
                font-weight: bold;
                color: #007bff;
            }}
            .field-label {{
                font-weight: bold;
                background-color: #f5f5f5;
                width: 30%;
            }}
            .long-text {{
                max-width: 400px;
                word-wrap: break-word;
            }}
            .footer {{
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 20px;
                background-color: rgba(255, 255, 255, 0.95);
                position: relative;
                z-index: 1;
                padding: 20px;
                border-radius: 5px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="company-name">Seachend Search Advisors Private Limited</div>
            <div class="report-title">CANDIDATE ASSESSMENT REPORT</div>
            <div class="candidate-name">{display_value(assessment.candidate_name)}</div>
        </div>
        
        <table>
            <tr class="section-header">
                <th colspan="2">BASIC INFORMATION</th>
            </tr>
            <tr>
                <td class="field-label">Candidate Name:</td>
                <td>{display_value(assessment.candidate_name)}</td>
            </tr>
            <tr>
                <td class="field-label">Job Post:</td>
                <td>{display_value(assessment.job_post)}</td>
            </tr>
            <tr>
                <td class="field-label">Earlier Interviewed:</td>
                <td>{"Yes" if assessment.earlier_interviewed_with_the_client else "No"}</td>
            </tr>
            <tr>
                <td class="field-label">Interview Timeline:</td>
                <td>{display_value(assessment.time_line_of_earlier_interview)}</td>
            </tr>
            <tr>
                <td class="field-label">Updated By:</td>
                <td>{display_value(assessment.updated_by)}</td>
            </tr>
        </table>
        
        <table>
            <tr class="section-header">
                <th colspan="2">PERSONAL & PROFESSIONAL DETAILS</th>
            </tr>
            <tr>
                <td class="field-label">Current Organization:</td>
                <td>{display_value(assessment.current_organization)}</td>
            </tr>
            <tr>
                <td class="field-label">Gender:</td>
                <td>{display_value(assessment.gender)}</td>
            </tr>
            <tr>
                <td class="field-label">Diversity Flag:</td>
                <td>{display_value(assessment.diversity_flag)}</td>
            </tr>
            <tr>
                <td class="field-label">Total Experience:</td>
                <td>{display_value(assessment.total_experience)} years</td>
            </tr>
            <tr>
                <td class="field-label">Location:</td>
                <td>{display_value(assessment.location)}</td>
            </tr>
            <tr>
                <td class="field-label">Willing to Relocate:</td>
                <td>{"Yes" if assessment.willingness_to_relocate else "No"}</td>
            </tr>
            <tr>
                <td class="field-label">Education (Highest):</td>
                <td>{display_value(assessment.education_highest)}</td>
            </tr>
            <tr>
                <td class="field-label">Any Disabilities:</td>
                <td>{"Yes" if assessment.any_disabilities else "No"}</td>
            </tr>
        </table>
        
        <table>
            <tr class="section-header">
                <th colspan="2">WORK EXPERIENCE & MANAGEMENT</th>
            </tr>
            <tr>
                <td class="field-label">Reporting To:</td>
                <td>{display_value(assessment.reporting_to)}</td>
            </tr>
            <tr>
                <td class="field-label">Team Size Managed:</td>
                <td>{display_value(assessment.team_size_managed)}</td>
            </tr>
            <tr>
                <td class="field-label">Team Structure:</td>
                <td class="long-text">{display_value(assessment.structure_of_the_team)}</td>
            </tr>
            <tr>
                <td class="field-label">Budget Managed:</td>
                <td>{display_value(assessment.budget_managed)}</td>
            </tr>
            <tr>
                <td class="field-label">Revenue/Manpower Managed:</td>
                <td>{display_value(assessment.revenue_or_manpower_or_budget_managed_as_is_the_case_in_role)}</td>
            </tr>
            <tr>
                <td class="field-label">Numbers to Provide:</td>
                <td>{display_value(assessment.numbers_to_be_provided)}</td>
            </tr>
            {relevant_exp_html}
        </table>
        
        <table>
            <tr class="section-header">
                <th colspan="2">COMPENSATION & NOTICE PERIOD</th>
            </tr>
            <tr>
                <td class="field-label">Current Compensation:</td>
                <td>{display_value(assessment.current_compensation)}</td>
            </tr>
            <tr>
                <td class="field-label">Expected Compensation:</td>
                <td>{display_value(assessment.expected_compensation)}</td>
            </tr>
            <tr>
                <td class="field-label">Notice Period:</td>
                <td>{display_value(assessment.notice_period)}</td>
            </tr>
        </table>
        
        <table>
            <tr class="section-header">
                <th colspan="2">ASSESSMENT & COMMENTS</th>
            </tr>
            <tr>
                <td class="field-label">Stability Comments:</td>
                <td class="long-text">{display_value(assessment.stability_comments)}</td>
            </tr>
            <tr>
                <td class="field-label">Reason for Change:</td>
                <td class="long-text">{display_value(assessment.reason_for_change)}</td>
            </tr>
            <tr>
                <td class="field-label">Fitment to Role:</td>
                <td class="long-text">{display_value(assessment.fitment_to_the_role)}</td>
            </tr>
            <tr>
                <td class="field-label">Must Haves (Client Defined):</td>
                <td class="long-text">{display_value(assessment.must_haves_as_defined_by_client)}</td>
            </tr>
            <tr>
                <td class="field-label">Executive Presence:</td>
                <td class="long-text">{display_value(assessment.executive_presence_and_ability_to_think_and_act_strategically)}</td>
            </tr>
            <tr>
                <td class="field-label">Call Outs:</td>
                <td class="long-text">{display_value(assessment.call_outs)}</td>
            </tr>
            <tr>
                <td class="field-label">Education Gap Reason:</td>
                <td class="long-text">{display_value(assessment.gap_in_education_if_any_reason)}</td>
            </tr>
            <tr>
                <td class="field-label">Job Gap Reason:</td>
                <td class="long-text">{display_value(assessment.gap_in_jobs_if_any)}</td>
            </tr>
            <tr>
                <td class="field-label">Confirmation:</td>
                <td>{"Yes" if assessment.confirmation else "No"}</td>
            </tr>
        </table>
        
        {awards_html}
        
        <div class="footer">
            <p>Generated on: {frappe.utils.now()}</p>
            <p>Assessment ID: {assessment.name}</p>
            <p><strong>Seachend Search Advisors Private Limited - Confidential Assessment Report</strong></p>
        </div>
    </body>
    </html>
    """
    
    return html_content