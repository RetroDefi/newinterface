import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../../state'


const useActivePopups = () => {
    const list = useSelector((state: AppState) => state.application.popupList)
    return useMemo(() => list.filter(item => item.show), [list])
}

export default useActivePopups
