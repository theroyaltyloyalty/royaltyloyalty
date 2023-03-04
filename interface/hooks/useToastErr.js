import { useToast } from '@chakra-ui/react';

export function useToastErr() {
    const toast = useToast();

    // This service can be used only with err
    const toastErr = (err, tries, setFetched) => {
        if (tries) {
            tries < 3
                ? setFetched({ fetched: false, tries: tries + 1 })
                : setFetched({ fetched: true, tries: 0 });
        }

        toast({
            title: err.message ? err.message : JSON.stringify(err),
            status: 'error',
            isClosable: true,
            duration: 15000
        });
    };

    return toastErr;
}