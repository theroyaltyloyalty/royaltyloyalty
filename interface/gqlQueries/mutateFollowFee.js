/**
 * As you see above we have mapped the currency we want to be paid in alongside 
 * the value which should be passed in as the normal amount not shifted to the 
 * decimal places as our server does this for you. So if you want 1 WETH you 
 * would enter 1 as a value. The final property defined is the recipient you 
 * want the funds to go to.
 * 
 * @see{https://docs.lens.xyz/docs/create-set-follow-module-typed-data}
 */
export const mutateFollowFee = (profileId, currency, value, recipient) => `
mutation CreateSetFollowModuleTypedData {
  createSetFollowModuleTypedData(request:{
    profileId: "${profileId}",
    followModule: {
        feeFollowModule: {
            amount: {
               currency: "${currency}",
               value: "${value}"
            },
            recipient: "${recipient}"
        }
     }
  }) {
    id
    expiresAt
    typedData {
      types {
        SetFollowModuleWithSig {
          name
          type
        }
      }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        followModule
        followModuleInitData
      }
    }
  }
}
`;