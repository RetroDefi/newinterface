import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { hideTopAlert } from '../../state/application/actions'


const useHideAlert = () => {
    const dispatch = useDispatch()
    
    return useCallback(() => {
        dispatch(hideTopAlert())
    }, [dispatch])
}

export default useHideAlert
