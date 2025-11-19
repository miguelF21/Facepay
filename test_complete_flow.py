"""
Script de prueba completa del flujo end-to-end
1. Crear empleado en MongoDB
2. Simular reconocimiento facial
3. Verificar registro de asistencia
4. Calcular nómina
"""

import requests
import json
from datetime import datetime

API_BASE = "http://localhost:5000/api"

def test_complete_flow():
    print("=" * 70)
    print("TESTING COMPLETE FACEPAY WORKFLOW")
    print("=" * 70)
    
    # 1. Check API health
    print("\n1. Checking API health...")
    response = requests.get(f"{API_BASE}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    
    # 2. Create test employee
    print("\n2. Creating test employee...")
    employee_data = {
        "employee_code": "TEST001",
        "first_name": "John",
        "last_name": "Doe",
        "document_type": "CC",
        "document_number": "1234567890",
        "email": "john.doe@facepay.com",
        "phone": "3001234567",
        "birth_date": "1990-01-01",
        "position": "Developer",
        "department": "IT",
        "salary": 5000000,
        "contract_type": "Indefinido"
    }
    
    response = requests.post(f"{API_BASE}/employees", json=employee_data)
    print(f"   Status: {response.status_code}")
    if response.status_code in [200, 201]:
        print(f"   Employee created: {response.json()['data']['employee_code']}")
    else:
        print(f"   Error: {response.json()}")
    
    # 3. Simulate facial recognition
    print("\n3. Simulating facial recognition...")
    facial_data = {
        "employee_code": "TEST001",
        "name": "John Doe",
        "confidence": 0.95
    }
    
    response = requests.post(f"{API_BASE}/facial-auth", json=facial_data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Action: {result['action']}")
        print(f"   Message: {result['message']}")
    else:
        print(f"   Error: {response.json()}")
    
    # 4. Check attendance records
    print("\n4. Checking attendance records...")
    today = datetime.now().date().isoformat()
    response = requests.get(f"{API_BASE}/attendance", params={
        "employee_id": "TEST001",
        "date_from": today,
        "date_to": today
    })
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        records = response.json()['data']
        print(f"   Found {len(records)} attendance record(s)")
        if records:
            print(f"   Check-in: {records[0].get('check_in')}")
            print(f"   Status: {records[0].get('status')}")
    
    # 5. Calculate payroll
    print("\n5. Calculating payroll...")
    period = datetime.now().strftime("%Y-%m")
    response = requests.post(f"{API_BASE}/payroll/calculate", json={"period": period})
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Message: {result['message']}")
        print(f"   Records calculated: {len(result['data'])}")
    
    # 6. Get dashboard stats
    print("\n6. Getting dashboard stats...")
    response = requests.get(f"{API_BASE}/dashboard/stats")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        stats = response.json()['data']
        print(f"   Total employees: {stats['total_employees']}")
        print(f"   Today attendance: {stats['today_attendance']}")
        print(f"   Present now: {stats['present_now']}")
    
    print("\n" + "=" * 70)
    print("TEST COMPLETED")
    print("=" * 70)

if __name__ == "__main__":
    test_complete_flow()
