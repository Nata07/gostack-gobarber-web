import * as Yup from 'yup';
import React, {useRef, useCallback} from 'react';
import {FiLogIn, FiMail, FiLock} from 'react-icons/fi'
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationsErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import {Container, Content, Background, AnimationContent} from './styles';
import { Link, useHistory } from 'react-router-dom';


interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const {signIn} = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('Email é obrigatório').email('Digite um email valído'),
        password: Yup.string().required('Senha é obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

     await signIn({
        email: data.email,
        password: data.password
      });

      history.push('/dashboard');

    }catch(err){
      if(err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao fazer login, verifique suas credenciais',
      });
    }
  }, [signIn, addToast, history]);

  return (

    <Container>
      <Content>
        <AnimationContent>
          <img src={logo} alt="GoBarber"/>

          <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Faça seu logon</h1>
              <Input name="email" icon={FiMail} placeholder="E-mail"/>

              <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>

              <Button type="submit">Entrar</Button>

              <a href="login">
                Esqueci a senha
              </a>

          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar minha conta
          </Link>
        </AnimationContent>
      </Content>
      <Background />
    </Container>
  )
}

export default SignIn;
