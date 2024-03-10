import { Form, Button, Alert } from "react-bootstrap";
import React, { useState } from "react";
import "../styles/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState(null);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    // Şifrenin en az 6 karakter uzunluğunda olmasını, en az bir büyük harf, bir küçük harf ve bir rakam içermesini istiyoruz.
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    return minLength && hasUpperCase && hasLowerCase && hasNumbers;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setRegisterStatus({
        type: "warning",
        message: "Geçersiz email adresi.",
      });
      return;
    }

    if (!isValidPassword(password)) {
      setRegisterStatus({
        type: "warning",
        message: "Şifreniz güvenli değil.",
      });
      return;
    }

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
