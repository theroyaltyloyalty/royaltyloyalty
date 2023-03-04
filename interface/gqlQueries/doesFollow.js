export const doesFollow = (address, id) => `
  query doesFollow {
    doesFollow(request: { 
                  followInfos: [
                    {
                      followerAddress: "${address}",
                      profileId: "${id}"
                    }
                  ] 
               }) {
      followerAddress
      profileId
      follows
    }
  }
`;