import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { removePopup } from '../../state/application/actions'


const useRemovePopup = () => {
    const dispatch = useDispatch()
    
    return useCallback((key: string) => {
        dispatch(removePopup({ key }))
    }, [dispatch])
}

export default useRemovePopup
