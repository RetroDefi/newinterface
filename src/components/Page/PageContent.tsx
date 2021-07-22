import React from 'react'
import Container from '../Container'


const PageContent: React.FC = ({ children }) => {
    return (
        <div className='page-content'>
            <Container size="pg">
                {children}
            </Container>
        </div>
    )
}

export default PageContent
