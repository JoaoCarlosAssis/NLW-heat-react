import { VscGithubInverted } from 'react-icons/vsc'
import { useAuth } from '../../hooks/useAuth'
import styles from './styles.module.scss'

export function LoginBox() {

  const { singInUrl } = useAuth()

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe a sua mensagem</strong>
      <a href={singInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted /> Entrar com Github
      </a>
    </div>
  )
}