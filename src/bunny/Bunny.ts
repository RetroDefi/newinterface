import { Web3Provider } from '@ethersproject/providers'
import { BunnyContracts as Contracts } from './BunnyContracts'


export interface BunnyOptions {
    defaultAccount: string | null
}

export default class Bunny {
    readonly contracts: Contracts
    readonly account: string
    
    constructor(account: string, library: any, polygon: Web3Provider) {
        this.contracts = new Contracts(library, polygon)
        this.account = account
    }
    
    async estimateTxGas(execution: Promise<any>, gasMin: number = 0): Promise<{ gasLimit: string; }> {
        const gasOptions: { gasLimit: string; } = {
            gasLimit: null
        }
        
        try {
            const estimatedGas = await execution
            const bufferedGas = parseInt(estimatedGas.mul(170).div(100).toString())
            const normalizedGas = parseInt(((gasMin || 0) * 110 / 100).toString())
            gasOptions.gasLimit = Math.max(bufferedGas, normalizedGas).toString()
        } catch (ex) {
            gasOptions.gasLimit = '8000000'
        }
        return gasOptions
    }
}
