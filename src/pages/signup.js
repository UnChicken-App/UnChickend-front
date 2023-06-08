import useSignUp from "@/api/hooks/useSignUp";
import { NeonButton } from "@/components/common/button";
import Header from "@/components/layout/header";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { isEmail, isLength } from "validator";

export default function signUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState();

  const router = useRouter();

  const [errorEmail, setErrorEmail] = useState([]);
  const [errorPassword, setErrorPassword] = useState([]);

  const { signUpLoading, signUp } = useSignUp();

  function isFormValid() {
    return (
      email !== "" &&
      password !== "" &&
      name !== "" &&
      confirmPassword !== "" &&
      confirmEmail !== ""
    );
  }

  async function createAcount(e) {
    e.preventDefault();
    const newErrorEmail = [];
    const newErrorPassword = [];

    if (email !== confirmEmail) {
      newErrorEmail.push(1);
    }

    if (password !== confirmPassword) {
      newErrorPassword.push(1);
    }

    if (!isEmail(email)) {
      newErrorEmail.push(2);
    }

    if (!isLength(password, { min: 6 })) {
      newErrorPassword.push(2);
    }

    setErrorEmail(newErrorEmail);
    setErrorPassword(newErrorPassword);

    if (newErrorEmail.length > 0 || newErrorPassword.length > 0) {
      return;
    }
    const body = {
      name,
      email,
      password,
    };

    try {
      const response = await signUp(body);
      console.log(response);
      router.push("/signin");
    } catch (error) {
      return setError(error.response.status);
    }
  }

  return (
    <>
      <Header />
      <Body>
        <SignInContainer>
          <h1>Cadastre-se</h1>

          <form onSubmit={createAcount}>
            <Input
              placeholder="Nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="E-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              errorNeon={errorEmail.length > 0 || error === 409}
            />
            <Input
              placeholder="Confirme o e-mail"
              type="text"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              errorNeon={errorEmail.length > 0 || error === 409}
            />

            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              errorNeon={errorPassword.length > 0}
            />
            <Input
              placeholder="Confirme a senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              errorNeon={errorPassword.length > 0}
            />
            {errorEmail.includes(1) && (
              <h2>* Os campos de email e confirmar email devem ser iguais.</h2>
            )}
            {errorPassword.includes(1) && (
              <h2>* Os campos de senha e confirmar senha devem ser iguais.</h2>
            )}
            {errorEmail.includes(2) && (
              <h2>* O email fornecido não é válido.</h2>
            )}
            {errorPassword.includes(2) && (
              <h2>* A senha deve ter pelo menos 6 caracteres.</h2>
            )}
            {error === 409 && <h2>* O email fornecido já está cadastrado.</h2>}
            <StyleNeonButton
              type="submit"
              hover={isFormValid()}
              disabled={signUpLoading}
            >
              Cadrastre-se
            </StyleNeonButton>
          </form>
          <Link style={{ textDecoration: "none" }} href="/signin">
            <h3>
              Já possui conta? <br /> entre aqui!
            </h3>
          </Link>
        </SignInContainer>
      </Body>
    </>
  );
}

const StyleNeonButton = styled(NeonButton)`
  margin-top: 20px;
`;

const Body = styled.div`
  background-image: linear-gradient(
      90deg,
      rgba(2, 0, 36, 0.5) 0%,
      rgba(0, 0, 0, 1) 57%
    ),
    url("acad_led_1.jpg");
  background-repeat: no-repeat;
  background-size: auto;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  font-family: "Roboto", sans-serif;
`;

const SignInContainer = styled.div`
  margin-top: 80px;
  padding: 30px;
  background-color: black;
  border: 2px solid #00d9ff;
  color: #00d9ff;
  box-shadow: 0 0 35px #00d9ff, 0 0 15px #00d9ffc0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  font-family: "Roboto", sans-serif;
  h1 {
    margin-bottom: 20px;
    padding-bottom: 10px;
    color: #00d9ff;
    text-shadow: 0px 0px 10px #00d9ffcc, 0px 0px 3px #00d9ff;
    font-size: 40px;
    font-family: "Roboto", sans-serif;
    font-weight: bold;
  }
  h2 {
    font-size: 10px;
    white-space: pre-line;
    color: #ff5555;
    text-shadow: 0px 0px 10px #ff5555cc, 0px 0px 3px #ff5555;
    margin-top: 7px;
  }
  h3 {
    margin-top: 40px;
    padding-bottom: 10px;
    color: #808080;
    font-size: 15 px;
    font-weight: bold;
    white-space: pre-line;

    :hover {
      color: #00d9ff;
      text-shadow: 0px 0px 10px #00d9ffcc, 0px 0px 3px #00d9ff;
    }
  }

  form {
    display: flex;
    flex-direction: column;
  }
`;

const Input = styled.input`
  width: 300px;
  padding: 2px 10px;
  color: ${(props) => (props.errorNeon ? "#ff5555" : "#00d9ff")};
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.errorNeon ? "#ff5555" : "#00d9ff")};
  background-color: black;
  margin: 15px 0px;
  outline: none;
  box-shadow: ${(props) =>
    props.errorNeon
      ? "0 8px 15px -15px #ff5555, 0 8px 10px -5px #ff5555c0"
      : "0 8px 15px -15px #00d9ff, 0 8px 10px -5px #00d9ffc0"};
  border-radius: 10px;
  text-shadow: ${(props) =>
    props.errorNeon
      ? "0px 0px 10px #ff5555cc, 0px 0px 3px #ff5555"
      : "0px 0px 10px #00d9ffcc, 0px 0px 3px #00d9ff"};

  :focus::-webkit-input-placeholder {
    color: transparent;
  }
  ::placeholder {
    color: #808080;
    text-shadow: none;
    font-size: 15px;
  }
`;
