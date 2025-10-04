import frappe


def skill_search_query(q: str) -> dict:
    return {
            "size": 0,
            "_source": False,
            "query": {
                "bool": {
                    "should": [
                        {
                            "nested": {
                                "path": "skills",
                                "query": {
                                    "match_phrase_prefix": {
                                        "skills.skill_name": {
                                            "query": q,
                                            "max_expansions": 50
                                        }
                                    }
                                }
                            }
                        },
                    ],
                    "minimum_should_match": 1
                }
            },
            "aggs": {
                "skill_suggestions": {
                    "nested": {
                        "path": "skills"
                    },
                    "aggs": {
                        "matching_skills": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "skills.skill_name": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "skills": {
                                    "terms": {
                                        "field": "skills.skill_name.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


def keyword_search_query(q:str):
    return {
            "size": 0,
            "_source": False,
            "query": {
                "bool": {
                    "should": [
                        {
                            "nested": {
                                "path": "skills",
                                "query": {
                                    "match_phrase_prefix": {
                                        "skills.skill_name": {
                                            "query": q,
                                            "max_expansions": 50
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
                                        "experience.role_position": {
                                            "query": q,
                                            "max_expansions": 50
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
                                            "query": q,
                                            "max_expansions": 50
                                        }
                                    }
                                }
                            }
                        },
                    ],
                    "minimum_should_match": 1
                }
            },
            "aggs": {
                "skill_suggestions": {
                    "nested": {
                        "path": "skills"
                    },
                    "aggs": {
                        "matching_skills": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "skills.skill_name": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "skills": {
                                    "terms": {
                                        "field": "skills.skill_name.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                },
                "designation_suggestions": {
                    "nested": {
                        "path": "experience"
                    },
                    "aggs": {
                        "matching_designations": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "experience.role_position": {
                                        "query": q,
                                        "max_expansions": 50
                                    }     }
                            },
                            "aggs": {
                                "designations": {
                                    "terms": {
                                        "field": "experience.role_position.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                },
                "company_suggestions": {
                    "nested": {
                        "path": "experience"
                    },
                    "aggs": {
                        "matching_companies": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "experience.company_name": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "companies": {
                                    "terms": {
                                        "field": "experience.company_name.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


def location_search_query(q: str) -> dict:
    return {
        "size": 0,
                "query": {
                    "match_phrase_prefix": {
                        "city": q
                    }
                },
                "aggs": {
                    "city": {
                        "terms": {
                            "field": "city.keyword",
                            "size": 50
                        }
                    }
                }
    }

def companies_search_query(q: str) -> dict:
    return {
            "size": 0,
            "_source": False,
            "query": {
                "bool": {
                    "should": [
                        {
                            "nested": {
                                "path": "experience",
                                "query": {
                                    "match_phrase_prefix": {
                                        "experience.company_name": {
                                            "query": q,
                                            "max_expansions": 50
                                        }
                                    }
                                }
                            }
                        },
                    ],
                    "minimum_should_match": 1
                }
            },
            "aggs": {
                "company_suggestions": {
                    "nested": {
                        "path": "experience"
                    },
                    "aggs": {
                        "matching_companies": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "experience.company_name": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "companies": {
                                    "terms": {
                                        "field": "experience.company_name.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        

def designation_search_query(q: str) -> dict:
    return {
            "size": 0,
            "_source": False,
            "query": {
                "bool": {
                    "should": [
                        {
                            "nested": {
                                "path": "experience",
                                "query": {
                                    "match_phrase_prefix": {
                                        "experience.role_position": {
                                            "query": q,
                                            "max_expansions": 50
                                        }
                                    }
                                }
                            }
                        },
                    ],
                    "minimum_should_match": 1
                }
            },
            "aggs": {
                "designation_suggestions": {
                    "nested": {
                        "path": "experience"
                    },
                    "aggs": {
                        "matching_designations": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "experience.role_position": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "designations": {
                                    "terms": {
                                        "field": "experience.role_position.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

def education_institute_search_query(q: str) -> dict:
    return {
        "size": 0,
        "_source": False,
        "query": {
            "bool": {
                "should": [
                    {
                        "nested": {
                            "path": "education",
                            "query": {
                                "match_phrase_prefix": {
                                    "education.school_college_name": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            }
                        }
                    },
                ],
                "minimum_should_match": 1
            }
        },
        "aggs": {
            "education_institute_suggestions": {
                "nested": {
                    "path": "education"
                },
                "aggs": {
                    "matching_institutes": {
                        "filter": {
                            "match_phrase_prefix": {
                                "education.school_college_name": {
                                    "query": q,
                                    "max_expansions": 50
                                }
                            }
                        },
                        "aggs": {
                            "institutes": {
                                "terms": {
                                    "field": "education.school_college_name.keyword",
                                    "size": 5
                                }
                            }
                        }
                    }
                }
            }
        }
    }
            


def certificates_search_query(q: str):
    return {
            "size": 0,
            "_source": False,
            "query": {
                "bool": {
                    "should": [
                        {
                            "nested": {
                                "path": "certificates",
                                "query": {
                                    "match_phrase_prefix": {
                                        "certificates.certificate_name": {
                                            "query": q,
                                            "max_expansions": 50
                                        }
                                    }
                                }
                            }
                        },
                    ],
                    "minimum_should_match": 1
                }
            },
            "aggs": {
                "certificate_suggestions": {
                    "nested": {
                        "path": "certificates"
                    },
                    "aggs": {
                        "matching_certificates": {
                            "filter": {
                                "match_phrase_prefix": {
                                    "certificates.certificate_name": {
                                        "query": q,
                                        "max_expansions": 50
                                    }
                                }
                            },
                            "aggs": {
                                "certificates": {
                                    "terms": {
                                        "field": "certificates.certificate_name.keyword",
                                        "size": 5
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }



def get_resume_from_id(resume_ids):
    return {
        "query": {
            "terms": {
                "_id": resume_ids
            }
        }
    }



def final_search_query(search_data: dict) -> dict:
    print("----------------[Search Data]----------------")
    for i in search_data.items():
        print(i[0], " : ", i[1])
    print("--------------------------------")


    # -------------------------------[Section 1]-------------------------------
    # keywords = [item["text"] for item in search_data.get("searchKeywords", [])]
    keywords = [item["text"] for item in search_data.get("searchKeywords", []) + search_data.get("skills", [])]

    must_conditions = []
    should_conditions = []
    must_not_conditions = []

    # 1. Handle skills from "skills" parameter (dedicated skill search)
    skills_list = search_data.get("skills", [])
    if skills_list:
        # Create skill conditions for direct skill search
        skill_should_conditions = []
        for skill_item in skills_list:
            if isinstance(skill_item, dict) and "text" in skill_item:
                skill_name = skill_item["text"]
                if skill_item.get("isNecessary", False):
                    # Necessary skills go to must conditions
                    must_conditions.append({
                        "nested": {
                            "path": "skills",
                            "query": {
                                "match": {
                                    "skills.skill_name": {
                                        "query": skill_name,
                                        "operator": "and",
                                        "fuzziness": "AUTO"
                                    }
                                }
                            }
                        }
                    })
                else:
                    # Optional skills go to should conditions
                    skill_should_conditions.append({
                        "nested": {
                            "path": "skills",
                            "query": {
                                "match": {
                                    "skills.skill_name": {
                                        "query": skill_name,
                                        "operator": "and",
                                        "fuzziness": "AUTO"
                                    }
                                }
                            }
                        }
                    })
        
        # Add optional skills to should conditions
        if skill_should_conditions:
            should_conditions.extend(skill_should_conditions)

    # 2. Handle searchKeywords (search across multiple fields - skills, experience, etc.)
    for item in search_data.get("searchKeywords", []):
        keyword_text = item["text"]
        is_necessary = item.get("isNecessary", False)
        
        # Create multi-field search conditions for each keyword
        keyword_conditions = [
            # Search in skills
            {
                "nested": {
                    "path": "skills",
                    "query": {
                        "match": {
                            "skills.skill_name": {
                                "query": keyword_text,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            },
            # Search in experience role/position
            {
                "nested": {
                    "path": "experience",
                    "query": {
                        "match": {
                            "experience.role_position": {
                                "query": keyword_text,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            },
            # Search in experience job description
            {
                "nested": {
                    "path": "experience",
                    "query": {
                        "match": {
                            "experience.job_description": {
                                "query": keyword_text,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            },
            # Search in experience company name
            {
                "nested": {
                    "path": "experience",
                    "query": {
                        "match": {
                            "experience.company_name": {
                                "query": keyword_text,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            },
            # Search in education course name
            {
                "nested": {
                    "path": "education",
                    "query": {
                        "match": {
                            "education.course_name": {
                                "query": keyword_text,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            },
            # Search in education specialization
            {
                "nested": {
                    "path": "education",
                    "query": {
                        "match": {
                            "education.specialization": {
                                "query": keyword_text,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            },
            # Search in certificates
            {
                "nested": {
                    "path": "certificates",
                    "query": {
                        "match": {
                            "certificates.certificate_name": {
                                "query": keyword_text,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            },
            # Search in basic fields
            {
                "multi_match": {
                    "query": keyword_text,
                    "fields": ["candidate_name", "role", "industry", "department"],
                    "operator": "and",
                    "fuzziness": "AUTO"
                }
            }
        ]
        
        if is_necessary:
            # Necessary keywords: must match at least one field
            must_conditions.append({
                "bool": {
                    "should": keyword_conditions,
                    "minimum_should_match": 1
                }
            })
        else:
            # Optional keywords: boost relevance if matched
            should_conditions.append({
                "bool": {
                    "should": keyword_conditions,
                    "minimum_should_match": 1
                }
            })

    # 3. Experience (must)
    min_exp = search_data.get("minExperience")
    max_exp = search_data.get("maxExperience")

    if min_exp != "" and max_exp != "":
        must_conditions.append({
            "range": {
                "total_experience": {
                    "gte": min_exp,
                    "lte": max_exp
                }
            }
        })
    elif min_exp != "":
        must_conditions.append({
            "range": {
                "total_experience": {
                    "gte": min_exp
                }
            }
        })
    elif max_exp != "":
        must_conditions.append({
            "range": {
                "total_experience": {
                    "lte": max_exp
                }
            }
        })


    # 4. Location (must)
    location = search_data.get("location")
    if location:
        must_conditions.append({
            "bool": {
                "should": [
                    {
                        "match": {
                            "city": {
                                "query": location,
                                "max_expansions": 50,
                                "operator": "or",
                                "fuzziness": "AUTO"
                            }
                        }
                    },
                    {
                        "match": {
                            "seeking_job_locations": {
                                "query": location,
                                "max_expansions": 50,
                                "operator": "or",
                                "fuzziness": "AUTO"
                            }
                        }
                    },
                    {
                        "match": {
                            "current_location": {
                                "query": location,
                                "max_expansions": 50,
                                "operator": "or",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                ],
                "minimum_should_match": 1
            }
        })

    
    # 5. Salary (must, with should for salary not provided)
    min_salary = search_data.get("minSalary")
    max_salary = search_data.get("maxSalary")
    salary_not_provided = search_data.get("salaryNotProvided")

    salary_shoulds = []

    # Salary range conditions
    if min_salary != "" and max_salary != "":
        salary_shoulds.append({
            "range": {
                "annual_salary": {
                    "gte": float(min_salary),
                    "lte": float(max_salary)
                }
            }
        })
    elif min_salary != "":
        salary_shoulds.append({
            "range": {
                "annual_salary": {
                    "gte": float(min_salary)
                }
            }
        })
    elif max_salary != "":
        salary_shoulds.append({
            "range": {
                "annual_salary": {
                    "lte": float(max_salary)
                }
            }
        })

    # Salary not provided condition
    if salary_not_provided:
        salary_shoulds.append({
            "bool": {
                "must_not": {
                    "exists": {
                        "field": "annual_salary"
                    }
                }
            }
        })

    # Add condition if any salary filter is applied
    if salary_shoulds:
        must_conditions.append({
            "bool": {
                "should": salary_shoulds,
                "minimum_should_match": 1
            }
        })


    # -------------------------------[Section 2]-------------------------------
    departmentes = search_data.get("departmentes", [])
    industry = search_data.get("industry")
    company = search_data.get("company")
    excludeCompanies = search_data.get("excludeCompanies")
    designation = search_data.get("designation")
    noticePeriod = search_data.get("noticePeriod")


    departmentes.append({"role": designation, "department": ""})

    # For each entry, add should clauses to search for department and role strings
    for entry in departmentes:
        department = entry.get("department")
        role = entry.get("role")

        search_terms = set()
        if department:
            search_terms.add(department)
        if role:
            search_terms.add(role)

        temp_should_clauses = []
        for term in search_terms:
            temp_should_clauses.append({
                "nested": {
                    "path": "experience",
                    "query": {
                        "match": {
                            "experience.role_position": {
                                "query": term,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            })
            temp_should_clauses.append({
                "nested": {
                    "path": "experience",
                    "query": {
                        "match": {
                            "experience.job_description": {
                                "query": term,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            })
            temp_should_clauses.append({
                "nested": {
                    "path": "experience",
                    "query": {
                        "match": {
                            "experience.department": {
                                "query": term,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            })

        if temp_should_clauses:
            must_conditions.append({
                "bool": {
                    "should": temp_should_clauses,
                    "minimum_should_match": 1
                }
            })
        
    if industry != "":
        must_conditions.append({
            "match": {
                "industry": {"query": industry, "operator": "and", "fuzziness": "AUTO"}
            }
        })
    if company != "":
        must_conditions.append({
            "nested": {
                    "path": "experience",
                    "query": {
                        "match": {
                            "experience.company_name": {
                                "query": company,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
        })


    if excludeCompanies != "" and len(excludeCompanies) >= 1:
        for item in excludeCompanies:
            condition = {
                    "nested": {
                        "path": "experience",
                        "query": {
                        "match": {
                            "experience.company_name": {
                            "query": item["text"],
                            "operator": "and",
                            "fuzziness": "AUTO"
                            }
                        }
                    }
                }}
        must_not_conditions.append(condition)

    if noticePeriod != "" and noticePeriod != "any":
        notice_int = int(noticePeriod)
        must_conditions.append({
            "range": {
                "notice_period": {
                    "lte": notice_int  # less than or equal to the provided noticePeriod
                }
            }
        })
    # -------------------------------[Section 3]-------------------------------
    
    ugcourse = search_data.get("ugcourse",[])
    uginstitute = search_data.get("uginstitute","")
    ugeducationType = search_data.get("ugeducationType","")
    ugfromYear = search_data.get("ugfromYear","")
    ugtoYear = search_data.get("ugtoYear","")

    if ugcourse != "" and len(ugcourse) >= 1:
        for course in ugcourse:
            department = course.get("department")
            role = course.get("role")

            search_terms = set()
            if department:
                search_terms.add(department)
            if role:
                search_terms.add(role)

        temp_should_clauses = []
        for term in search_terms:
            temp_should_clauses.append({
                "nested": {
                    "path": "education",
                    "query": {
                        "match": {
                            "education.course_name": {
                                "query": term,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            })
            temp_should_clauses.append({
                "nested": {
                    "path": "education",
                    "query": {
                        "match": {
                            "education.specialization": {
                                "query": term,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            })

        if temp_should_clauses:
            must_conditions.append({
                "bool": {
                    "should": temp_should_clauses,
                    "minimum_should_match": 1
                }
            })
    
    if uginstitute != "":
        must_conditions.append({
            "match": {
                "education.school_college_name": {"query": uginstitute, "operator": "and", "fuzziness": "AUTO"}
            }
        })

    if ugtoYear != "" and ugfromYear != "":
        must_conditions.append({
            "bool": {
                "must": [
                    {
                        "range": {
                            "education.from": {
                                "gte": ugfromYear
                            }
                        }
                    },
                    {
                        "range": {
                            "education.to": {
                                "lte": ugtoYear
                            }
                        }
                    }
                ]
            }
        })

    pgcourse = search_data.get("pgcourse",[])
    pginstitute = search_data.get("pginstitute","")
    pgeducationType = search_data.get("pgeducationType","")
    pgfromYear = search_data.get("pgfromYear","")
    pgtoYear = search_data.get("pgtoYear","")
    


    if pgcourse != "" and len(pgcourse) >= 1:
        for course in pgcourse:
            department = course.get("department")
            role = course.get("role")

            search_terms = set()
            if department:
                search_terms.add(department)
            if role:
                search_terms.add(role)

        temp_should_clauses = []
        for term in search_terms:
            temp_should_clauses.append({
                "nested": {
                    "path": "education",
                    "query": {
                        "match": {
                            "education.course_name": {
                                "query": term,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            })
            temp_should_clauses.append({
                "nested": {
                    "path": "education",
                    "query": {
                        "match": {
                            "education.specialization": {
                                "query": term,
                                "operator": "and",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            })

        if temp_should_clauses:
            must_conditions.append({
                "bool": {
                    "should": temp_should_clauses,
                    "minimum_should_match": 1
                }
            })
    
    if pginstitute != "":
        must_conditions.append({
            "match": {
                "education.school_college_name": {"query": pginstitute, "operator": "and", "fuzziness": "AUTO"}
            }
        })

    if pgtoYear != "" and pgfromYear != "":
        must_conditions.append({
            "bool": {
                "must": [
                    {
                        "range": {
                            "education.from": {
                                "gte": ugfromYear
                            }
                        }
                    },
                    {
                        "range": {
                            "education.to": {
                                "lte": ugtoYear
                            }
                        }
                    }
                ]
            }
        })


    # -------------------------------[Section 4]-------------------------------
    gender = search_data.get("gender")
    category = search_data.get("category")
    candidateMinAge = search_data.get("candidateMinAge")
    candidateMaxAge = search_data.get("candidateMaxAge")
    currentJobType = search_data.get("currentJobType")
    seekingJobType = search_data.get("seekingJobType")
    if gender != "" and gender != "all":
        must_conditions.append({
            "match": {
                "gender": {"query": gender}
            }
        })
    if candidateMinAge != "" and candidateMaxAge != "":
        must_conditions.append({
            "range": {
                "age": {
                    "gte": candidateMinAge,
                    "lte": candidateMaxAge
                }
            }
        })
    elif candidateMinAge != "":
        must_conditions.append({
            "range": {
                "age": {
                    "gte": candidateMinAge
                }
            }
        })
    elif candidateMaxAge != "":
        must_conditions.append({
            "range": {
                "age": {
                    "lte": candidateMaxAge
                }
            }
        })

    if category != "":
        must_conditions.append({
            "match": {
                "category": {"query": category, "operator": "and", "fuzziness": "AUTO"}
            }
        })
    
    if currentJobType != "":
        must_conditions.append({
            "match": {
                "current_job_type": {"query": currentJobType, "operator": "and", "fuzziness": "AUTO"}
            }
        })
    if seekingJobType != "":
        must_conditions.append({
            "match": {
                "seeking_job_type": {"query": seekingJobType, "operator": "and", "fuzziness": "AUTO"}
            }
        })
        
    # -------------------------------[Response]-------------------------------

    # Build the final query
    query_part = {
        "bool": {
            "must": must_conditions,
            "should": should_conditions,
            "must_not": must_not_conditions,
            "minimum_should_match": 1 if should_conditions else 0
        }
    }

    return {
        "size": 20,
        "query": query_part
    }


