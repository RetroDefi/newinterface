import React from 'react'
import './Portfolio.scss'

import PortfolioChart from './components/PortfolioChart'


const Portfolio: React.FC = () => {
    return (
        <div className='portfolio-graph-wrapper'>
            <PortfolioChart/>
        </div>
    )
}

export default Portfolio
