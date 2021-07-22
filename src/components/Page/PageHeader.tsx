import React from 'react'
import Container from '../Container'


interface PageHeaderProps {
    icon?: string
    title?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({
    children,
    icon,
    title
}) => {
    return (
        <Container size='md'>
            <div className='page-header no-select'>
                {icon && <img className='icon' src={icon} alt={title}/>}
                {title && <span className='title'>{title}</span>}
                {children && (
                    <div className='subtitle'>
                        {children}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default PageHeader
