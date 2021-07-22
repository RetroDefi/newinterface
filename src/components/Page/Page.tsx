import React from 'react'
import Footer from './components/Footer'
import './Page.scss'


const Page: React.FC = ({ children }) => {
    return (
        <div>
            <div className='page'>{children}</div>
            <div className='page-footer'>
                <Footer/>
            </div>
        </div>
    )
}

export default Page
