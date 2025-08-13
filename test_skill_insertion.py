#!/usr/bin/env python3
"""
Test script to verify skill insertion functionality
This script simulates the resume parsing and skill insertion process
"""

import json
import sys
import os

# Add the frappe path
sys.path.insert(0, '/home/jay/project/frappe-bench/apps/frappe')
sys.path.insert(0, '/home/jay/project/frappe-bench/apps/resumeparser')

def test_skill_insertion():
    """Test the skill insertion logic"""
    
    # Sample resume JSON data with skills
    sample_resume_data = {
        "candidate_name": "John Doe",
        "email": "john.doe@example.com",
        "skills": [
            {"skill_name": "Python", "skill_type": "Technical"},
            {"skill_name": "JavaScript", "skill_type": "Technical"},
            {"skill_name": "Communication", "skill_type": "Soft"},
            {"skill_name": "Leadership", "skill_type": "Soft"},
            {"skill_name": "React", "skill_type": "Technical"},
            {"skill_name": "Python", "skill_type": "Technical"},  # Duplicate to test
        ]
    }
    
    print("=== Testing Skill Insertion Logic ===")
    print(f"Sample resume data: {json.dumps(sample_resume_data, indent=2)}")
    
    # Simulate the skill processing logic
    skills = sample_resume_data.get('skills', [])
    processed_skills = []
    unique_skills = set()
    
    if not skills or not isinstance(skills, list):
        print("No skills found in resume data")
        return
    
    print("\n=== Processing Skills ===")
    
    # Process each skill
    for skill_data in skills:
        if not isinstance(skill_data, dict):
            continue
            
        skill_name = skill_data.get('skill_name', '').strip()
        skill_type = skill_data.get('skill_type', '').strip()
        
        # Validate skill data
        if not skill_name:
            continue
        
        # Check for duplicates (case-insensitive)
        skill_key = skill_name.lower()
        if skill_key in unique_skills:
            print(f"⚠️  Duplicate skill found: '{skill_name}' - SKIPPING")
            continue
        
        # Map skill_type to match the Select options in Skill Master
        if skill_type.lower() in ['technical', 'tech']:
            skill_type = 'Technical'
        elif skill_type.lower() in ['soft', 'soft skill']:
            skill_type = 'Soft'
        else:
            # Default to 'Technical' if not specified or unclear
            skill_type = 'Technical'
        
        # Add to processed skills
        processed_skill = {
            "skill_name": skill_name,
            "skill_type": skill_type
        }
        processed_skills.append(processed_skill)
        unique_skills.add(skill_key)
        
        print(f"✅ Processed skill: {skill_name} ({skill_type})")
    
    print("\n=== Final Results ===")
    print(f"Total skills in resume: {len(skills)}")
    print(f"Unique skills processed: {len(processed_skills)}")
    print(f"Skills that would be added to Skill Master:")
    
    for skill in processed_skills:
        print(f"  - {skill['skill_name']} ({skill['skill_type']})")
    
    print("\n=== Test Completed Successfully ===")

if __name__ == "__main__":
    test_skill_insertion()