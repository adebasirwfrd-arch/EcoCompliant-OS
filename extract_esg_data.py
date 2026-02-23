import pandas as pd
import json

file_path = '/Users/izzadev/.gemini/antigravity/scratch/env-management-app/ESG/Open-es ESG Questionnaire.xlsx'

def extract_excel_data(path):
    # Read all sheets to see what's inside
    try:
        xl = pd.ExcelFile(path)
        print(f"Sheets: {xl.sheet_names}")
        
        results = {}
        for sheet_name in xl.sheet_names:
            df = xl.parse(sheet_name)
            # Remove NaN values and convert to dict
            sheet_data = df.where(pd.notnull(df), None).to_dict(orient='records')
            results[sheet_name] = sheet_data
            
        with open('esg_questionnaire_data.json', 'w') as f:
            json.dump(results, f, indent=4)
        print("Data extracted to esg_questionnaire_data.json")
    except Exception as e:
        print(f"Error: {e}")

extract_excel_data(file_path)
