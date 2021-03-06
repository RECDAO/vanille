import { autoinject } from "aurelia-framework";
import { Web3Service, BigNumber } from "./Web3Service";
import { ArcService, TruffleContract, Address } from './ArcService';
import { DaoService } from "./DaoService";

@autoinject
export class TokenService {

  constructor(
    private web3: Web3Service
    , private arcService: ArcService
    , private daoService: DaoService
  ) { }

  public async getTokenSymbol(token: TruffleContract): Promise<string> {
    return await token.symbol();
  }

  public async getTokenName(token: TruffleContract): Promise<string> {
    return await token.name();
  }

  /**
   * in Wei by default
   * @param token 
   */
  public async getUserTokenBalance(token: TruffleContract, inEth: boolean = false): Promise<BigNumber> {
    let userAddress = this.web3.defaultAccount;
    return this.getTokenBalance(token, userAddress, inEth);
  }

  public async getTokenBalance(
    token: TruffleContract,
    address: Address,
    inEth: boolean = false): Promise<BigNumber> {

    let amount = await token.balanceOf(address);
    if (inEth) {
      amount = this.web3.fromWei(amount);
    }
    return amount;
  }

  public async getDAOstackNativeToken(): Promise<TruffleContract> {
    const daoStack = await this.daoService.GetDaostack();
    return this.getTokenFromAddress(daoStack.token.address);
  }

  public getGlobalGenToken(): Promise<TruffleContract | undefined> {
    try {
      return this.getTokenFromAddress("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf");
    } catch {
      // then we don't know the address of the GEN token
      return Promise.resolve(undefined);
    }
  }

  public getTokenFromAddress(address: Address): Promise<TruffleContract> {
    return this.arcService.getContract("DAOToken", address);
  }
}
