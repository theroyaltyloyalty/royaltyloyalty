import { Container } from '@chakra-ui/react';
import { Account } from '../components';

export function Header() {
    return (
        <Container
            display='flex'
            justifyContent='space-between'
            marginTop='16px'
            minWidth='70vw'
            padding='0 16px'
        >
            <Account />
        </Container>
    );
}