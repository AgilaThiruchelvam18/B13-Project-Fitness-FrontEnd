import { useState } from 'react';
import Modal from '../components/Modal';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

export default function CustomerAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Customer Login</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {showLogin ? <LoginForm onSwitch={() => setShowLogin(false)} /> : <SignupForm onSwitch={() => setShowLogin(true)} />}
      </Modal>
    </div>
  );
}