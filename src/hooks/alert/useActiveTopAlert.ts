import { useSelector } from 'react-redux'
import { AppState } from '../../state'


const useActivePopups = () => {
    return useSelector((state: AppState) => state.application.topAlert)
}

export default useActivePopups
