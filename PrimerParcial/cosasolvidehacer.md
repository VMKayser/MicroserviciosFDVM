curl http://localhost:3001/api/v1/salud
curl "http://localhost:3001/api/v1/pacientes?pagina=1&tam=2"
curl http://localhost:3001/api/v1/pacientes/1






































grpcurl -plaintext -import-path ./ms-medicos/proto -proto medicos.proto -d '{}' localhost:50051 clinica.medicos.v1.ServicioMedicos/ListarMedicos

grpcurl -plaintext -import-path ./ms-medicos/proto -proto medicos.proto -d '{"id": 1}' localhost:50051 clinica.medicos.v1.ServicioMedicos/ObtenerMedico

grpcurl -plaintext -import-path ./ms-medicos/proto -proto medicos.proto -d '{"id": 1}' localhost:50051 clinica.medicos.v1.ServicioMedicos/ListarHorariosDisponibles

grpcurl -plaintext -import-path ./ms-medicos/proto -proto medicos.proto -d '{"id": 2}' localhost:50051 clinica.medicos.v1.ServicioMedicos/ReservarHorario