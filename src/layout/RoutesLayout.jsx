import styles from './RoutesLayout.module.css'
import Aside from '../components/aside/Aside'
import { Outlet } from 'react-router-dom'
import NetworkErr from '../components/modals/networkErr'


const RoutesLayout = () => {
  return (
    <div className={styles.container}>
      <Aside/>
      <main>
        <Outlet/>
      </main>

      <NetworkErr />
    </div>
  )
}

export default RoutesLayout
