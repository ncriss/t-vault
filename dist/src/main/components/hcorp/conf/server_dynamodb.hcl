storage "dynamodb" {
  ha_enabled    = "true"
  read_capacity  = 20
  write_capacity = 15
}

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_cert_file = "/opt/tvault/certs/tvault.crt"
  tls_key_file  = "/opt/tvault/certs/tvault.key"
 }
