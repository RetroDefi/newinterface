import React from 'react'


interface WalletProviderCardProps {
    icon: any
    onConnect: () => void
    title: string
}

const WalletProviderCard: React.FC<WalletProviderCardProps> = ({ icon, onConnect, title }) => (
    <div className='wallet-provider-card clickable no-select' onClick={onConnect}>
        <div className='wallet-logo'>
            <img src={icon} alt={title}/>
        </div>
        {title}
    </div>
)

export default WalletProviderCard
