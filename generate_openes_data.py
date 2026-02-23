import json

def get_topic(code):
    if not code: return "Other"
    code = code.upper()
    if code.startswith('TS'): return "Relevant sustainability topics"
    if code.startswith('BM') or code.startswith('RBM'): return "Company model and strategy"
    if code.startswith('IRO'): return "Impacts, risks and opportunities"
    if code.startswith('EI'): return "Ethics and integrity"
    if code.startswith('DI'): return "Diversity and Inclusion"
    if code.startswith('HU') or code.startswith('RHU'): return "Human Rights"
    if code.startswith('HS') or code.startswith('EO'): return "Occupational health and safety"
    if code.startswith('CC') or code.startswith('RCC'): return "Climate change"
    if code.startswith('AR') or code.startswith('RAR'): return "Water and effluents"
    if code.startswith('RC') or code.startswith('RRC'): return "Waste"
    if code.startswith('VCM'): return "Supplier environmental assessment"
    return "Governance and Strategy"

def generate_ts():
    with open('esg_questionnaire_data.json', 'r') as f:
        full_data = json.load(f)
    
    questions = full_data['Your answers']
    
    topics_map = {}
    
    for q in questions:
        pillar = q.get('Pillar') or "Other"
        level = q.get('Level')
        
        # Handle NaN or None
        if level is None or (isinstance(level, float) and level != level): # level != level is a check for NaN
            level_key = 3
        else:
            level_key = int(level)
        
        topic_name = get_topic(q['Application code'])
        
        if level_key not in topics_map:
            topics_map[level_key] = {}
        
        if pillar not in topics_map[level_key]:
            topics_map[level_key][pillar] = {}
            
        if topic_name not in topics_map[level_key][pillar]:
            topics_map[level_key][pillar][topic_name] = {
                "id": f"T-{level_key}-{pillar[:1]}-{len(topics_map[level_key][pillar])}",
                "questions": []
            }
            
        topics_map[level_key][pillar][topic_name]["questions"].append({
            "id": q['Application code'] or f"Q-{len(topics_map[level_key][pillar][topic_name]['questions'])}",
            "text": q['Request'],
            "pillar": pillar
        })

    # Sort levels and pillars
    ts_content = "export interface OpenEsQuestion {\n    id: string;\n    text: string;\n    pillar: string;\n}\n\n"
    ts_content += "export interface OpenEsTopic {\n    id: string;\n    name: string;\n    questions: OpenEsQuestion[];\n}\n\n"
    ts_content += "export interface OpenEsPillar {\n    name: string;\n    topics: OpenEsTopic[];\n}\n\n"
    ts_content += "export interface OpenEsClass {\n    id: number;\n    name: string;\n    pillars: OpenEsPillar[];\n}\n\n"
    
    class_names = {1: "Fundamentals", 2: "Maturity", 3: "Master"}
    
    classes_data = []
    for l_key in sorted(topics_map.keys()):
        pillars_data = []
        for p_key in sorted(topics_map[l_key].keys()):
            topics_data = []
            for t_name, t_data in topics_map[l_key][p_key].items():
                topics_data.append({
                    "id": t_data["id"],
                    "name": t_name,
                    "questions": t_data["questions"]
                })
            pillars_data.append({
                "name": p_key,
                "topics": topics_data
            })
        classes_data.append({
            "id": l_key,
            "name": class_names.get(l_key, f"Class {l_key}"),
            "pillars": pillars_data
        })
        
    ts_content += f"export const OPEN_ES_CLASSES: OpenEsClass[] = {json.dumps(classes_data, indent=4)};\n"
    
    with open('src/lib/esg-standards-data.ts', 'w') as f:
        f.write(ts_content)
    print("Generated src/lib/esg-standards-data.ts")

generate_ts()
