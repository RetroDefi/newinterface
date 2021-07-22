import React from 'react'
import { Menu } from 'react-feather'
import AccountButton from '../AccountButton/AccountButton'
import Nav from './components/Nav'
import Container from '../Container'
import Logo from '../Logo'
import BunnyPrice from '../BunnyPrice/BunnyPrice'
import { colorWhite } from '../../colors'
import './TopBar.scss'


interface TopBarProps {
    onPresentMobileMenu: () => void
}

const TopBar: React.FC<TopBarProps> = ({ onPresentMobileMenu }) => {
    return (
        <div>
            <Container size="lg">
                <div className='topbar'>
                    <div className='logo-wrapper'>
                        <Logo/>
                    </div>
                    
                    <div className='nav-wrapper'>
                        <Nav/>
                    </div>
                    
                    <div className='account-wrapper'>
                        <BunnyPrice/>
                        <AccountButton/>
                    </div>
                    
                    <div className='menu-wrapper' onClick={onPresentMobileMenu}>
                        <Menu size={36} color={colorWhite}/>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default TopBar
