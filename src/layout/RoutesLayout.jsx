import styles from './RoutesLayout.module.css'
import Aside from '../components/aside/Aside'
import { Outlet } from 'react-router-dom'
import NetworkErr from '../components/modals/NetworkErr'


const RoutesLayout = ({ darkMode, setDarkMode }) => {
  return (
    <div className={styles.container}>
      <Aside />
      
      <main>
        <Outlet context={{ darkMode, setDarkMode }} />
      </main>

      <NetworkErr />
    </div>
  )
}

export default RoutesLayout