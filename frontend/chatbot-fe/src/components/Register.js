import { Form, Button, Alert } from "react-bootstrap";
import React, { useState } from "react";
import "../styles/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Login successful
        setRegisterStatus({ type: "success", message: "Kayıt başarılı" });
        window.location.reload();
      } else {
        // Login failed
        setRegisterStatus({ type: "warning", message: "Kayıt başarısız" });
      }
    } catch (error) {
      console.error("Giriş sırasında hata:", error);
      setRegisterStatus({ type: "warning", message: "Bir şeyler ters gitti." });
    }
  };

  return (
    <div>
      <div className="register-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="register-box">
          {registerStatus && (
            <Alert
              variant={registerStatus.type}
              onClose={() => setRegisterStatus(null)}
              className="alert-custom"
            >
              {registerStatus.message}
            </Alert>
          )}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email adresi"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text
                className="text-muted"
                style={{
                  fontSize: "10px",
                }}
              >
                Bilgilerinizi kimseyle paylaşmayacağız.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                placeholder="Şifre"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="formBasicCheckbox"
            ></Form.Group>
            <Button
              style={{
                backgroundColor: "#282C34",
                color: "#DFF5CE",
                cursor: "pointer",
                border: "none",
                borderRadius: "20px",
                outline: "none",
                padding: "5px 20px",
                marginTop: "14px",
              }}
              variant="primary"
              type="submit"
            >
              Kayıt
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
