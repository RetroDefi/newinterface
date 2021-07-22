import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addPopup, PopupContent } from '../../state/application/actions'


const useAddPopup = () => {
    const dispatch = useDispatch()
    
    return useCallback((content: PopupContent, key?: string) => {
        dispatch(addPopup({ content, key }))
    }, [dispatch])
}

export default useAddPopup
