import { createContext, useState } from 'react';

const initialContext = {
    profile: {
        accessToken: null,
        handle: null,
        profileId: null,
        ipfs: null
    },
    setProfile: () => { }
};

export const MainContext = createContext(initialContext);

export const MainContextProvider = ({ children }) => {
    const [profile, setProfile] = useState({
        accessToken: null,
        handle: null,
        profileId: null,
        ipfs: null
    });

    return (
        <MainContext.Provider value={{ profile, setProfile }} >
            {children}
        </MainContext.Provider>
    );
};