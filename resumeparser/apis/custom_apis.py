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
def generate_assessment_pdf(assessment_name, fields=None):
    """
    Generate and download PDF for a specific assessment with selected fields
    """
    try:
        from frappe.utils.pdf import get_pdf
        import frappe.utils.pdf
        
        # Get assessment document with all fields
        assessment = frappe.get_doc("Assessement", assessment_name)
        
        # Parse selected fields if provided
        selected_fields = []
        if fields:
            selected_fields = [f.strip() for f in fields.split(',') if f.strip()]
        
        # Generate HTML content for PDF
        html_content = generate_assessment_html(assessment, selected_fields)
        
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


@frappe.whitelist(allow_guest=True)
def shared_resumes(page=1, per_page=10, search_term=None, shared_by_filter=None):
    """
    Get paginated list of resumes shared with current user with simple search functionality
    """
    try:
        from resumeparser.apis.update_profile import get_resume_from_id, open_search_query_executor

        current_user = frappe.session.user
        page = int(page)
        per_page = int(per_page)
        start = (page - 1) * per_page

        # Get all shared resumes for current user with owner info
        shared_filters = {'user': current_user, 'share_doctype': 'Resume'}

        # Add shared_by filter if provided
        if shared_by_filter:
            shared_filters['owner'] = shared_by_filter

        shared_docs = frappe.get_all(
            'DocShare',
            filters=shared_filters,
            fields=['share_name', 'owner', 'creation']
        )

        if not shared_docs:
            return {
                "data": [],
                "pagination": {
                    "current_page": page,
                    "per_page": per_page,
                    "total_count": 0,
                    "total_pages": 0,
                    "has_next": False,
                    "has_prev": False
                },
                "shared_by_users": []
            }

        # Get resume IDs
        resume_ids = [doc['share_name'] for doc in shared_docs]

        # Create a map of resume_id to owner info
        owner_map = {doc['share_name']: {
            'shared_by': doc['owner'],
            'shared_on': doc['creation']
        } for doc in shared_docs}

        # Get unique shared_by users for filter dropdown
        shared_by_users = []
        unique_owners = list(set([doc['owner'] for doc in shared_docs]))
        for owner in unique_owners:
            try:
                user_doc = frappe.get_doc('User', owner)
                shared_by_users.append({
                    'email': owner,
                    'name': user_doc.full_name or owner
                })
            except:
                shared_by_users.append({
                    'email': owner,
                    'name': owner
                })

        # Get resume data from OpenSearch
        row_query = get_resume_from_id(resume_ids)
        response = open_search_query_executor(row_query)
        row_data = response.get('hits', {}).get('hits', [])

        # Process resume data
        all_data = []
        for source_row in row_data:
            source = source_row.get("_source")
            resume_id = str(source_row.get("_id"))

            # Get owner info
            owner_info = owner_map.get(resume_id, {})
            shared_by = owner_info.get('shared_by', 'Unknown')
            shared_on = owner_info.get('shared_on', None)

            # Get user details for shared_by
            try:
                user_doc = frappe.get_doc('User', shared_by)
                shared_by_name = user_doc.full_name or shared_by
                shared_by_email = user_doc.email
            except:
                shared_by_name = shared_by
                shared_by_email = shared_by

            # Apply search filter if provided
            if search_term:
                search_lower = search_term.lower()
                candidate_name = (source.get('candidate_name') or "").lower()
                email = (source.get('email') or "").lower()
                city = (source.get('city') or "").lower()
                shared_by_lower = (shared_by_name or "").lower()

                # Skip if doesn't match search
                if not (search_lower in candidate_name or
                        search_lower in email or
                        search_lower in city or
                        search_lower in shared_by_lower):
                    continue

            skills = source.get("skills", [])
            technical_skills = [s.get("skill_name", "") for s in skills if s.get("skill_type") == "Technical"]
            soft_skills = [s.get("skill_name", "") for s in skills if s.get("skill_type") == "Soft"]

            resume_data = {
                "id": resume_id,
                "shared_by": shared_by_name,
                "shared_by_email": shared_by_email,
                "shared_on": str(shared_on) if shared_on else None,
                "basicInfo": {
                    "candidate_name": source.get('candidate_name'),
                    "date_of_birth": None,
                    "address": None,
                    "gender": None,
                    "mobile_number": source.get('mobile_number'),
                    "email": source.get('email'),
                    "city": source.get('city'),
                    "maritalStatus": "-",
                    "castCategory": "-",
                    "physicallyChallenged": "-"
                },
                "workSummary": {
                    "industry": None,
                    "department": None,
                    "role": None
                },
                "education": source.get('education', []),
                "experience": source.get('experience', []),
                "projects": source.get('projects', []),
                "certificates": source.get('certificates', []),
                "accomplishments": [],
                "skills": {
                    "TechnicalSkill": technical_skills,
                    "Soft": soft_skills,
                    "AdditionalSkills": []
                }
            }
            all_data.append(resume_data)

        # Apply pagination
        total_count = len(all_data)
        total_pages = (total_count + per_page - 1) // per_page if total_count > 0 else 0
        paginated_data = all_data[start:start + per_page]

        has_next = page < total_pages
        has_prev = page > 1

        return {
            "data": paginated_data,
            "pagination": {
                "current_page": page,
                "per_page": per_page,
                "total_count": total_count,
                "total_pages": total_pages,
                "has_next": has_next,
                "has_prev": has_prev,
                "next_page": page + 1 if has_next else None,
                "prev_page": page - 1 if has_prev else None
            },
            "shared_by_users": shared_by_users
        }

    except Exception as e:
        frappe.log_error(f"Error in shared_resumes: {str(e)}")
        return {
            "data": [],
            "error": str(e),
            "pagination": {
                "current_page": 1,
                "per_page": per_page,
                "total_count": 0,
                "total_pages": 0,
                "has_next": False,
                "has_prev": False
            },
            "shared_by_users": []
        }


