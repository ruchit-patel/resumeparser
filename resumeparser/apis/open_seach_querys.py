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
            

def final_search_query(search_data: dict) -> dict:
    print("search_data : ---------------",search_data)
    must_conditions = []
    should_conditions = []
    must_not_condotions= []
    
    # location
    if search_data.get("location") != "" and len(search_data.get("location")) >= 1:
        print("location : ---------------",search_data.get("location"))
        condition = {
                "match": {
                            "city": {
                                "query": search_data.get("location"),
                                "max_expansions": 50,
                                "operator": "or",
                                "fuzziness": "AUTO",
                            }
                        }
                    }
        should_conditions.append(condition)
    # Education PG
    if search_data.get("pgcourse") != "" and len(search_data.get("pgcourse")) >= 1:
      for item in search_data.get("pgcourse", []):
        condition = {
            "nested": {
                "path": "education",
                "query": {
                    "bool": {
                        "should": [
                            # Match for course_name with department
                            {
                                "match": {
                                    "education.course_name": {
                                        "query": item["department"],
                                        "operator": "or",
                                        "fuzziness": "AUTO"
                                    }
                                }
                            },
                            # Match for specialization with department
                            {
                                "match": {
                                    "education.specialization": {
                                        "query": item["department"],
                                        "operator": "or",
                                        "fuzziness": "AUTO"
                                    }
                                }
                            },
                            # Match for course_name with role
                            {
                                "match": {
                                    "education.course_name": {
                                        "query": item["role"],
                                        "operator": "or",
                                        "fuzziness": "AUTO"
                                    }
                                }
                            },
                            # Match for specialization with role
                            {
                                "match": {
                                    "education.specialization": {
                                        "query": item["role"],
                                        "operator": "or",
                                        "fuzziness": "AUTO"
                                    }
                                }
                            },
                            # Year-based range filter (from and to year)
                            {
                                "bool": {
                                    "must": [
                                        {
                                            "range": {
                                                "education.from": {
                                                    "gte": f"{search_data.get('pgfromYear')}-01-01",
                                                    "lte": f"{search_data.get('pgfromYear')}-12-31"
                                                }
                                            }
                                        },
                                        {
                                            "range": {
                                                "education.to": {
                                                    "gte": f"{search_data.get('pgtoYear')}-01-01",
                                                    "lte": f"{search_data.get('pgtoYear')}-12-31"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
        should_conditions.append(condition)

    if search_data.get("pginstitute") != "" and len(search_data.get("pginstitute")) >= 1:
      condition = {
                "nested": {
                    "path": "education",
                    "query": {
                        "match": {
                            "education.school_college_name": {
                                "query": search_data.get("pginstitute"),
                                "max_expansions": 50,
                                "boost": 5.0
                            }
                        }
                    }
                }
            }
      should_conditions.append(condition)

    # Education UG
    if search_data.get("ugcourse") != "" and len(search_data.get("ugcourse")) >= 1:
      for item in search_data.get("ugcourse", []):
        condition =  {
                "nested": {
                      "path": "education",
                      "query": {
                        "match": {
                          "education.course_name": {
                            "query": item["department"],
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    },
                "nested": {
                      "path": "education",
                      "query": {
                        "match": {
                          "education.specialization": {
                            "query": item["department"],
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    },
                "nested": {
                      "path": "education",
                      "query": {
                        "match": {
                          "education.course_name": {
                            "query": item["role"],
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    },
                "nested": {
                      "path": "education",
                      "query": {
                        "match": {
                          "education.specialization": {
                            "query": item["role"],
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    }
                
            }
        should_conditions.append(condition)

    if search_data.get("uginstitute") != "" and len(search_data.get("uginstitute")) >= 1:
      condition = {
                "nested": {
                    "path": "education",
                    "query": {
                        "match": {
                            "education.school_college_name": {
                                "query": search_data.get("uginstitute"),
                                "max_expansions": 50,
                                "boost": 5.0
                            }
                        }
                    }
                }
            }
      should_conditions.append(condition)

    
    # For Employeement company 
    if search_data.get("company") != "" and len(search_data.get("company")) >= 1:
      condition = {
                "nested": {
                    "path": "experience",
                    "query": {
                        "match": {
                            "experience.company_name": {
                                "query": search_data.get("company"),
                                "max_expansions": 50
                            }
                        }
                    }
                }
            }
      should_conditions.append(condition)

      # For Employeement industry 
      if search_data.get("industry") != "" and len(search_data.get("industry")) >= 1:
        condition = {
                  "nested": {
                      "path": "experience",
                      "query": {
                          "match": {
                              "experience.company_name": {
                                  "query": search_data.get("industry"),
                                  "max_expansions": 50
                              }
                          }
                      }
                  }
              }
        should_conditions.append(condition)

    # For Employeement designation
    if search_data.get("designation") != "" and len(search_data.get("designation")) >= 1:
      find_in = [("education","education.course_name"),("experience","experience.role_position"),("experience","experience.job_description")]
      for item in find_in:
        condition = {
                "nested": {
                      "path": item[0],
                      "query": {
                        "match": {
                          item[1]: {
                            "query": search_data.get("designation"),
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    }
            }
        should_conditions.append(condition)

    # For Employeement excludeCompanies
    if search_data.get("excludeCompanies") != "" and len(search_data.get("excludeCompanies")) >= 1:
      for item in search_data.get("excludeCompanies", []):
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
        must_not_condotions.append(condition)
    # departmentes
    if search_data.get("departmentes") != "" and len(search_data.get("departmentes")) >= 1:
      for item in search_data.get("departmentes", []):
        condition =  {
                "nested": {
                      "path": "experience",
                      "query": {
                        "match": {
                          "experience.role_position": {
                            "query": item["department"],
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    },
                "nested": {
                      "path": "experience",
                      "query": {
                        "match": {
                          "experience.job_description": {
                            "query": item["department"],
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    },
                "nested": {
                      "path": "experience",
                      "query": {
                        "match": {
                          "experience.role_position": {
                            "query": item["role"],
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    },
                "nested": {
                      "path": "experience",
                      "query": {
                        "match": {
                          "experience.job_description": {
                            "query": item["role"],
                            "operator": "or",
                            "fuzziness": "AUTO"
                          }
                        }
                      }
                    }
                
            }
        should_conditions.append(condition)

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
                        "match": {
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
            "must_not":must_not_condotions,
            "minimum_should_match": 0
        }
    }
    
    # Add experience filtering if needed
    min_exp = search_data.get("minExperience")
    max_exp = search_data.get("maxExperience")
    
    if min_exp !="" and max_exp != "":
        query_part = {
                "script_score": {
                    "query": query_part,
                    "script": {
                        "source": f"""
                            long totalMillis = 0;
                            for (exp in params._source.experience) {{
                                if (exp.from != null && exp.to != null) {{
                                    ZonedDateTime from = ZonedDateTime.parse(exp.from + "T00:00:00Z");
                                    ZonedDateTime to = ZonedDateTime.parse(exp.to + "T00:00:00Z");
                                    totalMillis += ChronoUnit.MILLIS.between(from, to);
                                }}
                            }}
                            double totalYears = totalMillis / 1000.0 / 60 / 60 / 24 / 365;
                            return (totalYears >= {min_exp} && totalYears <= {max_exp}) ? 1 : 0;
                        """
                    }
                }
            }

        
    # Final structure
    return {
        "size": 20,
        # "_source": ["id"],
        "query": query_part
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