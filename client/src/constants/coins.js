import BUSD_ABI from './abis/busd.json';
import USDC_ABI from './abis/usdc.json';
import USDT_ABI from './abis/usdt.json';

export default {
    BUSD: {
        abi: BUSD_ABI,
        address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
    },
    USDC: {
        abi: USDC_ABI,
        address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
    },
    USDT: {
        abi: USDT_ABI,
        address: '0x55d398326f99059fF775485246999027B3197955'
    }
}