def generate_assessment_html(assessment, selected_fields=None):
    """
    Generate HTML content for assessment PDF with Seachend Search Advisors Private Limited watermark
    """
    # Field mapping with short codes for URL optimization
    field_mapping = {
        "1": "candidate_name",
        "2": "job_post", 
        "3": "earlier_interviewed_with_the_client",
        "4": "time_line_of_earlier_interview",
        "5": "updated_by",
        "6": "current_organization",
        "7": "gender",
        "8": "diversity_flag", 
        "9": "total_experience",
        "10": "location",
        "11": "willingness_to_relocate",
        "12": "education_highest",
        "13": "any_disabilities",
        "14": "reporting_to",
        "15": "team_size_managed",
        "16": "structure_of_the_team",
        "17": "budget_managed",
        "18": "revenue_or_manpower_or_budget_managed_as_is_the_case_in_role",
        "19": "numbers_to_be_provided",
        "20": "relevant_experience",
        "21": "current_compensation",
        "22": "expected_compensation",
        "23": "notice_period",
        "24": "stability_comments",
        "25": "reason_for_change",
        "26": "fitment_to_the_role",
        "27": "must_haves_as_defined_by_client",
        "28": "executive_presence_and_ability_to_think_and_act_strategically",
        "29": "call_outs",
        "30": "gap_in_education_if_any_reason",
        "31": "gap_in_jobs_if_any",
        "32": "confirmation",
        "33": "awards_recognitions_and_certifications"
    }

    # Convert selected field codes to field names
    included_fields = set()
    if selected_fields:
        for code in selected_fields:
            if code in field_mapping:
                included_fields.add(field_mapping[code])
    else:
        # If no fields selected, include all fields
        included_fields = set(field_mapping.values())

    # Helper function to display value or "-" if empty
    def display_value(value):
        if value is None or value == "" or value == 0:
            return "-"
        return str(value)

    # Helper function to check if field should be included
    def should_include_field(field_name):
        return field_name in included_fields
    
    # Format relevant experience (only if included)
    relevant_exp_html = ""
    if should_include_field("relevant_experience") and assessment.relevant_experience:
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
    
    # Format awards and certifications (only if included)  
    awards_html = ""
    if should_include_field("awards_recognitions_and_certifications") and assessment.awards_recognitions_and_certifications:
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

    # Build sections dynamically based on selected fields
    basic_info_html = ""
    personal_prof_html = ""
    work_exp_html = ""
    compensation_html = ""
    assessment_comments_html = ""

    # Basic Information Section
    basic_fields = []
    if should_include_field("candidate_name"):
        basic_fields.append(f'<tr><td class="field-label">Candidate Name:</td><td>{display_value(assessment.candidate_name)}</td></tr>')
    if should_include_field("job_post"):
        basic_fields.append(f'<tr><td class="field-label">Job Post:</td><td>{display_value(assessment.job_post)}</td></tr>')
    if should_include_field("earlier_interviewed_with_the_client"):
        basic_fields.append(f'<tr><td class="field-label">Earlier Interviewed:</td><td>{"Yes" if assessment.earlier_interviewed_with_the_client else "No"}</td></tr>')
    if should_include_field("time_line_of_earlier_interview"):
        basic_fields.append(f'<tr><td class="field-label">Interview Timeline:</td><td>{display_value(assessment.time_line_of_earlier_interview)}</td></tr>')
    if should_include_field("updated_by"):
        basic_fields.append(f'<tr><td class="field-label">Updated By:</td><td>{display_value(assessment.updated_by)}</td></tr>')

    if basic_fields:
        basic_info_html = f'''
        <table>
            <tr class="section-header">
                <th colspan="2">BASIC INFORMATION</th>
            </tr>
            {"".join(basic_fields)}
        </table>'''

    # Personal & Professional Details Section
    personal_fields = []
    if should_include_field("current_organization"):
        personal_fields.append(f'<tr><td class="field-label">Current Organization:</td><td>{display_value(assessment.current_organization)}</td></tr>')
    if should_include_field("gender"):
        personal_fields.append(f'<tr><td class="field-label">Gender:</td><td>{display_value(assessment.gender)}</td></tr>')
    if should_include_field("diversity_flag"):
        personal_fields.append(f'<tr><td class="field-label">Diversity Flag:</td><td>{display_value(assessment.diversity_flag)}</td></tr>')
    if should_include_field("total_experience"):
        personal_fields.append(f'<tr><td class="field-label">Total Experience:</td><td>{display_value(assessment.total_experience)} years</td></tr>')
    if should_include_field("location"):
        personal_fields.append(f'<tr><td class="field-label">Location:</td><td>{display_value(assessment.location)}</td></tr>')
    if should_include_field("willingness_to_relocate"):
        personal_fields.append(f'<tr><td class="field-label">Willing to Relocate:</td><td>{"Yes" if assessment.willingness_to_relocate else "No"}</td></tr>')
    if should_include_field("education_highest"):
        personal_fields.append(f'<tr><td class="field-label">Education (Highest):</td><td>{display_value(assessment.education_highest)}</td></tr>')
    if should_include_field("any_disabilities"):
        personal_fields.append(f'<tr><td class="field-label">Any Disabilities:</td><td>{"Yes" if assessment.any_disabilities else "No"}</td></tr>')

    if personal_fields:
        personal_prof_html = f'''
        <table>
            <tr class="section-header">
                <th colspan="2">PERSONAL & PROFESSIONAL DETAILS</th>
            </tr>
            {"".join(personal_fields)}
        </table>'''

    # Work Experience & Management Section
    work_fields = []
    if should_include_field("reporting_to"):
        work_fields.append(f'<tr><td class="field-label">Reporting To:</td><td>{display_value(assessment.reporting_to)}</td></tr>')
    if should_include_field("team_size_managed"):
        work_fields.append(f'<tr><td class="field-label">Team Size Managed:</td><td>{display_value(assessment.team_size_managed)}</td></tr>')
    if should_include_field("structure_of_the_team"):
        work_fields.append(f'<tr><td class="field-label">Team Structure:</td><td class="long-text">{display_value(assessment.structure_of_the_team)}</td></tr>')
    if should_include_field("budget_managed"):
        work_fields.append(f'<tr><td class="field-label">Budget Managed:</td><td>{display_value(assessment.budget_managed)}</td></tr>')
    if should_include_field("revenue_or_manpower_or_budget_managed_as_is_the_case_in_role"):
        work_fields.append(f'<tr><td class="field-label">Revenue/Manpower Managed:</td><td>{display_value(assessment.revenue_or_manpower_or_budget_managed_as_is_the_case_in_role)}</td></tr>')
    if should_include_field("numbers_to_be_provided"):
        work_fields.append(f'<tr><td class="field-label">Numbers to Provide:</td><td>{display_value(assessment.numbers_to_be_provided)}</td></tr>')
    
    # Add relevant experience to work section if included
    if relevant_exp_html:
        work_fields.append(relevant_exp_html)

    if work_fields:
        work_exp_html = f'''
        <table>
            <tr class="section-header">
                <th colspan="2">WORK EXPERIENCE & MANAGEMENT</th>
            </tr>
            {"".join(work_fields)}
        </table>'''

    # Compensation & Notice Period Section
    comp_fields = []
    if should_include_field("current_compensation"):
        comp_fields.append(f'<tr><td class="field-label">Current Compensation:</td><td>{display_value(assessment.current_compensation)}</td></tr>')
    if should_include_field("expected_compensation"):
        comp_fields.append(f'<tr><td class="field-label">Expected Compensation:</td><td>{display_value(assessment.expected_compensation)}</td></tr>')
    if should_include_field("notice_period"):
        comp_fields.append(f'<tr><td class="field-label">Notice Period:</td><td>{display_value(assessment.notice_period)}</td></tr>')

    if comp_fields:
        compensation_html = f'''
        <table>
            <tr class="section-header">
                <th colspan="2">COMPENSATION & NOTICE PERIOD</th>
            </tr>
            {"".join(comp_fields)}
        </table>'''

    # Assessment & Comments Section
    comment_fields = []
    if should_include_field("stability_comments"):
        comment_fields.append(f'<tr><td class="field-label">Stability Comments:</td><td class="long-text">{display_value(assessment.stability_comments)}</td></tr>')
    if should_include_field("reason_for_change"):
        comment_fields.append(f'<tr><td class="field-label">Reason for Change:</td><td class="long-text">{display_value(assessment.reason_for_change)}</td></tr>')
    if should_include_field("fitment_to_the_role"):
        comment_fields.append(f'<tr><td class="field-label">Fitment to Role:</td><td class="long-text">{display_value(assessment.fitment_to_the_role)}</td></tr>')
    if should_include_field("must_haves_as_defined_by_client"):
        comment_fields.append(f'<tr><td class="field-label">Must Haves (Client Defined):</td><td class="long-text">{display_value(assessment.must_haves_as_defined_by_client)}</td></tr>')
    if should_include_field("executive_presence_and_ability_to_think_and_act_strategically"):
        comment_fields.append(f'<tr><td class="field-label">Executive Presence:</td><td class="long-text">{display_value(assessment.executive_presence_and_ability_to_think_and_act_strategically)}</td></tr>')
    if should_include_field("call_outs"):
        comment_fields.append(f'<tr><td class="field-label">Call Outs:</td><td class="long-text">{display_value(assessment.call_outs)}</td></tr>')
    if should_include_field("gap_in_education_if_any_reason"):
        comment_fields.append(f'<tr><td class="field-label">Education Gap Reason:</td><td class="long-text">{display_value(assessment.gap_in_education_if_any_reason)}</td></tr>')
    if should_include_field("gap_in_jobs_if_any"):
        comment_fields.append(f'<tr><td class="field-label">Job Gap Reason:</td><td class="long-text">{display_value(assessment.gap_in_jobs_if_any)}</td></tr>')
    if should_include_field("confirmation"):
        comment_fields.append(f'<tr><td class="field-label">Confirmation:</td><td>{"Yes" if assessment.confirmation else "No"}</td></tr>')

    if comment_fields:
        assessment_comments_html = f'''
        <table>
            <tr class="section-header">
                <th colspan="2">ASSESSMENT & COMMENTS</th>
            </tr>
            {"".join(comment_fields)}
        </table>'''

    # Awards section (if included)
    awards_section_html = ""
    if awards_html:
        awards_section_html = f'''
        <table>
            <tr class="section-header">
                <th colspan="2">AWARDS & CERTIFICATIONS</th>
            </tr>
            {awards_html}
        </table>'''

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
            <div class="candidate-name">{display_value(assessment.candidate_name) if should_include_field("candidate_name") else "Assessment Report"}</div>
        </div>
        
        {basic_info_html}
        {personal_prof_html}
        {work_exp_html}
        {compensation_html}
        {assessment_comments_html}
        {awards_section_html}
        
        <div class="footer">
            <p>Generated on: {frappe.utils.now()}</p>
            <p>Assessment ID: {assessment.name}</p>
            <p><strong>Seachend Search Advisors Private Limited - Confidential Assessment Report</strong></p>
        </div>
    </body>
    </html>
    """
    
    return html_content




import os
import requests
import subprocess

def convert_doc_to_pdf(input_path):
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    output_path = os.path.join(os.path.dirname(input_path), f"{base_name}.pdf")
    
    command = [
        "/usr/bin/soffice",
        "--headless",
        "--convert-to",
        "pdf",
        input_path,
        "--outdir",
        os.path.dirname(output_path)
    ]

    try:
        subprocess.run(command, check=True)
        if os.path.exists(output_path):
            print(f"✅ Converted {input_path} -> {output_path}")
            # Delete original DOC/DOCX after conversion
            os.remove(input_path)
            print(f"🗑️ Original file removed: {input_path}")
            return output_path
        else:
            print(f"❌ Conversion failed, PDF not found: {output_path}")
            return None
    except subprocess.CalledProcessError as e:
        print(f"❌ Error converting {input_path} -> {e}")
        return None



@frappe.whitelist(allow_guest=True)
def upload_and_convert_resume():
    """
    Process resume file: if PDF keep as is, if DOC/DOCX convert to PDF
    Save to File DocType and return file path (prevents duplicate files)
    """
    try:
        # Get uploaded file from request
        files = frappe.request.files
        file = files.get('file')

        if not file:
            frappe.throw("No file uploaded")

        filename = file.filename
        file_content = file.stream

        if not file_content or not filename:
            frappe.throw("Invalid file data")

        # Get file extension
        file_ext = os.path.splitext(filename)[1].lower()

        # Validate file type
        allowed_extensions = ['.pdf', '.doc', '.docx']
        if file_ext not in allowed_extensions:
            frappe.throw("Only PDF, DOC, and DOCX files are allowed")

        # Get is_private parameter (default to 0)
        is_private = int(frappe.form_dict.get('is_private', 0))

        from frappe.utils.file_manager import save_file
        import tempfile

        # Save uploaded file to temporary location
        temp_dir = tempfile.gettempdir()
        temp_file_path = os.path.join(temp_dir, filename)

        # Write uploaded content to temp file
        with open(temp_file_path, 'wb') as f:
            f.write(file_content.read())

        final_file_path = temp_file_path
        message = ""

        # Prepare PDF filename
        pdf_filename = os.path.splitext(filename)[0] + '.pdf'

        # Check if file already exists in File DocType
        existing_file = frappe.get_all(
            "File",
            filters={"file_name": pdf_filename},
            fields=["name", "file_url", "file_name"]
        )

        if existing_file:
            # File already exists, return existing file URL
            # Clean up uploaded file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

            return {
                "status": "success",
                "message": "File already exists, using existing file",
                "file_url": existing_file[0].get("file_url"),
                "file_name": existing_file[0].get("file_name")
            }

        # If DOC/DOCX, convert to PDF
        if file_ext in ['.doc', '.docx']:
            # Convert to PDF
            pdf_path = convert_doc_to_pdf(temp_file_path)

            if not pdf_path or not os.path.exists(pdf_path):
                # Clean up temp file
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
                frappe.throw("Failed to convert DOC/DOCX to PDF. Please ensure LibreOffice is installed.")

            final_file_path = pdf_path
            message = "File converted to PDF and saved successfully"
        else:
            message = "PDF file saved successfully"

        # Read file content
        with open(final_file_path, 'rb') as f:
            final_content = f.read()

        # Save to File DocType with PDF filename
        file_doc = save_file(pdf_filename, final_content, '', '', is_private=is_private)

        # Clean up temporary files
        if final_file_path != temp_file_path and os.path.exists(final_file_path):
            os.remove(final_file_path)
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

        frappe.db.commit()

        return {
            "status": "success",
            "message": message,
            "file_url": file_doc.file_url,
            "file_name": file_doc.file_name
        }

    except Exception as e:
        frappe.log_error(f"Error in upload_and_convert_resume: {str(e)}")
        frappe.throw(f"Upload failed: {str(e)}")
