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
    print(search_data)
    for i in search_data.items():
        print(i[0], " : ", i[1])
    print("--------------------------------")


    # -------------------------------[Section 1]-------------------------------
    # keywords = [item["text"] for item in search_data.get("searchKeywords", [])]
    keywords = [item["text"] for item in search_data.get("searchKeywords", []) + search_data.get("skills", [])]

    # if not keywords:
    #     # No keywords provided, return a query that matches nothing
    #     return {
    #         "size": 20,
    #         "query": {
    #             "bool": {
    #                 "must": [
    #                     {"match_none": {}}
    #                 ]
    #             }
    #         }
    #     }

    must_conditions = []
    should_conditions = []
    must_not_conditions = []

    # 1. Star-marked keywords (must be in skills, all in a single nested query)
    necessary_skills = [item["text"] for item in search_data.get("searchKeywords", []) if item.get("isNecessary", False)]
    if necessary_skills:
        must_conditions.append({
            "nested": {
                "path": "skills",
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"skills.skill_name": skill}} for skill in necessary_skills
                        ]
                    }
                }
            }
        })

    # Non-starred keywords can be in should (optional, can expand as needed)
    for item in search_data.get("searchKeywords", []):
        if not item.get("isNecessary", False):
            should_conditions.append({
                "nested": {
                    "path": "skills",
                    "query": {
                        "match": {
                            "skills.skill_name": {
                                "query": item["text"],
                                "max_expansions": 50
                            }
                        }
                    }
                }
            })

    # 2. Experience (must)
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

    # 3. Location (must)
    location = search_data.get("location")
    if location:
        must_conditions.append({
            "match": {
                "city": {
                    "query": location,
                    "max_expansions": 50,
                    "operator": "or",
                    "fuzziness": "AUTO",
                }
            }
        })

    # 4. Salary (must, with should for salary not provided)
    min_salary = search_data.get("minSalary")
    max_salary = search_data.get("maxSalary")
    salary_not_provided = search_data.get("salaryNotProvided")

    salary_shoulds = []
    if min_salary != "" and max_salary != "":
        salary_shoulds.append({
            "range": {
                "annual_salary": {
                    "gte": float(min_salary),
                    "lte": float(max_salary)
                }
            }
        })
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

    # If either salary range or not provided is specified, use should with min 1
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
                                "operator": "or",
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
                                "operator": "or",
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
                "industry": {"query": industry, "operator": "or", "fuzziness": "AUTO"}
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
                                "operator": "or",
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


