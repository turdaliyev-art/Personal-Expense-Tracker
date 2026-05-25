import styles from './RoutesLayout.module.css'
import Aside from '../components/aside/Aside'
import { Outlet } from 'react-router-dom'


const RoutesLayout = () => {
  return (
    <div className={styles.container}>
      <Aside/>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default RoutesLayout
