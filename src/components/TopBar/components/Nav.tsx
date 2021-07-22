import React from 'react'
import { NavLink } from 'react-router-dom'


const Nav: React.FC = () => {
    return (
        <div className='topbar-nav no-select'>
            <NavLink className='item clickable' activeClassName='active' to='/pool'>Pool</NavLink>
            <NavLink className='item clickable' activeClassName='active' to='/zap'>Zap</NavLink>
            {/*<a className='item clickable' href='https://vote.pancakebunny.finance' target='_blank' rel='noopener noreferrer'>Vote</a>*/}
            {/*<a className='item clickable' href='https://docs.pancakebunny.finance' target='_blank' rel='noopener noreferrer'>Wiki</a>*/}
        </div>
    )
}

export default Nav
