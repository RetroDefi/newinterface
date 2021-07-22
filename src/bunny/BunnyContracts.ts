import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'

import ERC20Abi from './lib/abi/ERC20.json'
import PriceCalculatorAbi from './lib/abi/PriceCalculator.json'
import RocketAbi from './lib/abi/RocketBunny.json'
import IStrategyAbi from './lib/abi/IStrategy.json'
import DashboardAbi from './lib/abi/Dashboard.json'
import ZapAbi from './lib/abi/Zap.json'
import WMATICAbi from './lib/abi/WMATIC.json'
import RouterAbi from './lib/abi/PancakeRouterV2.json'

import { DashboardAddress, PriceCalculatorAddress, QuickRouter, RocketBunnyAddress, Routers, WMATIC, Zaps } from './lib/constants'
import { EMPTY_ADDRESS } from './utils'
import { Swap } from './lib/types'


export class BunnyContracts {
    readonly library: Web3Provider
    readonly polygon: Web3Provider

    private readonly priceCalculator: Contract
    private readonly strategy: Contract
    private readonly dashboard: Contract

    private readonly wmatic: Contract
    private readonly router: Contract
    
    constructor(library: Web3Provider, polygon: Web3Provider) {
        this.library = library
        this.polygon = polygon
        
        this.priceCalculator = new Contract(PriceCalculatorAddress, PriceCalculatorAbi, polygon)
        this.strategy = new Contract(EMPTY_ADDRESS, IStrategyAbi, library.getSigner())
        this.dashboard = new Contract(DashboardAddress, DashboardAbi, this.polygon)

        this.wmatic = new Contract(WMATIC, WMATICAbi, library.getSigner())
        this.router = new Contract(QuickRouter, RouterAbi, library.getSigner())
    }
    
    /**
     * Common
     * */
    getTokenContract(address: string): Contract {
        return new Contract(address, ERC20Abi, this.library.getSigner())
    }
    
    getRocketBunny(): Contract {
        return new Contract(RocketBunnyAddress, RocketAbi, this.library.getSigner())
    }
    
    getTokenReadOnlyContract(address: string): Contract {
        return new Contract(address, ERC20Abi, this.polygon)
    }

    getBunnyZap(swap: Swap): Contract {
        return new Contract(Zaps[swap], ZapAbi, this.library.getSigner())
    }

    getWMATICContract(): Contract {
        return this.wmatic
    }

    /**
     * ReadOnly
     * */
    
    getPriceCalculator(): Contract {
        return this.priceCalculator
    }
    
    getRocketBunnyReadOnly(): Contract {
        return new Contract(RocketBunnyAddress, RocketAbi, this.polygon)
    }
    
    getDashboardContract(): Contract {
        return this.dashboard
    }

    getRouterV2Contract(): Contract {
        return this.router
    }

    getRouterV2ContractReadOnly(swap: Swap): Contract {
        return new Contract(Routers[swap], RouterAbi, this.polygon)
    }
    
    /**
     * Writable
     * */

    getStrategyContract(address: string): Contract {
        return this.strategy.attach(address)
    }
    
}
