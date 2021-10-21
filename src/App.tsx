import { LoginBox } from './components/loginBox';
import { MessageList } from './components/messageList';
import { SendMessageForm } from './components/sendMEssageForm';
import { useAuth } from './hooks/useAuth';
import styles from './styles/app.module.scss';


export function App() {
  const { user } = useAuth();
  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessageList />
      {!!user ? <SendMessageForm /> : <LoginBox /> }
    </main>
  )
}
