export const revertFollowModule = (profileId) => `
mutation CreateSetFollowModuleTypedData {
  createSetFollowModuleTypedData(request:{
    profileId: "${profileId}",
    followModule: {
        revertFollowModule: true
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