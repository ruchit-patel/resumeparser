
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
                        }
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
            

def final_search_query(data) -> dict:
    # Calculate age range dates
    from datetime import datetime, timedelta
    current_year = datetime.now().year
    min_birth_year = current_year - int(data.get('candidateMaxAge', 100))
    max_birth_year = current_year - int(data.get('candidateMinAge', 18))

    # Build must conditions
    must_conditions = []
    should_conditions = []
    filter_conditions = []

    # Basic filters
    if data.get('gender') and data['gender'] != 'all':
        must_conditions.append({
            "match": {"gender": data['gender']}
        })

    # Experience filter
    min_exp = float(data.get('minExperience', 0))
    max_exp = float(data.get('maxExperience', 100))
    
    # Calculate total experience from experience array
    filter_conditions.append({
        "script": {
            "script": {
                "source": """
                    double total_exp = 0;
                    if (doc['experience'].size() > 0) {
                        for (exp in doc['experience']) {
                            def from_date = exp.from;
                            def to_date = exp.current_position ? new Date().getTime() : (exp.to != null ? exp.to : new Date().getTime());
                            total_exp += ((to_date - from_date) / (365.25 * 24 * 60 * 60 * 1000));
                        }
                    }
                    return total_exp >= params.min_exp && total_exp <= params.max_exp;
                """,
                "params": {
                    "min_exp": min_exp,
                    "max_exp": max_exp
                }
            }
        }
    })

    # Skills matching
    if data.get('skills'):
        skill_names = [skill.get('skill_name') for skill in data['skills'] if skill.get('skill_name')]
        if skill_names:
            should_conditions.append({
                "terms": {
                    "skills.skill_name.keyword": skill_names,
                    "boost": 2.0
                }
            })

    # Education matching
    if data.get('ugcourse'):
        education_conditions = []
        for course in data['ugcourse']:
            education_conditions.append({
                "match": {
                    "education.course_name": {
                        "query": course.get('course', ''),
                        "boost": 1.5
                    }
                }
            })
        should_conditions.extend(education_conditions)

    # Location matching
    if data.get('location'):
        should_conditions.append({
            "match": {
                "_all": {
                    "query": data['location'],
                    "boost": 1.0
                }
            }
        })

    # Department and role matching
    if data.get('departmentes'):
        dept_conditions = []
        for dept in data['departmentes']:
            dept_conditions.append({
                "match_phrase": {
                    "experience.role_position": {
                        "query": dept.get('role', ''),
                        "boost": 2.0
                    }
                }
            })
        should_conditions.extend(dept_conditions)

    # Build the final query
    query = {
        "size": 20,  # Get top 20 results
        "query": {
            "bool": {
                "must": must_conditions,
                "should": should_conditions,
                "filter": filter_conditions,
                "minimum_should_match": 1
            }
        },
        "sort": [
            "_score",
            {"_id": "desc"}
        ],
        "_source": ["_id", "candidate_name", "email", "mobile_number", "experience.role_position", "skills.skill_name"],
        "highlight": {
            "fields": {
                "skills.skill_name": {},
                "experience.role_position": {},
                "education.course_name": {}
            }
        }
    }

    return query