import React, { useEffect } from 'react'
import useActiveTopAlert from '../../hooks/alert/useActiveTopAlert'
import { ExternalLink, X } from 'react-feather'
import { colorWhite } from '../../colors'
import useHideAlert from '../../hooks/alert/useHideAlert'
import { useHistory } from 'react-router-dom'
import './TopAlert.scss'


const TopAlert: React.FC = () => {
    const activeTopAlert = useActiveTopAlert()
    const hideAlert = useHideAlert()
    const history = useHistory()
    
    useEffect(() => {
        const toTop = () => window.scrollTo(0, 0)
        window.addEventListener('beforeunload', toTop)
        
        return () => window.removeEventListener('beforeunload', toTop)
    }, [])
    
    useEffect(() => {
        if (!activeTopAlert) return
        if (activeTopAlert.removeAfterMs === null) return
        
        const timeout = setTimeout(() => hideAlert(), activeTopAlert.removeAfterMs)
        return () => clearTimeout(timeout)
    }, [activeTopAlert, hideAlert])
    
    const onDismiss = (e: any) => {
        if (e) e.stopPropagation()
        hideAlert()
    }
    
    const handleLink = () => {
        if (!activeTopAlert.content.link) return
        if (activeTopAlert.content.link.startsWith('/')) {
            history.push(activeTopAlert.content.link)
        } else {
            window.open(activeTopAlert.content.link, activeTopAlert.content.external ? '_blank' : '_self')
        }
        hideAlert()
    }
    
    if (!activeTopAlert) return <div className='top-alert hide no-select'/>
    return (
        <div className={`top-alert show no-select ${activeTopAlert.content.link && 'clickable'}`} onClick={handleLink}>
            <div className='message'>
                {activeTopAlert.content.message}
                {activeTopAlert.content.link && <ExternalLink className='external-icon' color={colorWhite} size={18}/>}
            </div>
            <X className='clickable no-select' color={colorWhite} size={22} onClick={onDismiss}/>
        </div>
    )
}

export default TopAlert
