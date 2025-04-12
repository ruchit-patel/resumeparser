
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
            