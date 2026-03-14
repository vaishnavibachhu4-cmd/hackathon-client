$body = '{"email":"admin@example.com","password":"adminpassword123"}'
$response = Invoke-RestMethod -Method POST -Uri "https://hackathon-server-uz55.onrender.com/api/auth/login" -ContentType "application/json" -Body $body
$response | ConvertTo-Json
