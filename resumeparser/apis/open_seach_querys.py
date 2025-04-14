
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
            

def final_search_query(search_data: dict) -> dict:
    must_conditions = []
    should_conditions = []
    
    # Process both skills and searchKeywords
    for key in ["skills", "searchKeywords"]:
        for item in search_data.get(key, []):
            # Determine field path
            if key == "skills" or item.get("cat") == "skills":
                path = "skills"
                field = "skills.skill_name"
            elif item.get("cat") == "designations":
                path = "experience"
                field = "experience.role_position"
            elif item.get("cat") == "companies":
                path = "experience"
                field = "experience.company_name"
            else:
                path = "skills"
                field = "skills.skill_name"
                
            # Create condition
            condition = {
                "nested": {
                    "path": path,
                    "query": {
                        "match_phrase_prefix": {
                            field: {
                                "query": item["text"],
                                "max_expansions": 50
                            }
                        }
                    }
                }
            }
            
            # Add to appropriate list
            if item.get("isNecessary", False):
                must_conditions.append(condition)
            else:
                should_conditions.append(condition)

    # Base query structure
    query_part = {
        "bool": {
            "must": must_conditions,
            "should": should_conditions,
            "minimum_should_match": 0
        }
    }
    
    # Add experience filtering if needed
    min_exp = search_data.get("minExperience")
    max_exp = search_data.get("maxExperience")
    
    if min_exp is not None and max_exp is not None:
        query_part = {
            "script_score": {
                "query": query_part,
                "script": {
                    "source": """
                            long totalMillis = 0;
                            for (exp in params._source.experience) {{
                                if (exp.from != null && exp.to != null) {{
                                    ZonedDateTime from = ZonedDateTime.parse(exp.from + 'T00:00:00Z');
                                    ZonedDateTime to = ZonedDateTime.parse(exp.to + 'T00:00:00Z');
                                    totalMillis += ChronoUnit.MILLIS.between(from, to);
                                }}
                            }}
                            double totalYears = totalMillis / 1000.0 / 60 / 60 / 24 / 365;
                            return (totalYears >= {0} && totalYears <= {1}) ? 1 : 0;
                        """.format(min_exp, max_exp)
                    }
                }
            }
        
    # Final structure
    return {
        "size": 20,
        # "_source": ["id"],
        "query": query_part
    }